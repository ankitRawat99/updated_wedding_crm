// Unified Data Service - handles both localStorage and API calls
class DataService {
    constructor() {
        this.config = window.APP_CONFIG;
        this.prefix = this.config.STORAGE_PREFIX;
    }

    // Generic method to handle data operations
    async handleRequest(operation, entity, data = null, id = null) {
        if (this.config.DATA_SOURCE === 'localStorage') {
            return this.handleLocalStorage(operation, entity, data, id);
        } else {
            return this.handleAPI(operation, entity, data, id);
        }
    }

    // localStorage operations
    handleLocalStorage(operation, entity, data, id) {
        const key = this.prefix + entity;
        let items = JSON.parse(localStorage.getItem(key) || '[]');

        switch (operation) {
            case 'GET_ALL':
                return items;
            
            case 'GET_BY_ID':
                return items.find(item => 
                    item.id === id || 
                    item._id === id || 
                    item.order_info?.id === id
                );
            
            case 'CREATE':
                const template = window.schemaManager?.getTemplate(entity) || {};
                const newItem = {
                    ...template,
                    ...data,
                    id: data.id || data._id || this.generateId(entity),
                    _id: data.id || data._id || this.generateId(entity),
                    created_at: data.created_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                // Ensure ID consistency
                newItem._id = newItem.id;
                
                // Add new item at the beginning (top) instead of end
                items.unshift(newItem);
                localStorage.setItem(key, JSON.stringify(items, null, 2));
                return newItem;
            
            case 'UPDATE':
                const index = items.findIndex(item => 
                    item.id === id || 
                    item._id === id || 
                    item.order_info?.id === id
                );
                if (index !== -1) {
                    // Preserve original ID and _id
                    const originalId = items[index].id || items[index]._id;
                    items[index] = { 
                        ...items[index], 
                        ...data, 
                        id: originalId,
                        _id: originalId,
                        updated_at: new Date().toISOString() 
                    };
                    localStorage.setItem(key, JSON.stringify(items, null, 2));
                    return items[index];
                }
                return null;
            
            case 'DELETE':
                const filteredItems = items.filter(item => 
                    item.id !== id && 
                    item._id !== id && 
                    item.order_info?.id !== id
                );
                localStorage.setItem(key, JSON.stringify(filteredItems, null, 2));
                return true;
            
            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }

    // API operations (commented for now, ready to use)
    async handleAPI(operation, entity, data, id) {
        // Uncomment when switching back to FastAPI
        /*
        const baseUrl = this.config.API_BASE_URL;
        let url = `${baseUrl}/${entity}`;
        let options = {
            headers: { 'Content-Type': 'application/json' }
        };

        switch (operation) {
            case 'GET_ALL':
                const response = await fetch(url);
                return await response.json();
            
            case 'GET_BY_ID':
                const getResponse = await fetch(`${url}/${id}`);
                return await getResponse.json();
            
            case 'CREATE':
                options.method = 'POST';
                options.body = JSON.stringify(data);
                const createResponse = await fetch(url, options);
                return await createResponse.json();
            
            case 'UPDATE':
                options.method = 'PUT';
                options.body = JSON.stringify(data);
                const updateResponse = await fetch(`${url}/${id}`, options);
                return await updateResponse.json();
            
            case 'DELETE':
                options.method = 'DELETE';
                const deleteResponse = await fetch(`${url}/${id}`, options);
                return await deleteResponse.json();
        }
        */
        
        // For now, throw error when API mode is selected
        throw new Error('API mode not implemented yet. Set DATA_SOURCE to "localStorage" in config.js');
    }

    // Generate unique IDs
    generateId(entity) {
        const prefix = entity.toUpperCase().slice(0, 3);
        return `${prefix}-${Date.now()}`;
    }

    // Convenience methods for different entities
    async getOrders() {
        return this.handleRequest('GET_ALL', 'orders');
    }

    async getOrder(id) {
        return this.handleRequest('GET_BY_ID', 'orders', null, id);
    }

    async createOrder(data) {
        return this.handleRequest('CREATE', 'orders', data);
    }

    async updateOrder(id, data) {
        return this.handleRequest('UPDATE', 'orders', data, id);
    }

    async deleteOrder(id) {
        return this.handleRequest('DELETE', 'orders', null, id);
    }

    async getClients() {
        return this.handleRequest('GET_ALL', 'clients');
    }

    async createClient(data) {
        return this.handleRequest('CREATE', 'clients', data);
    }

    async getEvents() {
        return this.handleRequest('GET_ALL', 'events');
    }

    async createEvent(data) {
        return this.handleRequest('CREATE', 'events', data);
    }
}

// Create global instance
window.dataService = new DataService();