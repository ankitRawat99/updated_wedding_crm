"""
FIX DATA PERSISTENCE ISSUES
This script adds proper API endpoints for order submission
"""

# File: app/controllers/order_api_controller.py
ORDER_API_CONTROLLER = '''from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.middleware.auth_middleware import get_current_user
from app.services.order_service import OrderService
from typing import Dict, Any

router = APIRouter(prefix="/api")
order_service = OrderService()

@router.post("/orders")
async def create_order_api(request: Request, order_data: Dict[str, Any]):
    """
    API endpoint to create new order
    Replaces localStorage with server-side storage
    """
    try:
        # Authenticate user
        user = await get_current_user(request)
        
        # Validate required fields
        if not order_data.get("client_details"):
            raise HTTPException(status_code=400, detail="Client details required")
        
        bride_name = order_data.get("client_details", {}).get("bride", {}).get("name")
        groom_name = order_data.get("client_details", {}).get("groom", {}).get("name")
        
        if not bride_name and not groom_name:
            raise HTTPException(status_code=400, detail="At least one client name required")
        
        # Check payment schedule
        payments = order_data.get("payment_schedule", {}).get("payments", [])
        has_payment = any(p.get("date") and p.get("amount") for p in payments)
        
        if not has_payment:
            raise HTTPException(status_code=400, detail="At least one payment with date and amount required")
        
        # Check coverage
        events = order_data.get("events", [])
        has_coverage = any(e.get("coverage") for e in events)
        
        if not has_coverage:
            raise HTTPException(status_code=400, detail="At least one event must have coverage type")
        
        # Save order to JSON file
        success = await order_service.save_order_form(order_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to save order")
        
        # Get the saved order ID
        order_id = order_data.get("_id") or order_data.get("id")
        
        return JSONResponse({
            "success": True,
            "order_id": order_id,
            "message": "Order created successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@router.get("/orders")
async def get_orders_api(request: Request):
    """Get all orders"""
    try:
        user = await get_current_user(request)
        orders = await order_service.get_order_forms()
        
        return JSONResponse({
            "success": True,
            "orders": orders,
            "count": len(orders)
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/orders/{order_id}")
async def get_order_api(request: Request, order_id: str):
    """Get specific order"""
    try:
        user = await get_current_user(request)
        
        # Try to get from order_forms first
        order_forms = await order_service.get_order_forms()
        order = next((o for o in order_forms if o.get("_id") == order_id or o.get("id") == order_id), None)
        
        if not order:
            # Try order_sheets
            order = await order_service.get_order_sheet(order_id)
        
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return JSONResponse({
            "success": True,
            "order": order
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/orders/{order_id}")
async def update_order_api(request: Request, order_id: str, order_data: Dict[str, Any]):
    """Update existing order"""
    try:
        user = await get_current_user(request)
        
        order_data["_id"] = order_id
        order_data["id"] = order_id
        
        success = await order_service.save_order_form(order_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update order")
        
        return JSONResponse({
            "success": True,
            "message": "Order updated successfully"
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/orders/{order_id}")
async def delete_order_api(request: Request, order_id: str):
    """Delete order"""
    try:
        user = await get_current_user(request)
        
        success = await order_service.delete_order_form(order_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Order not found")
        
        return JSONResponse({
            "success": True,
            "message": "Order deleted successfully"
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
'''

# Updated JavaScript for API calls
ORDER_FORM_API_JS = '''
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
        
        window.alertSystem.show(`✅ Order generated successfully!\\n\\n📋 Order Number: ${result.order_id}`, 'success');
        
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
'''

def create_api_controller():
    """Create new API controller file"""
    print("📝 Creating API controller...")
    
    controller_path = 'app/controllers/order_api_controller.py'
    
    with open(controller_path, 'w') as f:
        f.write(ORDER_API_CONTROLLER)
    
    print(f"  ✅ Created: {controller_path}")

def update_main_app():
    """Add API router to main app"""
    print("🔧 Updating main.py...")
    
    main_file = 'app/main.py'
    
    with open(main_file, 'r') as f:
        content = f.read()
    
    # Add import
    if 'order_api_controller' not in content:
        import_line = 'from app.controllers.order_controller import router as order_router'
        new_import = import_line + '\nfrom app.controllers.order_api_controller import router as order_api_router'
        content = content.replace(import_line, new_import)
        
        # Add router
        router_line = 'app.include_router(order_router, tags=["Orders"])'
        new_router = router_line + '\napp.include_router(order_api_router, tags=["Orders API"])'
        content = content.replace(router_line, new_router)
        
        with open(main_file, 'w') as f:
            f.write(content)
        
        print("  ✅ API router added to main.py")
    else:
        print("  ⚠️ API router already added")

def create_js_instructions():
    """Create instructions for JavaScript updates"""
    print("📄 Creating JavaScript update instructions...")
    
    instructions = '''
# JAVASCRIPT UPDATE INSTRUCTIONS

## File: static/js/order_form.js

Replace the following functions with the new API-based versions:

1. **generateOrder()** - Lines ~1100-1200
2. **saveDraft()** - Lines ~1300-1350

The new code is in: ORDER_FORM_API_UPDATES.js

## Steps:
1. Open static/js/order_form.js
2. Find the generateOrder() function
3. Replace entire function with new version from ORDER_FORM_API_UPDATES.js
4. Find the saveDraft() function
5. Replace entire function with new version from ORDER_FORM_API_UPDATES.js
6. Save file
7. Test order creation

## Testing:
1. Fill out order form
2. Click "Generate Order"
3. Check browser console for API calls
4. Verify order saved in data/order_forms.json
5. Clear browser cache and verify data persists
'''
    
    with open('JAVASCRIPT_UPDATE_INSTRUCTIONS.txt', 'w', encoding='utf-8') as f:
        f.write(instructions)
    
    with open('ORDER_FORM_API_UPDATES.js', 'w', encoding='utf-8') as f:
        f.write(ORDER_FORM_API_JS)
    
    print("  ✅ Created: JAVASCRIPT_UPDATE_INSTRUCTIONS.txt")
    print("  ✅ Created: ORDER_FORM_API_UPDATES.js")

def main():
    print("=" * 60)
    print("🔧 FIXING DATA PERSISTENCE ISSUES")
    print("=" * 60)
    print()
    
    create_api_controller()
    update_main_app()
    create_js_instructions()
    
    print()
    print("=" * 60)
    print("✅ DATA PERSISTENCE FIXES APPLIED!")
    print("=" * 60)
    print()
    print("⚠️  NEXT STEPS:")
    print("1. Update JavaScript files (see JAVASCRIPT_UPDATE_INSTRUCTIONS.txt)")
    print("2. Restart the server")
    print("3. Test order creation")
    print("4. Verify data persists in data/order_forms.json")
    print()

if __name__ == "__main__":
    main()
