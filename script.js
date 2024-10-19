<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News List with Toggle and Summarize</title>
    <style>
        .important-toggle {
            cursor: pointer;
            font-size: 20px;
            color: black; /* Default color */
            background-color: black; /* Default background */
            border: 2px solid black; /* Default border */
            border-radius: 5px;
            padding: 5px;
            margin-left: 10px;
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }

        .important-toggle:hover {
            border-color: red;
            color: red;
        }

        .important-toggle.active {
            color: red;
            background-color: red;
            border-color: red;
        }

        .important-toggle.inactive {
            color: black;
            background-color: black;
            border-color: black;
        }

        .news-list {
            margin-top: 20px;
        }

        .news-item {
            margin-bottom: 15px;
        }

        .news-item label {
            display: flex;
            align-items: center;
        }

        .news-item a {
            margin-left: 10px;
            color: #1bd9f7;
            text-decoration: none;
        }

        .news-item a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>

<div class="news-section">
    <h2>Featured News</h2>
    <div class="news-list" id="news-list"></div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const newsData = [
            {
                title: "European Council discusses climate policy",
                link: "https://example.com/climate-policy"
            },
            {
                title: "New budget for EU recovery plan announced",
                link: "https://example.com/recovery-plan"
            },
            {
                title: "EU Parliament votes on new trade agreements",
                link: "https://example.com/trade-agreements"
            }
        ];

        // Function to fetch and render news items
        function renderNews() {
            const newsList = document.getElementById('news-list');
            newsList.innerHTML = ''; // Clear the news list

            newsData.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.innerHTML = `
                    <label>
                        <span class="important-toggle inactive" data-important="false">!</span> <!-- Black initially -->
                        <input type="checkbox" class="like-checkbox" /> <!-- Like checkbox -->
                        <a href="${news.link}" target="_blank">${news.title}</a>
                    </label>
                `;

                const importantToggle = newsItem.querySelector('.important-toggle');
                const likeCheckbox = newsItem.querySelector('.like-checkbox');

                // Clicking the important button toggles the state (Black/Red)
                importantToggle.addEventListener('click', () => {
                    const isActive = importantToggle.getAttribute('data-important') === 'true';

                    if (isActive) {
                        importantToggle.classList.remove('active');
                        importantToggle.classList.add('inactive');
                        importantToggle.setAttribute('data-important', 'false');
                    } else {
                        importantToggle.classList.remove('inactive');
                        importantToggle.classList.add('active');
                        importantToggle.setAttribute('data-important', 'true');
                    }
                });

                // Like checkbox remains independent (it doesn't toggle with important button)
                likeCheckbox.addEventListener('change', () => {
                    if (likeCheckbox.checked) {
                        console.log(`Liked: ${news.title}`);
                    } else {
                        console.log(`Unliked: ${news.title}`);
                    }
                });

                newsList.appendChild(newsItem);
            });
        }

        renderNews(); // Initial render of news
    });
</script>

</body>
</html>
