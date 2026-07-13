/* ريّح بالك — Service Worker
   يخزّن ملفات المنظومة ليعمل التطبيق بلا إنترنت.
   غيّر رقم CACHE عند كل تحديث حتى تصل النسخة الجديدة للمستخدمين. */

const CACHE='rayyeh-v2';
const FILES=['./','./index.html','./long.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  // فايربيز تمر للشبكة دائماً
  if(u.includes('firebase')||u.includes('googleapis')||u.includes('gstatic')||u.includes('firestore')) return;
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).catch(()=>caches.match('./index.html')))
  );
});
