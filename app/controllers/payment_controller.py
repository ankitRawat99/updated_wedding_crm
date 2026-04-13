from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, check_permission, get_template_context

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/payments", response_class=HTMLResponse)
async def payments_page(request: Request):
    try:
        user = await get_current_user(request)
        
        # Check if user has permission to view financial data
        if not check_permission(user.get("role"), "view_financial"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Insufficient permissions to view payment information"
            )
        
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
    except HTTPException:
        raise
    except:
        return templates.TemplateResponse("login.html", {"request": request})