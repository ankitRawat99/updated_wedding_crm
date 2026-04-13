// Simple localStorage Data Manager for WeddingCRM
class DataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize default data if not exists
    initializeData() {
        if (!localStorage.getItem('weddingcrm_events')) {
            localStorage.setItem('weddingcrm_events', JSON.stringify([]));
        }
        if (!localStorage.getItem('weddingcrm_clients')) {
            localStorage.setItem('weddingcrm_clients', JSON.stringify([]));
        }
        if (!localStorage.getItem('weddingcrm_orders')) {
            localStorage.setItem('weddingcrm_orders', JSON.stringify([]));
        }
        if (!localStorage.getItem('weddingcrm_teams')) {
            localStorage.setItem('weddingcrm_teams', JSON.stringify({}));
        }
    }

    // Generic CRUD operations
    get(key) {
        return JSON.parse(localStorage.getItem(`weddingcrm_${key}`) || '[]');
    }

    set(key, data) {
        localStorage.setItem(`weddingcrm_${key}`, JSON.stringify(data));
        return data;
    }

    add(key, item) {
        const data = this.get(key);
        item.id = Date.now().toString();
        data.push(item);
        return this.set(key, data);
    }

    update(key, id, updatedItem) {
        const data = this.get(key);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updatedItem };
            this.set(key, data);
        }
        return data;
    }

    delete(key, id) {
        const data = this.get(key);
        const filtered = data.filter(item => item.id !== id);
        return this.set(key, filtered);
    }
}

// Global instance
window.dataManager = new DataManager();