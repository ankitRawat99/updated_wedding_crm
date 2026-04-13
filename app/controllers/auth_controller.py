from fastapi import APIRouter, Request, Form, HTTPException, status
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from app.services.auth_service import AuthService
from app.schemas.user import UserLogin, UserCreate

router = APIRouter()
templates = Jinja2Templates(directory="templates")
auth_service = AuthService()

@router.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return RedirectResponse(url="/login", status_code=302)

@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    response = templates.TemplateResponse("login.html", {"request": request})
    response.delete_cookie("logged_in")
    response.delete_cookie("user_role")
    response.delete_cookie("username")
    return response

@router.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    try:
        login_data = UserLogin(username=username, password=password)
        user = await auth_service.authenticate_user(login_data)
        
        if not user:
            return templates.TemplateResponse(
                "login.html", 
                {"request": request, "error": "Invalid username or password"}
            )
        
        # Create JWT token
        token = auth_service.create_access_token(
            data={"username": user["username"], "role": user["role"]}
        )
        
        response = RedirectResponse(url="/dashboard", status_code=302)
        response.set_cookie("logged_in", "true")
        response.set_cookie("user_role", user["role"])
        response.set_cookie("username", username)
        response.set_cookie("access_token", token, httponly=True)
        
        return response
        
    except Exception as e:
        return templates.TemplateResponse(
            "login.html", 
            {"request": request, "error": "Login system error"}
        )

@router.get("/logout")
async def logout():
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie("logged_in")
    response.delete_cookie("user_role")
    response.delete_cookie("username")
    response.delete_cookie("access_token")
    return response

# API endpoints for mobile/external access
@router.post("/api/login")
async def api_login(login_data: UserLogin):
    user = await auth_service.authenticate_user(login_data)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    token = auth_service.create_access_token(
        data={"username": user["username"], "role": user["role"]}
    )
    
    return {"access_token": token, "token_type": "bearer", "user": {
        "username": user["username"],
        "role": user["role"]
    }}