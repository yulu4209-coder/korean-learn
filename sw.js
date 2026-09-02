const CACHE = "korean-learn-v4";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./data.js",
  "./speech.js",
  "./quiz.js",
  "./kbd.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

/* 网络优先 + 离线回退
   在线时永远拿线上最新版本（改完代码上传后打开一次就是新的，不会卡在旧版）；
   断网或请求失败时自动回退到本地缓存，离线依然可用。
   注意：不做缓存优先——否则新页面会配上旧 JS/CSS，出现"半新半旧"的错乱。 */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(event.request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // 导航请求（离线时打开应用）回退到首页
          if (event.request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        })
      )
  );
});
