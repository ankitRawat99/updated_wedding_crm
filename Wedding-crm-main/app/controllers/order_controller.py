from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context
from app.services.order_service import OrderService
from app.services.client_service import ClientService
from app.schemas.order import OrderCreate, OrderUpdate
from fastapi.responses import RedirectResponse

router = APIRouter()
templates = Jinja2Templates(directory="templates")
order_service = OrderService()
client_service = ClientService()

@router.get("/orders", response_class=HTMLResponse)
async def orders_page(request: Request):
    user = await get_current_user(request)
    orders = await order_service.get_all_orders()
    context = get_template_context(user)
    return templates.TemplateResponse("order_bookings.html", {
        "request": request,
        "orders": orders,
        **context
    })

@router.get("/new-order", response_class=HTMLResponse)
async def new_order_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("order_form/base_order_form.html", {
        "request": request,
        "clients": [],
        "team_members": [],
        "deliverables": {"standard": [], "addons": [], "custom": []},
        "cost_config": {},
        "form_config": {},
        "order_forms": [],
        "order_data": {},
        **context
    })

@router.get("/order-new", response_class=HTMLResponse)
async def order_new_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("order_form/base_order_form.html", {
        "request": request,
        "clients": [],
        "team_members": [],
        "deliverables": {"standard": [], "addons": [], "custom": []},
        "cost_config": {},
        "form_config": {},
        "order_forms": [],
        "order_data": {},
        **context
    })

@router.post("/new-order")
async def create_order(request: Request):
    try:
        # Get complete form data as JSON
        form_data = await request.json()
        
        # Save complete data to order sheet first
        order_sheet = await order_service.create_order_sheet(form_data)
        
        # Create booking card from order sheet
        booking_card = await order_service.create_booking_from_sheet(order_sheet["id"])
        
        return {"success": True, "order_id": order_sheet["id"], "redirect": f"/order-sheet/{order_sheet['id']}"}
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/order/{order_id}", response_class=HTMLResponse)
async def order_detail(request: Request, order_id: str):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("order_form_view.html", {
        "request": request,
        "order_id": order_id,
        **context
    })

@router.get("/client-orders/{order_id}", response_class=HTMLResponse)
async def client_orders(request: Request, order_id: str):
    user = await get_current_user(request)
    
    # Get order from booking_orders
    booking_orders = await order_service.get_booking_orders()
    order = next((o for o in booking_orders if o.get("id") == order_id), None)
    
    if not order:
        return RedirectResponse(url="/bookings", status_code=302)
    
    context = get_template_context(user)
    return templates.TemplateResponse("client_order.html", {
        "request": request,
        "orders": [order],  # Pass as list for template compatibility
        "client": order,    # Use order data as client data
        **context
    })

@router.get("/client-order", response_class=HTMLResponse)
async def client_order_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    
    # Get first available order or create dummy data
    booking_orders = await order_service.get_booking_orders()
    client_data = booking_orders[0] if booking_orders else {
        "name": "Sample Client",
        "contact_number": "+91 9876543210",
        "email": "client@example.com",
        "coverage": "Both Side",
        "location": "Sample Location"
    }
    
    return templates.TemplateResponse("client_order.html", {
        "request": request,
        "client": client_data,
        "client_id": "sample",
        **context
    })

# Dashboard link aliases
@router.get("/bookings", response_class=HTMLResponse)
async def bookings_alias(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    
    # Get booking cards from order sheets
    booking_cards = await order_service.get_booking_cards_from_sheets()
    
    return templates.TemplateResponse("order_bookings.html", {
        "request": request,
        "booking_cards": booking_cards,
        **context
    })

@router.get("/order-bookings", response_class=HTMLResponse)
async def order_bookings_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    
    # Get booking cards from order sheets
    booking_cards = await order_service.get_booking_cards_from_sheets()
    
    return templates.TemplateResponse("order_bookings.html", {
        "request": request,
        "booking_cards": booking_cards,
        **context
    })

@router.get("/order", response_class=HTMLResponse)
async def order_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("order.html", {
        "request": request,
        **context
    })

@router.get("/payments", response_class=HTMLResponse)
async def payments_page(request: Request):
    user = await get_current_user(request)
    payment_summary = {
        "total_payment": "₹12,50,000",
        "received": "₹8,75,000",
        "pending": "₹3,75,000"
    }
    context = get_template_context(user)
    return templates.TemplateResponse("payments.html", {
        "request": request,
        "payment_summary": payment_summary,
        **context
    })

@router.get("/calendar", response_class=HTMLResponse)
async def calendar_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("master_resource_allocation.html", {
        "request": request,
        **context
    })

@router.get("/events", response_class=HTMLResponse)
async def events_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("event_calendar.html", {
        "request": request,
        **context
    })

@router.get("/vendors", response_class=HTMLResponse)
async def vendors_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("vendors.html", {
        "request": request,
        **context
    })

@router.get("/reports", response_class=HTMLResponse)
async def reports_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("reports.html", {
        "request": request,
        **context
    })

@router.post("/order/new/save")
async def save_order_form(request: Request):
    """Save order form data to JSON"""
    try:
        user = await get_current_user(request)
        data = await request.json()
        
        # Save to order forms JSON
        success = await order_service.save_order_form(data)
        
        if success:
            return {"success": True, "message": "Order saved successfully"}
        else:
            return {"success": False, "error": "Failed to save order"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/process-payment")
async def process_payment(
    request: Request,
    order_id: str = Form(...),
    payment_type: str = Form(...),  # advance, event, delivery
    amount: int = Form(...)
):
    try:
        user = await get_current_user(request)
        
        # Process payment with business logic
        success = await order_service.process_payment(order_id, payment_type, amount)
        
        if success:
            return {"success": True, "message": f"{payment_type.title()} payment processed successfully"}
        else:
            return {"success": False, "error": "Order not found"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/order/delete/{order_id}")
async def delete_order(request: Request, order_id: str):
    """Delete a draft order"""
    try:
        user = await get_current_user(request)
        
        # Delete the order form
        success = await order_service.delete_order_form(order_id)
        
        if success:
            return {"success": True, "message": "Order deleted successfully"}
        else:
            return {"success": False, "error": "Order not found"}
            
    except Exception as e:
        return {"success": False, "error": str(e)}



@router.get("/order-sheet/{order_id}")
async def order_sheet_detail(request: Request, order_id: str):
    """Open specific order sheet"""
    try:
        user = await get_current_user(request)
        context = get_template_context(user)
        return templates.TemplateResponse("order_sheets/base_order_sheet.html", {
            "request": request,
            "order_id": order_id,
            **context
        })
    except Exception as e:
        return HTMLResponse(f"Error loading order sheet: {str(e)}")

@router.get("/order-sheet")
async def order_sheet_page(request: Request):
    """Order sheet page (from generate order)"""
    try:
        user = await get_current_user(request)
        context = get_template_context(user)
        return templates.TemplateResponse("order_sheets/base_order_sheet.html", {
            "request": request,
            **context
        })
    except Exception as e:
        return HTMLResponse(f"Error loading order sheet: {str(e)}")