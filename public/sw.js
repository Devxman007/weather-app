"use strict";

const STATIC_CACHE_NAME = "static-cache-v1";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/offline.html",
  "css/style.css",
  "js/script.js",
  "index.js",
  "/index.html",
  "img/crying-cloud.png",
  "img/thunderstorm.svg",
  "img/Atmosphere.svg",
  "img/Hot_Sun_Day.svg",
  "img/rain.svg",
  "img/Sunny_Rain_Climate.svg",
  "img/Sunny_Sun_Cloudy.svg",
  "img/Snow.svg"
];

self.addEventListener("install", (evt) => {
  console.log("[ServiceWorker] Install");

  evt.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log("[ServiceWorker] Pre-caching offline page");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  console.log("[ServiceWorker] Activate");

  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  console.log("[ServiceWorker] Fetch", evt.request.url);

  if (evt.request.url.includes("openweathermap")) {
    console.log("[Service Worker] Fetch (data)", evt.request.url);
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(evt.request)
          .then((response) => {
            // If the response was good, clone it and store it in the cache.
            if (response.status === 200) {
              cache.put(evt.request.url, response.clone());
            }
            return response;
          })
          .catch((err) => {
            // Network request failed, try to get it from the cache.
            return cache.match(evt.request);
          });
      })
    );
  } else {
    evt.respondWith(
      fetch(evt.request).catch(() => {
        return caches.open(STATIC_CACHE_NAME).then((cache) => {
          return cache.match(evt.request).then((response) => {
            return response || cache.match("/offline.html")
          });
        });
      })
    );
  }
});
