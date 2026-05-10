// public/sw.js
console.log("🔥 SW: Click Tracking Version 3.0 Active!");

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: data.icon || 'https://namedotify.com/icon.png',
      image: data.image || null,
      data: {
        url: data.url,
        campaignId: data.campaignId || null, 
        btnUrl: data.btnUrl || data.url      
      },
      requireInteraction: true 
    };

    if (data.btnText) {
      options.actions = [{ action: 'custom_action', title: data.btnText }];
    }

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); 

  const data = event.notification.data || {};
  let targetUrl = data.url || '/';

  if (event.action === 'custom_action' && data.btnUrl) {
    targetUrl = data.btnUrl;
  }

  console.log("👉 Notification Clicked! Campaign ID:", data.campaignId);

  // 🔥 THE ADVANCED TRACKING FIX (Absolute URL + Logs)
  const trackUrl = `${self.location.origin}/api/campaign/click`;
  
  const trackPromise = data.campaignId 
    ? fetch(trackUrl, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: data.campaignId }),
        keepalive: true 
      })
      .then(res => console.log("✅ Tracking API Response Status:", res.status))
      .catch(e => console.error('❌ Tracking Error:', e))
    : Promise.resolve();

  event.waitUntil(
    Promise.all([
      trackPromise,
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          if (windowClients[i].url === targetUrl && 'focus' in windowClients[i]) {
            return windowClients[i].focus();
          }
        }
        if (clients.openWindow && targetUrl) {
          return clients.openWindow(targetUrl);
        }
      })
    ])
  );
});