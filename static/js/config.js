// Application Configuration
const APP_CONFIG = {
    // Set to 'localStorage' for frontend-only mode, 'api' for FastAPI backend
    DATA_SOURCE: 'localStorage', // Pure frontend mode - no JSON files needed
    
    // API endpoints (used when DATA_SOURCE is 'api')
    API_BASE_URL: '',
    
    // localStorage configuration (used when DATA_SOURCE is 'localStorage')
    STORAGE_PREFIX: 'weddingcrm_',
    
    // Data structure version for migration
    DATA_VERSION: '1.0.0'
};

// Export for use in other files
window.APP_CONFIG = APP_CONFIG;