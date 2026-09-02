/* 语音合成封装
 * 修复：voices 异步加载、韩语嗓音优先、iOS 手势解锁、无韩语语音时的降级判断
 */

var Speech = (function () {
  var supported = typeof window !== "undefined" && "speechSynthesis" in window;
  var voices = [];
  var koVoice = null;
  var loaded = false;
  var unlocked = false;
  var failed = 0;
  var listeners = [];
  var poll = null;

  function notify() { listeners.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  function pick(list) {
    var ko = list.filter(function (v) { return /^ko[-_]?kr/i.test(v.lang || ""); });
    if (!ko.length) ko = list.filter(function (v) { return /^ko/i.test(v.lang || ""); });
    if (!ko.length) return null;
    var local = ko.filter(function (v) { return v.localService !== false; });
    return (local.length ? local : ko)[0];
  }

  function load() {
    if (!supported) return;
    var list = [];
    try { list = window.speechSynthesis.getVoices() || []; } catch (e) {}
    if (list.length) {
      voices = list;
      koVoice = pick(list);
      loaded = true;
      notify();
      if (poll) { clearInterval(poll); poll = null; }
    }
  }

  if (supported) {
    load();
    try { window.speechSynthesis.onvoiceschanged = load; } catch (e) {}
    if (!loaded) {
      var tries = 0;
      poll = setInterval(function () {
        load();
        if (++tries > 25 && poll) { clearInterval(poll); poll = null; }
      }, 200);
    }
    try {
      document.addEventListener("pointerdown", unlockOnce, { once: true });
      document.addEventListener("keydown", unlockOnce, { once: true });
    } catch (e) {}
  }

  function unlockOnce() {
    if (unlocked || !supported) return;
    unlocked = true;
    try {
      var u = new SpeechSynthesisUtterance(" ");
      u.volume = 0;
      u.rate = 2;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  return {
    supported: function () { return supported; },
    ready: function () { return loaded; },
    hasKorean: function () { return !!koVoice; },
    hasKoreanMaybe: function () { return !loaded ? null : !!koVoice; },
    voiceName: function () { return koVoice ? koVoice.name : ""; },
    onChange: function (fn) { listeners.push(fn); },

    speak: function (text, opts) {
      if (!supported || !text) return false;
      opts = opts || {};
      try {
        var synth = window.speechSynthesis;
        if (synth.speaking || synth.pending) synth.cancel();
        var u = new SpeechSynthesisUtterance(String(text));
        u.lang = "ko-KR";
        u.rate = opts.rate || 0.82;
        u.pitch = opts.pitch || 1;
        if (koVoice) u.voice = koVoice;
        u.onerror = function (ev) {
          if (ev && ev.error && ev.error !== "interrupted" && ev.error !== "canceled") failed++;
        };
        u.onend = function () { if (opts.onEnd) opts.onEnd(); };
        synth.speak(u);
        return true;
      } catch (e) { return false; }
    },

    /* 试播放一个音节用于检测：返回结果不即时，仅供 UI 参考是否曾失败 */
    failureCount: function () { return failed; },
    resetFailures: function () { failed = 0; }
  };
})();
