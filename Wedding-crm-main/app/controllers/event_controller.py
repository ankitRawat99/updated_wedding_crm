from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/events", response_class=HTMLResponse)
async def events_page(request: Request):
    try:
        user = await get_current_user(request)
        
        recent_events = [
            {
                "id": 1,
                "name": "Priya & Rahul Wedding",
                "client_name": "Priya Sharma",
                "date": "Jan 15, 2024",
                "venue_address": "Delhi",
                "guest_count": 250,
                "start_time": "10:00 AM",
                "end_time": "8:00 PM",
                "status": "Confirmed",
                "status_color": "green"
            },
            {
                "id": 2,
                "name": "Kavya & Rohit Reception",
                "client_name": "Kavya Patel",
                "date": "Jan 20, 2024",
                "venue_address": "Mumbai",
                "guest_count": 180,
                "start_time": "6:00 PM",
                "end_time": "11:00 PM",
                "status": "Upcoming",
                "status_color": "blue"
            },
            {
                "id": 3,
                "name": "Riya & Karan Engagement",
                "client_name": "Riya Singh",
                "date": "Jan 25, 2024",
                "venue_address": "Pune",
                "guest_count": 120,
                "start_time": "5:00 PM",
                "end_time": "10:00 PM",
                "status": "Live",
                "status_color": "red"
            }
        ]
        
        context = get_template_context(user)
        return templates.TemplateResponse("event_calendar.html", {
            "request": request,
            "recent_events": recent_events,
            **context
        })
    except:
        return templates.TemplateResponse("login.html", {"request": request})