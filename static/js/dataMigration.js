/**
 * Data Migration Script
 * Migrates existing localStorage data to new unified format
 */

/**
 * Migrate existing order data to new format
 */
function migrateOrderData() {
    try {
        console.log('Starting order data migration...');
        
        // Check if new format already exists
        const existingOrders = localStorage.getItem('weddingcrm_orders');
        if (existingOrders) {
            console.log('New format already exists, skipping migration');
            return;
        }
        
        const migratedOrders = [];
        
        // Migrate from old order forms
        const oldOrderForms = localStorage.getItem('order_forms');
        if (oldOrderForms) {
            try {
                const forms = JSON.parse(oldOrderForms);
                if (Array.isArray(forms)) {
                    forms.forEach(form => {
                        const migratedOrder = migrateOrderForm(form);
                        if (migratedOrder) {
                            migratedOrders.push(migratedOrder);
                        }
                    });
                }
            } catch (error) {
                console.error('Error migrating order forms:', error);
            }
        }
        
        // Migrate from old booking orders
        const oldBookingOrders = localStorage.getItem('weddingcrm_booking_orders');
        if (oldBookingOrders) {
            try {
                const bookings = JSON.parse(oldBookingOrders);
                if (Array.isArray(bookings)) {
                    bookings.forEach(booking => {
                        const migratedOrder = migrateBookingOrder(booking);
                        if (migratedOrder) {
                            // Check if order already exists (avoid duplicates)
                            const existingIndex = migratedOrders.findIndex(order => 
                                order._id === migratedOrder._id || order.id === migratedOrder.id
                            );
                            if (existingIndex === -1) {
                                migratedOrders.push(migratedOrder);
                            } else {
                                // Merge data if order exists
                                migratedOrders[existingIndex] = { ...migratedOrders[existingIndex], ...migratedOrder };
                            }
                        }
                    });
                }
            } catch (error) {
                console.error('Error migrating booking orders:', error);
            }
        }
        
        // Migrate from draft orders
        const draftOrder = localStorage.getItem('draft_order');
        if (draftOrder) {
            try {
                const draft = JSON.parse(draftOrder);
                const migratedDraft = migrateOrderForm(draft);
                if (migratedDraft) {
                    migratedOrders.push(migratedDraft);
                }
            } catch (error) {
                console.error('Error migrating draft order:', error);
            }
        }
        
        // Save migrated orders
        if (migratedOrders.length > 0) {
            localStorage.setItem('weddingcrm_orders', JSON.stringify(migratedOrders));
            console.log(`Successfully migrated ${migratedOrders.length} orders`);
            
            // Backup old data before cleanup
            backupOldData();
            
            // Clean up old keys (optional - commented out for safety)
            // localStorage.removeItem('order_forms');
            // localStorage.removeItem('weddingcrm_booking_orders');
            // localStorage.removeItem('draft_order');
            
            return true;
        } else {
            console.log('No orders to migrate');
            return false;
        }
        
    } catch (error) {
        console.error('Migration failed:', error);
        return false;
    }
}

/**
 * Migrate order form to new format
 */
function migrateOrderForm(form) {
    try {
        if (!form) return null;
        
        return {
            _id: form._id || form.id || generateOrderId(),
            id: form._id || form.id || generateOrderId(),
            order_info: {
                status: mapOldStatus(form.status) || window.storageManager?.ORDER_STATUS.DRAFT || 'Draft',
                created_at: form.created_at || form.saved_at || new Date().toISOString(),
                updated_at: form.updated_at || form.saved_at || new Date().toISOString()
            },
            client_details: form.client_details || {
                bride: { name: '', contact: '', email: '', aadhar: '' },
                groom: { name: '', contact: '', email: '', aadhar: '' }
            },
            events: form.events || [],
            deliverables: form.deliverables || { standard: [], addons: [], custom: [] },
            payment_schedule: form.payment_schedule || { deal_amount: '0', payments: [] }
        };
    } catch (error) {
        console.error('Error migrating order form:', error);
        return null;
    }
}

/**
 * Migrate booking order to new format
 */
function migrateBookingOrder(booking) {
    try {
        if (!booking) return null;
        
        return {
            _id: booking._id || booking.id || generateOrderId(),
            id: booking._id || booking.id || generateOrderId(),
            order_info: {
                status: mapOldStage(booking.stage) || window.storageManager?.ORDER_STATUS.PRE_LOCK || 'Pre-lock',
                created_at: booking.created_at || new Date().toISOString(),
                updated_at: booking.updated_at || new Date().toISOString()
            },
            client_details: {
                bride: { 
                    name: extractBrideName(booking.couple_name),
                    contact: booking.contact_number || '',
                    email: '',
                    aadhar: ''
                },
                groom: { 
                    name: extractGroomName(booking.couple_name),
                    contact: booking.contact_number || '',
                    email: '',
                    aadhar: ''
                }
            },
            events: booking.events || [],
            deliverables: booking.deliverables ? { standard: booking.deliverables, addons: [], custom: [] } : { standard: [], addons: [], custom: [] },
            payment_schedule: {
                deal_amount: booking.deal_amount || '0',
                payments: []
            },
            // Preserve additional booking data
            team_members: booking.team_members || [],
            production_team: booking.production_team || [],
            client_dependencies: booking.client_dependencies || [],
            prelock_status: booking.prelock_status || [],
            completion_status: booking.completion_status || [],
            waitlist_status: booking.waitlist_status || []
        };
    } catch (error) {
        console.error('Error migrating booking order:', error);
        return null;
    }
}

/**
 * Map old status to new status
 */
function mapOldStatus(oldStatus) {
    const statusMap = {
        'Draft': 'Draft',
        'Generated': 'Pre-lock',
        'Locked': 'Pre-event',
        'Active': 'In-event',
        'Completed': 'Out-production'
    };
    
    return statusMap[oldStatus] || 'Draft';
}

/**
 * Map old stage to new status
 */
function mapOldStage(oldStage) {
    const stageMap = {
        'pre-lock': 'Pre-lock',
        'pre-event': 'Pre-event',
        'in-event': 'In-event',
        'post-event': 'Post-event',
        'in-production': 'In-production',
        'out-production': 'Out-production',
        'generated': 'Pre-lock'
    };
    
    return stageMap[oldStage] || 'Pre-lock';
}

/**
 * Extract bride name from couple name
 */
function extractBrideName(coupleName) {
    if (!coupleName) return '';
    
    const parts = coupleName.split(' & ');
    return parts[0] || '';
}

/**
 * Extract groom name from couple name
 */
function extractGroomName(coupleName) {
    if (!coupleName) return '';
    
    const parts = coupleName.split(' & ');
    return parts[1] || '';
}

/**
 * Generate order ID
 */
function generateOrderId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime();
    
    return `ORD-${year}-${month}${day}-${String(timestamp).slice(-3)}`;
}

/**
 * Backup old data before cleanup
 */
function backupOldData() {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            order_forms: localStorage.getItem('order_forms'),
            weddingcrm_booking_orders: localStorage.getItem('weddingcrm_booking_orders'),
            draft_order: localStorage.getItem('draft_order')
        };
        
        localStorage.setItem('weddingcrm_backup', JSON.stringify(backup));
        console.log('Old data backed up successfully');
    } catch (error) {
        console.error('Error backing up old data:', error);
    }
}

/**
 * Restore from backup
 */
function restoreFromBackup() {
    try {
        const backup = localStorage.getItem('weddingcrm_backup');
        if (!backup) {
            console.log('No backup found');
            return false;
        }
        
        const backupData = JSON.parse(backup);
        
        if (backupData.order_forms) {
            localStorage.setItem('order_forms', backupData.order_forms);
        }
        if (backupData.weddingcrm_booking_orders) {
            localStorage.setItem('weddingcrm_booking_orders', backupData.weddingcrm_booking_orders);
        }
        if (backupData.draft_order) {
            localStorage.setItem('draft_order', backupData.draft_order);
        }
        
        console.log('Data restored from backup');
        return true;
    } catch (error) {
        console.error('Error restoring from backup:', error);
        return false;
    }
}

/**
 * Check if migration is needed
 */
function needsMigration() {
    const newFormat = localStorage.getItem('weddingcrm_orders');
    const oldFormats = [
        localStorage.getItem('order_forms'),
        localStorage.getItem('weddingcrm_booking_orders'),
        localStorage.getItem('draft_order')
    ];
    
    return !newFormat && oldFormats.some(format => format);
}

/**
 * Auto-migrate on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    if (needsMigration()) {
        console.log('Migration needed, starting automatic migration...');
        const success = migrateOrderData();
        if (success) {
            console.log('✅ Migration completed successfully');
        } else {
            console.log('⚠️ Migration completed with warnings or no data to migrate');
        }
    }
});

// Export functions for manual use
window.dataMigration = {
    migrateOrderData,
    restoreFromBackup,
    needsMigration
};