// Service worker de la Vitrine Be Solaitra.
// Réseau d'abord : le lecteur voit toujours la dernière version publiée.
// Hors connexion : la dernière version consultée, sinon une page d'information.
const CACHE = "besolaitra-v1";
const OFFLINE_HTML =
  '<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Be Solaitra</title><body style="font-family:system-ui,sans-serif;padding:2rem;text-align:center;color:#0b3a46">' +
  "<h1>Be Solaitra</h1><p>Vous êtes hors connexion.</p><p>Reconnectez-vous pour lire les derniers articles.</p></body></html>";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        if (req.mode === "navigate") {
          return new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        }
        return Response.error();
      })
  );
});
