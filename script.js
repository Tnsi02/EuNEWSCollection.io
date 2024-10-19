document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch news from a specified file and update the respective news list
    function fetchNews(filePath, newsListId) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
                const newsList = document.getElementById(newsListId);

                // Clear existing news items before appending new ones
                newsList.innerHTML = '';

                newsItems.forEach(item => {
                    const httpsIndex = item.indexOf('https'); // Find the start of the link
                    if (httpsIndex === -1) {
                        console.error(`No URL found in the news item: ${item}`);
                        return;
                    }

                    const title = item.slice(0, httpsIndex).trim(); // Extract the title part
                    const link = item.slice(httpsIndex).trim(); // Extract the link part

                    // Properly format the title with colored keywords (optional)
                    const coloredTitle = title
                        .replace(/\[(Council of the EU)\]/g, '<span style="color: #1bd9f7;">[$1]</span>')
                        .replace(/\[(European Council)\]/g, '<span style="color: #1470f4;">[$1]</span>');

                    // Construct the summarize link (optional)
                    const summarizeUrl = `https://www.phind.com/search?q=summarise+this%3A+${encodeURIComponent(link)}`;

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
                updateLastUpdatedDate();
            })
            .catch(error => console.error('Error fetching news:', error));
    }

    // Fetch news from different files
    fetchNews('ECnews.txt', 'featured-news-list');
    fetchNews('EPnews.txt', 'ep-news-list');
    fetchNews('Commission_Scrape.py', 'commission-news-list');
    fetchNews('EEASnews.txt', 'external-action-news-list');
    fetchNews('Consiliumnews.txt', 'consilium-news-list');
    fetchNews('Eurobarometer.txt', 'eurobarometer-news-list');
    fetchNews('eesc.txt', 'eesc-news-list');
    
    // Function to update the last updated date
    function updateLastUpdatedDate() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        document.getElementById('last-updated-date').textContent = `Last updated: ${formattedDate}`;
    }
    
    // Toggle button for the notes section
    const toggleNotesButton = document.getElementById('toggle-notes');
    const noteContainer = document.querySelector('.note-container');

    toggleNotesButton.addEventListener('click', () => {
        const isExpanded = noteContainer.classList.contains('expanded');
        noteContainer.classList.toggle('expanded', !isExpanded);
        noteContainer.classList.toggle('collapsed', isExpanded);
        toggleNotesButton.textContent = isExpanded ? '+' : '-';
    });
});
