/* 题目生成器
 * 所有题目都从「本单元 / 本模块学过的条目」生成，绝不超纲。
 * 听音类题型在设备没有韩语语音时会自动换成文本题型。
 */

var Quiz = (function () {
  var POOL = { letters: [], rules: [], phrases: [] };

  function shuffle(a) {
    var r = a.slice();
    for (var i = r.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = r[i]; r[i] = r[j]; r[j] = t;
    }
    return r;
  }

  function pickN(arr, n) { return shuffle(arr).slice(0, n); }

  function get(obj, path) {
    return String(path).split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
  }

  function distractors(pool, field, answer, n) {
    var out = [], seen = {};
    seen[answer] = true;
    var arr = shuffle(pool);
    for (var i = 0; i < arr.length && out.length < n; i++) {
      var v = get(arr[i], field);
      if (!v || seen[v]) continue;
      seen[v] = true;
      out.push(v);
    }
    return out;
  }

  function options(pool, field, answer, n) {
    var d = distractors(pool, field, answer, n);
    if (d.length < Math.min(2, n)) return null;
    return shuffle(d.concat([answer]));
  }

  function allItems(mod) {
    var out = [];
    mod.lessons.forEach(function (l) { l.items.forEach(function (it) { out.push(it); }); });
    return out;
  }

  (function buildPool() {
    MODULES.forEach(function (m) {
      var key = m.kind === "letters" ? "letters" : m.kind === "rules" ? "rules" : "phrases";
      allItems(m).forEach(function (it) { POOL[key].push(it); });
    });
  })();

  /* ---------- 字母类 ---------- */

  function letterQuestion(it, kind, audio) {
    if (kind === "listen" && audio) {
      return { type: "choice", prompt: "听发音，选出对应的字母", speak: it.syl, options: options(POOL.letters, "ch", it.ch, 3), answer: it.ch, explain: it.ch + " 读作 " + it.roman + "，例词 " + it.ex.ko + "（" + it.ex.zh + "）" };
    }
    if (kind === "build") {
      var parts = /^[ㄱ-ㅎ]$/.test(it.ch) ? it.ch + " + ㅏ" : "ㅇ + " + it.ch;
      return { type: "choice", prompt: "把 " + parts + " 拼在一起是哪个字？", options: options(POOL.letters, "syl", it.syl, 3), answer: it.syl, explain: parts.replace(" + ", "") + " 拼成 " + it.syl + "，读 " + it.roman };
    }
    if (kind === "word" && audio) {
      return { type: "choice", prompt: "听这个词，选出它的意思", speak: it.ex.ko, options: options(POOL.letters, "ex.zh", it.ex.zh, 3), answer: it.ex.zh, explain: it.ex.ko + " = " + it.ex.zh };
    }
    if (kind === "input") {
      return { type: "input", prompt: "用键盘拼出这个字", sub: it.roman, answer: it.syl, explain: "答案是 " + it.syl + "（" + it.roman + "）" };
    }
    return { type: "choice", prompt: "哪个字母读作 " + it.roman + "？", options: options(POOL.letters, "ch", it.ch, 3), answer: it.ch, explain: it.ch + " 读作 " + it.roman + "。" + it.tip };
  }

  /* ---------- 音变规则类 ---------- */

  function ruleQuestion(it, kind, audio, rule) {
    if (kind === "listen" && audio) {
      return { type: "choice", prompt: "听这个词，选出它实际的读法", speak: it.ko, options: options(POOL.rules, "real", it.real, 3), answer: it.real, explain: it.ko + " → " + it.real + "（" + it.roman + "）：" + it.tip };
    }
    if (kind === "pick") {
      return { type: "choice", prompt: rule ? "下面哪个词会发生这条规则：" + rule : "下面哪个词的实际读音是 " + it.real + "？", options: options(POOL.rules, "ko", it.ko, 3), answer: it.ko, explain: it.ko + " → " + it.real + "：" + it.tip };
    }
    if (kind === "meaning") {
      return { type: "choice", prompt: it.ko + "（" + it.real + "）的意思是？", options: options(POOL.rules, "zh", it.zh, 3), answer: it.zh, explain: it.ko + " = " + it.zh + "，实际读 " + it.real };
    }
    if (kind === "input") {
      return { type: "input", prompt: "写出 " + it.ko + " 的实际读法", sub: it.zh, answer: it.real, explain: it.ko + " → " + it.real + "：" + it.tip };
    }
    return { type: "choice", prompt: it.ko + " 实际怎么读？", options: options(POOL.rules, "real", it.real, 3), answer: it.real, explain: it.ko + " → " + it.real + "：" + it.tip };
  }

  /* ---------- 词句类 ---------- */

  function phraseQuestion(it, kind, audio) {
    if (kind === "listen-zh" && audio) {
      return { type: "choice", prompt: "听一听，选出这句话的意思", speak: it.ko, options: options(POOL.phrases, "zh", it.zh, 3), answer: it.zh, explain: it.ko + " = " + it.zh + "。" + (it.note || "") };
    }
    if (kind === "listen-ko" && audio) {
      return { type: "choice", prompt: "听一听，选出你听到的韩语", speak: it.ko, options: options(POOL.phrases, "ko", it.ko, 3), answer: it.ko, explain: it.ko + " = " + it.zh };
    }
    if (kind === "zh-ko") {
      return { type: "choice", prompt: "「" + it.zh + "」的韩语是？", options: options(POOL.phrases, "ko", it.ko, 3), answer: it.ko, explain: it.ko + "（" + it.roman + "）" + (it.note ? "。" + it.note : "") };
    }
    if (kind === "example") {
      return { type: "choice", prompt: "「" + it.ex.zh + "」这句韩语是？", options: options(POOL.phrases, "ex.ko", it.ex.ko, 3), answer: it.ex.ko, explain: it.ex.ko + " = " + it.ex.zh };
    }
    if (kind === "input") {
      return { type: "input", prompt: "用韩语键盘写出「" + it.zh + "」", sub: "对照：" + (it.ex ? it.ex.zh : it.roman), answer: it.ko, explain: "答案是 " + it.ko + "（" + it.roman + "）" + (it.note ? "。" + it.note : "") };
    }
    return { type: "choice", prompt: it.ko + " 的意思是？", options: options(POOL.phrases, "zh", it.zh, 3), answer: it.zh, explain: it.ko + "（" + it.roman + "）= " + it.zh + (it.note ? "。" + it.note : "") };
  }

  var MAKERS = { letters: letterQuestion, rules: ruleQuestion, phrases: phraseQuestion };

  var KINDS = {
    letters: { choice: ["roman", "build", "listen", "word"], input: ["input"] },
    rules: { choice: ["apply", "listen", "pick", "meaning"], input: ["input"] },
    phrases: { choice: ["ko-zh", "zh-ko", "listen-zh", "listen-ko", "example"], input: ["input"] }
  };

  function build(mod, items, count, audio, rule) {
    var maker = MAKERS[mod.kind === "letters" ? "letters" : mod.kind === "rules" ? "rules" : "phrases"];
    var kinds = KINDS[mod.kind === "letters" ? "letters" : mod.kind === "rules" ? "rules" : "phrases"];
    var usable = kinds.choice.filter(function (k) { return !/^listen/.test(k) || audio; });
    var qs = [];
    var order = shuffle(items).slice(0, count * 2);
    var i = 0, guard = 0;
    while (qs.length < count && guard < count * 12) {
      guard++;
      var it = order[i % order.length];
      var kind = usable[(qs.length + i) % usable.length];
      i++;
      var q = maker(it, kind, audio, rule);
      if (!q || (q.type === "choice" && !q.options)) continue;
      if (qs.some(function (x) { return x.answer === q.answer && x.prompt === q.prompt; })) continue;
      qs.push(q);
    }
    return qs;
  }

  return {
    /* 单元随堂练习：3–5 题，全部来自本单元 */
    lessonQuiz: function (mod, lessonIndex, audio) {
      var lesson = mod.lessons[lessonIndex];
      var items = lesson.items;
      var n = Math.min(5, Math.max(3, items.length));
      var qs = build(mod, items, n, audio, lesson.rule);
      if (mod.kind === "phrases") {
        var inputCount = Math.max(1, Math.round(n * 0.3));
        var maker = MAKERS.phrases;
        for (var k = 0; k < inputCount; k++) {
          var it = pickN(items, 1)[0];
          var q = maker(it, "input", audio);
          if (q && !qs.some(function (x) { return x.type === "input" && x.answer === q.answer; })) qs.push(q);
        }
        qs = shuffle(qs).slice(0, Math.min(6, n + inputCount));
      }
      return qs;
    },

    /* 模块考核：6–10 题，覆盖本模块全部单元 */
    moduleQuiz: function (mod, audio) {
      var items = allItems(mod);
      var n = Math.min(10, Math.max(6, items.length));
      var inputCount = mod.kind === "phrases" ? Math.max(2, Math.round(n * 0.3)) : mod.kind === "letters" ? 2 : 2;
      var choiceCount = n - inputCount;
      var perLesson = shuffle(items);
      var qs = [];

      var byLesson = [];
      mod.lessons.forEach(function (l, idx) { l.items.forEach(function (it) { byLesson.push({ it: it, rule: l.rule, li: idx }); }); });

      var maker = MAKERS[mod.kind === "letters" ? "letters" : mod.kind === "rules" ? "rules" : "phrases"];
      var kinds = KINDS[mod.kind === "letters" ? "letters" : mod.kind === "rules" ? "rules" : "phrases"];
      var usable = kinds.choice.filter(function (k) { return !/^listen/.test(k) || audio; });

      var cursor = 0, guard = 0;
      var usedAnswers = {};
      while (qs.length < choiceCount && guard < choiceCount * 15) {
        guard++;
        var pack = byLesson[(cursor * 7 + qs.length) % byLesson.length];
        cursor++;
        var q = maker(pack.it, usable[(qs.length + cursor) % usable.length], audio, pack.rule);
        if (!q || (q.type === "choice" && !q.options)) continue;
        if (usedAnswers[q.answer + q.prompt]) continue;
        usedAnswers[q.answer + q.prompt] = true;
        qs.push(q);
      }

      var inputItems = shuffle(items);
      for (var i = 0; i < inputCount && i < inputItems.length; i++) {
        var q2 = maker(inputItems[i], "input", audio);
        if (!q2) continue;
        if (qs.some(function (x) { return x.type === "input" && x.answer === q2.answer; })) continue;
        qs.push(q2);
      }

      return shuffle(qs).slice(0, n + 1);
    },

    countFor: function (mod) {
      var items = allItems(mod);
      return Math.min(10, Math.max(6, items.length));
    }
  };
})();
