/**
 * Order Bookings Page JavaScript
 * Handles filtering, searching, and display of booking cards
 */

let currentDivision = 'active-events';
let currentStatus = '';

/**
 * Filter orders by division (active/previous events)
 * @param {string} division - Division to filter by
 */
function filterByDivision(division) {
    currentDivision = division;
    
    // Update button styles
    document.querySelectorAll('.division-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });
    
    const activeBtn = document.querySelector(`[data-division="${division}"]`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
        activeBtn.classList.add('bg-blue-600', 'text-white');
    }
    
    // Update label text based on division
    const bookingLabel = document.getElementById('bookingLabel');
    if (bookingLabel) {
        if (division === 'previous-events') {
            bookingLabel.textContent = 'Past Events:';
        } else {
            bookingLabel.textContent = 'Active Booking:';
        }
    }
    
    applyFilters();
}

/**
 * Filter orders by status
 * @param {string} status - Status to filter by
 */
function filterByStatus(status) {
    currentStatus = currentStatus === status ? '' : status;
    
    // Update button styles
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-100', 'text-gray-700');
    });
    
    if (currentStatus) {
        const activeBtn = document.querySelector(`[data-status="${status}"]`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-gray-100', 'text-gray-700');
            activeBtn.classList.add('bg-blue-500', 'text-white');
        }
    }
    
    applyFilters();
}

/**
 * Apply all active filters to the booking cards
 */
function applyFilters() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const allCards = document.querySelectorAll('[data-status]');
    let visibleCount = 0;
    
    allCards.forEach(card => {
        const cardStatus = card.dataset.status;
        const cardStage = card.dataset.stage;
        const cardText = card.textContent.toLowerCase();
        
        // Search filter
        const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
        
        // Division filter - map to order lifecycle stages
        let matchesDivision = true;
        if (currentDivision === 'active-events') {
            // Show orders in active stages (pre-lock through in-production)
            const activeStages = ['pre-lock', 'pre-event', 'in-event', 'post-event', 'in-production'];
            matchesDivision = activeStages.includes(cardStage);
        } else if (currentDivision === 'previous-events') {
            // Show completed orders (out-production)
            matchesDivision = cardStage === 'out-production';
        }
        
        // Status filter based on stage mapping
        let matchesStatus = true;
        if (currentStatus) {
            switch (currentStatus) {
                case 'locked':
                case 'pre-lock':
                    matchesStatus = cardStage === 'pre-lock';
                    break;
                case 'not-locked':
                    matchesStatus = cardStage !== 'pre-lock';
                    break;
                case 'lock-waitlist':
                    matchesStatus = cardStage === 'pre-lock';
                    break;
                case 'pre-event':
                    matchesStatus = cardStage === 'pre-event';
                    break;
                case 'ongoing-events':
                case 'in-event':
                    matchesStatus = cardStage === 'in-event';
                    break;
                case 'post-events':
                    matchesStatus = cardStage === 'post-event';
                    break;
                case 'in-production':
                    matchesStatus = cardStage === 'in-production';
                    break;
                case 'out-production':
                    matchesStatus = cardStage === 'out-production';
                    break;
                case 'in-production-waitlist':
                    matchesStatus = cardText.includes('waitlist') && cardText.includes('production');
                    break;
                case 'client-approval':
                    matchesStatus = cardText.includes('approval') || cardText.includes('revision');
                    break;
                case 'completion-waitlist':
                    matchesStatus = cardText.includes('completion') && cardText.includes('waitlist');
                    break;
                case 'payment-waitlist':
                    matchesStatus = cardText.includes('payment') && cardText.includes('waitlist');
                    break;
                default:
                    matchesStatus = true;
            }
        }
        
        // Show/hide card based on filters
        if (matchesSearch && matchesDivision && matchesStatus) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active booking count
    const countElement = document.getElementById('activeBookingCount');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
}

/**
 * Load and render booking orders from storage
 */
function loadBookingOrders() {
    try {
        // Use storage manager to render booking cards
        if (window.storageManager) {
            window.storageManager.renderBookingCards();
        } else {
            console.error('Storage manager not available');
            showNoOrdersMessage();
        }
        
        // Apply initial filters
        setTimeout(() => {
            applyFilters();
        }, 100);
        
    } catch (error) {
        console.error('Error loading booking orders:', error);
        showNoOrdersMessage();
    }
}

/**
 * Show no orders message
 */
function showNoOrdersMessage() {
    // Don't show temporary message, let storageManager handle it
}

/**
 * Initialize the order bookings page
 */
function initializeOrderBookings() {
    // Load booking orders
    loadBookingOrders();
    
    // Set up search input listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Force show filter buttons and keep them visible
    const filterButtons = document.getElementById('filterButtons');
    if (filterButtons) {
        // Initial setup
        filterButtons.style.display = 'flex';
        filterButtons.style.visibility = 'visible';
        filterButtons.style.opacity = '1';
        
        // Force show all status buttons
        const statusButtons = filterButtons.querySelectorAll('.status-btn');
        statusButtons.forEach(btn => {
            btn.style.display = 'inline-flex';
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';
        });
        
        // Create observer to watch for changes
        const observer = new MutationObserver(function() {
            filterButtons.style.display = 'flex';
            filterButtons.style.visibility = 'visible';
            filterButtons.style.opacity = '1';
            
            statusButtons.forEach(btn => {
                btn.style.display = 'inline-flex';
                btn.style.visibility = 'visible';
                btn.style.opacity = '1';
            });
        });
        
        // Start observing
        observer.observe(filterButtons, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['style', 'class']
        });
    }
    
    console.log('Order bookings page initialized');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeOrderBookings);

// Export functions for global use
window.orderBookings = {
    filterByDivision,
    filterByStatus,
    applyFilters,
    loadBookingOrders
};