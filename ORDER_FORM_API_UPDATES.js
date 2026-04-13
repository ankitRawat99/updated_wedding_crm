
// Replace generateOrder() function in static/js/order_form.js

async function generateOrder() {
    console.log('🚀 GENERATE ORDER FUNCTION CALLED!');
    
    try {
        const orderData = collectFormData();
        
        console.log('🚀 Generating order with data:', orderData);
        
        // MANDATORY VALIDATIONS
        const validationErrors = [];
        
        // 1. Client Name mandatory
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
        }
        
        // Set order status
        orderData.order_info = {
            status: 'Pre-lock',
            created_at: editOrder ? JSON.parse(editOrder).created_at : new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // ✅ SEND TO SERVER INSTEAD OF LOCALSTORAGE
        const url = editOrder ? `/api/orders/${orderData._id}` : '/api/orders';
        const method = editOrder ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.detail || 'Failed to save order');
        }
        
        if (!result.success) {
            window.alertSystem.show('Failed to save order. Please try again.', 'error');
            return;
        }
        
        // Clean up temporary storage
        localStorage.removeItem('editOrder');
        localStorage.removeItem('draft_order');
        
        window.alertSystem.show(`✅ Order generated successfully!\n\n📋 Order Number: ${result.order_id}`, 'success');
        
        setTimeout(() => {
            window.location.href = `/order-sheet/${result.order_id}`;
        }, 2000);
        
    } catch (error) {
        console.error('Order generation failed:', error);
        window.alertSystem.show(`Failed to generate order: ${error.message}`, 'error');
    }
}

// Replace saveDraft() function
async function saveDraft() {
    console.log('🔄 Saving draft...');
    const orderData = collectFormData();
    
    // Check if editing existing order
    const editOrder = localStorage.getItem('editOrder');
    
    if (editOrder) {
        const existingOrder = JSON.parse(editOrder);
        orderData._id = existingOrder.id || existingOrder._id;
        orderData.id = orderData._id;
    }
    
    orderData.order_info = {
        status: 'Draft',
        created_at: editOrder ? JSON.parse(editOrder).created_at : new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    try {
        // ✅ SEND TO SERVER
        const url = editOrder ? `/api/orders/${orderData._id}` : '/api/orders';
        const method = editOrder ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error('Failed to save draft');
        }
        
        // Clean up temporary storage
        localStorage.removeItem('draft_order');
        localStorage.removeItem('editOrder');
        
        // Direct redirect without alert
        window.location.href = '/order';
        
    } catch (error) {
        console.error('Save draft failed:', error);
        window.alertSystem.show('Failed to save draft. Please try again.', 'error');
    }
}
