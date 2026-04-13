// Optimized localStorage Schema for Wedding CRM Business Workflow
const STORAGE_SCHEMA = {
    // Clients collection
    clients: {
        key: 'weddingcrm_clients',
        structure: {
            id: 'CLI-{timestamp}',
            bride: { name: '', email: '', contact: '', aadhar: '' },
            groom: { name: '', email: '', contact: '', aadhar: '' },
            status: 'active',
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Order Forms - Initial client meetings (unlocked, editable)
    order_forms: {
        key: 'weddingcrm_order_forms',
        structure: {
            id: 'FORM-{timestamp}',
            client_id: 'CLI-{timestamp}',
            status: 'draft', // draft, quotation_sent
            stage: 'client_info',
            completion_percentage: 0,
            is_locked: false,
            quotation_sent: false,
            quotation_date: null,
            project_specs: { coverage_type: '', category: '', makeup_venue: '', inspiration_specification: '', culture_specific: '' },
            pre_wedding: { enabled: false, type: '', location: '', start_date: '', end_date: '', team_composition: '', drone: '', requirements: '', deliverables: [] },
            cost_factors: { travel_cost: '', accommodation_cost: '', gear_rental: '', drone_rental: '' },
            deliverables: { standard: [], addons: [], custom: [] },
            payment_schedule: { deal_amount: 0, currency: 'INR', advance_payments: [], event_payments: [], delivery_payments: [] },
            notes: { personal: [], event: [], package: [] },
            completion_status: { personal: false, event: false, requirements: false, package: false },
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Confirmed Orders - Locked after advance payment
    orders: {
        key: 'weddingcrm_orders',
        structure: {
            id: 'ORD-{timestamp}',
            order_number: 'ORD202501001', // Sequential business number
            form_id: 'FORM-{timestamp}', // Reference to original form
            client_id: 'CLI-{timestamp}',
            status: 'confirmed', // confirmed, production, delivery, completed, cancelled
            payment_status: 'advance_paid', // advance_paid, event_paid, final_paid, overdue
            is_locked: true,
            advance_paid_date: '2025-01-17T10:00:00Z',
            lock_date: '2025-01-17T10:00:00Z',
            // Copy of form data at time of locking
            project_specs: {},
            pre_wedding: {},
            cost_factors: {},
            deliverables: {},
            payment_schedule: {},
            notes: {},
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Events - References order_id (confirmed orders only)
    events: {
        key: 'weddingcrm_events',
        structure: {
            id: 'EVT-{timestamp}',
            order_id: 'ORD-{timestamp}',
            name: '',
            date: '',
            location: '',
            coverage: '',
            time: '',
            gathering: '',
            time_slab: '',
            quick_note: '',
            drone: '',
            team_composition: '',
            team_members: [],
            assistants: [],
            status: 'scheduled', // scheduled, in_progress, completed, cancelled
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Payments - References order_id (confirmed orders only)
    payments: {
        key: 'weddingcrm_payments',
        structure: {
            id: 'PAY-{timestamp}',
            order_id: 'ORD-{timestamp}',
            type: 'advance', // advance, event, delivery
            amount: 0,
            currency: 'INR',
            due_date: '',
            paid_date: '',
            status: 'pending', // pending, paid, overdue, cancelled
            payment_method: '',
            notes: '',
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Team members collection
    team_members: {
        key: 'weddingcrm_team_members',
        structure: {
            id: 'TM-{timestamp}',
            name: '',
            type: '', // candid, cine, tvideo, tphoto
            contact: '',
            email: '',
            rate_per_day: 0,
            status: 'active',
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Vendors collection
    vendors: {
        key: 'weddingcrm_vendors',
        structure: {
            id: 'VEN-{timestamp}',
            name: '',
            type: '',
            contact: '',
            email: '',
            address: '',
            services: [],
            rates: {},
            status: 'active',
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    }
};

// Schema Manager with workflow support
class SchemaManager {
    constructor() {
        this.schema = STORAGE_SCHEMA;
        this.initializeStorage();
    }

    initializeStorage() {
        Object.keys(this.schema).forEach(collection => {
            const key = this.schema[collection].key;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }

    getTemplate(collection) {
        return JSON.parse(JSON.stringify(this.schema[collection].structure));
    }

    validateData(collection, data) {
        const template = this.getTemplate(collection);
        return this.hasRequiredFields(data, template);
    }

    hasRequiredFields(data, template) {
        for (let key in template) {
            if (typeof template[key] === 'object' && template[key] !== null && !Array.isArray(template[key])) {
                if (!data[key] || !this.hasRequiredFields(data[key], template[key])) {
                    return false;
                }
            }
        }
        return true;
    }

    getCollections() {
        return Object.keys(this.schema);
    }

    getStorageKey(collection) {
        return this.schema[collection]?.key || null;
    }

    // Workflow helper methods
    lockOrderForm(formId) {
        const forms = JSON.parse(localStorage.getItem('weddingcrm_order_forms') || '[]');
        const form = forms.find(f => f.id === formId);
        if (form && !form.is_locked) {
            // Create confirmed order
            const orderNumber = this.generateOrderNumber();
            const order = {
                ...this.getTemplate('orders'),
                id: `ORD-${Date.now()}`,
                order_number: orderNumber,
                form_id: formId,
                client_id: form.client_id,
                status: 'confirmed',
                payment_status: 'advance_paid',
                is_locked: true,
                advance_paid_date: new Date().toISOString(),
                lock_date: new Date().toISOString(),
                // Copy form data
                project_specs: form.project_specs,
                pre_wedding: form.pre_wedding,
                cost_factors: form.cost_factors,
                deliverables: form.deliverables,
                payment_schedule: form.payment_schedule,
                notes: form.notes,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            // Save order
            const orders = JSON.parse(localStorage.getItem('weddingcrm_orders') || '[]');
            orders.push(order);
            localStorage.setItem('weddingcrm_orders', JSON.stringify(orders));

            // Lock form
            form.is_locked = true;
            form.updated_at = new Date().toISOString();
            localStorage.setItem('weddingcrm_order_forms', JSON.stringify(forms));

            return order;
        }
        return null;
    }

    generateOrderNumber() {
        const orders = JSON.parse(localStorage.getItem('weddingcrm_orders') || '[]');
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const count = orders.filter(o => o.order_number?.startsWith(`ORD${year}${month}`)).length + 1;
        return `ORD${year}${month}${String(count).padStart(3, '0')}`;
    }
}

// Export
window.schemaManager = new SchemaManager();
window.STORAGE_SCHEMA = STORAGE_SCHEMA;