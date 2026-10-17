/* ============================================================================
 * 浅浅提示词拼合器 —— 词库文件（唯一需要长期维护的文件）
 * ----------------------------------------------------------------------------
 * 【这个文件是干什么的】
 *   网页上所有中文按钮、以及点一下出来的英文标签，都写在这个文件里。
 *   想加角色 / 表情 / 动作 / 服装 / 场景 / 光影 / 镜头 / 负向词，都只改这里。
 *
 * 【怎么改（总原则，三句话）】
 *   1) 用记事本打开本文件；2) 找到对应区块，照抄它给的“一行样子”，粘贴后改中文和英文；
 *   3) 保存时：记事本“另存为”→ 底部编码选【UTF-8】→ 回网页按 F5 生效。
 *
 * 【格式长什么样（最常用的一种）】
 *   { zh:"中文按钮名", en:"对应的英文标签，多个英文用英文逗号隔开" },
 *   - zh = 中文显示名（你在网页上看到的字）
 *   - en = 点它之后输出的英文标签（照抄训练/手册里的写法）
 *   - 每一行结尾都要有英文逗号 ,
 *   - 只改引号 " " 里面的字；大括号 { }、中括号 [ ]、逗号不要删
 *
 * 【怎么删】不想要哪个按钮，就把它那一整行删掉即可。
 * 【让 AI 助手帮你加】把本文件整个发给 AI，或让它直接打开本文件，
 *   告诉它“往哪个区块、加什么中文名=什么英文”，让它照这里的格式加，保存后 F5。
 *
 * 【改坏了怎么办】把本文件改名或删掉，网页会自动用“内置词库”先跑起来，不会白屏。
 * ==========================================================================*/
(function (global) {
  global.CIKU_EXTERNAL = {

    /* ========================================================================
     * 【身份卡】管“画的是谁”。一次只选一个；也可以一个都不选（网页自带“不选”）。
     * 一行格式：
     *   { zh:"中文角色名", en:"触发词+外貌英文（不要写 1girl，人数在别处管）", hint:"卡下面的小灰字提示，可留空" },
     * 加新角色：照抄一行，改三处引号；想加几个加几个。
     * ======================================================================*/
    characters: [
      { zh: "浅浅动画", en: "yeqianqian, black hair, wavy hair, medium hair, air bangs, round glasses, silver hoop earrings, pale skin, slim, large breasts", hint: "动漫系 Pony/WAI/R妈都行" },
      { zh: "浅浅真人", en: "yeqianqian_real, black hair, wavy hair, medium hair, air bangs, round glasses, silver hoop earrings, pale skin, slim, large breasts", hint: "真人/半写实系 R妈/193/RealVis（真人向Pony也行）" },
    ],

    /* ========================================================================
     * 【人数】管“画面里几个人、是男是女”。一次只选一个，可留空。
     * 一行格式：{ zh:"中文名", en:"英文数量词" },
     * ======================================================================*/
    counts: [
      { zh: "单人女", en: "1girl" },
      { zh: "单人男", en: "1boy" },
      { zh: "双人女", en: "2girls" },
      { zh: "一女一男", en: "1girl, 1boy" },
      { zh: "三人", en: "3girls" },
    ],

    /* ========================================================================
     * 【关系】管“两个人是什么关系”。双人/多人用。跟【数量】合成一句，如“1girl and 1boy, couple”。
     * 用 and + 关系词，AI 才知道把俩人放一起、按关系互动。词是标准 booru 关系标签。
     * ======================================================================*/
    relationships: [
      { zh: "情侣", en: "couple" },
      { zh: "母女", en: "mother and daughter" },
      { zh: "姐妹", en: "sisters" },
      { zh: "闺蜜", en: "best friends" },
      { zh: "双胞胎", en: "twins" },
      { zh: "父子/父女", en: "parent and child" },
      { zh: "主仆", en: "master and servant" },
      { zh: "师生", en: "teacher and student" },
      { zh: "扶他情侣", en: "futanari lovers" },
      { zh: "恋人（同性）", en: "yuri, girlfriends" },
    ],

    /* ========================================================================
     * 【互动·主谓宾】管“谁对谁做了什么”。双人/多人用。
     * 结构：主体 + 动作 + 客体（如 girl handing flowers to boy）。
     * 这里给“动作模板”，后台把 [主体][动作][客体] 拼成完整句。
     * ======================================================================*/
    interactions: [
      { zh: "递花", en: "handing flowers to" },
      { zh: "拥抱", en: "hugging" },
      { zh: "看着", en: "looking at" },
      { zh: "对视/互相看着", en: "looking_at_each_other, looking at each other" },
      { zh: "看着另一人", en: "looking_at_another, looking at another" },
      { zh: "牵手", en: "holding hands with, holding_hands" },
      { zh: "抚摸", en: "caressing" },
      { zh: "脸红看着她/他", en: "blushing while looking at" },
      { zh: "亲吻", en: "kissing", difficulty: "hard", tip: "3人场景方向易混，建议半身/特写" },
      { zh: "依偎", en: "leaning on, snuggling" },
      { zh: "坐她腿上", en: "sitting on lap of" },
      { zh: "摸头", en: "patting head of" },
      { zh: "摸脸/捧脸", en: "cupping face, touching face" },
      { zh: "挽手", en: "link arms with" },
      { zh: "背(她/他)", en: "giving piggyback to" },
      { zh: "亲脸颊", en: "kissing cheek of", difficulty: "hard", tip: "3人场景方向易混" },
      { zh: "咬耳朵", en: "nibbling ear of", difficulty: "hard", tip: "3人场景方向易混" },
      { zh: "耳语", en: "whispering to" },
      { zh: "喂食", en: "feeding" },
      { zh: "整理衣领", en: "adjusting collar of" },
      { zh: "拍肩", en: "patting shoulder of" },
      { zh: "口交", en: "performing oral sex on", nsfwEn: "{s} giving oral sex to {o}, {s} kneeling, {o} lying back, legs spread" },
      { zh: "被口交", en: "receiving oral sex from", nsfwEn: "{o} giving oral sex to {s}, {o} kneeling, {s} lying back, legs spread" },
      { zh: "舔(私处)", en: "licking", nsfwEn: "{s} licking {o} pussy, {o} lying back, legs spread" },
      { zh: "插入", en: "penetrating", nsfwEn: "{s} penetrating {o}" },
      { zh: "被插入", en: "being penetrated by", nsfwEn: "{o} penetrating {s}, {s} lying back, legs spread" },
      { zh: "肛交插入", en: "anal penetrating", nsfwEn: "{s} anal penetrating {o}" },
      { zh: "后入插入", en: "penetrating from behind", nsfwEn: "{s} penetrating {o} from behind, {o} on all fours", difficulty: "impossible", tip: "3人全身纯词基本出不来，建议半身/特写或配参考图" },
      { zh: "骑乘位", en: "riding on top of", nsfwEn: "{s} riding on top of {o}, {s} straddling {o}" },
      { zh: "被骑乘", en: "being ridden by", nsfwEn: "{o} riding on top of {s}, {o} straddling {s}" },
      { zh: "揉胸", en: "groping breasts of", nsfwEn: "{s} groping {o} breasts" },
      { zh: "肚皮贴肚皮", en: "belly to belly" },
      // —— v1.8.6 补：露骨动作词（含 nsfwEn 锁"谁对谁"）——
      { zh: "双插", en: "double penetration", nsfwEn: "{s} being double penetrated, both holes filled", difficulty: "impossible", tip: "3人最高难度，纯词不可达" },
      { zh: "阴道插入", en: "vaginal penetration", nsfwEn: "{s} penetrating {o} vaginally" },
      { zh: "肛交", en: "anal sex, anal", nsfwEn: "{s} anal penetrating {o}, {o} on all fours" },
      { zh: "背入", en: "penetrating from behind", nsfwEn: "{s} penetrating {o} from behind, {o} on all fours", difficulty: "impossible", tip: "3人全身纯词基本出不来，建议半身/特写或配参考图" },
      { zh: "传教士", en: "missionary", nsfwEn: "{s} missionary, {s} on top, {o} lying on back" },
      { zh: "反向女上位", en: "reverse_cowgirl_position", nsfwEn: "{s} reverse cowgirl, {s} on top facing away" },
      { zh: "深喉", en: "deepthroat", nsfwEn: "{s} deepthroating {o}, {s} kneeling" },
      { zh: "颜射", en: "facial, bukkake", nsfwEn: "{s} facial on {o}, cum on {o} face" },
      { zh: "内射", en: "cum_in_pussy, cum inside", nsfwEn: "{s} creampie inside {o}, cum inside" },
      { zh: "足交", en: "footjob", nsfwEn: "{s} footjob on {o}" },
      { zh: "乳交", en: "titjob", nsfwEn: "{s} titjob on {o}" },
      { zh: "舔阴", en: "pussy licking, cunnilingus", nsfwEn: "{s} cunnilingus, licking {o} pussy, {o} lying back, legs spread" },
      { zh: "手指插入", en: "fingering", nsfwEn: "{s} fingering {o}" },
      { zh: "69式", en: "69, sixty-nine", nsfwEn: "{s} and {o} in 69 position, mutual oral sex, {s} orally pleasuring {o}, {o} orally pleasuring {s}, lying on sides, legs over each other" },
      { zh: "三人行", en: "threesome", nsfwEn: "{s} in a threesome, three people, {s} being fondled by {o} and another person, multiple hands on {s}", difficulty: "impossible", tip: "3人最高难度，纯词不可达，建议配参考图或ControlNet" },
      { zh: "群交", en: "gangbang, group sex", nsfwEn: "{s} in a gangbang, group sex, {s} surrounded by {o} and multiple partners, many hands on {s}", difficulty: "impossible", tip: "多人最高难度，纯词不可达" },
      { zh: "串烧（前后夹）", en: "spitroast, one front one back", nsfwEn: "{s} in a spitroast, one in front one in back, {o} penetrating {s} from behind, another person penetrating {s} from front", difficulty: "impossible", tip: "三重接触纯词不可达，建议配参考图" },
      { zh: "多P", en: "multiple partners, orgy", nsfwEn: "orgy, multiple partners, group sex, {s} with several partners, sex party, many people", difficulty: "impossible", tip: "多人最高难度，纯词不可达" },
      { zh: "口爆", en: "cum_in_mouth", nsfwEn: "{s} cumming in {o} mouth" },
      { zh: "榨精", en: "edging, teasing, handjob", nsfwEn: "{s} edging {o}, {s} giving handjob to {o}, teasing, bringing {o} to the edge repeatedly" },
      // —— v1.8.6 补：自慰类（"自己"的动作，可跟插入共存）——
      { zh: "自慰", en: "masturbating", nsfwEn: "{s} masturbating" },
      { zh: "自慰·指插", en: "fingering herself", nsfwEn: "{s} fingering herself" },
      { zh: "自慰·揉阴蒂", en: "rubbing clit", nsfwEn: "{s} rubbing own clit" },
      { zh: "自慰·夹腿磨蹭", en: "grinding, thigh squeeze", nsfwEn: "{s} grinding, thighs pressed" },
      { zh: "自慰·用道具", en: "masturbating with toy", nsfwEn: "{s} masturbating with a toy" },
      { zh: "自慰·被看", en: "masturbating while watched", nsfwEn: "{s} masturbating being watched" },

      // —— v2.0 扩：SFW双人互动（仅追加现有词库没有的） ——
      { zh: "公主抱", en: "carrying bridal style, princess carry" },
      { zh: "双人慢舞", en: "slow dancing with, dancing with partner, bodies close" },
      { zh: "额头相抵", en: "forehead to forehead, touching foreheads" },
      { zh: "擦泪", en: "wiping tears of, wiping away tears" },
      { zh: "蒙眼", en: "covering eyes of from behind, hands over eyes" },
      { zh: "共伞", en: "sharing umbrella with, under one umbrella" },
      { zh: "分享耳机", en: "sharing earphones with, sharing headphones" },
      { zh: "背靠背坐", en: "sitting back to back with, back to back sitting" },
      { zh: "肩并肩", en: "shoulder to shoulder with" },
      { zh: "靠肩", en: "leaning on shoulder of, head on shoulder" },
      { zh: "膝枕", en: "head on lap of, lap pillow" },
      { zh: "别发丝", en: "tucking in hair of, tucking hair behind ear" },
      { zh: "十指相扣", en: "holding hands interlocked with, interlocked fingers" },
      { zh: "拉手腕", en: "pulling close by the wrist of" },
      { zh: "比手大小", en: "comparing hand sizes with, palm to palm" },
      { zh: "间接接吻", en: "sharing food with, indirect kiss" },
      { zh: "击掌", en: "high five with, fist bump" },
      { zh: "搂肩", en: "arm around shoulder of" },
      { zh: "搂腰", en: "arm around waist of" },
      { zh: "面对面下棋", en: "board game, chessboard, sitting across, facing each other, playing chess" },
      { zh: "下棋", en: "board game, chessboard, playing chess" },
      { zh: "教滑板", en: "teaching, guiding, instruction" },
      { zh: "滑板", en: "skateboard" },
    ],

    /* ========================================================================
     * 【关系】管“两个人是什么关系”。双人/多人用，与【数量】合成一句。
     * ======================================================================*/

    /* ========================================================================
     * 【性别】管“人物的性别/身份”。和【种族】配合，与数量一起拼成“n + 性别 + 种族”。
     * 豆包做“人物添加”结构时用这个；词是现成 booru 词。
     * ======================================================================*/
    genders: [
      { zh: "女", en: "girl" },
      { zh: "男", en: "boy" },
      { zh: "扶他", en: "futanari" },
      { zh: "伪娘", en: "femboy" },
      { zh: "人妖", en: "shemale" },
      { zh: "跨性别女", en: "trans girl", nsfw: true },
      { zh: "男同性恋", en: "yaoi" },
      { zh: "女同性恋", en: "lesbian" },
      { zh: "男童", en: "shota boy" },
      { zh: "女童", en: "loli girl" },
    ],

    /* ========================================================================
     * 【种族】管“物种/兽娘”。和【性别】配合。词是现成 booru 词。
     * ======================================================================*/
    races: [
      { zh: "人类", en: "" },
      { zh: "魅魔", en: "succubus" },
      { zh: "猫娘", en: "catgirl" },
      { zh: "兔娘", en: "rabbit girl" },
      { zh: "狼娘", en: "wolf girl" },
      { zh: "狐娘", en: "fox girl" },
      { zh: "雪女", en: "yukionna" },
      { zh: "吸血鬼娘", en: "vampire girl" },
      { zh: "美人鱼", en: "mermaid" },
      { zh: "精灵", en: "elf girl" },
      { zh: "兽人", en: "beast girl" },
      { zh: "恶魔", en: "demon girl" },

      // —— v2.0 扩：科幻/魔物 ——
      { zh: "魔物娘", en: "monster girl" },
      { zh: "机器人", en: "robot" },
      { zh: "仿生人", en: "android" },
      { zh: "半机械人", en: "cyborg" },
      { zh: "外星女孩", en: "alien girl" },
    ],

    /* ========================================================================
     * 【地区】管“人种/位置”。和【种族(物种)】分开。词是现成 booru 词。
     * ======================================================================*/
    regions: [
      { zh: "亚洲", en: "asian" },
      { zh: "东亚", en: "east asian" },
      { zh: "日本", en: "japanese" },
      { zh: "中国", en: "chinese" },
      { zh: "韩国", en: "korean" },
      { zh: "欧洲", en: "european" },
      { zh: "白人", en: "caucasian" },
      { zh: "北欧", en: "nordic" },
      { zh: "欧美", en: "western" },
    ],

    /* ========================================================================
     * 【气质/人设】管“角色气质/类型”。和种族/性别/特征配合。词是现成 booru 词。
     * ======================================================================*/
    personas: [
      { zh: "萝莉", en: "loli" },
      { zh: "少女", en: "shoujo" },
      { zh: "御姐", en: "onee-san, mature woman" },
      { zh: "熟女", en: "milf, mature" },
      { zh: "女高中生", en: "JK, high school girl" },
      { zh: "女大学生", en: "college girl" },
      { zh: "OL", en: "office lady" },
      { zh: "人妻", en: "wife" },
      { zh: "女仆", en: "maid" },
      { zh: "护士", en: "nurse" },
      { zh: "教师", en: "teacher" },
      { zh: "空姐", en: "stewardess, flight attendant" },
      { zh: "偶像", en: "idol" },
      { zh: "大小姐", en: "ojou-sama" },
      { zh: "邻家女孩", en: "neighbor girl" },
      { zh: "傲娇", en: "tsundere" },
      { zh: "病娇", en: "yandere" },
      { zh: "辣妹", en: "gyaru" },
      { zh: "三无", en: "kuudere" },
      { zh: "元气", en: "genki" },
      { zh: "温柔", en: "gentle" },
      { zh: "高冷", en: "cool, aloof" },
      { zh: "甜美", en: "sweet" },
      { zh: "淫荡", en: "slutty", nsfw: true },
      { zh: "顺从", en: "submissive" },
      { zh: "女王", en: "queen, dominatrix" },

      // —— v2.0 扩：职业身份 ——
      { zh: "OL白领", en: "office lady, business woman" },
      { zh: "女老板", en: "female boss" },
      { zh: "秘书", en: "secretary" },
      { zh: "新员工", en: "new employee" },
      { zh: "家庭教师", en: "tutor, private lesson" },
      { zh: "医生", en: "doctor" },
      { zh: "夜班护士", en: "night shift nurse" },
      { zh: "女服务员", en: "waitress" },
      { zh: "前台", en: "receptionist" },
      { zh: "店员", en: "shop clerk" },
      { zh: "便利店店员", en: "convenience store clerk" },
      { zh: "女警", en: "policewoman, female officer" },
      { zh: "客舱乘务员", en: "cabin attendant" },
      { zh: "电梯小姐", en: "elevator girl" },
      { zh: "赛车皇后", en: "race queen" },
      { zh: "巫女", en: "shrine maiden, miko" },
      { zh: "写真偶像", en: "gravure model" },
      { zh: "熟女", en: "mature woman, elegant lady" },
      { zh: "素人", en: "amateur girl, natural beauty" },
      { zh: "女大学生", en: "college girl, university student" },
    ],

    /* ========================================================================
     * 【特征】管“人物外观细节”。和种族/性别/气质配合。词是现成 booru 词。
     * ======================================================================*/
    hairLength: [
      { zh: "长发", en: "long hair" },
      { zh: "短发", en: "short hair" },
      { zh: "中长发", en: "medium hair" },
      { zh: "齐肩发", en: "shoulder-length hair" },
      { zh: "及腰长发", en: "waist-length hair" },
      { zh: "超长发", en: "very long hair" },
      { zh: "波波头", en: "bob cut" },
      { zh: "披肩发", en: "long straight hair down" },
      { zh: "马尾", en: "ponytail" },
      { zh: "双马尾", en: "twin tails, pigtails" },

      // —— v2.0 扩：具体发型 ——
      { zh: "侧马尾", en: "side ponytail" },
      { zh: "高马尾", en: "high ponytail" },
      { zh: "低马尾", en: "low ponytail" },
      { zh: "编发马尾", en: "braided ponytail" },
      { zh: "丸子头", en: "messy bun, bun" },
      { zh: "双丸子头", en: "double bun" },
      { zh: "半扎发", en: "half up half down" },
      { zh: "直发", en: "straight hair" },
      { zh: "波浪发", en: "wavy hair" },
      { zh: "卷发", en: "curly hair" },
      { zh: "凌乱发", en: "messy hair, bed hair, tousled hair" },
      { zh: "风吹发", en: "wind-blown hair" },
      { zh: "姬发式", en: "hime cut" },
      { zh: "齐刘海", en: "blunt bangs" },
      { zh: "斜刘海", en: "side-swept bangs" },
      { zh: "遮眼发", en: "hair over one eye" },
      { zh: "不对称发", en: "asymmetrical hair" },
      { zh: "湿发", en: "wet hair, damp hair, dripping wet hair" },
      { zh: "发带", en: "hair ribbon, hair bow" },
      { zh: "花发饰", en: "hair flower, hair ornament" },
      { zh: "发夹", en: "hairclip, headband, hairpin" },
    ],
    hairColor: [
      { zh: "黑发", en: "black hair" },
      { zh: "棕发", en: "brown hair" },
      { zh: "金发", en: "blonde hair, blond" },
      { zh: "粉发", en: "pink hair" },
      { zh: "蓝发", en: "blue hair" },
      { zh: "紫发", en: "purple hair" },
      { zh: "红发", en: "red hair" },
      { zh: "银白发", en: "silver hair, white hair" },
      { zh: "灰发", en: "gray hair, grey hair" },
      { zh: "挑染", en: "streaked hair, highlighted" },
    ],
    eyeColor: [
      { zh: "黑瞳", en: "black eyes" },
      { zh: "棕瞳", en: "brown eyes" },
      { zh: "蓝瞳", en: "blue eyes" },
      { zh: "绿瞳", en: "green eyes" },
      { zh: "灰瞳", en: "gray eyes" },
      { zh: "琥珀瞳", en: "amber eyes" },
      { zh: "红瞳", en: "red eyes" },
      { zh: "紫瞳", en: "purple eyes" },
      { zh: "异色瞳", en: "heterochromia, different colored eyes" },
      // —— 蓝/红/黑眼 口语键（大阿总 09-14，老秦确认补；danbooru 蓝眼|碧眼/红眼|赤目/黑眼睛；词库已有蓝瞳/红瞳/黑瞳不撞，en 对齐 danbooru 空格形式 norm 归一=下划线）——
      { zh: "蓝眼", en: "blue eyes" },
      { zh: "红眼", en: "red eyes" },
      { zh: "黑眼", en: "black eyes" },
    ],
    eyeShape: [
      { zh: "大眼", en: "large eyes" },
      { zh: "猫眼", en: "cat eyes, almond eyes" },
      { zh: "狐狸眼", en: "fox eyes, sharp eyes" },
      { zh: "垂眼", en: "droopy eyes, downturned eyes" },
      { zh: "凤眼", en: "upturned eyes" },
      { zh: "单眼皮", en: "monolid" },
      { zh: "双眼皮", en: "double eyelids" },
      { zh: "圆眼", en: "round eyes" },
      { zh: "细长眼", en: "narrow eyes" },
    ],
    bodyType: [
      { zh: "娇小", en: "petite, small" },
      { zh: "高挑", en: "tall, statuesque" },
      { zh: "苗条", en: "slim, slender" },
      { zh: "丰满", en: "curvy, voluptuous" },
      { zh: "匀称", en: "average build, well-proportioned" },
      { zh: "肉感", en: "soft body, plump" },
      { zh: "清瘦", en: "lean, thin" },
      { zh: "凹凸有致", en: "hourglass figure" },
    ],
    bustSize: [
      { zh: "平胸", en: "flat chest, petite chest" },
      { zh: "小胸", en: "small breasts" },
      { zh: "大胸", en: "large breasts" },
      { zh: "巨乳", en: "huge breasts, massive breasts", nsfw: true },
      { zh: "傲人", en: "impressive breasts" },
      { zh: "自然胸", en: "natural breasts" },
      { zh: "蜜乳", en: "plump breasts", nsfw: true },
      { zh: "弹软", en: "bouncy breasts, soft breasts" },
    ],
    otherFeatures: [
      { zh: "戴眼镜", en: "glasses" },
      { zh: "戴耳环", en: "earrings" },
      { zh: "戴项链", en: "necklace" },
      { zh: "戴项圈", en: "choker, collar" },
      { zh: "手链", en: "bracelet" },
      { zh: "戒指", en: "ring" },
      { zh: "发饰", en: "hair ornament" },
      { zh: "蝴蝶结", en: "bow, ribbon" },
      { zh: "领结", en: "bow tie" },
      { zh: "泪痣", en: "beauty mark under eye" },
      { zh: "雀斑", en: "freckles" },
      { zh: "胎记", en: "birthmark" },
      { zh: "酒窝", en: "dimples" },
      { zh: "红唇", en: "red lips, glossy lips" },
      { zh: "虎牙", en: "fangs, fang" },
      { zh: "长腿", en: "long legs" },
      { zh: "细腰", en: "slender waist, narrow waist" },
      { zh: "翘臀", en: "large hips, curvy hips" },
      { zh: "白丝", en: "white thighhighs" },
      { zh: "黑丝", en: "black thighhighs" },
      { zh: "高跟", en: "high heels" },
      { zh: "美甲", en: "nail art, manicure" },
    ],

    /* ========================================================================
     * 【尾巴/翅膀】管“兽娘/恶魔/天使的尾与翼”。和【种族】配合。
     * ======================================================================*/
    tailWings: [
      { zh: "狐狸尾", en: "fox tail" },
      { zh: "猫尾", en: "cat tail" },
      { zh: "兔尾", en: "bunny tail" },
      { zh: "狼尾", en: "wolf tail" },
      { zh: "恶魔尾", en: "demon tail, devil tail" },
      { zh: "魅魔尾", en: "succubus tail, heart-tipped tail" },
      { zh: "羽翼", en: "wings, angel wings" },
      { zh: "蝙蝠翼", en: "bat wings" },
      { zh: "恶魔翼", en: "demon wings, black wings" },
      { zh: "蝴蝶翼", en: "butterfly wings" },
      { zh: "龙翼", en: "dragon wings" },
    ],

    /* ========================================================================
     * 【风格】管“画风”。现在是【多选】——最多选 2 个（一个主风格 + 一个副风格），
     * 选中的风格英文会一起输出；每个风格会自动带出“推荐光影 light”。
     * 结构是“大组 → 小项”（和表情/动作/场景一样）：
     *   大组格式：{ g:"组名", nsfw:false, items:[ ...小按钮... ] }
     *   小按钮格式：{ zh:"中文名", en:"风格英文", light:"选它时自动带的光影，没有就留空 light:\"\"" },
     * 想新增大组：照抄一整个 { g:"...", items:[ ... ] } 块；想在大组里加词，就在 items 里照抄一行。
     * ======================================================================*/
    styles: [
      {
        g: "二次元风格", nsfw: false, items: [
          { zh: "日系动漫", en: "anime style, cel shading, clean lineart, bright colors", light: "soft lighting" },
          { zh: "韩漫", en: "korean style, korean webtoon, elegant, sophisticated, soft makeup, modern fashion, magazine cover, sharp eyes, glossy lips", light: "studio lighting, soft lighting" },
          { zh: "黑白漫画", en: "manga, black and white, screentone, ink lines", light: "hard lighting" },
          { zh: "Q版可爱", en: "chibi, cute, big head, small body, simple shading", light: "soft lighting" },
          { zh: "像素风", en: "pixel art, 16-bit, retro game, sprite", light: "" },
          { zh: "少女漫画", en: "shoujo manga style, soft pastels, delicate lines, sparkles", light: "soft lighting" },
          { zh: "轻小说封面", en: "light novel cover style, detailed illustration, vibrant colors", light: "soft lighting" },
          { zh: "游戏CG", en: "game cg, key visual, detailed game illustration", light: "dramatic lighting" },
          { zh: "新海诚电影感", en: "anime film style, dramatic sky, detailed clouds, cinematic atmosphere", light: "golden hour, volumetric lighting" },
          { zh: "吉卜力童话风", en: "studio ghibli style, hand-painted background, warm colors", light: "soft lighting, warm lighting" },
          { zh: "2.5D半写实", en: "2.5d, semi-realistic anime style, detailed soft shading", light: "soft lighting, rim light" },
          { zh: "三渲二", en: "3d anime style, toon shading, cel-shaded 3d render", light: "soft lighting, rim light" },
          { zh: "赛璐璐平涂", en: "cel shading, flat color, clean lineart, anime coloring", light: "" },
          { zh: "厚涂插画", en: "painterly anime illustration, detailed shading, rich brushwork", light: "dramatic lighting" },
          { zh: "萌系软萌", en: "moe style, soft pastel colors, cute", light: "soft lighting" },
          { zh: "治愈系", en: "healing anime style, iyashikei, warm soft colors", light: "soft lighting, warm lighting" },
          { zh: "少年热血漫", en: "shonen manga style, bold lines, speed lines, dynamic", light: "dramatic lighting" },
          { zh: "乙女游戏", en: "otome game art, dating sim illustration, detailed eyes", light: "soft lighting" },
          { zh: "角色立绘", en: "character art, official art, standing illustration", light: "" },
          { zh: "卡牌插画", en: "trading card illustration, highly detailed, glowing", light: "dramatic lighting" },
          { zh: "动画截图", en: "anime screencap, modern anime, tv anime still", light: "natural lighting" },
          { zh: "京阿尼风", en: "kyoto animation style, soft detailed, fluid animation", light: "soft lighting" },
          { zh: "90年代复古动画", en: "90s anime style, retro anime, traditional cel animation, film grain", light: "warm lighting" },
          { zh: "80年代复古动画", en: "1980s anime style, bold lines, vhs aesthetic, retro", light: "neon lighting" },
          { zh: "线稿风", en: "lineart, sketch, monochrome line art", light: "" },
          { zh: "扁平插画", en: "flat illustration, flat color, vector style", light: "" },
          { zh: "水彩动漫", en: "watercolor anime, soft paint, gentle colors", light: "soft lighting, natural lighting" },
          { zh: "暗黑系动漫", en: "dark anime, moody atmosphere, high contrast", light: "dramatic lighting" },
          { zh: "美式卡通", en: "western cartoon style, bold outline, expressive", light: "" },
          { zh: "贴纸风", en: "sticker style, white outline, die-cut sticker", light: "" },
        ]
      },
      {
        g: "真实风格", nsfw: false, items: [
          { zh: "半写实清透", en: "semi-realistic, 2.5d, highly detailed face, detailed eyes, realistic skin texture, subsurface scattering", light: "soft cinematic lighting, rim light, soft shadows, depth of field, glossy skin" },
          { zh: "真人照片感", en: "photorealistic, raw photo, ultra realistic, detailed skin texture, film grain", light: "natural lighting, soft shadows, depth of field" },
          { zh: "电影剧照", en: "cinematic still, film still, movie frame, anamorphic lens, film grain", light: "cinematic lighting, lens flare" },
          { zh: "黑白胶片", en: "monochrome, black and white, film photography, grainy", light: "hard lighting, dramatic lighting" },
          { zh: "胶片摄影", en: "film photography, analog photo, 35mm film", light: "natural lighting" },
          { zh: "复古胶片", en: "vintage photograph, retro film look, faded colors", light: "warm lighting" },
          { zh: "宝丽来", en: "polaroid, instant photo, retro colors", light: "natural lighting" },
          { zh: "纪实摄影", en: "documentary photography, candid, natural light", light: "natural lighting" },
          { zh: "街头摄影", en: "street photography, urban, candid", light: "natural lighting" },
          { zh: "时尚杂志", en: "fashion editorial, magazine photography, studio flash", light: "studio lighting, harsh lighting" },
          { zh: "商业棚拍", en: "studio photography, commercial photo, clean background", light: "studio lighting, soft lighting" },
          { zh: "黑色电影", en: "film noir, black and white, high contrast, dramatic shadows", light: "harsh lighting, dramatic lighting" },
        ]
      },
      {
        g: "幻想风格", nsfw: false, items: [
          { zh: "厚涂油画", en: "thick impasto, oil painting, painterly, visible brush strokes, artstation trend, rich colors", light: "dramatic lighting, volumetric lighting" },
          { zh: "皮克斯3D", en: "3d render, octane render, unreal engine 5, cgi, rounded shapes", light: "soft global illumination, rim light, subsurface scattering" },
          { zh: "仿真3D写实", en: "photorealistic, 3d render, octane render, realistic, ultra detailed, sharp focus, glossy skin, realistic skin texture", light: "studio lighting, dramatic lighting, realistic shadows, soft light" },
          { zh: "水彩手绘", en: "watercolor, soft paint, paper texture, gentle colors", light: "soft lighting, natural lighting" },
          { zh: "赛博朋克", en: "cyberpunk, neon, futuristic, dystopian, holograms", light: "neon lighting, dramatic lighting" },
          { zh: "蒸汽朋克", en: "steampunk, victorian, brass, gears, mechanical", light: "warm lighting, dramatic lighting" },
          { zh: "暗黑哥特", en: "gothic, dark fantasy, moody, ornate details", light: "dramatic lighting, candlelight" },
          { zh: "奇幻史诗", en: "epic fantasy, high fantasy, majestic, detailed", light: "dramatic lighting, volumetric lighting" },
          { zh: "童话绘本", en: "storybook illustration, children's book art, whimsical", light: "soft lighting, warm lighting" },
          { zh: "概念设计", en: "concept art, key art, matte painting, artstation", light: "dramatic lighting" },
          { zh: "低多边形", en: "low poly, 3d render, geometric shapes", light: "" },
          { zh: "故障艺术", en: "glitch art, chromatic aberration, datamosh", light: "neon lighting" },
          { zh: "蒸汽波", en: "vaporwave, retro 80s, pastel pink and cyan, neon grid", light: "neon lighting" },
        ]
      },
      {
        g: "国风·东方", nsfw: false, items: [
          { zh: "水墨写意", en: "ink wash painting, chinese painting, sumi-e, brush strokes", light: "" },
          { zh: "古风仙侠", en: "ancient chinese style, hanfu, xianxia, ethereal, oriental fantasy", light: "soft lighting" },
          { zh: "敦煌壁画", en: "dunhuang mural, chinese fresco, ornate, gold accents", light: "" },
          { zh: "浮世绘", en: "ukiyo-e, japanese woodblock print, flat colors", light: "" },
        ]
      },
      {
        g: "固定风格", nsfw: false, items: [
          { zh: "星海乘风", en: "ethereal, galaxy, starry sky, sea of stars, celestial glow, flowing light, ancient chinese fantasy", light: "moonlight, god rays" },
          { zh: "最终幻想风", en: "final fantasy style, jrpg art, fantasy illustration, painterly", light: "dramatic lighting" },
          { zh: "迪士尼动画", en: "disney style, 3d cartoon, family animation, colorful", light: "soft lighting, rim light" },
        ]
      },

      // —— v2.0 扩：摄影风格 ——
      {
        g: "摄影·风格", nsfw: false, items: [
          { zh: "电影剧照", en: "cinematic film still", light: "cinematic lighting" },
          { zh: "时尚大片", en: "fashion editorial, high fashion photography", light: "studio lighting, softbox" },
          { zh: "复古抓拍", en: "vintage photo, candid shot, documentary style", light: "natural lighting" },
          { zh: "街拍", en: "street photography style", light: "natural lighting" },
          { zh: "夜景摄影", en: "night photography", light: "neon lighting, moonlight" },
          { zh: "黄金时刻人像", en: "golden hour portrait", light: "golden hour, warm lighting" },
          { zh: "影棚人像", en: "studio portrait, professional photography", light: "studio lighting, softbox, ring light" },
          { zh: "纪实冷淡", en: "muted colors, documentary tone, desaturated, flat contrast", light: "natural lighting, overcast" },
        ]
      },
      // —— v2.0 扩：胶片模拟 ——
      {
        g: "胶片·模拟", nsfw: false, items: [
          { zh: "Kodak Portra 400", en: "Kodak Portra 400, warm skin tones, fine grain, soft contrast, pastel colors, creamy skin, natural warmth", light: "warm lighting, soft lighting" },
          { zh: "Kodak Gold 200", en: "Kodak Gold 200, warm nostalgic tones, slightly grainy, golden cast, snapshot feel, home movie aesthetic", light: "warm lighting" },
          { zh: "Kodak Ektar 100", en: "Kodak Ektar 100, vivid saturated colors, rich reds, deep blues, ultra sharp, magazine quality", light: "natural lighting" },
          { zh: "Fujifilm Superia 400", en: "Fujifilm Superia 400, warm color cast, everyday snapshot, consumer film look, faded contrast", light: "natural lighting" },
          { zh: "Cinestill 800T", en: "Cinestill 800T, tungsten balanced, blue-ish shadows, cinematic halation, night scene ready", light: "neon lighting, moonlight" },
          { zh: "Fujifilm Velvia 50", en: "Fujifilm Velvia 50, vivid saturated colors, rich greens, punchy, landscape colors", light: "natural lighting" },
          { zh: "Fujifilm Pro 400H", en: "Fujifilm Pro 400H, soft pastel, low contrast, dreamy, ethereal skin, airy colors", light: "soft lighting, natural lighting" },
          { zh: "Fujifilm Classic Chrome", en: "Fujifilm Classic Chrome, muted colors, documentary tone, desaturated, flat contrast, real-world feel", light: "natural lighting, overcast" },
          { zh: "Fujifilm Classic Negative", en: "Fujifilm Classic Negative, retro muted, faded warmth, 90s film look, nostalgic mood, warm shadows", light: "warm lighting" },
          { zh: "Kodak Tri-X 400", en: "Kodak Tri-X 400, high contrast B&W, gritty grain, street photography, raw", light: "hard lighting, dramatic lighting" },
          { zh: "拍立得", en: "polaroid, instant film, faded polaroid", light: "flash, warm lighting" },
          { zh: "失效胶片", en: "expired film, color shift, unpredictable tint", light: "warm lighting" },
          { zh: "一次性相机", en: "disposable camera, harsh flash, grainy, candid", light: "flash" },
          { zh: "VHS录像带", en: "VHS quality, analog video artifacts, scan lines", light: "" },
          { zh: "交叉冲洗", en: "cross processing, color cast, weird tint", light: "" },
        ]
      },
      // —— v2.0 扩：电影镜头风格 ——
      {
        g: "电影·镜头", nsfw: false, items: [
          { zh: "变形宽银幕", en: "anamorphic lens flare, oval bokeh, horizontal flare", light: "cinematic lighting" },
          { zh: "ARRI电影机", en: "ARRI look, cinematic color grading, filmic contrast", light: "cinematic lighting" },
          { zh: "韦斯安德森", en: "Wes Anderson style, symmetrical, pastel palette", light: "soft lighting, warm lighting" },
          { zh: "老动画风", en: "90s anime style, retro anime, cel shading", light: "warm lighting" },
          { zh: "纯自然光", en: "natural light only, available light photography", light: "natural lighting" },
          { zh: "手持感", en: "handheld camera feel, slight motion blur", light: "" },
        ]
      },
    ],

    /* ========================================================================
     * 下面 表情 / 动作 / 服装 / 场景 是“两级结构”：先分大项(g)，大项里再放小按钮(items)。
     * 大项格式：           { g:"这个大项的中文名", nsfw:false, items:[ ...里面放一行行小按钮... ] }
     *   - nsfw:false = 正经/露骨都显示；nsfw:true = 只有“露骨模式”才显示（正经时自动隐藏、也不会被随机到）
     * 小按钮格式（和别处一样）：{ zh:"中文名", en:"英文标签" },
     * 想新增大项：照抄一整个 { g:"...", items:[ ... ] } 块；想在大项里加词，就在 items 里照抄一行。
     * ======================================================================*/

    /* 【表情情绪】现在【可多选】，点几个是几个。露骨大项保持空壳，以后自己往里加。 */
    expressions: [
      {
        g: "正经常用", nsfw: false, items: [
          { zh: "微笑", en: "smile" },
          { zh: "轻笑", en: "light smile" },
          { zh: "面无表情", en: "expressionless" },
          { zh: "害羞", en: "blush" },
          { zh: "闭眼", en: "closed eyes" },
          { zh: "微张唇", en: "parted lips" },
          { zh: "大笑", en: "laughing" },
          { zh: "露齿笑", en: "grin" },
          { zh: "坏笑", en: "smirk" },
          { zh: "傻笑", en: "giggling" },
          { zh: "得意", en: "smug" },
          { zh: "开心", en: "happy" },
          { zh: "温柔笑", en: "kind smile" },
          { zh: "苦笑", en: "wry smile" },
          { zh: "悲伤", en: "sad" },
          { zh: "哭泣", en: "crying" },
          { zh: "含泪", en: "tearing up" },
          { zh: "流泪", en: "tears" },
          { zh: "泪流满面", en: "streaming tears" },
          { zh: "啜泣", en: "sobbing" },
          { zh: "惊讶", en: "surprised" },
          { zh: "震惊", en: "shocked" },
          { zh: "困惑", en: "confused" },
          { zh: "发呆", en: "blank stare" },
          { zh: "思考中", en: "thinking" },
          { zh: "困倦", en: "sleepy" },
          { zh: "打哈欠", en: "yawning" },
          { zh: "疲惫", en: "exhausted" },
          { zh: "无聊", en: "bored" },
          { zh: "生气", en: "angry" },
          { zh: "怒视", en: "glaring" },
          { zh: "不爽", en: "annoyed" },
          { zh: "闹别扭", en: "sulking" },
          { zh: "嘟嘴", en: "pouting" },
          { zh: "皱眉", en: "frown" },
          { zh: "认真", en: "serious" },
          { zh: "紧张", en: "nervous" },
          { zh: "害怕", en: "scared" },
          { zh: "慌张", en: "flustered" },
          { zh: "冒汗", en: "sweatdrop" },
          { zh: "尴尬", en: "embarrassed" },
          { zh: "腼腆", en: "shy" },
          { zh: "眨眼", en: "wink" },
          { zh: "睁大眼", en: "wide eyes" },
          { zh: "眯眼", en: "narrowed eyes" },
          { zh: "星星眼", en: "starry eyes" },
          { zh: "心心眼", en: "heart eyes" },
          { zh: "张嘴", en: "open mouth" },
          { zh: "吐舌", en: "tongue out" },
          { zh: "咬唇", en: "lip biting" },
          { zh: "捂脸", en: "facepalm" },
          { zh: "嫉妒", en: "envy" },
          { zh: "孤独", en: "lonely" },
          { zh: "嫌弃", en: "jitome" },
          { zh: "坚定", en: "determined" },
          { zh: "沮丧", en: "frustrated" },
          { zh: "绝望", en: "despair" },
        ]
      },
      { g: "露骨（仅露骨模式显示）", nsfw: true, items: [
          { zh: "魅惑", en: "sultry gaze, seductive smile, half-closed eyes" },
          { zh: "挑逗", en: "licking lips, biting lower lip, come-hither look" },
          { zh: "高潮脸", en: "ecstatic expression, open mouth moaning, arched eyebrows" },
          { zh: "服从", en: "submissive look, pleading eyes, vulnerable expression" },
          { zh: "淫荡", en: "lustful, lewd, ahegao" },
          { zh: "失神", en: "glassy eyes, spaced out" },
          { zh: "害羞脸红", en: "shy expression, blushing cheeks, looking away" },
          { zh: "呻吟", en: "moaning, mouth open" },
          { zh: "喘息", en: "panting, gasping, parted lips" },
          { zh: "翻白眼", en: "rolling eyes, ahegao" },
          { zh: "流口水", en: "drooling, drool" },
          { zh: "泪眼", en: "teary eyes, tears forming, crying" },
          { zh: "痛苦（又痛又爽）", en: "pained expression, wincing, pained yet aroused" },
          { zh: "强忍不出声", en: "expression of someone trying not to make noise" },
          { zh: "撒娇", en: "whining, pleading, cute pout" },
          { zh: "出神/失禁", en: "out of control, overwhelmed, trembling" },
        ] },

      // —— v2.0 扩：表情细分 ——
      {
        g: "表情·细分", nsfw: false, items: [
          { zh: "害羞羞涩", en: "shy, embarrassed, blushing, hiding face, looking away bashfully, flushed cheeks" },
          { zh: "俏皮", en: "playful smile, winking, tongue out, teasing grin, mischievous look, cheeky expression, sly grin" },
          { zh: "惊恐", en: "shocked expression, eyes wide in panic, deer in headlights, hand to mouth in surprise" },
          { zh: "恍惚", en: "dazed expression, glazed eyes, unfocused gaze, trance-like stare" },
          { zh: "隐忍", en: "biting back words, hand over mouth, tensed jaw, trying to stay quiet" },
          { zh: "冷淡", en: "bored expression, deadpan face, unimpressed look, blank stare" },
          { zh: "魅惑", en: "sultry gaze, bedroom eyes, seductive smile, half-closed eyes, licking lips, biting lower lip, smoldering gaze, knowing smirk" },
        ]
      },
      // —— v2.0 扩：眼神专项 ——
      {
        g: "眼神·专项", nsfw: false, items: [
          { zh: "勾引眼神", en: "looking up through lower lashes, seductive sidelong glance, glancing back over shoulder, batting eyelashes, coy look" },
          { zh: "迷离失神", en: "eyes half-lidded, glassy eyes, heavy eyelids, dazed expression, vacant stare" },
          { zh: "羞耻回避", en: "looking away, avoiding eye contact, downcast eyes, hiding eyes behind hair" },
          { zh: "放空", en: "looking at nothing, blank gaze, eyes losing focus" },
          { zh: "惊恐被抓", en: "eyes wide, shocked stare, caught off guard look" },
          { zh: "湿润含泪", en: "teary-eyed, moist eyes, glistening eyes, watery eyes" },
          { zh: "眼神接触", en: "looking at viewer, eye contact" },
          { zh: "仰视眼神", en: "looking up, upward gaze" },
          { zh: "俯视眼神", en: "looking down, downward gaze" },
          { zh: "侧视", en: "looking to the side, sideways glance" },
        ]
      },
      // —— v2.0 扩：嘴部状态 ——
      {
        g: "嘴部·状态", nsfw: false, items: [
          { zh: "闭合", en: "closed mouth, pressed lips, pursed lips, slight frown" },
          { zh: "微张", en: "parted lips, slightly open mouth, mouth agape" },
          { zh: "咬唇", en: "biting lip, biting lower lip, lip bite" },
          { zh: "吐舌", en: "tongue out, licking lips, sticking out tongue" },
          { zh: "湿润唇", en: "wet lips, glossy lips" },
        ]
      },
    ],

    /* 【动作】现在【可多选】。几个人由【人数】管；一次可点多个动作。 */
    actions: [
      {
        g: "不露骨", nsfw: false, items: [
          { zh: "站", en: "standing" },
          { zh: "坐", en: "sitting" },
          { zh: "躺", en: "lying" },
          { zh: "回头", en: "looking back" },
          { zh: "直视镜头", en: "looking_at_viewer" },
          { zh: "看着另一人", en: "looking_at_another" },
          { zh: "互相对视", en: "looking_at_each_other" },
          { zh: "双手抱胸", en: "arms crossed" },
          { zh: "叉腰", en: "hand on hip" },
          { zh: "走路", en: "walking" },
          { zh: "跑步", en: "running" },
          { zh: "跳跃", en: "jumping" },
          { zh: "跳舞", en: "dancing" },
          { zh: "跪地", en: "kneeling" },
          { zh: "蹲下", en: "squatting" },
          { zh: "盘腿坐", en: "cross-legged" },
          { zh: "正坐", en: "seiza" },
          { zh: "仰躺", en: "on back" },
          { zh: "趴着", en: "on stomach" },
          { zh: "靠墙", en: "leaning against wall" },
          { zh: "前倾", en: "leaning forward" },
          { zh: "伸懒腰", en: "stretching" },
          { zh: "高举双手", en: "arms up" },
          { zh: "双手背后", en: "arms behind back" },
          { zh: "双手抱头", en: "arms behind head" },
          { zh: "双手叉腰", en: "hands on hips" },
          { zh: "挥手", en: "waving" },
          { zh: "招手", en: "beckoning" },
          { zh: "敬礼", en: "saluting" },
          { zh: "比耶", en: "v sign" },
          { zh: "竖拇指", en: "thumbs up" },
          { zh: "比心", en: "heart hands" },
          { zh: "指向前方", en: "pointing" },
          { zh: "托腮", en: "hand on cheek" },
          { zh: "遮嘴", en: "covering mouth" },
          { zh: "整理头发", en: "adjusting hair" },
          { zh: "撩发", en: "hair flip" },
          { zh: "鞠躬", en: "bowing" },
          { zh: "读书", en: "reading" },
          { zh: "做饭", en: "cooking" },
          { zh: "睡觉", en: "sleeping" },
          { zh: "牵手", en: "holding hands" },
          { zh: "游泳", en: "swimming" },
        ]
      },
      { g: "露骨·姿势", nsfw: true, items: [
          { zh: "后入", en: "sex_from_behind, bent_over, all_fours" },
          { zh: "后入·抓腰顶", en: "doggy style, hands gripping hips, thrusting" },
          { zh: "后入·趴着撅臀", en: "from behind, face down, back arched, hair falling forward" },
          { zh: "站立后入", en: "standing from behind, pressed against wall" },
          { zh: "桌上后入", en: "standing bent over table, from behind" },
          { zh: "女上位", en: "cowgirl_position, girl_on_top, riding" },
          { zh: "男上位", en: "missionary" },
          { zh: "正常位", en: "missionary" },
          { zh: "反向女上位", en: "reverse_cowgirl_position, facing away, hands on thighs, bouncing" },
          { zh: "女上位·起伏", en: "cowgirl_position, girl_on_top, riding, bouncing" },
          { zh: "传教士", en: "missionary, weight on partner, hands pinned beside head" },
          { zh: "传教士·腿搭肩", en: "missionary, legs over shoulders, deep" },
          { zh: "侧入", en: "spooning, sideway" },
          { zh: "坐莲", en: "lotus position, yab yum, facing each other" },
          { zh: "腿交", en: "thigh sex, intercrural" },
          { zh: "站姿", en: "standing sex, against wall" },
          { zh: "夹击", en: "on all fours, one behind, one in front" },
          { zh: "坐脸", en: "facesitting, face sitting" },
          { zh: "磨蹭·磨镜", en: "tribadism, scissoring, grinding" },
          { zh: "跪坐·大字", en: "kneeling, seiza, thighs spread wide, exposed" },
          { zh: "蹲站·张腿", en: "squatting, legs spread, exposed" },
          { zh: "靠墙·抬腿", en: "standing with legs spread against wall, one leg raised" },
          { zh: "躺·双脚抬高", en: "lying with legs raised, legs up, missionary" },
          { zh: "床上·跪坐", en: "kneeling on bed, thighs spread, looking up, submissive" },
          { zh: "掰开臀部", en: "ass spread, presenting, showing pussy from behind" },
          { zh: "诱惑姿势", en: "seductive pose, enticing pose, teasing" },
          { zh: "双腿分开", en: "legs apart, thighs open, spread legs" },
          { zh: "跪姿后入", en: "kneeling doggystyle, on knees, from behind" },
          { zh: "自慰姿势", en: "masturbating pose, self-pleasure" },
          { zh: "舔嘴唇", en: "licking lips, tongue on lip" },
          { zh: "手放胸前", en: "hands on breasts, cupping chest" },
          { zh: "大腿张开", en: "thighs spread open, wide legs" },
          { zh: "后背弓起", en: "back arched, arching back" },
          { zh: "手指玩弄", en: "fingering, playing with fingers" },
          { zh: "后入姿势", en: "doggy style pose, from behind pose" },
          { zh: "骑乘位", en: "cowgirl_position" },
          { zh: "潮吹表情", en: "ahegao, climax" },
          { zh: "液体与潮吹反应", en: "wet, female_ejaculation" },
          { zh: "跪姿口交深度", en: "kneeling deep throat, full depth oral" },
          { zh: "传教士与种付", en: "missionary, impregnation, cum_in_pussy" },
          { zh: "足交与腿交", en: "footjob, footjob and thigh sex" },
          { zh: "多人前后夹击", en: "spit roast, one front one back, sandwiched" },
          { zh: "自慰与暴露展示", en: "masturbating, exposing, showing off" },
          { zh: "攻守反转支配", en: "facedown, dominated, reverse control" },
          { zh: "三人", en: "threesome, three people" },
          { zh: "四人", en: "foursome, four people" },
        ] },
      { g: "露骨·口部", nsfw: true, items: [
          { zh: "口交", en: "oral" },
          { zh: "深喉", en: "deep throat, throat, full depth" },
          { zh: "全含·鼻顶", en: "fully engulfed, nose touching pelvis, no shaft visible" },
          { zh: "口爆·吞", en: "irrumatio, cum in mouth, swallowing" },
          { zh: "粗暴口交", en: "rough blowjob, facefuck, hair grabbing" },
          { zh: "口交·手口配合", en: "one hand on base, mouth on upper half, coordinated" },
          { zh: "69", en: "69, mutual oral" },
          { zh: "乳交", en: "paizuri, titfuck, between breasts" },
          { zh: "舔阴", en: "cunnilingus, licking pussy" },
          { zh: "舔肛", en: "anilingus, rimming" },
          { zh: "口交·浴室", en: "blowjob in bathroom, standing, knees on tile" },
          { zh: "口交·车内", en: "blowjob in parked car, streetlight through window" },
          { zh: "口交·吐口水", en: "spitting mid-blowjob, contemptuous" },
          { zh: "口交·被后入", en: "blowjob while being penetrated from behind" },
          { zh: "颜口混合", en: "cum on lips and face, mixed oral and facial" },
        ] },
      { g: "露骨·插入", nsfw: true, items: [
          { zh: "阴茎插入", en: "penis penetrating, shaft penetrating labia, glans pushing through" },
          { zh: "浅插", en: "penis half-inserted, shallow penetration, just entering" },
          { zh: "深插", en: "pelvis touching pelvis, cock hitting deep, full penetration" },
          { zh: "插入特写", en: "penetration close-up, detail shot" },
          { zh: "指插", en: "fingering, fingers inside" },
          { zh: "肛插", en: "anal penetration, from behind" },
          { zh: "口交+后入", en: "blowjob while being penetrated from behind" },
          { zh: "骑乘插入", en: "sitting on it, riding, penetration" },
        ] },
      { g: "露骨·手部·自慰", nsfw: true, items: [
          { zh: "一手抓乳一手自慰", en: "one hand grabbing breast, other hand between legs, masturbating" },
          { zh: "自慰·指插", en: "hand between legs, touching self, fingers inside, pussy visible" },
          { zh: "手指放在腿间", en: "hand between legs, masturbation, fingering" },
          { zh: "隔着内裤自慰", en: "hand in panties, fingering through panties, grinding" },
          { zh: "自慰·揉胸", en: "cupping breasts, pinching nipple, masturbating" },
          { zh: "自慰·夹腿磨蹭", en: "grinding, rubbing, thighs pressed together, masturbating" },
          { zh: "自慰·玩具", en: "dildo riding, inserting vibrator, masturbating" },
          { zh: "揉胸", en: "breast grabbing, breast play, groping" },
          { zh: "捏乳", en: "nipple play, pinching nipple, pulling nipple" },
          { zh: "抓臀", en: "ass grabbing, spanking" },
          { zh: "抚摸大腿", en: "caressing thigh, touching body" },
          { zh: "摸肚子", en: "hand on belly, pressing stomach" },
          { zh: "咬手指", en: "biting knuckle, finger in mouth" },
        ] },
      { g: "露骨·器官", nsfw: true, items: [
          { zh: "露龟头", en: "glans exposed, head of penis" },
          { zh: "露阴茎", en: "penis exposed, erect penis" },
          { zh: "露阴户", en: "pussy visible, vagina exposed, vulva" },
          { zh: "露阴蒂", en: "clitoris, clit, exposed" },
          { zh: "露阴唇", en: "labia, pussy lips, spread" },
          { zh: "露肛门", en: "anus, asshole, exposed" },
          { zh: "乳首挺立", en: "nipples erect, erect nipples" },
          { zh: "大胸", en: "large breasts, big breasts" },
          { zh: "臀部", en: "ass, butt, glutes, curvy" },
        ] },
      { g: "露骨·多人", nsfw: true, items: [
          { zh: "双插（前后）", en: "double penetration, one in vagina one in anus, spit roast" },
          { zh: "3P（两女一男）", en: "threesome, 2girls 1boy, sharing" },
          { zh: "3P（两男一女·双插）", en: "threesome, 2boys 1girl, double penetration, MFM" },
          { zh: "4P", en: "foursome, group sex" },
          { zh: "群交", en: "gangbang" },
          { zh: "轮流（火车）", en: "spit roast, train, lineup" },
          { zh: "团体颜射", en: "bukkake, group facial" },
          { zh: "一人看一人做", en: "one watching while other penetrates" },
          { zh: "连番", en: "simultaneous penetration, both holes filled" },
        ] },

      // —— v2.0 扩：跪姿 ——
      {
        g: "跪姿", nsfw: false, items: [
          { zh: "跪坐", en: "kneeling" },
          { zh: "跪床上", en: "kneeling on bed" },
          { zh: "跪地上", en: "kneeling on floor" },
          { zh: "正坐", en: "seiza, sitting on heels" },
          { zh: "低头跪", en: "kneeling with head bowed" },
          { zh: "合十跪", en: "kneeling, hands clasped in front" },
          { zh: "土下座", en: "dogeza, forehead touching floor" },
          { zh: "仰视跪", en: "kneeling, looking up at viewer" },
          { zh: "回眸跪", en: "kneeling, looking over shoulder" },
          { zh: "闭眼跪", en: "kneeling, eyes closed" },
          { zh: "跪榻榻米", en: "kneeling on tatami" },
          { zh: "跪淋浴间", en: "kneeling in shower" },
          { zh: "跪床边", en: "kneeling at bedside" },
          { zh: "桌下跪", en: "kneeling under desk" },
          { zh: "柜台后跪", en: "kneeling behind counter" },
        ]
      },
      // —— v2.0 扩：坐姿 ——
      {
        g: "坐姿", nsfw: false, items: [
          { zh: "坐床上", en: "sitting on bed" },
          { zh: "坐椅子", en: "sitting on chair" },
          { zh: "坐地上", en: "sitting on floor" },
          { zh: "盘腿坐", en: "sitting cross-legged" },
          { zh: "坐台边", en: "sitting on desk edge" },
          { zh: "坐窗台", en: "sitting on windowsill" },
          { zh: "单腿盘坐", en: "sitting with one leg tucked under" },
          { zh: "抱膝坐", en: "sitting with knees up, hugging knees" },
          { zh: "悬腿坐", en: "sitting with legs dangling over edge" },
          { zh: "踝交坐", en: "sitting with ankles crossed" },
          { zh: "坐腿上", en: "sitting on lap" },
          { zh: "蹲", en: "squatting, crouching" },
          { zh: "沙发横躺", en: "lounging sideways on sofa" },
          { zh: "靠墙坐", en: "sitting with back against wall" },
          { zh: "托腮坐", en: "sitting with chin resting on hand" },
          { zh: "支颐坐", en: "sitting, hand on cheek" },
          { zh: "抱臂坐", en: "sitting with arms crossed" },
        ]
      },
      // —— v2.0 扩：站姿 ——
      {
        g: "站姿", nsfw: false, items: [
          { zh: "站直", en: "standing straight" },
          { zh: "踮脚站", en: "standing on tiptoe" },
          { zh: "重心腿站", en: "standing with weight on one leg, contrapposto" },
          { zh: "交叉腿站", en: "standing with legs crossed" },
          { zh: "前倾", en: "leaning forward, bending at waist" },
          { zh: "扭身", en: "twisting torso" },
          { zh: "伸懒腰", en: "stretching, arms above head stretching" },
          { zh: "叉腰站", en: "standing with hands on hips" },
          { zh: "手臂交叉", en: "arms crossed" },
          { zh: "背手站", en: "hands behind back" },
          { zh: "门口站", en: "standing in doorway" },
          { zh: "窗边站", en: "standing by window" },
          { zh: "镜前站", en: "standing in front of mirror" },
          { zh: "靠墙站", en: "standing against wall, leaning against wall" },
          { zh: "路灯下站", en: "standing under streetlight" },
          { zh: "雨中站", en: "standing in rain" },
          { zh: "阳台站", en: "standing on balcony" },
        ]
      },
      // —— v2.0 扩：躺姿 ——
      {
        g: "躺姿", nsfw: false, items: [
          { zh: "仰躺", en: "lying on back" },
          { zh: "趴躺", en: "lying on stomach" },
          { zh: "侧躺", en: "lying on side" },
          { zh: "摊躺", en: "sprawled on bed" },
          { zh: "斜躺", en: "reclining, lounging" },
          { zh: "蜷缩躺", en: "lying curled up, fetal position" },
          { zh: "屈膝躺", en: "lying with knees bent" },
          { zh: "床边垂头", en: "lying with head hanging off bed edge" },
          { zh: "手臂过头躺", en: "lying with arms above head" },
          { zh: "枕物躺", en: "lying on pillow, pillow under hips" },
        ]
      },
      // —— v2.0 扩：行走 ——
      {
        g: "行走", nsfw: false, items: [
          { zh: "行走", en: "walking" },
          { zh: "慢走", en: "walking slowly, strolling" },
          { zh: "阔步", en: "striding" },
          { zh: "走向镜头", en: "walking toward viewer" },
          { zh: "走离镜头", en: "walking away from viewer" },
          { zh: "侧身迈步", en: "profile view mid-stride" },
          { zh: "雨中行", en: "walking in rain, walking on wet street at night" },
          { zh: "门框行", en: "walking through doorway, framed by door" },
          { zh: "走廊纵深", en: "walking down corridor, long hallway" },
          { zh: "沙滩行", en: "walking on sand, footprints behind" },
          { zh: "踩水行", en: "walking through shallow water, splashing" },
          { zh: "高跟行", en: "walking in high heels, hip sway" },
          { zh: "踮脚行", en: "tiptoeing, barefoot walking" },
        ]
      },
      // —— v2.0 扩：回眸 ——
      {
        g: "回眸", nsfw: false, items: [
          { zh: "回眸", en: "looking back over shoulder, looking back" },
          { zh: "回头", en: "glancing back, turning head back" },
          { zh: "顿步", en: "paused mid-step, half-turned" },
          { zh: "回眸背身", en: "looking back over shoulder while body faces away" },
        ]
      },
      // —— v2.0 扩：奔跑 ——
      {
        g: "奔跑", nsfw: false, items: [
          { zh: "奔跑", en: "running" },
          { zh: "慢跑", en: "jogging" },
          { zh: "冲刺", en: "sprinting, dashing" },
          { zh: "飞发飘衣", en: "hair flying behind, clothes billowing" },
          { zh: "跑向镜头", en: "running toward viewer" },
          { zh: "跑离镜头", en: "running away" },
          { zh: "学校走廊跑", en: "running in school hallway" },
          { zh: "海滩跑", en: "running on beach" },
          { zh: "雨中跑", en: "running through rain" },
          { zh: "冲楼梯", en: "running up stairs, taking two at a time" },
          { zh: "原野跑", en: "running through field, tall grass" },
          { zh: "追电车", en: "running to catch train" },
          { zh: "绊倒", en: "stumbling, tripping, about to fall" },
          { zh: "急停", en: "skidding, momentum carrying" },
          { zh: "气喘", en: "out of breath, gasping for breath, chest heaving" },
        ]
      },
      // —— v2.0 扩：跳跃攀爬 ——
      {
        g: "跳跃攀爬", nsfw: false, items: [
          { zh: "跳跃", en: "jumping, leaping, jumping in air, mid-jump" },
          { zh: "张臂跳", en: "jumping with arms spread wide, joyful" },
          { zh: "跳床", en: "jumping onto bed, landing on mattress" },
          { zh: "雀跃", en: "skipping, light bouncy steps" },
          { zh: "跳绳", en: "jumping rope, skipping rope" },
          { zh: "上楼", en: "climbing stairs, ascending" },
          { zh: "攀爬", en: "climbing over fence, climbing through window" },
          { zh: "跨越", en: "stepping over, vaulting over railing" },
          { zh: "骑车", en: "mounting bicycle, riding bicycle, bicycle, cycling" },
        ]
      },
      // —— v2.0 扩：舞蹈旋转 ——
      {
        g: "舞蹈旋转", nsfw: false, items: [
          { zh: "跳舞", en: "dancing, swaying to music" },
          { zh: "慢舞", en: "slow dancing, dancing with partner, bodies close" },
          { zh: "旋转", en: "spinning, twirling, pirouette" },
          { zh: "裙摆飞旋", en: "spinning with skirt flying, fabric fanning out" },
          { zh: "发丝飞旋", en: "twirling with hair whipping" },
          { zh: "雨中舞", en: "dancing in rain" },
          { zh: "独舞", en: "dancing alone in room, mirror reflecting" },
        ]
      },
      // —— v2.0 扩：游泳水中 ——
      {
        g: "游泳水中", nsfw: false, items: [
          { zh: "漂浮", en: "floating, treading water" },
          { zh: "潜水", en: "diving" },
          { zh: "水下", en: "swimming underwater, bubbles, hair flowing underwater" },
          { zh: "浮出水面", en: "surfacing from water, breaking through surface" },
          { zh: "仰漂", en: "floating on back" },
          { zh: "戏水", en: "splashing water" },
          { zh: "出水", en: "emerging from pool, water cascading off body" },
          { zh: "池边坐", en: "sitting on pool edge, legs in water" },
        ]
      },
      // —— v2.0 扩：日常动态 ——
      {
        g: "日常动态", nsfw: false, items: [
          { zh: "起床", en: "getting out of bed, sheet falling away, just woke up" },
          { zh: "下车", en: "getting out of car, one leg out" },
          { zh: "穿衣", en: "getting dressed, buttoning shirt, zipping up dress" },
          { zh: "换衣服", en: "changing_clothes, undressing" },
          { zh: "脱衣服", en: "undressing, open_clothes" },
          { zh: "弯腰拾物", en: "bending down to pick something up, reaching down" },
          { zh: "伸手够物", en: "reaching up high, stretching" },
          { zh: "梳发", en: "brushing hair, hand running through hair" },
          { zh: "梳头", en: "brushing_hair" },
          { zh: "化妆", en: "applying_makeup" },
          { zh: "洗脸", en: "washing face" },
          { zh: "对镜化妆", en: "applying lipstick, looking in mirror while applying" },
          { zh: "穿袜", en: "putting on stockings, rolling up" },
          { zh: "看手机", en: "looking at phone, screen glow on face" },
          { zh: "喝水", en: "drinking water, head tilted back" },
          { zh: "进食", en: "eating, lips around food" },
          { zh: "做饭", en: "cooking, stirring pot" },
          { zh: "束发", en: "tying up hair, hands lifting hair off neck" },
          { zh: "读书", en: "reading a book, flipping pages" },
          { zh: "写字", en: "writing, holding pen" },
          { zh: "擦汗", en: "wiping sweat" },
          { zh: "偷看", en: "peeping, peeking through window from outside" },
          { zh: "偷窥", en: "peeping, watching secretly from outside" },
          { zh: "收拾房间", en: "cleaning up, tidying, household chores" },
          { zh: "打扫", en: "cleaning up, sweeping, household chores" },
          { zh: "拍照", en: "taking picture, photographer, holding camera" },
        ]
      },
      // —— v2.0 扩：过渡姿态 ——
      {
        g: "过渡姿态", nsfw: false, items: [
          { zh: "脱衣蒙头", en: "pulling shirt over head, halfway off, face obscured by fabric" },
          { zh: "解扣", en: "unbuttoning blouse, one button at a time" },
          { zh: "背后拉链", en: "unzipping dress from behind, reaching back" },
          { zh: "肩带滑落", en: "sliding strap off shoulder, one strap fallen" },
          { zh: "转身中", en: "turning around, mid-rotation, caught mid-turn" },
          { zh: "半转身", en: "half-turned, caught between two directions" },
          { zh: "撑床起身", en: "pushing up from bed, arms straight" },
          { zh: "缓缓坐起", en: "sitting up slowly, just woken" },
          { zh: "手伸向镜头", en: "hand reaching toward viewer, fingers spread, beckoning" },
          { zh: "抓床单", en: "fingers gripping sheets, knuckles white" },
          { zh: "双手撑墙", en: "hands pressing against wall, fingers splayed" },
          { zh: "欲言又止", en: "mouth half-open, about to speak" },
          { zh: "渐闭眼", en: "eyes slowly closing, mid-blink" },
          { zh: "泪将落", en: "tears about to fall, one tear on cheek" },
          { zh: "唇颤", en: "lip trembling" },
          { zh: "将吻未吻", en: "just about to kiss, lips inches apart, leaning in" },
          { zh: "吞咽", en: "swallowing, throat moving" },
          { zh: "倒吸气", en: "gasp forming, breath caught" },
        ]
      },
    ],

    /* 【服装】现在【可多选】。露骨大项保持空壳。 */
    clothes: [
      {
        g: "正经", nsfw: false, items: [
          { zh: "白衬衫", en: "white shirt" },
          { zh: "黑西装", en: "black blazer, business suit" },
          { zh: "居家毛衣", en: "sweater" },
          { zh: "连衣裙", en: "dress" },
          { zh: "T恤", en: "t-shirt" },
          { zh: "条纹衫", en: "striped shirt" },
          { zh: "格子衬衫", en: "plaid shirt" },
          { zh: "高领毛衣", en: "turtleneck" },
          { zh: "马甲", en: "vest" },
          { zh: "背心", en: "tank top" },
          { zh: "卫衣", en: "hoodie" },
          { zh: "针织开衫", en: "cardigan" },
          { zh: "夹克", en: "jacket" },
          { zh: "皮夹克", en: "leather jacket" },
          { zh: "风衣", en: "trench coat" },
          { zh: "大衣", en: "overcoat" },
          { zh: "牛仔外套", en: "denim jacket" },
          { zh: "牛仔裤", en: "jeans" },
          { zh: "短裤", en: "shorts" },
          { zh: "运动裤", en: "sweatpants" },
          { zh: "半身裙", en: "skirt" },
          { zh: "百褶裙", en: "pleated skirt" },
          { zh: "吊带连衣裙", en: "sundress" },
          { zh: "晚礼服", en: "evening dress" },
          { zh: "婚纱", en: "wedding dress" },
          { zh: "睡衣", en: "pajamas" },
          { zh: "居家服", en: "loungewear" },
          { zh: "浴袍", en: "bathrobe" },
          { zh: "和服", en: "kimono" },
          { zh: "浴衣", en: "yukata" },
          { zh: "汉服", en: "hanfu" },
          { zh: "旗袍", en: "cheongsam" },
          { zh: "校服", en: "school uniform" },
          { zh: "水手服", en: "sailor suit" },
          { zh: "女仆装", en: "maid outfit" },
          { zh: "洛丽塔裙", en: "lolita fashion" },
          { zh: "运动服", en: "tracksuit" },
          { zh: "泳装", en: "swimsuit" },
          { zh: "连体裤", en: "jumpsuit" },
          { zh: "围裙", en: "apron" },
          { zh: "斗篷", en: "cloak" },
          { zh: "披风", en: "cape" },
          { zh: "长袍", en: "robe" },
          { zh: "盔甲", en: "armor" },
          { zh: "运动内衣", en: "sports bra" },
          { zh: "吊带背心", en: "camisole" },
          { zh: "吊带睡裙", en: "slip dress" },
          { zh: "抹胸上衣", en: "tube top" },
          { zh: "露脐装", en: "crop top" },
        ]
      },
      { g: "露骨·服装", nsfw: true, items: [
          { zh: "全裸", en: "nude, naked" },
          { zh: "半裸（上）", en: "topless" },
          { zh: "半裸（下）", en: "bottomless" },
          { zh: "内衣", en: "lingerie, underwear" },
          { zh: "丁字裤", en: "thong, g-string" },
          { zh: "吊袜带", en: "garter belt, stockings" },
          { zh: "丝袜", en: "pantyhose, stockings" },
          { zh: "透视装", en: "unbuttoned, lifting, slipping off" },
          { zh: "裸体围裙", en: "naked apron" },
          { zh: "湿身贴体", en: "wet clothes clinging, soaked" },
          { zh: "凌乱半褪", en: "disheveled, clothing half off" },
          { zh: "白色Babydoll内衣", en: "white babydoll lingerie, white lace camisole" },
          { zh: "黑色蕾丝连体衣", en: "black lace bodysuit, lace catsuit" },
          { zh: "红色微型比基尼", en: "red micro bikini, tiny red bikini" },
          { zh: "白色吊带丝袜与吊袜带", en: "white garter stockings, white garter belt" },
          { zh: "透明睡裙", en: "sheer nightgown, transparent slip dress" },
          { zh: "兔女郎套装", en: "bunny suit, playboy bunny costume" },
          { zh: "学校泳装", en: "school swimsuit, sukumizu" },
          { zh: "黑色皮革束缚", en: "black leather harness, leather bondage" },
          { zh: "渔网连体衣", en: "fishnet bodysuit, fishnet catsuit" },
          { zh: "女仆情趣内衣", en: "maid lingerie, frilly maid outfit" },
          { zh: "雷背高叉礼服", en: "high-slit gown, backless evening dress" },
          { zh: "吊袜带套装", en: "garter belt set, suspender set" },
          { zh: "微型裙装", en: "micro skirt, mini slip dress" },
          { zh: "半脱状态包", en: "clothing half off, partially removed" },
          { zh: "湿身透视诱惑", en: "wet see-through, soaked sheer" },
          { zh: "破损凌乱状态", en: "torn clothing, ripped, messy" },
          { zh: "全裸与暴露状态", en: "fully nude, fully exposed" },
          { zh: "法式女仆情趣", en: "french maid outfit, costumed maid" },
          { zh: "乳胶/皮革紧身", en: "latex catsuit, leather tight, rubber" },
          { zh: "学校泳装湿身", en: "wet school swimsuit, sukumizu wet" },
          { zh: "微型比基尼暴露", en: "micro bikini, revealing tiny bikini" },
        ] },

      // —— v2.0 扩：东方传统 ——
      {
        g: "东方·传统", nsfw: false, items: [
          { zh: "高开叉旗袍", en: "high-slit cheongsam" },
          { zh: "露背旗袍", en: "backless Qipao" },
          { zh: "缎面旗袍", en: "satin Qipao" },
          { zh: "交领汉服", en: "cross-collar Hanfu" },
          { zh: "广袖汉服", en: "wide sleeves Hanfu" },
          { zh: "汉服腰封", en: "Hanfu with waist belt" },
          { zh: "中式晚礼服", en: "Chinese evening gown" },
          { zh: "亮片中式裙", en: "sequined Chinese dress" },
          { zh: "振袖和服", en: "furisode" },
          { zh: "和服腰带", en: "obi belt" },
          { zh: "韩服", en: "hanbok" },
        ]
      },
      // —— v2.0 扩：职业制服 ——
      {
        g: "职业·制服", nsfw: false, items: [
          { zh: "护士服", en: "nurse uniform" },
          { zh: "护士帽", en: "nurse cap" },
          { zh: "女仆装", en: "maid uniform, maid apron" },
          { zh: "法式女仆", en: "French maid" },
          { zh: "空姐制服", en: "flight attendant uniform" },
          { zh: "女警制服", en: "police uniform" },
          { zh: "教师装", en: "teacher outfit, business suit" },
          { zh: "啦啦队服", en: "cheerleader uniform" },
          { zh: "啦啦队花球", en: "pom poms" },
          { zh: "巫女服", en: "miko outfit, shrine maiden outfit" },
          { zh: "兔女郎装", en: "bunny suit, bunny ears" },
          { zh: "舞台装", en: "stage costume" },
          { zh: "偶像装", en: "idol costume" },
        ]
      },
      // —— v2.0 扩：日常时尚 ——
      {
        g: "日常·时尚", nsfw: false, items: [
          { zh: "休闲连衣裙", en: "casual dress" },
          { zh: "太阳裙", en: "sundress" },
          { zh: "T恤裙", en: "T-shirt dress" },
          { zh: "牛仔短裤", en: "denim shorts" },
          { zh: "破洞牛仔裤", en: "ripped jeans" },
          { zh: "露肩上衣", en: "off-shoulder top" },
          { zh: "冷肩上衣", en: "cold-shoulder top" },
          { zh: "挂脖上衣", en: "halter top" },
          { zh: "紧身迷你裙", en: "bodycon dress" },
          { zh: "绷带裙", en: "bandage dress" },
          { zh: "派对礼服", en: "party dress" },
          { zh: "鸡尾酒裙", en: "cocktail dress" },
          { zh: "小黑裙", en: "little black dress" },
          { zh: "亮片裙", en: "sequin dress" },
          { zh: "闪光裙", en: "glitter dress" },
          { zh: "约会装", en: "romantic dinner dress" },
          { zh: "丝绸睡裙", en: "silk nightgown" },
          { zh: "缎面睡裙", en: "satin nightie" },
          { zh: "丝绸浴袍", en: "silk robe" },
          { zh: "缎面浴袍", en: "satin robe" },
          { zh: "睡衣套装", en: "pajama set" },
          { zh: " OversizedT恤", en: "oversized T-shirt" },
          { zh: "宽松睡衣", en: "loose sleepwear" },
        ]
      },
      // —— v2.0 扩：泳装校服 ——
      {
        g: "泳装·校服", nsfw: false, items: [
          { zh: "侧系比基尼", en: "side-tie bikini" },
          { zh: "细绳比基尼", en: "string bikini" },
          { zh: "竞技泳衣", en: "competition swimsuit" },
          { zh: "JK水手服", en: "sailor uniform, sailor fuku" },
          { zh: "学院风制服", en: "college uniform, blazer uniform" },
          { zh: "学院风开衫", en: "cardigan" },
          { zh: "白色婚纱", en: "white bridal gown" },
          { zh: "头纱", en: "bridal veil" },
          { zh: "白无垢", en: "wedding kimono, shiromuku" },
        ]
      },
      // —— v2.0 扩：袜子 ——
      {
        g: "袜子·专项", nsfw: false, items: [
          { zh: "过膝袜", en: "thighhighs, over_knee_stockings" }, // B方案对齐LLM：LLM实测吐over_knee_stockings(不在danbooru表)，加双靶接住；thighhighs在表count1238254保留(大阿总09-14)
          { zh: "及膝袜", en: "knee highs" },
          { zh: "连裤袜", en: "pantyhose" },
          { zh: "短袜", en: "ankle socks" },
          { zh: "松垮袜", en: "loose socks" },
          { zh: "渔网过膝袜", en: "fishnet thighhighs" },
          { zh: "蕾丝过膝袜", en: "lace-top thighhighs" },
          { zh: "不透明连裤袜", en: "opaque pantyhose" },
          { zh: "罗纹袜", en: "ribbed socks" },
          { zh: "过膝袜滑落", en: "thighhighs slipping" },
          { zh: "连裤袜破洞", en: "pantyhose torn" },
          { zh: "吊带袜", en: "garter belt with stockings, garter_belt, garter_straps, pantyhose" }, // 吊带袜 B方案对齐LLM：garter_belt(表30536)+garter_straps(表89388)+pantyhose(表578618,fetch hook抓LLM高频吐)；stockings/garter_stockings表外不补(大阿总09-14)
          // —— S3 补真缺词库（大阿总 09-14，依据阿紫《词库补词清单》2.1 + 牛总清单交叉核 danbooru 在表性；蓝眼/红眼/黑眼待老秦确认未补）——
          { zh: "胸罩", en: "bra" }, // S3：bra在danbooru表count215545
          { zh: "内裤", en: "panties" }, // S3：panties在表678727
          { zh: "绳子", en: "rope" }, // S3：rope在表55073（束缚道具）
          { zh: "修女", en: "nun" }, // S3：nun在表26089（职业/服饰）
          { zh: "过膝长筒袜", en: "thighhighs" }, // S3：thighhighs在表1238254（过膝袜同族，与"过膝袜"区分键）
          { zh: "学生服", en: "school_uniform" }, // S3：school_uniform在表841569；非红线(student才是RED_LINE_NSFw_ONLY)，SFW/NSFW均正常出词
          { zh: "纹身", en: "tattoo" }, // S3：tattoo在表148334
          { zh: "床上", en: "on bed" }, // S3：on_bed在表121811（norm归一空格→下划线）
          { zh: "看镜头", en: "looking_at_viewer" }, // S3：looking_at_viewer在表3591177
        ]
      },
      // —— v2.0 扩：内衣NSFW ——
      {
        g: "内衣·NSFW", nsfw: true, items: [
          { zh: "蕾丝文胸", en: "lace bra" },
          { zh: "蕾丝内衣套装", en: "matching bra and panties set" },
          { zh: "黑色蕾丝内衣", en: "black lace lingerie" },
          { zh: "红色蕾丝内衣", en: "red lace lingerie" },
          { zh: "白色蕾丝内衣", en: "white lace lingerie" },
          { zh: "吊袜带套装", en: "garter belt, lace garter set" },
          { zh: "蕾丝边内衣", en: "lace-trimmed lingerie" },
          { zh: "薄面料内衣", en: "thin fabric lingerie" },
          { zh: "紧身胸衣", en: "bustier, corset" },
          { zh: "连体内衣", en: "teddy, bodysuit" },
          { zh: "蕾丝连体内衣", en: "lace bodysuit" },
          { zh: "缎面连体内衣", en: "satin teddy" },
          { zh: "束腰胸衣", en: "underbust corset" },
          { zh: "胸衣连衣裙", en: "corset dress" },
          { zh: "粉色荷叶边文胸", en: "pink frilled bra" },
          { zh: " pastel蕾丝套装", en: "pastel lace set" },
          { zh: "心形文胸", en: "heart-patterned bra" },
          { zh: "蝴蝶结文胸", en: "ribbon bra" },
          { zh: "荷叶边内裤", en: "frilled panty set" },
          { zh: "Babydoll", en: "babydoll with bow" },
          { zh: "乳胶束腰", en: "latex corset" },
          { zh: "皮革束腰", en: "leather corset" },
          { zh: "束缚背带", en: "bondage harness, chest harness" },
          { zh: "PVC束腰", en: "PVC corset" },
          { zh: "铆钉皮革文胸", en: "studded leather bra" },
          { zh: "微型比基尼", en: "micro bikini" },
          { zh: "弹弓泳衣", en: "slingshot swimsuit" },
          { zh: "极简套装", en: "barely-there set" },
        ]
      },
    ],

    /* 【道具】现在【可多选】。男女通用的日常配饰/手持物，两级分组，想加照抄一行即可。 */
    props: [
      {
        g: "首饰配饰", nsfw: false, items: [
          { zh: "项链", en: "necklace" },
          { zh: "耳环", en: "earrings" },
          { zh: "项圈", en: "choker" },
        ]
      },
      {
        g: "包袋", nsfw: false, items: [
          { zh: "单肩包", en: "shoulder bag" },
          { zh: "双肩包", en: "backpack" },
          { zh: "手提包", en: "tote bag" },
          { zh: "斜挎包", en: "crossbody bag" },
          { zh: "钱包", en: "wallet" },
        ]
      },
      {
        g: "手持道具", nsfw: false, items: [
          { zh: "手机", en: "smartphone" },
          { zh: "杯子", en: "cup" },
          { zh: "书本", en: "book" },
          { zh: "雨伞", en: "umbrella" },
          { zh: "花束", en: "bouquet" },
          { zh: "相机", en: "camera" },
          { zh: "镜子", en: "mirror" },
          { zh: "手持镜", en: "hand_mirror" },
          { zh: "话筒", en: "microphone" },
          { zh: "玻璃瓶", en: "glass_bottle" },
        ]
      },
      {
        g: "穿戴小件", nsfw: false, items: [
          { zh: "帽子", en: "hat" },
          { zh: "眼镜", en: "glasses" },
          { zh: "手表", en: "wristwatch" },
          { zh: "围巾", en: "scarf" },
          { zh: "手套", en: "gloves" },
          { zh: "耳机", en: "headphones" },
        ]
      },
      { g: "露骨·道具-女用", nsfw: true, items: [
          { zh: "振动棒", en: "vibrator" },
          { zh: "魔杖振动棒", en: "magic wand vibrator" },
          { zh: "子弹跳蛋", en: "bullet vibrator" },
          { zh: "兔耳振动棒", en: "rabbit vibrator, dual stimulation" },
          { zh: "无线·遥控", en: "wireless vibrator, app-controlled" },
          { zh: "吮吸玩具", en: "clit suction toy" },
          { zh: "假阳具", en: "dildo" },
          { zh: "写实假阳具", en: "realistic dildo" },
          { zh: "双头假阳具", en: "double-ended dildo" },
          { zh: "穿戴式假阳具", en: "strap-on" },
          { zh: "肛塞", en: "anal, butt plug" },
          { zh: "尾巴肛塞", en: "fox tail butt plug" },
          { zh: "扩张器", en: "anal dilator" },
        ] },
      { g: "露骨·道具-男用", nsfw: true, items: [
          { zh: "飞机杯", en: "onahole, masturbator" },
          { zh: "阴茎环", en: "cock ring" },
          { zh: "贞操锁", en: "chastity cage" },
          { zh: "前列腺按摩器", en: "prostate massager" },
        ] },
      { g: "露骨·道具-SM", nsfw: true, items: [
          { zh: "手铐", en: "handcuffs" },
          { zh: "金属手铐", en: "metal handcuffs" },
          { zh: "绳索·绑缚", en: "rope binding, shibari" },
          { zh: "口塞", en: "ball gag" },
          { zh: "项圈·牵引", en: "collar, leash" },
          { zh: "鞭子", en: "whip" },
          { zh: "乳夹", en: "nipple clamps" },
          { zh: "眼罩", en: "blindfold" },
          { zh: "丝绸眼罩", en: "satin blindfold" },
          { zh: "电击玩具", en: "electric stimulation toy" },
        ] },

      // —— v2.0 扩：日常氛围道具 ——
      {
        g: "日常·氛围", nsfw: false, items: [
          { zh: "酒杯", en: "wine glass, red wine" },
          { zh: "清酒", en: "sake bottle, sake cup" },
          { zh: "啤酒", en: "beer bottle" },
          { zh: "鸡尾酒", en: "cocktail, champagne glass" },
          { zh: "草莓", en: "strawberry" },
          { zh: "巧克力", en: "chocolate" },
          { zh: "冰淇淋", en: "ice cream cone, popsicle" },
          { zh: "蛋糕", en: "cake slice" },
          { zh: "樱桃", en: "cherry" },
          { zh: "蜂蜜罐", en: "honey jar" },
          { zh: "花瓣", en: "flower petals, falling petals" },
          { zh: "玫瑰花瓣", en: "rose petals on bed" },
          { zh: "向日葵", en: "sunflower bouquet" },
          { zh: "樱花枝", en: "sakura branch" },
          { zh: "单支玫瑰", en: "single rose" },
          { zh: "蜡烛", en: "candlelight, burning candles, melted candle wax" },
          { zh: "香薰蜡烛", en: "scented candles" },
          { zh: "冰块", en: "ice cubes, melting ice" },
          { zh: "枕头", en: "pillows, scattered pillows" },
          { zh: "丝绸床单", en: "silk sheets" },
          { zh: "毯子", en: "blanket, blanket wrapped around, oversized blanket" },
          { zh: "毛绒玩具", en: "plush toy" },
          { zh: "眼镜", en: "glasses on table, reading glasses" },
          { zh: "书堆", en: "book stack" },
          { zh: "雨伞", en: "umbrella, clear umbrella" },
          { zh: "雨滴窗", en: "rain drops on window" },
          { zh: "仙女棒", en: "sparkler" },
          { zh: "烟花", en: "fireworks in sky" },
          { zh: "香烟", en: "cigarette smoke" },
          { zh: "手机", en: "smartphone, taking selfie, phone screen glow" },
          { zh: "拍立得照片", en: "polaroid photos scattered" },
          { zh: "打开的书", en: "open book, library books" },
          { zh: "杂志", en: "magazine" },
          { zh: "游戏手柄", en: "game controller" },
          { zh: "街机", en: "arcade machine" },
          { zh: "黑胶唱片", en: "vinyl record, record player" },
          { zh: "吉他", en: "guitar" },
          { zh: "猫", en: "cat, cat on lap, cat rubbing against leg, kitten" },
          { zh: "狗", en: "dog, puppy, pet dog" },
          { zh: "壁炉", en: "fireplace" },
          { zh: "书架", en: "bookshelf" },
          { zh: "窗台", en: "windowsill, window_sill" },
        ]
      },
      // —— v2.0 扩：NSFW道具 ——
      {
        g: "NSFW·道具", nsfw: true, items: [
          { zh: "震动棒", en: "vibrator" },
          { zh: "假阳具", en: "dildo, anal beads, egg vibrator" },
          { zh: "遥控玩具", en: "remote controlled toy" },
          { zh: "双头假阳具", en: "double ended dildo" },
          { zh: "吸盘假阳具", en: "suction cup dildo" },
          { zh: "束缚绳", en: "bondage rope, red rope" },
          { zh: "手铐", en: "handcuffs, leather cuffs" },
          { zh: "口球", en: "ball gag, ring gag" },
          { zh: "项圈牵引", en: "collar and leash" },
          { zh: "分腿器", en: "spreader bar" },
          { zh: "马鞭", en: "riding crop, flogger, paddle" },
          { zh: "日式紧缚", en: "shibari rope, suspension rope" },
          { zh: "三脚架相机", en: "camera on tripod" },
          { zh: "网络摄像头", en: "webcam, recording phone" },
          { zh: "隐藏摄像头", en: "hidden camera" },
        ]
      },
    ],

    /* 【场景】现在【可多选】。两级：现实/幻想分大项，里面放具体地点。想加新地点照抄一行即可。 */
    scenes: [
      {
        g: "现实·居家", nsfw: false, items: [
          { zh: "厨房", en: "kitchen" },
          { zh: "卧室·床上", en: "bedroom, on bed" },
          { zh: "浴室", en: "bathroom" },
          { zh: "客厅", en: "living room" },
          { zh: "书房", en: "study" },
          { zh: "餐厅", en: "dining room" },
          { zh: "阳台", en: "balcony" },
          { zh: "走廊", en: "hallway" },
          { zh: "楼梯", en: "stairs" },
          { zh: "阁楼", en: "attic" },
          { zh: "车库", en: "garage" },
        ]
      },
      {
        g: "现实·公共", nsfw: false, items: [
          { zh: "酒店", en: "hotel room" },
          { zh: "办公室", en: "office" },
          { zh: "雨夜街头", en: "street, night, rain" },
          { zh: "咖啡厅", en: "cafe" },
          { zh: "餐厅", en: "restaurant" },
          { zh: "图书馆", en: "library" },
          { zh: "教室", en: "classroom" },
          { zh: "公园", en: "park" },
          { zh: "海边", en: "beach" },
          { zh: "地铁站", en: "subway" },
          { zh: "火车站", en: "train station" },
          { zh: "机场", en: "airport" },
          { zh: "天台", en: "rooftop" },
          { zh: "便利店", en: "convenience store" },
          { zh: "书店", en: "bookstore" },
          { zh: "健身房", en: "gym" },
          { zh: "游泳池", en: "swimming pool" },
          { zh: "超市", en: "supermarket" },
          { zh: "神社", en: "shrine" },
          { zh: "寺庙", en: "temple" },
          { zh: "博物馆", en: "museum" },
          { zh: "霓虹街道", en: "street, neon lights" },
        ]
      },
      {
        g: "幻想·建筑", nsfw: false, items: [
          { zh: "中世纪城堡", en: "medieval castle, throne room" },
          { zh: "魔法学院", en: "magic academy, library" },
          { zh: "哥特教堂", en: "gothic cathedral" },
          { zh: "法师塔", en: "wizard tower" },
          { zh: "古代遗迹", en: "ancient ruins" },
          { zh: "地下城", en: "dungeon" },
          { zh: "天文台", en: "observatory" },
          { zh: "钟楼", en: "clock tower" },
        ]
      },
      {
        g: "幻想·异世界", nsfw: false, items: [
          { zh: "魔法森林", en: "enchanted forest" },
          { zh: "浮空岛", en: "floating island" },
          { zh: "星空原野", en: "starlit field" },
          { zh: "花海", en: "flower field" },
          { zh: "瀑布", en: "waterfall" },
          { zh: "雪山", en: "snowy mountain" },
          { zh: "雪原", en: "snowfield" },
          { zh: "沙漠", en: "desert" },
          { zh: "海洋", en: "ocean" },
          { zh: "海底", en: "underwater" },
          { zh: "云端", en: "sky, clouds" },
          { zh: "樱花林", en: "cherry blossoms" },
          { zh: "竹林", en: "bamboo forest" },
          { zh: "草原", en: "grassland" },
          { zh: "极光", en: "aurora" },
          { zh: "火山", en: "volcano" },
        ]
      },
      {
        g: "纯色·棚拍", nsfw: false, items: [
          { zh: "纯色背景", en: "simple background" },
          { zh: "暗色背景", en: "dark background" },
          { zh: "白色背景", en: "white background" },
          { zh: "灰色背景", en: "gray background" },
          { zh: "渐变背景", en: "gradient background" },
          { zh: "摄影棚", en: "studio" },
        ]
      },

      // —— v2.0 扩：居家细分 ——
      {
        g: "居家·细分", nsfw: false, items: [
          { zh: "中岛厨房", en: "kitchen island" },
          { zh: "步入式衣帽间", en: "walk-in closet" },
          { zh: "梳妆台", en: "vanity table" },
          { zh: "居家办公", en: "home office desk" },
          { zh: "家庭健身房", en: "home gym" },
          { zh: "阁楼卧室", en: "attic bedroom" },
          { zh: "玄关", en: "genkan entrance" },
          { zh: "鞋柜", en: "shoe cabinet" },
          { zh: "洗衣房", en: "laundry room" },
          { zh: "后院", en: "backyard" },
          { zh: "花园", en: "garden" },
          { zh: "楼梯间", en: "stairwell" },
          { zh: "餐桌", en: "dining table" },
        ]
      },
      // —— v2.0 扩：学校全场景 ——
      {
        g: "学校·全场景", nsfw: false, items: [
          { zh: "空教室", en: "empty classroom" },
          { zh: "放学后教室", en: "after school classroom" },
          { zh: "讲台", en: "podium" },
          { zh: "黑板", en: "blackboard" },
          { zh: "粉笔黑板", en: "chalkboard" },
          { zh: "教室窗边", en: "classroom window" },
          { zh: "学校走廊", en: "school corridor" },
          { zh: "图书馆书架", en: "library stacks" },
          { zh: "阅览室", en: "reading room" },
          { zh: "自习室", en: "study room" },
          { zh: "保健室", en: "nurse office" },
          { zh: "学校医务室", en: "school infirmary" },
          { zh: "学校天台", en: "school rooftop" },
          { zh: "夕阳天台", en: "rooftop at sunset" },
          { zh: "社团活动室", en: "club room" },
          { zh: "音乐教室", en: "music room" },
          { zh: "美术教室", en: "art room" },
          { zh: "理科实验室", en: "science lab" },
          { zh: "体育馆储物间", en: "gym storage room" },
          { zh: "更衣室", en: "locker room" },
        ]
      },
      // —— v2.0 扩：职场全场景 ——
      {
        g: "职场·全场景", nsfw: false, items: [
          { zh: "格子间", en: "cubicle" },
          { zh: "老板桌", en: "boss desk" },
          { zh: "加班办公室", en: "overtime office" },
          { zh: "夜晚办公室", en: "office at night" },
          { zh: "会议室", en: "meeting room" },
          { zh: "接待前台", en: "reception desk" },
          { zh: "复印室", en: "copy room" },
          { zh: "茶水间", en: "office pantry" },
          { zh: "机房", en: "server room" },
          { zh: "档案室", en: "archive room" },
          { zh: "消防楼梯", en: "emergency stairwell" },
          { zh: "吸烟区", en: "smoking area" },
        ]
      },
      // —— v2.0 扩：商业餐饮 ——
      {
        g: "商业·餐饮", nsfw: false, items: [
          { zh: "深夜便利店", en: "store at night" },
          { zh: "24小时店", en: "24-hour store" },
          { zh: "超市货架", en: "supermarket aisle" },
          { zh: "餐厅包间", en: "restaurant private room" },
          { zh: "居酒屋", en: "izakaya" },
          { zh: "卡拉OK包间", en: "karaoke booth" },
          { zh: "吧台", en: "bar counter" },
          { zh: "试衣间", en: "fitting room" },
          { zh: "漫画喫茶", en: "manga cafe booth" },
          { zh: "网吧包间", en: "internet cafe private room" },
        ]
      },
      // —— v2.0 扩：交通 ——
      {
        g: "交通·车内", nsfw: false, items: [
          { zh: "电车车厢", en: "train interior" },
          { zh: "拥挤电车", en: "crowded train" },
          { zh: "末班车", en: "last train" },
          { zh: "夜晚空电车", en: "empty train at night" },
          { zh: "地铁车厢", en: "subway car" },
          { zh: "电车车窗", en: "train window" },
          { zh: "汽车后座", en: "car backseat" },
          { zh: "出租车后座", en: "taxi backseat" },
          { zh: "夜晚车内", en: "car at night" },
          { zh: "车头盖", en: "car hood" },
        ]
      },
      // —— v2.0 扩：和风传统 ——
      {
        g: "和风·传统", nsfw: false, items: [
          { zh: "和室", en: "tatami room" },
          { zh: "障子门", en: "shoji screen" },
          { zh: "床之间", en: "tokonoma alcove" },
          { zh: "襖", en: "fusuma sliding door" },
          { zh: "被炉", en: "kotatsu table" },
          { zh: "榻榻米被褥", en: "futon on tatami" },
          { zh: "鸟居", en: "torii gate" },
          { zh: "夜晚神社", en: "shrine at night" },
          { zh: "神社走廊", en: "shrine corridor" },
          { zh: "茶室", en: "tea ceremony room" },
          { zh: "旅亭客房", en: "traditional inn room" },
          { zh: "浴衣更衣室", en: "yukata dressing room" },
        ]
      },
      // —— v2.0 扩：和风户外 ——
      {
        g: "和风·户外", nsfw: false, items: [
          { zh: "枯山水", en: "zen garden" },
          { zh: "锦鲤池", en: "koi pond" },
          { zh: "竹林", en: "bamboo grove" },
          { zh: "赏樱地", en: "cherry blossom viewing spot" },
          { zh: "紫藤隧道", en: "wisteria tunnel" },
          { zh: "日式庭园", en: "Japanese garden" },
          { zh: "石灯笼庭", en: "stone lantern garden" },
          { zh: "红叶庭园", en: "maple tree garden" },
          { zh: "苔藓庭园", en: "moss garden" },
        ]
      },
      // —— v2.0 扩：医疗 ——
      {
        g: "医疗·场景", nsfw: false, items: [
          { zh: "病房", en: "hospital room" },
          { zh: "诊察室", en: "examination room" },
          { zh: "护士站", en: "nurse station" },
          { zh: "医院走廊", en: "hospital corridor" },
          { zh: "候诊室", en: "waiting room" },
          { zh: "诊所", en: "clinic" },
          { zh: "牙科", en: "dental clinic" },
          { zh: "按摩床", en: "massage table" },
          { zh: "治疗室", en: "treatment room" },
        ]
      },
      // —— v2.0 扩：户外山野 ——
      {
        g: "户外·山野", nsfw: false, items: [
          { zh: "夜晚公园", en: "park at night" },
          { zh: "公园长椅", en: "park bench" },
          { zh: "河畔", en: "riverbank" },
          { zh: "桥下", en: "under bridge" },
          { zh: "夜晚海边", en: "beach at night" },
          { zh: "池边", en: "poolside" },
          { zh: "夜晚泳池", en: "swimming pool at night" },
          { zh: "海边洞穴", en: "seaside cave" },
          { zh: "露营帐篷", en: "camping tent" },
          { zh: "山间小屋", en: "mountain cabin" },
          { zh: "林间空地", en: "forest clearing" },
          { zh: "篝火", en: "campfire" },
          { zh: "森林浴", en: "forest bath" },
        ]
      },
      // —— v2.0 扩：都市夜景 ——
      {
        g: "都市·夜景", nsfw: false, items: [
          { zh: "夜晚天台", en: "rooftop at night" },
          { zh: "天台泳池", en: "rooftop pool" },
          { zh: "夜晚阳台", en: "balcony at night" },
          { zh: "消防梯", en: "fire escape stairs" },
          { zh: "后巷", en: "back alley" },
          { zh: "夜晚观景台", en: "observation deck at night" },
          { zh: "街机厅", en: "arcade" },
          { zh: "游戏中心", en: "game center" },
          { zh: "电影院", en: "movie theater" },
        ]
      },
      // —— v2.0 扩：浴室 ——
      {
        g: "浴室·细分", nsfw: false, items: [
          { zh: "淋浴间", en: "shower room" },
          { zh: "浴缸", en: "bathtub" },
          { zh: "空浴缸", en: "empty_bathtub" },
          { zh: "蒸汽淋浴", en: "steamy shower" },
          { zh: "泡泡浴", en: "bubble bath" },
          { zh: "起雾浴室镜", en: "bathroom mirror fogged" },
          { zh: "浴帘", en: "shower curtain" },
        ]
      },
    ],

    /* ========================================================================
     * 【镜头语言】四个互相独立的小栏（景别/焦段/角度/视角），现在都可【多选】。
     * 格式都是 { zh, en }。
     * ======================================================================*/

    /* 景别：镜头离多远 / 取到身体哪 */
    shotSize: [
      { zh: "特写", en: "close-up" },
      { zh: "近景(胸像)", en: "cowboy shot, upper body" },
      { zh: "中景", en: "medium shot" },
      { zh: "全景", en: "full body" },
      { zh: "远景", en: "wide shot" },
      { zh: "大特写", en: "extreme close-up" },
      { zh: "头像特写", en: "headshot" },
    ],

    /* 焦段：多少毫米；对真人向作用明显，对动漫较弱，带着无害。不要加括号权重。 */
    focal: [
      { zh: "24mm 广角", en: "24mm" },
      { zh: "35mm", en: "35mm" },
      { zh: "50mm", en: "50mm" },
      { zh: "85mm", en: "85mm" },
      { zh: "135mm", en: "135mm" },
    ],

    /* 角度：机位高低/方位 */
    angle: [
      { zh: "平视", en: "eye level" },
      { zh: "俯视", en: "high angle" },
      { zh: "仰视", en: "low angle" },
      { zh: "侧视", en: "side view" },
      { zh: "从背后", en: "from behind" },
      { zh: "过肩", en: "over-the-shoulder" },
      { zh: "动态角度", en: "dynamic angle" },
      { zh: "倾斜构图", en: "dutch angle" },
      { zh: "四分之三侧", en: "three-quarter view" },
      { zh: "从上方", en: "from above" },
      { zh: "从下方", en: "from below" },
      { zh: "鸟瞰", en: "aerial view" },
      { zh: "广角全景", en: "wide angle, panoramic view, wide shot" },
      { zh: "体位专属·后入视角", en: "from behind close-up, penetration view, ass up view", nsfw: true },
      { zh: "骑乘与抱起·低角度", en: "low angle, cowgirl up view, lifted legs view", nsfw: true },
    ],

    /* 视角：观看关系。looking at viewer 只在这里出现一次，别处别重复。 */
    view: [
      { zh: "第一人称", en: "POV" },
      { zh: "低头看她", en: "looking down at her" },
      { zh: "观众视角", en: "viewer perspective" },
      { zh: "看向别处", en: "looking away" },
      { zh: "抬头看", en: "looking up" },
      { zh: "低头看", en: "looking down" },
      { zh: "看向一侧", en: "looking to the side" },
      { zh: "凝视", en: "staring" },
      { zh: "对视", en: "eye contact" },
    ],

    /* 【光影】现在【可多选】；选风格时通常会自动带一组，这里也能手动改/随机/留空。 */
    lighting: [
      { zh: "电影感", en: "cinematic lighting" },
      { zh: "边缘光", en: "rim lighting" },
      { zh: "逆光", en: "backlighting" },
      { zh: "柔光", en: "soft lighting" },
      { zh: "体积光", en: "volumetric lighting" },
      { zh: "戏剧光", en: "dramatic lighting" },
      { zh: "黄金时刻", en: "golden hour" },
      { zh: "蓝调时刻", en: "blue hour" },
      { zh: "霓虹光", en: "neon lighting, neon light, neon lights, neon rim light, colored gel lighting, pink and blue split lighting, neon glow on wet skin" },
      { zh: "烛光", en: "candlelight" },
      { zh: "月光", en: "moonlight" },
      { zh: "阳光", en: "sunlight" },
      { zh: "剪影", en: "silhouette" },
      { zh: "丁达尔光", en: "god rays" },
      { zh: "镜头光晕", en: "lens flare" },
      { zh: "散景", en: "bokeh" },
      { zh: "暖光", en: "warm lighting" },
      { zh: "冷光", en: "cool lighting" },
      { zh: "硬光", en: "harsh lighting, hard lighting, hard light, sharp shadow, high contrast, high contrast light" },
      { zh: "晨光", en: "morning light" },
      { zh: "黄昏光", en: "sunset lighting" },
      { zh: "自然光", en: "natural lighting" },
      { zh: "环境光", en: "ambient lighting" },
      { zh: "柔光箱", en: "softbox lighting, soft box lighting, soft box, beauty dish, even illumination, luminous skin" },
      { zh: "环形灯", en: "ring light" },
      { zh: "伦勃朗光", en: "rembrandt lighting, Rembrandt lighting, triangle of light on cheek, chiaroscuro portrait, chiaroscuro" },
      { zh: "侧光", en: "side lighting" },
      { zh: "顶光", en: "top lighting" },
      { zh: "底光", en: "underlighting, under lighting, uplighting, eerie glow" },
      { zh: "聚光", en: "spotlight" },
      { zh: "舞台光", en: "stage lighting" },
      { zh: "窗光", en: "window light" },
      { zh: "荧光灯", en: "fluorescent lighting" },
      { zh: "阴天漫射", en: "overcast lighting" },
      { zh: "钨丝灯光", en: "tungsten lighting" },
      { zh: "青橙调色", en: "teal and orange" },

      // —— v2.0 扩：专业布光 ——
      { zh: "发丝光", en: "hair light, edge lighting, backlit hair glow" },
      { zh: "侧逆光", en: "back side light, side backlight" },
      { zh: "蝴蝶光", en: "butterfly lighting, Paramount lighting, beauty portrait light" },
      { zh: "分割光", en: "split lighting, half face lit, face split by shadow" },
      { zh: "环形光", en: "loop lighting, natural portrait light" },
      { zh: "剪影光", en: "silhouette lighting, backlit figure, body contour silhouette" },
      // —— v2.0 扩：电影感布光 ——
      { zh: "体积光雾", en: "volumetric light, god rays, light shafts through dust, atmospheric haze" },
      { zh: "黑色电影光", en: "film noir lighting, venetian blind shadows, shadow bars across body, low key noir" },
      { zh: "魔法时刻光", en: "magic hour light, golden hour window, morning backlight, twilight blue, moonbeam through window, fireplace warm glow" },
      // —— v2.0 扩：特殊光影效果 ——
      { zh: "透射光", en: "backlit ears, translucent fingers, light through thin fabric, veins visible in backlight, light through wet hair, translucent skin glow" },
      { zh: "反射光", en: "specular highlights on body, eye catchlight, glossy lip shine, light bounce from white sheet" },
      { zh: "光影纹理", en: "lace shadow pattern on skin, curtain shadow stripes, tree leaf shadow dapple, window frame shadow grid, bamboo blind shadows, hair shadow on face" },
      { zh: "光雾交互", en: "light through steam, backlit shower spray, dusty light rays, breath visible in cold light, smoke catching light, dust motes in sunbeam, condensation droplets catching light" },
      // —— v2.0 扩：色温 ——
      { zh: "烛光暖", en: "warm candlelight, amber glow, golden skin tones, intimate warmth" },
      { zh: "钨丝灯", en: "tungsten light, warm bulb glow, cozy" },
      { zh: "日光", en: "natural daylight, bright sunlight" },
      { zh: "阴天柔", en: "overcast soft light, cloudy diffusion" },
      { zh: "冷白荧光", en: "cold fluorescent, clinical white, sterile" },
      { zh: "月光冷", en: "moonlight blue, cool night, silver-blue ambient" },
    ],

    /* 【正向补充】现在依然【可多选】的“加料标签”，缺啥补啥。一行格式同样是 { zh, en }。 */
    extras: [
      { zh: "景深", en: "depth of field" },
      { zh: "鲜艳色彩", en: "vibrant colors" },
      { zh: "丝发", en: "detailed hair" },
      { zh: "锐利对焦", en: "sharp focus" },
      { zh: "柔焦", en: "soft focus" },
      { zh: "胶片颗粒", en: "film grain" },
      { zh: "高对比", en: "high contrast" },
      { zh: "飘动秀发", en: "flowing hair" },
      { zh: "氛围感", en: "atmospheric" },
      { zh: "色彩分级", en: "color grading" },
    ],

    /* ========================================================================
     * 【负向词墙】分 A / B / C 三组，都是“可点选的中文标签”。
     * 一行格式：{ zh:"中文名", en:"要加进负向的英文", pony:true/false, sdxl:true/false }
     *   - pony:true  = 选 Pony 模式时【默认自动勾选】它
     *   - sdxl:true  = 选 SDXL/Illustrious 模式时【默认自动勾选】它
     *   - 两个都 true = 两种模式都默认勾
     * A 组 negA：画质/解剖崩坏，默认常开（用户可手动取消）
     * ======================================================================*/
    negA: [
      { zh: "低质量", en: "low quality, worst quality", pony: true, sdxl: true },
      { zh: "低分辨率", en: "poor quality, lowres", pony: false, sdxl: true },
      { zh: "解剖畸形", en: "bad anatomy, bad proportions, deformed", pony: true, sdxl: true },
      { zh: "毁容变异", en: "disfigured, mutated", pony: false, sdxl: true },
      { zh: "模糊", en: "blurry", pony: true, sdxl: true },
      { zh: "坏手多指", en: "extra fingers, bad hands", pony: true, sdxl: true },
      { zh: "多肢缺指", en: "extra limbs, missing fingers", pony: false, sdxl: true },
      { zh: "文字水印签名", en: "text, watermark, signature", pony: true, sdxl: true },
      { zh: "压缩痕迹", en: "jpeg artifacts", pony: false, sdxl: true },
      { zh: "出框裁切", en: "out of frame, cropped", pony: false, sdxl: true },
      { zh: "脸部崩坏", en: "poorly drawn face", pony: true, sdxl: true },
      { zh: "手部崩坏", en: "poorly drawn hands", pony: true, sdxl: true },
      { zh: "手指粘连", en: "fused fingers", pony: true, sdxl: true },
      { zh: "脖子过长", en: "long neck", pony: true, sdxl: true },
      { zh: "过曝", en: "overexposed", pony: false, sdxl: true },
      { zh: "欠曝", en: "underexposed", pony: false, sdxl: true },
    ],

    /* B 组 negB：风格排除，默认不勾，想要哪种效果再手动点（点太多可能压灰画面）。
     * 一行格式：{ zh:"中文名", en:"英文" }（不需要 pony/sdxl 标记） */
    negB: [
      { zh: "去动画线稿感", en: "anime style, cel shading, flat color, flat colors, lineart, sketch" },
      { zh: "去3D真人感", en: "3d, realistic, photorealistic, cgi" },
    ],

    /* C 组 negC：尺度。由“露骨/正经”开关自动控制，不用手动点：
     * 正经时自动勾上，露骨时自动取消并锁灰（防止把自己要的内容负向掉）。 */
    negC: [
      { zh: "压制裸露（正经用）", en: "nsfw, nude, explicit, revealing clothes" },
    ],

    /* ========================================================================
     * 【裸露梯度】管“露多少”。露骨模式才显示。单选，选一档。
     * 分组结构（大组 → 小项），整层 nsfw:true = 露骨模式才出现。
     * 每档是一组“裸露描述”（点这档就带出整套裸露词）。
     * 加档：在 items 里照抄一行 { zh:"中文名", en:"英文", } 即可。
     * ======================================================================*/
    exposureLevel: [
      { g: "裸露梯度", nsfw: true, items: [
          { zh: "L1 全遮·暗示", en: "fully clothed, tight dress showing silhouette, figure visible under clothes, fabric hugging curves" },
          { zh: "L2 差分·泄露", en: "one shoulder, slit showing thigh, zipper slightly down, fabric slip" },
          { zh: "L3 半裸·诱惑", en: "clothes off one side, blouse open, skirt hiked up, underwear visible" },
          { zh: "L4 极简·遮挡", en: "only panties, bra slightly off, topless" },
          { zh: "L5 完全裸露", en: "nude, naked, fully exposed" },
          { zh: "L6 展示·裸露", en: "nude, hands spreading, exposed for viewer, legs spread" },
      ] },
    ],

    /* ========================================================================
     * 【穿脱状态】管“怎么脱/穿成啥样”。露骨模式才显示。可多选。
     * 分组结构，整层 nsfw:true = 露骨模式才出现。
     * 一行格式：{ zh:"中文名", en:"英文" },
     * ======================================================================*/
    clothState: [
      { g: "穿脱状态", nsfw: true, items: [
          { zh: "解开扣子", en: "blouse unbuttoned, shirt open", tip: "服装×裸露自洽：解开扣子时建议搭配内衣可见或裸露梯度词，避免空开" },
          { zh: "滑落肩头", en: "clothing slipping off shoulder, falling off" },
          { zh: "掀起裙摆", en: "skirt hiked up, lifted" },
          { zh: "半褪", en: "clothing half off, partially removed" },
          { zh: "扯开", en: "clothes torn, ripped open" },
          { zh: "打湿贴身", en: "wet clothes clinging, soaked", tip: "服装×裸露自洽：湿身透出时禁用 see-through/sheer 系词（穿透伪影），用 wet clothes clinging 替代" },
          { zh: "汗湿", en: "sweat-soaked, damp shirt" },
          { zh: "凌乱", en: "disheveled, rumpled clothes" },
      ] },

      // —— v2.0 扩：衣物状态10型细分 ——
      { g: "滑落型", nsfw: true, items: [
          { zh: "文胸滑落", en: "bra slipping off" },
          { zh: "浴巾滑落", en: "towel slipping off shoulder" },
          { zh: "连衣裙滑落", en: "dress slipping off" },
          { zh: "肩带掉落", en: "strap falling" },
          { zh: "裙子滑腰", en: "skirt sliding off hips" },
          { zh: "腰带松开", en: "belt coming undone" },
          { zh: "鞋子掉落", en: "shoe falling off" },
      ] },
      { g: "掀起型", nsfw: true, items: [
          { zh: "衬衫掀起", en: "shirt lifted" },
          { zh: "裙子撩腰", en: "dress pulled up to waist" },
          { zh: "内裤拨开", en: "panties pulled aside" },
          { zh: "布料堆腰", en: "fabric bunched at waist" },
          { zh: "毯子掀起", en: "blanket lifted" },
      ] },
      { g: "撕毁型", nsfw: true, items: [
          { zh: "连衣裙撕毁", en: "torn dress" },
          { zh: "丝袜撕破", en: "ripped stockings" },
          { zh: "衣物扯掉", en: "clothes torn off" },
          { zh: "内衣撕毁", en: "ripped lingerie" },
          { zh: "衣物毁坏", en: "destroyed clothing" },
          { zh: "扣子崩开", en: "buttons popping" },
      ] },
      { g: "风吹型", nsfw: false, items: [
          { zh: "风吹裙摆", en: "wind blowing skirt up" },
          { zh: "风掀连衣裙", en: "dress lifting in breeze" },
          { zh: "裙摆翻飞", en: "hem flipping up" },
          { zh: "风压贴身", en: "wind pressing fabric against body showing silhouette" },
          { zh: "风吹开衫", en: "wind blowing shirt open" },
          { zh: "外套翻飞", en: "coat flapping" },
          { zh: "风贴连衣裙", en: "dress plastered to body by wind" },
          { zh: "丝带风解", en: "ribbon untying in wind" },
          { zh: "布料涟漪", en: "fabric rippling" },
      ] },
      { g: "打湿型", nsfw: false, items: [
          { zh: "雨淋白衬衫", en: "rain-soaked white shirt" },
          { zh: "湿透滴水", en: "drenched and dripping" },
          { zh: "湿T恤贴身", en: "wet t-shirt clinging" },
          { zh: "湿透透轮廓", en: "soaked through revealing outline" },
          { zh: "衣物滴水", en: "clothes dripping water" },
          { zh: "脚下水洼", en: "puddle at feet" },
      ] },
      { g: "汗湿型", nsfw: false, items: [
          { zh: "闷热汗湿", en: "clothes damp from heat" },
          { zh: "衬衫贴背", en: "shirt sticking to back" },
          { zh: "领口汗湿", en: "damp collar" },
          { zh: "运动服湿透", en: "gym clothes drenched" },
          { zh: "汗湿变色", en: "fabric darkened by sweat" },
          { zh: "汗湿粘肤", en: "fabric glued to skin" },
      ] },
      { g: "凌乱型", nsfw: false, items: [
          { zh: "睡皱衣物", en: "clothes wrinkled from sleep" },
          { zh: "衬衫反穿", en: "shirt inside-out" },
          { zh: "扣错扣子", en: "buttoned wrong" },
          { zh: "衣领歪斜", en: "collar askew" },
          { zh: "一鞋穿一鞋脱", en: "one shoe on one off" },
          { zh: "丝袜卷边", en: "stockings rolled unevenly" },
          { zh: "衬衫一边外露", en: "shirt untucked on one side" },
          { zh: "拉链半拉", en: "zipper half-up" },
          { zh: "腰带晃荡", en: "belt dangling" },
          { zh: "穿搭不搭", en: "mismatched clothes" },
          { zh: "一耳环失踪", en: "one earring missing" },
          { zh: "半脸妆", en: "makeup half-done" },
      ] },
      { g: "破旧型", nsfw: false, items: [
          { zh: "褪色布料", en: "faded fabric" },
          { zh: "肘部磨薄", en: "threadbare at elbows" },
          { zh: "起球毛衣", en: "pilling sweater" },
          { zh: "领口松垮", en: "stretched-out neckline" },
          { zh: "下摆磨毛", en: "fraying hem" },
          { zh: "丝袜抽丝", en: "laddered tights, run in stocking" },
          { zh: "旧棉软穿", en: "old cotton worn soft" },
          { zh: "膝盖补丁", en: "patched knee" },
          { zh: "缝补可见", en: "mended seam visible" },
          { zh: "别针固定", en: "safety pin holding together" },
      ] },
      { g: "遮挡失败型", nsfw: true, items: [
          { zh: "手遮太小", en: "hand trying to cover but too small" },
          { zh: "手臂遮胸", en: "arm across chest" },
          { zh: "浴巾太短", en: "clutching towel too short" },
          { zh: "裙子意外上滑", en: "skirt rides up accidentally" },
          { zh: "前倾露沟", en: "leaning forward and cleavage spills" },
          { zh: "伸展上衣上移", en: "stretching and top lifts" },
      ] },
    ],

    /* ========================================================================
     * 【体液】管“体液/液体/射精”。露骨模式才显示。可多选。
     * 分组结构，整层 nsfw:true = 露骨模式才出现。
     * 一行格式：{ zh:"中文名", en:"英文" },
     * ======================================================================*/
    fluids: [
      { g: "体液·射精", nsfw: true, items: [
          { zh: "精液", en: "cum, semen", tip: "液体用最小量词原则：建议搭配 single drop / thin streak / faint trace，避免大量液体词导致画面崩坏" },
          { zh: "颜射", en: "facial, cum on face", tip: "颜射时建议睁眼/半睁眼，闭眼会与液体状态冲突" },
          { zh: "射身体", en: "bukkake, cum on body" },
          { zh: "射嘴里·吞", en: "cum in mouth, swallowing" },
      ] },
      { g: "体液·爱液", nsfw: true, items: [
          { zh: "爱液", en: "pussy juice, wet", tip: "爱液建议搭配 wet / glistening，避免大量液体词" },
          { zh: "潮吹", en: "female_ejaculation, squirting", tip: "潮吹属于高难度动作，纯词命中率低，建议半身/特写构图" },
          { zh: "唾液·拉丝", en: "saliva, drool, slobber, string" },
          { zh: "汗", en: "sweat" },
          { zh: "量感·薄痕", en: "faint trace" },
          { zh: "量感·细流", en: "thin streak" },
          { zh: "量感·单滴", en: "single drop" },
      ] },

      // —— v2.0 扩：进阶包·小众液体类（第三轮 2026-09-12 豆总派活：advanced:true → nsfw:true，
      //    露骨模式才出现；代码里 advanced 过滤逻辑留着不动，行为不变） ——
      { g: "进阶·小众液体", nsfw: true, items: [
          { zh: "湿身糊身", en: "WAM, wet and messy, food splosh", advanced: true, nsfw: true, tip: "进阶包：湿身混乱/糊身play" },
          { zh: "食物play", en: "food play, food on body", advanced: true, nsfw: true, tip: "进阶包：食物涂抹/食物play" },
          { zh: "灌精", en: "cum_inflation, excessive_cum, cum_in_pussy", advanced: true, nsfw: true, tip: "进阶包：大量内射/灌精膨胀" },
          { zh: "繁殖育种", en: "mating_press, breeding", advanced: true, nsfw: true, tip: "进阶包：繁殖/育种体位" },
          { zh: "受孕暗示", en: "impregnation, pregnant", advanced: true, nsfw: true, tip: "进阶包：受孕/怀孕暗示" },
          { zh: "产卵", en: "oviposition, egg laying", advanced: true, nsfw: true, tip: "进阶包：产卵/魔物娘产卵" },
          { zh: "身体膨胀", en: "inflation, body inflation, belly inflation", advanced: true, nsfw: true, tip: "进阶包：充气/身体膨胀" },
          { zh: "精神崩溃", en: "mind break, ahegao, rolling eyes", advanced: true, nsfw: true, tip: "进阶包：高潮失神/精神崩溃表情" },
      ] },
    ],

    /* ========================================================================
     * 【镜头·露骨】管“露骨专用镜头/眼神”——专门解决“直视镜头+露器官”效果差的问题。
     * 露骨模式才显示。可多选。这些是“直视镜头 + 勾引眼神 + 露器官”的强词，
     * 比普通 looking at viewer 更能让模型“直视你并展示”。
     * 分组结构，整层 nsfw:true = 露骨模式才出现。
     * ======================================================================*/
    nsfwShot: [
      { g: "直视镜头·露骨", nsfw: true, items: [
          { zh: "直视镜头", en: "direct eye contact with camera, eyes pulling viewer in", tip: "眼神×镜头方向匹配：直视镜头建议搭配 looking at viewer, eye contact，避免与 looking away 冲突" },
          { zh: "勾引凝视", en: "eye-fucking the viewer, devouring stare, hungry gaze, possessive look, seductive eye contact", tip: "勾引凝视属于强眼神词，建议搭配直视镜头/半身构图，避免与害羞/闭眼冲突" },
          { zh: "贪婪注视", en: "wanton gaze, insatiable stare, no-shame eye contact, greedy wanting eyes, lustful desperate gaze" },
          { zh: "看镜头咬唇", en: "making eye contact with camera, biting lower lip shyly" },
          { zh: "看镜头又羞躲", en: "making eye contact with camera then breaking away shyly" },
          { zh: "眼神勾搭", en: "making eye contact from across room, seductive glance, longingly gaze" },
      ] },
      { g: "露器官·展示", nsfw: true, items: [
          { zh: "双腿大开露阴", en: "legs spread wide open, pussy fully displayed, spreading labia" },
          { zh: "掰开生殖器展示", en: "spreading labia, pussy exposed, presenting" },
          { zh: "跪·露私处", en: "kneeling, thighs spread wide, pussy exposed" },
          { zh: "内裤拨开", en: "panties pushed aside, pussy visible, no panties" },
          { zh: "自慰·指插", en: "hand between legs, touching self, fingers inside, pussy visible, juice glistening" },
          { zh: "双人·看生殖器", en: "between legs view, spread legs, pussy visible" },
          { zh: "双人·俯视插入", en: "high angle, missionary, view of penetration from above" },
          { zh: "双人·从后露臀", en: "from behind, ass spread, pussy visible, doggy" },
          { zh: "双人·跪姿口交", en: "kneeling between legs, face at crotch" },
      ] },
      { g: "体位·视角", nsfw: true, items: [
          { zh: "体位专属·后入视角", en: "from behind close-up, penetration view, ass up view, pussy visible from behind" },
          { zh: "骑乘与抱起·低角度", en: "low angle, cowgirl up view, lifted legs view, pussy visible below" },
          { zh: "俯视·插入特写", en: "high angle, view of penetration from above, on top" },
          { zh: "侧拍·交合特写", en: "side view, close-up of penetration, bodies pressed" },
          { zh: "胯下·仰视视角", en: "crotch-level shot, from below, looking up" },
      ] },
    ],

    /* ========================================================================
     * 【身份·露骨】管“跨性别/扶她/特殊身份”。露骨模式才显示。多选。
     * 分组结构，整层 nsfw:true = 露骨模式才出现。
     * ======================================================================*/
    identityNsfw: [
      { g: "身份·跨性别", nsfw: true, items: [
          { zh: "扶她（双性）", en: "futanari" },
          { zh: "跨性别女", en: "transgender, trans girl, tgirl" },
          { zh: "伪娘", en: "femboy, crossdresser, otokonoko" },
          { zh: "人妖", en: "shemale, ladyboy" },
          { zh: "女装男", en: "crossdressing male" },
          { zh: "人外娘", en: "monster girl, animal ears, kemonomimi" },
      ] },
    ],

    /* ========================================================================
     * 【场景·露骨】管“露骨场景/发生地”。露骨模式才显示。多选。
     * 分组结构，整层 nsfw:true = 露骨模式才出现。
     * ======================================================================*/
    sceneNsfw: [
      { g: "场景·室内私密", nsfw: true, items: [
          { zh: "情人酒店", en: "love hotel, pink room, hotel bedroom" },
          { zh: "卧室·大床", en: "bedroom, big bed, on bed" },
          { zh: "浴室·湿身", en: "bathroom, shower, wet body" },
          { zh: "温泉·钱汤", en: "onsen, hot spring, sento" },
          { zh: "浴缸", en: "bathtub, bubble bath" },
      ] },
      { g: "场景·校园", nsfw: true, items: [
          { zh: "教室·放学后", en: "classroom, after school, empty classroom" },
          { zh: "图书馆·角落", en: "library, reading corner, quiet" },
          { zh: "校服·更衣室", en: "locker room, school changing room" },
          { zh: "天台·午后", en: "school rooftop, afternoon" },
      ] },
      { g: "场景·职场", nsfw: true, items: [
          { zh: "办公室·深夜", en: "office, after hours, desk" },
          { zh: "会议室", en: "meeting room, conference" },
          { zh: "机室·机房", en: "server room, office cubicle" },
      ] },
      { g: "场景·公共/户外", nsfw: true, items: [
          { zh: "深夜电车", en: "train, subway, last train, empty carriage" },
          { zh: "电梯", en: "elevator, stuck" },
          { zh: "卫生间·隔间", en: "bathroom stall, restroom" },
          { zh: "公园·夜晚", en: "park, night, outdoor" },
          { zh: "车震", en: "in car, back seat, parking lot" },
          { zh: "天台·晾衣", en: "balcony, rooftop" },
      ] },
      { g: "场景·和风/传统", nsfw: true, items: [
          { zh: "和室·榻榻米", en: "tatami room, japanese room" },
          { zh: "旅馆·温泉", en: "ryokan, onsen inn" },
          { zh: "神社·神社庭", en: "shrine, torii, quiet" },
      ] },
      { g: "场景·医/按摩", nsfw: true, items: [
          { zh: "诊疗室·检查", en: "clinic, examination room, doctor" },
          { zh: "按摩·SPA", en: "massage room, spa, oil" },
      ] },
    ],

    /* ========================================================================
     * 【妆容】管“脸上的妆”。通用细节层，正经/露骨都可选。多选。
     * 每项=一个大类（中文=类名，英文=整类标签拼一起，点一下带出整套）。
     * ======================================================================*/
    makeup: [
      { g: "日常清透", nsfw: false, items: [
          { zh: "清纯伪素颜", en: "natural makeup, pure face, clean beauty, minimal makeup, barely-there foundation, hydrated skin, sheer lip balm" },
          { zh: "裸妆", en: "no-makeup makeup, barely-there makeup, natural makeup, natural glowing skin, tinted moisturizer, clear lip gloss, subtle brow gel" },
          { zh: "淡妆", en: "light makeup, soft natural makeup, sheer foundation, neutral eyeshadow, pink lip tint, natural blush" },
          { zh: "通勤妆", en: "office makeup, professional makeup, neutral tones, defined brows, mascara, neutral lipstick, natural lip color, polished look" },
          { zh: "奶油肌", en: "creamy skin, dewy foundation, luminous complexion, soft glow, hydrated plump skin, natural radiance" },
      ] },
      { g: "甜美少女", nsfw: false, items: [
          { zh: "甜美果汁妆", en: "kawaii makeup, peachy eyeshadow, aegyo sal, glossy pink lips, rosy cheek flush, dewy glass skin" },
          { zh: "桃花妆", en: "peach blossom makeup, pink eyeshadow, rosy cheeks, gradient pink lips, youthful glow, sweet romantic look" },
          { zh: "蜜桃妆", en: "peachy makeup, warm peach tones, peachy blush, coral lipstick, golden eyeshadow, fresh summer look" },
          { zh: "宿醉腮红", en: "hungover blush, drunk blush, heavy pink blush on cheeks and nose, teary eyes, glossy lips, messy cute look" },
          { zh: "晒伤妆", en: "sunburn blush, faux freckles, nose and cheek redness, warm sun-kissed look, bronze skin, summer makeup" },
      ] },
      { g: "轻熟御姐", nsfw: false, items: [
          { zh: "人妻轻熟妆", en: "wife makeup, mature beauty, soft glam, warm brown eyeshadow, creamy satin foundation, rosewood matte lips" },
          { zh: "港风妆", en: "hong kong style makeup, 90s retro makeup, bold brows, red lipstick, warm brown eyeshadow, glossy skin, vintage glamour" },
          { zh: "复古妆", en: "vintage makeup, retro pinup makeup, winged eyeliner, red lipstick, contour, defined brows, classic hollywood look" },
          { zh: "猫眼妆", en: "cat eye makeup, dramatic winged eyeliner, feline eyes, smoky outer corner, long lashes, bold brow, sexy look" },
          { zh: "截断式眼妆", en: "cut crease makeup, sharp eyeshadow line, glitter lid, bold brow, false lashes, dramatic eye, glamorous look" },
      ] },
      { g: "浓艳魅惑", nsfw: false, items: [
          { zh: "魅惑烟熏妆", en: "glamorous sultry makeup, smoky eye makeup, winged black eyeliner, bold crimson lipstick, sculpted cheekbones, full coverage matte" },
          { zh: "夜店妆", en: "club makeup, night out makeup, glitter eyeshadow, bold contour, glossy lips, long lashes, dramatic highlight, party look" },
          { zh: "女王妆", en: "dominatrix makeup, fierce look, sharp contour, dark smoky eyes, deep red lipstick, bold brows, powerful glamorous look" },
          { zh: "正红唇", en: "classic red lipstick, bold red lips, winged eyeliner, flawless skin, defined brows, timeless glamorous look" },
      ] },
      { g: "古风国风", nsfw: false, items: [
          { zh: "古风妆", en: "chinese traditional makeup, hanfu makeup, pale skin, red lips, delicate eyeshadow, floral hair accessory, ancient chinese beauty" },
          { zh: "民国妆", en: "republic era makeup, vintage chinese makeup, wave hair, red lipstick, thin brows, qipao style, elegant retro look" },
          { zh: "仙侠妆", en: "xianxia makeup, ethereal makeup, pale glowing skin, soft pink lips, delicate eyeshadow, flowing hair, otherworldly beauty" },
      ] },
      { g: "状态残妆", nsfw: true, items: [
          { zh: "脱妆花妆", en: "ruined makeup, smudged eyeliner, running mascara, smeared lipstick, melting foundation, messy makeup look" },
          { zh: "泪痕残妆", en: "tear stained makeup, tear tracks down cheeks, smudged eyeliner, watery red-rimmed eyes, crying makeup, ruined look" },
          { zh: "高潮潮红妆", en: "pleasure flush on cheeks, heated red face, sweat glistening on skin, bitten swollen red lips, parted glossed lips, heavy sleepy eyelids" },
          { zh: "浴室湿身妆", en: "wet skin look, water droplets on face, dewy foundation, natural rosy flush from warm bath, glossy wet lips, clean lashes" },
          { zh: "被支配顺从妆", en: "submissive makeup, finger mark on cheek, grab redness on face, smudged kohl eyeliner, transferred lipstick on lips, swollen bruised lip" },
      ] },
    ],

    /* ========================================================================
     * 【瑕疵】管“皮肤/身体细节（痣/毛孔/勒痕等）”。通用细节层，多选。
     * ======================================================================*/
    imperfections: [
      { g: "皮肤细节", nsfw: false, items: [
          { zh: "雀斑", en: "freckles, delicate freckles across nose and cheeks, natural beauty marks, sun-kissed skin" },
          { zh: "泪痣/美人痣", en: "delicate beauty mark near eye, small dark mole on collarbone, tiny freckle on cheek" },
          { zh: "痘印", en: "acne scars, post-acne marks, faint red marks on cheeks, skin texture, natural imperfections" },
          { zh: "疤痕", en: "scar, old scar, faint scar on skin, surgical scar, healed wound mark, skin texture detail" },
          { zh: "皱纹", en: "fine lines, wrinkles, laugh lines, crow's feet, forehead lines, natural skin texture, mature skin" },
          { zh: "可见毛孔", en: "visible fine skin pores, natural skin texture, authentic realistic skin surface, detailed skin" },
          { zh: "晒痕/内衣勒痕", en: "bra strap indent marks on shoulders, elastic pressure line on skin, subtle bikini tan lines, tan lines" },
          { zh: "黑眼圈", en: "dark circles under eyes, eye bags, tired eyes, faint shadows under eyes, natural under-eye texture" },
          { zh: "皮肤纹理/汗毛", en: "natural skin texture, fine peach fuzz, subtle facial hair, skin pores, subsurface scattering, realistic skin" },
          { zh: "唇纹", en: "natural lip texture, lip lines, detailed lips, matte lip texture, natural lip creases" },
      ] },
      { g: "身体骨感", nsfw: false, items: [
          { zh: "胎记", en: "birthmark, cafe au lait spot, red birthmark, pigmented skin mark, natural skin marking" },
          { zh: "妊娠纹/肥胖纹", en: "stretch marks, pregnancy scars, silver stretch marks on abdomen and thighs, skin texture, body marks" },
          { zh: "关节细节", en: "subtle knuckle creases, defined knee caps, prominent elbow bones, detailed ankle bones, joint texture, slender fingers" },
          { zh: "美甲/短甲", en: "delicate manicured fingernails, short natural nails, natural nail color, sheer nail polish, subtle nail detail, natural hands" },
          { zh: "虎牙/牙齿不齐", en: "slightly crooked teeth, cute fang, canine tooth, natural smile, imperfect teeth, authentic smile" },
          { zh: "锁骨/肩胛骨", en: "prominent defined collarbone hollow, visible shoulder blades, delicate bone structure, slender shoulders, bony detail" },
          { zh: "脊椎/肋骨", en: "visible spine, defined ribcage, subtle rib bones, slender back, bony detail, anatomical detail" },
          { zh: "脚踝骨", en: "prominent ankle bones, delicate feet, defined tendons, arched foot, slender ankles, foot detail" },
      ] },
      { g: "真实感", nsfw: false, items: [
          { zh: "轻微面部不对称", en: "subtle facial asymmetry, natural face, authentic features, imperfect symmetry, realistic portrait" },
          { zh: "自然碎发", en: "flyaway hairs, stray hairs, natural messy hair, individual hair strands, wind-blown hair, realistic hair detail" },
          { zh: "汗水/汗珠", en: "sweat, sweat droplets, glistening skin, beads of sweat, damp skin, sweaty body, moisture on skin" },
          { zh: "胶片颗粒", en: "film grain, photographic noise, analog texture, vintage film look, grainy texture, cinematic grain" },
      ] },
    ],

    /* ========================================================================
     * 【纹身】管“纹身图案”。通用细节层，多选。
     * ======================================================================*/
    tattoos: [
      { g: "动物", nsfw: false, items: [
          { zh: "龙", en: "dragon tattoo, detailed serpent, scales, claws, traditional asian dragon, fierce mythical beast", tip: "纹身建议搭配皮肤融合词：skin detail, subsurface scattering, realistic skin texture，避免纹身像贴纸" },
          { zh: "虎", en: "tiger tattoo, big cat, stripes, fierce predator, detailed fur, powerful animal ink" },
          { zh: "蛇", en: "snake tattoo, serpent, scales, coiling snake, reptile detail, slithering creature ink" },
          { zh: "蝴蝶", en: "butterfly tattoo, delicate wings, insect detail, colorful butterfly, feminine ink, nature tattoo" },
          { zh: "鸟", en: "bird tattoo, swallow, sparrow, feathered creature, flying bird, wings spread, avian ink" },
          { zh: "鱼", en: "fish tattoo, koi fish, carp, scales, aquatic creature, swimming fish, japanese koi ink" },
          { zh: "猫", en: "cat tattoo, feline, kitty, whiskers, cat eyes, pet portrait ink, cute animal tattoo" },
          { zh: "狼", en: "wolf tattoo, wild canine, howling wolf, pack animal, fierce predator, moon wolf ink" },
          { zh: "鹰", en: "eagle tattoo, bird of prey, hawk, sharp talons, spread wings, majestic raptor ink" },
          { zh: "凤凰", en: "phoenix tattoo, mythical bird, rising phoenix, flames, rebirth symbol ink" },
      ] },
      { g: "植物", nsfw: false, items: [
          { zh: "玫瑰", en: "rose tattoo, blooming rose, thorns, petals, romantic flower, detailed floral ink" },
          { zh: "樱花", en: "cherry blossom tattoo, sakura, pink petals, falling blossoms, japanese flower, delicate floral ink" },
          { zh: "牡丹", en: "peony tattoo, large flower, lush petals, chinese flower, ornate floral, detailed bloom ink" },
          { zh: "莲花", en: "lotus tattoo, water lily, sacred flower, buddhist symbol, purity, aquatic flower ink" },
          { zh: "向日葵", en: "sunflower tattoo, yellow flower, sun symbol, large petals, cheerful flower, summer bloom ink" },
          { zh: "藤蔓", en: "vine tattoo, climbing plant, leaves, tendrils, nature, greenery, winding plant ink" },
      ] },
      { g: "文字/宗教", nsfw: false, items: [
          { zh: "汉字", en: "chinese character tattoo, kanji, calligraphy, chinese script, word tattoo, meaning symbol ink" },
          { zh: "英文", en: "lettering tattoo, script tattoo, english text, quote tattoo, word tattoo, cursive script ink" },
          { zh: "梵文", en: "sanskrit tattoo, devanagari script, mantra, sacred text, buddhist symbol, spiritual ink" },
          { zh: "十字架", en: "cross tattoo, christian cross, religious symbol, faith, crucifix, sacred symbol ink" },
          { zh: "佛像", en: "buddha tattoo, buddhist deity, meditating buddha, spiritual figure, zen, religious icon ink" },
          { zh: "天使", en: "angel tattoo, cherub, guardian angel, wings, heavenly figure, spiritual being ink" },
          { zh: "恶魔", en: "demon tattoo, devil, horns, dark creature, fallen angel, underworld being, dark ink" },
          { zh: "曼陀罗", en: "mandala tattoo, sacred geometry, circular pattern, ornate design, meditative symbol, intricate geometric ink" },
      ] },
      { g: "风格", nsfw: false, items: [
          { zh: "几何线条", en: "geometric tattoo, line art, minimal lines, abstract shapes, clean geometry, modern tattoo" },
          { zh: "点刺", en: "dotwork tattoo, stippling, dot shading, pointillism, detailed dots, textured ink" },
          { zh: "传统old school", en: "traditional tattoo, old school, bold lines, bright colors, classic american tattoo, sailor jerry style" },
          { zh: "日式irezumi", en: "japanese irezumi tattoo, traditional japanese, wabori, ukiyo-e style, clouds and waves, large scale tattoo" },
          { zh: "黑灰写实", en: "black and grey realism tattoo, photorealistic, shading, portrait, detailed, monochrome ink" },
          { zh: "彩色写实", en: "color realism tattoo, photorealistic color, vibrant colors, detailed portrait, lifelike, full color ink" },
          { zh: "水彩水墨", en: "watercolor tattoo, abstract wash, painterly, ink splash, artistic, soft edges, fluid color" },
          { zh: "图腾", en: "tribal tattoo, polynesian, maori, totem, bold black patterns, cultural, geometric tribal ink" },
          { zh: "小清新", en: "minimalist tattoo, tiny tattoo, delicate, fine line, small design, subtle, dainty ink" },
      ] },
      { g: "其他图案", nsfw: false, items: [
          { zh: "骷髅", en: "skull tattoo, sugar skull, day of the dead, bones, death symbol, detailed cranium ink" },
          { zh: "匕首", en: "dagger tattoo, knife, blade, sword, weapon, sharp edge, traditional weapon ink" },
          { zh: "爱心", en: "heart tattoo, love symbol, broken heart, sacred heart, romantic, cute heart ink" },
          { zh: "星星", en: "star tattoo, nautical star, shooting star, sparkle, celestial, night sky symbol ink" },
          { zh: "月亮", en: "moon tattoo, crescent moon, full moon, lunar, celestial, night symbol, moon phases ink" },
          { zh: "眼睛", en: "eye tattoo, all seeing eye, realistic eye, gaze, pupil, detailed iris, symbolic eye ink" },
          { zh: "嘴唇", en: "lips tattoo, mouth, kiss mark, red lips, sensual, lip bite, mouth detail ink" },
          { zh: "皇冠", en: "crown tattoo, royal symbol, king queen crown, tiara, royalty, regal, crown detail ink" },
          { zh: "锚", en: "anchor tattoo, nautical, sailor, stability, hope, maritime symbol, traditional anchor ink" },
          { zh: "羽毛", en: "feather tattoo, bird feather, quill, lightness, freedom, native american, delicate feather ink" },
          { zh: "捕梦网", en: "dreamcatcher tattoo, native american, web, feathers, beads, protection symbol, dream filter ink" },
      ] },
    ],
    /* ========================================================================
     * 【纹身位置】管"纹在什么地方"。人物卡多选，和纹身图案配合使用。
     * 选位置+选图案，输出时组合为 tattoo on 位置 + 图案 tattoo。
     * ======================================================================*/
    tattooPlace: [
      { g: "手臂", nsfw: false, items: [
          { zh: "左臂", en: "tattoo on left arm" },
          { zh: "右臂", en: "tattoo on right arm" },
          { zh: "左大臂", en: "tattoo on left upper arm, left bicep tattoo" },
          { zh: "右大臂", en: "tattoo on right upper arm, right bicep tattoo" },
          { zh: "左小臂", en: "tattoo on left forearm" },
          { zh: "右小臂", en: "tattoo on right forearm" },
          { zh: "左手腕", en: "tattoo on left wrist" },
          { zh: "右手腕", en: "tattoo on right wrist" },
      ] },
      { g: "腿部", nsfw: false, items: [
          { zh: "左腿", en: "tattoo on left leg" },
          { zh: "右腿", en: "tattoo on right leg" },
          { zh: "左大腿", en: "tattoo on left thigh" },
          { zh: "右大腿", en: "tattoo on right thigh" },
          { zh: "左小腿", en: "tattoo on left calf" },
          { zh: "右小腿", en: "tattoo on right calf" },
          { zh: "左脚踝", en: "tattoo on left ankle" },
          { zh: "右脚踝", en: "tattoo on right ankle" },
      ] },
      { g: "上身/胸背", nsfw: false, items: [
          { zh: "胸口", en: "tattoo on chest, chest piece" },
          { zh: "后背", en: "tattoo on back, back piece" },
          { zh: "左肩", en: "tattoo on left shoulder, left shoulder cap" },
          { zh: "右肩", en: "tattoo on right shoulder, right shoulder cap" },
          { zh: "左锁骨", en: "tattoo on left collarbone" },
          { zh: "右锁骨", en: "tattoo on right collarbone" },
          { zh: "肩胛骨", en: "tattoo on shoulder blade, scapula tattoo" },
      ] },
      { g: "躯干/腰侧", nsfw: false, items: [
          { zh: "腹部", en: "tattoo on abdomen, stomach tattoo" },
          { zh: "左侧腰", en: "tattoo on left ribcage, left side tattoo" },
          { zh: "右侧腰", en: "tattoo on right ribcage, right side tattoo" },
          { zh: "后腰", en: "tattoo on lower back, lower back piece" },
          { zh: "腰窝", en: "tattoo on lower back dimples, venus dimples tattoo" },
      ] },
      { g: "腰胯/颈面", nsfw: false, items: [
          { zh: "耻骨", en: "tattoo on pubic area, pubic mound tattoo" },
          { zh: "比基尼线", en: "tattoo on bikini line, hip bone tattoo" },
          { zh: "髋骨", en: "tattoo on hip bone, hip tattoo" },
          { zh: "骶骨", en: "tattoo on sacrum, lower spine tattoo" },
          { zh: "后颈", en: "tattoo on back of neck, nape tattoo" },
          { zh: "前颈", en: "tattoo on front of neck, throat tattoo" },
          { zh: "耳后", en: "tattoo behind ear, behind ear tattoo" },
      ] },
    ],

    /* ========================================================================
     * 【冲突检测·数据】豆包负责逻辑，这里只给“哪些词对彼此冲突”的数据。
     * 结构：conflictPairs = [ [词A, 词B], ... ] —— A 和 B 是“互相冲突、别同时选”的一对。
     * 逻辑（豆包做）：用户已选了词A、又去点词B（或反向），若 [A,B] 在表里，就弹“这俩冲突，去掉一个”。
     * 词名用“中文按钮名”（zh），跟界面选项对上。
     * ======================================================================*/
    conflictPairs: [
      // —— 姿势对立（坐莲=面对面，后入=从背后）——
      ["坐莲", "后入"], ["坐莲", "后入·抓腰顶"], ["坐莲", "后入·趴着撅臀"], ["坐莲", "站立后入"], ["坐莲", "桌上后入"], ["坐莲", "夹击"],
      ["传教士·腿搭肩", "后入"], ["女上位·起伏", "后入"],
      // —— 裸露 vs 穿衣（完全裸/展示裸 时，穿正经衣服冲突）——
      ["L5 完全裸露", "白衬衫"], ["L5 完全裸露", "黑西装"], ["L5 完全裸露", "居家毛衣"], ["L5 完全裸露", "连衣裙"], ["L5 完全裸露", "校服"], ["L5 完全裸露", "旗袍"],
      ["L6 展示·裸露", "白衬衫"], ["L6 展示·裸露", "黑西装"], ["L6 展示·裸露", "连衣裙"], ["L6 展示·裸露", "校服"],
      ["半裸（上）", "旗袍"], ["半裸（上）", "女仆装"], ["半裸（上）", "泳装"],
      // —— 内裤 vs 露阴 ——
      ["内裤拨开", "全裸"], ["内裤拨开", "半裸（下）"],

      // —— v2.0 扩：服装×裸露（8条） ——
      ["全裸", "护士服"], ["全裸", "女仆装"], ["全裸", "空姐制服"], ["全裸", "女警制服"],
      ["全裸", "巫女服"], ["全裸", "兔女郎装"], ["全裸", "偶像装"], ["全裸", "泳装"],
      // —— v2.0 扩：液体×状态（4条） ——
      ["颜射", "闭眼"], ["射嘴里·吞", "闭眼"], ["内射", "闭眼"], ["潮吹", "闭眼"],
      // —— v2.0 扩：场景矛盾（6条） ——
      ["和室", "办公室"], ["神社", "办公室"], ["厨房", "卧室·床上"], ["教室", "卧室·床上"], ["海边", "办公室"], ["健身房", "卧室·床上"],
    ],

    /* ========================================================================
     * 【同层互斥族·数据】R2 牛总 9 族（2026-09-11）
     * 逻辑在 postprocess_pipeline_v2.js step 5.5 执行。
     * 用户显式按钮不参与，只管自动通道（LLM/概念扩展/行为扩展）。
     * ======================================================================*/
    exclusiveGroups: [
      { id: "bust_size", name: "胸围族", scope: "all", rule: "take_one",
        members: ["flat_chest","small_breasts","medium_breasts","large_breasts","huge_breasts","gigantic_breasts"] },
      { id: "framing", name: "景别族", scope: "all", rule: "take_one",
        members: ["full_body","full body","upper_body","upper body","cowboy_shot","cowboy shot","close-up","closeup","close up","extreme_closeup","extreme close-up","extreme close up","medium shot","wide_shot","wide shot","headshot"] },
      { id: "style_2d_3d", name: "风格两系族", scope: "all", rule: "cross_system",
        sysA: { name: "动漫/插画系", members: ["anime_style","cel_shading","2.5d","semi-realistic","painterly","flat_color","manga_style","sketch"] },
        sysB: { name: "写实/3D系", members: ["photorealistic","realistic","3d_render","octane_render","unreal_engine_5","cgi","realistic_skin_texture","raw_photo"] },
        // V2.6第三刀 A3（C1）：手点风格 chip 的中文按钮名归属，供 html choose 手点互斥 + 通道4 专用块使用。
        // zhSysA=2D手绘/动漫/插画系；zhSysB=3D渲染/真人实拍写实系；zhSysX=明确横跨两系（整按钮豁免，防"按钮吃自己"）。
        // 不在这三表的风格按钮（题材氛围/正交叠加，见改码单附录 N12）不参与两系互斥。名单按 styles 按钮 zh 逐字；"电影剧照"两个按钮都在 zhSysB，照实出现两次。
        zhSysA: ["日系动漫","韩漫","黑白漫画","Q版可爱","像素风","少女漫画","轻小说封面","游戏CG","新海诚电影感","吉卜力童话风","2.5D半写实","赛璐璐平涂","厚涂插画","萌系软萌","治愈系","少年热血漫","乙女游戏","角色立绘","卡牌插画","动画截图","京阿尼风","90年代复古动画","80年代复古动画","线稿风","扁平插画","水彩动漫","暗黑系动漫","美式卡通","贴纸风","厚涂油画","水彩手绘","童话绘本","概念设计","水墨写意","敦煌壁画","浮世绘","最终幻想风","老动画风"],
        zhSysB: ["三渲二","真人照片感","电影剧照","黑白胶片","胶片摄影","复古胶片","宝丽来","纪实摄影","街头摄影","时尚杂志","商业棚拍","黑色电影","皮克斯3D","仿真3D写实","低多边形","迪士尼动画","电影剧照","时尚大片","复古抓拍","街拍","夜景摄影","黄金时刻人像","影棚人像","Kodak Portra 400","Kodak Gold 200","Kodak Ektar 100","Fujifilm Superia 400","Cinestill 800T","Fujifilm Velvia 50","Fujifilm Pro 400H","Fujifilm Classic Chrome","Fujifilm Classic Negative","Kodak Tri-X 400","拍立得","失效胶片","一次性相机","VHS录像带","交叉冲洗","ARRI电影机","韦斯安德森"],
        zhSysX: ["半写实清透"] },
      { id: "body_build", name: "体型族", scope: "all", rule: "cross_system",
        sysA: { name: "纤细系", members: ["petite","slim","slender","thin","narrow_waist"] },
        sysB: { name: "丰满/健壮系", members: ["curvy","voluptuous","muscular","athletic","thick_thighs","plump"] } },
      { id: "pose_base", name: "基础体态族(条件)", scope: "all", rule: "take_one_single",
        conditional: "single_only",
        multiPersonIndicators: ["2girls","2boys","3girls","3boys","4girls","4boys","2others","3others","4others","5others","6+others","multiple_others"],
        members: ["sitting","seiza","reclining","lounging","lying","kneeling","squatting","crouching","standing","standing straight"],
        priority: ["sitting","seiza","reclining","lounging","lying","kneeling","squatting","crouching","standing","standing straight"],
        note: "归位轮2b：单人取一(同一人物只一个体态,同卡站/坐删一)；多人(命中2girls/3girls/1girl_1boy等指标词)允许各角色体态共存,conditional=single_only。配合 html runMapperChannelFilter 的 bucket 双名对修复,人物卡姿势词才真正纳入本族。成员只收纯体态词(无场景/朝向介词、非体位)：补 standing straight(站直)、squatting/crouching(蹲)、seiza(正坐)、reclining/lounging(斜躺)；带 on bed/in rain 等场景复合体态(如 sitting on bed)与体位词(standing from behind 等)不收,其跨类混搭归轮3词干归类" },
      { id: "time_of_day", name: "时间族(SFW)", scope: "all", rule: "take_one",
        members: ["night","sunset","twilight","evening","day","morning","noon"] },
      { id: "nude_x_clothes", name: "裸体×服装族", scope: "all", rule: "conditional",
        sysA: { name: "裸体系", members: ["nude","naked","completely_nude","fully_exposed","no_clothes"] },
        sysB: { name: "服装具体系", members: ["white_shirt","dress","skirt","shirt","pants","jacket","sweater","pajamas","nightgown"] },
        note: "命中sysA任一词时sysB进warning;饰品配饰不受限" },
      { id: "looking_dual", name: "双视角族(条件)", scope: "conditional", rule: "take_one_single",
        conditional: "single_only",
        multiPersonIndicators: ["2girls","2boys","3girls","3boys","4girls","4boys","2others","3others","4others","5others","6+others","multiple_others"],
        members: ["looking_at_viewer","looking at viewer","looking_at_another","looking at another","looking_at_each_other","looking at each other"],
        priority: ["looking_at_viewer","looking at viewer","looking_at_another","looking at another","looking_at_each_other","looking at each other"],
        note: "单人取一(优先viewer>another>each_other);双人场景(1boy/1girl_1boy等命中时)允许共存,conditional=single_only" },
      { id: "sex_position_macro", name: "体位宏观族(NSFW)", scope: "nsfw", rule: "sub_class",
        subClasses: [
          { id: "position", members: ["missionary","doggystyle","cowgirl_position","girl_on_top","boy_on_top","reverse_cowgirl","reverse_cowgirl_position","standing_sex","lotus_position","sex_from_behind"] },
          { id: "oral", members: ["fellatio","cunnilingus","oral","paizuri","footjob","handjob"] }
        ],
        note: "位类取一+口类取一,跨子类可共存" },
      { id: "vag_anal", name: "阴道×肛门互斥族", scope: "all", rule: "cross_system",
        sysA: { name: "阴道系", members: ["vaginal","vagina","vaginal_penetration"] },
        sysB: { name: "肛门系", members: ["anal","anal_penetration","anilingus","rimming"] },
        note: "同一人物同一动作只走一个通道;用户明确肛交→阴道系进filtered;用户明确阴道交→肛门系进filtered;修NSFW-05误触发" },
      { id: "angle", name: "机位角度族", scope: "all", rule: "take_one",
        members: ["low_angle","low angle","from below","from_below","high_angle","high angle","from above","from_above","eye_level","eye level","front_angle","front angle","from front","from_front","from side","from_side","side view","side_view","from behind","over-the-shoulder","dynamic angle","dutch angle","three-quarter view"] },
      { id: "abstract_composition", name: "抽象构图黑名单", scope: "all", rule: "blacklist",
        members: ["centered_composition","centered composition","symmetric","symmetrical","symmetry","rule_of_thirds","rule of thirds","balanced composition","balanced_composition","leading lines","frame within frame","diagonal composition","negative space","golden ratio"] },
      { id: "light_dim1", name: "光影·光源时间族", scope: "all", rule: "take_one",
        members: ["sunlight","morning light","morning_light","sunset lighting","sunset_lighting","evening light","evening_light","golden hour","golden_hour","magic hour","magic_hour","blue hour","blue_hour","moonlight","moon light","moon_light","candlelight","candle light","candle_light","warm candlelight","firelight","neon lighting","neon_lighting","neon light","neon_light","neon lights","neon_lights","natural lighting","natural_lighting","natural light","natural_light","natural daylight","bright sunlight","window light","window_light","overcast lighting","overcast_lighting","cloudy diffusion","overcast","tungsten lighting","tungsten_lighting","tungsten light","warm bulb glow","fluorescent lighting","cold fluorescent","clinical white","spotlight","stage lighting","stage_lighting","ring light","ring_light","streetlight","street light","available light","available_light"] },
      { id: "light_dim2", name: "光影·光质族", scope: "all", rule: "take_one",
        members: ["soft lighting","soft_lighting","soft light","soft_light","softbox lighting","softbox_lighting","soft box","beauty dish","diffused light","diffused_light","diffuse lighting","harsh lighting","harsh_lighting","hard lighting","hard_lighting","hard light","hard_light","sharp shadow","high contrast light"] },
      { id: "light_dim3", name: "光影·色温族", scope: "all", rule: "take_one",
        members: ["warm lighting","warm_lighting","warm light","warm_light","amber glow","warm colors","warm_colors","cool lighting","cool_lighting","cool light","cool_light","cold lighting","cold light","cool colors","cool_colors","silver-blue ambient","cool night","neutral lighting","neutral_lighting"] },
      { id: "light_dim4", name: "光影·方向族", scope: "all", rule: "take_one_cap2",
        members: ["rim lighting","rim_lighting","rim light","rim_light","edge lighting","edge_lighting","edge light","backlighting","back lighting","backlit","back light","hair light","hair_light","side backlight","side_backlight","side lighting","side_lighting","side light","top lighting","top_lighting","top light","underlighting","under light","uplighting","front lighting","front_lighting","key light","key_lighting","fill light","fill_lighting"] },
      { id: "light_dim5", name: "光影·布光法效果族", scope: "all", rule: "take_one",
        members: ["rembrandt lighting","rembrandt_lighting","chiaroscuro","butterfly lighting","butterfly_lighting","paramount lighting","split lighting","split_lighting","loop lighting","loop_lighting","volumetric lighting","volumetric_lighting","light shafts","god rays","god_rays","crepuscular rays","crepuscular_rays","global illumination","global_illumination","silhouette","lens flare","lens_flare","bokeh","bloom","glow","dappled sunlight","dappled light","caustics","subsurface scattering"] },
      { id: "light_dim6", name: "光影·风格氛围族", scope: "all", rule: "take_one",
        members: ["cinematic lighting","cinematic_lighting","dramatic lighting","dramatic_lighting","ambient lighting","ambient_lighting","film noir lighting","film_noir_lighting","low key noir","low-key lighting","high-key lighting","high key lighting","moody lighting","moody_lighting","atmospheric lighting","atmospheric_lighting","ethereal lighting","teal and orange","cinematic color grading"] },
      { id: "scene_same_bedroom", name: "卧室场景同系族", scope: "all", rule: "take_one",
        members: ["bedroom","bed","big bed","big_bed","large bed"],
        note: "归位轮2a拆层：本族只留场景本体(卧室/床/大床)取一防堆砌；位置词 on bed/on_bed/on the bed 移出本族、不再与 bedroom 互斥，'卧室+床上'两语义可共存(三写法经 normKey+全局去重只留一个、不堆砌)；'大床'大字为口语冗余,与 bed/bedroom 本体取一" },
      { id: "scene_same_kitchen", name: "厨房场景同系族", scope: "all", rule: "take_one",
        members: ["kitchen","in kitchen","kitchen counter","kitchen table"] },
      { id: "scene_same_beach", name: "海滩场景同系族", scope: "all", rule: "take_one",
        members: ["beach","beach sand","shore"] },
      { id: "scene_position", name: "位置族(条件)", scope: "all", rule: "take_one_single",
        conditional: "single_only",
        multiPersonIndicators: ["2girls","2boys","3girls","3boys","4girls","4boys","2others","3others","4others","5others","6+others","multiple_others"],
        members: ["on bed","window","doorway","bench","park bench","windowsill","balcony","on beach"],
        priority: ["window","doorway","on bed","bench","park bench","windowsill","balcony","on beach"],
        note: "归位轮2c：位置词收拢为独立位置族(条件)。同一人物只在一个位置,单人取一(priority=保先/保最具体:window>doorway>on bed>bench>…),多送剥掉；多人(命中multiPersonIndicators)各角色位置允许共存。成员只收纯位置词且用单形(on bed 即可覆盖 on_bed——normKey 归一),复合体态(sitting on bed/standing in doorway)不收归 pose_base。'场景+位置正常包含'(bedroom·on bed、beach·on beach)由场景族与位置族分治实现" },
      { id: "view", name: "视角族", scope: "all", rule: "take_one",
        members: ["POV","looking down at her","viewer perspective","looking away","looking up","looking down","looking to the side","staring","eye contact"],
        note: "B1-1（Turbo spec 20261003）：视角语义互斥（不能同时直视镜头+看向别处+第一人称），取一。members 以词库 view 桶 9 条 en 原形为准（匹配走 normKey）；'looking at viewer' 不入本族——留给 looking_dual 族（take_one_single：单人取一、双人共存），并入本族会把双人'她看观众+他看她'过度压成一个。族只兜底 AI 回填/LLM 直出；手选经 B1-0 镜头四桶 UI 单选已在源头唯一。" },
      { id: "focal", name: "焦段族", scope: "all", rule: "take_one",
        members: ["24mm","35mm","50mm","85mm","135mm"],
        note: "B1-2（Turbo spec 20261003）：多焦段并存无意义（模型困惑），取一。AI 回填 uni 区已加 uni('focal',…,{max:1})；手选经 B1-0 UI 单选。" },
    ],

    /* ========================================================================
     * 【预设·数据】豆包负责“一键选取”的按钮逻辑；这里给“每个预设要选中哪些层”。
     * 结构：presets = [ { zh:"预设名", mode:'pony/sdxl', nsfw:true/false, select:{ 层: [词名,...], ... } } ]
     * 豆包逻辑：点预设 → 把 select 里各层的词一次性选中（复用 choose），刷新。
     * ======================================================================*/
    presets: [
      // —— 床上（7个）——
      { zh: "卧室·后入", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["后入"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], nsfwShot: ["双人·看生殖器"], lighting: ["暖光"] } },
      { zh: "床上·传教士", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["传教士"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], exposure: ["L5 完全裸露"], expression: ["魅惑"], lighting: ["暖光"] } },
      { zh: "床上·女上位", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["女上位"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], nsfwShot: ["直视镜头"], expression: ["高潮脸"], lighting: ["电影感"] } },
      { zh: "床上·侧入", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["侧入"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], exposure: ["L5 完全裸露"], lighting: ["柔光"] } },
      { zh: "床上·自慰按摩", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["单人女"], action: ["自慰·指插"], props: ["振动棒"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], exposure: ["L5 完全裸露"], expression: ["高潮脸"], lighting: ["柔光"] } },
      { zh: "床上·口交晨起", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["口交"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], nsfwShot: ["直视镜头"], expression: ["害羞"], lighting: ["窗光"] } },
      { zh: "床上·玩肛塞", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["后入"], props: ["肛塞"], clothing: ["全裸"], sceneNsfw: ["卧室·大床"], exposure: ["L5 完全裸露"], lighting: ["暖光"] } },
      // —— 其他（3个）——
      { zh: "月光·跪姿仪式", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["单人女"], exposure: ["L5 完全裸露"], action: ["跪地"], clothState: ["解开扣子"], sceneNsfw: ["情人酒店"], nsfwShot: ["直视镜头"], lighting: ["电影感"] } },
      { zh: "浴室·湿身诱惑", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["单人女"], sceneNsfw: ["浴室·湿身"], action: ["自慰·指插"], clothing: ["半裸（上）"], exposure: ["L3 半裸·诱惑"], expression: ["魅惑"], lighting: ["柔光"] } },
      { zh: "野外·月光野战", mode: 'pony', nsfw: true, select: { character: ["浅浅动画"], count: ["一女一男"], action: ["后入"], clothing: ["全裸"], sceneNsfw: ["公园·夜晚"], exposure: ["L6 展示·裸露"], lighting: ["月光"] } },

      // —— v2.0 扩：光影组合 6 组 ——
      { zh: "光影·油画古典", mode: 'pony', nsfw: false, select: { lighting: ["伦勃朗光", "戏剧光", "烛光", "硬光"], style: ["厚涂插画"] } },
      { zh: "光影·日系清新", mode: 'pony', nsfw: false, select: { lighting: ["柔光", "自然光", "晨光", "柔光箱"], style: ["日系动漫"] } },
      { zh: "光影·逆光发丝", mode: 'pony', nsfw: false, select: { lighting: ["逆光", "边缘光", "发丝光", "黄金时刻"], extra: ["飘动秀发"] } },
      { zh: "光影·电影暗调", mode: 'pony', nsfw: false, select: { lighting: ["电影感", "体积光", "戏剧光", "底光"], style: ["电影剧照"] } },
      { zh: "光影·影棚商业", mode: 'pony', nsfw: false, select: { lighting: ["柔光箱", "环形灯", "边缘光", "自然光"], style: ["时尚大片"] } },
      { zh: "光影·雨天湿润", mode: 'pony', nsfw: false, select: { lighting: ["阴天柔", "冷光", "边缘光", "环境光"], clothState: ["打湿贴身"], scene: ["雨夜街头"] } },
      // —— v2.0 扩：性格人设包 6 个 ——
      { zh: "人设·害羞清纯", mode: 'pony', nsfw: false, select: { personas: ["甜美"], expressions: ["害羞", "闭眼"], interactions: ["依偎"], lighting: ["柔光", "暖光"] } },
      { zh: "人设·魅惑", mode: 'pony', nsfw: false, select: { personas: ["辣妹"], expressions: ["魅惑", "微张唇"], interactions: ["看着"], lighting: ["戏剧光", "霓虹光"] } },
      { zh: "人设·顺从", mode: 'pony', nsfw: true, select: { personas: ["顺从"], expressions: ["害羞", "含泪"], interactions: ["摸头"], lighting: ["柔光", "烛光"] } },
      { zh: "人设·放荡", mode: 'pony', nsfw: true, select: { personas: ["淫荡"], expressions: ["魅惑", "微张唇"], interactions: ["亲吻"], lighting: ["霓虹光", "戏剧光"] } },
      { zh: "人设·反差", mode: 'pony', nsfw: false, select: { personas: ["傲娇"], expressions: ["害羞", "脸红看着"], interactions: ["挽手"], lighting: ["暖光", "黄金时刻"] } },
      { zh: "人设·自信支配", mode: 'pony', nsfw: false, select: { personas: ["女王", "高冷"], expressions: ["魅惑", "看着"], interactions: ["摸头"], lighting: ["戏剧光", "硬光"] } },

      // —— v2.0 扩：职业人设包 20 个 ——
      { zh: "人设·OL白领", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["冷白荧光"], personas: ["高冷"] } },
      { zh: "人设·教师", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["自然光"], personas: ["温柔"] } },
      { zh: "人设·护士", mode: 'pony', nsfw: false, select: { clothing: ["护士服"], lighting: ["柔光"], personas: ["温柔"] } },
      { zh: "人设·女仆", mode: 'pony', nsfw: false, select: { clothing: ["女仆装"], lighting: ["暖光"], personas: ["甜美"] } },
      { zh: "人设·空姐", mode: 'pony', nsfw: false, select: { clothing: ["空姐制服"], lighting: ["柔光"], personas: ["甜美"] } },
      { zh: "人设·偶像", mode: 'pony', nsfw: false, select: { clothing: ["偶像装"], lighting: ["霓虹光"], personas: ["甜美"] } },
      { zh: "人设·医生", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["冷光"], personas: ["高冷"] } },
      { zh: "人设·女警", mode: 'pony', nsfw: false, select: { clothing: ["女警制服"], lighting: ["硬光"], personas: ["高冷"] } },
      { zh: "人设·巫女", mode: 'pony', nsfw: false, select: { clothing: ["巫女服"], lighting: ["晨光"], personas: ["温柔"] } },
      { zh: "人设·赛车皇后", mode: 'pony', nsfw: false, select: { clothing: ["兔女郎装"], lighting: ["硬光"], expression: ["魅惑"] } },
      { zh: "人设·写真偶像", mode: 'pony', nsfw: false, select: { clothing: ["泳装"], lighting: ["黄金时刻"], expression: ["魅惑"] } },
      { zh: "人设·女大学生", mode: 'pony', nsfw: false, select: { clothing: ["休闲连衣裙"], lighting: ["自然光"], personas: ["甜美"] } },
      { zh: "人设·便利店店员", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["冷白荧光"], personas: ["温柔"] } },
      { zh: "人设·酒店前台", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["暖光"], personas: ["甜美"] } },
      { zh: "人设·秘书", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["柔光"], personas: ["温柔"] } },
      { zh: "人设·女老板", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["戏剧光"], personas: ["高冷"] } },
      { zh: "人设·家庭教师", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["暖光"], personas: ["温柔"] } },
      { zh: "人设·新员工", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["柔光"], expression: ["害羞"] } },
      { zh: "人设·客舱乘务员", mode: 'pony', nsfw: false, select: { clothing: ["空姐制服"], lighting: ["柔光"], personas: ["甜美"] } },
      { zh: "人设·电梯小姐", mode: 'pony', nsfw: false, select: { clothing: ["教师装"], lighting: ["暖光"], personas: ["甜美"] } },
    ],

  /* ========================================================================
   * 【构图】管“画面构图/焦点”。通用层（正经/露骨都可用），多选。
   * 每项=一个构图方式（中文名+英文）。
   * ======================================================================*/
  composition: [
    { g: "构图", nsfw: false, items: [
        { zh: "居中构图", en: "centered composition, symmetric" },
        { zh: "三分法则", en: "rule of thirds, off-center composition" },
        { zh: "引导线", en: "leading lines, guiding composition" },
        { zh: "框架构图", en: "frame within frame, natural frame" },
        { zh: "对角线", en: "diagonal composition, dynamic" },
        { zh: "负空间构图", en: "negative space, minimalist composition" },
        { zh: "对称构图", en: "symmetrical, mirror composition" },
        { zh: "黄金分割", en: "golden ratio, golden spiral, phi" },
        { zh: "景深效果", en: "depth of field, bokeh, shallow dof" },
        { zh: "剪影构图", en: "silhouette, backlit, rim silhouette" },
    ] },
    { g: "构图·露骨", nsfw: true, items: [
        { zh: "焦点特写私处与足部", en: "focus on genitalia and feet, close-up, crotch and foot detail" },
    ] },
  ],

};
/* ========================================================================
 * 【出口修正数据】V3.0 五组单项（Turbo 派单 20261001）：出词出口 exitWordFix 消费。
 *   ★独立全局挂载，不放 CIKU 顶层——buildKeywordMapFromCiku 遍历 CIKU 全部顶层键并按桶数组消费，
 *   对象型顶层键会让它炸（20261001 实测回归，改挂载位修讫）；可维护、可追加；
 *   逻辑在 html exitWordFix（词形判据全部走 normKey 整词比对，禁子串）。
 * ======================================================================*/
global.CIKU_WORD_FIX = {
  // ① 校园无依据注入护栏：中文原句无校园词时剥显式校园整词；NSFW 加剥百褶裙（SFW 保留）。
  //    用户手选（idMap 命中）豁免；原句含 needles 任一 → 护栏整体不触发。
  schoolGuard: {
    zhNeedles: ["学校", "校园", "学院", "学生", "教室", "课堂", "校服", "学园"],
    stripAlways: ["school_uniform", "classroom", "chalkboard", "student", "campus", "school"],
    stripPrefix: ["classroom_", "school_"],                                                      // ★ 补-2 复合校园词前缀判（classroom_desk/school_lunch 等 LLM 自造词，点名枚举追不上）
    stripPrefixExempt: ["school_bag", "school_briefcase", "school_of_fish", "school_connection"], // ★ 白名单（中性道具/同形异义鱼群/关系词——danbooru 24 词逐一过筛，阿紫补 spec L278）
    stripNsfw: ["pleated_skirt"]
  },
  // ③ 易字面化替换清单（命中即替换；from/to 均 normKey 形；toNsfw 缺省用 to）：
  easyLiteral: [
    { from: "hourglass_figure", to: "curvy", toNsfw: "voluptuous, mature_female_body" },
    { from: "camera_view", to: "point_of_view" },
    { from: "camera_angle", to: "point_of_view" },
    { from: "making_hand_signs_with", to: "making_hand_signs" }
  ],
  // ③ camera 条件：孤立 camera 剥除——但同串含道具语境词（拍照/持机）或 look at camera 类保留
  cameraStrip: {
    bare: "camera",
    keepIfPresent: ["taking_picture", "taking_photo", "photographer", "holding_camera"],
    keepAlways: ["looking_at_camera", "looking_at_viewer", "eye_contact_with_camera"]
  },
  // ④ NSFW 默认贴脸视角：close-up→medium shot（首个）、low angle→eye level（首个）、重复剥除。
  //    手选豁免：构图规模按钮 closeup / angle 桶手选仰视 / 手选词命中 → 不动。
  nsfwFraming: { fromCloseup: "close-up", toCloseup: "medium shot", fromLowAngle: "low_angle", toLowAngle: "eye level" }
};

/* ========================================================================
 * 【平衡档自动体液剥除数据】V3.0 第五小支（Turbo 终稿 spec 20261001）：exitWordFix balanced 体液分支消费。
 *   ★独立全局（勿进 CIKU 顶层——buildKeywordMapFromCiku 契约）；normKey 整词精等（===，禁 includes/边界包含）。
 *   仅 tier='balanced'（缺省从严）生效；creative 不动；手选(_src!=='ai')/口述明说(_userFluid)豁免。
 * ======================================================================*/
global.CIKU_FLUID_STRIP = {
  // A. danbooru 正牌＋B. 别名/无效词（bukkake 裁定：多人群交颜射场景 balanced 自动路径连场景一并剥）
  strip: ["cum", "cumdrip", "cum_drip", "pussy_juice", "cum_in_pussy", "wet", "female_ejaculation",
    "ejaculation", "bukkake", "precum", "cum_on_body", "cum_string", "cum_pool", "internal_cumshot",
    "excessive_cum", "semen", "sperm", "cumshot", "squirting"],
  // 三 不剥（明确排除）：歧义词 cream/juice/facial；非性体液 saliva/drooling/sweat；表情/场景态 orgasm/ahegao/after_sex/impregnation（挂账）——不列进 strip 即不剥
  // 四-2 口述明说门控
  fluidClear: ["射精", "精液", "内射", "颜射", "潮吹", "潮喷", "吹潮", "爱液", "灌精", "口爆", "下面湿", "射在里面"],
  vague: ["湿了", "流水", "水多", "喷了", "喷出来", "射出来", "留在里面", "弄在里面", "黏糊糊", "拉丝", "吞下去", "咽下去", "湿透"],
  sexCtx: ["做爱", "性交", "交合", "抽插", "阴茎", "阴道", "下体", "私处"]
};
})(typeof window !== "undefined" ? window : globalThis);
