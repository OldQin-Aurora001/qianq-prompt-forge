/* relevance_gate.js —— 相关性打分（Relevance Gate）核心模块
 * 给每个标签打相关性分数（0/1/2/3），低于阈值的自动过滤，治LLM脑补无关词。
 *
 * 借鉴来源：Img-Tagbooru _score_tag_relevance（description_tagger.py L974）
 * 设计文档：_团队工作台\相关性打分方案设计_豆总.md（v1.1，已根据牛总评审修复P0/P1）
 *
 * 4级打分规则：
 *   3分 = 直接命中（标签出现在用户描述关键词里，或结构白名单）
 *   2分 = 概念/行为扩展命中（标签属于被触发的概念扩展或行为扩展）
 *   1分 = 通用标签池（质量词/光影词/构图词/通用人物词/通用场景词）
 *   0分 = 无支持（LLM脑补的无关词，自动过滤）
 *
 * 阈值过滤：
 *   正经模式（SFW）：≥2分（严格）
 *   露骨模式（NSFW）：≥1分（宽松）
 *
 * P0修复（牛总评审）：
 *   P0-1：结构白名单旁路（人数词/质量词/风格词不打分直接保留，防掉人/崩画质）
 *   P0-2：中文否定句检测（不要/别/没有+名词→0分拦截）
 *
 * P1优化（牛总评审）：
 *   P1-1：KEYWORD_MAP程序化生成（从词库.js提取zh→en，手工只补纯口语别名）
 *   P1-2：并集触发（用户描述触发 + LLM标签触发，只要一个命中就触发概念扩展）
 *
 * 独立纯函数（node/浏览器双导出），不依赖 HTML / Ollama API，用 mock 数据测。
 */
(function (global) {
  "use strict";

  /* ========== 工具函数 ========== */
  function normKey(s) { return String(s == null ? "" : s).toLowerCase().replace(/[\s_-]+/g, "_"); }

  /* 刀2b：场景性别上下文（html 打分前 set；pp 闸A/行为扩展/互斥经此回退）*/
  var sceneCtx = { pairing: null };
  // P0修复（牛总端到端测试发现）：normTag加下划线归一，跟normKey保持一致
  // 之前black hair（空格形）vs black_hair（下划线形）对不上，3分直击链路整体断裂
  function normTag(s) { return String(s == null ? "" : s).toLowerCase().trim().replace(/[\s_-]+/g, "_"); }

  // v2.1 序8工艺修复（牛总审核发现）：多说法zh是0分雷——gate的3分直击拿整串zh去描述里找，不拆竖线
  // 实测："黑色鞋子|黑鞋" 这种竖线串，用户只说"黑鞋"时0分丢。表里存量有2900个竖线zh。
  // 修法：拆分zh逐段indexOf，改一行 > 迁移2900词，存量雷全排掉。
  function matchZhSegments(desc, zh) {
    if (!zh) return false;
    var segments = String(zh).split(/[|｜]/); // 支持中英文竖线
    for (var i = 0; i < segments.length; i++) {
      var seg = segments[i].trim();
      if (seg && desc.indexOf(seg) >= 0) return true;
    }
    return false;
  }

  /* ========== 复数词形归一（大阿总任务2，牛总提的小尾巴） ==========
   * LLM 可能输出复数(leaves/tails/fangs/teeth)，词表存的是单数。查表时补查一次"单数别名"。
   * 也可能输出单数(foot/wave/leg等)，词表存的是复数。查表时补查一次"复数别名"。
   * 经 8.7万表实测, 分两类：
   * 1) 复数→单数（大阿原4条）：LLM输出复数，词表只存单数，用单数拿zh/命中
   * 2) 单数→复数（豆总补全26条）：LLM输出单数，词表只存复数，用复数拿zh/命中
   * 故意【不做】通用"去尾s": 会误伤 glasses/pants 这类"本身即复数"的词(牛总提醒的坑)。
   */
  var PLURAL_MAP = {
    // ===== 复数→单数（大阿原4条）=====
    leaves: "leaf",
    tails: "tail",
    fangs: "fang",
    teeth: "tooth",
    // ===== 单数→复数（豆总补全26条，经8.7万表验证：单数不在表，复数在表）=====
    foot: "feet",
    wave: "waves",
    leg: "legs",
    thigh: "thighs",
    knee: "knees",
    calf: "calves",
    toe: "toes",
    palm: "palms",
    breast: "breasts",
    nipple: "nipples",
    lip: "lips",
    horn: "horns",
    wing: "wings",
    shoe: "shoes",
    boot: "boots",
    glove: "gloves",
    sock: "socks",
    thighhigh: "thighhighs",
    earring: "earrings",
    grape: "grapes",
    noodle: "noodles",
    person: "people",
    dish: "dishes",
    bacterium: "bacteria",
    fungus: "fungi",
    gum: "gums"
  };
  function singularAliasOf(norm) { return PLURAL_MAP[norm] || ""; }

  // v2.1 序8工艺修复（牛总审核发现）：no_类词悖论——用户说"她没穿内裤"，明明想要no_panties，
  // 但否定检测"没穿"先跑，0分拦掉。87023表里no_类15个+unworn_类18个全中招。
  // 修法：33词豁免白名单，这些词语义本身就是"否定"，不被否定检测误杀。
  var NO_NEGATION_EXEMPT = {
    // no_类15个
    no_panties: 1, no_bra: 1, no_clothes: 1, no_shoes: 1, no_socks: 1,
    no_hat: 1, no_glasses: 1, no_gloves: 1, no_jewelry: 1, no_makeup: 1,
    no_tattoo: 1, no_accessories: 1, no_underwear: 1, no_bikini: 1, no_swimsuit: 1,
    // unworn_类18个
    unworn_panties: 1, unworn_bra: 1, unworn_clothes: 1, unworn_shoes: 1, unworn_socks: 1,
    unworn_hat: 1, unworn_glasses: 1, unworn_gloves: 1, unworn_jewelry: 1, unworn_makeup: 1,
    unworn_tattoo: 1, unworn_accessories: 1, unworn_underwear: 1, unworn_bikini: 1, unworn_swimsuit: 1,
    unworn_shirt: 1, unworn_skirt: 1, unworn_dress: 1, unworn_jacket: 1,
    // v2.1 序8收尾（小阿总验收发现）：白名单外no_/unworn_低热词19条，
    // 本着"早早发现早修改，不给后面留尾巴"原则，全部豁免。
    unworn_boots: 1, no_halo: 1, unworn_bikini_top: 1, unworn_sandals: 1,
    unworn_coat: 1, unworn_necktie: 1, unworn_bikini_bottom: 1, unworn_cape: 1,
    unworn_scarf: 1, unworn_eyepatch: 1, unworn_pants: 1, unworn_necklace: 1,
    unworn_bowtie: 1, unworn_slippers: 1, no_cape: 1, unworn_kimono: 1,
    unworn_pantyhose: 1, unworn_armor: 1, unworn_vest: 1
  };

  // v2.1 序8工艺修复（小阿总v4验收发现）：否定检测子串误杀——
  // 这些词的zh口语全对，但含"不/无/别/没穿"被否定层拦0分（如"不对称裙"的"不"、"别人"的"别"）。
  // 修法：误杀词豁免白名单，与NO_NEGATION_EXEMPT同机制，这些词跳过否定检测。
  var NEGATION_FALSE_POSITIVE_EXEMPT = {
    holding_unworn_clothes: 1,      // 拿着没穿的衣服（26895，热度最高）
    "lifting_another's_clothes": 1, // 掀别人衣服（"别人"的"别"触发）
    "pulling_another's_clothes": 1, // 拉别人衣服
    "strapless_one-piece_swimsuit": 1, // 无肩带连体泳衣（"无"触发）
    "grabbing_another's_face": 1,   // 抓别人脸
    asymmetrical_dress: 1,           // 不对称裙（"不"触发）
    "under_another's_clothes": 1,    // 在别人衣服下面
    mismatched_socks: 1,             // 不对称袜子
    futa_without_pussy: 1,           // 扶他没有女性器官（"没有"触发，T2验收发现）
    handsfree_paizuri: 1             // 无手乳交|不用手乳交（"无/不用"触发，T2验收发现）
  };

  /* ========== P0-1：结构白名单（不打分直接保留，防掉人/崩画质） ==========
   * v2.0更新：合并大阿总结构白名单清单（54项），union去重
   * 新增：Pony评分负向(score_4~score_8)、8k_wallpaper、detailed_eyes/skin、glossy_skin、
   *       extremely_detailed、highly_detailed_face、ultra_hd、highres
   * 光影词5个(cinematic_lighting等)按口径拆到光影池(1分)，不入白名单
   */
  var STRUCTURE_WHITELIST = new Set([
    // 人数词（公式引擎骨架，动了掉人）
    "1girl", "1boy", "2girls", "2boys", "1girl1boy", "solo", "duo",
    "multiple_girls", "multiple_boys", "3girls", "3boys", "4girls", "4boys",
    // 大阿总V1遗留问题测试建议：裸计数词也塞进白名单，零成本防未来LLM直接吐裸计数
    "two_people", "three_people", "four_people", "five_people",
    // 质量词（动了崩画质）
    "masterpiece", "best_quality", "high_quality", "ultra_detailed", "8k", "hdr",
    "absurdres", "sharp_focus", "intricate_details", "highly_detailed",
    "8k_wallpaper", "detailed_eyes", "detailed_skin", "extremely_detailed",
    "glossy_skin", "highly_detailed_face", "highres", "ultra_hd",
    // Pony评分（正向）
    "score_9", "score_8_up", "score_7_up", "score_6_up", "score_5_up", "score_4_up",
    // Pony评分（负向，大阿总新增）
    "score_4", "score_5", "score_6", "score_7", "score_8",
    // 评级词
    "rating:safe", "rating:questionable", "rating:explicit", "rating:general", "rating:sensitive",
    // 风格基础词（动了风格崩）
    "anime_style", "realistic", "photorealistic", "semi-realistic", "2.5d", "3d_render", "painterly"
  ]);

  /* ========== 红线级：标签级红线黑名单（第四道闸，无论字段/分数/模式，命中即过滤） ==========
   * 牛总端到端测试发现：LLM会在persona字段输出loli/child，三道现有保险全被绕过
   * （UI锁/引擎锁/映射锁只查gender字段，不查persona字段），所以加这第四道闸。
   * 命中即过滤+记日志，不打分，不进valid/warning，直接进filtered标记red_line。
   */
  var RED_LINE_BLACKLIST = new Set([
    // 未成年系（红线永拒，牛总建议补词：kid/teen是未成年模糊暗示；小阿总挖出真漏网：child_abuse/child_carry；牛总终验补复数形：kids/young_girls）
    "loli", "shota", "child", "toddler", "baby", "infant", "underage", "little_girl", "little_boy",
    "kid", "kids", "teen", "teenager", "young_girl", "young_girls", "young_boy", "elementary_school_student", "middle_school_student",
    // 外援6条·条6（09-18）：未成年复数/变体显式补词（纪律：禁"自动去尾s"泛化，防误伤 assault_rifle/teen_titans/kid_icarus 等）
    "babies", "toddlers", "infants", "teenagers", "lolis", "shotas", "little_girls", "little_boys", "young_boys",
    "child_abuse", "child_carry",
    // 非自愿系（红线永拒，不干电车之狼的活）
    "rape", "forced", "forcing", "nonconsensual", "non_consensual", "assault", "sexual_assault",
    // 乱伦系（红线永拒）
    "incest", "mother_son", "father_daughter", "brother_sister", "sibling_incest",
    // 偷窥系（红线永拒，非自愿；voyeurism 无分隔符、部件匹配拦不住，整词显式收）
    "voyeur", "voyeurism", "peeping_tom",
    // 猎奇重口味系（红线永拒）+ golden_shower（T13-S8 黄金浴永拒·老秦 09-17 拍板）
    "guro", "vore", "necrophilia", "scat", "watersports", "urination", "bestiality", "zoophilia", "golden_shower",
    // 自伤自杀系（红线永拒）
    "suicide", "self_harm", "self_injury", "cutting",
    // 毒品系（红线永拒）
    "drug", "drugs", "drug_use", "drug_abuse",
    // 极端暴力系（红线永拒）
    "gore", "extreme_violence", "mutilation", "torture"
  ]);

  /* ========== 红线黑名单分级匹配（牛总B方案，解决部件匹配误杀183词问题） ==========
   * 牛总审计发现：原部件匹配把kid/teen/child等词在任何复合词里都拦，误杀183个真实标签
   * （assault_rifle步枪/teen_titans IP/kid_icarus游戏/cutting_board砧板/baby_bottle奶瓶等）
   * B方案分级匹配：
   *   1. 无歧义危险词（rape/incest/guro/bestiality…）保留部件匹配
   *   2. 有IP歧义的（kid/teen/child/baby/cutting/assault/shota…）降级为整词匹配
   *   3. 小例外表：child_porn/child_abuse/child_carry这类显式收的，即使是歧义词组成也要拦
   */
  // 无歧义危险词（保留部件匹配）——这些词在任何复合词里出现都该拦
  // 注意：futanari（扶他）和tentacles（触手）是本产品合法核心性别/题材词，不在任何黑名单层
  var RED_LINE_SUBSTRING = new Set([
    "rape", "incest", "guro", "bestiality", "voyeur",
    "scat", "watersports", "urination", "necrophilia", "vore",
    "extreme_violence", "mutilation", "torture",
    "drug", "drugs", "drug_use", "drug_abuse",
    "forced", "forcing", "nonconsensual", "non_consensual",
    // 毒品具名物（牛总盘点 2026-09-11：无歧义，部件匹配即拦）
    "cannabis", "marijuana", "opium", "bong", "narcotic",
    // 毒品具名物·扩充（老秦拍板 2026-09-12：无第二义的成瘾性药物一律卡死）
    // 依据见 毒品词补锁_待定清单_阿紫.md；实测：这 17 个做部件匹配对词库 2833 个标签零误伤
    "heroin", "cocaine", "methamphetamine", "amphetamine", "fentanyl", "morphine",
    "codeine", "opiate", "opioid", "ketamine", "lsd", "mdma", "hashish", "meth",
    "narcotics", "ecstasy", "overdose"
  ]);
  // 有IP歧义的词（降级为整词匹配，不做部件匹配）——这些词单独出现该拦，但复合词里可能是IP/名字/物品
  var RED_LINE_EXACT_ONLY = new Set([
    "loli", "shota", "child", "toddler", "baby", "infant", "underage",
    "little_girl", "little_boy", "kid", "teen", "teenager",
    "young_girl", "young_boy", "elementary_school_student", "middle_school_student",
    "cutting", "assault"
  ]);
  // 小例外表：即使是歧义词组成的复合词，这些显式收的也要拦
  // 牛总终验补：oppai_loli/onee-shota/onii-shota等"成年×未成年"组合词，踩未成年暗示红线
  // 注意：进EXPLICIT_COMPOUND层（不能进SUBSTRING，否则loli_(touhou)这类IP词又要误杀）
  var RED_LINE_EXPLICIT_COMPOUND = new Set([
    "child_porn", "child_abuse", "child_carry", "child_sex",
    "baby_porn", "kid_porn", "teen_porn",
    "loli_porn", "shota_porn",
    // 外援6条·条6（09-18）：genders 层"男童/女童"en 复合词（shota/loli 是 EXACT_ONLY 歧义词、只整词匹配，复合形漏网 → 进显式复合表）
    "shota_boy", "loli_girl",
    "cutting_self", "self_harm", "self_injury",
    // 牛总终验补：成年×未成年组合词（踩未成年暗示红线）
    "oppai_loli", "onee-shota", "onii-shota", "onee_loli", "shotacon", "lolicon"
  ]);

  /* ========== 毒品变体词形封禁 + IP角色豁免（大阿总，2026-09-11） ========== */
  // poppy 部件匹配：poppy_(flower)/poppy_2/poppy_flower 等变体全拦
  // 但 Poppy Playtime / Pokémon Poppy 等 IP 角色名走白名单豁免，不错杀
  var RED_LINE_DRUG_VARIANTS = new Set([
    "poppy"
  ]);
  // Poppy IP角色白名单豁免（游戏/动漫人物，跟毒品无关）
  var DRUG_IP_EXEMPT = new Set([
    "poppy_playtime", "poppy_(pokemon)", "poppy_(league_of_legends)",
    "poppy_bros_jr", "star_guardian_poppy", "poppy_(animal_crossing)", "poppy_girl_(surio)"
  ]);

  // 检查标签是否命中红线黑名单（分级匹配：无歧义词部件匹配 + 歧义词整词匹配 + 显式复合词）
  // 未成年系·露骨模式限定（大阿总 2026-09-12，豆总裁定补红线）：
  // 裸词 student 在露骨语境下 = 模糊年龄暗示，跟 kid/teen 同口径贴红线（verdict 裁定安全缺口）；
  // 但正经模式 student 是合法题材词（校园题材等），不拦 → 只拦 NSFW，不进全局五表（避免误杀正经校园场景）。
  var RED_LINE_NSFw_ONLY = new Set([
    // 外援6条·条6（09-18）：1 词扩 10 词（students/school_student 系 + 女高中生系 + jk）；正经档放行校园题材，JK 打分映射不动
    // gate 小补刀（09-18）：+4 变体（highschooler/highschool_girl/highschool_student/schoolgirl，露骨挡正经放，与 jk 同级；整词匹配不去尾s）
    "student", "students", "school_student", "school_students",
    "high_school_student", "high_school_girl", "high_school_boy",
    "high_school_girls", "high_school_boys",
    "highschooler", "highschool_girl", "highschool_student", "schoolgirl",
    "jk"
  ]);

  // T16 被动语态词形拦截（大阿总 2026-09-13）：
  // danbooru 8.7万表确认 receiving_ 前缀合法词数=0（全为 LLM 自造变体），
  // 词库 L96 被口交 en=receiving oral sex from 有 nsfwEn 主动化覆盖，管道零词形检测是根因（M1 遗留）。
  // 不碰 _by_/getting_/being_：danbooru 表 surrounded_by_hands/lifted_by_tail/dead_by_daylight 等合法词误伤风险。
  var PASSIVE_PREFIXES = ["receiving_"];

  function isRedLine(tag, mode) {
    var norm = normKey(tag);
    var normAlt = norm.indexOf('-')>=0 ? norm.replace(/-/g,'_') : norm.indexOf('_')>=0 ? norm.replace(/_/g,'-') : norm;
    // 1. 精确匹配：整个标签在黑名单里（整词匹配，覆盖所有词）
    if (RED_LINE_BLACKLIST.has(norm) || RED_LINE_BLACKLIST.has(normAlt)) return true;
    // 2. 显式复合词：即使是歧义词组成的，这些也要拦
    if (RED_LINE_EXPLICIT_COMPOUND.has(norm) || RED_LINE_EXPLICIT_COMPOUND.has(normAlt)) return true;
    // 3. 无歧义危险词的部件匹配：这些词在任何复合词里出现都该拦
    var parts = norm.split(/[_\s-]/);
    for (var i = 0; i < parts.length; i++) {
      if (RED_LINE_SUBSTRING.has(parts[i])) return true;
    }
    // 4. 有IP歧义词只做整词匹配（上面RED_LINE_BLACKLIST.has已经覆盖了），复合词不拦
    //    比如 assault_rifle（步枪）、teen_titans（IP）、kid_icarus（游戏）、cutting_board（砧板）都不拦
    // 5. 毒品变体部件匹配（poppy类，带IP豁免）
    //    poppy_playtime/poppy_(pokemon) 等IP角色名在 DRUG_IP_EXEMPT 里，不拦
    if (!DRUG_IP_EXEMPT.has(norm) && !DRUG_IP_EXEMPT.has(normAlt)) {
      var dParts = norm.split(/[_\s-]/);
      for (var di = 0; di < dParts.length; di++) {
        if (RED_LINE_DRUG_VARIANTS.has(dParts[di])) return true;
      }
    }
    // 6. 露骨模式限定表（大阿总 2026-09-12）：student 裸词只在 NSFW 贴红线；正经模式合法不拦
    if (mode === "nsfw" && (RED_LINE_NSFw_ONLY.has(norm) || RED_LINE_NSFw_ONLY.has(normAlt))) return true;
    return false;
  }

  /* ========== P0-2：中文否定句检测 ========== */
  var NEGATION_WORDS = ["不要", "别", "没有", "无", "非", "不", "别要", "不用", "不需要", "别给", "别加",
    "没穿", "别弄", "别碰", "禁止", "避免", "不许"];

  /* ========== P0-2增强：否定词同义别名表（小阿总，豆总任务1） ==========
   * 问题：8.7万表zh是标准词形（saliva="唾液"），用户口语否定（"不要口水"）对不上 → 拦不住
   * 方案：否定词提取后，同义别名表扩展（口语词→标准zh+英文标签形），打分/补全层的否定匹配自然生效
   * 原则：宁可多拦不可漏（否定=用户明确不要），值只放"用户说了口语词时确实也想要挡住"的同义/下位词
   */
  var NEGATION_ALIAS_MAP = {
    // 体液/口腔
    "口水": ["唾液", "saliva", "流口水", "drooling", "slobbering"],
    "唾液": ["口水", "saliva", "流口水", "drooling", "slobbering"],
    "舌头": ["tongue", "tongue_out", "伸出舌头", "舔", "licking"],
    "舌": ["tongue", "tongue_out", "伸出舌头", "舔", "licking"],
    "舔": ["tongue", "tongue_out", "伸出舌头", "licking"],
    "精液": ["cum", "semen", "射精", "ejaculate"],
    "精": ["cum", "semen", "射精", "ejaculate"],
    // 身体状态
    "血": ["blood", "血迹", "bloodstain", "流血"],
    "汗": ["sweat", "汗珠", "sweat_drops", "sweating"],
    "泪": ["眼泪", "tears", "crying", "哭"],
    "眼泪": ["泪", "tears", "crying", "哭"],
    "哭": ["crying", "tears", "哭泣"],
    "笑": ["smile", "laughing", "笑容"],
    "伤": ["伤口", "伤疤", "scar", "scars", "bruise"],
    "纹身": ["tattoo", "tattoos"],
    "疤": ["scar", "scars", "伤疤"],
    "胡": ["胡子", "胡须", "beard", "mustache"],
    "胡须": ["胡子", "beard", "mustache"],
    // 服饰配饰
    "内衣": ["lingerie", "bra", "胸罩", "内裤", "panties"],
    "内裤": ["lingerie", "panties"],
    "帽子": ["hat", "cap", "贝雷帽", "beret"],
    "眼镜": ["glasses", "sunglasses", "墨镜", "护目镜"],
    "项链": ["necklace", "吊坠", "locket"],
    "耳环": ["earrings", "earring", "耳钉"],
    "裙子": ["skirt", "连衣裙", "dress"],
    "连衣裙": ["dress", "skirt", "裙子"],
    "鞋": ["shoes", "靴子", "boots", "凉鞋", "sneakers", "sandals"],
    "手表": ["watch"],
    "蝴蝶结": ["ribbon", "hair_ribbon"],
    "翅膀": ["wings"],
    // 物品/场景
    "酒": ["alcohol", "beer", "wine", "liquor"],
    "烟": ["cigarette", "cigarettes", "香烟"],
    "花": ["flower", "flowers", "花束"],
    "伞": ["umbrella"],
    "猫": ["cat", "猫娘", "catgirl"],
    "狗": ["dog", "狗娘"],
    "手机": ["smartphone", "phone"],
    "书": ["book", "books"],
    "衣服": ["clothes", "clothing", "服装"]
  };

  /**
   * 检测用户描述里的否定词，返回被否定的关键词列表
   * @param {string} userDescription - 用户原始描述（中文）
   * @returns {Array<string>} 被否定的关键词列表
   */
  function detectNegations(userDescription) {
    var negatedKeywords = [];
    var desc = String(userDescription || "");
    // P0-2修复（小阿总发现）：否定范围遇标点截断，只否定同小句内的词
    // 原问题：「不要女上位，传教士」里逗号后的"传教士"被15字滑动窗口连带否定
    // 修复：从否定词后面开始，遇到标点（，。！？；：、）就截断，只取同小句内的词
    var PUNCTUATION = /[，。！？；：、,\.!?;:]/;
    NEGATION_WORDS.forEach(function (neg) {
      var idx = desc.indexOf(neg);
      while (idx >= 0) {
        // 从否定词后面开始，找第一个标点的位置
        var start = idx + neg.length;
        var end = start;
        while (end < desc.length && !PUNCTUATION.test(desc[end])) {
          end++;
        }
        // 取同小句内的文字（最多15个字符，避免太长）
        var clauseLen = Math.min(end - start, 15);
        var afterNeg = desc.substring(start, start + clauseLen);
        // 去掉助词等，取前几个词（1-6个字）
        var keywords = afterNeg.split(/[\s的了着过呢啊呀哦]/).filter(function (w) {
          return w.length >= 1 && w.length <= 6;
        });
        keywords.forEach(function (kw) {
          if (negatedKeywords.indexOf(kw) < 0) negatedKeywords.push(kw);
          // P1-2修复（小阿总审查发现）：中文否定片段不切子词，"不要海边散步"只否定"海边散步"，不否定"海边"
          // 2026-10-16 刀⑤甲：前缀切词已删，否定集只收整词，防全局越界
        });
        idx = desc.indexOf(neg, idx + neg.length);
      }
    });

    // P0-2增强：同义别名扩展（口语否定词→标准词形，"不要口水"→连"唾液/saliva/流口水"一起拦）
    // 精确匹配键（不做大词吃小词，防"泪"误扩到无关词）；表内近似对称，单轮展开即可
    Object.keys(NEGATION_ALIAS_MAP).forEach(function (alias) {
      if (negatedKeywords.indexOf(alias) >= 0) {
        (NEGATION_ALIAS_MAP[alias] || []).forEach(function (v) {
          if (negatedKeywords.indexOf(v) < 0) negatedKeywords.push(v);
        });
      }
    });

    return negatedKeywords;
  }

  /* ========== 通用标签池（1分，大阿总107词 + 牛总扩容包107词 = 214词，全部验证存在于8.7万核心表） ==========
   * v2.0更新：合并牛总通用池扩容包（120词，去重13词，新增107词）
   * 解决老秦发现的"亚洲黄、眼睛颜色、白T恤被滤掉"问题——这些是"合理脑补"不是"无关脑补"
   */
  var COMMON_TAG_POOL = new Set([
    // 质量词（7个，Danbooru表天然薄，SD/Pony质量词走结构白名单）
    "highres", "absurdres", "realistic", "incredibly_absurdres", "photorealistic", "quality", "clean",
    // 光影词（26个，大阿总新增5个：cinematic_lighting/global_illumination/god_rays/rim_light/volumetric_lighting）
    "glowing", "moon", "fire", "light_particles", "glowing_eyes", "shade", "drop_shadow",
    "blue_fire", "see-through_silhouette", "neon_trim", "ceiling_light", "light_trail", "light_bulb",
    "high_contrast", "torch", "flashlight", "flash", "candlelight", "soft_focus", "neon_sign", "fire_light",
    "cinematic_lighting", "global_illumination", "god_rays", "rim_light", "volumetric_lighting",
    // 构图/景别词（21个）
    "full_body", "upper_body", "cowboy_shot", "from_behind", "pov", "dutch_angle", "depth_of_field",
    "from_above", "back", "portrait", "from_below", "foreshortening", "close-up", "selfie", "wide_shot",
    "cropped", "bokeh", "perspective", "fisheye", "split_screen", "panorama",
    // 通用人物词（32个 + 牛总扩容18个 = 50个）
    "solo", "looking_at_viewer", "smile", "open_mouth", "short_hair", "blue_eyes", "blonde_hair",
    "brown_hair", "sitting", "green_eyes", "purple_eyes", "closed_eyes", "ponytail", "tongue",
    "looking_back", "feet", "legs", "lips", "head_tilt", "crying", "straight_hair", "eye_contact",
    "angry", "walking", "curly_hair", "running", "smirk", "nose", "laughing", "knees", "sleepy", "jaw",
    // 牛总扩容：人物外貌（发色/眼睛/肤色/体型）
    "long_hair", "black_hair", "red_eyes", "twintails", "blue_hair", "brown_eyes", "white_hair",
    "pink_hair", "grey_hair", "braid", "dark_skin", "black_eyes", "grey_eyes", "muscular",
    "bob_cut", "messy_hair", "pale_skin", "white_skin", "plump", "muscular_female", "petite",
    "black_skin", "tall_female", "asian",
    // 通用服装词（牛总扩容51个，解决"白T恤被滤掉"问题）
    "long_sleeves", "skirt", "gloves", "dress", "hat", "thighhighs", "jacket", "white_shirt",
    "short_sleeves", "hair_ribbon", "earrings", "pantyhose", "shoes", "pleated_skirt", "boots",
    "hairband", "collared_shirt", "shorts", "pants", "choker", "socks", "glasses", "black_skirt",
    "hair_flower", "white_dress", "necklace", "black_dress", "kimono", "black_shirt", "scarf",
    "sweater", "high_heels", "hoodie", "blue_shirt", "sandals", "sunglasses", "cardigan", "blazer",
    "t-shirt", "sneakers", "china_dress", "hakama", "sleeves_rolled_up", "jeans", "watch", "beanie",
    "leggings", "sundress", "hanfu", "denim_jacket", "floral_print_dress",
    // 通用场景词（26个 + 牛总扩容17个 = 43个）
    "day", "leaf", "plant", "smoke", "rock", "crystal", "fence", "door", "glass", "house", "tower",
    "waterfall", "floor", "desert", "dust", "cave", "morning", "skyline", "fountain", "island", "dirt",
    "concrete", "traffic", "highway", "valley", "lawn",
    // 牛总扩容：场景
    "simple_background", "white_background", "outdoors", "indoors", "cloud", "blue_sky", "tree",
    "window", "night", "sunlight", "grass", "sunset", "city", "classroom", "road", "bedroom",
    "street", "kitchen", "cafe",
    // 通用动作词（牛总扩容15个，解决"站着/坐着被滤掉"问题）
    "blush", "holding", "standing", "lying", "arms_behind_back", "crossed_arms", "eating",
    "waving", "v_arms", "hands_in_pockets", "drinking", "reading", "cooking",
     "waves" // wave 修法（小阿总 2026-09-11，老秦授权二选一选池路线）：复数归一后查池，补 1 分支持通道
  ])

  /* R3 通用池两档·B需触发档（95词，牛总 2026-09-11）
   * B档词：用户没提到也不在LLM输出里时，scoreTagRelevance 返回 0 而非 1
   * 实现：L974 poolHit 分支前查 B_SET */
  var R3_B_SET = new Set([
    "full_body",
    "upper_body",
    "cowboy_shot",
    "from_behind",
    "pov",
    "dutch_angle",
    "depth_of_field",
    "from_above",
    "back",
    "portrait",
    "from_below",
    "foreshortening",
    "close-up",
    "selfie",
    "wide_shot",
    "cropped",
    "bokeh",
    "perspective",
    "fisheye",
    "split_screen",
    "panorama",
    "looking_at_viewer",
    "looking_back",
    "head_tilt",
    "eye_contact",
    "smirk",
    "sleepy",
    "window",
    "night",
    "city",
    "classroom",
    "road",
    "bedroom",
    "street",
    "kitchen",
    "cafe",
    "neon_trim",
    "ceiling_light",
    "light_trail",
    "light_bulb",
    "torch",
    "flashlight",
    "neon_sign",
    "long_sleeves",
    "skirt",
    "gloves",
    "dress",
    "hat",
    "thighhighs",
    "jacket",
    "white_shirt",
    "short_sleeves",
    "hair_ribbon",
    "earrings",
    "pantyhose",
    "shoes",
    "pleated_skirt",
    "boots",
    "hairband",
    "collared_shirt",
    "shorts",
    "pants",
    "choker",
    "socks",
    "glasses",
    "black_skirt",
    "hair_flower",
    "white_dress",
    "necklace",
    "black_dress",
    "kimono",
    "black_shirt",
    "scarf",
    "sweater",
    "high_heels",
    "hoodie",
    "blue_shirt",
    "sandals",
    "sunglasses",
    "cardigan",
    "blazer",
    "t-shirt",
    "sneakers",
    "china_dress",
    "hakama",
    "sleeves_rolled_up",
    "jeans",
    "watch",
    "beanie",
    "leggings",
    "sundress",
    "hanfu",
    "denim_jacket",
    "floral_print_dress"
    ]);

  /* ========== P1-1：KEYWORD_MAP（用户口语→标签映射） ========== */
  // 基础手工映射（纯口语别名，词库.js里没有的）
  var MANUAL_KEYWORD_MAP = {
    "黑长直": ["black_hair", "long_hair"],
    "双马尾": ["twintails"],
    "萝莉": ["loli"],
    "御姐": ["mature_female"],
    "JK": ["school_uniform", "serafuku"],
    "扶他": ["futanari"],
    "伪娘": ["trap"],
    "触手": ["tentacles"],
    "魅魔": ["succubus"],
    "梦魇": ["incubus"],
    "女仆": ["maid"],
    "女巫": ["witch"],
    "精灵": ["elf"],
    "猫娘": ["catgirl", "cat_ears"],
    "狐娘": ["foxgirl", "fox_ears"],
    "厨房": ["kitchen"],
    "卧室": ["bedroom"],
    "浴室": ["bathroom"],
    "海滩": ["beach"],
    "森林": ["forest"],
    "城市": ["city"],
    "雨天": ["rain"],
    "雪天": ["snow"],
    "日落": ["sunset"],
    "夜晚": ["night"],
    "亚洲": ["asian"],
    "欧洲": ["european"],
    "白人": ["white_skin"],
    // 大阿总V1遗留问题测试发现：核心动作词单字口语被0分误杀（用户说"吻"，标签中文是"接吻"，indexOf匹配不上）
    // 补充一批最常用的单字口语→标签映射，解决"宁可多不敢少"底线问题
    "吻": ["kiss"],
    "亲": ["kiss"],
    "接吻": ["kiss"],
    "拥抱": ["hug"],
    "抱": ["hug"],
    "搂": ["hug"],
    "跪": ["kneeling"],
    "跪着": ["kneeling"],
    "站": ["standing"],
    "站着": ["standing"],
    "坐": ["sitting"],
    "坐着": ["sitting"],
    "躺": ["lying"],
    "躺着": ["lying"],
    "走": ["walking"],
    "走着": ["walking"],
    "跑": ["running"],
    "跑着": ["running"],
    "笑": ["smile"],
    "笑着": ["smile"],
    "哭": ["crying"],
    "哭着": ["crying"],
    "拉": ["pulling"],
    "推": ["pushing"],
    "咬": ["biting"],
    "舔": ["licking"],
    "吸": ["sucking"],
    "吃": ["eating"],
    "喝": ["drinking"],
    "睡": ["sleeping"],
    "做饭": ["cooking"],
    "看书": ["reading"],
    // V2.4 第一波「保词」补键（小牛总 09-15，豆总改码单）：P0 场景用户口语动作被精档删——
    // 词表全称门槛（matchZhSegments 要说出全称"梳头发/给某人化妆"，用户说"梳头/化妆"对不上）+ kwMap 无键 → LLM 吐对也 0 分。
    // 只补 danbooru 在表词（brushing_hair 2937/hair_brush 2752/applying_makeup 2082/mirror 30108，豆总核过 count）；
    // reading_book/makeup_set 表外是 LLM 自造词禁补（防脑补本意）；不写单字"镜"（误伤眼镜/墨镜）。修法先例照 L603-605"键写短口语词"。
    "梳头": ["brushing_hair", "hair_brush"],
    "梳头发": ["brushing_hair", "hair_brush"],
    "化妆": ["applying_makeup"],
    "镜子": ["mirror"],
    "镜前": ["mirror"],
    "黑人": ["dark_skin"],
    // v2.1 序5：kwMap补高频口语（小阿总出数据，牛总20连测发现"暖色调/温馨"语义缺口）
    // 注意：warm_lighting/soft_lighting不在8.7万表，kwMap只能救"LLM已经吐了的词"（0分→3分），救不了"LLM没吐的词"
    // 键写短口语词，子串匹配能命中长句（"温馨"命中"温馨氛围"）
    "暖色": ["warm_lighting", "soft_lighting"],
    "暖色调": ["warm_lighting", "soft_lighting"],
    "暖光": ["warm_lighting", "soft_lighting"],
    "温馨": ["warm_lighting", "soft_lighting"],
    "温馨氛围": ["warm_lighting", "soft_lighting"],
    "柔和": ["soft_lighting"],
    "柔和光": ["soft_lighting"],
    // v2.1 序5：spice口癖归一（大阿总序9勘误：spice三写是LLM口癖，不是概念扩展里的重复，归kwMap/口癖映射线）
    // LLM每次乱吐spice_powder/spice_particles/spices，归一到spice_powder（在表，热度最高的代表词）
    "spices": ["spice_powder"],
    "spice_particles": ["spice_powder"],
    "香料": ["spice_powder"],
    "调料": ["spice_powder"],
    // v2.1 序5：其他高频口语补全（牛总口癖映射23条的一部分，pan→frying_pan等）
    "平底锅": ["frying_pan"],
    "锅": ["frying_pan"],
    "木勺": ["wooden_spoon"],
    "勺子": ["spoon"],
    "蒸汽": ["steam"],
    "热气": ["steam"],
    "白围裙": ["white_apron"],
    "白色围裙": ["white_apron"],
    "黑鞋子": ["black_shoes"],
    "黑色鞋子": ["black_shoes"],
    "白大褂": ["lab_coat"],
    "格子衫": ["plaid_clothes"],
    "格子衬衫": ["plaid_clothes"],
    // v2.1 深夜追加：身材描述真缺口（牛总转交单发现，"凸凹有致"LLM译成hourglass_figure不在表，curvy在表zh="曲线优美的"）
    "凸凹有致": ["curvy"],
    "凹凸有致": ["curvy"],
    "沙漏身材": ["curvy"],
    "沙漏型身材": ["curvy"],
    // V2.3 KEYWORD_MAP 补全（大阿总 2026-09-12）：民间口语→标签，只补词库标准zh覆盖不到的说法。
    // 红线词（loli/shota/child/rape/incest）不补——走红线闸直接拦，不进打分。
    // ① 身体
    "粗腰": ["thick_waist"],
    "裸足": ["barefoot"],
    "猫耳": ["cat_ears"],
    "狐耳": ["fox_ears"],
    "狐尾": ["fox_tail"],
    "兔耳": ["rabbit_ears"],
    "翅膀": ["wings"],
    "龙角": ["dragon_horns"],
    "触手": ["tentacles"],
    "呆毛": ["ahoge"],
    // ② 动作
    "口含": ["fellatio"],
    "骑乘": ["straddling"],
    "女上": ["cowgirl"],
    "跪姿": ["kneeling"],
    "舔穴": ["cunnilingus"],
    "舌吻": ["french_kiss"],
    // ③ 服装
    "体操服": ["gym_uniform"],
    "文胸": ["bra"],
    "内裤": ["panties"],
    "乳胶衣": ["latex"],
    "胶衣": ["latex"],
    "紧身衣": ["bodysuit"],
    "裙撑": ["petticoat"],
    "束腰": ["corset"],
    "浴巾": ["towel"],
    "毛巾": ["towel"],
    "军装": ["military_uniform"],
    "警服": ["police_uniform"],
    "比基尼": ["bikini"],
    "抹胸": ["tube_top"],
    "JK制服": ["school_uniform"],
    "lolita": ["lolita_fashion"],
    "cos": ["cosplay"],
    // ④ 人设
    "姐系": ["mature_female"],
    "御妹": ["mature_female"],
    "御姐范": ["mature_female"],
    "御姐系": ["mature_female"],
    "御姐脸": ["mature_female"],
    "腐女": ["fujoshi"],
    "腹黑": ["kuudere"],
    // ⑤ 道具
    "皮鞭": ["whip"],
    "皮绳": ["leash"],
    "面具": ["mask"],
    "绳子": ["rope"],
    // V2.3 第二轮补全（大阿总 2026-09-12）：核心 NSFW 动作/服装/身体/道具口语，
    // 只补词库标准zh覆盖不到的（38条已覆盖的跳过），红线/非自愿词一律不补。
    // ① 核心动作
    "打飞机": ["masturbation","masturbating"],
    "手淫": ["masturbation","masturbating"],
    "吹箫": ["oral"],
    "口活": ["oral"],
    "射精": ["cum","ejaculation","cumshot"],
    "射": ["cum","ejaculation","cumshot"],
    "六九": ["sixty-nine","69"],
    "狗爬式": ["doggy_style","doggystyle"],
    "骑乘": ["cowgirl_position","reverse_cowgirl","girl_on_top"],
    "高潮": ["orgasm"],
    "绝顶": ["orgasm"],
    "叫床": ["moaning"],
    "弯腰": ["bent_over"],
    "俯卧": ["lying_on_stomach","prone"],
    "后庭": ["anal","anal_sex"],
    // ② 核心服装
    "肉丝": ["pantyhose","skin_tight_pantyhose"],
    "裤袜": ["pantyhose"],
    "过膝袜": ["thighhighs","over_knee_stockings","pantyhose"], // 过膝袜 补pantyhose接住LLM（词库侧同键靶thighhighs+over_knee_stockings，此处补pantyhose与词库合并去重；小阿总实测LLM吐pantyhose被lowscore删、thighhighs没出）(牛总09-14)
    "过膝长筒袜": ["thighhighs","pantyhose"], // 过膝长筒袜 同族补pantyhose（词库侧L1240同键thighhighs，合并后双靶）(牛总09-14)
    "渔网袜": ["fishnets","fishnet_stockings","pantyhose"], // +pantyhose(在表578618,小阿总fetch hook抓LLM高频吐pantyhose被删→接住;fishnets/fishnet_stockings保留)(大阿总09-14)
    "网袜": ["fishnets"],
    "文胸": ["bra"],
    "胸罩": ["bra"],
    "奶罩": ["bra"],
    "内裤": ["panties"],
    "小内内": ["panties"],
    "高跟鞋": ["high_heels"],
    "颈圈": ["collar"],
    // ③ 身体/状态
    "裸体": ["nude","naked","fully_nude"],
    "裸": ["nude","naked"],
    "半裸": ["partially_nude"],
    "上裸": ["topless"],
    "下裸": ["bottomless"],
    "湿身": ["wet","wet_clothes","wet_hair"],
    "湿透": ["wet","wet_clothes"],
    "出汗": ["sweat"],
    "流汗": ["sweat"],
    "哭": ["crying","tears"],
    "爆乳": ["huge_breasts","gigantic_breasts"],
    "贫乳": ["small_breasts","flat_chest"],
    "已婚": ["married"],
    // ④ 道具/兽耳
    "按摩棒": ["vibrator","massage_wand","massager","massage_cylinder"], // 按摩棒 B方案对齐LLM：vibrator(表24138)/massage_wand(表外)/massager(表65)/massage_cylinder(表外,LLM三轮变体massage_wand→massager→massage_cylinder,小阿总重验吐新变体被删→加接住)(大阿总09-14+牛总补)
    "阳具": ["dildo"],
    "跳蛋": ["egg_vibrator"],
    "后庭塞": ["butt_plug"],
    "尾巴": ["tail","plug_tail"],
    "兽耳": ["animal_ears"],
    "动物耳": ["animal_ears"],
    "兔耳": ["rabbit_ears","bunny_ears"],
    "狐耳": ["fox_ears","kitsune_ears"],
    "犬耳": ["dog_ears"],
    "狗耳": ["dog_ears"],
    "翅膀": ["wings"],
    "角": ["horns"],
    "犄角": ["horns"],
    "皮鞭": ["whip"],
    // S2 touching 拆分（大阿总 2026-09-14，阿紫表 5.2 新建11条；含撇号用双引号包）
    "摸头": ["headpat"],
    "摸脸": ["hand_on_another's_face","touching_face_of"],
    "摸胸": ["grabbing_another's_breast"],
    "摸屁股": ["grabbing_another's_ass"],
    "摸头发": ["grabbing_another's_hair","touching_hair_of"],
    "摸下巴": ["hand_on_another's_chin"],
    "摸腿": ["thigh_grab"],
    "摸腰": ["arm_around_waist"],
    "摸肩": ["arm_around_shoulder"],
    "摸脖子": ["neck_grab"],
    "摸手": ["holding_hands"],
  };

  /**
   * 从词库.js程序化生成关键词映射（450个中文key，660条zh→en映射）
   * @param {Object} ciku - 词库.js的CIKU_EXTERNAL对象
   * @returns {Object} 关键词映射表 {中文关键词: [标签1, 标签2, ...]}
   */
  function buildKeywordMapFromCiku(ciku) {
    var map = {};
    if (!ciku) return map;

    // 先复制手工映射
    Object.keys(MANUAL_KEYWORD_MAP).forEach(function (alias) {
      map[alias] = MANUAL_KEYWORD_MAP[alias].slice();
    });

    // 从词库.js程序化提取（S1：递归下钻 items 两层/多层结构）
    function addItem(item) {
      if (!item) return;
      // 子分类节点：递归处理它的 items（子分类自身只有 g/nsfw/items，无 zh/en，不会被收）
      if (Array.isArray(item.items)) { item.items.forEach(addItem); return; }
      if (item.zh && item.en) {
        var zhKey = String(item.zh).trim();
        var enTags = String(item.en).split(",").map(function (t) { return t.trim(); }).filter(function (t) { return t; });
        if (zhKey && enTags.length) {
          if (!map[zhKey]) map[zhKey] = [];
          enTags.forEach(function (t) {
            if (map[zhKey].indexOf(t) < 0) map[zhKey].push(t);
          });
        }
      }
    }
    // ★必须遍历全部顶层分组，禁止加任何白/黑名单：
    // negA/negB/negC 负向三组贡献 19 个现版已存在的键，排除=引入回归（全分组1730，排除只剩1711）
    Object.keys(ciku).forEach(function (group) {
      (ciku[group] || []).forEach(addItem);
    });

    return map;
  }

  /* ========== T1：正经档统一 NSFW 闸（豆总Pro设计 2026-09-21） ==========
   * 病根：互动层正经档跳露骨、动作类词层与散词通道(pp rawTag / 人物卡打分 / mapper三数组进manual)
   *   没有同口径档闸，正经档"口交"裸 en 词形经 keywordMap 3 分漏进 outPos。
   * 口径：项级 nsfw 是 UI 层门禁（exposureLevel 整层 nsfw 却含 fully_clothed），不能当单词露骨判据；
   *   单词级硬露骨集合 = 手工核心硬词(兜底词库外裸器官/全裸) ∪ 硬核层 nsfw 叶子差集(减SFW词/减噪声)
   *   ∪ 互动露骨项无歧义整串。场景/穿搭/哭妆/眼神镜头/性身份默认不收（宁漏勿杀，灰单另裁）。
   * 与 T11 解耦：本闸只在 mode!=='nsfw' 动作；T11 nsfw 锚仅 mode==='nsfw' 生效，二者互不引用。 */
  function t1EnWords(en){ return String(en==null?'':en).split(',').map(function(t){return normTag(t.trim());}).filter(Boolean); }
  var T1_SEX_ACT_STEM = /oral|penetrat|anal|cunnilingus|fellatio|blowjob|deepthroat|creampie|cum|footjob|titjob|handjob|masturbat|fingering|groping|threesome|gangbang|orgy|spitroast|edging|sixty|(^|_)69($|_)|missionary|cowgirl|doggy|double[ _]penetration|group[ _]sex|multiple[ _]partners|sex_from|rutting|humping/i;
  // 互动项是否露骨：有 nsfwEn，或裸 en 命中性词干（覆盖 69式/三人行/群交/串烧/多P/榨精 等无 nsfwEn 项）
  function isNsfwInteraction(entry){
    if(!entry) return false;
    if(entry.nsfwEn) return true;
    return T1_SEX_ACT_STEM.test(String(entry.en||'').toLowerCase());
  }
  var T1_HARD_LAYERS = ['actions','fluids','props','clothState','angle'];
  // 互动裸 en 里的歧义词：不进单词集合（这些互动项靠 isNsfwInteraction 项级整条跳）
  var T1_INTER_AMBIGUOUS = { licking:1, groping:1, grinding:1, teasing:1, facial:1, anal:1, oral:1, deep:1, penetrating:1 };
  // ↓↓ T1_NOISE(257) / T1_MANUAL_HARD(214) / T1_INTER_AMBIGUOUS / T1_SEX_ACT_STEM 四个字面量
  //    整体从同目录 _T1_gate数据片段.js 粘贴（探针自动生成、node --check 通过、与集合 263 同源），勿手抄。
  // T1 gate 数据片段（由 _probe_T1.js --emit 生成，与 nsfwHardSet=263 同源，直接粘贴进 relevance_gate.js 4.1 节占位处）
  // T1_MANUAL_HARD 214 词；T1_NOISE 257 词。
  var T1_MANUAL_HARD = ["penis","erect_penis","vagina","pussy","vulva","clitoris","labia","inner_labia","outer_labia","pussy_lips","anus","asshole","areola","nipple","nipples","erect_nipples","glans","foreskin","testicles","scrotum","head_of_penis","glans_exposed","glans_pushing_through","penis_head","no_shaft_visible","cum","semen","cumshot","cum_in_mouth","cum_inside","cum_on_face","cum_on_body","cum_on_lips_and_face","cum_on_lips","creampie","creampie_overflow","bukkake","squirting","female_ejaculation","ejaculation","pussy_juice","cumflation","excessive_cum","cum_overflow","cum_drip","cum_reaction","cum_in_throat","completely_nude","fully_nude","nude","naked","fully_exposed","bottomless","topless","no_panties","no_bra","panties_pulled_aside","pussy_visible","pussy_exposed","pussy_fully_displayed","pussy_visible_below","pussy_visible_from_behind","showing_pussy_from_behind","showing_pussy","spreading_labia","penis_visible","penis_exposed","vagina_exposed","exposed_for_viewer","pussy_spread","ass_spread","spread_labia","oral_sex","fellatio","blowjob","rough_blowjob","irrumatio","deepthroat","deep_throat","full_depth_oral","kneeling_deep_throat","cunnilingus","pussy_licking","licking_pussy","anilingus","rimming","anal_sex","anal_penetration","anal_penetrating","vaginal_penetration","penetration","being_penetrated_by","penis_penetrating","shaft_penetrating_labia","penis_half-inserted","close-up_of_penetration","penetration_view","view_of_penetration_from_above","penetration_close-up","full_penetration","shallow_penetration","just_entering","double_penetration","both_holes_filled","one_in_vagina_one_in_anus","doggy_style","doggy_style_pose","kneeling_doggystyle","sex_from_behind","standing_sex","standing_from_behind","mating_press","breeding_press","missionary","cowgirl_position","reverse_cowgirl","cowgirl_up_view","scissoring","tribadism","intercrural","thigh_sex","paizuri","titjob","titfuck","footjob","handjob","footjob_and_thigh_sex","masturbating","masturbation","masturbating_pose","self-pleasure","fingering","fingers_inside","fingering_herself","fingering_through_panties","rubbing_clit","dildo_riding","inserting_vibrator","facesitting","face_sitting","facefuck","spitroast","spit_roast","gangbang","group_sex","orgy","threesome","foursome","mutual_oral","simultaneous_penetration","mixed_oral_and_facial","oral_creampie","sixty-nine","69","edging","masturbating_with_toy","masturbating_while_watched","masturbator","dildo","realistic_dildo","double-ended_dildo","double_ended_dildo","suction_cup_dildo","vibrator","magic_wand_vibrator","bullet_vibrator","rabbit_vibrator","egg_vibrator","clit_suction_toy","wireless_vibrator","remote_controlled_toy","electric_stimulation_toy","dual_stimulation","butt_plug","fox_tail_butt_plug","anal_beads","anal_dilator","prostate_massager","onahole","cock_ring","nipple_clamps","chastity_cage","ball_gag","ring_gag","spreader_bar","suspension_rope","rope_binding","oviposition","egg_laying","belly_inflation","body_inflation","breast_inflation","breeding","impregnation","face_at_crotch","crotch-level_shot","nose_touching_pelvis","man_between","one_man_under_her","one_man_watching_while_other_penetrates","ass_up_view","lifted_legs_view","between_her_legs_view","juice_glistening","panties_pushed_aside","ahegao","lewd","lewd_expression","lustful","moaning","open_mouth_moaning","climaxing","out_of_control","mind_break"];
  /* 刀2b：性别向词表（normKey）——MALE 向合计 23（17 HARD + 6 ORAL）*/
  var T2B_MALE_HARD = ["penis","erect_penis","penis_head","head_of_penis","glans","foreskin","testicles",
    "scrotum","dick","cock","male_genitalia","semen","cumshot","bukkake","male","man","1boy",
    "cum","creampie","cum_inside","facial","cum_on_face","cum_on_body","cum_in_mouth","boy"]; // 刀2b-c：补 cum族/boy
  var T2B_MALE_ORAL = ["fellatio","blowjob","giving_head","irrumatio","deepthroat","deep_throat"];
  var T2B_FEMALE_ORAL = ["cunnilingus","pussy_licking","licking_pussy"];
  function t2bSet(arr){ var o={}; arr.forEach(function(w){ o[w]=1; }); return o; }
  var T2B_MH=t2bSet(T2B_MALE_HARD), T2B_MO=t2bSet(T2B_MALE_ORAL), T2B_FO=t2bSet(T2B_FEMALE_ORAL);
  var T2B_ORAL_HIT = /口交|口活|口含|吹|舔/;
  function t2bIsMale(n){ return !!(T2B_MH[n]||T2B_MO[n]); }
  var T1_NOISE = ["oral","licking","groping","grinding","facial","cowgirl","arm_across_chest","biting_knuckle","hands_on_thighs","one_leg_raised","2boys_1girl","2girls_1boy","four_people","three_people","mfm","against_wall","pressed_against_wall","coordinated","contemptuous","detail_shot","facing_away","facing_each_other","hair_falling_forward","hand_on_belly","hands_on_his_chest","lotus_position","on_top","presenting","rubbing","sharing","spooning","train","deep","wet","touching_body","bouncing","sideway","one_behind","lineup","streetlight_through_window","knees_on_tile","seductive_pose","enticing_pose","arched_eyebrows","caressing_thigh","hair_grabbing","hands_pinned_beside_head","lying_with_legs_raised","her_legs_over_his_shoulder","his_weight_on_her","one_hand_on_base","one_hand_grabbing_breast","other_hand_between_legs","hand_between_legs","mouth_on_upper_half","pinching_nipple","pulling_nipple","nipple_play","cupping_breasts","cupping_chest","hands_on_breasts","breast_grabbing","ass_grabbing","breast_play","between_breasts","big_breasts","glutes","butt","ass","throat","tongue_on_lip","finger_in_mouth","playing_with_fingers","touching_self","self-pleasure","dominated","reverse_control","sandwiched","showing_off","exposed","exposing","spread","legs_apart","legs_up","legs_spread","thighs_open","thighs_spread","thighs_spread_open","thighs_spread_wide","wide_legs","standing_with_legs_spread_against_wall","legs_spread_wide_open","spread_legs","on_knees","kneeling","riding","riding_position","lying","face_down","facedown","arching_back","back_arched","arched_back?","bent_over","all_fours","woman_on_all_fours","hands_gripping_hips","pressing_stomach","pelvis_touching_pelvis","bodies_pressed","thrusting","lifted","lifting","partially_removed","disheveled","messy","ripped","torn_clothing","unbuttoned","ripped_open","buttons_popping","belt_coming_undone","falling_off","slipping_off","strap_falling","shoe_falling_off","sweat-soaked","soaked","damp_shirt","wet_clothes_clinging","rumpled_clothes","fabric_bunched_at_waist","clutching_towel_too_short","towel_slipping_off_shoulder","blanket_lifted","hand_trying_to_cover_but_too_small","stretching_and_top_lifts","skirt_rides_up_accidentally","leaning_forward_and_cleavage_spills","drool","drooling","saliva","slobber","string","single_drop","faint_trace","rolling_eyes","pregnant","food_on_body","food_play","food_splosh","wam","camera_on_tripod","hidden_camera","webcam","recording_phone","app-controlled","blindfold","satin_blindfold","collar_and_leash","leash","after_hours","after_school","afternoon","back_seat","bathroom_stall","big_bed","conference","desk","elevator","empty_carriage","hot_spring","hotel_bedroom","in_car","japanese_room","love_hotel","massage_room","office_cubicle","oil","onsen","onsen_inn","outdoor","parking_lot","pink_room","quiet","reading_corner","restroom","ryokan","school_changing_room","sento","shower","spa","stuck","torii","wet_body","animal_ears","kemonomimi","direct_eye_contact_with_camera","eyes_pulling_viewer_in","making_eye_contact_with_camera","making_eye_contact_from_across_room","making_eye_contact_with_camera_then_breaking_away_shyly","seductive_eye_contact","seductive_glance","devouring_stare","hungry_gaze","possessive_look","longingly_gaze","no-shame_eye_contact","eye-fucking_the_viewer","biting_lower_lip_shyly","doggy","missionary","from_behind","from_below","high_angle","low_angle","side_view","looking_up","clean_lashes","natural_rosy_flush_from_warm_bath","water_droplets_on_face","wet_skin_look","dewy_foundation","glossy_wet_lips","parted_glossed_lips","heated_red_face","pleasure_flush_on_cheeks","grab_redness_on_face","finger_mark_on_cheek","swollen_bruised_lip","bitten_swollen_red_lips","transferred_lipstick_on_lips","heavy_sleepy_eyelids","bondage","bondage_rope","bondage_harness","shibari","shibari_rope","red_rope","leather_cuffs","handcuffs","metal_handcuffs","flogger","paddle","whip","riding_crop","rope","cleavage","huge_breasts","gigantic_breasts","large_breasts","ecstatic_expression","wanton_gaze","lustful_desperate_gaze","insatiable_stare","greedy_wanting_eyes","on_all_fours","hands_on_chest","weight_on_partner"];
  var T1_MANUAL_ADD_T11 = ["fisting","self_stimulation","clitoral_stimulation","clitoral_stimulation_through_clothing","g-spot_stimulation","uncommon_stimulation","nipple_stimulation","self_milking","self-stimulation","self-milking","self_stimulating","self-stimulating","self_pleasuring","self-pleasuring","self_pleasured","self-pleasured","self_fondling","self-fondling","self_fondled","self-fondled","self_wanking","self-wanking","self_wank","self-wank","self_jerking_off","self-jerking_off","self_stroking","self-stroking","self_grinding","self-grinding","self_rubbing","self-rubbing","self_orgasm","self-orgasm","orgasm","orgasms","genitalia","crotch","anal","penetrating","crotch_and_foot_detail","kissing_crotch_of"]; // T1.3收官：whole 补 kissing_crotch_of（口部接触裆部，确证性义）
  var T1_TOKEN_HARD = ["penis","glans","foreskin","testicles","scrotum","vagina","pussy","vulva","clitoris","labia","anus","asshole","semen","cum","cumshot","creampie","bukkake","squirting","ejaculation","oral_sex","fellatio","blowjob","deepthroat","irrumatio","cunnilingus","anilingus","anal_sex","anal_penetration","vaginal_penetration","penetration","masturbation","masturbating","fingering","handjob","footjob","paizuri","titjob","titfuck","facesitting","facefuck","spitroast","gangbang","orgy","threesome","scissoring","tribadism","dildo","vibrator","onahole","masturbator","butt_plug","anal_beads","fisting","impregnation","genitalia"]; // T1.3阶段2：窗口期结束撤 crotch（genitalia 长期留）
  var AMBIG_BARE = { oral: 1 };
  function t1Leaves(arr, pNsfw, out){
    out = out || [];
    (arr||[]).forEach(function(it){
      if(!it) return;
      if(Object.prototype.toString.call(it.items)==='[object Array]'){ t1Leaves(it.items, pNsfw||it.nsfw===true, out); }
      else if(it.zh!==undefined || it.en!==undefined){ out.push({en:it.en, nsfw:(it.nsfw===true||pNsfw)}); }
    });
    return out;
  }
  function buildNsfwHardSet(ciku){
    var set={}, i;
    T1_MANUAL_HARD.forEach(function(w){ set[normTag(w)]=1; });
    if(!ciku) return set;
    var safe={};
    Object.keys(ciku).forEach(function(g){
      if(/^neg[ABC]/.test(g) || g==='presets') return;
      t1Leaves(ciku[g],false,[]).forEach(function(x){ if(!x.nsfw) t1EnWords(x.en).forEach(function(w){ safe[w]=1; }); });
    });
    var noise={}; T1_NOISE.forEach(function(w){ noise[normTag(w)]=1; });
    T1_HARD_LAYERS.forEach(function(lk){
      t1Leaves(ciku[lk],false,[]).forEach(function(x){
        if(!x.nsfw) return;
        t1EnWords(x.en).forEach(function(w){ if(safe[w] || noise[w]) return; set[w]=1; });
      });
    });
    (ciku.interactions||[]).forEach(function(it){
      if(!isNsfwInteraction(it)) return;
      t1EnWords(it.en).forEach(function(w){ if(!T1_INTER_AMBIGUOUS[w]) set[w]=1; });
    });
    // T1.1：真实消费增量片段——8 个手工整词入集合（普通键、参与整词命中）；挂硬核片段白名单（__前缀不参与整词命中）
    (typeof T1_MANUAL_ADD_T11!=="undefined"?T1_MANUAL_ADD_T11:[]).forEach(function(w){ set[normTag(w)]=1; });
    set.__tokenHard={}; (typeof T1_TOKEN_HARD!=="undefined"?T1_TOKEN_HARD:[]).forEach(function(w){ set.__tokenHard[normTag(w)]=1; });
    // 件3 词形归一：连字符键补下划线键（两形态同判），__前缀跳过
    Object.keys(set).forEach(function(k){ if(k.indexOf('__')===0)return; var u=k.replace(/-/g,'_'); if(u!==k&&!set[u])set[u]=1; });
    return set;
  }
  // 单词是否硬露骨（整词→复数别名→T1.1 复合词片段兜底）；set 缺省（未建表）一律 false，绝不误杀
  function isNsfwHardTag(tag, set){
    if(!set) return false;
    var n = normTag(tag); if(!n) return false;
    if(set[n]) return true;
    var _hy = n.replace(/-/g, '_'); if (_hy !== n && set[_hy]) return true;
    var s = singularAliasOf(n);
    if(s && set[s]) return true;
    // T1.1 词库外露骨复合词兜底：仅当含【硬核片段白名单】独立 token 才拦（器官/体液/确定性动作/硬道具）。
    // 泛词不拆（裸色美妆/穿衣激凸/男装上空/格斗裸绞/镶边内衣/牵手梗等零误伤，见 T1_TOKEN_HARD 注释）；
    // 否定前缀 no_/non_ 复合不拆（整词在硬表者已在上方拦，如 no_panties）。
    if(set.__tokenHard && !/^(no|non)[_-]/.test(n) && (n.indexOf('_')>=0 || n.indexOf('-')>=0)){
      var toks = n.split(/[_\-]+/);
      for(var i=0;i<toks.length;i++){
        var t = toks[i]; if(!t || t.length<3) continue;
        if(set.__tokenHard[t]) return true;
        var ts = singularAliasOf(t); if(ts && set.__tokenHard[ts]) return true;
      }
    }
    if (isCrotchSexual(n)) return true;
    return false;
  }
  var C_ORAL_STEM = ['face','kiss','lick','suck','oral','mouth','munch'];
  var C_ACT_STEM  = ['grab','rub','touch','fondl','grop','grind','hump','thrust','frott','hand'];
  var C_SNIFF_STEM= ['sniff','smell'];
  var C_CLOTH = { seam:1, zipper:1, plate:1, strap:1, ribbon:1, cutout:1, crotchless:1, panties:1 };
  var C_FIGHT = { kick:1, attack:1, punch:1, stomp:1, stomping:1 };
  var C_COVER = { covering:1, covered:1, hair:1 };
  var C_DAILY = { mole:1, fanning:1, mousepad:1, meme:1, lightning:1 };
  var C_OWN   = { own:1, shaving:1, pointing:1 };
  var C_H     = { framed:1, looking:1, focus:1 };
  function stemHit(toks, stems){
    return toks.some(function(t){ return stems.some(function(s){ return t.indexOf(s) >= 0; }); });
  }
  function isCrotchSexual(n){
    if (n.indexOf('crotch') < 0 && n.indexOf('groin') < 0) return false;
    var toks = n.split(/[_\-]+/);
    if (toks.some(function(t){ return C_OWN[t]; })) return false;
    var hasOral  = stemHit(toks, C_ORAL_STEM);
    var hasSniff = stemHit(toks, C_SNIFF_STEM);
    var hasAct   = stemHit(toks, C_ACT_STEM);
    var hasCum = toks.indexOf('cum') >= 0, hasPov = toks.indexOf('pov') >= 0, hasRope = toks.indexOf('rope') >= 0;
    if (hasOral || hasSniff || hasCum || hasPov || hasRope) return true;
    if (hasAct){
      if (toks.some(function(t){ return C_CLOTH[t] || C_FIGHT[t] || C_COVER[t] || C_DAILY[t] || C_H[t]; })) return false;
      return true;
    }
    return false;
  }

  /* ========== P1-2：并集触发（用户描述 + LLM标签） ========== */
  /**
   * 检测触发了哪些概念扩展（并集触发：用户描述触发 + LLM标签触发）
   * @param {string} userDescription - 用户原始描述（中文）
   * @param {Array<string>} llmTags - LLM输出的标签列表
   * @param {Object} conceptExpansion - 概念扩展表（大阿总75个）
   * @returns {Object} 触发的概念 {conceptKey: {source: "user"|"llm"|"both", tags: [...]}}
   */

  /* ========== P1优化：概念别名映射表（解决"海边散步"不触发beach的问题） ==========
   * 牛总端到端测试发现：概念zh字面触发太窄，"海边散步"不含"海滩"，用户侧触发失败
   * 加一个常见同义词/别名映射表，手动维护一些高频场景的别名
   */
  var CONCEPT_ALIASES = {
    "beach": ["海滩", "海边", "沙滩", "海滨", "海边散步"],
    "kitchen": ["厨房", "做饭", "下厨", "做菜", "煮饭"],
    "forest": ["森林", "树林", "林子", "丛林"],
    "garden": ["花园", "庭院", "园子", "菜园"],
    "park": ["公园", "游园", "游乐场"],
    "bedroom": ["卧室", "房间", "睡房"],
    "bathroom": ["浴室", "卫生间", "厕所", "洗澡间"],
    "classroom": ["教室", "课堂", "上课"],
    "office": ["办公室", "公司", "写字楼"],
    "library": ["图书馆", "书房", "书库"],
    "city": ["城市", "都市", "市区", "城里"],
    "street": ["街道", "马路", "街上", "路边"],
    "rooftop": ["屋顶", "天台", "楼顶"],
    "rain": ["下雨", "雨天", "雨中", "淋雨"],
    "snow": ["下雪", "雪天", "雪地", "雪中"],
    "sunset": ["日落", "夕阳", "黄昏", "傍晚"],
    "night": ["夜晚", "晚上", "夜里", "深夜", "夜景"],
    "spring": ["春天", "春季", "春日"],
    "summer": ["夏天", "夏季", "夏日"],
    "winter": ["冬天", "冬季", "冬日"],
    "autumn": ["秋天", "秋季", "秋日", "落叶"],
    "lake": ["湖泊", "湖边", "湖畔", "湖"],
    "river": ["河流", "河边", "河畔", "江边", "河岸"],
    "ocean": ["海洋", "大海", "海里", "海上"],
    "mountain": ["山", "山上", "山顶", "山间", "山区"],
    "field": ["田野", "田地", "麦田", "草原", "草地"],
    "alley": ["小巷", "胡同", "弄堂", "巷子"],
    "train": ["火车", "地铁", "列车", "电车上"],
    "storm": ["暴风雨", "风暴", "雷雨", "台风"],
    "maid": ["女仆", "女佣", "侍女"],
    "witch": ["女巫", "魔女", "巫婆"],
    "knight": ["骑士", "剑士"],
    "catgirl": ["猫娘", "猫耳", "猫女"],
    "foxgirl": ["狐娘", "狐耳", "狐女"],
    "elf": ["精灵", "精灵耳"],
    "angel": ["天使"],
    "demon": ["恶魔", "魔鬼"],
    "vampire": ["吸血鬼", "血族"],
    "mermaid": ["美人鱼", "人鱼"],
    "ninja": ["忍者"],
    "samurai": ["武士", "侍"],
    "cowboy": ["牛仔"],
    "pirate": ["海盗"],
    "doctor": ["医生", "大夫"],
    "nurse": ["护士", "看护"],
    "bride": ["新娘", "婚纱"],
    "schoolgirl": ["女学生", "学生妹", "JK", "女子高中生"],
    "nun": ["修女", "尼姑"],
    "priest": ["牧师", "神父", "祭司"],
    "zombie": ["僵尸", "丧尸"],
    "succubus": ["魅魔", "梦魔"],
    "incubus": ["梦魇", "梦魔男"],
    "orc": ["兽人", "半兽人"],
    "sailor": ["水手", "海员"],
    "emo": ["emo", "情绪硬核"],
    "goth": ["哥特", "哥特风"],
    "punk": ["朋克", "朋客"],
    "couple": ["情侣", "一对"],
    "lovers": ["恋人", "爱人", "情侣"],
    "romantic": ["浪漫", "温馨", "甜蜜"],
    "swimming": ["游泳", "戏水"],
    "swimsuit": ["泳衣", "泳装", "穿泳衣"],
    "bikini": ["比基尼", "三点式"],
    "festival": ["祭典", "庙会", "节日", "烟火大会"],
    "wedding": ["婚礼", "结婚", "婚纱"],
    "maid_nsfw": ["NSFW女仆", "露骨女仆"],
    "stockings": ["丝袜", "过膝袜", "吊带袜", "裤袜", "黑丝", "白丝"]
  };

  function detectTriggeredConcepts(userDescription, llmTags, conceptExpansion, mode, negatedKeywords) {
    var triggered = {};
    var desc = String(userDescription || "");
    var tags = (llmTags || []).map(normTag);
    var isSafeMode = (mode === "safe");
    // P1-2修复（小阿总审查发现）：概念别名通道不接否定豁免，"不要海边"仍触发beach
    var negSet = {};
    (negatedKeywords || []).forEach(function (kw) { if (kw) negSet[String(kw).toLowerCase().trim()] = true; });
    // 辅助函数：检查一个词是否被否定（精确匹配或子串匹配）
    function isNegated(term) {
      if (!term) return false;
      var t = String(term).toLowerCase().trim();
      if (negSet[t]) return true;
      for (var nk in negSet) {
        if (negSet.hasOwnProperty(nk) && nk && (t.indexOf(nk) >= 0 || nk.indexOf(t) >= 0)) return true;
      }
      return false;
    }

    Object.keys(conceptExpansion || {}).forEach(function (conceptKey) {
      var concept = conceptExpansion[conceptKey] || {};
      // P0修复（小阿总发现）：NSFW门控——正经模式下nsfw:true的概念不触发，防NSFW标签泄漏
      if (isSafeMode && concept.nsfw === true) return;
      var userTriggered = false;
      var llmTriggered = false;

      // 用户描述触发：概念名或概念关键词出现在用户描述里（P1-2：被否定则不触发）
      if (concept.zh && !isNegated(concept.zh) && desc.indexOf(concept.zh) >= 0) userTriggered = true;
      if (conceptKey && !isNegated(conceptKey) && desc.indexOf(conceptKey) >= 0) userTriggered = true;
      // P1优化：概念别名映射表（解决"海边散步"不触发beach的问题）（P1-2：被否定则不触发）
      var aliases = CONCEPT_ALIASES[conceptKey] || [];
      for (var ai = 0; ai < aliases.length; ai++) {
        if (!isNegated(aliases[ai]) && desc.indexOf(aliases[ai]) >= 0) {
          userTriggered = true;
          break;
        }
      }
      // 概念的标签里有出现在用户描述里的（中文名）（P1-2：被否定则不触发）
      (concept.tags || []).forEach(function (tag) {
        if (tag.zh && !isNegated(tag.zh) && desc.indexOf(tag.zh) >= 0) userTriggered = true;
      });

      // LLM标签触发：LLM输出的标签里有概念名或概念关键词
      if (tags.indexOf(normTag(conceptKey)) >= 0) llmTriggered = true;
      if (concept.zh && tags.some(function (t) { return t.indexOf(normTag(concept.zh)) >= 0; })) llmTriggered = true;

      if (userTriggered || llmTriggered) {
        triggered[conceptKey] = {
          source: userTriggered && llmTriggered ? "both" : (userTriggered ? "user" : "llm"),
          tags: (concept.tags || []).map(function (t) { return typeof t === "string" ? t : t.tag; })
        };
      }
    });

    return triggered;
  }

  /* ========== 行为扩展触发检测（act专用，小阿总设计：行为扩展触发逻辑设计_小阿总.md） ==========
   * 跟detectTriggeredConcepts同构但专门处理行为扩展：
   *   1. triggers字段完整支持（中文口语+英文变体，大小写不敏感；被否定词豁免）
   *   2. NSFW门控：正经模式下nsfw:true的行为不触发（行为扩展全部nsfw:true → 正经模式0触发）
   *   3. 并集触发：用户描述命中 + LLM标签命中（LLM只出了key本身/任一伴随标签也算触发）
   *   4. seen集合去重：单条内tags不重复
   * 旧格式兼容：没有triggers字段的行为扩展表走zh/key/tag通道（跟概念扩展同款），向后兼容
   */
  function detectTriggeredActs(userDescription, llmTags, actExpansion, mode, negatedKeywords) {
    var triggered = {};
    var desc = String(userDescription || "");
    var descLower = desc.toLowerCase();
    var tags = (llmTags || []).map(normTag);
    var isSafeMode = (mode === "safe");

    // P0-2：否定窗口豁免（被否定的触发词不触发）
    var negSet = {};
    (negatedKeywords || []).forEach(function (kw) {
      var nk = normTag(kw);
      if (nk) negSet[nk] = 1;
    });

    Object.keys(actExpansion || {}).forEach(function (actKey) {
      if (actKey.charAt(0) === "_") return; // _说明/_规则等元数据键
      var act = actExpansion[actKey] || {};

      // NSFW门控：正经模式下nsfw:true的行为不触发（防NSFW标签泄漏进正经输出）
      if (isSafeMode && act.nsfw === true) return;

      var userTriggered = false;
      var llmTriggered = false;

      // triggers通道（小阿总数据：中文口语 + 英文变体，大小写不敏感）
      var triggers = act.triggers;
      var hasTriggers = Object.prototype.toString.call(triggers) === "[object Array]" && triggers.length > 0;
      if (hasTriggers) {
        for (var i = 0; i < triggers.length; i++) {
          var tw = String(triggers[i]).toLowerCase();
          if (!tw) continue;
          if (negSet[normTag(triggers[i])]) continue; // 被否定则不算触发
          if (descLower.indexOf(tw) >= 0) {
            userTriggered = true;
            break;
          }
        }
      }
      // 兼容通道：用户直接说key（如"doggy" / "blowjob"）
      // P1-3修复（小阿总审查发现）：key通道漏否定豁免，"不要cowgirl"仍触发
      if (actKey && !negSet[normTag(actKey)] && descLower.indexOf(String(actKey).toLowerCase()) >= 0) userTriggered = true;
      // 旧格式兜底：没有triggers字段时走概念扩展同款通道（zh/标签中文名）
      if (!hasTriggers) {
        if (act.zh && !negSet[normTag(act.zh)] && desc.indexOf(act.zh) >= 0) userTriggered = true;
        (act.tags || []).forEach(function (t) {
          if (typeof t === "string" && t.zh && !negSet[normTag(t.zh)] && desc.indexOf(t.zh) >= 0) userTriggered = true;
        });
      }

      // [R1 2026-09-10 actTagSet通道关闭] 原伴随标签触发逻辑已注释
      // 保留3条合法触发源: triggers字段匹配desc / actKey子串匹配 / 旧格式zh匹配
      // llmTriggered恒为false 行为扩展仅由userTriggered驱动
      //// LLM标签触发：LLM出了key本身或key的任一标签 → 触发（"只出了纯词"也能点亮伴随词）
      //var actTagSet = {};
      //(act.tags || []).forEach(function (t) {
        //var tn = typeof t === "string" ? t : (t && t.tag);
        //if (tn) actTagSet[normTag(tn)] = 1;
      //});
      //actTagSet[normTag(actKey)] = 1;
      //for (var j = 0; j < tags.length; j++) {
        //if (actTagSet[tags[j]]) {
          //llmTriggered = true;
          //break;
        //}
      //}

      if (userTriggered || llmTriggered) {
        // seen集合去重：同一标签在tags里出现多次只记一次
        var seen = {};
        var finalTags = [];
        (act.tags || []).forEach(function (t) {
          var tn = typeof t === "string" ? t : (t && t.tag);
          if (!tn) return;
          var norm = normTag(tn);
          if (seen[norm]) return;
          seen[norm] = 1;
          finalTags.push(tn);
        });
        /* 刀2b：ff 跳过"补男词"的 act */
        if(sceneCtx.pairing==='ff'){
          var _hasMale = finalTags.some(function(tn){ return t2bIsMale(normTag(tn)); });
          if(_hasMale) return;
        }
        triggered[actKey] = {
          source: userTriggered && llmTriggered ? "both" : (userTriggered ? "user" : "llm"),
          tags: finalTags,
          post_counts: act.post_counts || {}
        };
      }
    });
    /* 刀2b：ff 下 desc 含口交概念，强制补女向 cunnilingus（双保险，不依赖 LLM）*/
    if(sceneCtx.pairing==='ff' && T2B_ORAL_HIT.test(desc)){
      triggered.cunnilingus = { source:'user', tags:['cunnilingus','oral','pussy'], post_counts:{} };
    }

    return triggered;
  }

  /* ========== 行为扩展自动补全（后处理第7步，概念补全之后执行；小阿总设计） ==========
   * seen集合去重：LLM valid标签 ∪ 概念补全标签 ∪ 已补行为标签，已有的不重复加
   * 红线守卫：命中红线黑名单的标签绝不补（纵深防御）
   * P0-2：被否定的标签不补（双向子串匹配，跟打分层同款口径）
   * @param {Array<string|Object>} existingTags - 现有输出标签（概念补全之后的全量）
   * @param {Object} triggeredActs - detectTriggeredActs的输出
   * @param {Array<string>} negatedKeywords - P0-2否定词列表
   * @param {Object} danbooru - Danbooru词表（可选，取标签中文名做中文否定匹配："不要口水"→saliva不补）
   * @returns {Array} 补入条目 [{tag, score:2, source:"act_"+key, post_count}]
   */
  function autoCompleteActs(existingTags, triggeredActs, negatedKeywords, danbooru) {
    var negKwsRaw = negatedKeywords || [];
    var negKws = negKwsRaw.map(normTag).filter(Boolean);
    var seen = {};
    (existingTags || []).forEach(function (t) {
      var n = normTag(typeof t === "string" ? t : (t && t.tag));
      if (n) seen[n] = 1;
    });
    var added = [];
    Object.keys(triggeredActs || {}).forEach(function (actKey) {
      var act = triggeredActs[actKey] || {};
      (act.tags || []).forEach(function (tag) {
        var norm = normTag(tag);
        if (!norm || seen[norm]) return; // 去重
        if (isRedLine(norm)) return; // 红线守卫（补词层：student 在 NSFW 才拦，这里不传 mode 属正常——行为扩展词本身不含 student 裸词；student 的拦截在打分层 L971/scoreAndFilter L1155 已覆盖）
        // P0-2：被否定的标签不补（跟打分层同款双向子串口径）
        //  1) 英文标签名 vs 英文否定词
        var negHit = false;
        for (var k = 0; k < negKws.length; k++) {
          if (norm.indexOf(negKws[k]) >= 0 || negKws[k].indexOf(norm) >= 0) { negHit = true; break; }
        }
        //  2) 标签中文名（danbooru.zh）vs 中文否定词（"不要口水"→saliva不补；"不要舌头"→tongue_out不补）
        if (!negHit && danbooru) {
          var tagZh = String(((danbooru[norm] || {}).zh) || "");
          if (tagZh) {
            for (var z = 0; z < negKwsRaw.length; z++) {
              var nz = String(negKwsRaw[z]);
              if (nz && (tagZh.indexOf(nz) >= 0 || nz.indexOf(tagZh) >= 0)) { negHit = true; break; }
            }
          }
        }
        if (negHit) return;
        seen[norm] = 1;
        added.push({
          tag: norm,
          score: 2,
          source: "act_" + actKey,
          post_count: (act.post_counts && act.post_counts[norm]) || null
        });
      });
    });
    return added;
  }

  /* ========== 核心打分函数 ========== */
  /**
   * 相关性打分函数（给单个标签打分）
   * @param {string} tag - 标签名
   * @param {string} userDescription - 用户原始描述（中文）
   * @param {Object} options - 选项
   * @param {Object} options.conceptExpansion - 概念扩展表（大阿总75个）
   * @param {Object} options.actExpansion - 行为扩展表（小阿总候选B）
   * @param {Array<string>} options.commonTagPool - 通用标签池（大阿总整理中）
   * @param {Object} options.keywordMap - 关键词映射表（从词库.js生成）
   * @param {Object} options.danbooru - Danbooru词表（用于取标签中文名）
   * @param {Array<string>} options.llmTags - LLM输出的所有标签（用于概念触发）
   * @param {Array<string>} options.negatedKeywords - 被否定的关键词列表（P0-2）
   * @returns {number} 分数（0/1/2/3）
   */
  function scoreTagRelevance(tag, userDescription, options) {
    options = options || {};
    var norm = normTag(tag);
    if (!norm) return 0;

    // 红线级：标签级红线黑名单（第四道闸，无论字段/分数/模式，命中即0分过滤）
    // 牛总端到端测试发现：LLM会在persona字段输出loli/child，三道保险全被绕过
    // 大阿总 2026-09-12：传 options.mode，NSFW 时 student 裸词也贴红线（正经模式不拦）
    if (isRedLine(norm, options && options.mode)) {
      return 0;
    }

    // T1 正经档统一 NSFW 闸：safe 模式硬露骨词直接 0 分（盖闸B人物卡 charTagScore + 闸A单词）。
    // 仅 safe；nsfw 档不动作（T11 露骨锚在本函数后段照常，二者解耦）。set 未建表不动作。
    if ((options.mode || 'safe') !== 'nsfw' && isNsfwHardTag(norm, options.nsfwHardSet)) {
      return 0;
    }

    // P0-1：结构白名单旁路，不打分直接保留（返回3分）
    if (STRUCTURE_WHITELIST.has(norm)) {
      return 3;
    }

    // P0-2：中文否定句检测，被否定的词直接0分拦截
    var negatedKeywords = options.negatedKeywords || detectNegations(userDescription);
    var danbooru = options.danbooru || {};
    // 大阿总任务2：复数兜底——norm 是复数(如leaves)且词表只存单数(leaf)时，用单数拿zh
    var single = singularAliasOf(norm);
    var tagEntry = danbooru[norm] || (single ? (danbooru[single] || {}) : {}) || {};
    var tagZh = tagEntry.zh || "";
    // v2.1 序8工艺修复：no_类词豁免 + 否定误杀词豁免——
    // no_类词语义本身就是"否定"（如no_panties=没穿内裤）；
    // 误杀词zh含"不/无/别/没穿"但语义不是否定（如"不对称裙"的"不"、"别人"的"别"）。
    // 这两类词跳过否定检测，避免误杀。
    if (!NO_NEGATION_EXEMPT[norm] && !NEGATION_FALSE_POSITIVE_EXEMPT[norm]) {
      for (var i = 0; i < negatedKeywords.length; i++) {
        var kw = negatedKeywords[i];
        var kwNorm = normTag(kw);
        // 检查关键词是否包含标签中文名（或标签中文名包含关键词），双向匹配
        // v2.1 序8工艺修复：拆分zh逐段匹配，解决多说法串的否定检测问题
        if (tagZh) {
          var zhSegs = String(tagZh).split(/[|｜]/);
          var zhNegated = false;
          for (var si = 0; si < zhSegs.length; si++) {
            var seg = zhSegs[si].trim();
            if (seg && (seg.indexOf(kw) >= 0 || kw.indexOf(seg) >= 0)) { zhNegated = true; break; }
          }
          if (zhNegated) return 0;
        }
        if (norm.indexOf(kwNorm) >= 0 || kwNorm.indexOf(norm) >= 0) return 0;
      }
    }

    // 3分：直接命中用户描述关键词
    var keywordMap = options.keywordMap || {};
    // P2-3修复（小阿总审查发现）：userDescription.indexOf无null守卫，null描述会抛异常
    var desc = String(userDescription || "");
    var descLower = desc.toLowerCase();
    // P2-7修复（小阿总审查发现）：3分直击空格对不上下划线，用户写"black hair"对不上"black_hair"
    var descLowerUnder = descLower.replace(/[\s_-]+/g, "_");
    /* ===== 刀2b：性别感知路由（pairing 取 options 或 sceneCtx；仅 nsfw）===== */
    var _pairing = options.pairing || sceneCtx.pairing;
    if(options.mode==='nsfw'){
      if(_pairing==='ff'){
        if(t2bIsMale(norm)) return 0;                              /* 双女压男词 */
        if(T2B_FO[norm] && T2B_ORAL_HIT.test(desc)) return 3;      /* 口交→cunnilingus */
      } else if(_pairing==='fm'){
        if(T2B_FO[norm]) return 0;                                 /* 女男压 cunnilingus */
        if(T2B_MO[norm] && T2B_ORAL_HIT.test(desc)) return 3;      /* 口交→fellatio */
      }
    }
    // 检查标签的中文名是否出现在用户描述里
    // v2.1 序8工艺修复：拆分zh逐段匹配，解决"黑色鞋子|黑鞋"这种多说法串用户只说后半截0分丢的问题
    if (tagZh && matchZhSegments(desc, tagZh)) {
      if ((options && options.mode) !== 'nsfw' && AMBIG_BARE[norm]) return 1;
      return 3;
    }
    // 检查标签英文名是否出现在用户描述里（用户可能直接说英文，空格/下划线都能匹配）
    if (descLower.indexOf(norm) >= 0 || descLowerUnder.indexOf(norm) >= 0) return 3;
    // 检查关键词映射表
    // 性能优化（牛总）：先筛出"确实在描述里出现"的关键词再对标签匹配,省掉N标签×M关键词的无效双循环
    var descHits = options._descHits;
    if (!descHits) {
      descHits = [];
      for (var kwKey0 in keywordMap) {
        if (keywordMap.hasOwnProperty(kwKey0) && desc.indexOf(kwKey0) >= 0) descHits.push(kwKey0);
      }
      options._descHits = descHits;
    }
    for (var dIdx = 0; dIdx < descHits.length; dIdx++) {
      var mappedTags = keywordMap[descHits[dIdx]] || [];
      if (mappedTags.indexOf(norm) >= 0 || mappedTags.some(function (t) { return normTag(t) === norm; })) {
        return 3;
      }
    }

    // T11 AI意图保底网（豆总Pro设计 2026-09-20，v2 阿紫交叉）：用户原话强意图锚直击 3 分。
    // 只越"相关性低分"这一关——红线(L1139)/结构白名单(L1144)/中文否定(L1159-1176)都在本行之前已判，锚救不了；
    // T16 被动词形只在闸A scoreAndFilter 打分前拦，闸B锚集合本身不含 receiving_ 词形（双保险都到不了锚）。
    // nsfw 锚严格仅露骨档(mode==='nsfw')：正经档不放松（统一 nsfw 闸归 T1）；safe 锚（兽人）任意档。
    var intentAnchors = options.intentAnchors;
    if (intentAnchors) {
      var _intentMode = options.mode || "safe";
      if (_intentMode === "nsfw" && intentAnchors.nsfw &&
          (intentAnchors.nsfw[norm] || (single && intentAnchors.nsfw[single]))) {
        return 3;
      }
      if (intentAnchors.safe &&
          (intentAnchors.safe[norm] || (single && intentAnchors.safe[single]))) {
        return 3;
      }
    }

    // 2分：概念/行为扩展命中
    var conceptExpansion = options.conceptExpansion || {};
    var actExpansion = options.actExpansion || {};
    var llmTags = options.llmTags || [];
    var scoreMode = options.mode || "safe";
    // 性能优化（牛总）：触发结果按(desc+llmTags+mode)缓存在options._triggeredCache里,
    // 批量打分时N个标签共享一次计算；之前是每个标签都重跑detectTriggeredConcepts+detectTriggeredActs（N倍冗余）
    var tcCache = options._triggeredCache || (options._triggeredCache = {});
    var cacheKey = scoreMode;
    var triggeredConcepts = tcCache[cacheKey + "::c"];
    if (!triggeredConcepts) {
      // P1-2修复：传入negatedKeywords，让概念触发时检查否定集
      triggeredConcepts = detectTriggeredConcepts(userDescription, llmTags, conceptExpansion, scoreMode, options.negatedKeywords);
      tcCache[cacheKey + "::c"] = triggeredConcepts;
    }
    // 检查标签是否属于某个被触发的概念扩展
    for (var cKey in triggeredConcepts) {
      if (triggeredConcepts.hasOwnProperty(cKey)) {
        var cTags = triggeredConcepts[cKey].tags || [];
        // 大阿总任务2：复数补查单数别名（概念扩展可能存单数leaf，LLM输出复数leaves）
        var cHit = cTags.indexOf(norm) >= 0 || cTags.some(function (t) { return normTag(t) === norm; });
        if (!cHit && single) { cHit = cTags.indexOf(single) >= 0 || cTags.some(function (t) { return normTag(t) === single; }); }
        if (cHit) {
          return 2;
        }
      }
    }
    // 检查标签是否属于某个被触发的行为扩展（act专用函数：triggers全支持+NSFW门控+并集触发，小阿总设计）
    // 性能优化（牛总）：同款缓存,一次scoreAndFilter只算一遍
    var triggeredActs = tcCache[cacheKey + "::a"];
    if (!triggeredActs) {
      triggeredActs = detectTriggeredActs(userDescription, llmTags, actExpansion, scoreMode, options.negatedKeywords);
      tcCache[cacheKey + "::a"] = triggeredActs;
    }
    for (var aKey in triggeredActs) {
      if (triggeredActs.hasOwnProperty(aKey)) {
        var aTags = triggeredActs[aKey].tags || [];
        var aHit = aTags.indexOf(norm) >= 0 || aTags.some(function (t) { return normTag(t) === norm; });
        if (!aHit && single) { aHit = aTags.indexOf(single) >= 0 || aTags.some(function (t) { return normTag(t) === single; }); }
        if (aHit) {
          return 2;
        }
      }
    }

    // 1分：通用标签池（默认用大阿总整理的107个标签，也可外部传入覆盖）
    var commonTagPool = options.commonTagPool || COMMON_TAG_POOL;
    // 大阿总任务2：复数补查单数别名（通用池可能存单数leaf，LLM输出复数leaves）
    var poolHit = false;
    if (commonTagPool instanceof Set) {
      if (commonTagPool.has(norm)) poolHit = true;
      if (!poolHit && single && commonTagPool.has(single)) poolHit = true;
    } else if (Array.isArray(commonTagPool)) {
      if (commonTagPool.indexOf(norm) >= 0 || commonTagPool.some(function (t) { return normTag(t) === norm; })) poolHit = true;
      if (!poolHit && single && (commonTagPool.indexOf(single) >= 0 || commonTagPool.some(function (t) { return normTag(t) === single; }))) poolHit = true;
    } else if (typeof commonTagPool === "object" && commonTagPool !== null) {
      if (commonTagPool[norm]) poolHit = true;
      if (!poolHit && single && commonTagPool[single]) poolHit = true;
    }
    if (poolHit) {
      // R3 两档：B档词需用户描述或LLM明确输出，否则0分
      if (R3_B_SET.has(norm) || (single && R3_B_SET.has(single))) {
        var descLower_ = String(userDescription || "").toLowerCase();
        var llmTags_ = options.llmTags || [];
        var inDesc = descLower_.indexOf(norm) >= 0 || (single && descLower_.indexOf(single) >= 0);
        var inLlm = llmTags_.some(function(t) { return normTag(typeof t === "string" ? t : (t && t.tag)) === norm; });
        if (!inDesc && !inLlm) return 0;
      }
      return 1;
    }

    // 0分：无支持（LLM脑补的无关词）
    return 0;
  }

  /* ========== 批量打分 + 阈值过滤 ========== */
  /**
   * 给一批标签批量打分，并按阈值过滤
   * @param {Array<string|Object>} tags - 标签列表（字符串或{tag, count, zh}对象）
   * @param {string} userDescription - 用户原始描述（中文）
   * @param {string} mode - 模式："safe"（正经）或"nsfw"（露骨）
   * @param {Object} options - 选项（同scoreTagRelevance）
   * @returns {Object} {valid: [], warning: [], filtered: [], stats: {}}
   */
  /* ===== 乱伦组合判定·静态表（V3.0 乱伦补丁V2，从 scoreAndFilter 内上移）===== */
  var KIN_ELDER={mother:1,father:1,parent:1,mom:1,mommy:1,dad:1,daddy:1,aunt:1,uncle:1,grandmother:1,grandfather:1,stepmother:1,stepfather:1,mother_in_law:1,father_in_law:1};
  var KIN_YOUNGER={daughter:1,son:1,niece:1,nephew:1,granddaughter:1,grandson:1};
  var KIN_PEER={sister:1,brother:1,sisters:1,brothers:1,siblings:1,cousin:1,stepsister:1,stepbrother:1};
  var KIN_BARE=(function(){var o={};[KIN_ELDER,KIN_YOUNGER,KIN_PEER].forEach(function(g){Object.keys(g).forEach(function(k){o[k]=1;});});return o;})();
  var KINSHIP_TERMS=new Set(["mother_and_daughter","mother_and_son","father_and_daughter","father_and_son","parent_and_child","brother_and_sister","sisters","brothers","siblings"]);
  var KIN_HARD_EXTRA={sex:1,intercourse:1};
  function kinNorm(s){return normTag(s).replace(/^\(|\)$/g,'').replace(/:\d+(\.\d+)?$/,'').replace(/-/g,'_');}
  /* 组合终筛分析：返回 {combo,hard,strips:[normKey...],output}；红线语义·不读手选豁免 */
  function analyzeKinship(text,mode,options){
    var opts=options||{};
    var tags=String(text==null?"":text).split(',').map(function(s){return s.trim();}).filter(Boolean);
    var norms=tags.map(kinNorm);
    var _hard=function(n){return (opts.nsfwHardSet&&isNsfwHardTag(n,opts.nsfwHardSet))||!!KIN_HARD_EXTRA[n]||/^(completely_nude|nude|naked)$/.test(n);};
    var hitE=norms.some(function(n){return KIN_ELDER[n];}), hitY=norms.some(function(n){return KIN_YOUNGER[n];});
    var peerSet={}; norms.forEach(function(n){if(KIN_PEER[n])peerSet[n.replace(/s$/,'')]=1;});
    var bareSet={}; norms.forEach(function(n){if(KIN_BARE[n])bareSet[n]=1;});
    var combo=norms.some(function(n){return KINSHIP_TERMS.has(n);})||(hitE&&hitY)||Object.keys(peerSet).length>=2||Object.keys(bareSet).length>=1;  // ★修正1：第四分支=裸单亲属角色从严
    var hard=norms.some(_hard);
    var strips=[];
    if(combo&&hard){
      var seenS={};
      tags.forEach(function(t){var nn=kinNorm(t); if((KIN_BARE[nn]||KINSHIP_TERMS.has(nn))&&!seenS[nn]){seenS[nn]=1;strips.push(nn);}});
    }
    var output=text;
    if(strips.length){
      output=tags.filter(function(t){var nn=kinNorm(t);return !(KIN_BARE[nn]||KINSHIP_TERMS.has(nn));}).join(', ');  // ★修正2：has(kinNorm)、连字符 and 复合剥得掉
    }
    return {combo:combo,hard:hard,strips:strips,output:output};
  }
  function stripKinshipCombo(text,mode,options){ return analyzeKinship(text,mode,options).output; }

  function scoreAndFilter(tags, userDescription, mode, options) {
    options = options || {};
    var safe = (mode !== "nsfw");
    // V2.3 三档对接打分阈值（大阿总 2026-09-12）：
    // 精档 fine = 阈值 3（只保留直接命中用户描述 + 映射命中 + 结构白名单词，最干净，用户说啥有啥不脑补）
    // 平衡档 balanced = 阈值 2（直接命中 + 概念/行为扩展，现行收官水平）
    // 创意档 creative = 阈值 1（直接命中 + 扩展 + 通用池，放量不减闸）
    // 结构白名单/红线词不受阈值影响（白名单无条件 3 分，红线 0 分）。
    // tier 未传（旧调用方）时回退现行行为：正经≥2 / 露骨≥1。
    var tier = options.tier || "balanced";
    var threshold;
    if (tier === "fine") threshold = 3;
    else if (tier === "creative") threshold = 1;
    else threshold = 2; // balanced 或未知 tier：统一阈值 2（三档必须有明显区别：精3/平衡2/创意1）

    // 把mode传给options，供scoreTagRelevance里的detectTriggeredConcepts做NSFW门控
    options.mode = mode;

    // 预计算否定关键词（避免重复计算）
    // P2-6修复（小阿总审查发现）：无条件覆盖调用方传入的negatedKeywords，改成||
    options.negatedKeywords = options.negatedKeywords || detectNegations(userDescription);
    // 预计算LLM标签列表（用于概念触发）
    if (!options.llmTags) {
      options.llmTags = (tags || []).map(function (t) {
        return typeof t === "string" ? t : (t.tag || "");
      });
    }

    var valid = [];   // ≥阈值，正常保留
    var warning = []; // 1分但低于阈值（正经模式下），标黄用户可手动保留
    var filtered = []; // 0分，自动过滤
    var scoreStats = { "3": 0, "2": 0, "1": 0, "0": 0 };

    var redLineCount = 0;
    var nsfwSafeCount = 0;
    // 件2 乱伦组合判定 V2（静态表已上移、与 analyzeKinship 同源）
    var _allKin=(tags||[]).map(function(t){return kinNorm(typeof t==="string"?t:(t&&t.tag)||"");}).filter(Boolean);
    var _kinPeerSet={}; _allKin.forEach(function(n){if(KIN_PEER[n])_kinPeerSet[n.replace(/s$/,'')]=1;});
    var _kinBareUniq={}; _allKin.forEach(function(n){if(KIN_BARE[n])_kinBareUniq[n]=1;});
    var _kinBareN=Object.keys(_kinBareUniq);
    var _kinHard=function(n){return (options.nsfwHardSet&&isNsfwHardTag(n,options.nsfwHardSet))||!!KIN_HARD_EXTRA[n]||/^(completely_nude|nude|naked)$/.test(n);};
    var kinshipCombo=( _allKin.some(function(n){return KINSHIP_TERMS.has(n);})
      ||(_allKin.some(function(n){return KIN_ELDER[n];})&&_allKin.some(function(n){return KIN_YOUNGER[n];}))
      ||(Object.keys(_kinPeerSet).length>=2)
      ||(_kinBareN.length>=1)
    )&&_allKin.some(_kinHard);
    (tags || []).forEach(function (tagObj) {
      var tag = typeof tagObj === "string" ? tagObj : (tagObj.tag || "");
      var norm = normTag(tag);
      if (!norm) return;

      var entry = typeof tagObj === "object" ? tagObj : { tag: tag };

      // 红线级：标签级红线黑名单（第四道闸，无论分数/模式，命中即过滤+记日志）
      // 大阿总 2026-09-12：传 mode，NSFW 时 student 裸词也贴红线（正经模式不拦）
      if (isRedLine(norm, mode)) {
        entry.score = 0;
        entry.red_line = true;
        entry.filter_reason = "red_line_blacklist";
        filtered.push(entry);
        redLineCount++;
        scoreStats["0"]++;
        // 记日志（控制台输出，方便排查）
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[RelevanceGate][RED LINE] 过滤红线标签:", norm, "| 原始:", tag);
        }
        return;
      }

      // 件2＋V2：乱伦组合（亲属 and/复数/裸角色 ＋ 硬词）⇒ 剥亲属词；硬词与非亲属词不动
      var _n2 = kinNorm(norm);
      if (kinshipCombo && (KINSHIP_TERMS.has(_n2) || KIN_BARE[_n2])) {  // ★ Turbo修正2：has(_n2)，连字符 and 复合才剥得掉
        entry.score=0; entry.red_line=true; entry.filter_reason="kinship_combo";
        filtered.push(entry); redLineCount++; scoreStats["0"]++;
        if (typeof console!=="undefined"&&console.warn) console.warn("[RelevanceGate][KINSHIP] 乱伦组合，过滤亲属标签:", norm);
        return;
      }
      // T16 被动语态词形拦截：命中前缀(receiving_) → 直接进 filtered（桶 passive_form），不打分
      var passiveHit = PASSIVE_PREFIXES.some(function (pfx) { return norm.indexOf(pfx) === 0; });
      if (passiveHit) {
        entry.score = 0;
        entry.filter_reason = "passive_form";
        filtered.push(entry);
        scoreStats["0"]++;
        if (typeof console !== "undefined" && console.warn) {
          console.warn("[RelevanceGate][PASSIVE] 过滤被动词形:", norm, "| 原始:", tag);
        }
        return;
      }

      // T1：正经档硬露骨词分桶 nsfw_safe_mode（进 filtered 可恢复/已忽略区可见，不占 valid/warning；与闸B同源）
      if (safe && options.nsfwHardSet) {
        // T1.1：分桶判定统一走 isNsfwHardTag（含复合词片段兜底），与 scoreTagRelevance 同源，复合词正确进 nsfw_safe_mode/已忽略区/可恢复
        if (isNsfwHardTag(norm, options.nsfwHardSet)) {
          entry.score = 0;
          entry.filter_reason = "nsfw_safe_mode";
          filtered.push(entry);
          nsfwSafeCount++;
          scoreStats["0"]++;
          if (typeof console !== "undefined" && console.warn) {
            console.warn("[RelevanceGate][T1-NSFW] 正经档过滤露骨词:", norm, "| 原始:", tag);
          }
          return;
        }
      }
      var score = scoreTagRelevance(tag, userDescription, options);
      scoreStats[String(score)]++;
      entry.score = score;

      if (score >= threshold) {
        valid.push(entry);
      } else if (score === 1 && threshold === 2) {
        // 正经模式下，1分标黄
        warning.push(entry);
      } else {
        // 0分，自动过滤
        filtered.push(entry);
      }
    });

    return {
      valid: valid,
      warning: warning,
      filtered: filtered,
      stats: {
        total: tags ? tags.length : 0,
        valid: valid.length,
        warning: warning.length,
        filtered: filtered.length,
        redLineCount: redLineCount,
        nsfwSafeCount: nsfwSafeCount,
        scoreDistribution: scoreStats,
        threshold: threshold,
        mode: mode
      }
    };
  }

  /* ========== 导出 ========== */
  var api = {
    // 核心函数
    scoreTagRelevance: scoreTagRelevance,
    scoreAndFilter: scoreAndFilter,
    detectNegations: detectNegations,
    detectTriggeredConcepts: detectTriggeredConcepts,
    detectTriggeredActs: detectTriggeredActs,
    autoCompleteActs: autoCompleteActs,
    buildKeywordMapFromCiku: buildKeywordMapFromCiku,
    buildNsfwHardSet: buildNsfwHardSet,
    isNsfwInteraction: isNsfwInteraction,
    isNsfwHardTag: isNsfwHardTag,
    isRedLine: isRedLine,
    analyzeKinship: analyzeKinship,
    stripKinshipCombo: stripKinshipCombo,
    kinNorm: kinNorm,
    setSceneContext: function (cfg){ if(cfg&&cfg.pairing!=null) sceneCtx.pairing=cfg.pairing; },
    getSceneContext: function (){ return { pairing: sceneCtx.pairing }; },
    /* 供 pp 互斥 sort 调用：按当前 pairing 返回性别优先级 rank（0 优先 / 1 中性 / 2 压制）*/
    genderRankForPairing: function (tag){
      var n=normKey(tag), p=sceneCtx.pairing;
      if(p==='ff'){ if(T2B_FO[n]) return 0; if(t2bIsMale(n)) return 2; return 1; }
      if(p==='fm'){ if(T2B_MO[n]||T2B_MH[n]) return 0; if(T2B_FO[n]) return 2; return 1; }
      return 1;
    },
    /* 刀2b-c：mapper chip 通道 pairing 门控。仅 pairing==='ff' 收紧；
       text 拆逗号片段，任一片段 normKey 命中男性集合(HARD∪ORAL) → 整 chip 拦 */
    chipBlockedForPairing: function (text){
      if(sceneCtx.pairing!=='ff') return false;
      var ps=String(text==null?'':text).split(',');
      for(var i=0;i<ps.length;i++){ var n=normKey(ps[i]); if(n&&t2bIsMale(n)) return true; }
      return false;
    },
    // 常量
    STRUCTURE_WHITELIST: STRUCTURE_WHITELIST,
    RED_LINE_BLACKLIST: RED_LINE_BLACKLIST,
    CONCEPT_ALIASES: CONCEPT_ALIASES,
    RED_LINE_DRUG_VARIANTS: RED_LINE_DRUG_VARIANTS,
    PASSIVE_PREFIXES: PASSIVE_PREFIXES, // T16 被动语态词形拦截前缀表
    DRUG_IP_EXEMPT: DRUG_IP_EXEMPT,
    NEGATION_WORDS: NEGATION_WORDS,
    NEGATION_ALIAS_MAP: NEGATION_ALIAS_MAP,
    MANUAL_KEYWORD_MAP: MANUAL_KEYWORD_MAP,
    PLURAL_MAP: PLURAL_MAP // 复数词形归一映射（30条，复→单/单→复双向混装；singularAliasOf 纯查表无回退，T1.2 据此连收 orgasms）
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api; // Node.js
  }
  if (typeof window !== "undefined") {
    window.relevanceGate = api; // 浏览器全局
  }
  if (typeof global !== "undefined") {
    global.relevanceGate = api; // Node.js全局
  }
})(typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : this));
