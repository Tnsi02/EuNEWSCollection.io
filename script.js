body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

header {
    text-align: left;
    margin-bottom: 30px; /* Increased space between headline and elements below */
    position: relative;
}

.header-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px; /* Space between the header and summarize button */
}

h1 {
    margin: 0;
}

#last-updated-date {
    margin-left: 20px;
    font-size: 14px;
    color: #555;
}

.main-content {
    display: flex;
    flex-wrap: wrap;
}

.news-container {
    flex: 1;
    margin-right: 20px;
}

.news-section {
    margin-bottom: 20px;
}

.news-section h2 {
    margin-top: 0;
    cursor: pointer;
    transition: color 0.3s ease;
}

.news-section h2:hover {
    color: #4183c4;
}

.news-list {
    display: none;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
}

article {
    margin-bottom: 15px;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: background-color 0.3s;
}

article a {
    color: #333;
    text-decoration: none;
}

article:hover {
    background-color: #f0f0f0;
}

.toggle-sign {
    cursor: pointer;
    margin-left: 10px;
    font-weight: bold;
    padding: 5px 10px;
    border: 2px solid black; /* Default border */
    border-radius: 50%;
    background-color: transparent;
    color: black; /* Default color */
    transition: color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
}

.toggle-sign.toggled {
    color: red; /* Red when toggled */
    border-color: red; /* Red border when toggled */
}

.toggle-sign:hover {
    background-color: #f0f0f0;
}

.summarize-button {
    margin-top: 20px;
    margin-left: 30px;
    padding: 5px 10px;
    background-color: #4183c4;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.summarize-button:hover {
    background-color: #357abd;
}

/* Media query for responsiveness */
@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
    }

    .disqus-container {
        width: 100%;
        margin-top: 30px;
    }

    header {
        text-align: center;
    }

    #last-updated-date {
        margin-left: 0;
        text-align: center;
    }
}
