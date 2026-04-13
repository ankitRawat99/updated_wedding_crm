from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/dashboard", response_class=HTMLResponse)
async def dashboard(request: Request):
    try:
        user = await get_current_user(request)
        
        # Get real business statistics
        from app.services.order_service import OrderService
        order_service = OrderService()
        
        # Get real order statistics
        order_stats = await order_service.get_orders_stats()
        booking_orders = await order_service.get_booking_orders()
        
        # Calculate stage-wise breakdown
        stage_counts = {}
        for order in booking_orders:
            stage = order.get("stage", "unknown")
            stage_counts[stage] = stage_counts.get(stage, 0) + 1
        
        # Get upcoming payments
        upcoming_payments = []
        for order in booking_orders[:3]:  # Show first 3
            if order.get("next_payment_due"):
                upcoming_payments.append({
                    "client": order.get("couple_name", "Unknown"),
                    "date": "TBD",
                    "amount": order.get("delivery_pending", "0")
                })
        
        dashboard_data = {
            "bookings": {
                "this_month": {"count": order_stats["active_orders"], "value": f"{order_stats['total_revenue']:,}"},
                "previous_month": {"count": order_stats["completed_orders"], "value": "0"},
                "this_quarter": {"count": order_stats["total_orders"], "value": f"{order_stats['total_revenue']:,}"},
                "lifetime": {"count": order_stats["total_orders"], "value": f"{order_stats['total_revenue']:,}"}
            },
            "active_bookings": {
                "total": order_stats["active_orders"],
                "value": f"{order_stats['total_revenue']:,}",
                "inward": f"{order_stats['total_revenue'] - order_stats['pending_payments']:,}",
                "pending": f"{order_stats['pending_payments']:,}"
            },
            "upcoming_payments": upcoming_payments,
            "payment_summary": {
                "next_7_days": {"count": len([o for o in booking_orders if o.get("payment_status") == "pending"]), "value": f"{order_stats['pending_payments']:,}"},
                "next_30_days": {"count": order_stats["active_orders"], "value": f"{order_stats['pending_payments']:,}"},
                "waitlist": {"count": stage_counts.get("pre-lock", 0), "value": "0"}
            },
            "orders": {
                "locked": {"total": order_stats["total_orders"] - stage_counts.get("pre-lock", 0), "out_of": order_stats["total_orders"]},
                "pending_lock": stage_counts.get("pre-lock", 0),
                "lock_waitlist": stage_counts.get("pre-lock", 0)
            },
            "events": {
                "total": sum(len(o.get("events", [])) for o in booking_orders),
                "completed": stage_counts.get("out-production", 0),
                "active": stage_counts.get("in-event", 0) + stage_counts.get("pre-event", 0),
                "upcoming": [
                    {"date": "TBD", "type": "Wedding", "client": order.get("couple_name", "Unknown")}
                    for order in booking_orders[:2] if order.get("stage") == "pre-event"
                ]
            },
            "production": {
                "waitlist": stage_counts.get("post-event", 0),
                "in_production": stage_counts.get("in-production", 0),
                "delivery_waitlist": len([o for o in booking_orders if o.get("payment_status") == "partial"]),
                "completed": stage_counts.get("out-production", 0)
            },
            "vendors": {
                "active": 15,  # Keep static for now
                "event_team": 8,
                "editors": 4
            },
            "payouts": {
                "total": "2,85,000",  # Keep static for now
                "completed": "1,95,000",
                "pending": "90,000",
                "breakdown": {
                    "event_team": "1,50,000",
                    "editors": "88,000"
                }
            }
        }
        
        context = get_template_context(user)
        return templates.TemplateResponse("dashboard.html", {
            "request": request,
            "dashboard_data": dashboard_data,
            **context
        })
    except:
        return templates.TemplateResponse("login.html", {"request": request})

