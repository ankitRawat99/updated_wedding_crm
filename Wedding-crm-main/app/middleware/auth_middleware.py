from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.auth_service import AuthService

security = HTTPBearer()
auth_service = AuthService()

async def get_current_user(request: Request):
    # Check for JWT token in Authorization header
    authorization = request.headers.get("Authorization")
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        payload = auth_service.verify_token(token)
        if payload:
            # Add permissions to user payload
            payload["permissions"] = get_user_permissions(payload.get("role", ""))
            return payload
    
    # Fallback to cookie-based auth (for web interface)
    logged_in = request.cookies.get("logged_in")
    username = request.cookies.get("username")
    user_role = request.cookies.get("user_role")
    
    if logged_in == "true" and username:
        user_data = {
            "username": username, 
            "role": user_role,
            "permissions": get_user_permissions(user_role or "")
        }
        return user_data
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated"
    )

def require_role(required_roles: list):
    def decorator(func):
        async def wrapper(request: Request, *args, **kwargs):
            user = await get_current_user(request)
            if user.get("role") not in required_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator

def get_user_permissions(user_role: str):
    """Get permissions based on user role"""
    permissions = {
        "superadmin": {
            "view_financial": True,
            "manage_payments": True,
            "global_cost_management": True,
            "manage_users": True,
            "view_reports": True,
            "manage_vendors": True,
            "manage_clients": True,
            "manage_orders": True,
            "manage_events": True
        },
        "admin": {
            "view_financial": True,
            "manage_payments": True,
            "global_cost_management": False,  # Admin cannot access global cost management
            "manage_users": False,
            "view_reports": True,
            "manage_vendors": True,
            "manage_clients": True,
            "manage_orders": True,
            "manage_events": True
        },
        "manager": {
            "view_financial": False,  # Manager cannot see payment info
            "manage_payments": False,
            "global_cost_management": False,
            "manage_users": False,
            "view_reports": False,  # No financial reports
            "manage_vendors": True,
            "manage_clients": True,
            "manage_orders": True,
            "manage_events": True
        }
    }
    return permissions.get(user_role, {})

def check_permission(user_role: str, permission: str) -> bool:
    """Check if user has specific permission"""
    permissions = get_user_permissions(user_role)
    return permissions.get(permission, False)

def get_template_context(user: dict) -> dict:
    """Get complete template context with user data and permissions"""
    permissions_dict = get_user_permissions(user.get("role", ""))
    
    # Create permissions object for template
    class PermissionsObj:
        def __init__(self, perms):
            for key, value in perms.items():
                setattr(self, key, value)
    
    return {
        "username": user.get("username", ""),
        "user_role": user.get("role", ""),
        "permissions": PermissionsObj(permissions_dict)
    }