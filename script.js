// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

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

document.addEventListener('DOMContentLoaded', async () => {
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

        // Load comments from Firestore
        await loadComments(link, commentsList);

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

                // Save the comment to Firestore
                await saveComment(link, { time: currentTime, text: commentText });
            }
        });

        return article;
    };

    // Load comments from Firestore
    const loadComments = async (link, commentList) => {
        const querySnapshot = await getDocs(collection(db, "comments"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.link === link) {
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');
                commentDiv.innerHTML = `<strong>${data.time}</strong>: ${data.text}`;
                commentList.appendChild(commentDiv);
            }
        });
    };

    // Save comment to Firestore
    const saveComment = async (link, comment) => {
        await addDoc(collection(db, "comments"), {
            link: link,
            time: comment.time,
            text: comment.text
        });
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
