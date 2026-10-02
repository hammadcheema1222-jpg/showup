const C='rexquest-v36';
const FILES=['./','index.html','manifest.webmanifest','icon-v21-180.png','icon-v21-192.png','icon-v21-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C&&k!=='rexquest-runtime').map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const r=e.request; if(r.method!=='GET') return;
  if(/\/(py|sql)\//.test(new URL(r.url).pathname)){ e.respondWith(caches.open('rexquest-runtime').then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{ if(res.ok) c.put(r,res.clone()); return res; })))); return; }
  e.respondWith(fetch(r).then(res=>{ if(res.ok&&new URL(r.url).origin===location.origin){const cp=res.clone(); caches.open(C).then(c=>c.put(r,cp));} return res; }).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));});
