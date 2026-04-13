# Wedding CRM - Frontend Order Management System

## 🎯 Overview
This is a complete frontend-only order management system that uses a **single localStorage key** (`weddingcrm_orders`) to manage all order-related data through a **6-stage order lifecycle**.

## 🔄 Order Lifecycle Stages

1. **Draft** - Initial form data, not visible in bookings
2. **Pre-lock** - Generated order, visible in bookings, awaiting confirmation
3. **Pre-event** - Order confirmed, preparing for events
4. **In-event** - Events are currently happening
5. **Post-event** - Events completed, moving to production
6. **In-production** - Content being edited/produced
7. **Out-production** - Final deliverables completed

## 📁 File Structure

### JavaScript Files
- `storageManager.js` - Core storage management with single localStorage key
- `order_form.js` - Order form functionality (updated)
- `order_bookings.js` - Booking cards display and filtering
- `order_sheet.js` - Order sheet display and status management
- `dataMigration.js` - Automatic migration from old data formats

### CSS Files
- `order_styles.css` - Styles for stage toasts, chips, and responsive design

### Templates
- `base_order_form.html` - Order form template (updated)
- `order_bookings.html` - Booking cards view (updated)
- `base_order_sheet.html` - Order sheet template (updated)

## 🚀 Key Features

### Single Storage Key
- All order data stored in `weddingcrm_orders` localStorage key
- Unified data structure across all components
- No data duplication or synchronization issues

### 6-Stage Lifecycle
- Clear progression from draft to completion
- Stage-based filtering and display
- Visual stage indicators on cards

### Automatic Data Migration
- Migrates existing data from old format automatically
- Preserves all existing order information
- Creates backup before migration

### Responsive Design
- Mobile-friendly booking cards
- Adaptive stage toasts and chips
- Consistent styling across all views

## 📊 Data Structure

```javascript
{
  _id: "ORD-2025-0105-001",
  order_info: {
    status: "Pre-lock" | "Pre-event" | "In-event" | "Post-event" | "In-production" | "Out-production",
    created_at: "2025-01-05T12:00:00Z",
    updated_at: "2025-01-05T12:15:00Z"
  },
  client_details: {
    bride: { name, contact, email, aadhar },
    groom: { name, contact, email, aadhar }
  },
  events: [...],
  deliverables: { standard: [...], addons: [...], custom: [...] },
  payment_schedule: { deal_amount, payments: [...] }
}
```

## 🔧 Core Functions

### Storage Manager (`storageManager.js`)
- `getAllOrders()` - Get all orders from storage
- `getOrderById(id)` - Get specific order
- `saveOrder(data)` - Save new order
- `updateOrder(id, data)` - Update existing order
- `updateOrderStatus(id, status)` - Change order stage
- `renderBookingCards()` - Display booking cards
- `openOrderSheet(id)` - Navigate to order sheet

### Order Form (`order_form.js`)
- `generateOrder()` - Create order and move to Pre-lock stage
- `saveDraft()` - Save as draft (not visible in bookings)
- `collectFormData()` - Gather form data

### Order Bookings (`order_bookings.js`)
- `filterByDivision()` - Filter active/previous events
- `filterByStatus()` - Filter by specific stages
- `applyFilters()` - Apply all active filters

### Order Sheet (`order_sheet.js`)
- `lockOrder()` - Move to next stage
- `teamNote()` - Add team notes
- `closeOrder()` - Mark as completed
- `cancelOrder()` - Cancel order

## 🎨 User Interface

### Order Form (`/new-order`)
- Multi-tab form with validation
- Save Draft button (status: Draft)
- Generate Order button (status: Pre-lock)

### Order Bookings (`/order-bookings`)
- Stage-based filtering (Active Events / Previous Events)
- Status filters for each lifecycle stage
- Search functionality
- Click card to open order sheet

### Order Sheet (`/order-sheet/{id}`)
- Detailed order view
- Status management buttons
- Team notes functionality
- Stage progression controls

## 🔄 User Workflow

1. **Create Order**: Fill form → Save Draft (optional) → Generate Order
2. **View Orders**: Go to Order Bookings → Filter/Search → Click card
3. **Manage Order**: Order Sheet → Lock Order (advance stage) → Add notes
4. **Complete Order**: Progress through stages → Close Order

## 🛠️ Installation

1. Include JavaScript files in templates:
```html
<script src="/static/js/storageManager.js"></script>
<script src="/static/js/order_form.js"></script>
<script src="/static/js/order_bookings.js"></script>
<script src="/static/js/order_sheet.js"></script>
```

2. Include CSS file:
```html
<link href="/static/css/order_styles.css" rel="stylesheet">
```

3. Data migration runs automatically on page load

## 🔍 Troubleshooting

### Migration Issues
- Check browser console for migration logs
- Use `window.dataMigration.restoreFromBackup()` if needed
- Manual migration: `window.dataMigration.migrateOrderData()`

### Storage Issues
- Check localStorage quota (usually 5-10MB)
- Clear old data if needed: `localStorage.clear()`
- Verify data: `console.log(localStorage.getItem('weddingcrm_orders'))`

### Display Issues
- Ensure CSS file is loaded
- Check for JavaScript errors in console
- Verify storage manager is loaded: `window.storageManager`

## 📝 Notes

- All data is stored locally in browser
- No backend dependencies
- Automatic data migration preserves existing orders
- Stage progression is one-way (forward only)
- Order IDs are auto-generated with timestamp

## 🚀 Future Enhancements

- Export/Import functionality
- Bulk operations
- Advanced filtering
- Print/PDF generation
- Team collaboration features