// Order Form JavaScript
let currentTab = 0;
const tabs = ['personal', 'event', 'requirements', 'package'];

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    document.getElementById(tabName + '-content').classList.remove('hidden');
    
    const activeTab = document.getElementById(tabName + '-tab');
    activeTab.classList.add('active', 'border-blue-500', 'text-blue-600');
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    
    currentTab = tabs.indexOf(tabName);
    updateNavigation();
}

function nextTab() {
    if (currentTab < tabs.length - 1) {
        currentTab++;
        showTab(tabs[currentTab]);
    }
}

function previousTab() {
    if (currentTab > 0) {
        currentTab--;
        showTab(tabs[currentTab]);
    }
}

function updateNavigation() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    if (currentTab === 0) {
        prevBtn?.classList.add('hidden');
    } else {
        prevBtn?.classList.remove('hidden');
    }
    
    if (currentTab === tabs.length - 1) {
        nextBtn?.classList.add('hidden');
        submitBtn?.classList.remove('hidden');
    } else {
        nextBtn?.classList.remove('hidden');
        submitBtn?.classList.add('hidden');
    }
}

// Tab completion functionality
function toggleCompletion(event, tabName) {
    event.stopPropagation();
    
    const checkbox = event.currentTarget;
    
    if (checkbox.classList.contains('bg-white')) {
        setCheckboxCompleted(tabName);
    } else {
        setCheckboxIncomplete(tabName);
    }
    
    updateButtonStates();
}

function setCheckboxCompleted(tabName) {
    const checkbox = document.querySelector(`#${tabName}-content .completion-checkbox`);
    if (checkbox) {
        const checkIcon = checkbox.querySelector('i');
        checkbox.classList.remove('bg-white', 'border-gray-300');
        checkbox.classList.add('bg-gradient-to-r', 'from-green-400', 'to-green-600', 'border-green-500');
        if (checkIcon) checkIcon.classList.remove('hidden');
    }
}

function setCheckboxIncomplete(tabName) {
    const checkbox = document.querySelector(`#${tabName}-content .completion-checkbox`);
    if (checkbox) {
        const checkIcon = checkbox.querySelector('i');
        checkbox.classList.remove('bg-gradient-to-r', 'from-green-400', 'to-green-600', 'border-green-500');
        checkbox.classList.add('bg-white', 'border-gray-300');
        if (checkIcon) checkIcon.classList.add('hidden');
    }
}

function updateButtonStates() {
    const personal = isTabCompleted('personal');
    const event = isTabCompleted('event');
    const requirements = isTabCompleted('requirements');
    const package = isTabCompleted('package');
    
    updateButton('generate-btn', personal && event && requirements && package, 'purple');
    updateButton('quotation-btn', personal && event && package, 'green');
    updateButton('calculator-btn', event && requirements, 'orange');
}

function isTabCompleted(tabName) {
    const tab = document.querySelector(`#${tabName}-content .completion-checkbox`);
    return tab && tab.classList.contains('from-green-400');
}

function updateButton(buttonId, enabled, color) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    if (enabled) {
        button.disabled = false;
        button.classList.remove('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
        button.classList.add(`bg-gradient-to-r`, `from-${color}-500`, `to-${color}-600`, 'text-white');
    } else {
        button.disabled = true;
        button.classList.remove('bg-gradient-to-r', `from-${color}-500`, `to-${color}-600`, 'text-white');
        button.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
    }
}

// Team Composition Functions
function updateTeamFields(selectElement) {
    const teamComposition = selectElement.value;
    const eventBox = selectElement.closest('.event-box');
    const teamFieldsContainer = eventBox.querySelector('.team-fields');
    const teamMembersContainer = eventBox.querySelector('.team-members-container');
    
    if (!teamComposition || !teamFieldsContainer || !teamMembersContainer) {
        if (teamFieldsContainer) teamFieldsContainer.classList.add('hidden');
        return;
    }
    
    teamFieldsContainer.classList.remove('hidden');
    teamMembersContainer.innerHTML = '';
    
    if (teamComposition === '1+1') {
        // Add 2 team type fields
        for (let i = 1; i <= 2; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="team_member_${i}[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
        }
        // Add 1 assistant field
        const assistantDiv = document.createElement('div');
        assistantDiv.className = 'md:col-span-2 flex justify-center';
        assistantDiv.innerHTML = `
            <div class="w-full max-w-xs">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant</label>
                <input type="text" name="assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
        `;
        teamMembersContainer.appendChild(assistantDiv);
    } else if (teamComposition === '2+2') {
        // Add 4 team members with assistants after every 2
        for (let i = 1; i <= 4; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="team_member_${i}[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
            
            // Add assistant after every 2 members
            if (i % 2 === 0) {
                const assistantDiv = document.createElement('div');
                assistantDiv.className = 'md:col-span-2 flex justify-center';
                assistantDiv.innerHTML = `
                    <div class="w-full max-w-xs">
                        <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant ${i/2}</label>
                        <input type="text" name="assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                `;
                teamMembersContainer.appendChild(assistantDiv);
            }
        }
    } else if (teamComposition === '3+3') {
        // Add 6 team members with assistants after every 2
        for (let i = 1; i <= 6; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="team_member_${i}[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
            
            // Add assistant after every 2 members
            if (i % 2 === 0) {
                const assistantDiv = document.createElement('div');
                assistantDiv.className = 'md:col-span-2 flex justify-center';
                assistantDiv.innerHTML = `
                    <div class="w-full max-w-xs">
                        <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant ${i/2}</label>
                        <input type="text" name="assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                `;
                teamMembersContainer.appendChild(assistantDiv);
            }
        }
    }
}

// Pre-Wedding Team Composition Function
function updatePWTeamFields(selectElement) {
    const teamComposition = selectElement.value;
    const teamFieldsContainer = document.getElementById('pwTeamFields');
    const teamMembersContainer = document.getElementById('pwTeamMembersContainer');
    
    if (!teamComposition || !teamFieldsContainer || !teamMembersContainer) {
        if (teamFieldsContainer) teamFieldsContainer.classList.add('hidden');
        return;
    }
    
    teamFieldsContainer.classList.remove('hidden');
    teamMembersContainer.innerHTML = '';
    
    if (teamComposition === '1+1') {
        // Add 2 team members
        for (let i = 1; i <= 2; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="pw_team_member_${i}" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
        }
        // Add 1 assistant after every 2 members
        const assistantDiv = document.createElement('div');
        assistantDiv.className = 'md:col-span-2 flex justify-center';
        assistantDiv.innerHTML = `
            <div class="w-full max-w-xs">
                <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant</label>
                <input type="text" name="pw_assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            </div>
        `;
        teamMembersContainer.appendChild(assistantDiv);
    } else if (teamComposition === '2+2') {
        // Add 4 team members with assistants after every 2
        for (let i = 1; i <= 4; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="pw_team_member_${i}" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
            
            // Add assistant after every 2 members
            if (i % 2 === 0) {
                const assistantDiv = document.createElement('div');
                assistantDiv.className = 'md:col-span-2 flex justify-center';
                assistantDiv.innerHTML = `
                    <div class="w-full max-w-xs">
                        <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant ${i/2}</label>
                        <input type="text" name="pw_assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                `;
                teamMembersContainer.appendChild(assistantDiv);
            }
        }
    } else if (teamComposition === '3+3') {
        // Add 6 team members with assistants after every 2
        for (let i = 1; i <= 6; i++) {
            const memberDiv = document.createElement('div');
            memberDiv.innerHTML = `
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Member ${i} Type</label>
                <select name="pw_team_member_${i}" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="">Select Type</option>
                    <option value="Candid">Candid</option>
                    <option value="Cine">Cine</option>
                    <option value="TPhoto">TPhoto</option>
                    <option value="TVideo">TVideo</option>
                </select>
            `;
            teamMembersContainer.appendChild(memberDiv);
            
            // Add assistant after every 2 members
            if (i % 2 === 0) {
                const assistantDiv = document.createElement('div');
                assistantDiv.className = 'md:col-span-2 flex justify-center';
                assistantDiv.innerHTML = `
                    <div class="w-full max-w-xs">
                        <label class="block text-sm font-medium text-gray-700 mb-2 text-center">Assistant ${i/2}</label>
                        <input type="text" name="pw_assistants[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                `;
                teamMembersContainer.appendChild(assistantDiv);
            }
        }
    }
}

// Add Event Function
function addEvent() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;
    
    const eventCount = eventsContainer.querySelectorAll('.event-box').length + 1;
    
    // Create new event card
    const newEventCard = document.createElement('div');
    newEventCard.className = 'event-box bg-gray-50 border border-gray-200 rounded-custom p-6 mb-6';
    newEventCard.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <h4 class="font-semibold text-gray-900">Event ${eventCount}</h4>
            <button type="button" onclick="removeEvent(this)" class="text-red-500 hover:text-red-700 text-sm">
                <i class="fas fa-trash mr-1"></i>Remove
            </button>
        </div>
        
        <!-- Row 1: Event Name, Date, Location -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Event Name <span class="text-red-500">*</span>
                </label>
                <select name="event_name[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Event</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Haldi">Haldi</option>
                    <option value="Sangam">Sangam</option>
                    <option value="Ring Ceremony">Ring Ceremony</option>
                    <option value="Custom">Custom</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Date <span class="text-red-500">*</span>
                </label>
                <input type="date" name="event_date[]" required min="2024-01-01" max="2099-12-31" class="w-full px-4 py-3 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input type="text" name="event_location[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
        </div>
        
        <!-- Row 2: Coverage, Time, Gathering -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Coverage <span class="text-red-500">*</span>
                </label>
                <select name="coverage[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Coverage</option>
                    <option value="Together">Together</option>
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <select name="event_time[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Time</option>
                    <option value="Morning">Morning</option>
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Gathering</label>
                <input type="text" name="gathering[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
        </div>
        
        <!-- Row 3: Time Slab, Quick Note, Drone -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Time Slab/Days/Manual</label>
                <input type="text" name="time_slab[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Quick Note</label>
                <input type="text" name="quick_note[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Drone</label>
                <select name="drone[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                </select>
            </div>
        </div>
        
        <!-- Team Composition Section -->
        <div class="grid grid-cols-1 gap-4 mb-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Team Composition</label>
                <select name="team_composition[]" onchange="updateTeamFields(this)" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Select Team</option>
                    <option value="1+1">1+1</option>
                    <option value="2+2">2+2</option>
                    <option value="3+3">3+3</option>
                </select>
            </div>
        </div>
        
        <!-- Dynamic Team Fields -->
        <div class="team-fields hidden mb-4">
            <div class="bg-blue-50 border border-blue-200 rounded-custom p-4">
                <h5 class="font-medium text-blue-700 mb-3">Team Members</h5>
                <div class="team-members-container grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Team member fields will be added here dynamically -->
                </div>
            </div>
        </div>
    `;
    
    eventsContainer.appendChild(newEventCard);
    
    // Scroll to the new event
    newEventCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Focus on the event name field
    setTimeout(() => {
        const eventNameSelect = newEventCard.querySelector('select[name="event_name[]"]');
        if (eventNameSelect) eventNameSelect.focus();
    }, 500);
}

function removeEvent(button) {
    const eventBox = button.closest('.event-box');
    const eventsContainer = document.getElementById('events-container');
    
    // Don't allow removing the last event
    if (eventsContainer.querySelectorAll('.event-box').length <= 1) {
        window.alertSystem?.show('At least one event is required', 'warning');
        return;
    }
    
    eventBox.remove();
    
    // Update event numbers
    eventsContainer.querySelectorAll('.event-box').forEach((box, index) => {
        const header = box.querySelector('h4');
        if (header) header.textContent = `Event ${index + 1}`;
    });
}

// Pre-Wedding Toggle Functions
function togglePreWeddingForm() {
    const toggle = document.getElementById('preWeddingToggle');
    const preWeddingContainer = document.getElementById('preWeddingEventContainer');
    
    if (toggle && toggle.checked) {
        if (preWeddingContainer) {
            preWeddingContainer.classList.remove('hidden');
        }
    } else {
        if (preWeddingContainer) {
            preWeddingContainer.classList.add('hidden');
        }
    }
}

function removePreWeddingEvent() {
    const toggle = document.getElementById('preWeddingToggle');
    const preWeddingContainer = document.getElementById('preWeddingEventContainer');
    
    if (toggle) toggle.checked = false;
    if (preWeddingContainer) preWeddingContainer.classList.add('hidden');
}

function handlePWTypeChange() {
    const pwType = document.querySelector('select[name="pw_type"]')?.value;
    const deliverables = document.getElementById('preWeddingDeliverables');
    const deliverablesList = document.getElementById('pwDeliverablesList');
    
    if (pwType && deliverables && deliverablesList) {
        deliverables.classList.remove('hidden');
        deliverablesList.innerHTML = '';
        
        if (pwType === 'photo') {
            deliverablesList.innerHTML = `
                <div class="bg-white p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md">
                    <label class="flex items-center cursor-pointer group">
                        <input type="checkbox" name="deliverables[]" value="Pre-Wedding Edited Photos" checked class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mr-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-camera text-white text-sm"></i>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-800 group-hover:text-purple-700">Edited Photos</span>
                                <p class="text-xs text-gray-500">Pre-wedding photo editing</p>
                            </div>
                        </div>
                    </label>
                    <div class="mt-2 ml-16">
                        <input type="number" name="pw_photo_quantity" value="50" min="1" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Qty">
                        <span class="text-xs text-gray-500 ml-2">photos</span>
                    </div>
                </div>
            `;
        } else if (pwType === 'photo_video') {
            deliverablesList.innerHTML = `
                <div class="bg-white p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md">
                    <label class="flex items-center cursor-pointer group">
                        <input type="checkbox" name="deliverables[]" value="Pre-Wedding Edited Photos" checked class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mr-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-camera text-white text-sm"></i>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-800 group-hover:text-purple-700">Edited Photos</span>
                                <p class="text-xs text-gray-500">Pre-wedding photo editing</p>
                            </div>
                        </div>
                    </label>
                    <div class="mt-2 ml-16">
                        <input type="number" name="pw_photo_quantity" value="50" min="1" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Qty">
                        <span class="text-xs text-gray-500 ml-2">photos</span>
                    </div>
                </div>
                <div class="bg-white p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 shadow-sm hover:shadow-md">
                    <label class="flex items-center cursor-pointer group">
                        <input type="checkbox" name="deliverables[]" value="Pre-Wedding Video" checked class="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 mr-4">
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-video text-white text-sm"></i>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-800 group-hover:text-purple-700">Pre-Wedding Video</span>
                                <p class="text-xs text-gray-500">Pre-wedding video editing</p>
                            </div>
                        </div>
                    </label>
                    <div class="mt-2 ml-16">
                        <input type="number" name="pw_video_duration" value="5" min="1" class="w-20 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Min">
                        <span class="text-xs text-gray-500 ml-2">minutes</span>
                    </div>
                </div>
            `;
        }
    } else if (deliverables) {
        deliverables.classList.add('hidden');
    }
}

// Payment calculation functions
function calculatePayments() {
    const dealAmount = parseFloat(document.getElementById('deal-amount').value) || 0;
    const paymentSummary = document.getElementById('payment-summary');
    
    // Always show summary if there's any payment data
    const hasPayments = document.querySelectorAll('.payment-amount').length > 0;
    if (dealAmount > 0 || hasPayments) {
        paymentSummary?.classList.remove('hidden');
    }
    
    document.querySelectorAll('.payment-percentage').forEach(percentageInput => {
        calculateFromPercentage(percentageInput);
    });
    
    updatePaymentSummary();
}

function calculateFromPercentage(percentageInput) {
    const dealAmount = parseFloat(document.getElementById('deal-amount').value) || 0;
    const percentage = parseFloat(percentageInput.value) || 0;
    
    if (dealAmount > 0 && percentage > 0) {
        const amount = (dealAmount * percentage) / 100;
        const amountInput = percentageInput.closest('.grid').querySelector('.payment-amount');
        if (amountInput) {
            amountInput.value = Math.round(amount);
        }
    }
    updatePaymentSummary();
}

function calculateFromAmount(amountInput) {
    const dealAmount = parseFloat(document.getElementById('deal-amount').value) || 0;
    const amount = parseFloat(amountInput.value) || 0;
    
    if (dealAmount > 0 && amount > 0) {
        const percentage = (amount / dealAmount) * 100;
        const percentageInput = amountInput.closest('.grid').querySelector('.payment-percentage');
        if (percentageInput) {
            percentageInput.value = Math.round(percentage * 100) / 100;
        }
    }
    updatePaymentSummary();
}

function updatePaymentSummary() {
    const dealAmount = parseFloat(document.getElementById('deal-amount')?.value) || 0;
    
    let advanceTotal = 0;
    let eventTotal = 0;
    let deliveryTotal = 0;
    
    document.querySelectorAll('.advance-payment .payment-amount').forEach(input => {
        advanceTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.event-payment .payment-amount').forEach(input => {
        eventTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.delivery-payment .payment-amount').forEach(input => {
        deliveryTotal += parseFloat(input.value) || 0;
    });
    
    const totalAllocated = advanceTotal + eventTotal + deliveryTotal;
    const remaining = dealAmount - totalAllocated;
    const progressPercentage = dealAmount > 0 ? Math.round((totalAllocated / dealAmount) * 100) : 0;
    
    const advanceTotalEl = document.getElementById('advance-total');
    const eventTotalEl = document.getElementById('event-total');
    const deliveryTotalEl = document.getElementById('delivery-total');
    
    if (advanceTotalEl) advanceTotalEl.textContent = `₹${advanceTotal.toLocaleString()}`;
    if (eventTotalEl) eventTotalEl.textContent = `₹${eventTotal.toLocaleString()}`;
    if (deliveryTotalEl) deliveryTotalEl.textContent = `₹${deliveryTotal.toLocaleString()}`;
    
    const remainingAmountEl = document.getElementById('remaining-amount');
    const progressPercentageEl = document.getElementById('progress-percentage');
    
    if (remainingAmountEl) remainingAmountEl.textContent = `₹${remaining.toLocaleString()}`;
    if (progressPercentageEl) progressPercentageEl.textContent = `${progressPercentage}%`;
    
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const circumference = 100;
        const offset = circumference - (progressPercentage / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference}, ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    if (remainingAmountEl) {
        if (remaining < 0) {
            remainingAmountEl.className = 'font-semibold text-red-600';
        } else if (remaining === 0) {
            remainingAmountEl.className = 'font-semibold text-green-600';
        } else {
            remainingAmountEl.className = 'font-semibold text-orange-600';
        }
    }
}

function updatePaymentSummary() {
    const dealAmount = parseFloat(document.getElementById('deal-amount')?.value) || 0;
    
    let advanceTotal = 0;
    let eventTotal = 0;
    let deliveryTotal = 0;
    
    document.querySelectorAll('.advance-payment .payment-amount').forEach(input => {
        advanceTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.event-payment .payment-amount').forEach(input => {
        eventTotal += parseFloat(input.value) || 0;
    });
    
    document.querySelectorAll('.delivery-payment .payment-amount').forEach(input => {
        deliveryTotal += parseFloat(input.value) || 0;
    });
    
    const totalAllocated = advanceTotal + eventTotal + deliveryTotal;
    const remaining = dealAmount - totalAllocated;
    const progressPercentage = dealAmount > 0 ? Math.round((totalAllocated / dealAmount) * 100) : 0;
    
    const advanceTotalEl = document.getElementById('advance-total');
    const eventTotalEl = document.getElementById('event-total');
    const deliveryTotalEl = document.getElementById('delivery-total');
    
    if (advanceTotalEl) advanceTotalEl.textContent = `₹${advanceTotal.toLocaleString()}`;
    if (eventTotalEl) eventTotalEl.textContent = `₹${eventTotal.toLocaleString()}`;
    if (deliveryTotalEl) deliveryTotalEl.textContent = `₹${deliveryTotal.toLocaleString()}`;
    
    const remainingAmountEl = document.getElementById('remaining-amount');
    const progressPercentageEl = document.getElementById('progress-percentage');
    
    if (remainingAmountEl) remainingAmountEl.textContent = `₹${remaining.toLocaleString()}`;
    if (progressPercentageEl) progressPercentageEl.textContent = `${progressPercentage}%`;
    
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const circumference = 100;
        const offset = circumference - (progressPercentage / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference}, ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    if (remainingAmountEl) {
        if (remaining < 0) {
            remainingAmountEl.className = 'font-semibold text-red-600';
        } else if (remaining === 0) {
            remainingAmountEl.className = 'font-semibold text-green-600';
        } else {
            remainingAmountEl.className = 'font-semibold text-orange-600';
        }
    }
}

// Generate Order Function
function generateOrder() {
    console.log('🚀 GENERATE ORDER FUNCTION CALLED!');
    
    try {
        const orderData = collectFormData();
        
        console.log('🚀 Generating order with data:', orderData);
        
        // MANDATORY VALIDATIONS
        const validationErrors = [];
        
        // 1. Client Name mandatory (at least 1)
        if (!orderData.client_details?.bride?.name && !orderData.client_details?.groom?.name) {
            validationErrors.push('❌ Client Name: At least one client name (Bride or Groom) is mandatory');
        }
        
        // 2. Date of booking amount mandatory
        let hasBookingDate = false;
        if (orderData.payment_schedule?.payments && orderData.payment_schedule.payments.length > 0) {
            orderData.payment_schedule.payments.forEach((payment) => {
                if (payment.date && payment.date.trim() !== '' && payment.amount && parseFloat(payment.amount) > 0) {
                    hasBookingDate = true;
                }
            });
        }
        if (!hasBookingDate) {
            validationErrors.push('❌ Date of Booking Amount: At least one payment with date and amount is mandatory');
        }
        
        // 3. Coverage type mandatory
        let hasCoverage = false;
        if (orderData.events && orderData.events.length > 0) {
            orderData.events.forEach(event => {
                if (event.coverage && event.coverage.trim() !== '') {
                    hasCoverage = true;
                }
            });
        }
        if (!hasCoverage) {
            validationErrors.push('❌ Coverage: At least one event must have coverage type specified');
        }
        
        // Show validation errors if any
        if (validationErrors.length > 0) {
            const errorMessage = 'Cannot generate order. Please fix the following:<br><br>' + validationErrors.join('<br>');
            window.alertSystem.show(errorMessage, 'error');
            return;
        }
        
        // Check if editing existing order
        const editOrder = localStorage.getItem('editOrder');
        if (editOrder) {
            const existingOrder = JSON.parse(editOrder);
            orderData._id = existingOrder.id || existingOrder._id;
            orderData.id = orderData._id;
            orderData.order_info = {
                ...orderData.order_info,
                created_at: existingOrder.created_at || existingOrder.order_info?.created_at || new Date().toISOString(),
                status: window.storageManager.ORDER_STATUS.PRE_LOCK
            };
        } else {
            orderData.order_info = {
                status: window.storageManager.ORDER_STATUS.PRE_LOCK,
                created_at: new Date().toISOString()
            };
        }
        
        orderData.order_info.updated_at = new Date().toISOString();
        
        // Use storage manager to save/update order
        let success = false;
        if (editOrder) {
            success = window.storageManager.updateOrder(orderData._id, orderData);
        } else {
            success = window.storageManager.saveOrder(orderData);
        }
        
        if (!success) {
            window.alertSystem.show('Failed to save order. Please try again.', 'error');
            return;
        }
        
        // Clean up temporary storage
        localStorage.removeItem('editOrder');
        localStorage.removeItem('draft_order');
        
        window.alertSystem.show(`✅ Order generated successfully!\n\n📋 Order Number: ${orderData._id}`, 'success');
        
        setTimeout(() => {
            window.location.href = `/order-sheet/${orderData._id}`;
        }, 2000);
        
    } catch (error) {
        console.error('Order generation failed:', error);
        window.alertSystem.show('Failed to generate order. Please try again.', 'error');
    }
}



// Data collection functions
function collectFormData() {
    console.log('📊 Starting form data collection...');
    
    return {
        client_details: {
            bride: {
                name: document.querySelector('input[name="bride_name"]')?.value || '',
                aadhar: document.querySelector('input[name="bride_aadhar"]')?.value || '',
                email: document.querySelector('input[name="bride_email"]')?.value || '',
                contact: document.querySelector('input[name="bride_contact"]')?.value || ''
            },
            groom: {
                name: document.querySelector('input[name="groom_name"]')?.value || '',
                aadhar: document.querySelector('input[name="groom_aadhar"]')?.value || '',
                email: document.querySelector('input[name="groom_email"]')?.value || '',
                contact: document.querySelector('input[name="groom_contact"]')?.value || ''
            }
        },
        
        pre_wedding: {
            enabled: document.querySelector('#preWeddingToggle')?.checked || false,
            type: document.querySelector('select[name="pw_type"]')?.value || '',
            start_date: document.querySelector('input[name="pw_start_date"]')?.value || '',
            end_date: document.querySelector('input[name="pw_end_date"]')?.value || '',
            location: document.querySelector('input[name="pw_location"]')?.value || '',
            team_composition: document.querySelector('select[name="pw_team_composition"]')?.value || '',
            drone: document.querySelector('select[name="pw_drone"]')?.value || '',
            requirements: document.querySelector('textarea[name="pw_requirements"]')?.value || '',
            team_members: collectPWTeamMembers()
        },
        
        cost_factors: {
            travel_cost: document.querySelector('input[name="travel_cost"]:checked')?.value || '',
            accommodation_cost: document.querySelector('input[name="accommodation_cost"]:checked')?.value || '',
            gear_rental: document.querySelector('input[name="gear_rental"]:checked')?.value || '',
            drone_rental: document.querySelector('input[name="drone_rental"]:checked')?.value || ''
        },
        
        project_specs: {
            inspiration_specification: document.querySelector('textarea[name="inspiration_specification"]')?.value || '',
            culture_specific: document.querySelector('textarea[name="culture_specific"]')?.value || '',
            category: document.querySelector('select[name="category"]')?.value || '',
            makeup_venue: document.querySelector('input[name="makeup_venue"]')?.value || '',
            coverage_type: document.querySelector('select[name="coverage_type"]')?.value || ''
        },
        
        events: collectEventsData(),
        deliverables: collectDeliverablesData(),
        payment_schedule: collectPaymentData(),
        notes: collectNotesData(),
        section_completion: {
            personal_completed: isTabCompleted('personal'),
            event_completed: isTabCompleted('event'),
            requirements_completed: isTabCompleted('requirements'),
            package_completed: isTabCompleted('package')
        }
    };
}

function isEventCardEmpty(el) {
    const fields = el.querySelectorAll('input,textarea,select');
    for (const f of fields) {
        const val = (f.value || '').trim();
        if ((f.type === 'checkbox' || f.type === 'radio') && f.checked) return false;
        if (val !== '') return false;
    }
    return true;
}

function collectEventsData() {
    const events = [];
    const eventBoxes = document.querySelectorAll('.event-box');
    
    eventBoxes.forEach((eventBox, index) => {
        // Skip pre-wedding container to prevent duplicate blank events
        if (eventBox.closest('#preWeddingEventContainer')) {
            return;
        }
        
        // Skip empty event cards
        if (isEventCardEmpty(eventBox)) {
            return;
        }
        
        const teamMembers = [];
        // Collect team member data from dynamically generated fields
        const teamMembersContainer = eventBox.querySelector('.team-members-container');
        if (teamMembersContainer) {
            // Get all team member selects, including those with array notation
            const teamSelects = teamMembersContainer.querySelectorAll('select[name*="team_member_"]');
            teamSelects.forEach((select, fieldIndex) => {
                if (select && select.value) {
                    const label = select.closest('div').querySelector('label')?.textContent || '';
                    teamMembers.push({
                        position: fieldIndex + 1,
                        type: label.replace(' Type', ''),
                        value: select.value
                    });
                }
            });
        }
        
        const event = {
            event_number: events.length + 1,
            name: eventBox.querySelector('select[name="event_name[]"]')?.value || '',
            date: eventBox.querySelector('input[name="event_date[]"]')?.value || '',
            location: eventBox.querySelector('input[name="event_location[]"]')?.value || '',
            coverage: eventBox.querySelector('select[name="coverage[]"]')?.value || '',
            time: eventBox.querySelector('select[name="event_time[]"]')?.value || '',
            gathering: eventBox.querySelector('input[name="gathering[]"]')?.value || '',
            time_slab: eventBox.querySelector('input[name="time_slab[]"]')?.value || '',
            quick_note: eventBox.querySelector('input[name="quick_note[]"]')?.value || '',
            drone: eventBox.querySelector('select[name="drone[]"]')?.value || '',
            team_composition: eventBox.querySelector('select[name="team_composition[]"]')?.value || '',
            team_members: teamMembers
        };
        events.push(event);
    });
    
    // If no filled events found, include exactly one empty event (default)
    if (events.length === 0) {
        events.push({
            event_number: 1,
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
            team_members: []
        });
    }
    
    return events;
}

function collectDeliverablesData() {
    const deliverables = {
        standard: [],
        addons: [],
        custom: []
    };
    
    document.querySelectorAll('input[name="standard_deliverables[]"]:checked').forEach(checkbox => {
        deliverables.standard.push({ name: checkbox.value, checked: true });
    });
    
    document.querySelectorAll('input[name="addon_deliverables[]"]:checked').forEach(checkbox => {
        deliverables.addons.push({ name: checkbox.value, checked: true });
    });
    
    document.querySelectorAll('input[name="custom_deliverable[]"]').forEach(input => {
        if (input.value) {
            deliverables.custom.push({ name: input.value, checked: true });
        }
    });
    
    return deliverables;
}

function collectPaymentData() {
    const payments = [];
    
    document.querySelectorAll('.advance-payment').forEach((payment, index) => {
        const amount = parseFloat(payment.querySelector('.payment-amount')?.value) || 0;
        const percentage = payment.querySelector('.payment-percentage')?.value || '0';
        const date = payment.querySelector('input[name="advance_date[]"]')?.value || '';
        if (amount > 0 || date) {
            payments.push({
                type: 'Advance',
                amount: amount,
                percentage: percentage,
                date: date
            });
        }
    });
    
    document.querySelectorAll('.event-payment').forEach((payment, index) => {
        const amount = parseFloat(payment.querySelector('.payment-amount')?.value) || 0;
        const percentage = payment.querySelector('.payment-percentage')?.value || '0';
        const date = payment.querySelector('input[name="event_payment_date[]"]')?.value || '';
        if (amount > 0 || date) {
            payments.push({
                type: 'Event',
                amount: amount,
                percentage: percentage,
                date: date
            });
        }
    });
    
    document.querySelectorAll('.delivery-payment').forEach((payment, index) => {
        const amount = parseFloat(payment.querySelector('.payment-amount')?.value) || 0;
        const percentage = payment.querySelector('.payment-percentage')?.value || '0';
        const date = payment.querySelector('input[name="delivery_payment_date[]"]')?.value || '';
        if (amount > 0 || date) {
            payments.push({
                type: 'Delivery',
                amount: amount,
                percentage: percentage,
                date: date
            });
        }
    });
    
    return {
        deal_amount: document.querySelector('input[name="deal_amount"]')?.value || '0',
        payments: payments
    };
}

function collectNotesData() {
    const notes = {};
    const sections = ['personal', 'event', 'requirements', 'package'];
    
    sections.forEach(section => {
        const notesContainer = document.getElementById(`${section}-notes-container`);
        if (notesContainer) {
            const noteElements = notesContainer.querySelectorAll('[id^="note-"]');
            notes[section] = [];
            noteElements.forEach(noteEl => {
                const text = noteEl.querySelector('p')?.textContent;
                const timestamp = noteEl.querySelector('.text-xs')?.textContent;
                if (text) {
                    notes[section].push({
                        text: text,
                        timestamp: timestamp || new Date().toLocaleString(),
                        id: noteEl.id
                    });
                }
            });
        }
    });
    
    return notes;
}

function collectPWTeamMembers() {
    const teamMembers = [];
    const pwTeamContainer = document.getElementById('pwTeamMembersContainer');
    if (pwTeamContainer) {
        pwTeamContainer.querySelectorAll('select[name^="pw_team_member_"]').forEach((select, index) => {
            if (select && select.value) {
                const label = select.closest('div').querySelector('label')?.textContent || '';
                teamMembers.push({
                    position: index + 1,
                    type: label.replace(' Type', ''),
                    value: select.value
                });
            }
        });
    }
    return teamMembers;
}

// Other functions
function saveDraft() {
    console.log('🔄 Saving draft...');
    const orderData = collectFormData();
    
    // Check if editing existing order
    const editOrder = localStorage.getItem('editOrder');
    
    if (editOrder) {
        const existingOrder = JSON.parse(editOrder);
        orderData._id = existingOrder.id || existingOrder._id;
        orderData.id = orderData._id;
        orderData.order_info = {
            ...orderData.order_info,
            created_at: existingOrder.created_at || existingOrder.order_info?.created_at || new Date().toISOString(),
            status: window.storageManager.ORDER_STATUS.DRAFT
        };
    } else {
        orderData.order_info = {
            status: window.storageManager.ORDER_STATUS.DRAFT,
            created_at: new Date().toISOString()
        };
    }
    
    orderData.order_info.updated_at = new Date().toISOString();
    
    // Use storage manager to save/update order
    let success = false;
    if (editOrder) {
        success = window.storageManager.updateOrder(orderData._id, orderData);
    } else {
        success = window.storageManager.saveOrder(orderData);
    }
    
    if (!success) {
        window.alertSystem.show('Failed to save draft. Please try again.', 'error');
        return;
    }
    
    // Clean up temporary storage
    localStorage.removeItem('draft_order');
    localStorage.removeItem('editOrder');
    
    // Direct redirect without alert
    window.location.href = '/order';
}

function loadDraft() {
    const draftOrder = localStorage.getItem('draft_order');
    if (!draftOrder) {
        window.alertSystem.show('No draft found!', 'warning');
        return;
    }
    
    if (confirm('Load draft? This will overwrite current form data.')) {
        const orderData = JSON.parse(draftOrder);
        console.log('Loading draft:', orderData);
        
        // Load client details
        if (orderData.client_details) {
            if (orderData.client_details.bride) {
                const brideNameInput = document.querySelector('input[name="bride_name"]');
                const brideContactInput = document.querySelector('input[name="bride_contact"]');
                const brideEmailInput = document.querySelector('input[name="bride_email"]');
                const brideAadharInput = document.querySelector('input[name="bride_aadhar"]');
                
                if (brideNameInput) brideNameInput.value = orderData.client_details.bride.name || '';
                if (brideContactInput) brideContactInput.value = orderData.client_details.bride.contact || '';
                if (brideEmailInput) brideEmailInput.value = orderData.client_details.bride.email || '';
                if (brideAadharInput) brideAadharInput.value = orderData.client_details.bride.aadhar || '';
            }
            if (orderData.client_details.groom) {
                const groomNameInput = document.querySelector('input[name="groom_name"]');
                const groomContactInput = document.querySelector('input[name="groom_contact"]');
                const groomEmailInput = document.querySelector('input[name="groom_email"]');
                const groomAadharInput = document.querySelector('input[name="groom_aadhar"]');
                
                if (groomNameInput) groomNameInput.value = orderData.client_details.groom.name || '';
                if (groomContactInput) groomContactInput.value = orderData.client_details.groom.contact || '';
                if (groomEmailInput) groomEmailInput.value = orderData.client_details.groom.email || '';
                if (groomAadharInput) groomAadharInput.value = orderData.client_details.groom.aadhar || '';
            }
        }
        
        // Load payment data
        if (orderData.payment_schedule && orderData.payment_schedule.deal_amount) {
            const dealAmountInput = document.querySelector('input[name="deal_amount"]');
            if (dealAmountInput) {
                dealAmountInput.value = orderData.payment_schedule.deal_amount;
                calculatePayments();
            }
        }
        
        window.alertSystem.show('Draft loaded successfully!', 'success');
        console.log('Draft loaded successfully');
    }
}

function openCostCalculator() {
    console.log('Opening cost calculator...');
    const modal = document.getElementById('cost-calculator-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }
}

function closeCostCalculator() {
    const modal = document.getElementById('cost-calculator-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function editField(fieldName) {
    const display = document.getElementById(`${fieldName}-display`);
    const input = document.getElementById(`${fieldName}-input`);
    
    if (display && input) {
        display.classList.add('hidden');
        input.classList.remove('hidden');
        input.focus();
        
        input.addEventListener('blur', function() {
            const value = parseFloat(input.value) || 0;
            display.textContent = `₹${value.toLocaleString()}`;
            display.classList.remove('hidden');
            input.classList.add('hidden');
            calculateCostTotal();
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
    
    // Special handling for profit percentage
    if (fieldName === 'profit-percentage') {
        const percentageDisplay = document.getElementById('profit-percentage-display');
        const percentageInput = document.getElementById('profit-percentage');
        
        if (percentageDisplay && percentageInput) {
            percentageDisplay.classList.add('hidden');
            percentageInput.classList.remove('hidden');
            percentageInput.focus();
            
            percentageInput.addEventListener('blur', function() {
                const percentage = parseFloat(percentageInput.value) || 0;
                percentageDisplay.textContent = `(${percentage}%)`;
                percentageDisplay.classList.remove('hidden');
                percentageInput.classList.add('hidden');
                calculateCostTotal();
            });
        }
    }
}

function calculateCostTotal() {
    const team = parseFloat(document.getElementById('team-input').value) || 0;
    const standard = parseFloat(document.getElementById('standard-input').value) || 0;
    const addons = parseFloat(document.getElementById('addons-input').value) || 0;
    const travel = parseFloat(document.getElementById('travel-input').value) || 0;
    const rental = parseFloat(document.getElementById('rental-input').value) || 0;
    const transport = parseFloat(document.getElementById('transport-input').value) || 0;
    const operation = parseFloat(document.getElementById('operation-input').value) || 0;
    const profitPercentage = parseFloat(document.getElementById('profit-percentage').value) || 0;
    
    const subtotal = team + standard + addons + travel + rental + transport;
    const totalCost = subtotal + operation;
    const profitAmount = (totalCost * profitPercentage) / 100;
    const finalTotal = totalCost + profitAmount;
    
    // Update displays
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('profit-amount').textContent = `₹${profitAmount.toLocaleString()}`;
    document.getElementById('final-total').textContent = `₹${finalTotal.toLocaleString()}`;
}

function applyCostToDeal() {
    const finalTotal = document.getElementById('final-total').textContent;
    const amount = finalTotal.replace('₹', '').replace(/,/g, '');
    
    const dealAmountInput = document.querySelector('input[name="deal_amount"]');
    if (dealAmountInput) {
        dealAmountInput.value = amount;
        calculatePayments();
    }
    
    closeCostCalculator();
    window.alertSystem.show('Cost applied to deal amount successfully!', 'success');
}

function submitOrderForm(event) {
    event.preventDefault();
    console.log('Form submitted');
}

function loadOrderData() {
    // Prioritize editOrder over draft_order for editing
    const editOrder = localStorage.getItem('editOrder');
    const draftOrder = localStorage.getItem('draft_order');
    
    const orderData = editOrder ? JSON.parse(editOrder) : (draftOrder ? JSON.parse(draftOrder) : null);
    
    if (orderData) {
        console.log('🔄 Loading order for editing:', orderData);
        
        // Set flag to prevent initialization from creating default events
        window.orderDataLoaded = true;
        
        // Load client details
        if (orderData.client_details) {
            if (orderData.client_details.bride) {
                const brideNameInput = document.querySelector('input[name="bride_name"]');
                const brideContactInput = document.querySelector('input[name="bride_contact"]');
                const brideEmailInput = document.querySelector('input[name="bride_email"]');
                const brideAadharInput = document.querySelector('input[name="bride_aadhar"]');
                
                if (brideNameInput) brideNameInput.value = orderData.client_details.bride.name || '';
                if (brideContactInput) brideContactInput.value = orderData.client_details.bride.contact || '';
                if (brideEmailInput) brideEmailInput.value = orderData.client_details.bride.email || '';
                if (brideAadharInput) brideAadharInput.value = orderData.client_details.bride.aadhar || '';
            }
            if (orderData.client_details.groom) {
                const groomNameInput = document.querySelector('input[name="groom_name"]');
                const groomContactInput = document.querySelector('input[name="groom_contact"]');
                const groomEmailInput = document.querySelector('input[name="groom_email"]');
                const groomAadharInput = document.querySelector('input[name="groom_aadhar"]');
                
                if (groomNameInput) groomNameInput.value = orderData.client_details.groom.name || '';
                if (groomContactInput) groomContactInput.value = orderData.client_details.groom.contact || '';
                if (groomEmailInput) groomEmailInput.value = orderData.client_details.groom.email || '';
                if (groomAadharInput) groomAadharInput.value = orderData.client_details.groom.aadhar || '';
            }
        }
        
        // Load pre-wedding data
        if (orderData.pre_wedding) {
            const preWeddingToggle = document.querySelector('#preWeddingToggle');
            if (preWeddingToggle) {
                preWeddingToggle.checked = orderData.pre_wedding.enabled || false;
                if (orderData.pre_wedding.enabled) {
                    togglePreWeddingForm();
                    
                    // Load pre-wedding fields
                    const pwTypeSelect = document.querySelector('select[name="pw_type"]');
                    const pwStartDateInput = document.querySelector('input[name="pw_start_date"]');
                    const pwEndDateInput = document.querySelector('input[name="pw_end_date"]');
                    const pwLocationInput = document.querySelector('input[name="pw_location"]');
                    const pwTeamCompositionSelect = document.querySelector('select[name="pw_team_composition"]');
                    const pwDroneSelect = document.querySelector('select[name="pw_drone"]');
                    const pwRequirementsTextarea = document.querySelector('textarea[name="pw_requirements"]');
                    
                    if (pwTypeSelect) pwTypeSelect.value = orderData.pre_wedding.type || '';
                    if (pwStartDateInput) pwStartDateInput.value = orderData.pre_wedding.start_date || '';
                    if (pwEndDateInput) pwEndDateInput.value = orderData.pre_wedding.end_date || '';
                    if (pwLocationInput) pwLocationInput.value = orderData.pre_wedding.location || '';
                    if (pwTeamCompositionSelect) {
                        pwTeamCompositionSelect.value = orderData.pre_wedding.team_composition || '';
                        if (orderData.pre_wedding.team_composition) {
                            updatePWTeamFields(pwTeamCompositionSelect);
                            
                            // Load pre-wedding team member selections after fields are created
                            setTimeout(() => {
                                if (orderData.pre_wedding.team_members && orderData.pre_wedding.team_members.length > 0) {
                                    orderData.pre_wedding.team_members.forEach((member, memberIndex) => {
                                        const memberSelect = document.querySelector(`select[name="pw_team_member_${memberIndex + 1}"]`);
                                        if (memberSelect) {
                                            memberSelect.value = member.value || member.name || '';
                                        }
                                    });
                                }
                            }, 100);
                        }
                    }
                    if (pwDroneSelect) pwDroneSelect.value = orderData.pre_wedding.drone || '';
                    if (pwRequirementsTextarea) pwRequirementsTextarea.value = orderData.pre_wedding.requirements || '';
                    
                    // Trigger type change to load deliverables
                    if (orderData.pre_wedding.type) {
                        handlePWTypeChange();
                    }
                }
            }
        }
        
        // Load cost factors
        if (orderData.cost_factors) {
            if (orderData.cost_factors.travel_cost) {
                const travelRadio = document.querySelector(`input[name="travel_cost"][value="${orderData.cost_factors.travel_cost}"]`);
                if (travelRadio) travelRadio.checked = true;
            }
            if (orderData.cost_factors.accommodation_cost) {
                const accommodationRadio = document.querySelector(`input[name="accommodation_cost"][value="${orderData.cost_factors.accommodation_cost}"]`);
                if (accommodationRadio) accommodationRadio.checked = true;
            }
            if (orderData.cost_factors.gear_rental) {
                const gearRadio = document.querySelector(`input[name="gear_rental"][value="${orderData.cost_factors.gear_rental}"]`);
                if (gearRadio) gearRadio.checked = true;
            }
            if (orderData.cost_factors.drone_rental) {
                const droneRadio = document.querySelector(`input[name="drone_rental"][value="${orderData.cost_factors.drone_rental}"]`);
                if (droneRadio) droneRadio.checked = true;
            }
        }
        
        // Load project specs
        if (orderData.project_specs) {
            const inspirationTextarea = document.querySelector('textarea[name="inspiration_specification"]');
            const cultureTextarea = document.querySelector('textarea[name="culture_specific"]');
            const categorySelect = document.querySelector('select[name="category"]');
            const makeupVenueInput = document.querySelector('input[name="makeup_venue"]');
            const coverageTypeSelect = document.querySelector('select[name="coverage_type"]');
            
            if (inspirationTextarea) inspirationTextarea.value = orderData.project_specs.inspiration_specification || '';
            if (cultureTextarea) cultureTextarea.value = orderData.project_specs.culture_specific || '';
            if (categorySelect) categorySelect.value = orderData.project_specs.category || '';
            if (makeupVenueInput) makeupVenueInput.value = orderData.project_specs.makeup_venue || '';
            if (coverageTypeSelect) coverageTypeSelect.value = orderData.project_specs.coverage_type || '';
        }
        
        // Load payment data
        if (orderData.payment_schedule) {
            const dealAmountInput = document.querySelector('input[name="deal_amount"]');
            if (dealAmountInput && orderData.payment_schedule.deal_amount) {
                dealAmountInput.value = orderData.payment_schedule.deal_amount;
                calculatePayments();
            }
            
            // Load payment milestones
            if (orderData.payment_schedule.payments) {
                const advancePayments = orderData.payment_schedule.payments.filter(p => p.type === 'Advance');
                const eventPayments = orderData.payment_schedule.payments.filter(p => p.type === 'Event');
                const deliveryPayments = orderData.payment_schedule.payments.filter(p => p.type === 'Delivery');
                
                // Load advance payments
                advancePayments.forEach((payment, index) => {
                    if (index > 0) addAdvancePayment();
                    const paymentElements = document.querySelectorAll('.advance-payment');
                    if (paymentElements[index]) {
                        const amountInput = paymentElements[index].querySelector('.payment-amount');
                        const percentageInput = paymentElements[index].querySelector('.payment-percentage');
                        const dateInput = paymentElements[index].querySelector('input[name="advance_date[]"]');
                        
                        if (amountInput) amountInput.value = payment.amount || '';
                        if (percentageInput) percentageInput.value = payment.percentage || '';
                        if (dateInput) dateInput.value = payment.date || '';
                    }
                });
                
                // Load event payments
                eventPayments.forEach((payment, index) => {
                    if (index > 0) addEventPayment();
                    const paymentElements = document.querySelectorAll('.event-payment');
                    if (paymentElements[index]) {
                        const amountInput = paymentElements[index].querySelector('.payment-amount');
                        const percentageInput = paymentElements[index].querySelector('.payment-percentage');
                        const dateInput = paymentElements[index].querySelector('input[name="event_payment_date[]"]');
                        
                        if (amountInput) amountInput.value = payment.amount || '';
                        if (percentageInput) percentageInput.value = payment.percentage || '';
                        if (dateInput) dateInput.value = payment.date || '';
                    }
                });
                
                // Load delivery payments
                deliveryPayments.forEach((payment, index) => {
                    if (index > 0) addDeliveryPayment();
                    const paymentElements = document.querySelectorAll('.delivery-payment');
                    if (paymentElements[index]) {
                        const amountInput = paymentElements[index].querySelector('.payment-amount');
                        const percentageInput = paymentElements[index].querySelector('.payment-percentage');
                        const dateInput = paymentElements[index].querySelector('input[name="delivery_payment_date[]"]');
                        
                        if (amountInput) amountInput.value = payment.amount || '';
                        if (percentageInput) percentageInput.value = payment.percentage || '';
                        if (dateInput) dateInput.value = payment.date || '';
                    }
                });
                
                // Update payment summary after loading all payments
                setTimeout(() => {
                    updatePaymentSummary();
                }, 100);
            }
        }
        
        // Load events data
        const eventsContainer = document.getElementById('events-container');
        if (!eventsContainer) return;
        
        // Clear existing innerHTML completely
        eventsContainer.innerHTML = '';
        
        if (orderData.events && orderData.events.length > 0) {
            // Create only the saved events dynamically
            orderData.events.forEach((event, index) => {
                const eventCard = document.createElement('div');
                eventCard.className = 'event-box bg-gray-50 border border-gray-200 rounded-custom p-6 mb-6';
                eventCard.innerHTML = `
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-semibold text-gray-900">Event ${index + 1}</h4>
                        ${index > 0 ? '<button type="button" onclick="removeEvent(this)" class="text-red-500 hover:text-red-700 text-sm"><i class="fas fa-trash mr-1"></i>Remove</button>' : ''}
                    </div>
                    
                    <!-- Row 1: Event Name, Date, Location -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Event Name <span class="text-red-500">*</span>
                            </label>
                            <select name="event_name[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select Event</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Reception">Reception</option>
                                <option value="Engagement">Engagement</option>
                                <option value="Mehendi">Mehendi</option>
                                <option value="Haldi">Haldi</option>
                                <option value="Sangam">Sangam</option>
                                <option value="Ring Ceremony">Ring Ceremony</option>
                                <option value="Custom">Custom</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Date <span class="text-red-500">*</span>
                            </label>
                            <input type="date" name="event_date[]" required min="2024-01-01" max="2099-12-31" class="w-full px-4 py-3 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input type="text" name="event_location[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>
                    
                    <!-- Row 2: Coverage, Time, Gathering -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Coverage <span class="text-red-500">*</span>
                            </label>
                            <select name="coverage[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select Coverage</option>
                                <option value="Together">Together</option>
                                <option value="Bride">Bride</option>
                                <option value="Groom">Groom</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <select name="event_time[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select Time</option>
                                <option value="Morning">Morning</option>
                                <option value="Day">Day</option>
                                <option value="Evening">Evening</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Gathering</label>
                            <input type="text" name="gathering[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                    </div>
                    
                    <!-- Row 3: Time Slab, Quick Note, Drone -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Time Slab/Days/Manual</label>
                            <input type="text" name="time_slab[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Quick Note</label>
                            <input type="text" name="quick_note[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Drone</label>
                            <select name="drone[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Team Composition Section -->
                    <div class="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Team Composition</label>
                            <select name="team_composition[]" onchange="updateTeamFields(this)" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">Select Team</option>
                                <option value="1+1">1+1</option>
                                <option value="2+2">2+2</option>
                                <option value="3+3">3+3</option>
                            </select>
                        </div>
                    </div>
                    
                    <!-- Dynamic Team Fields -->
                    <div class="team-fields hidden mb-4">
                        <div class="bg-blue-50 border border-blue-200 rounded-custom p-4">
                            <h5 class="font-medium text-blue-700 mb-3">Team Members</h5>
                            <div class="team-members-container grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Team member fields will be added here dynamically -->
                            </div>
                        </div>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
                
                // Load event data
                const eventNameSelect = eventCard.querySelector('select[name="event_name[]"]');
                const eventDateInput = eventCard.querySelector('input[name="event_date[]"]');
                const eventLocationInput = eventCard.querySelector('input[name="event_location[]"]');
                const coverageSelect = eventCard.querySelector('select[name="coverage[]"]');
                const timeSelect = eventCard.querySelector('select[name="event_time[]"]');
                const gatheringInput = eventCard.querySelector('input[name="gathering[]"]');
                const timeSlabInput = eventCard.querySelector('input[name="time_slab[]"]');
                const quickNoteInput = eventCard.querySelector('input[name="quick_note[]"]');
                const droneSelect = eventCard.querySelector('select[name="drone[]"]');
                const teamCompositionSelect = eventCard.querySelector('select[name="team_composition[]"]');
                
                if (eventNameSelect) eventNameSelect.value = event.name || '';
                if (eventDateInput) eventDateInput.value = event.date || '';
                if (eventLocationInput) eventLocationInput.value = event.location || '';
                if (coverageSelect) coverageSelect.value = event.coverage || '';
                if (timeSelect) timeSelect.value = event.time || '';
                if (gatheringInput) gatheringInput.value = event.gathering || '';
                if (timeSlabInput) timeSlabInput.value = event.time_slab || '';
                if (quickNoteInput) quickNoteInput.value = event.quick_note || '';
                if (droneSelect) droneSelect.value = event.drone || '';
                if (teamCompositionSelect) {
                    teamCompositionSelect.value = event.team_composition || '';
                    if (event.team_composition) {
                        updateTeamFields(teamCompositionSelect);
                        
                        setTimeout(() => {
                            if (event.team_members && event.team_members.length > 0) {
                                event.team_members.forEach((member, memberIndex) => {
                                    const memberSelect = eventCard.querySelector(`select[name="team_member_${memberIndex + 1}[]"]`);
                                    if (memberSelect) {
                                        memberSelect.value = member.value || member.name || '';
                                    }
                                });
                            }
                        }, 100);
                    }
                }
            });
        } else {
            // If no saved events → create exactly one empty event card
            const eventCard = document.createElement('div');
            eventCard.className = 'event-box bg-gray-50 border border-gray-200 rounded-custom p-6 mb-6';
            eventCard.innerHTML = `
                <div class="flex justify-between items-center mb-4">
                    <h4 class="font-semibold text-gray-900">Event 1</h4>
                </div>
                
                <!-- Row 1: Event Name, Date, Location -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Event Name <span class="text-red-500">*</span>
                        </label>
                        <select name="event_name[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select Event</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Reception">Reception</option>
                            <option value="Engagement">Engagement</option>
                            <option value="Mehendi">Mehendi</option>
                            <option value="Haldi">Haldi</option>
                            <option value="Sangam">Sangam</option>
                            <option value="Ring Ceremony">Ring Ceremony</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Date <span class="text-red-500">*</span>
                        </label>
                        <input type="date" name="event_date[]" required min="2024-01-01" max="2099-12-31" class="w-full px-4 py-3 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                        <input type="text" name="event_location[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>
                
                <!-- Row 2: Coverage, Time, Gathering -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Coverage <span class="text-red-500">*</span>
                        </label>
                        <select name="coverage[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select Coverage</option>
                            <option value="Together">Together</option>
                            <option value="Bride">Bride</option>
                            <option value="Groom">Groom</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <select name="event_time[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select Time</option>
                            <option value="Morning">Morning</option>
                            <option value="Day">Day</option>
                            <option value="Evening">Evening</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Gathering</label>
                        <input type="text" name="gathering[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                </div>
                
                <!-- Row 3: Time Slab, Quick Note, Drone -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time Slab/Days/Manual</label>
                        <input type="text" name="time_slab[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Quick Note</label>
                        <input type="text" name="quick_note[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Drone</label>
                        <select name="drone[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
                
                <!-- Team Composition Section -->
                <div class="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Team Composition</label>
                        <select name="team_composition[]" onchange="updateTeamFields(this)" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="">Select Team</option>
                            <option value="1+1">1+1</option>
                            <option value="2+2">2+2</option>
                            <option value="3+3">3+3</option>
                        </select>
                    </div>
                </div>
                
                <!-- Dynamic Team Fields -->
                <div class="team-fields hidden mb-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-custom p-4">
                        <h5 class="font-medium text-blue-700 mb-3">Team Members</h5>
                        <div class="team-members-container grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Team member fields will be added here dynamically -->
                        </div>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        }
        
        // Load deliverables
        if (orderData.deliverables) {
            // Standard deliverables - first uncheck all, then set saved states
            document.querySelectorAll('input[name="standard_deliverables[]"]').forEach(checkbox => {
                checkbox.checked = false;
            });
            
            if (orderData.deliverables.standard) {
                orderData.deliverables.standard.forEach(item => {
                    const checkbox = document.querySelector(`input[name="standard_deliverables[]"][value="${item.name}"]`);
                    if (checkbox) checkbox.checked = item.checked;
                });
            }
            
            // Add-on deliverables
            if (orderData.deliverables.addons) {
                orderData.deliverables.addons.forEach(item => {
                    const checkbox = document.querySelector(`input[name="addon_deliverables[]"][value="${item.name}"]`);
                    if (checkbox) checkbox.checked = item.checked;
                });
            }
            
            // Custom deliverables
            if (orderData.deliverables.custom) {
                orderData.deliverables.custom.forEach(item => {
                    customDeliverableCounter++;
                    const container = document.getElementById('customDeliverablesContainer');
                    const deliverableId = `deliverable-${customDeliverableCounter}`;
                    
                    const deliverableDiv = document.createElement('div');
                    deliverableDiv.id = deliverableId;
                    deliverableDiv.className = 'bg-white p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md';
                    deliverableDiv.innerHTML = `
                        <div class="flex items-center">
                            <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                                <i class="fas fa-tag text-white text-sm"></i>
                            </div>
                            <div class="flex-1">
                                <div class="deliverable-content font-semibold text-gray-800">${item.name}</div>
                                <p class="text-xs text-gray-500">Custom deliverable</p>
                                <input type="hidden" name="custom_deliverable[]" value="${item.name}">
                            </div>
                            <div class="deliverable-actions flex gap-1 ml-3">
                                <button type="button" onclick="editDeliverable('${deliverableId}')" class="text-indigo-600 hover:text-indigo-800 p-1" title="Edit">
                                    <i class="fas fa-edit text-xs"></i>
                                </button>
                                <button type="button" onclick="deleteDeliverable('${deliverableId}')" class="text-red-600 hover:text-red-800 p-1" title="Delete">
                                    <i class="fas fa-trash text-xs"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    container.appendChild(deliverableDiv);
                });
            }
        }
        
        // Load completion status
        const completionData = orderData.section_completion || orderData.completion_status;
        if (completionData) {
            if (completionData.personal_completed || completionData.personal) {
                setCheckboxCompleted('personal');
            }
            if (completionData.event_completed || completionData.event) {
                setCheckboxCompleted('event');
            }
            if (completionData.requirements_completed || completionData.requirements) {
                setCheckboxCompleted('requirements');
            }
            if (completionData.package_completed || completionData.package) {
                setCheckboxCompleted('package');
            }
        }
        
        // Load notes
        if (orderData.notes) {
            loadNotesData(orderData.notes);
        }
        
        updateButtonStates();
        console.log('✅ Order data loaded successfully');
        // Note: Don't remove editOrder here - it's needed for saving
    } else {
        console.log('ℹ️ No order data to load');
        window.orderDataLoaded = false;
    }
}

// Package pricing calculations
function calculatePricingBreakdown() {
    const basePackage = parseFloat(document.querySelector('input[name="base_package_cost"]')?.value) || 0;
    const additionalServices = parseFloat(document.querySelector('input[name="additional_services_cost"]')?.value) || 0;
    const discountPercentage = parseFloat(document.querySelector('input[name="discount_percentage"]')?.value) || 0;
    const taxPercentage = parseFloat(document.querySelector('input[name="tax_percentage"]')?.value) || 0;
    
    const subtotal = basePackage + additionalServices;
    const discountAmount = subtotal * (discountPercentage / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (taxPercentage / 100);
    const finalTotal = afterDiscount + taxAmount;
    
    // Update displays
    document.getElementById('pricing-subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('pricing-discount').textContent = `-₹${discountAmount.toLocaleString()}`;
    document.getElementById('pricing-tax').textContent = `+₹${taxAmount.toLocaleString()}`;
    document.getElementById('pricing-total').textContent = `₹${finalTotal.toLocaleString()}`;
    
    // Auto-update deal amount if pricing is calculated
    const dealAmountInput = document.querySelector('input[name="deal_amount"]');
    if (dealAmountInput && finalTotal > 0) {
        dealAmountInput.value = finalTotal;
        calculatePayments();
    }
}

// Custom Deliverable Functions
let customDeliverableCounter = 0;

function scrollToCustomDeliverables() {
    const customSection = document.getElementById('customDeliverablesContainer').parentElement;
    customSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        showDeliverableInput();
    }, 500);
}

function showDeliverableInput() {
    // Remove existing input if any
    const existingInput = document.getElementById('deliverable-input');
    if (existingInput && !existingInput.classList.contains('hidden')) {
        return; // Input already visible
    }
    
    const container = document.getElementById('customDeliverablesContainer');
    const inputDiv = document.createElement('div');
    inputDiv.id = 'temp-deliverable-input';
    inputDiv.className = 'mt-4 bg-indigo-50 p-4 rounded-xl border-2 border-indigo-300';
    inputDiv.innerHTML = `
        <div class="flex items-center mb-3">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-plus text-white text-sm"></i>
            </div>
            <div class="flex-1">
                <input type="text" id="temp-deliverable-text" placeholder="Enter custom deliverable name..." class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm">
            </div>
        </div>
        <div class="flex gap-2 ml-13">
            <button type="button" onclick="saveTempDeliverable()" class="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs">
                <i class="fas fa-check mr-1"></i>Save
            </button>
            <button type="button" onclick="cancelTempDeliverable()" class="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-xs">
                Cancel
            </button>
        </div>
    `;
    
    container.appendChild(inputDiv);
    document.getElementById('temp-deliverable-text').focus();
}

function saveTempDeliverable() {
    const input = document.getElementById('temp-deliverable-text');
    const deliverableText = input.value.trim();
    
    if (!deliverableText) {
        window.alertSystem?.show('Please enter a deliverable name', 'warning');
        return;
    }
    
    customDeliverableCounter++;
    const container = document.getElementById('customDeliverablesContainer');
    const deliverableId = `deliverable-${customDeliverableCounter}`;
    
    const deliverableDiv = document.createElement('div');
    deliverableDiv.id = deliverableId;
    deliverableDiv.className = 'bg-white p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md';
    deliverableDiv.innerHTML = `
        <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-tag text-white text-sm"></i>
            </div>
            <div class="flex-1">
                <div class="deliverable-content font-semibold text-gray-800">${deliverableText}</div>
                <p class="text-xs text-gray-500">Custom deliverable</p>
                <input type="hidden" name="custom_deliverable[]" value="${deliverableText}">
            </div>
            <div class="deliverable-actions flex gap-1 ml-3">
                <button type="button" onclick="editDeliverable('${deliverableId}')" class="text-indigo-600 hover:text-indigo-800 p-1" title="Edit">
                    <i class="fas fa-edit text-xs"></i>
                </button>
                <button type="button" onclick="deleteDeliverable('${deliverableId}')" class="text-red-600 hover:text-red-800 p-1" title="Delete">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    `;
    
    // Insert before the temp input
    const tempInput = document.getElementById('temp-deliverable-input');
    container.insertBefore(deliverableDiv, tempInput);
    
    cancelTempDeliverable();
    window.alertSystem?.show('Custom deliverable added successfully', 'success');
}

function cancelTempDeliverable() {
    const tempInput = document.getElementById('temp-deliverable-input');
    if (tempInput) {
        tempInput.remove();
    }
}

function saveDeliverable() {
    const input = document.getElementById('deliverable-text');
    const deliverableText = input.value.trim();
    
    if (!deliverableText) {
        window.alertSystem?.show('Please enter a deliverable name', 'warning');
        return;
    }
    
    customDeliverableCounter++;
    const container = document.getElementById('customDeliverablesContainer');
    const deliverableId = `deliverable-${customDeliverableCounter}`;
    
    const deliverableDiv = document.createElement('div');
    deliverableDiv.id = deliverableId;
    deliverableDiv.className = 'bg-white p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow-md';
    deliverableDiv.innerHTML = `
        <div class="flex items-center">
            <div class="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                <i class="fas fa-tag text-white text-sm"></i>
            </div>
            <div class="flex-1">
                <div class="deliverable-content font-semibold text-gray-800">${deliverableText}</div>
                <p class="text-xs text-gray-500">Custom deliverable</p>
                <input type="hidden" name="custom_deliverable[]" value="${deliverableText}">
            </div>
            <div class="deliverable-actions flex gap-1 ml-3">
                <button type="button" onclick="editDeliverable('${deliverableId}')" class="text-indigo-600 hover:text-indigo-800 p-1" title="Edit">
                    <i class="fas fa-edit text-xs"></i>
                </button>
                <button type="button" onclick="deleteDeliverable('${deliverableId}')" class="text-red-600 hover:text-red-800 p-1" title="Delete">
                    <i class="fas fa-trash text-xs"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(deliverableDiv);
    
    cancelDeliverable();
    window.alertSystem?.show('Custom deliverable added successfully', 'success');
}

function cancelDeliverable() {
    const inputDiv = document.getElementById('deliverable-input');
    const input = document.getElementById('deliverable-text');
    
    inputDiv.classList.add('hidden');
    input.value = '';
}

function editDeliverable(deliverableId) {
    const deliverableDiv = document.getElementById(deliverableId);
    const contentDiv = deliverableDiv.querySelector('.deliverable-content');
    const currentText = contentDiv.textContent;
    
    const newText = prompt('Edit deliverable:', currentText);
    if (newText && newText.trim() !== '') {
        const trimmedText = newText.trim();
        contentDiv.textContent = trimmedText;
        deliverableDiv.querySelector('input[type="hidden"]').value = trimmedText;
        window.alertSystem?.show('Deliverable updated successfully', 'success');
    }
}

function deleteDeliverable(deliverableId) {
    if (confirm('Are you sure you want to delete this deliverable?')) {
        document.getElementById(deliverableId).remove();
        window.alertSystem?.show('Deliverable deleted successfully', 'success');
    }
}

// Payment Schedule Functions
let advanceCounter = 1;
let eventPaymentCounter = 1;
let deliveryPaymentCounter = 1;

function addAdvancePayment() {
    advanceCounter++;
    const container = document.getElementById('advance-payments-container');
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'advance-payment bg-white p-4 rounded-xl border-2 border-emerald-200 mb-3';
    paymentDiv.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h6 class="font-medium text-gray-700">Advance ${advanceCounter}</h6>
            <button type="button" onclick="removePayment(this)" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input type="number" name="advance_amount[]" class="payment-amount w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromAmount(this); updatePaymentSummary();" placeholder="100000">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Percentage (%)</label>
                <input type="number" name="advance_percentage[]" class="payment-percentage w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromPercentage(this); updatePaymentSummary();" placeholder="20">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" name="advance_date[]" min="2024-01-01" max="2099-12-31" class="payment-date w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="updatePaymentSummary();">
            </div>
        </div>
    `;
    container.appendChild(paymentDiv);
    updatePaymentSummary();
    paymentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        paymentDiv.querySelector('.payment-amount').focus();
    }, 300);
}

function addEventPayment() {
    eventPaymentCounter++;
    const container = document.getElementById('event-payments-container');
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'event-payment bg-white p-4 rounded-xl border-2 border-emerald-200 mb-3';
    paymentDiv.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h6 class="font-medium text-gray-700">Event ${eventPaymentCounter} Payment</h6>
            <button type="button" onclick="removePayment(this)" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input type="number" name="event_payment_amount[]" class="payment-amount w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromAmount(this)" placeholder="150000">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Percentage (%)</label>
                <input type="number" name="event_payment_percentage[]" class="payment-percentage w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromPercentage(this)" placeholder="30">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" name="event_payment_date[]" min="2024-01-01" max="2099-12-31" class="payment-date w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            </div>
        </div>
    `;
    container.appendChild(paymentDiv);
    paymentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        paymentDiv.querySelector('.payment-amount').focus();
    }, 300);
}

function addDeliveryPayment() {
    deliveryPaymentCounter++;
    const container = document.getElementById('delivery-payments-container');
    const paymentDiv = document.createElement('div');
    paymentDiv.className = 'delivery-payment bg-white p-4 rounded-xl border-2 border-emerald-200 mb-3';
    paymentDiv.innerHTML = `
        <div class="flex justify-between items-center mb-3">
            <h6 class="font-medium text-gray-700">Delivery ${deliveryPaymentCounter} Payment</h6>
            <button type="button" onclick="removePayment(this)" class="text-red-600 hover:text-red-800">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                <input type="number" name="delivery_payment_amount[]" class="payment-amount w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromAmount(this)" placeholder="250000">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Percentage (%)</label>
                <input type="number" name="delivery_payment_percentage[]" class="payment-percentage w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" onchange="calculateFromPercentage(this)" placeholder="50">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input type="date" name="delivery_payment_date[]" min="2024-01-01" max="2099-12-31" class="payment-date w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
            </div>
        </div>
    `;
    container.appendChild(paymentDiv);
    paymentDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
        paymentDiv.querySelector('.payment-amount').focus();
    }, 300);
}

function removePayment(button) {
    const paymentDiv = button.closest('.advance-payment, .event-payment, .delivery-payment');
    paymentDiv.remove();
    updatePaymentSummary();
}

// Initialize form when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Show first tab by default
    showTab('personal');
    
    loadOrderData();
    
    // Only create default event if no order data was loaded
    const container = document.getElementById('events-container');
    const hasExistingEvents = container && container.querySelectorAll('.event-card, .event-box').length > 0;
    
    if (!window.orderDataLoaded && !hasExistingEvents) {
        // Create exactly one empty event card for new forms
        const eventCard = document.createElement('div');
        eventCard.className = 'event-box bg-gray-50 border border-gray-200 rounded-custom p-6 mb-6';
        eventCard.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold text-gray-900">Event 1</h4>
            </div>
            
            <!-- Row 1: Event Name, Date, Location -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Event Name <span class="text-red-500">*</span>
                    </label>
                    <select name="event_name[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Event</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Reception">Reception</option>
                        <option value="Engagement">Engagement</option>
                        <option value="Mehendi">Mehendi</option>
                        <option value="Haldi">Haldi</option>
                        <option value="Sangam">Sangam</option>
                        <option value="Ring Ceremony">Ring Ceremony</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Date <span class="text-red-500">*</span>
                    </label>
                    <input type="date" name="event_date[]" required min="2024-01-01" max="2099-12-31" class="w-full px-4 py-3 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input type="text" name="event_location[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            </div>
            
            <!-- Row 2: Coverage, Time, Gathering -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Coverage <span class="text-red-500">*</span>
                    </label>
                    <select name="coverage[]" required class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Coverage</option>
                        <option value="Together">Together</option>
                        <option value="Bride">Bride</option>
                        <option value="Groom">Groom</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <select name="event_time[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Time</option>
                        <option value="Morning">Morning</option>
                        <option value="Day">Day</option>
                        <option value="Evening">Evening</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Gathering</label>
                    <input type="text" name="gathering[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
            </div>
            
            <!-- Row 3: Time Slab, Quick Note, Drone -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time Slab/Days/Manual</label>
                    <input type="text" name="time_slab[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Quick Note</label>
                    <input type="text" name="quick_note[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Drone</label>
                    <select name="drone[]" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
            
            <!-- Team Composition Section -->
            <div class="grid grid-cols-1 gap-4 mb-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Team Composition</label>
                    <select name="team_composition[]" onchange="updateTeamFields(this)" class="w-full px-3 py-2 border border-gray-300 rounded-custom focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Team</option>
                        <option value="1+1">1+1</option>
                        <option value="2+2">2+2</option>
                        <option value="3+3">3+3</option>
                    </select>
                </div>
            </div>
            
            <!-- Dynamic Team Fields -->
            <div class="team-fields hidden mb-4">
                <div class="bg-blue-50 border border-blue-200 rounded-custom p-4">
                    <h5 class="font-medium text-blue-700 mb-3">Team Members</h5>
                    <div class="team-members-container grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Team member fields will be added here dynamically -->
                    </div>
                </div>
            </div>
        `;
        if (container) {
            container.appendChild(eventCard);
        }
    }
    
    updateButtonStates();
    
    // Add event listeners for pricing calculations
    const pricingInputs = [
        'input[name="base_package_cost"]',
        'input[name="additional_services_cost"]', 
        'input[name="discount_percentage"]',
        'input[name="tax_percentage"]'
    ];
    
    pricingInputs.forEach(selector => {
        const input = document.querySelector(selector);
        if (input) {
            input.addEventListener('input', calculatePricingBreakdown);
            input.addEventListener('change', calculatePricingBreakdown);
        }
    });
    
    // Initialize cost calculator values
    const costInputs = ['team', 'standard', 'addons', 'travel', 'rental', 'transport', 'operation'];
    costInputs.forEach(field => {
        const input = document.getElementById(`${field}-input`);
        if (input) {
            input.addEventListener('input', calculateCostTotal);
        }
    });
    
    const profitInput = document.getElementById('profit-percentage');
    if (profitInput) {
        profitInput.addEventListener('input', calculateCostTotal);
    }
    
    console.log('Order form initialized');
});

// Notes functionality
function showNoteInput(sectionName) {
    const noteInput = document.getElementById(`${sectionName}-note-input`);
    if (noteInput) {
        noteInput.classList.remove('hidden');
        const textarea = document.getElementById(`${sectionName}-note-text`);
        if (textarea) textarea.focus();
    }
}

function cancelNote(sectionName) {
    const noteInput = document.getElementById(`${sectionName}-note-input`);
    const textarea = document.getElementById(`${sectionName}-note-text`);
    if (noteInput) noteInput.classList.add('hidden');
    if (textarea) textarea.value = '';
}

function saveNote(sectionName) {
    const textarea = document.getElementById(`${sectionName}-note-text`);
    const noteText = textarea?.value.trim();
    
    if (!noteText) {
        window.alertSystem?.show('Please enter a note', 'warning');
        return;
    }
    
    const notesContainer = document.getElementById(`${sectionName}-notes-container`);
    if (!notesContainer) return;
    
    const noteId = `note-${Date.now()}`;
    const noteElement = document.createElement('div');
    noteElement.className = 'bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex justify-between items-start';
    noteElement.innerHTML = `
        <div class="flex-1">
            <p class="text-sm text-gray-800">${noteText}</p>
            <p class="text-xs text-gray-500 mt-1">${new Date().toLocaleString()}</p>
        </div>
        <button type="button" onclick="deleteNote('${noteId}')" class="ml-2 text-red-500 hover:text-red-700 text-sm">
            <i class="fas fa-trash"></i>
        </button>
    `;
    noteElement.id = noteId;
    
    notesContainer.appendChild(noteElement);
    
    // Clear and hide input
    textarea.value = '';
    cancelNote(sectionName);
    
    window.alertSystem?.show('Note added successfully', 'success');
}

function deleteNote(noteId) {
    window.alertSystem?.show('Are you sure you want to delete this note?', 'warning', 'Delete Note', {
        callback: (confirmed) => {
            if (confirmed) {
                const noteElement = document.getElementById(noteId);
                if (noteElement) {
                    noteElement.remove();
                    window.alertSystem?.show('Note deleted successfully', 'success');
                }
            }
        },
        showCancel: true,
        confirmText: 'Delete',
        cancelText: 'Cancel'
    });
}

function loadNotesData(notesData) {
    Object.keys(notesData).forEach(section => {
        const notesContainer = document.getElementById(`${section}-notes-container`);
        if (notesContainer && notesData[section]) {
            notesData[section].forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex justify-between items-start';
                noteElement.innerHTML = `
                    <div class="flex-1">
                        <p class="text-sm text-gray-800">${note.text}</p>
                        <p class="text-xs text-gray-500 mt-1">${note.timestamp}</p>
                    </div>
                    <button type="button" onclick="deleteNote('${note.id}')" class="ml-2 text-red-500 hover:text-red-700 text-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                noteElement.id = note.id;
                notesContainer.appendChild(noteElement);
            });
        }
    });
}