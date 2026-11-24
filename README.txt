FUTBOL ANALİZ MERKEZİ — ÜCRETSİZ VERİ SÜRÜMÜ

Bu sürüm API-Football yerine API Ninjas Football API kullanır.
Kaynak dokümanı: https://api-ninjas.com/api/football
Ücretsiz plan: 3.000 çağrı/ay, 100 çağrı/saat; yalnızca kişisel/değerlendirme kullanımı, ticari kullanım yok. Ücretsiz planda veri saklama/cache izni yoktur; bu Worker API yanıtlarını cache'lemez.

KAPSAM
- Türkiye Süper Lig: superlig
- Premier League: epl
- La Liga: laliga
- Bundesliga: bundesliga
- Serie A: seriea
- Ligue 1: ligue1
- Şampiyonlar Ligi: ucl
- Avrupa Ligi: uel
- Konferans Ligi: uecl
- Eredivisie, Primeira Liga, İskoçya, Belçika ve Yunanistan ligleri

KURULUM
1. https://api-ninjas.com/ adresinden ücretsiz hesap aç ve Football API anahtarını al.
2. Cloudflare > Workers & Pages > mevcut futbol Worker'ını aç.
3. worker.js içeriğini tamamen bununla değiştir ve Deploy et.
4. Worker > Settings > Variables and Secrets > Add variable/secret:
   Key: API_NINJAS_KEY
   Value: API Ninjas anahtarın
   Secret seçeneğini işaretle, kaydet ve deploy et.
5. GitHub futbol-analiz deposunda index.html, sw.js, manifest.json ve icon.svg dosyalarını bu ZIP'teki dosyalarla değiştir.
6. PWA'da Bağlantı bölümüne Worker adresini yazıp test et.
7. Maçlar bölümünde Süper Lig'i seçip bugünün fikstürünü getir.

ÖNEMLİ ÜCRETSİZ PLAN SINIRLARI
- API Ninjas ücretsiz planı 3.000 çağrı/ay ve 100 çağrı/saat sınırına sahiptir.
- Ücretsiz planda canlı maçın dakika ve anlık skor alanları premium'dur. Canlı maçın durumu görülebilir; canlı skor/dakika gösterilmez.
- Ücretsiz API dokümanında fikstür/sonuç, puan tablosu, kulüp ve kadro uç noktaları bulunur.
- Sakatlık/cezalı listesi, kesin ilk 11, korner/kart/şut ayrıntıları ve bahis oranları bu ücretsiz entegrasyonda mevcut değildir. Bunlar varmış gibi tahmin edilmez.
- Takım karşılaştırması her takımın sezon maçlarından son 5 tamamlanmış maçı hesaplar; iki API çağrısı yapar.
- API Ninjas ücretsiz lisansı ticari kullanıma izin vermez. Ticari/halka açık gelir getirici kullanım için sağlayıcı lisansını kontrol et.
- API anahtarını GitHub'a, index.html'e veya sohbete yazma. Yalnızca Cloudflare Secret olarak sakla.

Sorun giderme
- /health adresi {"ok":true,...} döndürmeli.
- 401/403: Secret adı veya anahtar yanlış.
- 429: saatlik/aylık ücretsiz kota dolmuş olabilir.
- Bazı organizasyonlarda belirli tarihte maç olmaması normaldir.
