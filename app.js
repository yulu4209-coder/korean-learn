/* Korean-learn 主逻辑
 * 流程：模块 → 单元（学）→ 单元练习（练）→ 下一单元 → 模块考核（考）→ 结果
 */

var KEY = "korean-learn-state-v2";
var themes = ["rose", "mint", "sky", "apricot"];

function freshState() {
  return {
    v: 2,
    current: 1,
    completed: [],
    scores: {},
    attempts: {},
    practiced: {},
    mistakes: [],
    dailyMinutes: 0,
    lastDate: "",
    lang: "zh",
    scheme: "system",
    theme: themes[Math.floor(Math.random() * themes.length)],
    onboarding: true,
    ttsNotice: false
  };
}

var state;
try {
  var raw = JSON.parse(localStorage.getItem(KEY) || "null");
  state = raw && raw.v === 2 ? Object.assign(freshState(), raw) : freshState();
} catch (e) { state = freshState(); }

var view = "home";
var moduleId = state.current;
var lessonIndex = 0;
var practice = null;
var quiz = null;
var lastResult = null;

function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]; }); }
function t(zh, ko) { return state.lang === "ko" ? ko : zh; }
function norm(s) { return String(s == null ? "" : s).trim().replace(/\s+/g, ""); }

function moduleOf(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; return MODULES[0]; }
function currentModule() { return moduleOf(state.current); }
function isPassed(id) { return state.completed.indexOf(id) >= 0; }
function isLocked(m) { return !isPassed(m.id) && m.id > state.current; }
function audioReady() { return Speech.hasKorean(); }

function applyTheme() {
  var root = document.documentElement;
  root.dataset.theme = state.theme === "rose" ? "" : state.theme;
  root.dataset.scheme = state.scheme === "system"
    ? (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : state.scheme;
}

function today() { return new Date().toISOString().slice(0, 10); }
function addMinutes(n) {
  var d = today();
  if (state.lastDate !== d) { state.dailyMinutes = 0; state.lastDate = d; }
  state.dailyMinutes += n;
  save();
}

function markPracticed(mid, li) {
  var arr = state.practiced[mid] || (state.practiced[mid] = []);
  if (arr.indexOf(li) < 0) arr.push(li);
  save();
}
function practicedCount(mid) { return (state.practiced[mid] || []).length; }
function allPracticed(mid) { return practicedCount(mid) >= moduleOf(mid).lessons.length; }
function retryLocked(mid) {
  var a = state.attempts[mid];
  return !!(a && a.locked) && !allPracticed(mid);
}

function pushMistake(word) {
  if (!word) return;
  var i = state.mistakes.indexOf(word);
  if (i >= 0) state.mistakes.splice(i, 1);
  state.mistakes.push(word);
  if (state.mistakes.length > 40) state.mistakes = state.mistakes.slice(-40);
  save();
}

function speak(text) {
  if (!Speech.supported()) { alert(t("这个浏览器不支持语音合成，建议换用 Edge 或 Chrome。", "이 브라우저는 음성 합성을 지원하지 않습니다.")); return; }
  Speech.speak(text);
}

/* ---------------- 顶部提示条 ---------------- */

function notices() {
  var out = "";
  if (state.onboarding) {
    out += '<div class="notice-bar"><span>' +
      t("学习路径是「学 → 练 → 考」：每个单元学完立刻练习，全部练完才能参加模块考核。答题需要用韩语时，页面会提供内置键盘，无需安装输入法。",
        "학습 → 연습 → 평가 순서입니다. 한국어 입력이 필요하면 화면 키보드가 나타납니다.") +
      '</span><button class="icon-btn" data-action="dismiss-onboarding" aria-label="关闭">×</button></div>';
  }
  if (!state.ttsNotice && Speech.ready() && !Speech.hasKorean()) {
    out += '<div class="notice-bar warn"><span>' +
      t("这台设备没有检测到韩语语音，听音题已自动换成看文字作答。如需听力练习，请在系统设置中安装韩语语音包（iOS：设置 → 辅助功能 → 朗读内容 → 声音；Windows：设置 → 时间和语言 → 语音）。",
        "기기에 한국어 음성이 없어 듣기 문제를 글로 바꿨습니다.") +
      '</span><button class="icon-btn" data-action="dismiss-tts" aria-label="关闭">×</button></div>';
  }
  return out;
}

function nav() {
  var cur = view === "home" || view === "module" || view === "lesson" || view === "practice" || view === "assessment" || view === "result";
  return '<header class="topbar"><div class="brand"><span class="brand-mark">ㅎ</span><span>Korean-learn</span></div>' +
    '<nav class="nav">' +
    '<button class="' + (cur ? "active" : "") + '" data-nav="home">' + t("学习", "학습") + "</button>" +
    '<button class="' + (view === "progress" ? "active" : "") + '" data-nav="progress">' + t("进度", "진도") + "</button>" +
    '<button class="' + (view === "settings" ? "active" : "") + '" data-nav="settings">' + t("设置", "설정") + "</button>" +
    "</nav></header>";
}

/* ---------------- 首页 ---------------- */

function viewHome() {
  var m = currentModule();
  var done = state.completed.length;
  var pct = Math.round(done / MODULES.length * 100);
  var mPct = Math.round(practicedCount(m.id) / m.lessons.length * 100);

  var html = '<main>' +
    '<section class="hero card">' +
      '<div class="eyebrow">' + t("从四十音开始，一步步到能开口", "사십음부터 말할 수 있을 때까지") + "</div>" +
      "<h1>" + t("今天，学会一句真正能说出口的韩语。", "오늘, 정말로 말할 수 있는 한국어 한 마디를 배우세요.") + "</h1>" +
      '<p class="muted">' + t("每个单元都是「学 → 练」，全部练完才能参加模块考核；考核题目只出本模块学过的内容。", "모든 단원은 학습 후 바로 연습하며, 평가 문제는 배운 내용에서만 나옵니다.") + "</p>" +
      '<div class="hero-actions">' +
        '<button class="btn primary" data-action="continue">' + t("继续学习", "계속 학습") + "</button>" +
        '<button class="btn" data-action="install-help">' + t("离线使用说明", "오프라인 안내") + "</button>" +
      "</div>" +
    "</section>";

  html += '<section class="section"><div class="section-head"><h2>' + t("今日学习", "오늘의 학습") + '</h2><span class="muted small">' + t("目标 10 分钟", "목표 10분") + "</span></div>" +
    '<div class="today card"><div>' +
      "<h3>" + esc(m.title) + "</h3>" +
      '<p class="muted small">' + esc(m.desc) + " · " + t("及格线", "통과선") + " " + m.threshold + t("分", "점") + "</p>" +
`      <div class="progress-track"><span style="width:${mPct}%"></span></div>` +
      '<p class="muted small" style="margin:8px 0 0">' + t("单元练习", "단원 연습") + " " + practicedCount(m.id) + "/" + m.lessons.length + "</p>" +
    "</div>" +
    '<div class="ring" style="--progress:' + Math.min(100, state.dailyMinutes * 10) + '%"><b>' + state.dailyMinutes + t("分", "분") + "</b></div>" +
    "</div></section>";

  html += '<section class="section"><div class="section-head"><h2>' + t("学习路径", "학습 경로") + '</h2><span class="muted small">' + done + "/" + MODULES.length + " " + t("已通过", "통과") + "</span></div>" +
    '<div class="module-grid">' + MODULES.map(moduleCard).join("") + "</div></section>";

  html += `<section class="section"><div class="progress-track"><span style="width:${pct}%"></span></div>` +
    `<p class="muted small" style="margin:8px 0 0">总进度 ${pct}%</p></section>`;

  return html + "</main>";
}

function moduleCard(m) {
  var locked = isLocked(m);
  var passed = isPassed(m.id);
  var badge = passed ? t("已通过", "통과") : locked ? t("待解锁", "잠김") : t("进行中", "학습 중");
  var score = state.scores[m.id];
  return '<article class="module card ' + (locked ? "locked" : "") + '" data-module="' + m.id + '">' +
    '<div class="module-number">MODULE ' + m.id + "</div>" +
    '<h3 class="module-title">' + esc(m.title) + "</h3>" +
    '<p class="muted small">' + esc(m.desc) + "</p>" +
    '<div class="module-meta"><span>' + m.lessons.length + " " + t("个单元", "단원") + "</span><span>" + t("及格线", "통과선") + " " + m.threshold + "</span></div>" +
    '<div class="module-foot"><span class="badge">' + badge + "</span>" +
      (score != null ? '<span class="muted small">' + t("最佳", "최고") + " " + score + t("分", "점") + "</span>" : "") +
    "</div></article>";
}

/* ---------------- 模块页 ---------------- */

function viewModule() {
  var m = moduleOf(moduleId);
  var passed = isPassed(m.id);
  var locked = retryLocked(m.id);
  var practiced = practicedCount(m.id);
  var canExam = passed || allPracticed(m.id);

  var html = '<main><section class="card lesson">' +
    '<div class="lesson-top"><button class="btn ghost" data-nav="home">← ' + t("返回", "뒤로") + "</button>" +
    '<span class="muted small">MODULE ' + m.id + " · " + t("及格线", "통과선") + " " + m.threshold + t("分", "점") + "</span></div>" +
    '<div class="eyebrow">' + esc(m.desc) + "</div>" +
    "<h1>" + esc(m.title) + "</h1>";

  html += '<div class="meta-row">' +
    '<span class="chip">' + t("单元练习", "단원 연습") + " " + practiced + "/" + m.lessons.length + "</span>" +
    (passed ? '<span class="chip good">' + t("已通过", "통과") + "</span>" : "") +
    (locked ? '<span class="chip warn">' + t("需重做单元练习", "연습을 다시 해야 합니다") + "</span>" : "") +
    "</div>";

  html += '<div class="unit-list">' + m.lessons.map(function (l, i) {
    var done = (state.practiced[m.id] || []).indexOf(i) >= 0;
    return '<button class="unit-item' + (done ? " done" : "") + '" data-lesson="' + i + '">' +
      '<span class="unit-no">' + (i + 1) + "</span>" +
      '<span class="unit-body"><strong>' + esc(l.title) + "</strong>" +
      '<span class="muted small">' + esc(l.sub || "") + " · " + l.items.length + " " + t("条", "개") + "</span></span>" +
      '<span class="unit-flag">' + (done ? "✓" : "") + "</span></button>";
  }).join("") + "</div>";

  if (locked) {
    html += '<div class="notice">' + t("上次考核没通过。把本模块每个单元的练习重做一遍，就能再次考核。", "지난 평가를 통과하지 못했습니다. 단원 연습을 다시 하면 재응시할 수 있습니다.") + "</div>";
  }

  html += '<div class="actions">' +
    (canExam
      ? '<button class="btn primary" data-action="start-exam">' + (passed ? t("重新考核", "다시 평가") : t("开始模块考核", "모듈 평가 시작")) + "</button>"
      : '<button class="btn" disabled>' + t("完成全部单元练习后解锁考核", "모든 단원 연습을 마치면 열립니다") + "</button>") +
    "</div>";

  return html + "</section></main>";
}

/* ---------------- 单元学习页 ---------------- */

function itemCard(m, it) {
  if (m.kind === "letters") {
    return '<div class="item-card letter">' +
      '<div class="letter-head"><div class="letter-big">' + esc(it.ch) + "</div>" +
        '<div class="letter-side"><div class="letter-syl">' + esc(it.syl) + "</div>" +
        '<div class="roman">' + esc(it.roman) + "</div>" +
        '<button class="speaker" data-speak="' + esc(it.syl) + '" aria-label="播放">▶</button></div></div>' +
      '<div class="item-tip">' + esc(it.tip) + "</div>" +
      '<div class="item-ex"><span class="korean">' + esc(it.ex.ko) + '</span><span class="muted"> ' + esc(it.ex.zh) + "</span>" +
        '<button class="speaker small" data-speak="' + esc(it.ex.ko) + '" aria-label="播放">▶</button></div>' +
      "</div>";
  }
  if (m.kind === "rules") {
    return '<div class="item-card rule">' +
      '<div class="rule-pair"><span class="from">' + esc(it.ko) + '</span><span class="arrow">→</span><span class="to korean">' + esc(it.real) + "</span>" +
        '<button class="speaker" data-speak="' + esc(it.ko) + '" aria-label="播放">▶</button></div>' +
      '<div class="item-sub"><span class="roman">' + esc(it.roman) + "</span><span> · " + esc(it.zh) + "</span></div>" +
      '<div class="item-tip">' + esc(it.tip) + "</div>" +
      "</div>";
  }
  return '<div class="item-card word">' +
    '<div class="korean word-ko">' + esc(it.ko) + '<button class="speaker" data-speak="' + esc(it.ko) + '" aria-label="播放">▶</button></div>' +
    '<div class="roman">' + esc(it.roman) + "</div>" +
    '<div class="word-zh">' + esc(it.zh) + "</div>" +
    (it.note ? '<div class="item-tip">' + esc(it.note) + "</div>" : "") +
    (it.ex ? '<div class="item-ex"><span class="korean">' + esc(it.ex.ko) + '</span><span class="muted"> ' + esc(it.ex.zh) + "</span>" +
      '<button class="speaker small" data-speak="' + esc(it.ex.ko) + '" aria-label="播放">▶</button></div>' : "") +
    "</div>";
}

function viewLesson() {
  var m = moduleOf(moduleId);
  var l = m.lessons[lessonIndex];
  var done = (state.practiced[m.id] || []).indexOf(lessonIndex) >= 0;
  var isLast = lessonIndex + 1 >= m.lessons.length;

  var html = '<main><section class="card lesson">' +
    '<div class="lesson-top"><button class="btn ghost" data-action="back-module">← ' + t("单元列表", "단원 목록") + "</button>" +
    '<span class="muted small">' + m.lessons.length + " " + t("个单元中第", "개 중") + " " + (lessonIndex + 1) + " " + t("个", "번째") + "</span></div>" +
    '<div class="eyebrow">' + esc(l.sub || "") + "</div>" +
    "<h1>" + esc(l.title) + "</h1>" +
    '<p class="muted">' + esc(l.intro) + "</p>";

  if (l.rule) html += '<div class="rule-box"><strong>' + t("规则", "규칙") + "</strong> " + esc(l.rule) + "</div>";

  html += '<div class="item-grid kind-' + m.kind + '">' + l.items.map(function (it) { return itemCard(m, it); }).join("") + "</div>";

  if (m.kind === "letters") {
    html += '<div class="pronunciation"><strong>' + t("拼读提示：", "조합 팁: ") + "</strong>" +
      t("韩文字母按「初声 + 中声（+ 终声）」从左到右、从上到下拼成一个方块字。用内置键盘打字时，也是按这个顺序逐块拼出来的。",
        "한글은 초성+중성(+종성) 순서로 한 칸에 모입니다.") + "</div>";
  }

  html += '<div class="actions">' +
    '<button class="btn" data-action="prev-lesson"' + (lessonIndex === 0 ? " disabled" : "") + ">" + t("上一单元", "이전 단원") + "</button>" +
    '<button class="btn primary" data-action="start-practice">' + (done ? t("再做一次练习", "연습 다시 하기") : t("开始练习", "연습 시작")) + "</button>" +
    (isLast ? "" : '<button class="btn ghost" data-action="next-lesson">' + t("下一单元", "다음 단원") + "</button>") +
    "</div></section></main>";

  return html;
}

/* ---------------- 练习 / 考核 通用题面 ---------------- */

function questionBlock(q, ctx) {
  var head = '<div class="q-head">' +
    '<span class="muted small">' + esc(ctx) + "</span>" +
    '<span class="muted small">' + t("第", "") + " " + (q.index + 1) + " / " + q.total + "</span></div>" +
    '<div class="q-prompt">' + esc(q.prompt);
  if (q.speak) head += '<button class="speaker" data-speak="' + esc(q.speak) + '" aria-label="播放">▶</button>';
  head += "</div>";
  if (q.sub) head += '<div class="q-sub muted small">' + esc(q.sub) + "</div>";
  return head;
}

function viewPractice() {
  var m = moduleOf(practice.mid);
  var l = m.lessons[practice.li];

  if (practice.finished) {
    var total = practice.questions.length;
    var ok = practice.correct >= total;
    return '<main><section class="card lesson">' +
      '<div class="eyebrow">' + t("单元练习完成", "단원 연습 완료") + "</div>" +
      "<h1>" + practice.correct + " / " + total + "</h1>" +
      '<p class="muted">' + (ok ? t("全部答对，这个单元过关了。", "전부 맞았습니다.") : t("答错的题看一遍解析，印象会更深。", "틀린 문제의 해설을 확인하세요.")) + "</p>" +
      '<div class="actions">' +
        '<button class="btn" data-action="re-practice">' + t("再练一次", "다시 연습") + "</button>" +
        (practice.li + 1 < m.lessons.length
          ? '<button class="btn primary" data-action="next-lesson">' + t("下一单元", "다음 단원") + "</button>"
          : '<button class="btn primary" data-action="back-module">' + t("返回单元列表", "단원 목록으로") + "</button>") +
      "</div></section></main>";
  }

  var q = practice.questions[practice.index];
  q.index = practice.index;
  q.total = practice.questions.length;

  var body;
  if (q.type === "input") {
    body = '<input class="answer-input korean" id="answer" readonly inputmode="none" placeholder="' + t("点这里，用内置韩语键盘输入", "여기를 눌러 한글 키보드로 입력") + '" value="' + esc(practice.typed || "") + '" />' +
      '<div class="actions"><button class="btn primary" data-action="submit-input">' + t("提交", "제출") + "</button></div>";
  } else {
    body = '<div class="option-list">' + q.options.map(function (o) {
      return '<button class="quiz-option" data-answer="' + esc(o) + '">' + esc(o) + "</button>";
    }).join("") + "</div>";
  }

  return '<main><section class="card lesson">' +
    '<div class="lesson-top"><button class="btn ghost" data-action="back-module">' + t("退出练习", "연습 종료") + "</button>" +
    '<span class="muted small">' + esc(l.title) + " · " + t("随堂练习", "연습") + "</span></div>" +
    questionBlock(q, m.title + " · " + l.title) +
    body +
    '<div id="feedback" class="feedback" aria-live="polite"></div>' +
    '<div class="actions" id="practice-next" style="display:none">' +
      '<button class="btn primary" data-action="next-question">' + t("下一题", "다음 문제") + "</button></div>" +
    "</section></main>";
}

function viewAssessment() {
  var m = moduleOf(quiz.mid);
  var q = quiz.questions[quiz.index];
  q.index = quiz.index;
  q.total = quiz.questions.length;

  var body;
  if (q.type === "input") {
    body = '<input class="answer-input korean" id="answer" readonly inputmode="none" placeholder="' + t("点这里，用内置韩语键盘输入", "여기를 눌러 한글 키보드로 입력") + '" value="' + esc(quiz.typed || "") + '" />' +
      '<div class="actions"><button class="btn primary" data-action="submit-input">' + t("提交答案", "답 제출") + "</button></div>";
  } else {
    body = '<div class="option-list">' + q.options.map(function (o) {
      return '<button class="quiz-option" data-answer="' + esc(o) + '">' + esc(o) + "</button>";
    }).join("") + "</div>";
  }

  var pct = Math.round(quiz.index / quiz.questions.length * 100);

  return '<main><section class="card lesson">' +
    '<div class="lesson-top"><button class="btn ghost" data-action="quit-exam">' + t("退出考核", "평가 종료") + "</button>" +
    '<span class="muted small">' + t("模块考核", "모듈 평가") + " · " + t("及格线", "통과선") + " " + m.threshold + "</span></div>" +
    `<div class="progress-track" style="margin-bottom:14px"><span style="width:${pct}%"></span></div>` +
    questionBlock(q, m.title) +
    body +
    '<div id="feedback" class="feedback" aria-live="polite"></div>' +
    "</section></main>";
}

function viewResult() {
  var m = moduleOf(lastResult.mid);
  var pass = lastResult.pass;
  var html = '<main><section class="card lesson">' +
    '<div class="eyebrow">' + (pass ? t("模块通过", "모듈 통과") : t("再复习一次", "다시 복습")) + "</div>" +
    "<h1>" + lastResult.score + " " + t("分", "점") + "</h1>" +
    '<p class="muted">' + t("及格线", "통과선") + " " + m.threshold + " " + t("分", "점") + " · " +
      t("答对", "정답") + " " + lastResult.correct + " / " + lastResult.total + "</p>" +
    `<div class="progress-track" style="margin:14px 0"><span style="width:${Math.min(100, lastResult.score)}%"></span></div>`;

  html += '<p class="muted">' + (pass
    ? t("你已达到本模块的掌握标准，下一模块现在解锁。", "다음 모듈이 열렸습니다.")
    : t("没通过的题目已加入复习清单。把本模块各单元的练习重做一遍后，就可以再次考核。", "틀린 항목이 복습 목록에 추가되었습니다. 단원 연습을 다시 하면 재응시할 수 있습니다.")) + "</p>";

  html += '<div class="actions">' +
    (pass
      ? '<button class="btn primary" data-action="back-home">' + t("回到学习", "학습으로") + "</button>"
      : '<button class="btn primary" data-action="back-module">' + t("去复习单元", "단원 복습하러") + "</button>") +
    '<button class="btn" data-nav="progress">' + t("查看进度", "진도 보기") + "</button>" +
    "</div></section></main>";
  return html;
}

/* ---------------- 进度页 ---------------- */

function viewProgress() {
  var pct = Math.round(state.completed.length / MODULES.length * 100);
  var mistakes = state.mistakes.slice(-8).reverse();

  var html = '<main><section class="hero card">' +
    '<div class="eyebrow">' + t("你的学习足迹", "학습 기록") + "</div>" +
    "<h1>" + pct + "% " + t("已完成", "완료") + "</h1>" +
    `<div class="progress-track"><span style="width:${pct}%"></span></div>` +
    "</section>";

  html += '<section class="section stat-grid">' +
    '<article class="stat card"><span class="muted small">' + t("已通过模块", "통과한 모듈") + "</span><strong>" + state.completed.length + " / " + MODULES.length + "</strong></article>" +
    '<article class="stat card"><span class="muted small">' + t("今日学习", "오늘 학습") + "</span><strong>" + state.dailyMinutes + " " + t("分钟", "분") + "</strong></article>" +
    '<article class="stat card"><span class="muted small">' + t("待复习", "복습할 항목") + "</span><strong>" + state.mistakes.length + "</strong></article>" +
    "</section>";

  html += '<section class="section card lesson"><h2>' + t("模块成绩", "모듈 성적") + "</h2>" +
    '<div class="score-list">' + MODULES.map(function (m) {
      var s = state.scores[m.id];
      var passed = isPassed(m.id);
      return '<div class="score-row"><span>' + esc(m.title) + "</span>" +
        '<span class="muted small">' + (s != null ? s + t("分", "점") : "—") + "</span>" +
        '<span class="badge ' + (passed ? "good" : "") + '">' + (passed ? t("已通过", "통과") : t("未通过", "미통과")) + "</span></div>";
    }).join("") + "</div></section>";

  html += '<section class="section card lesson"><h2>' + t("需要复习", "복습할 항목") + "</h2>";
  html += mistakes.length
    ? '<ul class="mistake-list">' + mistakes.map(function (w) {
        return '<li><span class="korean">' + esc(w) + '</span><button class="speaker" data-speak="' + esc(w) + '">▶</button></li>';
      }).join("") + "</ul>"
    : '<div class="empty muted">' + t("答错的条目会自动出现在这里。", "틀린 항목이 여기에 표시됩니다.") + "</div>";
  return html + "</section></main>";
}

/* ---------------- 设置页 ---------------- */

function viewSettings() {
  var voice = Speech.hasKorean() ? Speech.voiceName() : t("未检测到韩语语音", "한국어 음성 없음");
  return '<main><section class="settings card"><h1>' + t("设置", "설정") + "</h1>" +
    '<div class="setting-row"><div><h3>' + t("界面语言", "표시 언어") + '</h3><span class="muted small">' + t("界面文案可切换中韩；课程讲解保持中文。", "설명은 중국어로 유지됩니다.") + "</span></div>" +
      '<div class="segmented"><button data-lang="zh" class="' + (state.lang === "zh" ? "active" : "") + '">中文</button>' +
      '<button data-lang="ko" class="' + (state.lang === "ko" ? "active" : "") + '">한국어</button></div></div>' +

    '<div class="setting-row"><div><h3>' + t("显示模式", "화면 모드") + '</h3><span class="muted small">' + t("默认跟随系统，也可手动选择。", "기본은 시스템 설정입니다.") + "</span></div>" +
      '<div class="segmented"><button data-scheme="system" class="' + (state.scheme === "system" ? "active" : "") + '">' + t("自动", "자동") + "</button>" +
      '<button data-scheme="light" class="' + (state.scheme === "light" ? "active" : "") + '">' + t("浅色", "밝게") + "</button>" +
      '<button data-scheme="dark" class="' + (state.scheme === "dark" ? "active" : "") + '">' + t("深色", "어둡게") + "</button></div></div>" +

    '<div class="setting-row"><div><h3>' + t("主题色", "테마 색") + '</h3><span class="muted small">' + t("每次打开会随机选择一套协调配色。", "열 때마다 색상이 바뀝니다.") + "</span></div>" +
      '<button class="btn" data-action="new-theme">' + t("换一种", "바꾸기") + "</button></div>" +

    '<div class="setting-row"><div><h3>' + t("发音语音", "발음 음성") + '</h3><span class="muted small">' + esc(voice) + "</span></div>" +
      '<button class="btn" data-action="test-voice">' + t("试听", "들어보기") + "</button></div>" +

    '<div class="setting-row"><div><h3>' + t("应用更新", "앱 업데이트") + '</h3><span class="muted small">' + t("如果看到的还是旧版本，点这里清掉缓存重新加载。", "이전 버전이 보이면 눌러 새로 불러오세요.") + "</span></div>" +
      '<button class="btn" data-action="force-update">' + t("强制刷新", "새로 불러오기") + "</button></div>" +

    '<div class="setting-row"><div><h3>' + t("本机数据", "내 기기 데이터") + '</h3><span class="muted small">' + t("学习进度仅保存在当前浏览器。", "학습 기록은 이 브라우저에만 저장됩니다.") + "</span></div>" +
      '<button class="btn danger" data-action="reset">' + t("重置进度", "초기화") + "</button></div>" +
    "</section></main>";
}

/* ---------------- 渲染与事件 ---------------- */

function applyHash() {
  var h = (location.hash || "").slice(1);
  if (!h) return;
  var p = {};
  h.split("&").forEach(function (kv) {
    var kv2 = kv.split("=");
    p[kv2[0]] = kv2[1];
  });
  if (p.view) view = p.view;
  if (p.module) moduleId = Number(p.module);
  if (p.lesson) lessonIndex = Number(p.lesson);
  if (p.mid) moduleId = Number(p.mid);
}

function render() {
  applyTheme();
  try { applyHash(); } catch (e) { console.error('hash', e); }

  // 直接通过 URL hash 跳到练习/考核时，对应状态为 null → 现场初始化（必须在 view 函数前）
  if (view === "practice" && !practice && moduleId && Number.isInteger(lessonIndex)) {
    var pm = moduleOf(moduleId);
    if (pm) { practice = { mid: moduleId, li: lessonIndex, index: 0, correct: 0, typed: "", answered: false, finished: false, questions: Quiz.lessonQuiz(pm, lessonIndex, audioReady()) }; }
  }
  if (view === "assessment" && !quiz && moduleId) {
    var qm = moduleOf(moduleId);
    if (qm) { quiz = { mid: moduleId, index: 0, correct: 0, typed: "", answered: false, questions: Quiz.moduleQuiz(qm, audioReady()) }; }
  }

  var content;
  try {
    if (view === "home") content = viewHome();
    else if (view === "module") content = viewModule();
    else if (view === "lesson") content = viewLesson();
    else if (view === "practice") content = viewPractice();
    else if (view === "assessment") content = viewAssessment();
    else if (view === "result") content = viewResult();
    else if (view === "progress") content = viewProgress();
    else content = viewSettings();
  } catch (e) {
    content = '<main><section class="card"><h1>页面错误</h1><pre style="white-space:pre-wrap;color:#b00">' + esc(e.stack || (e.message + '\n' + (e.lineNumber||'') + ':' + (e.columnNumber||''))) + '</pre></section></main>';
  }

  document.getElementById("app").innerHTML = '<div class="shell">' + notices() + nav() + content + "</div>";
  attach();
  window.scrollTo(0, 0);
}

function showFeedback(cls, text, explain) {
  var fb = document.getElementById("feedback");
  if (!fb) return;
  fb.className = "feedback " + cls;
  fb.innerHTML = esc(text) + (explain ? '<div class="explain muted small">' + esc(explain) + "</div>" : "");
}

function lockOptions(correct, chosen) {
  document.querySelectorAll("[data-answer]").forEach(function (b) {
    b.disabled = true;
    if (b.dataset.answer === correct) b.classList.add("correct");
    else if (b.dataset.answer === chosen) b.classList.add("wrong");
  });
}

function openKeyboardIfNeeded() {
  var input = document.getElementById("answer");
  if (!input) return;
  HangulKeyboard.open({ input: input, onSubmit: function () { submitTyped(); } });
}

function submitTyped() {
  var input = document.getElementById("answer");
  if (!input) return;
  HangulKeyboard.close();
  answerQuestion(input.value);
}

function answerQuestion(value) {
  if (view === "practice") {
    var q = practice.questions[practice.index];
    var ok = norm(value) === norm(q.answer);
    practice.typed = value;
    if (ok) { practice.correct++; showFeedback("good", t("正确！", "맞았습니다!"), q.explain); }
    else { pushMistake(q.answer); showFeedback("bad", t("正确答案：", "정답: ") + q.answer, q.explain); }
    if (q.type === "choice") lockOptions(q.answer, value);
    var next = document.getElementById("practice-next");
    if (next) next.style.display = "flex";
    practice.answered = true;
  } else if (view === "assessment") {
    var aq = quiz.questions[quiz.index];
    var okA = norm(value) === norm(aq.answer);
    quiz.typed = value;
    if (okA) { quiz.correct++; showFeedback("good", t("正确！", "맞았습니다!"), aq.explain); }
    else { pushMistake(aq.answer); showFeedback("bad", t("正确答案：", "정답: ") + aq.answer, aq.explain); }
    if (aq.type === "choice") lockOptions(aq.answer, value);
    quiz.answered = true;
    setTimeout(function () { nextAssessment(); }, 1400);
  }
}

function nextPractice() {
  practice.typed = "";
  practice.answered = false;
  practice.index++;
  if (practice.index >= practice.questions.length) {
    markPracticed(practice.mid, practice.li);
    addMinutes(5);
    practice.finished = true;
  }
  render();
}

function nextAssessment() {
  quiz.typed = "";
  quiz.answered = false;
  quiz.index++;
  if (quiz.index >= quiz.questions.length) finishAssessment();
  else render();
}

function finishAssessment() {
  var m = moduleOf(quiz.mid);
  var total = quiz.questions.length;
  var score = Math.round(quiz.correct / total * 100);
  var pass = score >= m.threshold;

  var prev = state.scores[quiz.mid];
  if (pass) {
    if (prev == null || score > prev) state.scores[quiz.mid] = score;
    if (!isPassed(quiz.mid)) state.completed.push(quiz.mid);
    if (quiz.mid === state.current) state.current = Math.min(MODULES.length, quiz.mid + 1);
    state.attempts[quiz.mid] = { locked: false, last: score };
  } else {
    state.scores[quiz.mid] = prev == null ? score : Math.max(prev, score);
    state.attempts[quiz.mid] = { locked: true, last: score };
    state.practiced[quiz.mid] = [];
  }

  addMinutes(5);
  save();
  lastResult = { mid: quiz.mid, score: score, pass: pass, correct: quiz.correct, total: total };
  moduleId = quiz.mid;
  quiz = null;
  view = "result";
  render();
}

function attach() {
  document.querySelectorAll("[data-nav]").forEach(function (b) {
    b.onclick = function () {
      HangulKeyboard.close();
      view = b.dataset.nav;
      if (view === "home") moduleId = state.current;
      render();
    };
  });

  document.querySelectorAll("[data-speak]").forEach(function (b) {
    b.onclick = function (e) { e.stopPropagation(); speak(b.dataset.speak); };
  });

  document.querySelectorAll("[data-module]").forEach(function (b) {
    b.onclick = function () {
      var id = Number(b.dataset.module);
      if (isLocked(moduleOf(id))) return;
      moduleId = id;
      view = "module";
      render();
    };
  });

  document.querySelectorAll("[data-lesson]").forEach(function (b) {
    b.onclick = function () { lessonIndex = Number(b.dataset.lesson); view = "lesson"; render(); };
  });

  document.querySelectorAll("[data-answer]").forEach(function (b) {
    b.onclick = function () {
      if (view === "practice" && practice.answered) return;
      if (view === "assessment" && quiz.answered) return;
      answerQuestion(b.dataset.answer);
    };
  });

  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.onclick = function () { state.lang = b.dataset.lang; save(); render(); };
  });

  document.querySelectorAll("[data-scheme]").forEach(function (b) {
    b.onclick = function () { state.scheme = b.dataset.scheme; save(); render(); };
  });

  var input = document.getElementById("answer");
  if (input) {
    input.onclick = function () { openKeyboardIfNeeded(); };
    input.onfocus = function () { openKeyboardIfNeeded(); };
    // 进入 input 题时自动弹出内置键盘（用户点过 input 之后也能再次点击唤起）
    if (view === "practice" || view === "assessment") {
      setTimeout(function () { try { openKeyboardIfNeeded(); } catch (e) {} }, 0);
    }
  }

  var act = function (name, fn) {
    var el = document.querySelector('[data-action="' + name + '"]');
    if (el) el.onclick = fn;
  };

  act("continue", function () { moduleId = state.current; view = "module"; render(); });
  act("back-home", function () { view = "home"; moduleId = state.current; render(); });
  act("back-module", function () { HangulKeyboard.close(); practice = null; view = "module"; render(); });
  act("quit-exam", function () { HangulKeyboard.close(); quiz = null; view = "module"; render(); });
  act("prev-lesson", function () { if (lessonIndex > 0) lessonIndex--; render(); });
  act("next-lesson", function () {
    var m = moduleOf(moduleId);
    HangulKeyboard.close();
    if (lessonIndex + 1 < m.lessons.length) { lessonIndex++; view = "lesson"; }
    else view = "module";
    practice = null;
    render();
  });

  act("start-practice", function () {
    var m = moduleOf(moduleId);
    practice = { mid: moduleId, li: lessonIndex, index: 0, correct: 0, typed: "", answered: false, finished: false, questions: Quiz.lessonQuiz(m, lessonIndex, audioReady()) };
    view = "practice";
    render();
  });
  act("re-practice", function () {
    var m = moduleOf(moduleId);
    practice = { mid: moduleId, li: lessonIndex, index: 0, correct: 0, typed: "", answered: false, finished: false, questions: Quiz.lessonQuiz(m, lessonIndex, audioReady()) };
    render();
  });
  act("next-question", function () { nextPractice(); });
  act("submit-input", function () { submitTyped(); });

  act("start-exam", function () {
    var m = moduleOf(moduleId);
    quiz = { mid: moduleId, index: 0, correct: 0, typed: "", answered: false, questions: Quiz.moduleQuiz(m, audioReady()) };
    view = "assessment";
    render();
  });

  act("dismiss-onboarding", function () { state.onboarding = false; save(); render(); });
  act("dismiss-tts", function () { state.ttsNotice = true; save(); render(); });

  act("new-theme", function () {
    state.theme = themes[(themes.indexOf(state.theme) + 1) % themes.length];
    save();
    render();
  });

  act("test-voice", function () { speak("안녕하세요"); });

  /* 强制刷新：注销所有 Service Worker + 清空缓存后重新加载，彻底摆脱旧版本 */
  act("force-update", function () {
    var done = function () { location.reload(); };
    if (!("serviceWorker" in navigator)) return done();
    navigator.serviceWorker.getRegistrations()
      .then(function (regs) { return Promise.all(regs.map(function (r) { return r.unregister(); })); })
      .then(function () { return window.caches ? caches.keys() : []; })
      .then(function (keys) { return Promise.all(keys.map(function (k) { return caches.delete(k); })); })
      .then(done, done);
  });

  act("reset", function () {
    if (confirm(t("确定重置当前浏览器中的所有学习记录吗？此操作无法撤销。", "모든 학습 기록을 초기화할까요? 되돌릴 수 없습니다."))) {
      state = freshState();
      save();
      moduleId = state.current;
      lessonIndex = 0;
      practice = null;
      quiz = null;
      view = "home";
      render();
    }
  });

  act("install-help", function () {
    alert(t("离线使用：首次打开后，在浏览器菜单中选择“安装应用”或“添加到主屏幕”。答题时页面会提供内置韩语键盘，不需要在系统里安装韩语输入法。学习进度只保存在当前浏览器。",
      "브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요."));
  });
}

/* Service Worker：注册 + 检测到新版本后自动刷新一次。
   旧版本是"缓存优先"，会导致上传新版后手机上一直显示旧页面；
   这里保证新版 SW 一就绪就立刻切换到新内容，不用手动清缓存。 */
var SW_VERSION = "v4";
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js?ver=" + SW_VERSION).then(function (reg) {
      reg.update();
      reg.addEventListener("updatefound", function () {
        var sw = reg.installing;
        if (!sw) return;
        sw.addEventListener("statechange", function () {
          if (sw.state === "installed" && navigator.serviceWorker.controller) location.reload();
        });
      });
    }).catch(function () {});
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden || !navigator.serviceWorker.controller) return;
    navigator.serviceWorker.getRegistration().then(function (r) { if (r) r.update(); }).catch(function () {});
  });
}

Speech.onChange(function () { if (view === "settings") render(); });
render();
