/**
 * WeddingCRM Storage Manager
 * Single localStorage key management for all order-related data
 * Supports 6-stage order lifecycle with unified data structure
 */

const STORAGE_KEY = 'weddingcrm_orders';

// Order status constants
const ORDER_STATUS = {
    DRAFT: 'Draft',
    PRE_LOCK: 'Pre-lock',
    PRE_EVENT: 'Pre-event', 
    IN_EVENT: 'In-event',
    POST_EVENT: 'Post-event',
    IN_PRODUCTION: 'In-production',
    OUT_PRODUCTION: 'Out-production'
};

/**
 * Get all orders from localStorage
 * @returns {Array} Array of order objects
 */
function getAllOrders() {
    try {
        const orders = localStorage.getItem(STORAGE_KEY);
        return orders ? JSON.parse(orders) : [];
    } catch (error) {
        console.error('Error getting orders:', error);
        return [];
    }
}

/**
 * Get order by ID
 * @param {string} orderId - Order ID to find
 * @returns {Object|null} Order object or null if not found
 */
function getOrderById(orderId) {
    try {
        const orders = getAllOrders();
        return orders.find(order => order._id === orderId || order.id === orderId) || null;
    } catch (error) {
        console.error('Error getting order by ID:', error);
        return null;
    }
}

/**
 * Save new order to localStorage
 * @param {Object} orderData - Order data to save
 * @returns {boolean} Success status
 */
function saveOrder(orderData) {
    try {
        const orders = getAllOrders();
        
        // Generate ID if not exists
        if (!orderData._id && !orderData.id) {
            orderData._id = generateOrderId();
            orderData.id = orderData._id;
        }
        
        // Set timestamps
        orderData.order_info = orderData.order_info || {};
        orderData.order_info.created_at = orderData.order_info.created_at || new Date().toISOString();
        orderData.order_info.updated_at = new Date().toISOString();
        orderData.order_info.status = orderData.order_info.status || ORDER_STATUS.DRAFT;
        
        // Add to orders array
        orders.push(orderData);
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        
        console.log('Order saved successfully:', orderData._id);
        return true;
    } catch (error) {
        console.error('Error saving order:', error);
        return false;
    }
}

/**
 * Update existing order
 * @param {string} orderId - Order ID to update
 * @param {Object} newData - New data to merge
 * @returns {boolean} Success status
 */
function updateOrder(orderId, newData) {
    try {
        const orders = getAllOrders();
        const orderIndex = orders.findIndex(order => order._id === orderId || order.id === orderId);
        
        if (orderIndex === -1) {
            console.error('Order not found for update:', orderId);
            return false;
        }
        
        // Merge new data with existing order
        orders[orderIndex] = { ...orders[orderIndex], ...newData };
        orders[orderIndex].order_info = orders[orderIndex].order_info || {};
        orders[orderIndex].order_info.updated_at = new Date().toISOString();
        
        // Save updated orders
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        
        console.log('Order updated successfully:', orderId);
        return true;
    } catch (error) {
        console.error('Error updating order:', error);
        return false;
    }
}

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {boolean} Success status
 */
function updateOrderStatus(orderId, status) {
    try {
        const orders = getAllOrders();
        const orderIndex = orders.findIndex(order => order._id === orderId || order.id === orderId);
        
        if (orderIndex === -1) {
            console.error('Order not found for status update:', orderId);
            return false;
        }
        
        orders[orderIndex].order_info = orders[orderIndex].order_info || {};
        orders[orderIndex].order_info.status = status;
        orders[orderIndex].order_info.updated_at = new Date().toISOString();
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        
        console.log('Order status updated:', orderId, status);
        return true;
    } catch (error) {
        console.error('Error updating order status:', error);
        return false;
    }
}

/**
 * Generate unique order ID
 * @returns {string} Generated order ID
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
 * Render booking cards for order bookings page
 * @param {string} filterStatus - Optional status filter
 * @returns {void}
 */
function renderBookingCards(filterStatus = null) {
    try {
        const orders = getAllOrders();
        const clientsGrid = document.getElementById('clientsGrid');
        
        if (!clientsGrid) {
            console.error('clientsGrid element not found');
            return;
        }
        
        // Clear existing cards
        clientsGrid.innerHTML = '';
        
        // Filter orders (exclude drafts)
        const activeOrders = orders.filter(order => {
            const status = order.order_info?.status || ORDER_STATUS.DRAFT;
            if (status === ORDER_STATUS.DRAFT) return false;
            if (filterStatus && status !== filterStatus) return false;
            return true;
        });
        
        if (activeOrders.length === 0) {
            clientsGrid.innerHTML = `
                <div class="col-span-full bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <i class="fas fa-info-circle text-yellow-600 text-2xl mb-2"></i>
                    <p class="text-yellow-700">No booking orders found. Generate orders from the order form to see them here.</p>
                </div>
            `;
            return;
        }
        
        // Create cards for each order
        activeOrders.forEach(order => {
            const card = createBookingCard(order);
            clientsGrid.appendChild(card);
        });
        
        // Update count
        const countElement = document.getElementById('activeBookingCount');
        if (countElement) {
            countElement.textContent = activeOrders.length;
        }
        
    } catch (error) {
        console.error('Error rendering booking cards:', error);
    }
}

/**
 * Create booking card element
 * @param {Object} order - Order data
 * @returns {HTMLElement} Card element
 */
function createBookingCard(order) {
    const card = document.createElement('div');
    const status = order.order_info?.status || ORDER_STATUS.PRE_LOCK;
    const coupleName = getCoupleName(order);
    const dealAmount = order.payment_schedule?.deal_amount || '0';
    
    card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden relative flex flex-col cursor-pointer';
    card.setAttribute('data-status', status.toLowerCase().replace('-', '_'));
    card.setAttribute('data-stage', status.toLowerCase().replace(' ', '-'));
    card.onclick = () => openOrderSheet(order._id || order.id);
    
    card.innerHTML = `
        <!-- Stage Toast -->
        <div class="absolute top-2 right-2 z-10">
            <div class="stage-toast toast-${status.toLowerCase().replace(' ', '-')} px-3 py-1 rounded-r-md text-xs font-medium shadow-sm">
                <i class="fas fa-dot-circle mr-1"></i>${status.toUpperCase()} STAGE
            </div>
        </div>
        
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
            <div class="flex justify-between items-center">
                <div class="flex flex-col space-y-1">
                    <span class="text-sm font-bold text-gray-800">#${order._id || order.id}</span>
                    <div class="stage-toast toast-${status.toLowerCase().replace(' ', '-')} px-2 py-0.5 rounded text-xs font-medium shadow-sm inline-block w-fit">
                        <i class="fas fa-dot-circle mr-1 text-xs"></i>${status.replace('-', ' ').toUpperCase()} Stage
                    </div>
                </div>
                <div class="flex items-center space-x-1">
                    ${getStageIcons(status)}
                </div>
            </div>
        </div>
        
        <div class="p-4 flex-1">
            <!-- Couple Names -->
            <div class="mb-3">
                <h3 class="font-semibold text-gray-900 text-lg">${coupleName}</h3>
            </div>
            
            <!-- Payment Progress -->
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-2">
                    <span class="font-medium text-gray-700">₹${dealAmount}</span>
                    <span class="text-orange-600 font-medium">Status: ${status}</span>
                </div>
                
                <div class="flex space-x-0 mb-1">
                    <div class="flex-1 bg-gray-300 h-2 rounded-l-full" title="Advance"></div>
                    <div class="flex-1 bg-gray-300 h-2" title="Event"></div>
                    <div class="flex-1 bg-gray-300 h-2 rounded-r-full" title="Delivery"></div>
                </div>
                
                <div class="flex justify-between text-xs text-gray-600">
                    <span>Advance</span>
                    <span>Event</span>
                    <span>Delivery</span>
                </div>
            </div>
            
            ${renderOrderSections(order)}
        </div>
        
        <!-- Footer -->
        <div class="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <div class="flex justify-between items-center text-xs">
                <span class="text-gray-600">
                    <i class="fas fa-headset mr-1"></i>Customer Support
                </span>
                <span class="text-green-600 font-medium">
                    <i class="fas fa-circle text-green-500 mr-1"></i>Active
                </span>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Get couple name from order data
 * @param {Object} order - Order data
 * @returns {string} Formatted couple name
 */
function getCoupleName(order) {
    const bride = order.client_details?.bride?.name || '';
    const groom = order.client_details?.groom?.name || '';
    
    if (bride && groom) {
        return `${bride} & ${groom}`;
    } else if (bride) {
        return bride;
    } else if (groom) {
        return groom;
    } else {
        return 'Unnamed Couple';
    }
}

/**
 * Get stage icons based on status
 * @param {string} status - Order status
 * @returns {string} HTML for stage icons
 */
function getStageIcons(status) {
    const stages = [ORDER_STATUS.PRE_LOCK, ORDER_STATUS.PRE_EVENT, ORDER_STATUS.IN_EVENT, ORDER_STATUS.POST_EVENT, ORDER_STATUS.IN_PRODUCTION, ORDER_STATUS.OUT_PRODUCTION];
    const currentIndex = stages.indexOf(status);
    
    return `
        <div class="${currentIndex >= 0 ? 'bg-green-500' : 'bg-gray-200'} text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md" title="Lock Stage">
            <i class="fas fa-lock"></i>
        </div>
        <div class="${currentIndex >= 1 ? 'bg-blue-500' : 'bg-gray-200'} text-white w-6 h-6 rounded-full text-xs flex items-center justify-center shadow-md" title="Event Stage">
            <i class="fas fa-calendar-alt"></i>
        </div>
        <div class="${currentIndex >= 4 ? 'bg-purple-500' : 'bg-gray-200'} text-white w-6 h-6 rounded-full text-xs flex items-center justify-center" title="Production Stage">
            <i class="fas fa-cogs"></i>
        </div>
    `;
}

/**
 * Render order sections based on available data
 * @param {Object} order - Order data
 * @returns {string} HTML for order sections
 */
function renderOrderSections(order) {
    let sectionsHTML = '';
    
    // Events section
    if (order.events && order.events.length > 0) {
        sectionsHTML += `
            <div class="border-t border-gray-100 my-3"></div>
            <div class="mb-3">
                <h4 class="text-sm font-medium text-emerald-700 mb-2">
                    <i class="fas fa-calendar-alt mr-1"></i>Event Schedule
                </h4>
                <div class="flex flex-wrap gap-1">
                    ${order.events.map(event => `
                        <span class="px-2 py-1 chip-events rounded-full text-xs font-medium">
                            <i class="fas fa-calendar mr-1"></i>${event.name || 'Event'} • ${event.date || 'TBD'}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // Deliverables section
    if (order.deliverables) {
        const deliverables = [];
        if (order.deliverables.standard) deliverables.push(...order.deliverables.standard);
        if (order.deliverables.addons) deliverables.push(...order.deliverables.addons);
        
        if (deliverables.length > 0) {
            sectionsHTML += `
                <div class="border-t border-gray-100 my-3"></div>
                <div class="mb-3">
                    <h4 class="text-sm font-medium text-purple-800 mb-2">
                        <i class="fas fa-box mr-1"></i>Deliverables
                    </h4>
                    <div class="flex flex-wrap gap-1">
                        ${deliverables.map(item => `
                            <span class="px-2 py-1 chip-deliveries rounded-full text-xs font-medium">
                                <i class="fas fa-check mr-1"></i>${item.name || item}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
    }
    
    return sectionsHTML;
}

/**
 * Open order sheet for specific order
 * @param {string} orderId - Order ID to open
 * @returns {void}
 */
function openOrderSheet(orderId) {
    try {
        // Store selected order ID in sessionStorage
        sessionStorage.setItem('selectedOrderId', orderId);
        
        // Navigate to order sheet
        window.location.href = `/order-sheet/${orderId}`;
    } catch (error) {
        console.error('Error opening order sheet:', error);
    }
}

/**
 * Load and populate order sheet with order data
 * @param {string} orderId - Order ID (optional, will try to get from URL or sessionStorage)
 * @returns {void}
 */
function loadOrderSheet(orderId = null) {
    try {
        // Get order ID from parameter, URL, or sessionStorage
        if (!orderId) {
            const urlParams = new URLSearchParams(window.location.search);
            orderId = urlParams.get('order_id') || sessionStorage.getItem('selectedOrderId');
        }
        
        if (!orderId) {
            console.error('No order ID provided for order sheet');
            return;
        }
        
        const order = getOrderById(orderId);
        if (!order) {
            console.error('Order not found:', orderId);
            return;
        }
        
        // Update header with order ID
        const headerOrderId = document.getElementById('headerOrderId');
        if (headerOrderId) {
            headerOrderId.textContent = order._id || order.id;
        }
        
        // Populate order sheet fields
        populateOrderSheet(order);
        
        console.log('Order sheet loaded successfully:', orderId);
    } catch (error) {
        console.error('Error loading order sheet:', error);
    }
}

/**
 * Populate order sheet with order data
 * @param {Object} order - Order data
 * @returns {void}
 */
function populateOrderSheet(order) {
    try {
        // Client details
        if (order.client_details) {
            populateClientDetails(order.client_details);
        }
        
        // Events
        if (order.events) {
            populateEvents(order.events);
        }
        
        // Deliverables
        if (order.deliverables) {
            populateDeliverables(order.deliverables);
        }
        
        // Payment schedule
        if (order.payment_schedule) {
            populatePaymentSchedule(order.payment_schedule);
        }
        
        console.log('Order sheet populated successfully');
    } catch (error) {
        console.error('Error populating order sheet:', error);
    }
}

/**
 * Populate client details in order sheet
 * @param {Object} clientDetails - Client details data
 * @returns {void}
 */
function populateClientDetails(clientDetails) {
    // Bride details
    if (clientDetails.bride) {
        const brideNameEl = document.querySelector('[data-field="bride_name"]');
        const brideContactEl = document.querySelector('[data-field="bride_contact"]');
        const brideEmailEl = document.querySelector('[data-field="bride_email"]');
        
        if (brideNameEl) brideNameEl.textContent = clientDetails.bride.name || '';
        if (brideContactEl) brideContactEl.textContent = clientDetails.bride.contact || '';
        if (brideEmailEl) brideEmailEl.textContent = clientDetails.bride.email || '';
    }
    
    // Groom details
    if (clientDetails.groom) {
        const groomNameEl = document.querySelector('[data-field="groom_name"]');
        const groomContactEl = document.querySelector('[data-field="groom_contact"]');
        const groomEmailEl = document.querySelector('[data-field="groom_email"]');
        
        if (groomNameEl) groomNameEl.textContent = clientDetails.groom.name || '';
        if (groomContactEl) groomContactEl.textContent = clientDetails.groom.contact || '';
        if (groomEmailEl) groomEmailEl.textContent = clientDetails.groom.email || '';
    }
}

/**
 * Populate events in order sheet
 * @param {Array} events - Events data
 * @returns {void}
 */
function populateEvents(events) {
    const eventsContainer = document.querySelector('[data-section="events"]');
    if (!eventsContainer || !events.length) return;
    
    eventsContainer.innerHTML = events.map(event => `
        <div class="event-item bg-gray-50 p-4 rounded-lg mb-3">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-sm font-medium text-gray-600">Event Name</label>
                    <p class="text-gray-900">${event.name || 'N/A'}</p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-600">Date</label>
                    <p class="text-gray-900">${event.date || 'N/A'}</p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-600">Location</label>
                    <p class="text-gray-900">${event.location || 'N/A'}</p>
                </div>
                <div>
                    <label class="text-sm font-medium text-gray-600">Coverage</label>
                    <p class="text-gray-900">${event.coverage || 'N/A'}</p>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Populate deliverables in order sheet
 * @param {Object} deliverables - Deliverables data
 * @returns {void}
 */
function populateDeliverables(deliverables) {
    const deliverablesContainer = document.querySelector('[data-section="deliverables"]');
    if (!deliverablesContainer) return;
    
    let deliverablesHTML = '';
    
    if (deliverables.standard && deliverables.standard.length > 0) {
        deliverablesHTML += `
            <div class="mb-4">
                <h4 class="font-medium text-gray-800 mb-2">Standard Deliverables</h4>
                <div class="flex flex-wrap gap-2">
                    ${deliverables.standard.map(item => `
                        <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            ${item.name || item}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    if (deliverables.addons && deliverables.addons.length > 0) {
        deliverablesHTML += `
            <div class="mb-4">
                <h4 class="font-medium text-gray-800 mb-2">Add-on Deliverables</h4>
                <div class="flex flex-wrap gap-2">
                    ${deliverables.addons.map(item => `
                        <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            ${item.name || item}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    deliverablesContainer.innerHTML = deliverablesHTML;
}

/**
 * Populate payment schedule in order sheet
 * @param {Object} paymentSchedule - Payment schedule data
 * @returns {void}
 */
function populatePaymentSchedule(paymentSchedule) {
    const dealAmountEl = document.querySelector('[data-field="deal_amount"]');
    if (dealAmountEl && paymentSchedule.deal_amount) {
        dealAmountEl.textContent = `₹${paymentSchedule.deal_amount}`;
    }
    
    const paymentsContainer = document.querySelector('[data-section="payments"]');
    if (!paymentsContainer || !paymentSchedule.payments) return;
    
    paymentsContainer.innerHTML = paymentSchedule.payments.map(payment => `
        <div class="payment-item bg-gray-50 p-3 rounded-lg mb-2">
            <div class="flex justify-between items-center">
                <div>
                    <span class="font-medium text-gray-800">${payment.type}</span>
                    <span class="text-sm text-gray-600 ml-2">${payment.date || 'No date'}</span>
                </div>
                <div class="text-right">
                    <span class="font-semibold text-gray-900">₹${payment.amount}</span>
                    <span class="text-sm text-gray-600 ml-1">(${payment.percentage}%)</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Export functions for global use
window.storageManager = {
    getAllOrders,
    getOrderById,
    saveOrder,
    updateOrder,
    updateOrderStatus,
    renderBookingCards,
    openOrderSheet,
    loadOrderSheet,
    ORDER_STATUS
};

console.log('Storage Manager loaded successfully');