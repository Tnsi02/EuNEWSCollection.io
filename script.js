document.addEventListener('DOMContentLoaded', () => {
    // Function to create news item with comment section
    const createNewsItem = (title, link) => {
        const article = document.createElement('article');
        article.innerHTML = `
            <div>
                <a href="${link}" target="_blank">${title}</a>
                <button class="toggle-comments">+</button>
            </div>
            <div class="comments-section" style="display: none;">
                <textarea placeholder="Write a comment..."></textarea>
                <button class="submit-comment">Submit</button>
                <div class="comment-list"></div>
            </div>
        `;
        
        // Toggle comment section visibility
        const toggleButton = article.querySelector('.toggle-comments');
        const commentsSection = article.querySelector('.comments-section');
        
        toggleButton.addEventListener('click', () => {
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });

        // Handle comment submission
        const submitButton = article.querySelector('.submit-comment');
        submitButton.addEventListener('click', () => {
            const commentText = commentsSection.querySelector('textarea').value.trim();
            if (commentText) {
                const commentDiv = document.createElement('div');
                commentDiv.textContent = commentText;
                commentsSection.querySelector('.comment-list').appendChild(commentDiv);
                commentsSection.querySelector('textarea').value = ''; // Clear the textarea
            }
        });

        return article;
    };

    // Fetch EP News
    fetch('EPnews.txt') // Update this to the correct path for EPnews.txt
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const epNewsList = document.getElementById('ep-news-list');

            newsItems.forEach(item => {
                const [title, link] = item.split(' - '); // Split the title and link
                const newsItem = createNewsItem(title, link);
                epNewsList.appendChild(newsItem);
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
                const newsItem = createNewsItem(title, link);
                commissionNewsList.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching Commission news:', error));
});
