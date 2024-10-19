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
                            <input type="checkbox" class="important-check" />
                            <input type="checkbox" class="news-read-checkbox" />
                            <a href="${link}" target="_blank">${coloredTitle}</a>
                            <button class="summarize-button" onclick="window.open('${summarizeUrl}', '_blank')">Summarize</button>
                            <button class="save-button" onclick="saveLink('${title}', '${link}')">Save</button>
                        </label>
                    `;

                    // Handle "important" checkbox state
                    const importantCheckbox = article.querySelector('.important-check');
                    const importantKey = `${link}-important`; // Use a unique key for localStorage
                    const isImportant = JSON.parse(localStorage.getItem(importantKey));
                    if (isImportant) {
                        importantCheckbox.checked = true;
                    }

                    // Save "important" checkbox state to localStorage when toggled
                    importantCheckbox.addEventListener('change', () => {
                        localStorage.setItem(importantKey, JSON.stringify(importantCheckbox.checked));
                    });

                    // Handle "read" checkbox state
                    const checkbox = article.querySelector('.news-read-checkbox');
                    const isRead = JSON.parse(localStorage.getItem(link));
                    if (isRead) {
                        checkbox.checked = true; // Mark checkbox if read
                    }

                    // Save "read" checkbox state to localStorage when toggled
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

    // Function to save a link to the local "Saved Links" section
    function saveLink(headline, link) {
        // Retrieve saved links from localStorage (or initialize empty array if none exist)
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
        
        // Check if this link is already saved
        if (!savedLinks.some(item => item.link === link)) {
            // Add the new link and headline to the saved links array
            savedLinks.push({ headline: headline, link: link });
            
            // Store the updated saved links array in localStorage
            localStorage.setItem('savedLinks', JSON.stringify(savedLinks));
            
            // Update the displayed list of saved links
            updateSavedLinks();
        } else {
            alert('This link is already saved.');
        }
    }

    // Function to update the saved links display
    function updateSavedLinks() {
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
        const savedLinksList = document.getElementById('saved-links-list');
        const noSavedLinks = document.getElementById('no-saved-links');
        
        // Clear the existing list of saved links
        savedLinksList.innerHTML = '';

        if (savedLinks.length === 0) {
            noSavedLinks.style.display = 'block'; // Show "No saved links" message
        } else {
            noSavedLinks.style.display = 'none'; // Hide if links are available

            savedLinks.forEach(item => {
                const savedLinkElement = document.createElement('div');
                savedLinkElement.classList.add('saved-link');
                savedLinkElement.innerHTML = `<a href="${item.link}" target="_blank">${item.headline}</a>`;
                savedLinksList.appendChild(savedLinkElement);
            });
        }
    }

    // Fetch news from the respective files
    fetchNews('EUFnews.txt', 'featured-news-list'); // Featured News
    fetchNews('EPnews.txt', 'ep-news-list'); // EP News
    fetchNews('ECnews.txt', 'commission-news-list'); // Commission News
    fetchNews('EEASnews.txt', 'external-action-news-list'); // External Action News
    fetchNews('ConsiliumNews.txt', 'consilium-news-list'); // Consilium News
    fetchNews('EBnews.txt', 'eurobarometer-news-list'); // Eurobarometer News
    fetchNews('EESCnews.txt', 'eesc-news-list'); // EESC News

    // Update the saved links list when the page is loaded
    updateSavedLinks();

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
