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
    
     // Add click event listeners for toggling visibility
    document.querySelectorAll('.toggle-sign').forEach(sign => {
        sign.addEventListener('click', function() {
            const newsList = this.parentElement.nextElementSibling; // Get the next sibling (the news list)
            const isVisible = this.getAttribute('data-visible') === 'true';
            newsList.style.display = isVisible ? 'none' : 'block'; // Toggle display
            this.textContent = isVisible ? '+' : '-'; // Change sign
            this.setAttribute('data-visible', !isVisible); // Update visibility state
        });
    });
});
    
