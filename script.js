document.addEventListener('DOMContentLoaded', () => {
    const textFiles = [
        'https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/ECnews.txt',
        'https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/EPnews.txt',
        'https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/EEASnews.txt'
    ];

    async function fetchTextFile(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status}`);
        }
        return response.text();
    }

    async function getLastUpdated() {
        const fileFetchPromises = textFiles.map(async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.error(`Failed to fetch ${url}: ${response.status}`);
                    return null; // Return null for failed requests
                }
                const lastModified = response.headers.get('Last-Modified');
                console.log(`Last modified for ${url}: ${lastModified}`); // Log the last modified date
                return lastModified;
            } catch (error) {
                console.error(`Error fetching ${url}:`, error);
                return null; // Return null for errors
            }
        });

        const lastModifiedDates = await Promise.all(fileFetchPromises);
        return lastModifiedDates;
    }

    async function displayLastUpdated() {
        const lastUpdatedDates = await getLastUpdated();
        const validDates = lastUpdatedDates.filter(date => date !== null); // Filter out any null values
        const lastUpdatedElement = document.getElementById('last-updated-date');

        if (validDates.length > 0) {
            const latestDate = new Date(Math.max(...validDates.map(date => new Date(date))));
            lastUpdatedElement.textContent = `Last updated: ${latestDate.toUTCString()}`;
        } else {
            lastUpdatedElement.textContent = `Last updated: Unable to fetch date`;
            console.warn('No valid last modified dates found.');
        }
    }

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
                    const [title, link] = item.split(' - '); // Split the title and link
                    const encodeLink = encodeURIComponent(link); // Encode the link
                    const summarizeUrl = `https://www.phind.com/search?q=summarise+this%3A+${encodeLink}`; // Create summarize URL
                    const article = document.createElement('article');
                    article.innerHTML = `
                        <label>
                            <input type="checkbox" class="news-read-checkbox" />
                            <a href="${link}" target="_blank">${title}</a>
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
            })
            .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
    }

    // Fetch news data
    fetchNews('https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/EPnews.txt', 'ep-news-list');
    fetchNews('https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/ECnews.txt', 'commission-news-list');
    fetchNews('https://raw.githubusercontent.com/Tnsi02/EuNEWSCollection.io/main/EEASnews.txt', 'external-action-news-list');

    // Display the last updated date
    displayLastUpdated();

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
