self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed');
});

// Logika notifikasi
self.addEventListener('push', (e) => {
  const options = {
    body: 'Sudahkah satu kebaikan kecil menyapa harimu?',
    icon: 'https://cdn-icons-png.flaticon.com/512/3588/3588658.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now() }
  };
  e.waitUntil(self.registration.showNotification('AMALA Reminder', options));
});
