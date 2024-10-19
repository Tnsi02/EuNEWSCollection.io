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
                    const formattedTitle = title.replace(/(EU Parliament|Commission|Council|Action)/gi, '<span style="color: blue;">$1</span>');

                    // Create an article element and append to the list
                    const article = document.createElement('article');
                    article.innerHTML = `<a href="${link}" target="_blank">${formattedTitle}</a>`;
                    newsList.appendChild(article);
                });

                // Make the news list visible
                newsList.style.display = 'block';
            })
            .catch(error => {
                console.error(`Failed to fetch news from ${filePath}:`, error);
            });
    }

    // Function to toggle visibility of news sections
    function toggleNewsSection(event) {
        const section = event.target.closest('.news-section');
        const toggleSign = section.querySelector('.toggle-sign');
        const newsList = section.querySelector('.news-list');
        const isVisible = newsList.style.display === 'block';

        newsList.style.display = isVisible ? 'none' : 'block';
        toggleSign.textContent = isVisible ? '+' : '−';
    }

    // Attach event listeners to each news section to toggle visibility
    const newsSections = document.querySelectorAll('.news-section h2');
    newsSections.forEach(section => {
        section.addEventListener('click', toggleNewsSection);
    });

    // Fetch news from respective files
    fetchNews('ECnews.txt', 'featured-news-list');
    fetchNews('EPnews.txt', 'ep-news-list');
    fetchNews('Commissionnews.txt', 'commission-news-list');
    fetchNews('EEASnews.txt', 'external-action-news-list');
    fetchNews('consilium.txt', 'consilium-news-list');
    fetchNews('eurobarometer.txt', 'eurobarometer-news-list');
    fetchNews('eesc.txt', 'eesc-news-list');
});

// Function to save the note and show the status
function saveNote() {
    const noteBox = document.getElementById('note-box');
    const noteStatus = document.getElementById('note-status');
    const noteContent = noteBox.value.trim();

    if (noteContent) {
        localStorage.setItem('userNote', noteContent); // Save note to localStorage
        noteStatus.textContent = 'Note saved!';
        noteStatus.style.display = 'block';
    } else {
        noteStatus.textContent = 'Please enter some text before saving.';
        noteStatus.style.display = 'block';
    }
}
