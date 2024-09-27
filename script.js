// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqLFu6RNnLEEAcfsZjBOc9XRq0yeV7AZE",
    authDomain: "githubcommentsave.firebaseapp.com",
    projectId: "githubcommentsave",
    storageBucket: "githubcommentsave.appspot.com",
    messagingSenderId: "862888877466",
    appId: "1:862888877466:web:1e3dac99b1b7354409ae23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
                <div class="comment-list"></div>
                <textarea placeholder="Write a comment..."></textarea>
                <button class="submit-comment">Submit</button>
            </div>
        `;

        // Initialize comments for this news item
        const commentsList = article.querySelector('.comment-list');
        const commentsKey = `comments_${link}`; // Unique key for each article based on link

        // Load comments from Firestore
        fetchComments(title, commentsList);

        // Toggle comment section visibility
        const toggleButton = article.querySelector('.toggle-comments');
        const commentsSection = article.querySelector('.comments-section');

        toggleButton.addEventListener('click', () => {
            commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        });

        // Handle comment submission
        const submitButton = article.querySelector('.submit-comment');
        submitButton.addEventListener('click', async () => {
            const commentText = commentsSection.querySelector('textarea').value.trim();
            if (commentText) {
                const currentTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin", hour12: false });
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');
                commentDiv.innerHTML = `<strong>${currentTime}</strong>: ${commentText}`;
                commentsList.appendChild(commentDiv);
                commentsSection.querySelector('textarea').value = ''; // Clear the textarea
                scrollToBottom(commentsList); // Scroll to the bottom

                // Save the comment to Firestore
                await addComment(title, commentText, currentTime);
            }
        });

        return article;
    };

    // Scroll to the bottom of the comments section
    const scrollToBottom = (commentList) => {
        commentList.scrollTop = commentList.scrollHeight;
    };

    // Function to fetch comments from Firestore
    const fetchComments = async (headline, commentList) => {
        try {
            const commentsRef = collection(db, 'comments');
            const q = query(commentsRef, where('headline', '==', headline), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');
                commentDiv.innerHTML = `<strong>${data.timestamp}</strong>: ${data.text}`; // Display comment with timestamp
                commentList.appendChild(commentDiv);
            });
        } catch (error) {
            console.error('Error fetching comments: ', error);
        }
    };

    // Function to add a comment to Firestore
    const addComment = async (headline, text, timestamp) => {
        try {
            await addDoc(collection(db, 'comments'), {
                headline: headline,
                text: text,
                timestamp: timestamp // Use ISO format for timestamps
            });
            console.log('Comment added!');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
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
