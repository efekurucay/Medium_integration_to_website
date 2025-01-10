# Medium Yazılarınızı Web Sitenize Nasıl Entegre Edersiniz?

(Buraya kendi Medium profilinizden bir ekran görüntüsü ekleyin)

Merhaba! Bu yazıda Medium blog yazılarınızı web sitenize nasıl kolayca entegre edebileceğinizi anlatacağım. Yazılarınız otomatik olarak güncellenecek ve güzel bir blog bölümüne sahip olacaksınız!

## Ne Yapacağız?

Medium'daki blog yazılarınızı web sitenizde otomatik olarak göstereceğiz. Yeni bir yazı yayınladığınızda veya var olan yazıları güncellediğinizde, web siteniz otomatik olarak güncellenecek!

(Buraya final ürünün nasıl görüneceğine dair bir ekran görüntüsü ekleyin)

## Adım 1: Dosyaları Oluşturma

Üç dosya oluşturacağız:
- index.html (ana sayfa)
- styles.css (tasarım)
- script.js (Medium bağlantısı)

### HTML Kodumuz
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Blog Posts</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container py-5">
        <h1 class="text-center mb-5">My Blog Posts</h1>
        <div id="medium-posts" class="row g-4">
            <!-- Blog yazıları buraya gelecek -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### CSS Kodumuz
```css
.blog-card {
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s;
    height: 100%;
    background: #fff;
}

.blog-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.blog-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.blog-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.blog-card:hover .blog-image img {
    transform: scale(1.05);
}

.blog-content {
    padding: 20px;
}

.blog-meta {
    display: flex;
    gap: 15px;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 10px;
}

.blog-meta span {
    display: flex;
    align-items: center;
    gap: 5px;
}

.blog-title {
    font-size: 1.25rem;
    margin-bottom: 10px;
    color: #333;
}

.blog-excerpt {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 15px;
}

.blog-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #0366d6;
    text-decoration: none;
    font-weight: 500;
}

.blog-link:hover {
    text-decoration: underline;
}
```

### JavaScript Kodumuz
```javascript
async function loadMediumPosts() {
    // Medium kullanıcı adınızı buraya yazın
    const username = 'YOUR_MEDIUM_USERNAME';
    const postsContainer = document.getElementById('medium-posts');
    
    // RSS2JSON API'sini kullanarak Medium yazılarını çekelim
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    
    try {
        // Önbellekten kontrol et
        const cachedPosts = localStorage.getItem('mediumPosts');
        const cacheTime = localStorage.getItem('mediumPostsTime');
        
        // Önbellekteki veri 1 saatten eskiyse yeni veri çek
        if (cachedPosts && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
            displayBlogPosts(JSON.parse(cachedPosts));
        }
        
        // Yeni veriyi çek
        const response = await fetch(rssUrl);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items.length > 0) {
            // Sonuçları önbelleğe al
            localStorage.setItem('mediumPosts', JSON.stringify(data.items));
            localStorage.setItem('mediumPostsTime', Date.now().toString());
            
            displayBlogPosts(data.items);
        }
    } catch (error) {
        console.error('Error:', error);
        postsContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    Blog yazıları yüklenemedi. Lütfen daha sonra tekrar deneyin.
                </div>
            </div>
        `;
    }
}

function displayBlogPosts(posts) {
    const postsContainer = document.getElementById('medium-posts');
    
    const postsHtml = posts.map(post => {
        // İçerikten ilk resmi çıkar veya varsayılan resmi kullan
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = post.content;
        const firstImage = tempDiv.querySelector('img');
        const imageUrl = firstImage ? firstImage.src : 'https://via.placeholder.com/300x160';
        
        // Okuma süresini hesapla
        const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200); // Dakikada 200 kelime
        
        // Açıklamayı temizle ve kısalt
        const description = post.description
            .replace(/<[^>]*>/g, '')
            .split(' ')
            .slice(0, 30)
            .join(' ') + '...';
        
        return `
            <div class="col-md-6 col-lg-4">
                <div class="blog-card">
                    <div class="blog-image">
                        <img src="${imageUrl}" alt="${post.title}">
                    </div>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <span>
                                <i class="far fa-calendar"></i>
                                ${new Date(post.pubDate).toLocaleDateString()}
                            </span>
                            <span>
                                <i class="far fa-clock"></i>
                                ${readingTime} dk okuma
                            </span>
                        </div>
                        <h3 class="blog-title">${post.title}</h3>
                        <p class="blog-excerpt">${description}</p>
                        <a href="${post.link}" target="_blank" class="blog-link">
                            Devamını Oku
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    postsContainer.innerHTML = postsHtml;
}

// Sayfa yüklendiğinde blog yazılarını göster
document.addEventListener('DOMContentLoaded', loadMediumPosts);
```

## Adım 2: Kodu Özelleştirme

1. `script.js` dosyasında `YOUR_MEDIUM_USERNAME` yazan yere kendi Medium kullanıcı adınızı yazın
2. İsterseniz CSS'de renkleri ve stilleri değiştirin
3. HTML'de başlığı değiştirin

(Buraya özelleştirilmiş bir versiyonun ekran görüntüsünü ekleyin)

## Önemli Noktalar

1. **RSS2JSON API**: Medium'un RSS beslemesini JSON formatına çevirmek için RSS2JSON API'sini kullanıyoruz. Bu servis ücretsiz bir katmanla sınırlı sayıda istek sunuyor.

2. **Önbellekleme**: Performansı artırmak ve API limitlerini aşmamak için yazıları önbellekliyoruz. Veriler 1 saat boyunca yerel depolamada tutuluyor.

3. **Resimler**: Medium yazılarındaki ilk resmi otomatik olarak kart resmi olarak kullanıyoruz. Eğer resim bulunamazsa varsayılan bir resim gösteriyoruz.

4. **Okuma Süresi**: Yazının içeriğindeki kelime sayısını kullanarak tahmini okuma süresi hesaplıyoruz.

## Bonus Özellikler

1. Kategorilere göre filtreleme:
```javascript
const filteredPosts = posts.filter(post => 
    post.categories.includes('JavaScript')
);
```

2. Yazıları tarihe göre sıralama:
```javascript
const sortedPosts = posts.sort((a, b) => 
    new Date(b.pubDate) - new Date(a.pubDate)
);
```

## Sıkça Sorulan Sorular

**S: Yeni yazım yayınlandı ama sitede görünmüyor?**
C: Önbellek nedeniyle yeni yazıların görünmesi 1 saate kadar sürebilir. Tarayıcı önbelleğini temizleyerek hemen görebilirsiniz.

**S: RSS2JSON API limitleri nedir?**
C: Ücretsiz planda günlük 100 istek hakkınız var. Bu genellikle kişisel siteler için yeterlidir.

## Son Notlar

Bu entegrasyonu kendi web sitenize eklediyseniz, aşağıda yorum bırakın ve sitenizin linkini paylaşın! Diğer geliştiricilere ilham olabilirsiniz.

(Buraya kendi web sitenizin final halinin bir ekran görüntüsünü ekleyin)
``` 