fetch('news.txt')
    .then(response => response.text())
    .then(data => {
        const newsList = document.getElementById('news-list');
        const articles = data.split('\n'); // Split by new line

        articles.forEach(article => {
            if (article.trim()) { // Check for empty lines
                const [title, link] = article.split(' - '); // Split title and link
                const newsItem = document.createElement('div'); // Create a div for the article
                newsItem.classList.add('news-item'); // Add a class for styling

                const anchor = document.createElement('a');
                anchor.href = link; // Set the link
                anchor.textContent = title; // Set the title text

                newsItem.appendChild(anchor); // Append anchor to news item
                newsList.appendChild(newsItem); // Append news item to the news list
            }
        });
    })
    .catch(error => console.error('Error loading news:', error));
