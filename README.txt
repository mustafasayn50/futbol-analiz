FUTBOL ANALİZ MERKEZİ v3 — API-FOOTBALL BAĞLANTISI

BU PAKETTE
- index.html / sw.js / manifest.json / icon.svg: GitHub Pages PWA dosyaları
- worker.js: Cloudflare Worker proxy. API anahtarını güvenli biçimde sunucuda tutar.

1) API-FOOTBALL HESABI
- https://www.api-football.com/ adresinden ücretsiz hesap oluşturun.
- Dashboard'dan API key alın. Ücretsiz plan: 100 istek/gün, 10 istek/dakika (limitler sağlayıcı tarafından değiştirilebilir).

2) CLOUDFLARE WORKER
- https://dash.cloudflare.com/ > Workers & Pages > Create > Worker
- Worker adını ör. futbol-api yapın.
- Edit code ekranında worker.js içeriğinin tamamını yapıştırıp Deploy edin.
- Worker > Settings > Variables and Secrets > Add > Secret
- Variable name: API_FOOTBALL_KEY
- Value: API-Football dashboard'dan aldığınız anahtar
- Save / Deploy. Anahtarı GitHub'a, index.html'e veya sohbet mesajına yazmayın.
- Worker URL'niz https://futbol-api.<hesap>.workers.dev biçiminde olacaktır.

3) GITHUB PAGES
- Bu ZIP içindeki index.html, sw.js, manifest.json ve icon.svg dosyalarını GitHub repository köküne yükleyin; mevcut dosyaların üzerine yazın.
- Commit edin, Pages dağıtımını bekleyin.
- PWA > Bağlantı ekranında Worker URL'sini girin ve bağlantıyı test edin.

4) VERİ UÇLARI
GET /health
GET /leagues?country=Turkey
GET /teams?league_id=...&season=2026
GET /fixtures?league_id=...&season=2026&date=YYYY-MM-DD
GET /compare?league_id=...&season=2026&home_team=TEAM_ID&away_team=TEAM_ID
GET /matches/{fixture_id}/analysis
GET /matches/{fixture_id}/lineups
GET /matches/{fixture_id}/odds
GET /matches/{fixture_id}/injuries

ÖNEMLİ SINIRLAR
- Ücretsiz 100 günlük istekle bütün ligleri sürekli taramak mümkün değildir. İstekleri seçilen lig/maçlarla sınırlandırın; önbellek ve kontrollü yenileme kullanın.
- API-Football kapsamı lig ve sezon bazında değişir. Kadro, sakatlık, istatistik ve oran alanları her maçta garanti değildir.
- Bu sürüm lig/takım/fikstür ve takım sezon istatistiği bağlantısını başlatır. Maç bazlı kadro, sakatlık, oran uçları Worker'da hazır; arayüzde ayrıntılı maç merkezi sonraki geliştirmedir.
- Üçüncü taraf verilerin yeniden yayımlanması için sağlayıcının güncel kullanım koşullarını inceleyin. Bu paket kişisel analiz prototipi içindir.
