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
 * Fetches the latest Substack post from RSS feed
 */
async function fetchLatestPost() {
    try {
        // Try RSS2JSON first
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://lucandjeremi.substack.com/feed');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Check if we got a recent post (within last 7 days)
        if (data.items && data.items.length > 0) {
            const latestPost = data.items[0];
            const postDate = new Date(latestPost.pubDate);
            const now = new Date();
            const daysDiff = (now - postDate) / (1000 * 60 * 60 * 24);
            
            // If the post is recent (within 7 days), use it
            if (daysDiff <= 7) {
                return latestPost;
            }
        }
        
        // If RSS2JSON doesn't have recent posts, try parsing RSS directly
        console.log('RSS2JSON may be outdated, trying direct RSS parsing...');
        return await fetchLatestPostFromRSS();
        
    } catch (error) {
        console.error('Error fetching from RSS2JSON, trying direct RSS:', error);
        return await fetchLatestPostFromRSS();
    }
}

/**
 * Fetches the latest post by parsing RSS feed directly
 */
async function fetchLatestPostFromRSS() {
    try {
        const response = await fetch('https://lucandjeremi.substack.com/feed');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const xmlText = await response.text();
        
        // Parse the RSS XML to get the latest post
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const items = xmlDoc.querySelectorAll('item');
        if (items.length === 0) {
            return null;
        }
        
        const latestItem = items[0];
        const title = latestItem.querySelector('title')?.textContent || '';
        const link = latestItem.querySelector('link')?.textContent || '';
        const pubDate = latestItem.querySelector('pubDate')?.textContent || '';
        const description = latestItem.querySelector('description')?.textContent || '';
        
        return {
            title: title,
            link: link,
            pubDate: pubDate,
            description: description
        };
        
    } catch (error) {
        console.error('Error fetching from direct RSS:', error);
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
        postsContainer.innerHTML = '<li>Loading...</li>';
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
        postsContainer.innerHTML = '<li>Unable to load latest post</li>';
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadSubstackPosts); 
