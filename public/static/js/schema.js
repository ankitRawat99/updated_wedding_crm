// localStorage Schema Definition
const STORAGE_SCHEMA = {
    // Clients collection - separate from orders for normalization
    clients: {
        key: 'weddingcrm_clients',
        structure: {
            id: 'CLI-{timestamp}',
            bride: {
                name: '',
                email: '',
                contact: '',
                aadhar: ''
            },
            groom: {
                name: '',
                email: '',
                contact: '',
                aadhar: ''
            },
            status: 'active', // active, locked, archived
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Orders collection - references client_id
    orders: {
        key: 'weddingcrm_orders',
        structure: {
            id: 'ORD-{timestamp}',
            client_id: 'CLI-{timestamp}', // Reference to client
            status: 'draft', // draft, in_progress, completed, cancelled
            stage: 'client_info', // client_info, events, deliverables, payment, finalized
            completion_percentage: 0,
            
            // Project specifications
            project_specs: {
                coverage_type: '', // Bride, Groom, Both
                category: '', // Premium, Mid, Low
                makeup_venue: '',
                inspiration_specification: '',
                culture_specific: ''
            },

            // Pre-wedding details
            pre_wedding: {
                enabled: false,
                type: '', // photo, photo_video
                location: '',
                start_date: '',
                end_date: '',
                team_composition: '',
                drone: '',
                requirements: '',
                deliverables: []
            },

            // Cost factors
            cost_factors: {
                travel_cost: '', // tsv, client
                accommodation_cost: '', // tsv, client
                gear_rental: '', // yes, no
                drone_rental: '' // yes, no
            },

            // Deliverables
            deliverables: {
                standard: [],
                addons: [],
                custom: []
            },

            // Payment schedule
            payment_schedule: {
                deal_amount: 0,
                currency: 'INR',
                advance_payments: [],
                event_payments: [],
                delivery_payments: []
            },

            // Notes
            notes: {
                personal: [],
                event: [],
                package: []
            },

            // Completion tracking
            completion_status: {
                personal: false,
                event: false,
                requirements: false,
                package: false
            },

            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Events collection - references order_id
    events: {
        key: 'weddingcrm_events',
        structure: {
            id: 'EVT-{timestamp}',
            order_id: 'ORD-{timestamp}', // Reference to order
            name: '', // Wedding, Reception, etc.
            date: '',
            location: '',
            coverage: '', // Together, Bride, Groom
            time: '', // Morning, Day, Evening
            gathering: '',
            time_slab: '',
            quick_note: '',
            drone: '', // Yes, No
            team_composition: '',
            team_members: [],
            assistants: [],
            status: 'scheduled', // scheduled, completed, cancelled
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    },

    // Payments collection - references order_id
    payments: {
        key: 'weddingcrm_payments',
        structure: {
            id: 'PAY-{timestamp}',
            order_id: 'ORD-{timestamp}', // Reference to order
            type: 'advance', // advance, event, delivery
            amount: 0,
            currency: 'INR',
            due_date: '',
            paid_date: '',
            status: 'pending', // pending, paid, overdue, cancelled
            payment_method: '', // cash, card, upi, bank_transfer
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
            status: 'active', // active, inactive
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
            type: '', // photographer, editor, equipment_rental
            contact: '',
            email: '',
            address: '',
            services: [],
            rates: {},
            status: 'active', // active, inactive
            created_at: '2025-01-17T10:00:00Z',
            updated_at: '2025-01-17T10:00:00Z'
        }
    }
};

// Schema validation and initialization
class SchemaManager {
    constructor() {
        this.schema = STORAGE_SCHEMA;
        this.initializeStorage();
    }

    // Initialize all collections if they don't exist
    initializeStorage() {
        Object.keys(this.schema).forEach(collection => {
            const key = this.schema[collection].key;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        });
    }

    // Get collection structure template
    getTemplate(collection) {
        return JSON.parse(JSON.stringify(this.schema[collection].structure));
    }

    // Validate data against schema
    validateData(collection, data) {
        const template = this.getTemplate(collection);
        // Basic validation - ensure required fields exist
        return this.hasRequiredFields(data, template);
    }

    // Check if data has required structure
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

    // Get all collection names
    getCollections() {
        return Object.keys(this.schema);
    }

    // Get storage key for collection
    getStorageKey(collection) {
        return this.schema[collection]?.key || null;
    }
}

// Export schema manager
window.schemaManager = new SchemaManager();
window.STORAGE_SCHEMA = STORAGE_SCHEMA;