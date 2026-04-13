from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, check_permission, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/vendors", response_class=HTMLResponse)
async def vendors_page(request: Request):
    try:
        user = await get_current_user(request)
        context = get_template_context(user)
        return templates.TemplateResponse("vendors.html", {
            "request": request,
            **context
        })
    except:
        return templates.TemplateResponse("login.html", {"request": request})

@router.get("/vendor-payments", response_class=HTMLResponse)
async def vendor_payments_page(request: Request):
    try:
        user = await get_current_user(request)
        
        # Check if user has permission to manage payments
        if not check_permission(user.get("role"), "manage_payments"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Insufficient permissions to view vendor payments"
            )
        
        context = get_template_context(user)
        return templates.TemplateResponse("vendor_payments.html", {
            "request": request,
            **context
        })
    except HTTPException:
        raise
    except:
        return templates.TemplateResponse("login.html", {"request": request})