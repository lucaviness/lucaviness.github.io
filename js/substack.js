/**
 * Fetches and displays the latest Substack post
 */
async function fetchSubstackPosts() {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://lucandjeremi.substack.com/feed');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const postsContainer = document.getElementById('substack-posts');
        if (!postsContainer) {
            console.error('Substack posts container not found');
            return;
        }

        // Display only the latest post
        const latestPost = data.items[0];
        if (!latestPost) {
            postsContainer.innerHTML = '<li>No posts available</li>';
            return;
        }

        const postElement = document.createElement('li');
        postElement.className = 'post';
        
        const date = new Date(latestPost.pubDate);
        const options = { month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);

        postElement.innerHTML = `
            ${formattedDate}: <a href="${latestPost.link}" target="_blank" rel="noopener noreferrer">${latestPost.title}</a>
        `;
        
        postsContainer.appendChild(postElement);
    } catch (error) {
        console.error('Error fetching Substack posts:', error);
        const postsContainer = document.getElementById('substack-posts');
        if (postsContainer) {
            postsContainer.innerHTML = '<li>Unable to load latest post</li>';
        }
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', fetchSubstackPosts); 