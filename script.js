// Firebase configuration (replace with your config)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

    // Add functionality for comments
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');

    // Load comments from Firestore
    function loadComments() {
        db.collection('comments').orderBy('timestamp', 'desc').get().then((snapshot) => {
            commentList.innerHTML = ''; // Clear existing comments
            snapshot.forEach(doc => {
                const comment = doc.data();
                const li = document.createElement('li');
                li.textContent = comment.text;
                commentList.appendChild(li);
            });
        });
    }

    // Submit a comment
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission

        const commentText = commentInput.value;
        if (commentText) {
            // Save the comment to Firestore
            db.collection('comments').add({
                text: commentText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                commentInput.value = ''; // Clear the input field
                loadComments(); // Reload comments
            }).catch((error) => {
                console.error('Error adding comment: ', error);
            });
        }
    });

    loadComments(); // Initial load of comments
});
