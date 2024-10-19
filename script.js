<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News List with Toggle and Summarize</title>
    <style>
        .important-toggle {
            cursor: pointer;
            font-size: 20px;
            color: black; /* Default color */
            background-color: black; /* Default background */
            border: 2px solid black; /* Default border */
            border-radius: 5px;
            padding: 5px;
            margin-left: 10px;
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }

        .important-toggle:hover {
            border-color: red;
            color: red;
        }

        .important-toggle.active {
            color: red;
            background-color: red;
            border-color: red;
        }

        .important-toggle.inactive {
            color: black;
            background-color: black;
            border-color: black;
        }

        .news-list {
            margin-top: 20px;
            display: none; /* Initially hidden */
        }

        .news-item {
            margin-bottom: 15px;
        }

        .news-item label {
            display: flex;
            align-items: center;
        }

        .news-item a {
            margin-left: 10px;
            color: #1bd9f7;
            text-decoration: none;
        }

        .news-item a:hover {
            text-decoration: underline;
        }

        /* Toggle button styles for the + and - signs */
        .toggle-sign {
            cursor: pointer;
            font-size: 24px;
            margin-right: 10px;
        }

        /* Additional styles for general layout */
        .news-section {
            margin-bottom: 30px;
        }

        /* Styling for the last updated date */
        #last-updated-date {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>

<!-- News sections -->
<div class="news-section">
    <h2>
        <span class="toggle-sign" data-visible="false">+</span> Featured News
    </h2>
    <div class="news-list" id="featured-news-list"></div>
</div>

<div class="news-section">
    <h2>
        <span class="toggle-sign" data-visible="false">+</span> EP News
    </h2>
    <div class="news-list" id="ep-news-list"></div>
</div>

<div class="news-section">
    <h2>
        <span class="toggle-sign" data-visible="false">+</span> Commission News
    </h2>
    <div class="news-list" id="commission-news-list"></div>
</div>

<!-- Add additional sections here as needed -->

<!-- Last updated date -->
<div id="last-updated-date"></div>

<script>
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
                        article.classList.add('news-item');
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
                .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
        }

        // Function to fetch the last updated date from last_updated.txt
        function updateLastUpdatedDate() {
            fetch('last_updated.txt')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('last-updated-date').textContent = `Last Updated: ${data.trim()}`;
                })
                .catch(error => console.error('Error fetching last updated date:', error));
        }

        // Fetch news from the respective files
        fetchNews('EUFnews.txt', 'featured-news-list'); // Featured News
        fetchNews('EPnews.txt', 'ep-news-list'); // EP News
        fetchNews('ECnews.txt', 'commission-news-list'); // Commission News
        fetchNews('EEASnews.txt', 'external-action-news-list'); // External Action News

        // Add click event listeners for toggling visibility
        document.querySelectorAll('.toggle-sign').forEach(sign => {
            sign.addEventListener('click', function() {
                const newsList = this.closest('.news-section').querySelector('.news-list');
                const isVisible = this.getAttribute('data-visible') === 'true';
                newsList.style.display = isVisible ? 'none' : 'block'; 
                this.textContent = isVisible ? '+' : '-'; 
                this.setAttribute('data-visible', !isVisible); 
            });
        });
    });
</script>

</body>
</html>
