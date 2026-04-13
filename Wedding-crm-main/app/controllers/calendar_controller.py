from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/calendar", response_class=HTMLResponse)
async def calendar_page(request: Request):
    try:
        user = await get_current_user(request)
        
        # Mock team configuration data
        team_config = {
            "shift_types": [
                {"key": "full_day", "label": "Full Day"},
                {"key": "half_day", "label": "Half Day"},
                {"key": "evening", "label": "Evening"}
            ],
            "team_types": [
                {"key": "candid", "label": "Candid", "color": "bg-green-100 text-green-800", "default_cost": 3000},
                {"key": "cine", "label": "Cine", "color": "bg-blue-100 text-blue-800", "default_cost": 4000},
                {"key": "tphoto", "label": "T.Photo", "color": "bg-purple-100 text-purple-800", "default_cost": 2500},
                {"key": "tvideo", "label": "T.Video", "color": "bg-red-100 text-red-800", "default_cost": 3500}
            ]
        }
        
        # Mock team members data
        team_members = {
            "team_members": [
                {"name": "Rahul Sharma"},
                {"name": "Priya Singh"},
                {"name": "Amit Kumar"},
                {"name": "Neha Gupta"},
                {"name": "Vikash Yadav"},
                {"name": "Anjali Verma"}
            ]
        }
        
        context = get_template_context(user)
        return templates.TemplateResponse("master_resource_allocation.html", {
            "request": request,
            "team_config": team_config,
            "team_members": team_members,
            **context
        })
    except:
        return templates.TemplateResponse("login.html", {"request": request})