from fastapi import APIRouter, Request, Form, HTTPException, status
from fastapi.responses import JSONResponse
from app.services.auth_service import AuthService
from app.services.order_service import OrderService
from app.schemas.user import UserCreate, PasswordChange
from app.middleware.auth_middleware import get_current_user, require_role

router = APIRouter()
auth_service = AuthService()
order_service = OrderService()

@router.get("/view-users")
@require_role(["superadmin", "admin"])
async def view_users(request: Request):
    await get_current_user(request)
    users = await auth_service.user_model.get_all_users()
    return {"users": users, "count": len(users)}

@router.get("/view-orders")
@require_role(["superadmin", "admin"])
async def view_orders(request: Request):
    try:
        await get_current_user(request)
        orders = await order_service.get_all_orders()
        return {"orders": orders, "count": len(orders), "success": True}
    except Exception as e:
        return {"error": str(e), "success": False}

@router.post("/add-user")
@require_role(["superadmin"])
async def add_user(
    request: Request, 
    username: str = Form(...), 
    password: str = Form(...), 
    role: str = Form(...)
):
    try:
        await get_current_user(request)
        
        # Check if user exists
        existing_user = await auth_service.user_model.get_user_by_username(username)
        if existing_user:
            return {"error": "User already exists"}
        
        user_data = UserCreate(username=username, password=password, role=role)
        new_user = await auth_service.create_user(user_data)
        
        return {"success": True, "message": f"User {username} added successfully"}
        
    except ValueError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": "Failed to create user"}

@router.post("/change-password")
async def change_password(
    request: Request,
    username: str = Form(...),
    current_password: str = Form(...),
    new_password: str = Form(...)
):
    try:
        current_user = await get_current_user(request)
        
        # Users can only change their own password unless they're superadmin
        if current_user["username"] != username and current_user["role"] != "superadmin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Can only change your own password"
            )
        
        success = await auth_service.change_password(username, current_password, new_password)
        
        if success:
            return {"success": True, "message": "Password updated successfully"}
        else:
            return {"error": "Current password is incorrect"}
            
    except HTTPException:
        raise
    except Exception as e:
        return {"error": "Failed to change password"}

@router.get("/global-cost-config")
@require_role(["superadmin"])
async def get_global_cost_config(request: Request):
    try:
        await get_current_user(request)
        from app.core.database import get_database
        db = get_database()
        
        config = db._load_collection("cost_calculator_config")
        if not config:
            # Default configuration
            default_config = {
                "clientPricing": {
                    "Pre-Wedding (Edited Photos 50, Save the date)": 20000,
                    "Pre-Wedding (Edited Photos 50, video 5 min)": 50000,
                    "Ad-on Album (Standard)": 10000,
                    "Ad-on Album (Premium)": 15000,
                    "Coffee Table Book": 10000,
                    "Wedding Invite (Customised)": 10000,
                    "Photo Frame": 2000,
                    "Ad-on Reels": 2000,
                    "Per Event Short Film": 5000,
                    "Drone per day addition": 5000,
                    "4K Shoot": 15000,
                    "Same Day Cut": 25000,
                    "Print Booth (Within Delhi)": 30000
                },
                "internalCosting": {
                    "Team (Mayank not at event)": 0,
                    "Team (Mayank at event)": 0,
                    "Videos (Teaser, SF, LV, Reels)": 8000,
                    "2 Album (12*36) (Design) (100 Sheets)": 4000,
                    "2 Album (12*36) (Print) + Cover (1800)": 4700,
                    "Album Courier": 500,
                    "Wedding E-invite (Standard)": 1000,
                    "Ad-on": 0,
                    "Internal Transportation": 0,
                    "Gear Rental": 6000,
                    "Drone": 3000
                }
            }
            db._save_collection("cost_calculator_config", [default_config])
            return {"success": True, "data": default_config}
        
        return {"success": True, "data": config[0] if config else {}}
        
    except Exception as e:
        return {"error": str(e), "success": False}

@router.post("/global-cost-config")
@require_role(["superadmin"])
async def save_global_cost_config(request: Request):
    try:
        await get_current_user(request)
        data = await request.json()
        
        from app.core.database import get_database
        db = get_database()
        
        db._save_collection("cost_calculator_config", [data])
        return {"success": True, "message": "Configuration saved successfully"}
        
    except Exception as e:
        return {"error": str(e), "success": False}