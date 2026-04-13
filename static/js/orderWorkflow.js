// Order Workflow Management - Business Logic Structure
const ORDER_WORKFLOW = {
    // Order Lifecycle States
    STATES: {
        DRAFT: 'draft',           // Initial form filling
        QUOTATION: 'quotation',   // Quote sent to client
        CONFIRMED: 'confirmed',   // Advance paid, order locked
        PRODUCTION: 'production', // Events happening/completed
        DELIVERY: 'delivery',     // Final delivery phase
        COMPLETED: 'completed',   // Project finished
        CANCELLED: 'cancelled'    // Order cancelled
    },

    // Payment States
    PAYMENT_STATES: {
        PENDING: 'pending',
        ADVANCE_PAID: 'advance_paid',
        EVENT_PAID: 'event_paid', 
        FINAL_PAID: 'final_paid',
        OVERDUE: 'overdue'
    },

    // Order Number Generation
    generateOrderNumber(type = 'ORD') {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const timestamp = Date.now().toString().slice(-6);
        return `${type}${year}${month}${timestamp}`;
    },

    // State Transitions
    canTransition(currentState, newState) {
        const transitions = {
            'draft': ['quotation', 'cancelled'],
            'quotation': ['confirmed', 'draft', 'cancelled'],
            'confirmed': ['production', 'cancelled'],
            'production': ['delivery', 'cancelled'],
            'delivery': ['completed'],
            'completed': [],
            'cancelled': []
        };
        return transitions[currentState]?.includes(newState) || false;
    }
};

// Export for global use
window.ORDER_WORKFLOW = ORDER_WORKFLOW;