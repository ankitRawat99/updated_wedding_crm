from fastapi import APIRouter, Request, HTTPException
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
