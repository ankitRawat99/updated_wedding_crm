from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/delivery-tracker", response_class=HTMLResponse)
async def delivery_tracker(request: Request):
    try:
        user = await get_current_user(request)
        context = get_template_context(user)
        return templates.TemplateResponse("delivery_tracker.html", {
            "request": request,
            **context
        })
    except:
        return templates.TemplateResponse("login.html", {"request": request})