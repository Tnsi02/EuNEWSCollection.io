document.querySelectorAll('.toggle-comment').forEach(button => {
    button.addEventListener('click', function() {
        const commentSection = this.nextElementSibling;
        
        // Toggle the visibility of the comment section
        if (commentSection.style.display === 'none') {
            commentSection.style.display = 'block';
            this.textContent = '-';  // Change to "-" when opened
        } else {
            commentSection.style.display = 'none';
            this.textContent = '+';  // Revert to "+" when closed
        }
    });
});

document.querySelectorAll('.submit-comment').forEach(button => {
    button.addEventListener('click', function() {
        const commentSection = this.closest('.comment-section');
        const textarea = commentSection.querySelector('textarea');
        const commentList = commentSection.querySelector('.comments-list');
        
        // Get the comment text
        const commentText = textarea.value;
        
        if (commentText.trim()) {
            // Create a new comment element
            const commentItem = document.createElement('div');
            commentItem.textContent = commentText;
            commentList.appendChild(commentItem);
            
            // Clear the textarea
            textarea.value = '';
        }
    });
});
