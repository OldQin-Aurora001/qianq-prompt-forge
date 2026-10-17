/* postprocess_pipeline_v2.js —— 任务4：后处理管道 第5-10步
 * 输入 = 任务3 的输出 {valid,warning,error,filtered,stats}；输出 = 校验面板数据
 * 独立纯函数（node/浏览器双导出），不依赖 HTML / Ollama API，用 mock 数据测。
 *
 * 第5步 冲突检测   用 conflict_pairs_en.json（词库.js 18条中文对→英文，build_conflict_pairs_en.js 生成）
 * 第6步 语义去重   设计文档 7.10 的 15 组同义词，保留热度最高，其余记 merged
 * 第7步 概念扩展   牛来 concept_expansion.json，先启用 5 概念，命中触发词补 tags（标蓝 concept_expansion）
 * 第8步 热度排序   valid 按 post_count 降序
 * 第9步 回填补全   简单版：valid<20 且缺核心特征(hair/eyes/clothing/...)补默认高频（标灰 backfill）
 * 第10步 面板数据   {valid,warning,error,filtered,conceptAdded,backfilled,stats}
 *
 * 输出字段与豆包给的面板格式严格对齐（别改）。
 */
(function (global) {
  "use strict";

  function normKey(s) { return String(s == null ? "" : s).toLowerCase().replace(/[\s_-]+/g, "_"); }

  // 归位轮3第一刀（补刀1+2）：统一"真实人数≥2"判定，替换 take_one_single 旧的"指标词任一命中"。
  // 多人 = ⓪权威人数 personCount≥2(人物卡数,T.personCount,不依赖 present 有无数量词)；或 ①显式多人数量词
  //   (girls/boys/others 各档 + multiple_*)；或 ②不同种类"单人数量词"≥2(1girl/1boy/1man/1other)；
  //   或 ③faceless_male 与 1girl/1other 同场(无脸男=额外男性;与 1boy/1man 同场可能同一人,保守不判)；
  //   或 ④同串兜底(未拆逗号 "1girl, 1boy/1other")。裸 1boy/1man/1other/faceless_male 单词=单人。
  function __multiPerson(keys, extra, personCount){
    if((personCount||1)>=2) return true;
    var set={}; (keys||[]).forEach(function(k){ set[k]=1; });
    function has(t){ return !!set[normKey(t)]; }
    var MULTI=["2girls","2boys","3girls","3boys","4girls","4boys","5girls","5boys","6+girls","6+boys","2others","3others","4others","5others","6+others","multiple_girls","multiple_boys","multiple_others"];
    var i;
    for(i=0;i<MULTI.length;i++){ if(has(MULTI[i])) return true; }
    if(extra){ for(i=0;i<extra.length;i++){ var e=String(extra[i]);
      if(/^(1boy|1man)$/.test(e)) continue; /* 裸男性单词=单人，忽略旧指标 */
      if(has(e)) return true; } }
    var SINGLES=["1girl","1boy","1man","1other"]; var nSingle=0;
    for(i=0;i<SINGLES.length;i++){ if(has(SINGLES[i])) nSingle++; }
    if(nSingle>=2) return true;
    if(has("faceless_male")&&(has("1girl")||has("1other"))) return true;
    for(i=0;i<(keys?keys.length:0);i++){ var k=String(keys[i]);
      var hasG=/(?:^|[_,])1girl(?:[_,]|$)/.test(k);
      var hasM=/(?:^|[_,])1boys?(?:[_,]|$)/.test(k)||/(?:^|[_,])1mans?(?:[_,]|$)/.test(k)||/(?:^|[_,])1other(?:[_,]|$)/.test(k);
      if(hasG&&hasM) return true; }
    return false;
  }

  /* 第6步 语义去重 15 组（设计文档 7.10） */
  var SYNONYM_GROUPS = [
    ["fellatio", "blowjob", "oral_sex", "giving_head"],
    ["saliva", "drooling", "slobbering", "spit"],
    ["hugging", "embrace", "holding", "cuddling"],
    ["kissing", "kiss", "smooch", "making_out"],
    ["lying", "laying", "reclining", "on_back"],
    ["sitting", "seated", "on_chair"],
    ["standing", "upright", "on_feet"],
    ["nude", "naked", "nude_female", "nude_male"],
    ["breasts", "boobs", "tits", "bust"],
    ["penis", "dick", "cock", "male_genitalia"],
    ["vagina", "pussy", "cunt", "female_genitalia"],
    ["sweat", "sweating", "sweaty", "perspiration"],
    ["tears", "crying", "teary", "weeping"],
    ["smile", "smiling", "grin", "grinning"],
    ["blush", "blushing", "embarrassed", "flushed"]
  ].map(function (g) { return g.map(normKey); });

  /* 第7步 先启用 5 个概念（concept_expansion.json 里其余的加进此数组即启用，留接口） */
  var ENABLED_CONCEPTS = ["emo", "maid", "school_uniform", "kitchen", "rainy_night"];

  /* 第9步 回填默认（简单版：缺某特征就补该特征一个高频 Danbooru 标签） */
  var BACKFILL_DEFAULTS = [
    ["hair", "long_hair"], ["eyes", "blue_eyes"], ["clothing", "dress"],
    ["expression", "smile"], ["lighting", "soft_lighting"], ["background", "simple_background"]
  ];
  var BACKFILL_THRESHOLD = 20;

  function copyObj(o) { var n = {}; for (var k in o) if (o.hasOwnProperty(k)) n[k] = o[k]; return n; }

  /* ---------- 红线闸（P3下沉，牛总建议/豆总任务2）：v2入口再守一道 ----------
   * 双重保险结构：gate自带红线闸（第四道闸）+ 任务3管道第3步P3闸 + 本v2入口闸。
   * 优先用 T.relevanceGate.isRedLine（分级匹配全集）；gate缺失时用本地最小兜底集（独立可用）。
   * 词表单一事实源 = relevance_gate.js 的 RED_LINE_* 三层，gate词表变动时同步三处兜底集。 */
  var P3_RED_LINE_EXACT_FALLBACK = [
    "loli", "shota", "child", "toddler", "baby", "infant", "underage", "kid", "teen", "teenager",
    "little_girl", "little_boy", "young_girl", "young_boy",
    "elementary_school_student", "middle_school_student", "child_abuse", "child_carry",
    "rape", "forced", "forcing", "nonconsensual", "non_consensual", "assault", "sexual_assault",
    "incest", "mother_son", "father_daughter", "brother_sister", "sibling_incest",
    "guro", "vore", "necrophilia", "scat", "watersports", "golden_shower", "urination", "bestiality", "zoophilia",
    "suicide", "self_harm", "self_injury", "cutting",
    "drug", "drugs", "drug_use", "drug_abuse",
    "gore", "extreme_violence", "mutilation", "torture",
    "child_porn", "baby_porn", "kid_porn", "teen_porn", "loli_porn", "shota_porn",
    "oppai_loli", "onee-shota", "onii-shota", "onee_loli", "shotacon", "lolicon"
  ];
  var P3_RED_LINE_PAT_FALLBACK = /\b(rape|incest|guro|bestiality|necrophilia|scat|watersports|urination|vore|extreme_violence|mutilation|torture|drug|drugs|forced|forcing|nonconsensual|non_consensual)\b/;
  function p3IsRedLine(normTag, relevanceGate, mode) {
    // 老秦拍板 2026-09-12：NSFW-only 红线词（student）只在 NSFW 模式拦，正经模式放行。
    // isRedLine 有 mode 感知（RED_LINE_NSFw_ONLY 表）；fallback 表 mode-blind，需按 mode 过滤。
    if (relevanceGate && typeof relevanceGate.isRedLine === "function") {
      return relevanceGate.isRedLine(normTag, mode);
    }
    // fallback（无 relevanceGate）：NSFW-only 词（student）在 safe 模式放行，与 RED_LINE_NSFw_ONLY 对齐
    var nsfwOnlyRedLine = { student: 1 };
    if (mode === "safe" && nsfwOnlyRedLine[normTag]) return false;
    if (P3_RED_LINE_EXACT_FALLBACK.indexOf(normTag) >= 0) return true;
    if (P3_RED_LINE_PAT_FALLBACK.test(normTag)) return true;
    return false;
  }

  function postprocessV2(task3, T, mode) {
    T = T || {};
    var conceptExp = T.conceptExp || {};
    var conflictPairs = (T.conflictPairs || []).map(function (p) { return [normKey(p[0]), normKey(p[1])]; });
    var danbooru = T.danbooru || {};
    var safe = (mode !== "nsfw");

    /* ============ 三档参数注入（V2.2 第二轮·大阿总 2026-09-12）============
     * 档位：'fine'(精) / 'balanced'(平衡,默认) / 'creative'(创意)
     * 档位与模式正交：safe/nsfw × 3 档 = 6 组合，参数表一次命中
     * 多人线（personCount≥3）盖在档位之上：行为上限与词量比切多人线，占比线/闸门不放宽
     * 光影 cap6 三档写死 6（豆总拍板①，不随档位变）
     * 创意档场景词 ≤3（豆总拍板②，不同物理空间可共存；同空间同义词仍走撞车闸）
     * 精档零扩展（A 方案，Modelfile 不动）：zeroExpansion=true 时跳过 act/concept 主动补词，
     *   只留词形归一 + 互斥族 + 红线（牛总表"说啥有啥"口径）
     * 档位只改 cap/limit 参数，不改闸门逻辑本身（牛总实现要点 1/5） */
    var TIER_PARAMS = {
      // NSFW 露骨（safe=false）
      nsfw: {
        fine:     { actCap: 3,  conceptPer: 2, conceptTotal: 4,  expandRatio: 0.15, wordRatio: 1.10, zeroExpansion: true,  sceneCap: 1 },
        balanced: { actCap: 8,  conceptPer: 3, conceptTotal: 8,  expandRatio: 0.25, wordRatio: 1.30, zeroExpansion: false, sceneCap: 1 },
        creative: { actCap: 12, conceptPer: 5, conceptTotal: 12, expandRatio: 0.35, wordRatio: 1.60, zeroExpansion: false, sceneCap: 3 }
      },
      // SFW 正经（safe=true）
      safe: {
        fine:     { actCap: 2,  conceptPer: 1, conceptTotal: 3,  expandRatio: 0.08, wordRatio: 1.10, zeroExpansion: true,  sceneCap: 1 },
        balanced: { actCap: 6,  conceptPer: 2, conceptTotal: 6,  expandRatio: 0.10, wordRatio: 1.30, zeroExpansion: false, sceneCap: 1 },
        creative: { actCap: 10, conceptPer: 4, conceptTotal: 10, expandRatio: 0.18, wordRatio: 1.60, zeroExpansion: false, sceneCap: 3 }
      },
      // 多人线（personCount≥3）盖在档位之上：只放宽行为词 + 词量比，占比线/闸门不放宽
      multi: { actCap: 12, wordRatio: 2.0, conceptTotalAdd: 4 }
    };
    var tierKey = (T.tier === 'fine' || T.tier === 'creative') ? T.tier : 'balanced'; // 缺省/非法 → 平衡
    var modeKey = safe ? 'safe' : 'nsfw';
    var tierP = TIER_PARAMS[modeKey][tierKey];
    // 多人线自动叠加（牛总要点3：人数≥3 时行为上限与词量比切多人线，不依赖档位）
    var personCount = (T.personCount != null) ? T.personCount : 1;
    var multiPerson = personCount >= 3;
    if (multiPerson) {
      tierP.actCap = TIER_PARAMS.multi.actCap;
      tierP.wordRatio = TIER_PARAMS.multi.wordRatio;
      tierP.conceptTotal = tierP.conceptTotal + TIER_PARAMS.multi.conceptTotalAdd;
    }
    // 光影 cap6 三档写死（豆总拍板①）
    tierP.lightCap = 6;
    console.log("[三档参数] tier=" + tierKey + " mode=" + modeKey + " multi=" + multiPerson +
      " → 行为≤" + tierP.actCap + " 概念/" + tierP.conceptPer + " 概念总≤" + tierP.conceptTotal +
      " 占比≤" + Math.round(tierP.expandRatio * 100) + "% 词量比≤" + tierP.wordRatio +
      " 光影cap6 场景≤" + tierP.sceneCap + " 零扩展=" + tierP.zeroExpansion);

    /* 兜底加固（大阿总收尾②，2026-09-11）：
     * 调用方漏传 exclusiveGroups（BUILTIN_LIB 路径 / 其他调用方）时，自动从词库读回 9 族，
     * 防止 R2 互斥族全不执行。取源顺序：
     *   ① T.lib（调用方显式传入，优先，纯函数无全局依赖）
     *   ② globalThis.CIKU_EXTERNAL（浏览器端 词库.js 已加载时自动兜底）
     * 两源都不可用则保持空并静默（不瞎补、不造假）；命中即 console.warn 方便排查。 */
    if ((!T.exclusiveGroups || !T.exclusiveGroups.length)) {
      var _libSrc = null;
      if (T.lib && T.lib.exclusiveGroups && T.lib.exclusiveGroups.length) {
        _libSrc = T.lib.exclusiveGroups;
      } else {
        var _g = (typeof globalThis !== "undefined") ? globalThis : (typeof window !== "undefined" ? window : null);
        if (_g && _g.CIKU_EXTERNAL && _g.CIKU_EXTERNAL.exclusiveGroups && _g.CIKU_EXTERNAL.exclusiveGroups.length) {
          _libSrc = _g.CIKU_EXTERNAL.exclusiveGroups;
        }
      }
      if (_libSrc && _libSrc.length) {
        T.exclusiveGroups = _libSrc;
        console.warn("[postprocessV2] exclusiveGroups 未传入，已自动从词库(lib/CIKU_EXTERNAL.exclusiveGroups)读取，共 " + _libSrc.length + " 族");
      }
    }

    var valid = (task3.valid || []).map(copyObj);
    var warning = (task3.warning || []).slice();
    var error = (task3.error || []).slice();
    var filtered = (task3.filtered || []).slice();
    var merged = 0;

    /* 红线闸（P3下沉，v2入口）：valid/warning里混进红线词 → 移入filtered（带标记），后面步骤全免疫 */
    (function redLineGuard() {
      var gate = T.relevanceGate;
      // 老秦拍板 2026-09-12：NSFW 模式下所有红线词（loli/student/child/kid/teen/非自愿/兽交等）一律直接删除，
      // 不保留、不降分。p3IsRedLine 传 mode 让 NSFW-only 表（student）在 NSFW 下也命中。
      [valid, warning].forEach(function (list, li) {
        for (var i = list.length - 1; i >= 0; i--) {
          var n = normKey(list[i].tag);
          if (n && p3IsRedLine(n, gate, mode)) {
            var item = list.splice(i, 1)[0];
            item.red_line = true;
            item.filter_reason = "red_line_p3";
            item.reason = "红线标签（v2入口P3闸拦截）";
            filtered.push(item);
          }
        }
      });
    })();

    /* 第5步 冲突检测（valid 里两个 tag 落在同一冲突对 → warning，不删，让用户定） */
    var present = {}; valid.forEach(function (v) { present[normKey(v.tag)] = true; });
    var conflictSeen = {};
    conflictPairs.forEach(function (pair) {
      var a = normKey(pair[0]), b = normKey(pair[1]);
      if (present[a] && present[b]) {
        var pk = (a < b ? a + "|" + b : b + "|" + a);
        if (!conflictSeen[pk]) {
          conflictSeen[pk] = true;
          warning.push({ tag: a + " ⇄ " + b, reason: "这两个标签可能冲突，建议删除一个", type: "conflict" });
        }
      }
    });

    /* 第5.5步 R2 同层互斥族（牛总9族，2026-09-11）
     * 同族多词命中 → 保留count最高，其余进filtered
     * 用户显式按钮(source=user)不参与互斥，只管自动通道 */
    (function exclusiveGroupEnforce() {
      var groups = T.exclusiveGroups || [];
      if (!groups.length) return;
      var present = {};
      valid.forEach(function (v) { present[normKey(v.tag)] = v; });

      groups.forEach(function (grp) {
        var hits = [];
        function checkMembers(members) {
          var hitSeen = {};
          (members || []).forEach(function (m) {
            var nm = normKey(m);
            if (hitSeen[nm]) return;
            if (present[nm] && !present[nm].exempt && present[nm].source !== "user") {
              hitSeen[nm] = 1;
              hits.push(present[nm]);
            }
          });
        }

        if (grp.rule === "take_one" || grp.rule === "take_one_single") {
          checkMembers(grp.members);
          if (hits.length < 2) return;
          // R2-fix: take_one_single + conditional=single_only → 多人场景跳过
          if (grp.rule === "take_one_single" && grp.conditional === "single_only") {
            if (__multiPerson(Object.keys(present), grp.multiPersonIndicators, personCount)) return; // 多人场景: 允许同族词共存
          }
          hits.sort(function (a, b) {
            var _g=(T.relevanceGate&&T.relevanceGate.genderRankForPairing);
            if(_g){ var _ra=_g(a.tag), _rb=_g(b.tag); if(_rb!==_ra) return _ra-_rb; }
            var cntDiff = (b.count || 0) - (a.count || 0);
            if (cntDiff !== 0) return cntDiff;
            // count相同时按priority排序 (viewer > another > each_other)
            if (grp.priority) {
              var pa = grp.priority.indexOf(normKey(a.tag));
              var pb = grp.priority.indexOf(normKey(b.tag));
              if (pa >= 0 && pb >= 0) return pa - pb;
              if (pa >= 0) return -1;
              if (pb >= 0) return 1;
            }
            return 0;
          });
          for (var i = 1; i < hits.length; i++) {
            var drop = hits[i];
            drop.exempt = true;
            filtered.push({ tag: drop.tag, reason: "R2互斥[" + grp.id + "]: 保留count最高", type: "exclusive_group", group: grp.id, filter_reason: "exclusive:" + grp.id });
          }
          valid = valid.filter(function (v) { return !v.exempt; });

        } else if (grp.rule === "cross_system") {
          var aHits = [], bHits = [], aSeen = {}, bSeen = {};
          (grp.sysA.members || []).forEach(function (m) { var nm = normKey(m); if (aSeen[nm]) return; if (present[nm] && !present[nm].exempt && present[nm].source !== "user") { aSeen[nm]=1; aHits.push(present[nm]); } });
          (grp.sysB.members || []).forEach(function (m) { var nm = normKey(m); if (bSeen[nm]) return; if (present[nm] && !present[nm].exempt && present[nm].source !== "user") { bSeen[nm]=1; bHits.push(present[nm]); } });
          if (aHits.length && bHits.length) {
            var aTotal = aHits.reduce(function (s, x) { return s + (x.count || 0); }, 0);
            var bTotal = bHits.reduce(function (s, x) { return s + (x.count || 0); }, 0);
            var loser = (aTotal >= bTotal) ? bHits : aHits;
            loser.forEach(function (drop) {
              drop.exempt = true;
              filtered.push({ tag: drop.tag, reason: "R2互斥[" + grp.id + "]: 跨系取高count", type: "exclusive_group", group: grp.id, filter_reason: "exclusive:" + grp.id });
            });
            valid = valid.filter(function (v) { return !v.exempt; });
          }

        } else if (grp.rule === "conditional") {
          var aPresent = false;
          (grp.sysA.members || []).forEach(function (m) { if (present[normKey(m)]) aPresent = true; });
          if (aPresent) {
            var toDrop = [], dropSeen = {};
            (grp.sysB.members || []).forEach(function (m) {
              var nm = normKey(m);
              if (dropSeen[nm]) return;
              if (present[nm] && !present[nm].exempt && present[nm].source !== "user") { dropSeen[nm]=1; toDrop.push(present[nm]); }
            });
            toDrop.forEach(function (drop) {
              drop.exempt = true;
              filtered.push({ tag: drop.tag, reason: "R2互斥[" + grp.id + "]: 裸体命中,服装词移除", type: "exclusive_group", group: grp.id, filter_reason: "exclusive:" + grp.id });
            });
            if (toDrop.length) valid = valid.filter(function (v) { return !v.exempt; });
          }

        } else if (grp.rule === "sub_class") {
          (grp.subClasses || []).forEach(function (sub) {
            var subHits = [], subSeen = {};
            (sub.members || []).forEach(function (m) {
              var nm = normKey(m);
              if (subSeen[nm]) return;
              if (present[nm] && !present[nm].exempt && present[nm].source !== "user") { subSeen[nm]=1; subHits.push(present[nm]); }
            });
            if (subHits.length < 2) return;
            subHits.sort(function (a, b) {
              var _g=(T.relevanceGate&&T.relevanceGate.genderRankForPairing);
              if(_g){ var _ra=_g(a.tag), _rb=_g(b.tag); if(_rb!==_ra) return _ra-_rb; }
              return (b.count||0)-(a.count||0);
            });
            for (var i = 1; i < subHits.length; i++) {
              var drop = subHits[i];
              drop.exempt = true;
              filtered.push({ tag: drop.tag, reason: "R2互斥[" + grp.id + "/" + sub.id + "]: 同子类取一", type: "exclusive_group", group: grp.id, filter_reason: "exclusive:" + grp.id });
            }
            valid = valid.filter(function (v) { return !v.exempt; });
          });
        }
      });

      // Rebuild present
      present = {};
      valid.forEach(function (v) { present[normKey(v.tag)] = v; });
    })();

    /* 第6步 语义去重（组内命中≥2 → 保留 count 最高，其余移除，记 merged） */
    valid = (function dedupe(list) {
      var out = list.slice();
      var byTag = {}; out.forEach(function (v) { byTag[normKey(v.tag)] = v; });
      SYNONYM_GROUPS.forEach(function (grp) {
        var hits = grp.filter(function (t) { return byTag[t]; });
        if (hits.length < 2) return;
        hits.sort(function (x, y) { return ((byTag[y].count || 0) - (byTag[x].count || 0)); });
        for (var i = 1; i < hits.length; i++) {
          var drop = hits[i];
          out = out.filter(function (v) { return normKey(v.tag) !== drop; });
          delete byTag[drop];
          merged++;
        }
      });
      return out;
    })(valid);

    /* 第6.5步 相关性打分（Relevance Gate，v2.0新增，可选）
     * 给每个标签打相关性分数（0/1/2/3），低于阈值的移到warning或filtered
     * 正经模式阈值≥2，露骨模式阈值≥1
     * 需要 T.userDescription（用户原始描述）和 T.relevanceGate（打分模块）才启用
     */
    var relevanceStats = null;
    if (T && T.userDescription && T.relevanceGate && typeof T.relevanceGate.scoreAndFilter === "function") {
      // 收集所有待打分的标签（valid + warning）
      var allTagsForScore = [];
      valid.forEach(function (v) { allTagsForScore.push(v); });
      warning.forEach(function (w) { if (w.tag) allTagsForScore.push(w); });

      if (allTagsForScore.length > 0) {
        var scoreResult = T.relevanceGate.scoreAndFilter(
          allTagsForScore,
          T.userDescription,
          safe ? "safe" : "nsfw",
          {
            conceptExpansion: T.conceptExp || {},
            actExpansion: T.actExp || {},
            danbooru: danbooru,
            keywordMap: T.keywordMap || {},
            // V2.3 三档对接打分阈值（大阿总 2026-09-12）：精档=3/平衡档=2/创意档=1
            // 精档只保留直接命中（3分）词，平衡档保留直接命中+扩展（≥2），创意档跟现 NSFW（≥1）
            tier: T.tier || "balanced",
            intentAnchors: T.intentAnchors || null,  // T11：透传强意图锚
            nsfwHardSet: T.nsfwHardSet || null       // T1：透传正经档硬露骨词集合
          }
        );

        // 重新分配 valid / warning / filtered
        valid = scoreResult.valid || [];
        // 打分后的warning跟原有的warning合并
        var newWarning = scoreResult.warning || [];
        // P1-5修复（小阿总审查发现）：被打分升valid的原warning条目没从warning移除，面板同词双显
        var validTagSet = {};
        (valid || []).forEach(function (v) { validTagSet[v.tag] = true; });
        warning = warning.filter(function (w) {
          // 保留原来的冲突检测warning，去掉已经被打分处理过的，以及被升valid的
          if (w.type === "conflict") return true;
          if (validTagSet[w.tag]) return false; // 已升valid，从warning移除
          return newWarning.every(function (nw) { return nw.tag !== w.tag; });
        });
        newWarning.forEach(function (nw) { warning.push(nw); });
        // 打分后的filtered跟原有的filtered合并
        // 分桶归一（大阿总 V2.2）：relevance_gate 侧打出的 filtered 词补 filter_reason（低分过滤）
        // V2.3 第六批修⑤（大阿总 2026-09-13）：裸性别词（girl/boy）当计数形（1girl/2girls/...）在场时，
        // 打分层把它当低分删了 → 原本归 lowscore 桶；实际这是"性别去重"语义（跟 H1 同归 dedup 桶）。
        // 修法：合并 filtered 前，扫一遍打分删词，命中"裸性别词+计数形在场"的改标 gender_bare_*（→dedup 桶）。
        (function reclassifyGenderBare() {
          var GENDER_BARE = { girl: ["1girl", "2girls", "3girls", "multiple_girls"], boy: ["1boy", "2boys", "3boys", "multiple_boys"] };
          // 计数形在场集合（从 valid + scoreResult.valid 取 normKey）
          var presentForms = {};
          (valid || []).forEach(function (v) { if (v.tag) presentForms[normKey(v.tag)] = 1; });
          (scoreResult.valid || []).forEach(function (v) { if (v.tag) presentForms[normKey(v.tag)] = 1; });
          var reclassCount = 0;
          (scoreResult.filtered || []).forEach(function (f) {
            var nk = f.tag ? normKey(f.tag) : "";
            if (!GENDER_BARE[nk]) return; // 不是裸性别词
            var forms = GENDER_BARE[nk];
            var hasCount = forms.some(function (fm) { return presentForms[normKey(fm)]; });
            if (hasCount) {
              f.filter_reason = "gender_bare_" + nk; // 归 dedup 桶（跟 H1 性别去重同语义）
              reclassCount++;
            }
          });
          // 待办2（大阿总 2026-09-13）：浏览器实测排查日志——
          // 小阿总 grep console 确认此函数有没有被调用、改标了几个词（dedup=0 时第一排查方向）
          console.log('[dedup桶·reclassifyGenderBare] 已执行，改标 ' + reclassCount + ' 个裸性别词→gender_bare（评分层删词）' +
            (reclassCount === 0 ? '（本场景评分层没删裸性别词，dedup 桶可能靠统一终筛的 genderBareDedup 计数）' : ''));
        })();
        (scoreResult.filtered || []).forEach(function (f) {
          if (!f.filter_reason) f.filter_reason = "low_score";
          filtered.push(f);
        });
        relevanceStats = scoreResult.stats || null;
      }
    }

    /* 第7步 概念扩展（trigger = LLM 输出过的 tag = valid ∪ warning；补 tags 标蓝，去重；nsfw概念正经模式不触发）
     * P0-2修复（大阿总审查发现）：原ENABLED_CONCEPTS只遍历5个，75个概念里70个是死数据
     * 改为遍历conceptExp里的所有概念（跳过以_开头的说明字段），75个概念全部生效
     */
    var conceptAdded = [];
    var seen = {}; valid.forEach(function (v) { seen[normKey(v.tag)] = true; });
    var trigger = {}; valid.forEach(function (v) { trigger[normKey(v.tag)] = true; });
    warning.forEach(function (w) { if (w.tag) trigger[normKey(w.tag)] = true; });

    /* B层撞车闸（大阿总施工 2026-09-11）：同屏概念族去重——
     * 同族≥2个概念被LLM同时触发时，只允许优先级最高的1个概念供词（专>泛），
     * 其余同族概念 tags 不注入。修 NSFW-02/04 概念扩展偏多主因=同屏概念族撞车。
     * 6族定义（SFW表dedupGate 6族 + NSFW双行为表3族合并去重）：
     *   校服族: schoolgirl>school_uniform>sailor
     *   关系族: lovers>couple>romantic
     *   泳装族: bikini>swimsuit>swimming>swimming_pool（最具体优先）
     *   女仆族: maid>maid_nsfw（nsfw门控已互斥，闸只兜"两概念同屏只留1"）
     *   兽耳族: catgirl>foxgirl
     *   天使恶魔族: succubus>incubus>angel>demon（专>泛）
     */
    var CONCEPT_DEDUP_FAMILIES = [
      { id: "school_uniform_family", priority: ["schoolgirl", "school_uniform", "sailor"] },
      { id: "relationship_family",   priority: ["lovers", "couple", "romantic"] },
      { id: "swimsuit_family",       priority: ["bikini", "swimsuit", "swimming", "swimming_pool"] },
      { id: "maid_family",           priority: ["maid", "maid_nsfw"] },
      { id: "kemonomimi_family",     priority: ["catgirl", "foxgirl"] },
      { id: "angel_demon_family",    priority: ["succubus", "incubus", "angel", "demon"] }
    ];
    // 算当前同屏触发的概念 key 集合（触发=trigger 命中该概念 key 本体词）
    var triggeredConceptKeys = {};
    CONCEPT_DEDUP_FAMILIES.forEach(function (fam) {
      fam.priority.forEach(function (ck) {
        if (trigger[normKey(ck)]) triggeredConceptKeys[ck] = 1;
      });
    });
    // 每族"同屏只取优先级最高的 1 个供词"
    var conceptSupplyBlock = {};
    CONCEPT_DEDUP_FAMILIES.forEach(function (fam) {
      var hitCount = 0, topHit = null;
      fam.priority.forEach(function (ck) {
        if (triggeredConceptKeys[ck]) {
          hitCount++;
          if (!topHit) topHit = ck; // 第一个命中=优先级最高
        }
      });
      if (hitCount >= 2) {
        // 只保留 topHit，其余同族概念不供词
        fam.priority.forEach(function (ck) {
          if (triggeredConceptKeys[ck] && ck !== topHit) conceptSupplyBlock[ck] = fam.id;
        });
        console.log("[B层撞车闸] " + fam.id + " 同屏触发 " + hitCount + " 概念，只取 '" + topHit + "' 供词，" +
          Object.keys(conceptSupplyBlock).length + " 个同族概念被阻");
      }
    });

    /* 三档·概念扩展 cap（大阿总 V2.2）：
     * 精档 zeroExpansion=true → 整段跳过（概念不主动补词，只留词形归一+互斥+红线，"说啥有啥"）
     * 平衡/创意档 → 按 conceptPer(单概念词数) + conceptTotal(概念扩展总量) 截断，
     *   创意档场景类概念按 sceneCap 放开到 ≤3（豆总拍板②，同空间同义词仍被 B层撞车闸拦） */
    if (!tierP.zeroExpansion) {
    Object.keys(conceptExp).forEach(function (key) {
      if (key.startsWith('_')) return; // 跳过说明字段（_说明/_生成日期等）
      var c = conceptExp[key];
      if (!c) return;
      if (safe && c.nsfw) return;
      // B层撞车闸：被阻概念不供词
      if (conceptSupplyBlock[key]) {
        console.log("[B层撞车闸] 概念 '" + key + "' 被 " + conceptSupplyBlock[key] + " 族取1规则阻止供词");
        return;
      }
      // 概念扩展总量上限（三档 cap）：已入 conceptAdded 达 conceptTotal 则停止供词
      if (conceptAdded.length >= tierP.conceptTotal) return;
      if (trigger[normKey(key)]) {
        var sceneLike = (c.type === 'scene' || c.type === 'scene_atmosphere');
        var perCap = sceneLike ? tierP.sceneCap : tierP.conceptPer; // 创意档场景类 ≤3
        var addedThis = 0;
        (c.tags || []).forEach(function (t) {
          if (conceptAdded.length >= tierP.conceptTotal) return; // 总量硬截
          if (addedThis >= perCap) return;                      // 单概念 cap（场景类创意档放开）
          var nk = normKey(t);
          if (!seen[nk]) {
            seen[nk] = true;
            var e = danbooru[nk] || {};
            var o = { tag: t, source: "concept_expansion", concept: key };
            if (e.zh) o.zh = e.zh;
            if (e.count != null) o.count = e.count;
            conceptAdded.push(o);
            addedThis++;
          }
        });
      }
    });
    } else {
      console.log("[三档·精档零扩展] 跳过概念主动补词（A方案，Modelfile 不动，只留词形归一+互斥+红线）");
    }

    /* 三档·行为扩展 cap（大阿总 V2.2）：
     * 精档 zeroExpansion=true → 整段跳过 act_expansion 主动补词（"说啥有啥"，行为词只留 LLM 直出）
     * 平衡/创意档 → 行为扩展补全后按 tierP.actCap 截断 */
    var actAdded = [];
    var actExpEnabled = !tierP.zeroExpansion && T && T.actExp && T.relevanceGate &&
        typeof T.relevanceGate.detectTriggeredActs === "function" &&
        typeof T.relevanceGate.autoCompleteActs === "function";
    if (tierP.zeroExpansion) {
      console.log("[三档·精档零扩展] 跳过行为扩展主动补词（A方案，行为词只留 LLM 直出）");
    }
    if (actExpEnabled) {
      // 收集LLM输出的所有标签（valid + warning），用于行为扩展触发
      var llmTagsForAct = [];
      valid.forEach(function (v) { llmTagsForAct.push(v.tag); });
      warning.forEach(function (w) { if (w.tag) llmTagsForAct.push(w.tag); });
      // 检测触发了哪些行为扩展
      var negatedForAct = T.relevanceGate.detectNegations ? T.relevanceGate.detectNegations(T.userDescription || "") : [];
      var triggeredActs = T.relevanceGate.detectTriggeredActs(
        T.userDescription || "",
        llmTagsForAct,
        T.actExp,
        safe ? "safe" : "nsfw",
        negatedForAct
      );
      // 收集现有所有标签（valid + warning + conceptAdded），用于去重
      var allExistingTags = [];
      valid.forEach(function (v) { allExistingTags.push(v.tag); });
      warning.forEach(function (w) { if (w.tag) allExistingTags.push(w.tag); });
      conceptAdded.forEach(function (c) { allExistingTags.push(c.tag); });
      // 调用autoCompleteActs补全行为扩展伴随标签
      actAdded = T.relevanceGate.autoCompleteActs(
        allExistingTags,
        triggeredActs,
        negatedForAct,
        danbooru
      );
      // 把行为扩展补全的标签加到conceptAdded数组里（复用现有的处理逻辑）
      // 三档·行为词 cap（大阿总 V2.2）：act_expansion 补出的行为扩展词按 tierP.actCap 截断
      //   （actCap 管的是"LLM 直出行为词 + 行为扩展补全"的行为列总量上限，
      //    在 unifiedFinalFilter 终筛处按 valid 里行为词 + conceptAdded 里 act_expansion 词 联合计）
      actAdded.forEach(function (a) {
        var nk = normKey(a.tag);
        if (!seen[nk]) {
          seen[nk] = true;
          var e = danbooru[nk] || {};
          var o = { tag: a.tag, source: "act_expansion", act: a.source ? String(a.source).replace("act_", "") : "" }; // 外援6条·条4：固定来源标签（原 a.source|| 恒为 act_xxx 致 actCap 永不生效），原始来源留 o.act
          if (e.zh) o.zh = e.zh;
          if (e.count != null) o.count = e.count;
          if (a.post_count != null) o.count = a.post_count;
          conceptAdded.push(o);
        }
      });
    }

    /* 三档·行为词 cap 执行（大阿总 V2.2）：在 conceptAdded 入池后、R2 二次互斥前，
     * 统计"行为列"词数（valid 里的行为类直出词 + conceptAdded 里 source=act_expansion 的词），
     * 超出 tierP.actCap 的 act_expansion 词按热度降序截断。
     * 判定口径：行为词 = LLM 直出的动作类 valid 词（source 缺省=LLM直出，且词在 act_expansion 表
     * 的 trigger/tag 集合里）+ act_expansion 补全词。保守起见：只对 act_expansion 补全词截断
     * （LLM 直出是"用户说的"不砍，符合牛总"用户说的必须全给"口径）。 */
    (function applyActCap() {
      if (tierP.zeroExpansion) return; // 精档已跳过行为扩展，无需 cap
      // act_expansion 补出的词 = conceptAdded 里 source === 'act_expansion'
      var actExpItems = conceptAdded.filter(function (o) { return o.source === 'act_expansion'; });
      // LLM 直出的行为词 = valid 里 tag 命中 act_expansion 的任一 tag/trigger
      var actTagSet = {};
      if (T.actExp) {
        Object.keys(T.actExp).forEach(function (ak) {
          var adef = T.actExp[ak];
          if (!adef) return;
          (adef.tags || []).forEach(function (t) { actTagSet[normKey(t)] = 1; });
          (adef.triggers || []).forEach(function (t) { actTagSet[normKey(t)] = 1; });
        });
      }
      var llmActCount = 0;
      valid.forEach(function (v) { if (actTagSet[normKey(v.tag)]) llmActCount++; });
      var totalAct = llmActCount + actExpItems.length;
      if (totalAct > tierP.actCap) {
        var over = totalAct - tierP.actCap;
        // 按热度降序保留：先给 act_expansion 词排序（count 高的留）
        actExpItems.sort(function (a, b) {
          var _g=(T.relevanceGate&&T.relevanceGate.genderRankForPairing);
          if(_g){ var _ra=_g(a.tag), _rb=_g(b.tag); if(_rb!==_ra) return _ra-_rb; }
          return (b.count||0)-(a.count||0);
        });
        var keepAct = Math.max(0, actExpItems.length - over);
        var droppedAct = actExpItems.slice(keepAct);
        var dropSet = {};
        droppedAct.forEach(function (o) { dropSet[normKey(o.tag)] = 1; });
        // 从 conceptAdded 里移除被 cap 掉的 act_expansion 词
        for (var i = conceptAdded.length - 1; i >= 0; i--) {
          if (conceptAdded[i].source === 'act_expansion' && dropSet[normKey(conceptAdded[i].tag)]) {
            var _o = conceptAdded[i];
            _o.filter_reason = 'tier_cap:' + tierP.actCap;
            _o.reason = '三档行为词 cap=' + tierP.actCap + ' 截断（保留热度最高）';
            filtered.push(_o);
            conceptAdded.splice(i, 1);
          }
        }
        console.log('[三档·行为cap] 行为词 ' + totalAct + ' > cap ' + tierP.actCap + '，截断 ' + droppedAct.length + ' 个 act_expansion 词进 filtered');
      }
    })();

    /* 第7.7步 R2 二次互斥族检查（覆盖 valid + conceptAdded 合并池，拦截概念/行为扩展通道绕过 step 5.5 的同族词）
     * 第5.5步只在 valid 范围内执行；概念扩展(第7步)/行为扩展(第7.5步)新增词可能同族并存，
     * 这里在全部入池后二次执行，确保跨通道互斥生效。 */
    (function exclusiveGroupSecondPass() {
      var groups = T.exclusiveGroups || [];
      if (!groups.length) return;

      // valid 在 step 5.5 后已经是干净的，conceptAdded 是概念/行为扩展新入的词
      // 合并池 = valid（LLM 直出，已清洗） + conceptAdded（待检查）
      var validSet = {};
      valid.forEach(function (v) { validSet[normKey(v.tag)] = true; });

      // 需要移除的 conceptAdded 项索引
      var dropIdx = {};

      groups.forEach(function (grp) {
        function collectFromConcept(members) {
          var hits = [], hitSeen = {};
          (members || []).forEach(function (m) {
            var nm = normKey(m);
            if (hitSeen[nm]) return;
            conceptAdded.forEach(function (c) {
              var cn = normKey(c.tag);
              if (cn === nm && c.source !== "user" && !dropIdx[cn] && !hitSeen[nm]) {
                hitSeen[nm] = 1;
                hits.push(c);
              }
            });
          });
          return hits;
        }
        function inValid(members) {
          var found = false;
          (members || []).forEach(function (m) {
            if (validSet[normKey(m)]) found = true;
          });
          return found;
        }

        if (grp.rule === "take_one" || grp.rule === "take_one_single") {
          var cHits = collectFromConcept(grp.members);
          if (cHits.length < 1) return;
          // R2-fix: take_one_single + conditional=single_only → 多人场景跳过
          if (grp.rule === "take_one_single" && grp.conditional === "single_only") {
            if (__multiPerson(Object.keys(validSet), grp.multiPersonIndicators, personCount)) return; // 多人场景: 允许概念扩展同族词共存
          }
          // 如果 valid 里已有同族词（step 5.5 保留下来的那个），conceptAdded 里同族全清
          if (inValid(grp.members)) {
            cHits.forEach(function (h) { dropIdx[normKey(h.tag)] = true; });
          } else if (cHits.length >= 2) {
            // valid 里没有，但 conceptAdded 里 ≥2 个 → take_one
            cHits.sort(function (a, b) {
              var _g=(T.relevanceGate&&T.relevanceGate.genderRankForPairing);
              if(_g){ var _ra=_g(a.tag), _rb=_g(b.tag); if(_rb!==_ra) return _ra-_rb; }
              var cntDiff2 = (b.count || 0) - (a.count || 0);
              if (cntDiff2 !== 0) return cntDiff2;
              if (grp.priority) {
                var pa2 = grp.priority.indexOf(normKey(a.tag));
                var pb2 = grp.priority.indexOf(normKey(b.tag));
                if (pa2 >= 0 && pb2 >= 0) return pa2 - pb2;
                if (pa2 >= 0) return -1;
                if (pb2 >= 0) return 1;
              }
              return 0;
            });
            for (var i = 1; i < cHits.length; i++) { dropIdx[normKey(cHits[i].tag)] = true; }
          }

        } else if (grp.rule === "cross_system") {
          var aC = collectFromConcept(grp.sysA.members);
          var bC = collectFromConcept(grp.sysB.members);
          var aV = inValid(grp.sysA.members);
          var bV = inValid(grp.sysB.members);
          // 如果 valid 里已有某系（step 5.5 保留），另一系在 conceptAdded 里全清
          if (aV && !bV) { bC.forEach(function (h) { dropIdx[normKey(h.tag)] = true; }); }
          else if (bV && !aV) { aC.forEach(function (h) { dropIdx[normKey(h.tag)] = true; }); }
          else if (aC.length && bC.length && !aV && !bV) {
            // 两系都在 conceptAdded → 跨系取高
            var aTotal = aC.reduce(function (s, x) { return s + (x.count || 0); }, 0);
            var bTotal = bC.reduce(function (s, x) { return s + (x.count || 0); }, 0);
            var loser = (aTotal >= bTotal) ? bC : aC;
            loser.forEach(function (h) { dropIdx[normKey(h.tag)] = true; });
          }

        } else if (grp.rule === "conditional") {
          // sysA(裸体族) 在 valid 里 → conceptAdded 里 sysB(服装族) 全清
          if (inValid(grp.sysA.members)) {
            var bC2 = collectFromConcept(grp.sysB.members);
            bC2.forEach(function (h) { dropIdx[normKey(h.tag)] = true; });
          }

        } else if (grp.rule === "sub_class") {
          (grp.subClasses || []).forEach(function (sub) {
            var cHits = collectFromConcept(sub.members);
            if (cHits.length < 1) return;
            if (inValid(sub.members)) {
              cHits.forEach(function (h) { dropIdx[normKey(h.tag)] = true; });
            } else if (cHits.length >= 2) {
              cHits.sort(function (a, b) {
                var _g=(T.relevanceGate&&T.relevanceGate.genderRankForPairing);
                if(_g){ var _ra=_g(a.tag), _rb=_g(b.tag); if(_rb!==_ra) return _ra-_rb; }
                return (b.count||0)-(a.count||0);
              });
              for (var i = 1; i < cHits.length; i++) { dropIdx[normKey(cHits[i].tag)] = true; }
            }
          });
        }
      });

      // 执行移除
      var dropped = 0;
      if (Object.keys(dropIdx).length) {
        var keep = [];
        conceptAdded.forEach(function (c) {
          if (dropIdx[normKey(c.tag)]) {
            filtered.push({ tag: c.tag, reason: "R2互斥二次检查[" + (c.source || "cross_channel") + "]: 跨通道同族词移除", type: "exclusive_group", filter_reason: "exclusive:" + (c.source || "cross_channel") });
            dropped++;
          } else {
            keep.push(c);
          }
        });
        conceptAdded = keep;
      }
    })();

    /* 第8步 热度排序（valid 按 count 降序；conceptAdded 单独放面板蓝色区） */
    valid.sort(function (a, b) { return ((b.count || 0) - (a.count || 0)); });

    /* 第9步 回填补全（简单版：valid<阈值 且缺某核心特征 → 补默认高频，标灰） */
    var backfilled = [];
    // 回填 P0 修复（大阿总 V2.2，2026-09-12）：
    // zeroExpansion=true（精档）：统一跳过行为扩展/概念扩展/回填，系统不主动补任何东西，用户说啥有啥。
    //   注意：zeroExpansion 现在统一控制三件事（①行为扩展 ②概念扩展 ③回填），改回填行为时别绕开这个判断——
    //   否则 LLM 越守"未说属性留空"→ valid 越小 → 回填越活跃，负反馈陷阱（精档词量比≤1.10 结构上必挂）。
    //   平衡档/创意档保持现有回填逻辑不变。
    if (!tierP.zeroExpansion && valid.length < BACKFILL_THRESHOLD) {
      var have = {};
      valid.forEach(function (v) {
        var t = normKey(v.tag);
        BACKFILL_DEFAULTS.forEach(function (d) {
          if (t === normKey(d[1]) || t.indexOf(d[0]) >= 0) have[d[0]] = true;
        });
      });
      BACKFILL_DEFAULTS.forEach(function (d) {
        if (valid.length + backfilled.length >= BACKFILL_THRESHOLD) return;
        if (!have[d[0]] && !seen[normKey(d[1])]) {
          var e = danbooru[normKey(d[1])] || {};
          var o = { tag: d[1], source: "backfill", feature: d[0] };
          if (e.zh) o.zh = e.zh;
          if (e.count != null) o.count = e.count;
          backfilled.push(o);
          have[d[0]] = true;
        }
      });
    }

    /* 第10步 组装校验面板数据 */
    var returnStats = {
      total: task3.stats ? task3.stats.total : valid.length,
      valid: valid.length, warning: warning.length, error: error.length, filtered: filtered.length,
      merged: merged, conceptAdded: conceptAdded.length, actAdded: actAdded.length, backfilled: backfilled.length
    };
    // 如果启用了相关性打分，把打分统计加进去
    if (relevanceStats) {
      returnStats.relevance = relevanceStats;
    }

    /* 三档·面板指标 + 过滤词统计（大阿总 V2.2，豆总拍板③ B方案触发指标）
     * ① tierParams：把本档生效参数回传给 UI（显示"精档：行为≤3·概念≤2"）
     * ② filterMetrics：过滤÷合法 比值 + 单组过滤词数，供小阿总判精档 A/B 方案
     *    阈值：过滤÷合法 > 1.0 或 单组过滤 > 15 词 → 触发喊姐姐上 B 方案（烘铁律14）
     * ③ wordRatio：词量比（最终输出词数 / LLM 直出词数），对标 tierP.wordRatio */
    var finalWordCount = valid.length + conceptAdded.length + (actAdded ? actAdded.length : 0) + backfilled.length;
    var llmDirectCount = valid.length; // LLM 直出合法词（词量比分母）
    var wordRatio = llmDirectCount > 0 ? (finalWordCount / llmDirectCount) : 0;
    // 过滤词统计：filtered 总数（含红线 + 打分过滤 + cap 截断）
    var filteredCount = filtered.length;
    var filterRatio = llmDirectCount > 0 ? (filteredCount / llmDirectCount) : filteredCount;
    // 单组过滤：按 filter_reason 分组，取最大一组
    var byReason = {};
    filtered.forEach(function (f) {
      var r = f.filter_reason || 'misc';
      byReason[r] = (byReason[r] || 0) + 1;
    });
    var maxGroup = 0, maxGroupReason = '';
    Object.keys(byReason).forEach(function (r) {
      if (byReason[r] > maxGroup) { maxGroup = byReason[r]; maxGroupReason = r; }
    });
    var bTrigger = (filterRatio > 1.0 || maxGroup > 15);
    returnStats.tierParams = {
      tier: tierKey, mode: modeKey, multiPerson: multiPerson,
      actCap: tierP.actCap, conceptPer: tierP.conceptPer, conceptTotal: tierP.conceptTotal,
      expandRatio: tierP.expandRatio, wordRatio: tierP.wordRatio, lightCap: tierP.lightCap,
      sceneCap: tierP.sceneCap, zeroExpansion: tierP.zeroExpansion
    };
    returnStats.filterMetrics = {
      filteredCount: filteredCount, llmDirectCount: llmDirectCount,
      filterRatio: Math.round(filterRatio * 100) / 100,
      maxGroup: maxGroup, maxGroupReason: maxGroupReason,
      byReason: byReason, bTrigger: bTrigger
    };
    returnStats.wordRatio = Math.round(wordRatio * 100) / 100;
    console.log('[三档·统计] 词量比=' + returnStats.wordRatio + '（档目标≤' + tierP.wordRatio + '）' +
      ' 过滤词=' + filteredCount + '÷合法' + llmDirectCount + '=' + returnStats.filterMetrics.filterRatio +
      ' 单组最大=' + maxGroup + '(' + maxGroupReason + ') B触发=' + bTrigger);

    /* ======== 统一全通道终筛（C1+C2 v2.0）========
     * 在最终输出拼装前，把所有来源合并成"最终全输出词层"：
     * valid(合法池) + conceptAdded(概念扩展) + actAdded(行为扩展) + backfilled(回填)
     * 所有 exclusiveGroups 族 + blacklist 在此统一执行一次。
     * 全局 normKey 去重（下划线/空格归一后相同只留1个）。
     * 豁免：source=user（用户手动点选）不参与取一/过滤；光影预设豁免。
     * 光影 cap：6维度跨组共存但总数≤5（dim4 方向最多2）；不同场景 cap=2。
     */
    (function unifiedFinalFilter() {
      var allSources = valid.concat(conceptAdded).concat(actAdded).concat(backfilled);
      if (!allSources.length) return;

      // 构建全输出词层的 present map（normKey 索引）
      var allPresent = {};
      allSources.forEach(function (v) {
        var nk = normKey(v.tag);
        if (!allPresent[nk]) allPresent[nk] = v;
      });

      var groups = T.exclusiveGroups || [];
      if (!groups.length) {
        // 兜底：从词库读
        var _libSrc = null;
        if (T.lib && T.lib.exclusiveGroups && T.lib.exclusiveGroups.length) _libSrc = T.lib.exclusiveGroups;
        else {
          var _g = (typeof globalThis !== "undefined") ? globalThis : (typeof window !== "undefined" ? window : null);
          if (_g && _g.CIKU_EXTERNAL && _g.CIKU_EXTERNAL.exclusiveGroups && _g.CIKU_EXTERNAL.exclusiveGroups.length) _libSrc = _g.CIKU_EXTERNAL.exclusiveGroups;
        }
        if (_libSrc && _libSrc.length) groups = _libSrc;
      }

      var userExempt = {}; // source=user 的 normKey 集合，豁免
      allSources.forEach(function (v) {
        if (v.source === "user") userExempt[normKey(v.tag)] = 1;
      });
      // C3'：UI 手点 lighting 词（含光影组合预设）通过 T.userExemptPre 豁免
      // 根因：html 里从未给词标记 source='user'，postprocess 的 userExempt 检查永远不成立，
      //       导致用户手点的光影预设（如油画古典 4 词跨 4 个 dim）被 cap6 / 取一删掉
      // 修法：调用方在 aiPromptSubmit 前收集 state.multi.lighting 选中词 + 光影预设词，
      //       通过 T.userExemptPre 注入，此处合并进 userExempt
      if (T.userExemptPre && typeof T.userExemptPre === "object") {
        Object.keys(T.userExemptPre).forEach(function (nk) {
          if (T.userExemptPre[nk]) userExempt[nk] = 1;
        });
      }

      // 逐族执行
      groups.forEach(function (grp) {
        var members = grp.members || [];

        // conditional 族（如 nude_x_clothes：sysA 裸体在场 → 删 sysB 服装词；含第9步回填的服装）（外援6条·条2）
        // ⚠️ 必须放在下方 members 空守卫【之前】：conditional 族无顶层 members（只有 sysA/sysB），
        //    被"!members.length return"挡住则本分支永不执行（探针实坐实，dress 回填漏删根因）。
        if (grp.rule === "conditional" && grp.sysA && grp.sysB) {
          var condA = false;
          (grp.sysA.members || []).forEach(function (m) {
            var nk = normKey(m);
            if (allPresent[nk] && !userExempt[nk] && !allPresent[nk]._excluded) condA = true;
          });
          if (condA) {
            (grp.sysB.members || []).forEach(function (m) {
              var nk = normKey(m);
              if (allPresent[nk] && !userExempt[nk] && !allPresent[nk]._excluded) {
                allPresent[nk]._excluded = grp.id;
              }
            });
          }
          return;
        }

        if (!members.length) return;

        // cross_system 族处理
        if (grp.rule === "cross_system") {
          var sysA = grp.sysA ? (grp.sysA.members || []) : [];
          var sysB = grp.sysB ? (grp.sysB.members || []) : [];
          var aHit = null, bHit = null;
          sysA.forEach(function (m) {
            var nk = normKey(m);
            if (allPresent[nk] && !userExempt[nk] && !aHit) aHit = allPresent[nk];
          });
          sysB.forEach(function (m) {
            var nk = normKey(m);
            if (allPresent[nk] && !userExempt[nk] && !bHit) bHit = allPresent[nk];
          });
          if (aHit && bHit) {
            // 保留优先级高的（sysA 优先），另一系标记 filtered
            var loser = bHit; // sysB 被过滤
            loser._excluded = grp.id;
          }
          return;
        }

        // blacklist 族
        if (grp.rule === "blacklist") {
          members.forEach(function (m) {
            var nk = normKey(m);
            if (allPresent[nk] && !userExempt[nk]) {
              allPresent[nk]._excluded = grp.id;
            }
          });
          return;
        }

        // take_one / take_one_single / take_one_cap2（conditional 分支已上移到 members 空守卫之前，见循环头部）
        if (grp.rule === "take_one" || grp.rule === "take_one_single" || grp.rule === "take_one_cap2") {
          // conditional skip（跟 step 5.5 逻辑一致）
          if (grp.rule === "take_one_single" && grp.conditional === "single_only") {
            if (__multiPerson(Object.keys(allPresent), grp.multiPersonIndicators, personCount)) return; // 多人场景允许共存
          }

          var hits = [], hitSeen = {};
          members.forEach(function (m) {
            var nk = normKey(m);
            if (hitSeen[nk]) return;
            if (allPresent[nk] && !userExempt[nk] && !allPresent[nk]._excluded) {
              hitSeen[nk] = 1;
              hits.push(allPresent[nk]);
            }
          });
          if (hits.length < 2) return;

          var cap = (grp.rule === "take_one_cap2") ? 2 : 1;
          // 按 priority 排序（如果族有 priority 字段）
          var prio = grp.priority || members;
          hits.sort(function (a, b) {
            var ia = prio.indexOf(a.tag) >= 0 ? prio.indexOf(a.tag) : 999;
            var ib = prio.indexOf(b.tag) >= 0 ? prio.indexOf(b.tag) : 999;
            return ia - ib;
          });
          // 保留前 cap 个，其余标记 filtered
          for (var hi = cap; hi < hits.length; hi++) {
            hits[hi]._excluded = grp.id;
          }
        }
      });

      // 光影 cap=6：统计所有 light_dim1~6 保留的词，总数>6 时按铁律13优先级丢弃：
      // 丢弃顺序（低→高）：dim6风格 → dim3色温 → dim2光质 → dim4方向 → dim5布光法 → dim1光源（最后丢）
      // 即保留优先级：dim1光源 > dim5布光法 > dim4方向 > dim2光质 > dim3色温 > dim6风格
      var lightGroups = groups.filter(function (g) { return g.id && g.id.indexOf("light_dim") === 0; });
      if (lightGroups.length) {
        // 每个词的 dim 归属（用于优先级排序）
        var dimPriority = { "light_dim1": 1, "light_dim5": 2, "light_dim4": 3, "light_dim2": 4, "light_dim3": 5, "light_dim6": 6 };
        var lightKept = [];
        var dimOfTag = {};
        lightGroups.forEach(function (lg) {
          (lg.members || []).forEach(function (m) {
            dimOfTag[normKey(m)] = lg.id;
          });
        });
        allSources.forEach(function (v) {
          if (v._excluded || userExempt[normKey(v.tag)]) return;
          var nk = normKey(v.tag);
          if (dimOfTag[nk]) lightKept.push(v);
        });
        // 去重（同 normKey 只留1个）
        var seen = {};
        lightKept = lightKept.filter(function (v) {
          var nk = normKey(v.tag);
          if (seen[nk]) return false;
          seen[nk] = 1;
          return true;
        });
        // cap=6：超量时按优先级排序（优先级高的保留，低的丢）
        if (lightKept.length > 6) {
          lightKept.sort(function (a, b) {
            var pa = dimPriority[dimOfTag[normKey(a.tag)]] || 9;
            var pb = dimPriority[dimOfTag[normKey(b.tag)]] || 9;
            return pa - pb; // 小=高优先级=先保留
          });
          for (var li = 6; li < lightKept.length; li++) {
            lightKept[li]._excluded = "light_cap6_" + dimOfTag[normKey(lightKept[li].tag)];
          }
        }
      }

      // 全局 normKey 去重（同词出现多次只保留第一个）
      var globalSeen = {};
      allSources.forEach(function (v) {
        var nk = normKey(v.tag);
        if (globalSeen[nk]) { v._excluded = "global_dedup"; return; }
        globalSeen[nk] = 1;
      });

      // 性别词裸词去重（豆总 H1，出口层）：已有计数/复数形式 1boy/2boys/multiple boys → 删独立裸 boy；
      // 1girl/2girls/multiple girls → 删独立裸 girl。
      // 边界：整词精确匹配（boyish/cowboy_shot/girlfriend/tomboy 等复合词绝不误伤）；
      // 唯一性别锚点保护——没有计数/复数形式在场时裸词保留；user 手动点选（source=user）不删。
      // futanari 场景例外（裸 girl 是 futa 构图的必要组成）→ 命中时保留并 console 列出让小阿总人工裁量。
      (function genderBareDedup() {
        function findBare(allSources, bare, forms) {
          var formSet = {};
          forms.forEach(function (f) { formSet[normKey(f)] = 1; });
          var hasForm = false;
          allSources.forEach(function (v) {
            if (formSet[normKey(v.tag)]) hasForm = true;
          });
          if (!hasForm) return; // 无锚点 → 裸词保留
          allSources.forEach(function (v) {
            if (normKey(v.tag) !== normKey(bare)) return;
            if (v.source === "user") return; // 手动点选豁免
            if (normKey(v.tag) === "girl" && globalSeen[normKey("futanari")]) {
              // futa 场景例外：列出来人工裁量，自动保留
              console.log('[H1 性别词去重] 例外保留：futanari 在场，裸 girl 不自动删（列示待裁量）');
              return;
            }
            v._excluded = "gender_bare_" + bare;
          });
        }
        findBare(allSources, "boy", ["1boy", "2boys", "3boys", "multiple_boys"]);
        findBare(allSources, "girl", ["1girl", "2girls", "3girls", "multiple_girls"]);
      })();

      // 把标记 _excluded 的词从各数组中移除，加入 filtered
      // 分桶归一（大阿总 V2.2，按阿紫逐行清单 L918）：_excluded 原值不能直接透传
      // （bust_size/light_cap6_色温/global_dedup/blacklist 混杂会让分桶聚合失效），必须映射归一：
      //   "blacklist"        → "red_line"（归 redline 桶）
      //   "light_cap6_*"前缀 → "exclusive:light_cap6"（归 exclusive 桶）
      //   "global_dedup"     → "dedup"（归 dedup 桶，S3 2026-09-12：重复删除单列，与"过滤原因"五桶语义不同）
      //   "gender_bare_*"    → "dedup"（H1 性别去重，S3 起从 exclusive 迁到 dedup 桶）
      //   其余（互斥族 id）  → "exclusive:<id>"（归 exclusive 桶）
      // 判定顺序：先 light_cap6_ 前缀 → 再精确 blacklist → 再 global_dedup/gender_bare_ 前缀 → 其余视为互斥族 id
      function normalizeExcluded(v) {
        var ex = v._excluded;
        if (!ex) return "misc";
        if (typeof ex === "string" && ex.indexOf("light_cap6") === 0) return "exclusive:light_cap6";
        if (ex === "blacklist") return "red_line";
        if (ex === "global_dedup") return "dedup";
        if (typeof ex === "string" && ex.indexOf("gender_bare_") === 0) return "dedup";
        return "exclusive:" + ex;
      }
      var removeFrom = function (arr) {
        var keep = [];
        arr.forEach(function (v) {
          if (v._excluded) {
            filtered.push({ tag: v.tag, reason: "统一终筛：" + normalizeExcluded(v), filter_reason: normalizeExcluded(v) });
          } else {
            keep.push(v);
          }
        });
        return keep;
      };
      valid = removeFrom(valid);
      conceptAdded = removeFrom(conceptAdded);
      actAdded = removeFrom(actAdded);
      backfilled = removeFrom(backfilled);
    })();

    /* 分桶归一统计（大阿总 V2.2，在统一终筛之后算——终筛也会往 filtered 推词，必须最后聚合）
     * 阿紫自检 5 条断言依赖的结构：
     *   stats.filterMetrics.buckets = { redline, exclusive, structural, tiercap, lowscore, misc, dedup }
     *   六桶（不含 misc）之和 === filteredCount；misc === 0 才算分桶健康
     *   S3 2026-09-12：dedup 桶单列（重复删除与"过滤原因"五桶语义不同），
     *   global_dedup / gender_bare_* 归 dedup，不再归 structural / exclusive
     *   stats.filteredDetail = filtered 词明细（带 filter_reason，供小阿总归因）
     * 归一规则（filter_reason → 桶）：
     *   red_line*        → redline
     *   exclusive:*      → exclusive
     *   structural:*     → structural
     *   tier_cap:*       → tiercap
     *   low_score        → lowscore
     *   dedup            → dedup
     *   其余             → misc */
    var bucketOf = function (fr) {
      if (!fr) return "misc";
      if (fr.indexOf("red_line") === 0) return "redline";
      if (fr.indexOf("exclusive:") === 0) return "exclusive";
      if (fr.indexOf("structural:") === 0) return "structural";
      if (fr.indexOf("tier_cap:") === 0) return "tiercap";
      if (fr === "dedup") return "dedup";
      if (fr.indexOf("gender_bare_") === 0) return "dedup"; // V2.3 第六批修⑤：打分层删的裸性别词归 dedup 桶
      if (fr === "low_score") return "lowscore";
      return "misc";
    };
    var buckets = { redline: 0, exclusive: 0, structural: 0, tiercap: 0, lowscore: 0, dedup: 0, misc: 0 };
    var filteredDetail = [];
    filtered.forEach(function (f) {
      var b = bucketOf(f.filter_reason);
      buckets[b]++;
      filteredDetail.push({ tag: f.tag, filter_reason: f.filter_reason || "misc", bucket: b, reason: f.reason || "" });
    });
    /* 外援6条·条3（P0-3）：终筛后重算数量与比值（原 returnStats 是终筛前快照，数字失真） */
    returnStats.total = task3.stats ? task3.stats.total : valid.length;
    returnStats.valid = valid.length;
    returnStats.warning = warning.length;
    returnStats.error = error.length;
    returnStats.filtered = filtered.length;
    returnStats.conceptAdded = conceptAdded.length;
    returnStats.actAdded = actAdded.length;
    returnStats.backfilled = backfilled.length;
    var _finalWordCount = valid.length + conceptAdded.length + actAdded.length + backfilled.length;
    var _llmDirect = valid.length;
    returnStats.wordRatio = _llmDirect > 0 ? Math.round((_finalWordCount / _llmDirect) * 100) / 100 : returnStats.wordRatio;
    var _filterRatio = _llmDirect > 0 ? (filtered.length / _llmDirect) : filtered.length;
    var _maxGroup = 0, _maxGroupReason = '';
    Object.keys(buckets).forEach(function (b) {
      if (b === 'misc') return;
      if (buckets[b] > _maxGroup) { _maxGroup = buckets[b]; _maxGroupReason = b; }
    });
    console.assert(returnStats.valid === valid.length, '[P0-3] stats.valid 与数组不同步');
    var _bucketSum = Object.keys(buckets).reduce(function(s,b){return s+buckets[b];},0);
    console.assert(_bucketSum === filtered.length || buckets.misc>0, '[P0-3] 六桶和与 filtered 不一致');
    // 回填到 filterMetrics + stats
    if (!returnStats.filterMetrics) returnStats.filterMetrics = {};
    returnStats.filterMetrics.buckets = buckets;
    returnStats.filterMetrics.filteredCount = filtered.length;
    returnStats.filterMetrics.llmDirectCount = _llmDirect;
    returnStats.filterMetrics.filterRatio = Math.round(_filterRatio * 100) / 100;
    returnStats.filterMetrics.maxGroup = _maxGroup;
    returnStats.filterMetrics.maxGroupReason = _maxGroupReason;
    returnStats.filterMetrics.bTrigger = (_filterRatio > 1.0 || _maxGroup > 15);
    returnStats.filteredDetail = filteredDetail;

    return {
      valid: valid, warning: warning, error: error, filtered: filtered,
      conceptAdded: conceptAdded, actAdded: actAdded, backfilled: backfilled,
      stats: returnStats
    };
  }

  var api = {
    postprocessV2: postprocessV2,
    ENABLED_CONCEPTS: ENABLED_CONCEPTS,
    SYNONYM_GROUPS: SYNONYM_GROUPS,
    BACKFILL_DEFAULTS: BACKFILL_DEFAULTS,
    normKey: normKey
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (global) global.postprocessV2 = api;
})(typeof window !== "undefined" ? window : (typeof globalThis !== "undefined" ? globalThis : this));
