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

                    // Create the "important" checkbox with the red "!" symbol
                    const importantCheckbox = document.createElement('input');
                    importantCheckbox.type = 'checkbox';
                    importantCheckbox.classList.add('important-check');
                    importantCheckbox.style.display = 'none'; // Hide the checkbox for custom styling
                    importantCheckbox.addEventListener('change', () => {
                        localStorage.setItem(`important-${link}`, JSON.stringify(importantCheckbox.checked));
                    });

                    // Create the red "!" symbol with a border (like a checkbox)
                    const importantSymbol = document.createElement('span');
                    importantSymbol.textContent = '!';
                    importantSymbol.style.color = 'red';
                    importantSymbol.style.fontSize = '20px';
                    importantSymbol.style.marginRight = '10px';
                    importantSymbol.style.fontWeight = 'bold';
                    importantSymbol.style.border = '2px solid red'; // Add border
                    importantSymbol.style.borderRadius = '50%'; // Make it round
                    importantSymbol.style.padding = '5px';
                    importantSymbol.style.cursor = 'pointer';
                    importantSymbol.style.marginRight = '10px';

                    // Toggle checkbox when clicking the red "!"
                    importantSymbol.addEventListener('click', () => {
                        importantCheckbox.checked = !importantCheckbox.checked;
                        importantSymbol.style.backgroundColor = importantCheckbox.checked ? 'red' : 'transparent';
                        localStorage.setItem(`important-${link}`, JSON.stringify(importantCheckbox.checked));
                    });

                    // Create the "read" checkbox
                    const readCheckbox = document.createElement('input');
                    readCheckbox.type = 'checkbox';
                    readCheckbox.classList.add('news-read-checkbox');
                    readCheckbox.addEventListener('change', () => {
                        localStorage.setItem(link, JSON.stringify(readCheckbox.checked));
                    });

                    const linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = '_blank';
                    linkElement.innerHTML = coloredTitle;

                    const summarizeButton = document.createElement('button');
                    summarizeButton.textContent = 'Summarize';
                    summarizeButton.style.backgroundColor = '#008CBA';
                    summarizeButton.style.color = 'white';
                    summarizeButton.style.border = 'none';
                    summarizeButton.style.padding = '10px 20px';
                    summarizeButton.style.textAlign = 'center';
                    summarizeButton.style.textDecoration = 'none';
                    summarizeButton.style.display = 'inline-block';
                    summarizeButton.style.fontSize = '16px';
                    summarizeButton.style.cursor = 'pointer';
                    summarizeButton.onclick = () => window.open(summarizeUrl, '_blank');

                    // Check localStorage for the important checkbox state
                    const isImportant = JSON.parse(localStorage.getItem(`important-${link}`));
                    importantCheckbox.checked = isImportant || false; // Set the initial state
                    importantSymbol.style.backgroundColor = isImportant ? 'red' : 'transparent';

                    // Check localStorage for the read checkbox state
                    const isRead = JSON.parse(localStorage.getItem(link));
                    readCheckbox.checked = isRead || false; // Set the initial state

                    // Append all elements to the article
                    article.appendChild(importantSymbol); // Add the red "!" first
                    article.appendChild(importantCheckbox); // Hidden checkbox for toggling
                    article.appendChild(readCheckbox); // Read checkbox
                    article.appendChild(linkElement);
                    article.appendChild(summarizeButton);

                    // Append the article to the news list
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
    fetchNews('ConsiliumNews.txt', 'consilium-news-list'); // Consilium News
    fetchNews('EBnews.txt', 'eurobarometer-news-list'); // Eurobarometer News
    fetchNews('EESCnews.txt', 'eesc-news-list'); // EESC News

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
