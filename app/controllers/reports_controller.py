from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, check_permission, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/reports", response_class=HTMLResponse)
async def reports(request: Request):
    try:
        user = await get_current_user(request)
        
        # Check if user has permission to view reports
        if not check_permission(user.get("role"), "view_reports"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Insufficient permissions to view reports"
            )
        
        context = get_template_context(user)
        return templates.TemplateResponse("reports.html", {
            "request": request,
            **context
        })
    except HTTPException:
        raise
    except:
        return templates.TemplateResponse("login.html", {"request": request})

@router.get("/global_cost_management", response_class=HTMLResponse)
async def global_cost_management(request: Request):
    try:
        user = await get_current_user(request)
        
        # Only superadmin can access global cost management
        if not check_permission(user.get("role"), "global_cost_management"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Only Super Admin can access global cost management"
            )
        
        context = get_template_context(user)
        return templates.TemplateResponse("global_cost_management.html", {
            "request": request,
            **context
        })
    except HTTPException:
        raise
    except:
        return templates.TemplateResponse("login.html", {"request": request})