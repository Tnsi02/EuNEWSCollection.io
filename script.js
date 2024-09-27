document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch news from a specified file and update the respective news list
    function fetchNews(filePath, newsListId) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
                const newsList = document.getElementById(newsListId);

                newsItems.forEach(item => {
                    const [title, link] = item.split(' - '); // Split the title and link
                    const article = document.createElement('article');
                    article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                    newsList.appendChild(article);
                });
            })
            .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
    }

    // Fetch EP News and Commission News
    fetchNews('EPnews.txt', 'ep-news-list'); // Update this to the correct path for EPnews.txt
    fetchNews('ECnews.txt', 'commission-news-list'); // Update this to the correct path for ECnews.txt

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
    // Function to handle comment submission
    document.getElementById('submit-comment').addEventListener('click', () => {
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value.trim();

        if (commentText) {
            const comment = document.createElement('div');
            comment.textContent = commentText; // Add the comment text
            comment.className = 'comment'; // Optional: Add a class for styling

            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.appendChild(comment); // Add the comment to the container

            commentInput.value = ''; // Clear the input field
            commentsContainer.scrollTop = commentsContainer.scrollHeight; // Scroll to the bottom
        }
    });
});
