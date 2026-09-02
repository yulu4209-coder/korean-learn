/* 内置韩语键盘（두벌식 标准布局）
 * 负责：자모 音节合成与拆解、键盘 UI、与输入框联动
 * 用法：HangulKeyboard.open({ input: domEl, onSubmit: fn })
 */

var HangulKeyboard = (function () {
  var CHO = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
  var JUNG = ["ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ", "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ"];
  var JONG = ["", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ", "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];

  var JUNG_COMBINE = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
  var JONG_COMBINE = { "ㄱㅅ": "ㄳ", "ㄴㅈ": "ㄵ", "ㄴㅎ": "ㄶ", "ㄹㄱ": "ㄺ", "ㄹㅁ": "ㄻ", "ㄹㅂ": "ㄼ", "ㄹㅅ": "ㄽ", "ㄹㅌ": "ㄾ", "ㄹㅍ": "ㄿ", "ㄹㅎ": "ㅀ", "ㅂㅅ": "ㅄ" };

  var JUNG_SPLIT = {}, JONG_SPLIT = {};
  Object.keys(JUNG_COMBINE).forEach(function (k) { JUNG_SPLIT[JUNG_COMBINE[k]] = [k[0], k[1]]; });
  Object.keys(JONG_COMBINE).forEach(function (k) { JONG_SPLIT[JONG_COMBINE[k]] = [k[0], k[1]]; });

  var SHIFT_MAP = { "ㅂ": "ㅃ", "ㅈ": "ㅉ", "ㄷ": "ㄸ", "ㄱ": "ㄲ", "ㅅ": "ㅆ", "ㅐ": "ㅒ", "ㅔ": "ㅖ" };
  var TENSE_REV = { "ㄲ": "ㄱ", "ㄸ": "ㄷ", "ㅃ": "ㅂ", "ㅆ": "ㅅ", "ㅉ": "ㅈ" };

  var LAYOUT = [
    ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
    ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
    ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"]
  ];

  var SBASE = 0xac00;

  var api = {};
  var el = null;
  var input = null;
  var onSubmit = null;
  var text = "";
  var cho = -1, jung = -1, jong = -1;
  var shift = false;
  var isMobile = false;

  function isVowel(ch) { return JUNG.indexOf(ch) >= 0; }
  function syllable(c, j, o) { return String.fromCharCode(SBASE + c * 588 + j * 28 + (o < 0 ? 0 : o)); }

  function pending() {
    if (cho >= 0 && jung >= 0) return syllable(cho, jung, jong);
    if (cho >= 0) return CHO[cho];
    if (jung >= 0) return JUNG[jung];
    return "";
  }
  function value() { return text + pending(); }

  function flush() {
    if (cho < 0 && jung < 0) return;
    if (cho >= 0 && jung >= 0) text += syllable(cho, jung, jong);
    else if (cho >= 0) text += CHO[cho];
    else text += JUNG[jung];
    cho = jung = jong = -1;
  }

  function push(jamo) {
    if (isVowel(jamo)) {
      var ji = JUNG.indexOf(jamo);
      if (jung < 0) {
        jung = ji;
      } else if (jong < 0) {
        var merged = JUNG_COMBINE[JUNG[jung] + jamo];
        if (merged) jung = JUNG.indexOf(merged);
        else { flush(); jung = ji; }
      } else {
        var moved = JONG[jong];
        flush();
        var ci = CHO.indexOf(moved);
        if (ci >= 0) cho = ci;
        jung = ji;
      }
    } else {
      var idx = CHO.indexOf(jamo);
      if (cho < 0 && jung < 0) {
        cho = idx;
      } else if (jung < 0) {
        flush();
        cho = idx;
      } else if (jong < 0) {
        var jj = JONG.indexOf(jamo);
        if (jj > 0) jong = jj;
        else { flush(); cho = idx; }
      } else {
        var combo = JONG_COMBINE[JONG[jong] + jamo];
        if (combo) jong = JONG.indexOf(combo);
        else { flush(); cho = idx; }
      }
    }
  }

  function backspace() {
    if (jong >= 0) {
      var jc = JONG_SPLIT[JONG[jong]];
      jong = jc ? JONG.indexOf(jc[0]) : -1;
    } else if (jung >= 0) {
      var vc = JUNG_SPLIT[JUNG[jung]];
      jung = vc ? JUNG.indexOf(vc[0]) : -1;
    } else if (cho >= 0) {
      if (TENSE_REV[CHO[cho]]) cho = CHO.indexOf(TENSE_REV[CHO[cho]]);
      else cho = -1;
    } else {
      text = text.slice(0, -1);
    }
  }

  function structure() {
    var parts = [];
    if (cho >= 0) parts.push(CHO[cho]);
    if (jung >= 0) parts.push(JUNG[jung]);
    if (jong >= 0) parts.push(JONG[jong]);
    if (parts.length < 2) return "";
    return parts.join(" + ") + " = " + syllable(cho, jung, jong);
  }

  function sync() {
    if (input) input.value = value();
    var pv = el.querySelector(".kbd-structure");
    if (pv) pv.textContent = structure();
    var done = el.querySelector('[data-k="submit"]');
    if (done) done.disabled = !value().trim();
  }

  function keyLabel(k) { return shift && SHIFT_MAP[k] ? SHIFT_MAP[k] : k; }

  function render() {
    var rows = LAYOUT.map(function (row, ri) {
      var keys = row.map(function (k) {
        return '<button class="kbd-key" data-jamo="' + k + '">' + keyLabel(k) + "</button>";
      }).join("");
      if (ri === 1) keys += '<button class="kbd-key kbd-fn" data-k="back">⌫</button>';
      if (ri === 2) {
        keys = '<button class="kbd-key kbd-fn kbd-shift' + (shift ? " on" : "") + '" data-k="shift">⇧</button>' + keys;
        keys += '<button class="kbd-key kbd-fn kbd-space" data-k="space">空格</button>';
      }
      return '<div class="kbd-row">' + keys + "</div>";
    }).join("");

    el.className = "kbd " + (isMobile ? "kbd-mobile" : "kbd-float");
    el.innerHTML =
      '<div class="kbd-bar">' +
        '<div class="kbd-structure"></div>' +
        '<button class="kbd-key kbd-fn kbd-done" data-k="submit">完成</button>' +
        '<button class="kbd-key kbd-fn" data-k="close">收起</button>' +
      "</div>" +
      '<div class="kbd-rows">' + rows + "</div>";

    el.querySelectorAll("[data-jamo]").forEach(function (b) {
      b.onclick = function () {
        push(shift && SHIFT_MAP[b.dataset.jamo] ? SHIFT_MAP[b.dataset.jamo] : b.dataset.jamo);
        if (shift) { shift = false; render(); }
        sync();
      };
    });
    el.querySelectorAll("[data-k]").forEach(function (b) {
      b.onclick = function () {
        var k = b.dataset.k;
        if (k === "back") backspace();
        else if (k === "shift") { shift = !shift; render(); return; }
        else if (k === "space") { flush(); text += " "; }
        else if (k === "submit") { flush(); sync(); if (onSubmit) onSubmit(value()); return; }
        else if (k === "close") { api.close(); return; }
        sync();
      };
    });
    sync();
  }

  api.open = function (opts) {
    input = opts.input;
    onSubmit = opts.onSubmit || null;
    isMobile = window.matchMedia("(max-width: 700px), (pointer: coarse)").matches;
    text = input.value || "";
    cho = jung = jong = -1;
    shift = false;

    if (!el) {
      el = document.createElement("div");
      el.id = "hangul-keyboard";
      document.body.appendChild(el);
    }
    render();
    el.classList.add("open");

    if (isMobile) {
      document.body.classList.add("kbd-open");
    } else {
      var r = input.getBoundingClientRect();
      var top = r.bottom + window.scrollY + 8;
      var maxTop = window.scrollY + window.innerHeight - el.offsetHeight - 12;
      el.style.top = Math.max(window.scrollY + 12, Math.min(top, maxTop)) + "px";
      el.style.left = Math.min(r.left + window.scrollX, window.innerWidth - el.offsetWidth - 12) + "px";
    }
  };

  api.close = function () {
    if (!el) return;
    el.classList.remove("open");
    document.body.classList.remove("kbd-open");
    input = null;
  };

  api.isOpen = function () { return !!el && el.classList.contains("open"); };

  api.reset = function (v) {
    text = v || "";
    cho = jung = jong = -1;
    shift = false;
    if (el) render();
  };

  api.syncFromInput = function () {
    if (input) { text = input.value || ""; cho = jung = jong = -1; if (el) sync(); }
  };

  api.jamoOf = function (str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
      var code = str.charCodeAt(i);
      if (code >= SBASE && code <= 0xd7a3) {
        var n = code - SBASE;
        out.push(CHO[Math.floor(n / 588)]);
        out.push(JUNG[Math.floor((n % 588) / 28)]);
        var o = n % 28;
        if (o > 0) out.push(JONG[o]);
      } else out.push(str[i]);
    }
    return out;
  };

  api.decompose = function (str) { return api.jamoOf(str).join(""); };
  api.syllableCount = function (str) { return str.replace(/\s/g, "").length; };
  api.CHO = CHO; api.JUNG = JUNG; api.JONG = JONG;

  return api;
})();
