fetch('news.txt')
    .then(response => response.text())
    .then(data => {
        const newsList = document.getElementById('news-list');
        const articles = data.split('\n'); // Split by new line

        articles.forEach(article => {
            if (article.trim()) { // Check for empty lines
                const [title, link] = article.split(' - '); // Split title and link
                const listItem = document.createElement('li');
                const anchor = document.createElement('a');
                anchor.href = link; // Set the link
                anchor.textContent = title; // Set the title text
                listItem.appendChild(anchor); // Append anchor to list item
                newsList.appendChild(listItem); // Append list item to the news list
            }
        });
    })
    .catch(error => console.error('Error loading news:', error));
