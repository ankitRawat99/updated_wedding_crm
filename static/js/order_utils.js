// Order Form Utility Functions

// Add Event Function (missing from main file)
function addEvent() {
    try {
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) {
            console.error('Events container not found');
            return;
        }
        
        const eventCount = eventsContainer.querySelectorAll('.event-box').length;
        const newEventNumber = eventCount + 1;
        
        // Create new event box (simplified version)
        const eventBox = document.createElement('div');
        eventBox.className = 'event-box bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-4';
        eventBox.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h4 class="text-lg font-semibold text-gray-800">Event ${newEventNumber}</h4>
                <button type="button" onclick="removeEvent(this)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                    <select name="event_name[]" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Event</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Mehendi">Mehendi</option>
                        <option value="Sangam">Sangam</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Reception">Reception</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Coverage Type</label>
                    <select name="coverage[]" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Coverage</option>
                        <option value="Photo Only">Photo Only</option>
                        <option value="Video Only">Video Only</option>
                        <option value="Photo + Video">Photo + Video</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input type="date" name="event_date[]" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" name="event_location[]" placeholder="Event location" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
                </div>
            </div>
        `;
        
        eventsContainer.appendChild(eventBox);
        console.log('New event added successfully');
        
    } catch (error) {
        console.error('Error adding event:', error);
        if (window.alertSystem) {
            window.alertSystem.show('Error adding event', 'error');
        }
    }
}

// Remove Event Function
function removeEvent(button) {
    try {
        const eventBox = button.closest('.event-box');
        if (eventBox) {
            eventBox.remove();
            console.log('Event removed successfully');
        }
    } catch (error) {
        console.error('Error removing event:', error);
    }
}

// Safe element finder with error handling
function safeGetElement(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.error('Error finding element:', selector, error);
        return null;
    }
}

// Safe value getter with fallback
function safeGetValue(element, fallback = '') {
    try {
        return element ? (element.value || fallback) : fallback;
    } catch (error) {
        console.error('Error getting value:', error);
        return fallback;
    }
}

// Validate form data before submission
function validateOrderForm() {
    const errors = [];
    
    // Check client names
    const brideName = safeGetValue(safeGetElement('input[name="bride_name"]'));
    const groomName = safeGetValue(safeGetElement('input[name="groom_name"]'));
    
    if (!brideName && !groomName) {
        errors.push('At least one client name is required');
    }
    
    // Check events
    const eventBoxes = document.querySelectorAll('.event-box');
    if (eventBoxes.length === 0) {
        errors.push('At least one event is required');
    }
    
    return errors;
}