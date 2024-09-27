// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch news function
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

    // Comments functionality
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');

    // Function to fetch and display comments
    async function fetchComments() {
        const commentsCollection = collection(db, 'comments');
        const snapshot = await getDocs(commentsCollection);
        snapshot.forEach(doc => {
            const comment = doc.data();
            displayComment(comment);
        });
    }

    // Function to display a single comment
    function displayComment(comment) {
        const li = document.createElement('li');
        li.textContent = comment.text; // Assuming your comment has a "text" field
        commentList.appendChild(li);
    }

    // Handle comment submission
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const commentText = document.getElementById('comment-input').value;

        if (commentText) {
            await addDoc(collection(db, 'comments'), {
                text: commentText,
                timestamp: new Date()
            });
            document.getElementById('comment-input').value = ''; // Clear input
            displayComment({ text: commentText }); // Display immediately
        }
    });

    // Real-time listener for comments
    onSnapshot(collection(db, 'comments'), (snapshot) => {
        commentList.innerHTML = ''; // Clear current comments
        snapshot.forEach(doc => {
            const comment = doc.data();
            displayComment(comment);
        });
    });

    // Initial fetch of comments
    fetchComments();
});
