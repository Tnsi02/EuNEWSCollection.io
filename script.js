document.addEventListener('DOMContentLoaded', () => {
    fetch('path/to/news.txt') // Update this to the correct path for news.txt
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const newsList = document.getElementById('news-list');

            newsItems.forEach(item => {
                const [headline, link] = item.split(' - ');
                const article = document.createElement('div');
                article.className = 'news-item'; // Apply styling
                article.innerHTML = `<a href="${link}" target="_blank">${headline}</a>`;
                newsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});
