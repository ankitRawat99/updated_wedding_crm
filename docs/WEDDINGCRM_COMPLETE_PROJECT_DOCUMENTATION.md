# WeddingCRM - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Architecture](#architecture)
6. [Installation & Setup](#installation--setup)
7. [Configuration](#configuration)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [User Management](#user-management)
11. [Order Management System](#order-management-system)
12. [Global Cost Management](#global-cost-management)
13. [Frontend Architecture](#frontend-architecture)
14. [Security](#security)
15. [Development Guidelines](#development-guidelines)
16. [Testing](#testing)
17. [Deployment](#deployment)
18. [Troubleshooting](#troubleshooting)
19. [Future Roadmap](#future-roadmap)
20. [Contributing](#contributing)

---

## Project Overview

WeddingCRM is a comprehensive Customer Relationship Management system designed specifically for wedding photography and videography businesses. The application streamlines the entire wedding service workflow from client onboarding to delivery tracking.

### Key Objectives

- **Client Management**: Complete client lifecycle management
- **Order Processing**: From initial inquiry to final delivery
- **Resource Management**: Team and equipment allocation
- **Cost Management**: Global pricing and cost tracking
- **Financial Tracking**: Payment processing and vendor payments
- **Delivery Management**: Project delivery and milestone tracking

### Target Users

- **Super Administrators**: Full system access and global cost management
- **Administrators**: Order management and client oversight
- **Staff Members**: Order form access and client interaction

---

## Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based with role-based access control
- **Storage**: Local file system + localStorage for client-side data

### Frontend
- **Templates**: Jinja2
- **CSS Framework**: Tailwind CSS
- **Icons**: Font Awesome
- **JavaScript**: Vanilla JS with modular architecture
- **Storage**: localStorage for client-side data persistence

### Development Tools
- **Containerization**: Docker & Docker Compose
- **Package Management**: pip (Python)
- **Build Tools**: Native Python/Poetry
- **Version Control**: Git

---

## Project Structure

```
WeddingCRM/
├── app/                          # Main application directory
│   ├── __init__.py              # Application factory
│   ├── main.py                  # FastAPI application instance
│   ├── controllers/             # Request handlers
│   │   ├── admin_controller.py  # Admin management
│   │   ├── auth_controller.py   # Authentication
│   │   ├── calendar_controller.py # Resource calendar
│   │   ├── client_controller.py # Client management
│   │   ├── dashboard_controller.py # Dashboard data
│   │   ├── delivery_controller.py # Delivery tracking
│   │   ├── event_controller.py  # Event management
│   │   ├── order_controller.py  # Order processing
│   │   ├── payment_controller.py # Payment management
│   │   ├── reports_controller.py # Reporting
│   │   └── vendor_controller.py # Vendor management
│   ├── core/                    # Core functionality
│   │   ├── config.py           # Configuration management
│   │   └── database.py         # Database connection
│   ├── middleware/              # Custom middleware
│   │   └── auth_middleware.py  # Authentication middleware
│   ├── models/                  # Data models
│   │   ├── client.py           # Client data model
│   │   ├── order.py            # Order data model
│   │   └── user.py             # User data model
│   ├── schemas/                 # Pydantic schemas
│   │   ├── client.py           # Client schemas
│   │   ├── order.py            # Order schemas
│   │   └── user.py             # User schemas
│   └── services/                # Business logic
│       ├── auth_service.py     # Authentication service
│       ├── client_service.py   # Client service
│       └── order_service.py    # Order processing service
├── templates/                   # Jinja2 templates
│   ├── base_layout.html        # Base template
│   ├── dashboard.html          # Dashboard page
│   ├── global_cost_management.html # Cost management
│   ├── order.html              # Order form
│   ├── order_form/             # Modular order form components
│   │   ├── base_order_form.html # Base order form
│   │   ├── components/         # Reusable components
│   │   │   ├── client_details.html
│   │   │   ├── cost_calculator.html
│   │   │   ├── event_card.html
│   │   │   └── ...
│   │   ├── partials/           # Form partials
│   │   │   ├── action_buttons.html
│   │   │   ├── completion_checkbox.html
│   │   │   └── ...
│   │   └── sections/           # Form sections
│   │       ├── client_info.html
│   │       ├── event_details.html
│   │       ├── deliverables.html
│   │       └── ...
│   ├── login.html              # Authentication
│   ├── vendor_payments.html    # Vendor payment management
│   └── ...
├── static/                      # Static assets
│   ├── css/                    # Stylesheets
│   ├── js/                     # JavaScript modules
│   │   ├── config.js           # Configuration
│   │   ├── dataService.js      # Data management
│   │   ├── cost-sync.js        # Global cost management integration
│   │   ├── cost-calculator.js  # Cost calculation
│   │   ├── formValidator.js    # Form validation
│   │   ├── order-form/         # Order form specific modules
│   │   │   ├── main.js         # Main form logic
│   │   │   ├── cost-calculator.js # Cost calculation
│   │   │   └── form-validation.js # Form validation
│   │   └── ...
│   └── images/                 # Static images
├── data/                        # Sample data files
│   ├── clients_data.json       # Client data
│   ├── cost_calculator_config.json # Cost configuration
│   ├── deliverables_config.json # Deliverables configuration
│   ├── team_config.json        # Team configuration
│   └── ...
├── docs/                       # Documentation
│   ├── WEDDINGCRM_COMPLETE_PROJECT_DOCUMENTATION.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── TECHNICAL_ARCHITECTURE_COST_SYNC.md
│   └── ...
├── requirements.txt            # Python dependencies
├── docker-compose.yml          # Docker configuration
├── Dockerfile                  # Docker image definition
├── app.py                      # Main application entry point
├── run.py                      # Development server
└── README.md                   # Project documentation
```

---

## Core Features

### 1. Authentication & Authorization
- **Multi-role system**: Super Admin, Admin, Staff
- **JWT-based authentication**: Secure token-based authentication
- **Permission-based access control**: Granular permissions
- **Session management**: Secure session handling

### 2. Dashboard & Analytics
- **Real-time metrics**: Order status, revenue, client count
- **Interactive charts**: Revenue trends, order pipeline
- **Quick actions**: Common task shortcuts
- **Recent activity**: Latest updates and changes

### 3. Order Management System
- **Comprehensive order form**: Multi-step, tabbed interface
- **Client information**: Bride and groom details
- **Event management**: Multiple events with detailed specifications
- **Team composition**: Dynamic team member selection
- **Deliverables tracking**: Standard, premium, and custom deliverables
- **Real-time cost calculation**: Integrated cost calculator
- **Pre-wedding services**: Separate handling for pre-wedding events
- **Payment scheduling**: Automated payment milestone tracking

### 4. Global Cost Management
- **5-tier cost structure**: Client pricing, team costs, deliverables, premium services, additional costs
- **Real-time synchronization**: Updates across all pages
- **Cross-tab communication**: Automatic data sync
- **Data validation**: Comprehensive validation system
- **Export/Import**: Cost data backup and restore
- **Edit mode**: In-line editing capabilities

### 5. Resource Management
- **Master calendar**: Resource allocation and availability
- **Team scheduling**: Staff assignment and availability
- **Equipment tracking**: Equipment usage and availability
- **Conflict detection**: Automatic conflict identification

### 6. Vendor Management
- **Vendor profiles**: Detailed vendor information
- **Service catalog**: Vendor service offerings
- **Performance tracking**: Vendor rating and history
- **Payment management**: Vendor payment processing

### 7. Financial Management
- **Payment tracking**: Client payment monitoring
- **Vendor payments**: Payment processing for vendors
- **Invoice generation**: Automated invoice creation
- **Financial reporting**: Revenue and expense reports

### 8. Delivery Management
- **Milestone tracking**: Project delivery milestones
- **Status updates**: Real-time delivery status
- **Client notifications**: Automated delivery notifications
- **Completion tracking**: Project completion monitoring

### 9. Reporting & Analytics
- **Order reports**: Detailed order analysis
- **Financial reports**: Revenue and profit analysis
- **Client reports**: Client acquisition and retention
- **Performance metrics**: Business performance indicators

### 10. Settings & Configuration
- **System settings**: Global application configuration
- **User management**: User account administration
- **Team configuration**: Team member settings
- **Deliverable templates**: Configurable deliverable options

---

## Architecture

### Backend Architecture

#### MVC Pattern
- **Controllers**: Handle HTTP requests and responses
- **Services**: Implement business logic
- **Models**: Define data structures
- **Schemas**: Handle data validation and serialization

#### Dependency Injection
- **Service layer**: Separated business logic
- **Repository pattern**: Data access abstraction
- **Configuration management**: Centralized configuration

#### Authentication Flow
1. User credentials verification
2. JWT token generation
3. Permission-based authorization
4. Request processing with auth context

### Frontend Architecture

#### Component-Based Design
- **Modular components**: Reusable UI components
- **Template inheritance**: Efficient template structure
- **Event-driven architecture**: Component communication
- **State management**: Client-side state handling

#### Data Management
- **Service layer**: Abstracted data operations
- **Caching strategy**: Optimized data access
- **Real-time updates**: Automatic data synchronization
- **Error handling**: Comprehensive error management

#### Cost Management System
- **Global state**: Centralized cost data
- **Cross-component sync**: Real-time updates
- **Event system**: Notification and updates
- **Persistence layer**: Data storage and retrieval

---

## Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB 4.4+
- Docker & Docker Compose (optional)
- Node.js 14+ (for development)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd WeddingCRM
```

#### 2. Virtual Environment Setup
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. MongoDB Setup
```bash
# Start MongoDB service
mongod

# Create database (if needed)
mongo
> use weddingcrm
> db.createCollection("users")
```

#### 5. Environment Configuration
Create `.env` file:
```env
DATABASE_URL=mongodb://localhost:27017/weddingcrm
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### 6. Initialize Admin User
```bash
python create_admin.py
```

#### 7. Start Development Server
```bash
python app.py
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Docker Setup

#### 1. Build and Start Containers
```bash
docker-compose up --build
```

#### 2. Initialize Admin User
```bash
docker-compose exec app python create_admin.py
```

#### 3. Access Application
- Application: http://localhost:8000
- MongoDB: localhost:27017

---

## Configuration

### Application Configuration

#### Core Settings (`app/core/config.py`)
```python
class Settings(BaseSettings):
    app_name: str = "WeddingCRM"
    database_url: str = "mongodb://localhost:27017/weddingcrm"
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS settings
    allowed_origins: List[str] = ["http://localhost:3000"]
    
    # Rate limiting
    rate_limit_per_minute: int = 100
    
    class Config:
        env_file = ".env"
```

#### Authentication Settings
```python
# JWT Configuration
JWT_SECRET_KEY: str
JWT_ALGORITHM: str = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

# Password settings
PASSWORD_MIN_LENGTH: int = 8
PASSWORD_REQUIRE_SPECIAL: bool = True
PASSWORD_REQUIRE_NUMBERS: bool = True
```

### Frontend Configuration

#### Global Settings (`static/js/config.js`)
```javascript
const CONFIG = {
    API_BASE_URL: '/api',
    STORAGE_KEYS: {
        ORDERS: 'weddingcrm_orders',
        CLIENTS: 'weddingcrm_clients',
        GLOBAL_COSTS: 'globalCostManagement'
    },
    FORM_VALIDATION: {
        DEBOUNCE_DELAY: 300,
        AUTO_SAVE_DELAY: 1000
    },
    CALCULATOR: {
        DEBOUNCE_DELAY: 300,
        CACHE_EXPIRY_TIME: 30000
    }
};
```

#### Cost Management Configuration
```javascript
const COST_CATEGORIES = {
    CLIENT_PRICING: 'clientPricing',
    TEAM_COSTS: 'teamCosts',
    STANDARD_DELIVERABLES: 'standardDeliverables',
    PREMIUM_DELIVERABLES: 'premiumDeliverables',
    ADDITIONAL_COSTS: 'additionalCosts'
};
```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
```json
{
    "username": "string",
    "password": "string"
}
```

**Response:**
```json
{
    "access_token": "jwt_token",
    "token_type": "bearer",
    "user": {
        "id": "string",
        "username": "string",
        "role": "superadmin|admin|staff"
    }
}
```

#### POST `/api/auth/logout`
- Requires: Bearer token
- Response: `{"message": "Successfully logged out"}`

### Order Management Endpoints

#### GET `/api/orders`
- **Description**: Retrieve all orders
- **Authentication**: Required
- **Response**: Array of order objects

#### POST `/api/orders`
- **Description**: Create new order
- **Authentication**: Required
- **Request Body**: Order object
- **Response**: Created order object

#### PUT `/api/orders/{order_id}`
- **Description**: Update existing order
- **Authentication**: Required
- **Parameters**: order_id (string)
- **Request Body**: Updated order object
- **Response**: Updated order object

#### DELETE `/api/orders/{order_id}`
- **Description**: Delete order
- **Authentication**: Required
- **Parameters**: order_id (string)
- **Response**: Success confirmation

### Client Management Endpoints

#### GET `/api/clients`
- **Description**: Retrieve all clients
- **Authentication**: Required
- **Response**: Array of client objects

#### POST `/api/clients`
- **Description**: Create new client
- **Authentication**: Required
- **Request Body**: Client object
- **Response**: Created client object

#### PUT `/api/clients/{client_id}`
- **Description**: Update client information
- **Authentication**: Required
- **Parameters**: client_id (string)
- **Request Body**: Updated client object
- **Response**: Updated client object

### Cost Management Endpoints

#### GET `/api/costs`
- **Description**: Get global cost data
- **Authentication**: Required
- **Response**: Cost management object

#### PUT `/api/costs`
- **Description**: Update global cost data
- **Authentication**: Required (Super Admin only)
- **Request Body**: Cost data object
- **Response**: Updated cost data

---

## User Management

### User Roles

#### Super Administrator
**Permissions:**
- ✅ Full system access
- ✅ Global cost management
- ✅ User management
- ✅ All financial operations
- ✅ All reporting access
- ✅ Vendor management

**Responsibilities:**
- System configuration
- User account management
- Global cost setting
- Financial oversight

#### Administrator
**Permissions:**
- ✅ Order management
- ✅ Client management
- ✅ Vendor access
- ✅ Payment tracking
- ✅ Delivery management
- ✅ Reporting access
- ❌ Global cost management
- ❌ User management

**Responsibilities:**
- Order processing
- Client relationship management
- Team coordination
- Financial tracking

#### Staff Member
**Permissions:**
- ✅ Order form access
- ✅ Client data entry
- ✅ Order viewing
- ✅ Basic reporting
- ❌ Financial data
- ❌ User management
- ❌ Global cost management
- ❌ Vendor management

**Responsibilities:**
- Order form completion
- Client data entry
- Task assignment
- Status updates

### User Management Features

#### Account Creation
1. **Admin Creation**: Initial admin via `create_admin.py`
2. **User Registration**: Self-service registration (if enabled)
3. **Bulk Import**: CSV import for bulk user creation
4. **API Creation**: Programmatic user creation

#### Permission Management
- **Granular Permissions**: Individual permission controls
- **Role-based Access**: Standard role definitions
- **Dynamic Permissions**: Runtime permission changes
- **Audit Logging**: Permission change tracking

---

## Order Management System

### Order Form Architecture

#### Multi-Step Process
1. **Client Information**: Bride and groom details
2. **Event Details**: Wedding and pre-wedding events
3. **Deliverables**: Service selection and customization
4. **Package & Pricing**: Cost calculation and payment schedule

#### Form Features

##### Client Information Section
- **Bride Details**: Name, Aadhar, Email, Contact
- **Groom Details**: Name, Aadhar, Email, Contact
- **Validation**: Required field validation, format validation
- **Pre-population**: Auto-fill from existing client data

##### Event Management
- **Wedding Events**: Multiple events support
- **Team Composition**: Dynamic team member selection
- **Event Specifications**: Date, location, coverage type
- **Pre-wedding Services**: Optional pre-wedding shoot

##### Deliverables Management
- **Standard Deliverables**: Basic package inclusions
- **Add-on Deliverables**: Premium services
- **Custom Deliverables**: Client-specific requirements
- **Real-time Selection**: Dynamic cost calculation

##### Cost Calculation
```javascript
class WeddingCostCalculator {
    calculateCosts() {
        const formData = this.collectFormData();
        const globalCosts = window.getGlobalCosts();
        
        // Calculate component costs
        const teamCost = this.calculateTeamCosts(formData.events, globalCosts);
        const standardCost = this.calculateDeliverablesCost(formData.standardDeliverables, globalCosts);
        const addonCost = this.calculateDeliverablesCost(formData.addonDeliverables, globalCosts);
        const travelCost = this.calculateTravelCosts(formData.costFactors, globalCosts);
        
        return {
            teamCost,
            standardCost,
            addonCost,
            travelCost,
            subtotal: teamCost + standardCost + addonCost + travelCost,
            finalTotal: this.calculateFinalTotal()
        };
    }
}
```

### Data Persistence

#### Local Storage Management
```javascript
class OrderDataManager {
    saveOrder(data) {
        const orders = this.getStoredOrders();
        const orderId = this.generateOrderId();
        
        const orderData = {
            id: orderId,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: 'draft'
        };
        
        orders.push(orderData);
        localStorage.setItem('weddingcrm_orders', JSON.stringify(orders));
        
        return orderId;
    }
}
```

#### Auto-save Functionality
- **Real-time Saving**: Automatic saving on form changes
- **Draft Management**: Multiple draft versions
- **Data Recovery**: Recovery from browser crashes
- **Sync Status**: Visual indicators for save status

---

## Global Cost Management

### Cost Structure

#### 5-Tier System
1. **Client Pricing**: Services offered to clients
2. **Team Costs**: Per event team member costs
3. **Standard Deliverables**: Basic production costs
4. **Premium Deliverables**: High-end services
5. **Additional Costs**: Equipment, travel, operations

### Global Functions

#### Available API Functions
```javascript
// Core functions
window.getGlobalCosts()              // Get all cost data
window.getServicePrice(serviceName)  // Get specific service price
window.calculateSelectedServices(services)  // Calculate totals
window.findServiceInAllCategories(name)     // Search across categories
window.getServicesByCategory(category)      // Get category services

// Utility functions
window.getCostStatistics()             // Get cost analytics
window.validateCostData()             // Validate data integrity
window.exportCostData()               // Export cost data
window.getGlobalCostHealthStatus()    // System health check
```

### Data Synchronization

#### Cross-Tab Communication
```javascript
// Listen for storage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'globalCostManagement') {
        console.log('🔄 Global costs updated in another tab, syncing...');
        globalCostManager.refreshCache();
        window.weddingCostCalculator.refreshGlobalCosts();
    }
});

// Listen for custom events
window.addEventListener('globalCostsUpdated', (e) => {
    console.log('📊 Global costs updated, recalculating...');
    updateAllCostDisplays();
    if (window.weddingCostCalculator) {
        window.weddingCostCalculator.calculateCosts();
    }
});
```

### Integration Points

#### Order Form Integration
- **Real-time Calculation**: Automatic cost updates
- **Service Mapping**: Form selections to cost categories
- **Dynamic Pricing**: Live price adjustments
- **Validation**: Cost validation and warnings

#### Dashboard Integration
- **Cost Analytics**: Cost trend analysis
- **Profitability Reports**: Margin analysis
- **Budget Planning**: Cost projection tools
- **Historical Data**: Cost change tracking

---

## Security

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Automatic token refresh
- **Secure Headers**: HTTPS-only cookies
- **Session Management**: Secure session handling

### Data Security
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Output encoding and CSP
- **CSRF Protection**: Token-based CSRF prevention

### Permission System
- **Role-based Access**: Hierarchical permission structure
- **Resource-level Permissions**: Granular access control
- **Dynamic Permissions**: Runtime permission changes
- **Audit Logging**: Complete access audit trail

### Data Protection
- **Encryption**: Sensitive data encryption
- **Backup Security**: Secure backup procedures
- **Access Logging**: Complete access tracking
- **Data Retention**: Automated data lifecycle management

---

## Development Guidelines

### Code Style
- **Python**: PEP 8 compliance
- **JavaScript**: ESLint with Airbnb config
- **CSS**: BEM methodology for class naming
- **HTML**: Semantic markup guidelines

### File Organization
- **Components**: Modular component structure
- **Assets**: Organized static asset hierarchy
- **Documentation**: Inline and external documentation
- **Configuration**: Environment-specific configs

### Version Control
- **Branching Strategy**: Git flow with feature branches
- **Commit Messages**: Conventional commit format
- **Code Reviews**: Mandatory peer reviews
- **Release Management**: Semantic versioning

### Testing Strategy
- **Unit Tests**: Comprehensive unit test coverage
- **Integration Tests**: API and component integration
- **End-to-End Tests**: Full user workflow testing
- **Performance Tests**: Load and stress testing

---

## Deployment

### Environment Setup
- **Development**: Local development environment
- **Staging**: Pre-production testing environment
- **Production**: Live production deployment

### Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/weddingcrm
    depends_on:
      - mongo
  
  mongo:
    image: mongo:4.4
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### CI/CD Pipeline
- **Automated Testing**: Continuous integration
- **Security Scanning**: Automated security checks
- **Deployment Automation**: Automated deployment
- **Rollback Procedures**: Emergency rollback plans

---

## Troubleshooting

### Common Issues

#### Database Connection Issues
- **Problem**: MongoDB connection failures
- **Solution**: Check MongoDB service status and connection strings
- **Debug**: Enable verbose logging for database operations

#### Authentication Problems
- **Problem**: JWT token validation failures
- **Solution**: Verify secret key and token expiration
- **Debug**: Check token payload and signature

#### Cost Calculation Errors
- **Problem**: Incorrect cost calculations
- **Solution**: Verify global cost data integrity
- **Debug**: Check cost data mapping and calculations

#### Performance Issues
- **Problem**: Slow form loading or calculations
- **Solution**: Optimize JavaScript execution and data caching
- **Debug**: Profile JavaScript performance and network requests

### Debug Mode
```python
# Enable debug mode
DEBUG = True
LOG_LEVEL = "DEBUG"

# Enable SQL logging
LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
        },
    },
    "handlers": {
        "default": {
            "formatter": "default",
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
        },
    },
    "root": {
        "level": "DEBUG",
        "handlers": ["default"],
    },
}
```

---

## Future Roadmap

### Phase 1: Enhanced Features
- **Mobile Application**: React Native mobile app
- **Advanced Analytics**: Machine learning insights
- **Email Integration**: Automated email campaigns
- **SMS Notifications**: SMS alert system

### Phase 2: Advanced Integrations
- **Payment Gateway**: Stripe/PayPal integration
- **Calendar Sync**: Google Calendar integration
- **Cloud Storage**: AWS S3 integration
- **API Marketplace**: Third-party integrations

### Phase 3: Enterprise Features
- **Multi-location Support**: Branch office management
- **Advanced Reporting**: Custom report builder
- **Workflow Automation**: Business process automation
- **Enterprise SSO**: Single sign-on integration

### Phase 4: AI and Automation
- **AI Cost Prediction**: Machine learning cost forecasting
- **Automated Scheduling**: AI-powered resource allocation
- **Client Insights**: Predictive client behavior analysis
- **Quality Automation**: Automated quality checks

---

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Development Process
1. **Planning**: Discuss features in issues
2. **Development**: Follow coding standards
3. **Testing**: Ensure all tests pass
4. **Review**: Code review required
5. **Merge**: After approval and testing

### Code Standards
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint and Prettier
- **Documentation**: Update docs for changes
- **Testing**: Maintain test coverage

### Issue Reporting
- **Bug Reports**: Use issue templates
- **Feature Requests**: Include detailed descriptions
- **Security Issues**: Private security reporting
- **Performance Issues**: Include performance data

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For technical support and questions:
- **Documentation**: Check this documentation first
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact development team

---

## Acknowledgments

- **FastAPI**: Excellent Python web framework
- **Tailwind CSS**: Utility-first CSS framework
- **MongoDB**: Flexible document database
- **Font Awesome**: Icon library
- **Community**: Open source contributors

---

*Last Updated: November 5, 2025*
*Documentation Version: 1.0*
*Project Version: 1.0.0*