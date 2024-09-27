document.addEventListener('DOMContentLoaded', () => {
    // Fetch EP News
    fetch('EPnews.txt') // Update this to the correct path for EPnews.txt
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const epNewsList = document.getElementById('ep-news-list');

            newsItems.forEach(item => {
                const [title, link] = item.split(' - '); // Split the title and link
                const article = document.createElement('article');
                article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                epNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching EP news:', error));

    // Fetch Commission News
    fetch('ECnews.txt') // Update this to the correct path for ECnews.txt
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const commissionNewsList = document.getElementById('commission-news-list');

            newsItems.forEach(item => {
                const [title, link] = item.split(' - '); // Split the title and link
                const article = document.createElement('article');
                article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                commissionNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching Commission news:', error));
});
