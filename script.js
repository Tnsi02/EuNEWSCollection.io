// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBqLFu6RNnLEEAcfsZjBOc9XRq0yeV7AZE",
        authDomain: "githubcommentsave.firebaseapp.com",
        projectId: "githubcommentsave",
        storageBucket: "githubcommentsave.appspot.com",
        messagingSenderId: "862888877466",
        appId: "1:862888877466:web:1e3dac99b1b7354409ae23"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

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

    // Function to fetch comments from Firestore
    function fetchComments() {
        const commentsContainer = document.getElementById('comments-container');
        const commentsQuery = query(collection(db, 'comments'), orderBy('timestamp', 'desc'));
        
        getDocs(commentsQuery)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const comment = document.createElement('div');
                    comment.textContent = doc.data().text; // Use the text from Firestore
                    comment.className = 'comment';
                    commentsContainer.appendChild(comment);
                });
            })
            .catch(error => console.error('Error fetching comments:', error));
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
            const comment = { text: commentText, timestamp: serverTimestamp() };

            // Save comment to Firestore
            addDoc(collection(db, 'comments'), comment)
                .then(() => {
                    const commentDiv = document.createElement('div');
                    commentDiv.textContent = commentText;
                    commentDiv.className = 'comment';
                    const commentsContainer = document.getElementById('comments-container');
                    commentsContainer.appendChild(commentDiv); // Add comment to the container

                    commentInput.value = ''; // Clear input field
                    commentsContainer.scrollTop = commentsContainer.scrollHeight; // Scroll to the bottom
                })
                .catch(error => console.error('Error adding comment:', error));
        }
    });

    // Fetch comments when the page loads
    fetchComments();
});
