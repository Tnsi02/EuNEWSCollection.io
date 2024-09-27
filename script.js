// Firebase setup
const firebaseConfig = {
    apiKey: "AIzaSyBqLFu6RNnLEEAcfsZjBOc9XRq0yeV7AZE",
    authDomain: "githubcommentsave.firebaseapp.com",
    projectId: "githubcommentsave",
    storageBucket: "githubcommentsave.appspot.com",
    messagingSenderId: "862888877466",
    appId: "1:862888877466:web:1e3dac99b1b7354409ae23"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    // Fetch EP News
    fetch('EPnews.txt')
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const epNewsList = document.getElementById('ep-news-list');
            newsItems.forEach(item => {
                const [title, link] = item.split(' - ');
                const article = document.createElement('article');
                article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                epNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching EP news:', error));

    // Fetch Commission News
    fetch('ECnews.txt')
        .then(response => response.text())
        .then(data => {
            const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
            const commissionNewsList = document.getElementById('commission-news-list');
            newsItems.forEach(item => {
                const [title, link] = item.split(' - ');
                const article = document.createElement('article');
                article.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                commissionNewsList.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching Commission news:', error));

    // Toggle functionality for EP News
    const epNewsTitle = document.getElementById('ep-news-title');
    const epNewsList = document.getElementById('ep-news-list');

    epNewsTitle.addEventListener('click', () => {
        epNewsList.classList.toggle('news-list');
        const toggleSign = epNewsTitle.querySelector('.toggle');
        toggleSign.textContent = toggleSign.textContent === '+' ? '-' : '+';
    });

    // Toggle functionality for Commission News
    const commissionNewsTitle = document.getElementById('commission-news-title');
    const commissionNewsList = document.getElementById('commission-news-list');

    commissionNewsTitle.addEventListener('click', () => {
        commissionNewsList.classList.toggle('news-list');
        const toggleSign = commissionNewsTitle.querySelector('.toggle');
        toggleSign.textContent = toggleSign.textContent === '+' ? '-' : '+';
    });

    // Comment System
    const commentList = document.getElementById('comment-list');
    const commentInput = document.getElementById('comment-input');
    const submitComment = document.getElementById('submit-comment');

    // Load comments from Firestore
    const loadComments = () => {
        db.collection("comments").get().then((querySnapshot) => {
            commentList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment-item');
                commentDiv.textContent = `${data.time}: ${data.text}`;
                commentList.appendChild(commentDiv);
            });
        });
    };

    // Submit comment
    submitComment.addEventListener('click', async () => {
        const commentText = commentInput.value.trim();
        if (commentText) {
            const currentTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin", hour12: false });
            await db.collection("comments").add({ time: currentTime, text: commentText });
            commentInput.value = ''; // Clear input
            loadComments(); // Reload comments
        }
    });

    // Load comments initially
    loadComments();
});
