/**
 * LearnWorlds SSO Authentication Module
 * Handles SSO token validation, session management, and API authentication
 */

const AUTH_CONFIG = {
  API_BASE_URL: window.location.origin,
  SSO_VALIDATE_ENDPOINT: '/api/learnworlds/sso/validate',
  PROGRESS_ENDPOINT: '/api/user/progress',
  SESSION_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    PROGRESS: 'progress'
  }
};

class AuthManager {
  constructor() {
    this.apiBaseUrl = AUTH_CONFIG.API_BASE_URL;
  }

  /**
   * Initialize authentication on page load
   * @returns {Promise<Object>} Authentication result with user and progress data
   */
  async initialize() {
    try {
      // Check for SSO token in URL
      const urlParams = new URLSearchParams(window.location.search);

      // NEW: Check for direct JWT token (from LearnWorlds External Link redirect)
      const jwtToken = urlParams.get('token');

      if (jwtToken) {
        // Store token directly (already validated by backend)
        // We'll fetch user data on first API call
        sessionStorage.setItem(AUTH_CONFIG.SESSION_KEYS.AUTH_TOKEN, jwtToken);

        // Clean up URL
        this.cleanupURL(['token']);

        // Try to fetch user progress
        try {
          const progress = await this.getProgress();
          // Extract user info from JWT (optional, for immediate display)
          const userInfo = this.decodeJWT(jwtToken);

          return {
            authenticated: true,
            user: userInfo,
            progress: progress
          };
        } catch (error) {
          console.error('Error fetching progress after token auth:', error);
          // Still authenticated, just no progress data yet
          return {
            authenticated: true,
            user: this.decodeJWT(jwtToken),
            progress: null
          };
        }
      }

      // LEGACY: Check for HMAC-based SSO token
      const ssoToken = urlParams.get('sso');
      const timestamp = urlParams.get('timestamp');
      const email = urlParams.get('email');
      const userId = urlParams.get('user_id');

      if (ssoToken && timestamp && email && userId) {
        // Validate SSO token via backend
        const result = await this.validateSSO(ssoToken, timestamp, email, userId);

        // Clean up URL
        this.cleanupURL(['sso', 'timestamp', 'email', 'user_id']);

        return result;
      }

      // Check for existing session
      const existingSession = this.getSession();
      if (existingSession) {
        return {
          authenticated: true,
          user: existingSession.user,
          progress: existingSession.progress
        };
      }

      // No authentication available
      return {
        authenticated: false,
        message: 'Authentication required'
      };

    } catch (error) {
      console.error('Authentication initialization error:', error);
      return {
        authenticated: false,
        error: error.message
      };
    }
  }

  /**
   * Validate SSO token with backend
   * @param {string} sso - SSO token
   * @param {string} timestamp - Timestamp
   * @param {string} email - User email
   * @param {string} userId - LearnWorlds user ID
   * @returns {Promise<Object>} Validation result
   */
  async validateSSO(sso, timestamp, email, userId) {
    try {
      const url = new URL(AUTH_CONFIG.SSO_VALIDATE_ENDPOINT, this.apiBaseUrl);
      url.searchParams.append('sso', sso);
      url.searchParams.append('timestamp', timestamp);
      url.searchParams.append('email', email);
      url.searchParams.append('user_id', userId);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `SSO validation failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.token) {
        // Store session data
        this.setSession(data.token, data.user, data.progress);

        return {
          authenticated: true,
          user: data.user,
          progress: data.progress
        };
      }

      throw new Error('Invalid SSO response format');

    } catch (error) {
      console.error('SSO validation error:', error);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Store session data in sessionStorage
   * @param {string} token - JWT token
   * @param {Object} user - User data
   * @param {Object} progress - Progress data
   */
  setSession(token, user, progress) {
    sessionStorage.setItem(AUTH_CONFIG.SESSION_KEYS.AUTH_TOKEN, token);
    sessionStorage.setItem(AUTH_CONFIG.SESSION_KEYS.USER, JSON.stringify(user));
    sessionStorage.setItem(AUTH_CONFIG.SESSION_KEYS.PROGRESS, JSON.stringify(progress));
  }

  /**
   * Get session data from sessionStorage
   * @returns {Object|null} Session data or null if not found
   */
  getSession() {
    const token = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEYS.AUTH_TOKEN);
    const userStr = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEYS.USER);
    const progressStr = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEYS.PROGRESS);

    if (!token || !userStr) {
      return null;
    }

    try {
      return {
        token,
        user: JSON.parse(userStr),
        progress: progressStr ? JSON.parse(progressStr) : null
      };
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  /**
   * Clear session data
   */
  clearSession() {
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEYS.AUTH_TOKEN);
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEYS.USER);
    sessionStorage.removeItem(AUTH_CONFIG.SESSION_KEYS.PROGRESS);
  }

  /**
   * Clean up auth parameters from URL
   * @param {Array<string>} params - Parameters to remove (default: all auth params)
   */
  cleanupURL(params = ['sso', 'timestamp', 'email', 'user_id', 'token']) {
    const url = new URL(window.location.href);
    params.forEach(param => url.searchParams.delete(param));

    // Use replaceState to avoid adding to browser history
    window.history.replaceState({}, document.title, url.toString());
  }

  /**
   * Decode JWT token to extract user info (without verification)
   * Note: Token is already verified by backend, this is just for display
   * @param {string} token - JWT token
   * @returns {Object} Decoded user info
   */
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return {
        email: 'Unknown',
        id: 'unknown'
      };
    }
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async authenticatedFetch(endpoint, options = {}) {
    const session = this.getSession();

    if (!session || !session.token) {
      throw new Error('No authentication token available');
    }

    // Add Authorization header
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${session.token}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
        ...options,
        headers
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearSession();
        throw new Error('Session expired. Please log in again.');
      }

      return response;

    } catch (error) {
      // Handle network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        throw new Error('Connection error. Please check your internet connection.');
      }
      throw error;
    }
  }

  /**
   * Get user progress from backend
   * @returns {Promise<Object>} Progress data
   */
  async getProgress() {
    try {
      const response = await this.authenticatedFetch(AUTH_CONFIG.PROGRESS_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.status}`);
      }

      const data = await response.json();

      // Update cached progress
      sessionStorage.setItem(AUTH_CONFIG.SESSION_KEYS.PROGRESS, JSON.stringify(data));

      return data;

    } catch (error) {
      console.error('Error fetching progress:', error);
      throw error;
    }
  }

  /**
   * Display error message to user
   * @param {string} message - Error message
   * @param {string} type - Error type (error, warning, info)
   */
  showError(message, type = 'error') {
    // Create error container if it doesn't exist
    let errorContainer = document.getElementById('auth-error-container');

    if (!errorContainer) {
      errorContainer = document.createElement('div');
      errorContainer.id = 'auth-error-container';
      errorContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10000;
        max-width: 500px;
        width: 90%;
      `;
      document.body.appendChild(errorContainer);
    }

    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = `auth-error auth-error-${type}`;
    errorDiv.style.cssText = `
      background: ${type === 'error' ? '#f44336' : '#ff9800'};
      color: white;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;

    errorDiv.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()" style="
        background: transparent;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0 0 0 16px;
      ">&times;</button>
    `;

    errorContainer.appendChild(errorDiv);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  /**
   * Redirect to login or show authentication required message
   */
  requireAuthentication() {
    this.showError('Authentication required. Please access this tool from LearnWorlds.', 'warning');

    // Optionally hide the main content
    const mainContent = document.querySelector('main') || document.body;
    mainContent.style.opacity = '0.3';
    mainContent.style.pointerEvents = 'none';
  }

  /**
   * Check if user has unlocked a specific tool
   * @param {Object} progress - Progress data
   * @param {string} toolSlug - Tool slug to check
   * @returns {boolean} True if tool is unlocked
   */
  isToolUnlocked(progress, toolSlug) {
    if (!progress) return false;

    // Check in current_unlocked array
    if (progress.current_unlocked) {
      const unlocked = progress.current_unlocked.some(tool => tool.tool_slug === toolSlug);
      if (unlocked) return true;
    }

    // Check in completed_tools array
    if (progress.completed_tools) {
      const completed = progress.completed_tools.some(tool => tool.tool_slug === toolSlug);
      if (completed) return true;
    }

    return false;
  }

  /**
   * Check if tool is completed
   * @param {Object} progress - Progress data
   * @param {string} toolSlug - Tool slug to check
   * @returns {boolean} True if tool is completed
   */
  isToolCompleted(progress, toolSlug) {
    if (!progress || !progress.completed_tools) return false;
    return progress.completed_tools.some(tool => tool.tool_slug === toolSlug);
  }
}

// Create global instance
window.authManager = new AuthManager();
