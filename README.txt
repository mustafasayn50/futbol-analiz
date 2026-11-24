FUTBOL ANALİZ PRO – KURULUM

Dosyalar:
- index.html: uygulama arayüzü ve olasılık gösterimi
- worker.js: Cloudflare Worker API geçidi ve analiz hesaplaması
- sw.js, manifest.json, icon.svg: PWA dosyaları

ÖNEMLİ:
Bu sürümün profesyonel analiz ekranı yeni /analyze endpoint'ini kullanır. Bu nedenle Cloudflare'daki mevcut futbol-api Worker kodunun worker.js dosyasındaki yeni kodla güncellenmesi gerekir.
API_NINJAS_KEY Secret'ını silmeyin/değiştirmeyin. Anahtar GitHub'a veya index.html'e konulmaz.

GITHUB PAGES:
ZIP içindeki dosyaları depo kök dizinine yükleyin (futbol-analiz-main klasörünü değil, içindeki dosyaları). index.html, worker.js, sw.js, manifest.json ve icon.svg kökte bulunmalı.

CLOUDFLARE:
Mevcut futbol-api Worker'ını açın, Edit code ile worker.js içeriğini güncelleyin ve Deploy edin. Worker adı ve workers.dev adresi değişmez. API_NINJAS_KEY Secret aynen kalır.

MODEL:
Son 5/10/15 tamamlanmış maç; iç saha/deplasman gol ortalamaları; Poisson tabanlı 1X2, KG Var/Yok ve 1.5/2.5/3.5 üst olasılıkları. Güven puanı veri örneklemine dayanır. Bu değerler bahis kazancı garantisi değildir.

VERİ SINIRLARI:
API Ninjas ücretsiz planda güncel sezon verisi sağlar; canlı dakika/skor güncellemesi ve geçmiş sezon arşivi sınırlıdır. İlk yarı, korner, kart, sakatlık ve bahis oranları mevcut veri kaynağından sağlanmadığı için gösterilmez.
