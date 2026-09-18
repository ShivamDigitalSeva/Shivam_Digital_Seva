const CACHE_NAME = "shivam-digital-seva-v1";

self.addEventListener("install", function(event){
  self.skipWaiting();
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){
          return key !== CACHE_NAME;
        }).map(function(key){
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

/*
  सीधी strategy: पहले इंटरनेट से लोड करने की कोशिश,
  अगर नेट न हो तो पुराना (cache किया हुआ) version दिखा दें।
  इससे साइट थोड़ी offline भी काम कर पाएगी और
  Chrome इसे "installable" App मानेगा।
*/

self.addEventListener("fetch", function(event){

  if(event.request.method !== "GET"){
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(function(response){

        const responseClone = response.clone();

        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, responseClone);
        });

        return response;

      })
      .catch(function(){
        return caches.match(event.request);
      })
  );

});
