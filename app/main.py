from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from app.core.database import connect_to_database, close_database_connection
from app.controllers.auth_controller import router as auth_router
from app.controllers.admin_controller import router as admin_router
from app.controllers.dashboard_controller import router as dashboard_router
from app.controllers.client_controller import router as client_router
from app.controllers.order_controller import router as order_router
from app.controllers.calendar_controller import router as calendar_router
from app.controllers.event_controller import router as event_router
from app.controllers.vendor_controller import router as vendor_router
from app.controllers.delivery_controller import router as delivery_router
from app.controllers.reports_controller import router as reports_router
from app.controllers.payment_controller import router as payment_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_database()
    yield
    # Shutdown
    await close_database_connection()

app = FastAPI(
    title="Wedding CRM",
    description="A comprehensive wedding management system with JSON storage",
    version="2.0.0",
    lifespan=lifespan
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include controllers
app.include_router(auth_router, tags=["Authentication"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(client_router, tags=["Clients"])
app.include_router(order_router, tags=["Orders"])
app.include_router(calendar_router, tags=["Calendar"])
app.include_router(event_router, tags=["Events"])
app.include_router(vendor_router, tags=["Vendors"])
app.include_router(delivery_router, tags=["Delivery"])
app.include_router(reports_router, tags=["Reports"])
app.include_router(payment_router, tags=["Payments"])


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0", "database": "JSON"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=7500, reload=True)