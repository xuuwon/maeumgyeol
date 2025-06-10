const CACHE_NAME = 'my-pwa-cache-v3'; // 버전 바꿈
const urlsToCache = ['/'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  // 청크 파일이나 정적 파일은 네트워크 우선 전략
  if (
    event.request.url.includes('/_next/static/chunks/') ||
    event.request.url.includes('/_next/static/runtime/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 네트워크 응답 성공 시 캐시에 저장해두기
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request)) // 네트워크 실패 시 캐시에서 응답
    );
  } else {
    // 그 외 요청은 캐시 우선 전략
    event.respondWith(
      caches.match(event.request).then((response) => response || fetch(event.request))
    );
  }
});
