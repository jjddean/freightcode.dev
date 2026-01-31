// MarketLive Service Worker
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'marketlive-v1.0.0';
const STATIC_CACHE = 'marketlive-static-v1';
const DYNAMIC_CACHE = 'marketlive-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/shipments',
  '/payments',
  '/reports',
  '/compliance',
  '/manifest.json',
  // Add your built assets here
  '/assets/index.css',
  '/assets/index.js',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/shipments/,
  /\/api\/analytics/,
  /\/api\/notifications/,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same-origin requests (app assets)
    event.respondWith(handleSameOriginRequest(request));
  } else if (isApiRequest(request)) {
    // API requests
    event.respondWith(handleApiRequest(request));
  } else {
    // External resources (images, fonts, etc.)
    event.respondWith(handleExternalRequest(request));
  }
});

// Handle same-origin requests (app pages and assets)
async function handleSameOriginRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Network request failed', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network Error', { status: 503 });
  }
}

// Handle API requests with caching strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: API request failed, trying cache', error);
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator header
      const response = cachedResponse.clone();
      response.headers.set('X-Served-By', 'ServiceWorker-Cache');
      return response;
    }
    
    // Return mock data for critical endpoints
    return getMockApiResponse(url.pathname);
  }
}

// Handle external requests (CDN, images, etc.)
async function handleExternalRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful external resources
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache for external resources
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    return new Response('Resource Unavailable', { status: 503 });
  }
}

// Check if request is to API
function isApiRequest(request) {
  const url = new URL(request.url);
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname)) ||
         url.pathname.startsWith('/api/');
}

// Provide mock API responses for offline mode
function getMockApiResponse(pathname) {
  const mockData = {
    '/api/shipments': {
      data: [
        {
          id: 'SH-OFFLINE-001',
          origin: 'London, UK',
          destination: 'Hamburg, DE',
          status: 'Cached Data',
          eta: new Date(Date.now() + 86400000).toISOString(),
          carrier: 'Offline Mode'
        }
      ],
      success: true,
      message: 'Offline data'
    },
    '/api/notifications': {
      data: [
        {
          id: 'offline-1',
          title: 'Offline Mode',
          message: 'You are currently offline. Some data may be outdated.',
          type: 'system',
          priority: 'medium',
          timestamp: new Date().toISOString(),
          read: false
        }
      ],
      success: true
    }
  };

  const data = mockData[pathname] || { data: [], success: false, message: 'Offline' };
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'X-Served-By': 'ServiceWorker-Mock'
    }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'quote-request') {
    event.waitUntil(syncQuoteRequests());
  } else if (event.tag === 'document-upload') {
    event.waitUntil(syncDocumentUploads());
  }
});

// Sync quote requests when back online
async function syncQuoteRequests() {
  try {
    // Get pending quote requests from IndexedDB
    const pendingRequests = await getPendingQuoteRequests();
    
    for (const request of pendingRequests) {
      try {
        const response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request.data)
        });
        
        if (response.ok) {
          await removePendingQuoteRequest(request.id);
          console.log('Service Worker: Quote request synced', request.id);
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync quote request', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Sync document uploads when back online
async function syncDocumentUploads() {
  // Similar implementation for document uploads
  console.log('Service Worker: Syncing document uploads...');
}

// IndexedDB helpers (simplified - would need full implementation)
async function getPendingQuoteRequests() {
  // Return pending requests from IndexedDB
  return [];
}

async function removePendingQuoteRequest(id) {
  // Remove synced request from IndexedDB
  console.log('Removing synced request:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('MarketLive Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/dashboard')
    );
  }
});

console.log('Service Worker: Loaded successfully');
