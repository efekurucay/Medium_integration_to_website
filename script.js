async function loadMediumPosts() {
    // Medium kullanıcı adınızı buraya yazın
    const username = 'efekurucay';
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