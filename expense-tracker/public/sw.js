const CACHE = "spendly-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

// Network first, fall back to cache so the app opens offline
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin)
    return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req)),
  );
});

// Ready for Step 2 (real push from a server)
self.addEventListener("push", (e) => {
  let data = { title: "Spendly", body: "Your spending report is ready." };
  try {
    data = { ...data, ...e.data.json() };
  } catch {}
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/192",
      badge: "/icons/192",
    }),
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.openWindow("/"));
});
