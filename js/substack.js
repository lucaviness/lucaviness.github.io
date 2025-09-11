/**
 * Displays a post in the container
 */
function displayPost(post, container) {
    const postElement = document.createElement('li');
    postElement.className = 'post';
    
    const date = new Date(post.pubDate);
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    postElement.innerHTML = `
        ${formattedDate}: <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a>
    `;
    
    container.innerHTML = '';
    container.appendChild(postElement);
}

/**
 * Fetches the latest Substack post from API
 */
async function fetchLatestPost() {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://lucandjeremi.substack.com/feed');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.items[0] || null;
    } catch (error) {
        console.error('Error fetching Substack posts:', error);
        return null;
    }
}

/**
 * Loads and displays the latest Substack post with caching
 */
async function loadSubstackPosts() {
    const postsContainer = document.getElementById('substack-posts');
    if (!postsContainer) {
        console.error('Substack posts container not found');
        return;
    }

    // Try to load cached post first
    const cachedPost = localStorage.getItem('latestSubstackPost');
    if (cachedPost) {
        try {
            const post = JSON.parse(cachedPost);
            displayPost(post, postsContainer);
        } catch (error) {
            console.error('Error parsing cached post:', error);
        }
    } else {
        // Show loading if no cache
        postsContainer.innerHTML = '<li>Loading...</li>';
    }

    // Fetch latest post from API
    const latestPost = await fetchLatestPost();
    
    if (latestPost) {
        // Check if this is newer than cached post
        const cachedPost = localStorage.getItem('latestSubstackPost');
        let shouldUpdate = true;
        
        if (cachedPost) {
            try {
                const cached = JSON.parse(cachedPost);
                const cachedDate = new Date(cached.pubDate);
                const latestDate = new Date(latestPost.pubDate);
                shouldUpdate = latestDate > cachedDate;
            } catch (error) {
                console.error('Error comparing posts:', error);
            }
        }
        
        if (shouldUpdate) {
            // Update cache and display
            localStorage.setItem('latestSubstackPost', JSON.stringify(latestPost));
            displayPost(latestPost, postsContainer);
        }
    } else if (!cachedPost) {
        // Only show error if we don't have cached content
        postsContainer.innerHTML = '<li>Unable to load latest post</li>';
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSubstackPosts); 
