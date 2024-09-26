document.addEventListener('DOMContentLoaded', () => {
    fetch('news.txt') // Make sure this path is correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const newsList = document.getElementById('news-list');

            newsItems.forEach(item => {
                const [title, link] = item.split(' - '); // Split the title and link
                const article = document.createElement('article');
                article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`; // Create clickable link
                newsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});
