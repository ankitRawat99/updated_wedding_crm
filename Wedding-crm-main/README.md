# WeddingCRM - Complete Wedding Management System

## 🎯 Overview
A comprehensive wedding management system built with FastAPI and JSON storage for managing clients, orders, events, payments, and vendors.

## 🚀 Features
- **Client Management** - Add, edit, track wedding clients
- **Order Booking** - Complete order management with payment tracking
- **Event Calendar** - Schedule and manage wedding events
- **Payment Tracking** - Monitor advances, final payments, and vendor payouts
- **Vendor Management** - Manage photographers, editors, and other vendors
- **Dashboard** - Real-time overview of bookings, payments, and production status

## 📁 Project Structure
```
WeddingCRM/
├── app/
│   ├── controllers/          # API route handlers (MVC Controllers)
│   │   ├── auth_controller.py        ✅ Authentication
│   │   ├── dashboard_controller.py   ✅ Dashboard
│   │   ├── client_controller.py      ✅ Client management
│   │   ├── order_controller.py       ✅ Order management
│   │   ├── event_controller.py       ✅ Event management
│   │   ├── payment_controller.py     ✅ Payment tracking
│   │   ├── vendor_controller.py      ✅ Vendor management
│   │   ├── delivery_controller.py    ✅ Delivery tracking
│   │   ├── reports_controller.py     ✅ Reports & analytics
│   │   ├── calendar_controller.py    ✅ Resource allocation
│   │   └── admin_controller.py       ✅ Admin functions
│   ├── core/
│   │   ├── config.py         # App configuration
│   │   └── database.py       # JSON database handler
│   ├── middleware/
│   │   └── auth_middleware.py # JWT authentication
│   ├── models/               # Data models (MVC Models)
│   │   ├── client.py
│   │   ├── order.py
│   │   └── user.py
│   ├── schemas/              # Pydantic validation schemas
│   │   ├── client.py
│   │   ├── order.py
│   │   └── user.py
│   ├── services/             # Business logic layer
│   │   ├── auth_service.py
│   │   ├── client_service.py
│   │   └── order_service.py
│   └── main.py              # FastAPI app entry point
├── data/                    # JSON data storage (14 files)
├── templates/               # HTML templates (MVC Views)
├── static/                  # CSS, JS, images
└── requirements_json.txt    # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- pip

### Quick Start
1. **Clone & Navigate**
   ```bash
   cd WeddingCRM
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv myvenv
   myvenv\Scripts\activate  # Windows
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements_json.txt
   ```

4. **Run Application**
   ```bash
   python run.py
   ```

5. **Access Application**
   - URL: http://127.0.0.1:7500
   - Username: `admin`
   - Password: `admin123`

## 🔧 Configuration
Edit `.env` file:
```env
DATABASE_TYPE="json"
JSON_DATA_DIR="data"
JWT_SECRET_KEY="your-secret-key"
```

## 📊 Current Status

### ✅ Completed
- ✅ **MVC Architecture**: Proper separation of concerns
- ✅ **11 Specialized Controllers**: Each handling single responsibility
- ✅ **Authentication System**: JWT with bcrypt hashing
- ✅ **Dashboard**: Real-time business metrics
- ✅ **All Routes Working**: No 404 errors
- ✅ **Template System**: 25+ responsive HTML templates
- ✅ **JSON Database**: 14 data files with proper structure
- ✅ **Error Handling**: Safe template rendering

### 🚧 In Progress
- Service layer integration with controllers
- Real data loading from JSON files
- Advanced error handling

### ❌ TODO
- API endpoints for mobile/external access
- Data validation with Pydantic schemas
- Unit testing
- Production deployment configuration

## 🎨 Tech Stack
- **Backend**: FastAPI, Python
- **Database**: JSON files (easily switchable to MongoDB)
- **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
- **Authentication**: JWT tokens with bcrypt

## 📝 API Endpoints

### Authentication
- `POST /login` - User login
- `GET /logout` - User logout

### Dashboard
- `GET /dashboard` - Main dashboard

### Core Endpoints
- `GET /dashboard` - Business dashboard
- `GET /clients` - Client management
- `GET /orders` - Order management
- `GET /events` - Event calendar
- `GET /payments` - Payment tracking
- `GET /vendors` - Vendor management
- `GET /delivery-tracker` - Production tracking
- `GET /reports` - Analytics & reports
- `GET /calendar` - Resource allocation
- `GET /vendor-payments` - Vendor payments
- `GET /global_cost_management` - Cost management

## 🔒 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

## 🚀 Deployment
1. Set production environment variables
2. Use gunicorn for production server
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📞 Support
For issues and questions, create an issue in the repository.

---
**Version**: 2.0.0  
**Architecture**: MVC with 11 specialized controllers  
**Last Updated**: January 2025