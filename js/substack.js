/**
 * Displays a post in the container
 */
function displayPost(post, container) {
    const date = new Date(post.pubDate);
    const options = { month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    container.innerHTML = `
        <a href="${post.link}" target="_blank" rel="noopener noreferrer">${post.title}</a> (${formattedDate})
    `;
}

/**
 * Fetches the latest Substack post from API
 */
async function fetchLatestPost() {
    try {
        // Add cache-busting parameter to ensure we get the latest data
        const timestamp = Date.now();
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://lucandjeremi.substack.com/feed&t=${timestamp}`);
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
    const cachedPostData = localStorage.getItem('latestSubstackPost');
    let cachedPost = null;
    let hasCachedPost = false;
    
    if (cachedPostData) {
        try {
            cachedPost = JSON.parse(cachedPostData);
            displayPost(cachedPost, postsContainer);
            hasCachedPost = true;
        } catch (error) {
            console.error('Error parsing cached post:', error);
        }
    }
    
    if (!hasCachedPost) {
        // Show loading if no cache
        postsContainer.innerHTML = 'Loading...';
    }

    // Fetch latest post from API
    const latestPost = await fetchLatestPost();
    
    if (latestPost) {
        // Check if the latest post is newer than the cached post
        let shouldUpdate = false;
        
        if (!cachedPost) {
            // No cached post, so update
            shouldUpdate = true;
        } else {
            // Compare publication dates
            const cachedDate = new Date(cachedPost.pubDate);
            const latestDate = new Date(latestPost.pubDate);
            
            if (latestDate > cachedDate) {
                shouldUpdate = true;
            }
        }
        
        if (shouldUpdate) {
            // Update cache and display with the newer post
            localStorage.setItem('latestSubstackPost', JSON.stringify(latestPost));
            displayPost(latestPost, postsContainer);
        }
    } else if (!hasCachedPost) {
        // Only show error if we don't have cached content
        postsContainer.innerHTML = 'Unable to load latest post';
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSubstackPosts); 
