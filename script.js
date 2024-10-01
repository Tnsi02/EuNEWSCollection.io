document.addEventListener('DOMContentLoaded', () => {
   // Function to fetch news from a specified file and update the respective news list
function fetchNews(filePath, newsListId, isConsilium = false) { // Added isConsilium flag for special handling
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const newsList = document.getElementById(newsListId);

            // Clear existing news items before appending new ones
            newsList.innerHTML = '';

            newsItems.forEach(item => {
                let title, link;
                
                // If Consilium, use // as separator. Otherwise, use -
                if (isConsilium && item.includes('//')) {
                    [title, link] = item.split(' // ').map(part => part.trim()); // Consilium uses //
                } else {
                    [title, link] = item.split(' - ').map(part => part.trim()); // Default to -
                }

                const coloredTitle = title
                    .replace(/\[(Council of the EU)\]/g, '<span style="color: #1bd9f7;">[$1]</span>')
                    .replace(/\[(European Council)\]/g, '<span style="color: #1470f4;">[$1]</span>');

                const encodeLink = encodeURIComponent(link); // Encode the link
                const summarizeUrl = `https://www.phind.com/search?q=summarise+this%3A+${encodeLink}`; // Create summarize URL
                const article = document.createElement('article');
                article.innerHTML = `
                    <label>
                        <input type="checkbox" class="news-read-checkbox" />
                        <a href="${link}" target="_blank">${coloredTitle}</a>
                        <button class="summarize-button" onclick="window.open('${summarizeUrl}', '_blank')">Summarize</button>
                    </label>
                `;

                const checkbox = article.querySelector('.news-read-checkbox');

                // Check localStorage for the read state
                const isRead = JSON.parse(localStorage.getItem(link));
                if (isRead) {
                    checkbox.checked = true; // Mark checkbox if read
                }

                // Save checkbox state to localStorage when toggled
                checkbox.addEventListener('change', () => {
                    localStorage.setItem(link, JSON.stringify(checkbox.checked));
                });

                newsList.appendChild(article);
            });

            // Update the last updated date
            updateLastUpdatedDate(); // Call to update last updated date
        })
        .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
}

    // Function to fetch the last updated date from last_updated.txt
    function updateLastUpdatedDate() {
        fetch('last_updated.txt')
            .then(response => response.text())
            .then(data => {
                document.getElementById('last-updated-date').textContent = `Last Updated: ${data.trim()}`; // Display fetched date
            })
            .catch(error => console.error('Error fetching last updated date:', error));
    }

    // Fetch news from the respective files
    fetchNews('EUFnews.txt', 'featured-news-list'); // Featured News
    fetchNews('EPnews.txt', 'ep-news-list'); // EP News
    fetchNews('ECnews.txt', 'commission-news-list'); // Commission News
    fetchNews('EEASnews.txt', 'external-action-news-list'); // External Action News
    fetchNews('ConsiliumNews.txt', 'consilium-news-list'); // Consilium News
    fetchNews('EBnews.txt', 'eurobarometer-news-list'); // Eurobarometer News
    fetchNews('EESCnews.txt', 'eesc-news-list'); // EESC News

    // Add click event listeners for toggling visibility
    document.querySelectorAll('.toggle-sign').forEach(sign => {
        sign.addEventListener('click', function() {
            const newsList = this.closest('.news-section').querySelector('.news-list'); // Get the news list in the same section
            const isVisible = this.getAttribute('data-visible') === 'true';
            newsList.style.display = isVisible ? 'none' : 'block'; // Toggle display
            this.textContent = isVisible ? '+' : '-'; // Change sign
            this.setAttribute('data-visible', !isVisible); // Update visibility state
        });
    });
});
