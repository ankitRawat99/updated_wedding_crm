// Loading States and Data Consistency Manager
class LoadingManager {
    constructor() {
        this.loadingStates = new Set();
    }
    
    // Ensure overlay exists before using it
    ensureOverlayExists() {
        if (!document.getElementById('loading-overlay')) {
            this.createLoadingOverlay();
        }
    }

    // Create loading overlay only when needed
    createLoadingOverlay() {
        // Check if overlay already exists
        if (document.getElementById('loading-overlay')) {
            return;
        }
        
        // Ensure document.body is available
        if (!document.body) {
            return;
        }
        
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
            align-items: center;
            justify-content: center;
        `;
        overlay.innerHTML = `
            <div style="background: white; border-radius: 8px; padding: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <div style="width: 32px; height: 32px; border: 2px solid #3b82f6; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span id="loading-text" style="color: #374151; font-weight: 500;">Loading...</span>
            </div>
        `;
        
        // Add spin animation only once
        if (!document.getElementById('loading-spinner-style')) {
            const style = document.createElement('style');
            style.id = 'loading-spinner-style';
            style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
    }

    // Show loading
    show(message = 'Loading...', key = 'default') {
        this.loadingStates.add(key);
        
        // Ensure overlay exists
        this.ensureOverlayExists();
        
        const overlay = document.getElementById('loading-overlay');
        const text = document.getElementById('loading-text');
        
        if (overlay && text) {
            text.textContent = message;
            overlay.style.display = 'flex';
            
            // Disable form interactions
            this.disableForm();
        }
    }

    // Hide loading
    hide(key = 'default') {
        this.loadingStates.delete(key);
        
        if (this.loadingStates.size === 0) {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                
                // Re-enable form interactions
                this.enableForm();
            }
        }
    }

    // Disable form
    disableForm() {
        const form = document.querySelector('form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea, button');
            inputs.forEach(input => {
                input.disabled = true;
                input.classList.add('opacity-50');
            });
        }
    }

    // Enable form
    enableForm() {
        const form = document.querySelector('form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea, button');
            inputs.forEach(input => {
                input.disabled = false;
                input.classList.remove('opacity-50');
            });
        }
    }

    // Show button loading
    showButtonLoading(buttonId, text = 'Processing...') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = `
                <div class="flex items-center justify-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ${text}
                </div>
            `;
        }
    }

    // Hide button loading
    hideButtonLoading(buttonId, originalText, originalIcon = '') {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.innerHTML = `${originalIcon} ${originalText}`;
        }
    }
}

// Data Consistency Manager
class DataConsistencyManager {
    constructor() {
        this.dataVersion = '1.0';
        this.migrationRules = [];
    }

    // Ensure data consistency
    ensureDataConsistency(orderData) {
        // Fix ID consistency - preserve existing IDs
        let finalId = orderData.id || orderData._id || orderData.order_info?.id;
        
        if (!finalId) {
            finalId = this.generateId();
        }

        // Ensure required structure with consistent ID
        orderData = {
            id: finalId,
            _id: finalId,
            status: orderData.status || 'Draft',
            created_at: orderData.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...orderData,
            // Override to ensure consistency
            id: finalId,
            _id: finalId
        };

        // Ensure nested objects exist
        orderData.client_details = orderData.client_details || {
            bride: { name: '', aadhar: '', email: '', contact: '' },
            groom: { name: '', aadhar: '', email: '', contact: '' }
        };

        orderData.pre_wedding = orderData.pre_wedding || {
            enabled: false,
            type: '',
            location: '',
            start_date: '',
            end_date: '',
            team_composition: '',
            drone: '',
            requirements: '',
            team_members: [],
            assistants: [],
            deliverables: [],
            photo_quantity: '',
            video_duration: ''
        };

        orderData.cost_factors = orderData.cost_factors || {
            travel_cost: '',
            accommodation_cost: '',
            gear_rental: '',
            drone_rental: ''
        };

        orderData.project_specs = orderData.project_specs || {
            inspiration_specification: '',
            culture_specific: '',
            category: '',
            makeup_venue: '',
            coverage_type: ''
        };

        orderData.events = orderData.events || [];
        
        orderData.deliverables = orderData.deliverables || {
            standard: [],
            addons: [],
            custom: []
        };

        orderData.payment_schedule = orderData.payment_schedule || {
            deal_amount: '',
            advance_payments: [],
            event_payments: [],
            delivery_payments: []
        };

        orderData.notes = orderData.notes || {
            personal: [],
            event: [],
            package: []
        };

        orderData.completion_status = orderData.completion_status || {
            personal: false,
            event: false,
            requirements: false,
            package: false
        };

        return orderData;
    }

    // Generate unique ID
    generateId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    // Validate data structure
    validateDataStructure(orderData) {
        const requiredFields = [
            'id', '_id', 'status', 'created_at', 'updated_at',
            'client_details', 'pre_wedding', 'cost_factors',
            'project_specs', 'events', 'deliverables',
            'payment_schedule', 'notes', 'completion_status'
        ];

        for (const field of requiredFields) {
            if (!(field in orderData)) {
                console.warn(`Missing required field: ${field}`);
                return false;
            }
        }

        return true;
    }

    // Clean data before saving
    cleanData(orderData) {
        // Remove empty strings and null values
        const cleanObject = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(cleanObject).filter(item => 
                    item !== null && item !== undefined && item !== ''
                );
            } else if (obj && typeof obj === 'object') {
                const cleaned = {};
                Object.keys(obj).forEach(key => {
                    const value = cleanObject(obj[key]);
                    if (value !== null && value !== undefined && value !== '') {
                        cleaned[key] = value;
                    }
                });
                return cleaned;
            }
            return obj;
        };

        return cleanObject(orderData);
    }
}



// Create global instances only when needed
if (typeof window !== 'undefined') {
    window.loadingManager = new LoadingManager();
    window.dataConsistencyManager = new DataConsistencyManager();

}