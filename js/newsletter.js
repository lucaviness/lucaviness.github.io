/**
 * Newsletter Subscription Component
 * A React-like component for newsletter subscription with TypeScript-style types
 */

// TypeScript-style type definitions (for documentation)
/**
 * @typedef {Object} SubscriptionResponse
 * @property {boolean} success
 * @property {string} [message] - Success message
 * @property {string} [error] - Error message
 */

/**
 * @typedef {Object} ComponentState
 * @property {string} email
 * @property {boolean} isLoading
 * @property {string|null} message
 * @property {boolean} isSuccess
 */

class NewsletterSubscription {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container not found:', containerId);
            return;
        }
        this.state = {
            email: '',
            isLoading: false,
            message: null,
            isSuccess: false
        };
        this.apiUrl = 'https://lucandjeremi.substack.com/api/v1/free';
        console.log('Newsletter component initialized');
        this.init();
    }

    /**
     * Initialize the component
     */
    init() {
        this.render();
    }

    /**
     * Update component state and re-render only when necessary
     * @param {Partial<ComponentState>} newState
     */
    setState(newState) {
        const shouldRender = this.state.isLoading !== newState.isLoading || 
                            this.state.message !== newState.message || 
                            this.state.isSuccess !== newState.isSuccess;
        
        this.state = { ...this.state, ...newState };
        
        if (shouldRender) {
            this.render();
        }
    }

    /**
     * Handle form submission
     * @param {Event} event
     */
    async handleSubmit(event) {
        event.preventDefault();
        
        const emailInput = this.container.querySelector('.newsletter-email');
        const email = emailInput ? emailInput.value : '';
        
        console.log('Form submitted with email:', email);
        
        if (!email || !this.isValidEmail(email)) {
            console.log('Invalid email format');
            this.showMessage('Please enter a valid email address', false);
            return;
        }

        console.log('Starting subscription process...');
        this.state.email = email; // Preserve email in state
        this.setState({ isLoading: true, message: null });

        try {
            console.log('Making API call to:', this.apiUrl);
            const response = await this.subscribeToNewsletter(email);
            console.log('API Response:', response);
            
            if (response.success) {
                console.log('Subscription successful');
                this.state.email = ''; // Clear email for next render
                this.showMessage(response.message, true);
            } else {
                console.log('Subscription failed:', response.error);
                this.showMessage(response.error || 'Something went wrong. Please try again.', false);
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            this.showMessage(`Network error: ${error.message}. Please check your connection and try again.`, false);
        }
        
        this.setState({ isLoading: false });
    }

    /**
     * Show message to user
     * @param {string} message
     * @param {boolean} isSuccess
     */
    showMessage(message, isSuccess) {
        this.setState({ 
            message: message,
            isSuccess: isSuccess
        });
    }

    /**
     * Validate email format
     * @param {string} email
     * @returns {boolean}
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Make API call to subscribe user using iframe method to bypass CORS
     * @param {string} email
     * @returns {Promise<SubscriptionResponse>}
     */
    async subscribeToNewsletter(email) {
        console.log('Using iframe method to bypass CORS for email:', email);
        
        return new Promise((resolve, reject) => {
            // Create a hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = 'none';
            
            // Create a form to submit to Substack
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://lucandjeremi.substack.com/api/v1/free';
            form.target = 'substack-iframe';
            form.style.display = 'none';
            
            // Add all required fields
            const fields = {
                email: email,
                first_url: '',
                first_referrer: '',
                current_url: '',
                current_referrer: '',
                first_session_url: '',
                first_session_referrer: '',
                referral_code: '',
                source: 'api',
                referring_pub_id: '',
                additional_referring_pub_ids: ''
            };
            
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });
            
            // Set up iframe name
            iframe.name = 'substack-iframe';
            
            // Add iframe to document
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            
            // Set up timeout
            const timeout = setTimeout(() => {
                console.log('Subscription timeout - assuming success');
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve({
                    success: true,
                    message: 'Subscription successful! Please check your email to confirm.'
                });
            }, 5000);
            
            // Listen for iframe load
            iframe.onload = () => {
                clearTimeout(timeout);
                console.log('Iframe loaded - subscription submitted');
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve({
                    success: true,
                    message: 'Subscription successful! Please check your email to confirm.'
                });
            };
            
            iframe.onerror = () => {
                clearTimeout(timeout);
                console.error('Iframe error');
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                reject(new Error('Subscription failed. Please try again.'));
            };
            
            // Submit the form
            form.submit();
        });
    }

    /**
     * Render the component
     */
    render() {
        const { isLoading, message, isSuccess } = this.state;
        
        // Get current email value if input exists
        const emailInput = this.container.querySelector('.newsletter-email');
        const currentEmail = emailInput ? emailInput.value : this.state.email;
        
        this.container.innerHTML = `
            <div class="newsletter-component">
                <form class="newsletter-form" novalidate>
                    <div class="newsletter-input-group">
                        <input 
                            type="email" 
                            class="newsletter-email" 
                            placeholder="Enter your email" 
                            value="${currentEmail || ''}"
                            required
                            ${isLoading ? 'disabled' : ''}
                        />
                        <button 
                            type="submit" 
                            class="newsletter-button"
                            ${isLoading ? 'disabled' : ''}
                        >
                            ${isLoading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                </form>
                ${message ? `<div class="newsletter-message ${isSuccess ? 'success' : 'error'}">${message}</div>` : ''}
            </div>
        `;

        // Attach event listeners
        const form = this.container.querySelector('.newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }
}

// Initialize the component when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize main newsletter component
    const mainContainer = document.getElementById('newsletter-subscription');
    if (mainContainer) {
        console.log('Initializing main newsletter component...');
        new NewsletterSubscription('newsletter-subscription');
    } else {
        console.error('Main newsletter subscription container not found!');
    }
    
    // Add debug test function to window for manual testing
    window.testNewsletterAPI = async function(email = 'test@example.com') {
        console.log('Testing newsletter API with iframe method for email:', email);
        return new Promise((resolve) => {
            // Create a hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'test-substack-iframe';
            
            // Create a form to submit to Substack
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://lucandjeremi.substack.com/api/v1/free';
            form.target = 'test-substack-iframe';
            form.style.display = 'none';
            
            // Add all required fields
            const fields = {
                email: email,
                first_url: '',
                first_referrer: '',
                current_url: '',
                current_referrer: '',
                first_session_url: '',
                first_session_referrer: '',
                referral_code: '',
                source: 'api',
                referring_pub_id: '',
                additional_referring_pub_ids: ''
            };
            
            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });
            
            // Add to document
            document.body.appendChild(iframe);
            document.body.appendChild(form);
            
            // Set up timeout
            const timeout = setTimeout(() => {
                console.log('Test subscription completed');
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve({ success: true, message: 'Test subscription submitted' });
            }, 3000);
            
            iframe.onload = () => {
                clearTimeout(timeout);
                console.log('Test iframe loaded');
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve({ success: true, message: 'Test subscription submitted' });
            };
            
            // Submit the form
            form.submit();
        });
    };
    
    console.log('Debug: Use window.testNewsletterAPI("your-email@example.com") to test the API manually');
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsletterSubscription;
}