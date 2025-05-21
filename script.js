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
                            <button class="save-button">SAVE</button> <!-- New SAVE button -->
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

                    // Add SAVE button functionality
                    const saveButton = article.querySelector('.save-button');
                    saveButton.addEventListener('click', () => {
                        saveLink(title, link); // Call saveLink function
                    });

                    newsList.appendChild(article);
                });

                // Update the last updated date
                updateLastUpdatedDate(); 
                displaySavedLinks(); // Load saved links after fetching news
            })
            .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
    }

    // Function to save the link to Saved Links section and localStorage
    function saveLink(title, link) {
        // Retrieve existing saved links from localStorage
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
        // Check if the link is already saved
        if (!savedLinks.find(saved => saved.link === link)) {
            savedLinks.push({ title, link }); // Add new saved link
            localStorage.setItem('savedLinks', JSON.stringify(savedLinks)); // Save to localStorage
            displaySavedLinks(); // Update display
        }
    }

    // Function to save all current links to a .txt file
    function saveLinksAsTxt() {
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
        if (savedLinks.length === 0) {
            alert("No links to save.");
            return;
        }

        // Create a string for the text file
        let txtContent = savedLinks.map(item => `${item.title}: ${item.link}`).join('\n');

        // Create a Blob and an anchor element to download the file
        const blob = new Blob([txtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'saved_links.txt'; // Filename for download
        document.body.appendChild(a); // Append anchor to body
        a.click(); // Programmatically click the anchor to trigger download
        document.body.removeChild(a); // Remove the anchor from the document
        URL.revokeObjectURL(url); // Release the object URL
    }

    // Function to display saved links from localStorage
    function displaySavedLinks() {
        const savedLinksList = document.getElementById('saved-links-list');
        savedLinksList.innerHTML = ''; // Clear existing items

        // Retrieve saved links from localStorage
        const savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
        savedLinks.forEach(item => {
            const savedArticle = document.createElement('article');
            savedArticle.innerHTML = `
                <label>
                    <a href="${item.link}" target="_blank">${item.title}</a>
                    <button class="remove-button">Remove</button> <!-- Button to remove saved link -->
                </label>
            `;

            // Add functionality to remove the saved link
            const removeButton = savedArticle.querySelector('.remove-button');
            removeButton.addEventListener('click', () => {
                const updatedLinks = savedLinks.filter(saved => saved.link !== item.link);
                localStorage.setItem('savedLinks', JSON.stringify(updatedLinks));
                displaySavedLinks(); // Update display after removal
            });

            savedLinksList.appendChild(savedArticle);
        });

        // Add the SAVE TXT button at the bottom of saved links
        const saveTxtButton = document.createElement('button');
        saveTxtButton.textContent = 'SAVE TXT';
        saveTxtButton.className = 'save-txt-button'; // Add a class for styling if needed
        saveTxtButton.addEventListener('click', saveLinksAsTxt);
        savedLinksList.appendChild(saveTxtButton);
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

    // Only run this on mobile
    if (window.innerWidth <= 768) {
        const headers = document.querySelectorAll('.news-section h2');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                // Remove fixed class from all headers
                headers.forEach(h => h.classList.remove('fixed-category-header'));
                // Add to the clicked one if its section is open
                const newsList = header.nextElementSibling;
                if (newsList && newsList.style.display !== 'none') {
                    header.classList.add('fixed-category-header');
                }
            });
        });
    }

    // Load saved links on page load
    displaySavedLinks();

    function updateFixedHeader() {
        // Remove the class from all headers
        document.querySelectorAll('.news-section h2').forEach(h2 => {
            h2.classList.remove('fixed-category-header');
        });
        // Find the open section and add the class to its header
        document.querySelectorAll('.news-section').forEach(section => {
            const newsList = section.querySelector('.news-list');
            if (newsList && newsList.style.display !== 'none') {
                const header = section.querySelector('h2');
                if (header) header.classList.add('fixed-category-header');
            }
        });
    }

    // Attach click listeners to all headers
    document.querySelectorAll('.news-section h2').forEach(h2 => {
        h2.addEventListener('click', () => {
            setTimeout(updateFixedHeader, 10); // Slight delay to allow toggle
        });
    });

    // Initial call in case a section is open by default
    updateFixedHeader();
});
