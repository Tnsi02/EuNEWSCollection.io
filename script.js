document.addEventListener('DOMContentLoaded', () => {
    // Fetch EP news
    fetch('EPnews.txt')  // Ensure this path is correct
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const epNewsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const epNewsList = document.getElementById('ep-news-list');

            epNewsItems.forEach(item => {
                const [title, link] = item.split(' - ');  // Split title and link
                const article = document.createElement('article');
                article.innerHTML = `<p><a href="${link}" target="_blank">${title}</a></p>`;
                epNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching EP news:', error));

    // Fetch Commission news
    fetch('ECnews.txt')  // Ensure this path is correct for Commission news
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const commissionNewsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const commissionNewsList = document.getElementById('commission-news-list');

            commissionNewsItems.forEach(item => {
                const [title, link] = item.split(' - ');  // Split title and link
                const article = document.createElement('article');
                article.innerHTML = `<p><a href="${link}" target="_blank">${title}</a></p>`;
                commissionNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching Commission news:', error));
});
