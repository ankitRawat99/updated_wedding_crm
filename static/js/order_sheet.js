/**
 * Order Sheet JavaScript
 * Handles order sheet display and status management
 */

let currentOrderId = null;
let currentOrder = null;

/**
 * Edit section functionality with button transformation
 */
window.editSection = function(sectionType) {
    const button = event.target.closest('button');
    const isEditMode = button.innerHTML.includes('fa-edit');
    
    if (isEditMode) {
        // Switch to edit mode
        makeEditable(sectionType);
        button.innerHTML = '<i class="fas fa-save"></i>';
        button.className = 'px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors';
    } else {
        // Save and switch back to view mode
        saveSection(sectionType);
        button.innerHTML = '<i class="fas fa-edit"></i>';
        button.className = 'px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors';
    }
};

/**
 * Make section editable
 */
function makeEditable(sectionType) {
    switch(sectionType) {
        case 'client':
            editClientSection();
            break;
        case 'cost':
            editCostSection();
            break;
        case 'project':
            editProjectSection();
            break;
        case 'notes':
            editNotesSection();
            break;
        case 'deliverables':
            editDeliverablesSection();
            break;
    }
}

/**
 * Save section data
 */
function saveSection(sectionType) {
    switch(sectionType) {
        case 'client':
            saveClientSection();
            break;
        case 'cost':
            saveCostSection();
            break;
        case 'project':
            saveProjectSection();
            break;
        case 'notes':
            saveNotesSection();
            break;
        case 'deliverables':
            saveDeliverablesSection();
            break;
    }
}

/**
 * Initialize order sheet page
 */
function initializeOrderSheet() {
    try {
        // Get order ID from URL or sessionStorage
        const urlParams = new URLSearchParams(window.location.search);
        const orderIdFromUrl = urlParams.get('order_id');
        const orderIdFromSession = sessionStorage.getItem('selectedOrderId');
        
        currentOrderId = orderIdFromUrl || orderIdFromSession;
        
        if (!currentOrderId) {
            console.error('No order ID provided');
            showOrderNotFound();
            return;
        }
        
        loadOrderData();
        
    } catch (error) {
        console.error('Error initializing order sheet:', error);
        showOrderNotFound();
    }
}

/**
 * Load order data from localStorage only
 */
function loadOrderData() {
    try {
        console.log('🔍 DEBUG: Loading order data for ID:', currentOrderId);
        
        // Check weddingcrm_orders key
        const weddingcrmData = localStorage.getItem('weddingcrm_orders');
        console.log('🔍 DEBUG: weddingcrm_orders exists:', !!weddingcrmData);
        
        if (weddingcrmData) {
            const orders = JSON.parse(weddingcrmData);
            console.log('🔍 DEBUG: Total orders in weddingcrm_orders:', orders.length);
            
            currentOrder = orders.find(order => 
                order.id === currentOrderId || 
                order._id === currentOrderId
            );
            
            if (currentOrder) {
                console.log('✅ DEBUG: Order found:', currentOrder);
                populateOrderFields(currentOrder);
                return;
            }
        }
        
        console.error('❌ Order not found in localStorage');
        showOrderNotFound();
        
    } catch (error) {
        console.error('❌ Error loading order data:', error);
        showOrderNotFound();
    }
}

/**
 * Show order not found message
 */
function showOrderNotFound() {
    const sheetContent = document.getElementById('sheet-content');
    if (sheetContent) {
        sheetContent.innerHTML = `
            <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <i class="fas fa-exclamation-triangle text-red-600 text-3xl mb-4"></i>
                <h3 class="text-lg font-semibold text-red-800 mb-2">Error</h3>
                <p class="text-red-700 mb-4">Error loading order data</p>
                <div class="mt-4">
                    <a href="/order-bookings" class="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-2">
                        <i class="fas fa-arrow-left mr-2"></i>Back to Bookings
                    </a>
                    <button onclick="location.reload()" class="inline-block px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                        <i class="fas fa-refresh mr-2"></i>Retry
                    </button>
                </div>
            </div>
        `;
    }
}

/**
 * Populate all order fields
 */
function populateOrderFields(order) {
    try {
        console.log('✅ Populating fields with order:', order);
        
        // Header information
        setElementText('orderIdDisplay', order.id || order._id);
        setElementText('headerOrderId', order.id || order._id);
        setElementText('orderDateDisplay', new Date().toLocaleDateString());
        
        // Client details from client_details structure
        if (order.client_details) {
            const bride = order.client_details.bride || {};
            const groom = order.client_details.groom || {};
            
            setElementText('bride-name', bride.name);
            setElementText('bride-contact', bride.contact);
            setElementText('bride-email', bride.email);
            setElementText('bride-aadhar', bride.aadhar);
            
            setElementText('groom-name', groom.name);
            setElementText('groom-contact', groom.contact);
            setElementText('groom-email', groom.email);
            setElementText('groom-aadhar', groom.aadhar);
        }
        
        // Project Specification details
        if (order.project_specs) {
            setElementText('coverage-type', order.project_specs.coverage_type);
            setElementText('coverage-category', order.project_specs.category);
            setElementText('culture-specific', order.project_specs.culture_specific);
            setElementText('inspiration-specification', order.project_specs.inspiration_specification);
            setElementText('makeup-venue', order.project_specs.makeup_venue);
        }
        
        // Pre-wedding
        if (order.pre_wedding) {
            setElementText('coverage-prewedding', order.pre_wedding.enabled ? 'Yes' : 'No');
        }
        
        // Deal information
        if (order.payment_schedule) {
            setElementText('deal-total', `₹${order.payment_schedule.deal_amount}`);
            populatePaymentSchedule(order.payment_schedule.payments || []);
        }
        
        // Events - dynamic from localStorage
        populateEvents(order.events || []);
        
        // Operation details from cost_factors
        if (order.cost_factors) {
            setElementText('operation-travel', order.cost_factors.travel_cost || order.travel_cost || 'TBD');
            setElementText('operation-accommodation', order.cost_factors.accommodation_cost || order.accommodation_cost || 'TBD');
            setElementText('operation-gear', order.cost_factors.gear_rental || order.gear_rental || 'TBD');
            setElementText('operation-drone', order.cost_factors.drone_rental || order.drone_rental || 'TBD');
        } else {
            setElementText('operation-travel', order.travel_cost || 'TBD');
            setElementText('operation-accommodation', order.accommodation_cost || 'TBD');
            setElementText('operation-gear', order.gear_rental || 'TBD');
            setElementText('operation-drone', order.drone_rental || 'TBD');
        }
        
        // Deliverables
        populateDeliverables(order.deliverables || {});
        
        console.log('📦 DEBUG: Deliverables data being passed:', order.deliverables);
        
        // Client notes from localStorage structure
        populateClientNotes(order.notes || {});
        
        // Generated date
        setElementText('generatedDateDisplay', new Date().toLocaleDateString());
        
        console.log('✅ Order fields populated successfully');
        
    } catch (error) {
        console.error('❌ Error populating order fields:', error);
    }
}

/**
 * Helper function to safely set element text
 */
function setElementText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text || 'N/A';
    }
}

/**
 * Populate events section - dynamic based on actual data from weddingcrm_orders
 */
function populateEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) return;
    
    console.log('📅 Events data from localStorage:', events);
    
    if (!events || events.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No events scheduled</p>';
        return;
    }
    
    // Generate HTML for each event
    const eventsHtml = events.map((event, index) => {
        console.log(`📅 Processing Event ${index + 1}:`, event);
        
        const teamMembers = event.team_members || [];
        console.log(`👥 Team members for Event ${index + 1}:`, teamMembers);
        
        const eventName = event.name || event.event_name || event.title || '';
        const eventHeader = eventName ? `Event ${index + 1} - ${eventName}` : `Event ${index + 1}`;
        
        return `
            <div class="border border-gray-200 rounded p-4 mb-8 section">
                <h4 class="font-semibold text-gray-800 mb-3">${eventHeader}</h4>
                <div class="grid grid-cols-3 gap-4 mb-3">
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Date:</span>
                        <span class="text-gray-900">${event.date || event.event_date || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Location:</span>
                        <span class="text-gray-900">${event.location || event.event_location || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Coverage:</span>
                        <span class="text-gray-900">${event.coverage || 'TBD'}</span>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4 mb-3">
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Time:</span>
                        <span class="text-gray-900">${event.time || event.event_time || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Gathering:</span>
                        <span class="text-gray-900">${event.gathering || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Team Composition:</span>
                        <span class="text-gray-900">${event.team_composition || 'TBD'}</span>
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-4 mb-3">
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Assistants:</span>
                        <span class="text-gray-900">${event.assistants || 'TBD'}</span>
                    </div>
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Drone:</span>
                        <span class="text-gray-900">${event.drone || 'TBD'}</span>
                    </div>
                    <div></div>
                </div>
                <div class="grid grid-cols-3 gap-4 mb-3">
                    <div class="info-row">
                        <span class="font-medium text-gray-600">Quick Note:</span>
                        <span class="text-gray-900">${event.quick_note || event.note || event.notes || 'Empty'}</span>
                    </div>
                    <div></div>
                    <div></div>
                </div>
                
                <!-- Team Members -->
                <div class="bg-gray-50 border border-gray-200 rounded p-3 mt-4">
                    <div class="flex justify-between items-center mb-2">
                        <h5 class="font-medium text-gray-700">Team Members</h5>
                        <button onclick="allocateResources()" class="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded font-medium hover:from-blue-600 hover:to-blue-700 transition-all">
                            Allocate Resource
                        </button>
                    </div>
                    ${generateTeamMemberFields(teamMembers)}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = eventsHtml;
}

/**
 * Generate team member fields - show both member type and role
 */
function generateTeamMemberFields(teamMembers) {
    console.log('👥 Generating team member fields for:', teamMembers);
    
    if (!teamMembers || teamMembers.length === 0) {
        return `
            <div class="text-center text-gray-500 py-4">
                No team members assigned
            </div>
        `;
    }
    
    // Generate compact table with both member type and role
    const tableRows = teamMembers.map((member, index) => {
        const memberType = member.type || `Team Member ${member.position || index + 1}`;
        const role = member.value || member.role || 'TBD';
        const memberName = member.name || 'TBD';
        const memberAmount = member.amount || 'TBD';
        
        return `
            <tr class="border-b border-gray-200">
                <td class="py-1 text-sm font-medium text-gray-700">${memberType}</td>
                <td class="py-1 text-sm text-blue-600 font-medium">${role}</td>
                <td class="py-1 text-sm text-gray-900">${memberName}</td>
                <td class="py-1 text-sm text-gray-900 text-right">${memberAmount}</td>
            </tr>
        `;
    }).join('');
    
    return `
        <table class="w-full text-sm">
            <thead>
                <tr class="border-b border-gray-300">
                    <th class="text-left py-2 font-medium text-gray-600">Member</th>
                    <th class="text-left py-2 font-medium text-gray-600">Role</th>
                    <th class="text-left py-2 font-medium text-gray-600">Name</th>
                    <th class="text-right py-2 font-medium text-gray-600">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
    `;
}

/**
 * Populate client notes section
 */
function populateClientNotes(notes) {
    const notesContainer = document.getElementById('client-notes');
    if (!notesContainer) return;
    
    console.log('📝 Notes data from localStorage:', notes);
    
    const allNotes = [];
    
    // Collect notes from all categories
    if (notes.personal && notes.personal.length > 0) {
        notes.personal.forEach(note => {
            if (note.text) allNotes.push(`Personal: ${note.text}`);
        });
    }
    
    if (notes.event && notes.event.length > 0) {
        notes.event.forEach(note => {
            if (note.text) allNotes.push(`Event: ${note.text}`);
        });
    }
    
    if (notes.package && notes.package.length > 0) {
        notes.package.forEach(note => {
            if (note.text) allNotes.push(`Package: ${note.text}`);
        });
    }
    
    if (notes.requirements && notes.requirements.length > 0) {
        notes.requirements.forEach(note => {
            if (note.text) allNotes.push(`Requirements: ${note.text}`);
        });
    }
    
    // Display notes or default message
    if (allNotes.length > 0) {
        notesContainer.innerHTML = allNotes.join('<br><br>');
    } else {
        notesContainer.textContent = 'No special notes';
    }
}

/**
 * Populate payment schedule table
 */
function populatePaymentSchedule(payments) {
    const paymentScheduleBody = document.getElementById('payment-schedule');
    if (!paymentScheduleBody) return;
    
    console.log('💰 Payment schedule data:', payments);
    
    if (!payments || payments.length === 0) {
        paymentScheduleBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">No payment schedule available</td></tr>';
        return;
    }
    
    const paymentRows = payments.map(payment => {
        return `
            <tr class="border-b border-gray-200">
                <td class="py-2 text-left font-medium text-gray-800">${payment.type || 'N/A'}</td>
                <td class="py-2 text-center text-gray-700">${payment.percentage || 'N/A'}%</td>
                <td class="py-2 text-center text-gray-700">₹${payment.amount ? payment.amount.toLocaleString() : 'N/A'}</td>
                <td class="py-2 text-center text-gray-700">${payment.date || 'N/A'}</td>
            </tr>
        `;
    }).join('');
    
    paymentScheduleBody.innerHTML = paymentRows;
}

/**
 * Populate deliverables section with custom deliverables support
 */
function populateDeliverables(deliverables) {
    const standardContainer = document.getElementById('standard-deliverables');
    const addonContainer = document.getElementById('addon-deliverables');
    const standardCount = document.getElementById('standard-count');
    const addonCount = document.getElementById('addon-count');
    
    console.log('📦 Deliverables data:', deliverables);
    
    // Standard deliverables
    if (standardContainer) {
        let standardItems = [];
        let standardTotal = 0;
        
        // Add regular standard deliverables
        if (deliverables.standard && deliverables.standard.length > 0) {
            standardItems = deliverables.standard.map(item => {
                return `<div class="flex items-center justify-between p-2 bg-white rounded border">
                    <span class="flex items-center">
                        <span class="mr-2 text-blue-600 font-bold">●</span>
                        <span>${item.name}</span>
                    </span>
                    <span class="text-xs text-gray-500">${item.quantity || 1}x</span>
                </div>`;
            });
            standardTotal += deliverables.standard.length;
        }
        

        
        if (standardItems.length > 0) {
            standardContainer.innerHTML = standardItems.join('');
        } else {
            standardContainer.innerHTML = '<div class="text-gray-500 text-center py-4">No standard deliverables</div>';
        }
        
        if (standardCount) {
            standardCount.textContent = `${standardTotal} items`;
        }
    }
    
    // Add-on deliverables
    if (addonContainer) {
        let addonItems = [];
        let addonTotal = 0;
        
        // Add regular addon deliverables
        if (deliverables.addons && deliverables.addons.length > 0) {
            addonItems = deliverables.addons.map(item => {
                return `<div class="flex items-center justify-between p-2 bg-white rounded border">
                    <span class="flex items-center">
                        <span class="mr-2 text-green-600 font-bold">●</span>
                        <span>${item.name}</span>
                    </span>
                    <span class="text-xs text-gray-500">${item.quantity || 1}x</span>
                </div>`;
            });
            addonTotal += deliverables.addons.length;
        }
        
        // Add custom deliverables to addon section
        if (deliverables.custom && deliverables.custom.length > 0) {
            console.log('🔥 Found custom deliverables:', deliverables.custom);
            const customItems = deliverables.custom.map(item => {
                return `<div class="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                    <span class="flex items-center">
                        <span class="mr-2 text-purple-600 font-bold">●</span>
                        <span>${item.name}</span>
                        <span class="ml-2 text-xs bg-purple-100 text-purple-700 px-1 rounded">Custom</span>
                    </span>
                    <span class="text-xs text-gray-500">${item.quantity || 1}x</span>
                </div>`;
            });
            addonItems = addonItems.concat(customItems);
            addonTotal += deliverables.custom.length;
        } else {
            console.log('⚠️ No custom deliverables found or empty array');
        }
        
        if (addonItems.length > 0) {
            addonContainer.innerHTML = addonItems.join('');
        } else {
            addonContainer.innerHTML = '<div class="text-gray-500 text-center py-4">No add-on deliverables</div>';
        }
        
        if (addonCount) {
            addonCount.textContent = `${addonTotal} items`;
        }
    }
}

/**
 * Load different sheet types
 */
function loadSheet(sheetType) {
    console.log('Loading sheet:', sheetType);
    
    // Update active tab
    document.querySelectorAll('.sheet-tab').forEach(tab => {
        tab.classList.remove('active', 'border-blue-500', 'text-blue-600');
        tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    const activeTab = document.getElementById(`${sheetType}-sheet-tab`);
    if (activeTab) {
        activeTab.classList.add('active', 'border-blue-500', 'text-blue-600');
        activeTab.classList.remove('border-transparent', 'text-gray-500');
    }
    
    // For now, just reload the order sheet content
    if (sheetType === 'order' && currentOrder) {
        populateOrderFields(currentOrder);
    }
}

/**
 * Allocate resources - redirect to calendar
 */
function allocateResources() {
    window.location.href = 'http://127.0.0.1:7500/calendar';
}

// Action functions
function lockOrder() {
    alert('Lock order functionality');
}

function raiseQuotation() {
    alert('Raise quotation functionality');
}

function teamNote() {
    alert('Team note functionality');
}

function closeOrder() {
    alert('Close order functionality');
}

function cancelOrder() {
    alert('Cancel order functionality');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderSheet();

});





function editClientSection() {
    const fields = ['bride-name', 'bride-contact', 'bride-email', 'bride-aadhar', 'groom-name', 'groom-contact', 'groom-email', 'groom-aadhar'];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const currentValue = element.textContent;
            element.innerHTML = `<input type="text" value="${currentValue}" class="w-full px-2 py-1 border rounded text-sm" id="edit-${fieldId}">`;
        }
    });
}

function editCostSection() {
    const fields = ['operation-travel', 'operation-accommodation', 'operation-gear', 'operation-drone'];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const currentValue = element.textContent;
            element.innerHTML = `<input type="text" value="${currentValue}" class="w-full px-2 py-1 border rounded text-sm" id="edit-${fieldId}">`;
        }
    });
}

function editProjectSection() {
    const fields = ['coverage-type', 'coverage-category', 'culture-specific', 'inspiration-specification', 'makeup-venue', 'coverage-prewedding'];
    
    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        if (element) {
            const currentValue = element.textContent;
            element.innerHTML = `<input type="text" value="${currentValue}" class="w-full px-2 py-1 border rounded text-sm" id="edit-${fieldId}">`;
        }
    });
}

function editNotesSection() {
    const element = document.getElementById('client-notes');
    if (element) {
        const currentValue = element.innerHTML;
        element.innerHTML = `<textarea class="w-full px-2 py-1 border rounded text-sm h-20" id="edit-client-notes">${currentValue.replace(/<br><br>/g, '\n')}</textarea>`;
    }
}

function editDealSection() {
    console.log('Editing deal section');
    alert('Deal editing functionality coming soon!');
}

function editDeliverablesSection() {
    const standardContainer = document.getElementById('standard-deliverables');
    const addonContainer = document.getElementById('addon-deliverables');
    
    // All standard deliverables
    const allStandardDeliverables = [
        'E-invite Standard',
        'All Raw Photos', 
        'Face Detection Gallery',
        'Quick Edit for SM (40-50 Photos)',
        'Overall 800-1000 edited Photos (200 SF + 800)',
        'Teaser/Highlight upto 5 min (including interview)',
        'Wedding Short Film upto 30 min',
        'Long Film upto 60 mins (all events cover)',
        '4 Reels (Upto 30 secs)',
        '2 Photo Album (12*36, 40-50 sheets each, premium quality matte/glossy finish paper)',
        '1 Photo Frame (16*24)',
        'All Raw Videos'
    ];
    
    // All addon deliverables
    const allAddonDeliverables = [
        'Ad-on Album (Standard)',
        'Ad-on Album (Premium)', 
        'Coffee Table Book',
        'Wedding Invite (Customised)',
        'Photo Frame',
        'Ad-on Reels',
        'Per Event Short Film',
        'Drone per day addition',
        '4K Shoot',
        'Same Day Cut',
        'Print Booth (Within Delhi)'
    ];
    
    // Get existing deliverables
    const existingDeliverables = currentOrder?.deliverables || {};
    
    // Create standard deliverables checkboxes
    const standardHtml = allStandardDeliverables.map(itemName => {
        const isChecked = existingDeliverables.standard?.some(existing => existing.name === itemName) || false;
        return `<div class="flex items-center p-2 bg-white rounded border mb-2">
            <input type="checkbox" ${isChecked ? 'checked' : ''} class="mr-3" data-name="${itemName}" data-type="standard">
            <div class="flex-1">
                <div class="font-medium text-gray-800">${itemName}</div>
            </div>
        </div>`;
    }).join('');
    
    // Create addon deliverables checkboxes
    const addonHtml = allAddonDeliverables.map(itemName => {
        const isChecked = existingDeliverables.addons?.some(existing => existing.name === itemName) || false;
        return `<div class="flex items-center p-2 bg-white rounded border mb-2">
            <input type="checkbox" ${isChecked ? 'checked' : ''} class="mr-3" data-name="${itemName}" data-type="addon">
            <div class="flex-1">
                <div class="font-medium text-gray-800">${itemName}</div>
            </div>
        </div>`;
    }).join('');
    
    // Add custom deliverables
    let customHtml = '';
    if (existingDeliverables.custom && existingDeliverables.custom.length > 0) {
        customHtml = existingDeliverables.custom.map(item => {
            return `<div class="flex items-center p-2 bg-purple-50 rounded border border-purple-200 mb-2">
                <input type="checkbox" checked class="mr-3" data-name="${item.name}" data-type="custom">
                <div class="flex-1">
                    <div class="font-medium text-gray-800">${item.name}</div>
                    <span class="text-xs bg-purple-100 text-purple-700 px-1 rounded">Custom</span>
                </div>
            </div>`;
        }).join('');
    }
    
    standardContainer.innerHTML = `<h5 class="font-medium mb-3 text-blue-600">List of Standard Delivery (Check/Uncheck as needed)</h5>${standardHtml}`;
    addonContainer.innerHTML = `<h5 class="font-medium mb-3 text-green-600">List of Add-On Delivery (Check/Uncheck as needed)</h5>${addonHtml}${customHtml}
        <div class="mt-4 p-3 bg-gray-50 rounded border">
            <h6 class="font-medium text-gray-700 mb-2">Add Custom Deliverable</h6>
            <div class="flex gap-2">
                <input type="text" id="custom-deliverable-input" placeholder="Enter custom deliverable name" class="flex-1 px-3 py-2 border rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                <button type="button" onclick="addCustomDeliverable()" class="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>`;
}

function saveDeliverablesSection() {
    const standardCheckboxes = document.querySelectorAll('#standard-deliverables input[data-type="standard"]');
    const addonCheckboxes = document.querySelectorAll('#addon-deliverables input[data-type="addon"]');
    const customCheckboxes = document.querySelectorAll('#addon-deliverables input[data-type="custom"]');
    
    const updatedDeliverables = {
        standard: [],
        addons: [],
        custom: []
    };
    
    // Process standard deliverables
    standardCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            updatedDeliverables.standard.push({
                name: checkbox.dataset.name,
                checked: true,
                quantity: 1
            });
        }
    });
    
    // Process addon deliverables
    addonCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            updatedDeliverables.addons.push({
                name: checkbox.dataset.name,
                checked: true,
                quantity: 1
            });
        }
    });
    
    // Process custom deliverables
    customCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            updatedDeliverables.custom.push({
                name: checkbox.dataset.name,
                checked: true,
                quantity: 1
            });
        }
    });
    
    // Update localStorage
    updateOrderInStorage('deliverables', updatedDeliverables);
    
    // Update current order object
    if (currentOrder) {
        currentOrder.deliverables = updatedDeliverables;
    }
    
    // Refresh display immediately
    populateDeliverables(updatedDeliverables);
    
    console.log('✅ Deliverables saved and updated:', updatedDeliverables);
}

function saveClientSection() {
    const fields = ['bride-name', 'bride-contact', 'bride-email', 'bride-aadhar', 'groom-name', 'groom-contact', 'groom-email', 'groom-aadhar'];
    const updates = { bride: {}, groom: {} };
    
    fields.forEach(fieldId => {
        const input = document.getElementById(`edit-${fieldId}`);
        if (input) {
            const newValue = input.value;
            const element = document.getElementById(fieldId);
            element.textContent = newValue;
            
            const [person, field] = fieldId.split('-');
            updates[person][field] = newValue;
        }
    });
    
    updateOrderInStorage('client_details', updates);
}

function saveCostSection() {
    const fields = ['operation-travel', 'operation-accommodation', 'operation-gear', 'operation-drone'];
    const updates = {};
    
    fields.forEach(fieldId => {
        const input = document.getElementById(`edit-${fieldId}`);
        if (input) {
            const newValue = input.value;
            const element = document.getElementById(fieldId);
            element.textContent = newValue;
            
            const fieldMap = {
                'operation-travel': 'travel_cost',
                'operation-accommodation': 'accommodation_cost', 
                'operation-gear': 'gear_rental',
                'operation-drone': 'drone_rental'
            };
            updates[fieldMap[fieldId]] = newValue;
        }
    });
    
    updateOrderInStorage('cost_factors', updates);
}

function saveProjectSection() {
    const fields = ['coverage-type', 'coverage-category', 'culture-specific', 'inspiration-specification', 'makeup-venue', 'coverage-prewedding'];
    const updates = {};
    
    fields.forEach(fieldId => {
        const input = document.getElementById(`edit-${fieldId}`);
        if (input) {
            const newValue = input.value;
            const element = document.getElementById(fieldId);
            element.textContent = newValue;
            
            const fieldMap = {
                'coverage-type': 'coverage_type',
                'coverage-category': 'category',
                'culture-specific': 'culture_specific',
                'inspiration-specification': 'inspiration_specification',
                'makeup-venue': 'makeup_venue',
                'coverage-prewedding': 'prewedding_enabled'
            };
            
            updates[fieldMap[fieldId]] = newValue;
        }
    });
    
    updateOrderInStorage('project_specs', updates);
}

function saveNotesSection() {
    const textarea = document.getElementById('edit-client-notes');
    if (textarea) {
        const newValue = textarea.value;
        const element = document.getElementById('client-notes');
        element.innerHTML = newValue.replace(/\n/g, '<br><br>');
        
        // Save to localStorage - you can customize this based on your notes structure
        const updates = {
            general: [{ text: newValue, timestamp: new Date().toLocaleString() }]
        };
        updateOrderInStorage('notes', updates);
    }
}

// Save button functionality removed per user request

function updateOrderInStorage(section, data) {
    try {
        const orders = JSON.parse(localStorage.getItem('weddingcrm_orders') || '[]');
        const orderIndex = orders.findIndex(order => order.id === currentOrderId || order._id === currentOrderId);
        
        if (orderIndex !== -1) {
            if (!orders[orderIndex][section]) orders[orderIndex][section] = {};
            Object.assign(orders[orderIndex][section], data);
            
            localStorage.setItem('weddingcrm_orders', JSON.stringify(orders));
            console.log(`${section} updated in localStorage:`, data);
        }
    } catch (error) {
        console.error('Error updating order:', error);
    }
}

function addCustomDeliverable() {
    const input = document.getElementById('custom-deliverable-input');
    const customName = input.value.trim();
    
    if (!customName) {
        alert('Please enter a deliverable name');
        return;
    }
    
    // Add to addon container before the input box
    const addonContainer = document.getElementById('addon-deliverables');
    const inputBox = addonContainer.querySelector('.bg-gray-50');
    
    const newCustomHtml = `<div class="flex items-center p-2 bg-purple-50 rounded border border-purple-200 mb-2">
        <input type="checkbox" checked class="mr-3" data-name="${customName}" data-type="custom">
        <div class="flex-1">
            <div class="font-medium text-gray-800">${customName}</div>
            <span class="text-xs bg-purple-100 text-purple-700 px-1 rounded">Custom</span>
        </div>
    </div>`;
    
    inputBox.insertAdjacentHTML('beforebegin', newCustomHtml);
    input.value = '';
}

// Make functions globally available
window.loadSheet = loadSheet;
window.lockOrder = lockOrder;
window.raiseQuotation = raiseQuotation;
window.teamNote = teamNote;
window.closeOrder = closeOrder;
window.cancelOrder = cancelOrder;
window.allocateResources = allocateResources;
window.addCustomDeliverable = addCustomDeliverable;