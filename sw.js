/* ريّح بالك — Service Worker
   يخزّن ملفات التطبيق في الهاتف ليعمل بلا إنترنت.
   غيّر رقم CACHE عند كل تحديث للتطبيق حتى تصل النسخة الجديدة للمستخدمين. */

const CACHE = 'rayyeh-v1';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;

  // طلبات فايربيز تمر للشبكة دائماً (التفعيل يحتاج بيانات حيّة)
  if (url.includes('firebase') || url.includes('googleapis') || url.includes('gstatic')) {
    return;
  }

  // الملفات: من الذاكرة أولاً، ثم الشبكة
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});
