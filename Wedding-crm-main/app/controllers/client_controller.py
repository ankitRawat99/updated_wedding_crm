from fastapi import APIRouter, Request, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from app.middleware.auth_middleware import get_current_user, get_template_context
from app.services.client_service import ClientService
from app.schemas.client import ClientCreate, ClientUpdate

router = APIRouter()
templates = Jinja2Templates(directory="templates")
client_service = ClientService()

@router.get("/clients", response_class=HTMLResponse)
async def clients_page(request: Request):
    user = await get_current_user(request)
    clients = await client_service.get_all_clients()
    context = get_template_context(user)
    return templates.TemplateResponse("client_detail.html", {
        "request": request,
        "clients": clients,
        **context
    })

@router.get("/add-client", response_class=HTMLResponse)
async def add_client_page(request: Request):
    user = await get_current_user(request)
    context = get_template_context(user)
    return templates.TemplateResponse("add_client.html", {
        "request": request,
        **context
    })

@router.post("/add-client")
async def add_client(
    request: Request,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(None),
    wedding_date: str = Form(...),
    venue: str = Form(None),
    budget: float = Form(None),
    notes: str = Form(None)
):
    try:
        client_data = ClientCreate(
            name=name,
            phone=phone,
            email=email,
            wedding_date=wedding_date,
            venue=venue,
            budget=budget,
            notes=notes
        )
        await client_service.create_client(client_data)
        return RedirectResponse(url="/clients", status_code=302)
    except Exception as e:
        user = await get_current_user(request)
        context = get_template_context(user)
        return templates.TemplateResponse("add_client.html", {
            "request": request,
            "error": "Failed to add client",
            **context
        })

@router.get("/edit-client/{client_id}", response_class=HTMLResponse)
async def edit_client_page(request: Request, client_id: str):
    user = await get_current_user(request)
    client = await client_service.get_client(client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    context = get_template_context(user)
    return templates.TemplateResponse("edit_client.html", {
        "request": request,
        "client": client,
        **context
    })

@router.post("/edit-client/{client_id}")
async def edit_client(
    request: Request,
    client_id: str,
    name: str = Form(...),
    phone: str = Form(...),
    email: str = Form(None),
    wedding_date: str = Form(...),
    venue: str = Form(None),
    budget: float = Form(None),
    notes: str = Form(None)
):
    try:
        update_data = ClientUpdate(
            name=name,
            phone=phone,
            email=email,
            wedding_date=wedding_date,
            venue=venue,
            budget=budget,
            notes=notes
        )
        await client_service.update_client(client_id, update_data)
        return RedirectResponse(url="/clients", status_code=302)
    except Exception as e:
        user = await get_current_user(request)
        client = await client_service.get_client(client_id)
        context = get_template_context(user)
        return templates.TemplateResponse("edit_client.html", {
            "request": request,
            "client": client,
            "error": "Failed to update client",
            **context
        })