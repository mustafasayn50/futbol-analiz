FUTBOL ANALİZ MERKEZİ — PWA v1

İÇERİK
- index.html: Uygulama arayüzü ve prototip analiz mantığı
- sw.js: Çevrimdışı önbellek / service worker
- manifest.json: PWA tanımı
- icon.svg: Uygulama simgesi

GITHUB PAGES KURULUMU
1. ZIP içeriğini bir GitHub deposunun kök dizinine yükleyin.
2. Settings > Pages bölümünü açın.
3. Deploy from a branch seçin.
4. Branch: main, folder: / (root) seçip kaydedin.
5. Yayınlanan HTTPS adresini iPhone Safari'de açın.
6. Paylaş > Ana Ekrana Ekle seçin.

ÖNEMLİ
Bu sürüm çalışan arayüz ve manuel veri girişli prototiptir. Maçkolik veya başka bir kaynaktan otomatik/canlı veri çekmez. Gerçek veriler için erişim izni olan API sağlayıcısı, backend ve güvenli API anahtarı yönetimi kurulmalıdır.
Olasılık ekranındaki örnek hesaplama basitleştirilmiş prototiptir; gerçek tahmin modeli değildir. Korner, kart, ilk yarı ve oyuncu pazarları henüz hesaplanmaz. Gerçek maç verisi olmadan bahis kararı vermek için kullanılmamalıdır.
