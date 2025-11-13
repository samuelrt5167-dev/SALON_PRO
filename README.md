# SalonPro Implementation Plan

## Overview

SalonPro is a comprehensive salon management platform supporting multiple stakeholders: Platform Admins, Salon Admins, Stylists, and Clients. The system will enable complete salon operations management including bookings, staff management, payments, and analytics with Ethiopian payment integration and multi-branch support.

## Current State Analysis

The project is a greenfield repository with only basic setup files. No existing codebase, authentication system, or database structure exists. We need to implement everything from scratch using Django (backend), React/TypeScript (frontend), and PostgreSQL with Docker.

## Desired End State

A fully functional multi-tenant salon management platform with:

- Multi-role authentication (Google SSO + password)
- Complete CRUD operations for all salon entities
- Role-based dashboards for each user type
- Ethiopian payment integration (Chapa/Telebirr)
- Analytics and reporting system
- Multi-branch salon support
- Mobile-responsive localized UI

---

## Phase 1 - Authentication & Onboarding (Weeks 1-2)

### 1.1 Project Structure Setup

**Repo: Salonpro**

**Create monorepo structure:**

```
Salonpro/
├── backend/          # Django backend
├── frontend/         # React TypeScript frontend
├── docker-compose.yml
├── .env.example
└── README.md
```

**backend/ directory structure:**

```
backend/
├── manage.py
├── requirements.txt
├── salonpro/
│   ├── __init__.py
│   ├── settings/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── __init__.py
│   ├── authentication/
│   ├── accounts/
│   ├── salons/
│   ├── bookings/
│   ├── services/
│   ├── payments/
│   └── analytics/
└── static/
```

**frontend/ directory structure:**

```
frontend/
├── package.json
├── tsconfig.json
├── public/
└── src/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/
    ├── types/
    ├── utils/
    └── contexts/
```

**File: backend/requirements.txt**
**Purpose:** Python dependencies (2025 versions)
**Implementation:**

```txt
# Django Core
Django==5.1.2
djangorestframework==3.15.1
django-cors-headers==4.4.0
django-environ==0.11.2

# Database
psycopg2-binary==2.9.9
redis==5.0.8

# Authentication & Security
djangorestframework-simplejwt==5.3.0
django-allauth==64.1.0
django-axes==6.4.0
cryptography==42.0.8

# Payments & Webhooks
requests==2.32.3
pycryptodome==3.20.0  # For RSA encryption (Telebirr)

# Background Tasks
celery==5.4.0
flower==3.0.0

# File Storage & Media
django-storages==1.14.4
boto3==1.35.29
Pillow==10.4.0

# Analytics & Reporting
pandas==2.2.3
reportlab==4.2.0
openpyxl==3.1.5

# Development & Testing
pytest==8.3.3
pytest-django==4.8.0
black==24.8.0
flake8==7.1.1

# WebSocket
channels==4.1.0
channels-redis==4.2.0

# Email
django-anymail==12.0

# API Documentation
drf-spectacular==0.27.2
```

**File: frontend/package.json**
**Purpose:** Frontend dependencies (2025 versions)
**Implementation:**

```json
{
  "name": "salonpro-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@mui/material": "^6.1.0",
    "@mui/icons-material": "^6.1.0",
    "@mui/x-date-pickers": "^7.10.0",
    "@emotion/react": "^11.11.4",
    "@emotion/styled": "^11.11.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^6.23.0",
    "react-hook-form": "^7.52.0",
    "axios": "^1.7.2",
    "typescript": "^5.6.2",
    "recharts": "^2.12.7",
    "nivo": "^0.87.0",
    "react-i18next": "^13.5.0",
    "i18next": "^23.11.5",
    "@tanstack/react-query": "^5.51.1",
    "socket.io-client": "^4.7.5"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.2",
    "eslint": "^9.9.0",
    "@typescript-eslint/eslint-plugin": "^8.2.0",
    "@typescript-eslint/parser": "^8.2.0"
  }
}
```

### 1.2 Authentication System

**Repo: Salonpro/backend**

**File: apps/authentication/models.py**
**Purpose:** User authentication with role-based access
**Implementation:**

- Create CustomUser model extending AbstractUser
- Add user\_type field: choices=['platform\_admin', 'salon\_admin', 'stylist', 'client']
- Add phone\_number, profile\_picture, is\_verified fields
- Use Django's built-in user model with custom fields

**File: apps/authentication/views.py**
**Purpose:** Authentication endpoints
**Implementation:**

- POST /api/auth/register/ - User registration (role-specific)
- POST /api/auth/login/ - Email/password login
- POST /api/auth/logout/ - JWT token invalidation
- POST /api/auth/refresh/ - Token refresh
- GET /api/auth/me/ - Current user info

**File: apps/authentication/google\_auth.py**
**Purpose:** Google SSO integration
**Implementation:**

- Use django-allauth for Google OAuth
- Configure GOOGLE\_CLIENT\_ID and GOOGLE\_CLIENT\_SECRET
- Handle OAuth callback and user creation/login
- Map Google user data to CustomUser model

**Authentication Flow:**

1. User selects login method (Google or email/password)
2. Google OAuth: Redirect to Google, handle callback, create/find user
3. Email/Password: Validate credentials, issue JWT tokens
4. Return user data with JWT access/refresh tokens
5. Store tokens in httpOnly cookies (secure)

### 1.3 Registration Flows

**Repo: Salonpro/backend**

**File: apps/accounts/views.py**
**Purpose:** Role-specific registration
**Implementation:**

**Salon Registration:**

- POST /api/accounts/register/salon/
- Required fields: email, password, salon\_name, phone, address
- Creates CustomUser (user\_type='salon\_admin') + Salon record
- Sends verification email
- Returns user and salon data

**Client Registration:**

- POST /api/accounts/register/client/
- Required fields: email, password, first\_name, last\_name, phone
- Creates CustomUser (user\_type='client')
- Optional fields: preferences, favorite\_services
- Sends verification email

**Stylist Registration:**

- POST /api/accounts/register/stylist/ (invitation-based)
- Requires invitation token from salon admin
- Creates CustomUser (user\_type='stylist')
- Links to existing salon and staff record

**File: apps/accounts/serializers.py**
**Purpose:** Data validation for registration
**Implementation:**

- Separate serializers for each user type
- Email uniqueness validation
- Password strength validation
- Phone number format validation (Ethiopian format: +251...)

### 1.4 Onboarding Wizard

**Repo: Salonpro/frontend**

**File: src/components/onboarding/SalonOnboardingWizard.tsx**
**Purpose:** Interactive first-time setup for salons
**Implementation:**

- Multi-step form with progress indicator
- Step 1: Salon details (logo, description, category)
- Step 2: Business hours and working days
- Step 3: Service categories and basic services
- Step 4: Staff invitation (email invites)
- Step 5: Branch setup (if multi-branch)
- Step 6: Payment preferences

**File: src/components/onboarding/OnboardingStep.tsx**
**Purpose:** Reusable step component
**Implementation:**

- Props: title, description, fields, validation
- Auto-save progress to localStorage
- Navigation between steps
- Validation before proceeding

**Backend support:**

- PATCH /api/salons/onboarding/ - Update onboarding progress
- POST /api/salons/onboarding/complete - Mark onboarding complete
- Store onboarding data temporarily, apply on completion

**Data collected during onboarding:**

- Salon type: ['hair', 'beauty', 'spa', 'barbershop', 'nails']
- Size: ['solo', 'small', 'medium', 'large']
- Number of staff: numeric input
- Service categories: multi-select from predefined list
- Working hours: per day schedule
- Location details: address, map coordinates, contact info

---

## Phase 2 - Core Entity CRUD Operations (Weeks 3-5)

### 2.1 Database Models Design

**Repo: Salonpro/backend**

**File: apps/salons/models.py**
**Purpose:** Salon and branch management
**Implementation:**

```python
class Salon(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # salon_admin
    logo = models.ImageField(upload_to='salon_logos/', blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='Ethiopia')
    salon_type = models.CharField(max_length=50, choices=SALON_TYPES)
    size = models.CharField(max_length=20, choices=SALON_SIZES)
    commission_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Branch(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    is_main_branch = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

**File: apps/services/models.py**
**Purpose:** Service and staff management
**Implementation:**

```python
class Staff(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='staff')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    role = models.CharField(max_length=50, choices=STAFF_ROLES)  # stylist, receptionist, manager
    specialization = models.CharField(max_length=200, blank=True)
    commission_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=50.00)
    is_active = models.BooleanField(default=True)
    hire_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

class ServiceCategory(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='service_categories')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Service(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='services')
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    duration_minutes = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    commission_type = models.CharField(max_length=20, choices=COMMISSION_TYPES)  # percentage, fixed
    commission_value = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class InventoryItem(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='inventory')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=5)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    supplier = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
```

### 2.2 Staff Management System

**Repo: Salonpro/backend**

**File: apps/salons/views.py**
**Purpose:** Staff CRUD operations
**Implementation:**

**Staff Management Endpoints:**

- GET /api/salons/{salon\_id}/staff/ - List all staff
- POST /api/salons/{salon\_id}/staff/ - Add new staff member
- GET /api/salons/{salon\_id}/staff/{staff\_id}/ - Get staff details
- PUT /api/salons/{salon\_id}/staff/{staff\_id}/ - Update staff info
- DELETE /api/salons/{salon\_id}/staff/{staff\_id}/ - Remove staff
- POST /api/salons/{salon\_id}/staff/{staff\_id}/invite/ - Send invitation

**File: apps/salons/serializers.py**
**Purpose:** Staff data validation
**Implementation:**

- StaffCreationSerializer: For adding new staff
- StaffUpdateSerializer: For updating existing staff
- StaffListSerializer: For staff listing with performance data

**Features:**

- Role assignment: stylist, receptionist, manager
- Commission settings per staff member
- Branch assignment (for multi-branch salons)
- Employment status tracking (active, on\_leave, terminated)
- Performance metrics integration
- Document upload (contracts, certifications)

### 2.3 Services Management

**Repo: Salonpro/backend**

**File: apps/services/views.py**
**Purpose:** Service CRUD operations
**Implementation:**

**Service Endpoints:**

- GET /api/salons/{salon\_id}/services/ - List all services
- POST /api/salons/{salon\_id}/services/ - Create new service
- GET /api/salons/{salon\_id}/services/{service\_id}/ - Get service details
- PUT /api/salons/{salon\_id}/services/{service\_id}/ - Update service
- DELETE /api/salons/{salon\_id}/services/{service\_id}/ - Delete service
- GET /api/salons/{salon\_id}/service-categories/ - List categories
- POST /api/salons/{salon\_id}/service-categories/ - Create category

**Service Features:**

- Service categorization (hair, beauty, spa, nails, etc.)
- Pricing with special offers and discounts
- Duration and buffer time management
- Staff assignment capabilities
- Service images and descriptions
- Seasonal service management
- Service bundles and packages

### 2.4 Inventory Management

**Repo: Salonpro/backend**

**File: apps/inventory/views.py**
**Purpose:** Inventory CRUD and tracking
**Implementation:**

**Inventory Endpoints:**

- GET /api/salons/{salon\_id}/inventory/ - List inventory items
- POST /api/salons/{salon\_id}/inventory/ - Add new item
- GET /api/salons/{salon\_id}/inventory/{item\_id}/ - Get item details
- PUT /api/salons/{salon\_id}/inventory/{item\_id}/ - Update item
- DELETE /api/salons/{salon\_id}/inventory/{item\_id}/ - Delete item
- POST /api/salons/{salon\_id}/inventory/{item\_id}/adjust/ - Adjust quantity
- GET /api/salons/{salon\_id}/inventory/alerts/ - Low stock alerts

**Inventory Features:**

- Stock quantity tracking with reorder alerts
- Multi-branch inventory management
- Supplier information and purchase orders
- Usage tracking per service
- Cost and profit analysis
- Barcode/QR code support
- Inventory valuation reports

### 2.5 Appointment Booking System

**Repo: Salonpro/backend**

**File: apps/bookings/models.py**
**Purpose:** Appointment and scheduling
**Implementation:**

```python
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show')
    ]

    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='appointments')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)
    client = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='appointments')
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    deposit_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**File: apps/bookings/views.py**
**Purpose:** Booking operations
**Implementation:**

**Booking Endpoints:**

- GET /api/salons/{salon\_id}/appointments/ - List appointments (filtered by role)
- POST /api/salons/{salon\_id}/appointments/ - Create new appointment
- GET /api/salons/{salon\_id}/appointments/{appointment\_id}/ - Get appointment details
- PUT /api/salons/{salon\_id}/appointments/{appointment\_id}/ - Update appointment
- DELETE /api/salons/{salon\_id}/appointments/{appointment\_id}/ - Cancel appointment
- POST /api/salons/{salon\_id}/appointments/{appointment\_id}/confirm/ - Confirm appointment
- GET /api/salons/{salon\_id}/availability/ - Check time slot availability

**Booking Features:**

- Real-time availability checking
- Staff scheduling and availability
- Automated reminders (email/SMS)
- Waiting list management
- Recurring appointments
- Group bookings
- Cancellation policies and penalties
- Online payment integration

### 2.6 Multi-Branch Support

**Repo: Salonpro/backend**

**File: apps/salons/views.py**
**Purpose:** Branch management
**Implementation:**

**Branch Endpoints:**

- GET /api/salons/{salon\_id}/branches/ - List all branches
- POST /api/salons/{salon\_id}/branches/ - Create new branch
- GET /api/salons/{salon\_id}/branches/{branch\_id}/ - Get branch details
- PUT /api/salons/{salon\_id}/branches/{branch\_id}/ - Update branch info
- DELETE /api/salons/{salon\_id}/branches/{branch\_id}/ - Close branch
- POST /api/salons/{salon\_id}/branches/{branch\_id}/transfer/ - Transfer items/staff

**Branch Features:**

- Independent branch operations
- Staff assignment across branches
- Branch-specific inventory
- Separate booking calendars
- Branch performance analytics
- Inter-branch resource sharing
- Branch-specific pricing and services

### 2.7 Frontend CRUD Components

**Repo: Salonpro/frontend**

**File: src/components/staff/StaffManagement.tsx**
**Purpose:** Staff management interface
**Implementation:**

- Data table with search, filter, and pagination
- Add/Edit staff modal with form validation
- Staff profile view with performance metrics
- Bulk actions (deactivate, assign roles)
- Export to CSV functionality

**File: src/components/services/ServiceManagement.tsx**
**Purpose:** Service management interface
**Implementation:**

- Service catalog with categories
- Service creation/editing forms
- Price and duration management
- Staff assignment interface
- Service images upload

**File: src/components/bookings/BookingCalendar.tsx**
**Purpose:** Appointment scheduling interface
**Implementation:**

- Calendar view (month/week/day)
- Drag-and-drop appointment scheduling
- Real-time availability checking
- Quick appointment creation
- Conflict resolution

**File: src/components/inventory/InventoryManagement.tsx**
**Purpose:** Inventory tracking interface
**Implementation:**

- Inventory list with stock levels
- Low stock alerts dashboard
- Stock adjustment forms
- Supplier management
- Usage reports

---

## Phase 3 - Role-Based Dashboards (Weeks 3-5 continued)

### 3.1 Dashboard Architecture

**Repo: Salonpro/frontend**

**File: src/components/dashboard/DashboardLayout.tsx**
**Purpose:** Main dashboard shell with navigation
**Implementation:**

- Responsive sidebar navigation (collapsible on mobile)
- Top navigation bar with user menu and notifications
- Breadcrumb navigation
- Role-based menu items display
- Theme switcher (light/dark mode)

**File: src/contexts/DashboardContext.tsx**
**Purpose:** Dashboard state management
**Implementation:**

- Current salon/branch selection (for multi-branch)
- Date range filtering for analytics
- Real-time notifications
- User permissions and role access

### 3.2 Salon Admin Dashboard

**Repo: Salonpro/frontend**

**File: src/components/dashboard/SalonAdminDashboard.tsx**
**Purpose:** Main salon administrator interface
**Implementation:**

**Dashboard Sections:**

- KPI Cards: Revenue, Bookings, Customers, Staff Performance
- Revenue Chart: Daily/Weekly/Monthly trends
- Recent Appointments: Today's schedule with quick actions
- Staff Performance: Top performers and availability
- Inventory Alerts: Low stock items needing attention
- Customer Analytics: New vs returning customers

**Key Metrics Display:**

- Today's Revenue: ETB X,XXX
- Weekly Bookings: XXX appointments
- Customer Satisfaction: X.X/5.0
- Staff Utilization: XX%

**File: src/components/dashboard/KPICards.tsx**
**Purpose:** Key performance indicators display
**Implementation:**

```typescript
interface KPIProps {
  title: string;
  value: string | number;
  change: number; // percentage change
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'error';
}
```

**File: src/components/dashboard/RevenueChart.tsx**
**Purpose:** Revenue visualization using Recharts
**Implementation:**

- Line chart for revenue trends
- Bar chart for service category performance
- Date range selector (7d, 30d, 90d, custom)
- Export to PDF functionality

**Salon Admin Features:**

- Quick Actions: Add appointment, add staff, update inventory
- Branch switcher (for multi-branch salons)
- Staff overview with performance metrics
- Service performance analytics
- Customer management shortcuts

### 3.3 Stylist Dashboard

**Repo: Salonpro/frontend**

**File: src/components/dashboard/StylistDashboard.tsx**
**Purpose:** Personal stylist workspace
**Implementation:**

**Dashboard Sections:**

- Today's Schedule: Appointment timeline
- Personal Performance: Revenue, ratings, completed services
- Client List: Upcoming appointments and client history
- Commission Tracker: Earnings and commission breakdown
- Service Notes: Quick access to client preferences

**Key Features:**

- Start/end appointment functionality
- Client preference cards
- Performance comparison with team
- Commission goals and progress
- Service history tracking

**File: src/components/dashboard/AppointmentTimeline.tsx**
**Purpose:** Daily schedule visualization
**Implementation:**

- Timeline view of appointments
- Drag to reschedule (within constraints)
- Quick action buttons (start, complete, cancel)
- Client information preview
- Service details and notes

**File: src/components/dashboard/PerformanceMetrics.tsx**
**Purpose:** Personal performance tracking
**Implementation:**

- Monthly earnings chart
- Client satisfaction ratings
- Service completion rate
- Appointment punctuality
- Comparison with salon averages

### 3.4 Client Dashboard

**Repo: Salonpro/frontend**

**File: src/components/dashboard/ClientDashboard.tsx**
**Purpose:** Customer booking and history interface
**Implementation:**

**Dashboard Sections:**

- Quick Booking: Favorite services and stylists
- Upcoming Appointments: Next bookings with reminders
- Booking History: Past services and ratings
- Favorite Salons: Quick access to preferred locations
- Loyalty Points: Rewards and special offers

**Key Features:**

- One-click rebooking
- Service recommendations
- Appointment reminders
- Review and rating system
- Special offers and promotions

**File: src/components/booking/QuickBooking.tsx**
**Purpose:** Fast appointment booking
**Implementation:**

- Service selection from favorites
- Preferred stylists
- Available time slots
- Instant booking confirmation
- Calendar integration options

**File: src/components/booking/AppointmentHistory.tsx**
**Purpose:** Past appointments management
**Implementation:**

- List of completed services
- Rebook functionality
- Photo gallery (if applicable)
- Service ratings and reviews
- Total spending analytics

### 3.5 Platform Admin Dashboard

**Repo: Salonpro/backend**

**File: apps/analytics/views.py**
**Purpose:** Platform-wide analytics endpoints
**Implementation:**

**Platform Analytics Endpoints:**

- GET /api/admin/dashboard/overview - Platform statistics
- GET /api/admin/dashboard/salons - Salon metrics and status
- GET /api/admin/dashboard/revenue - Platform revenue breakdown
- GET /api/admin/dashboard/growth - User and salon growth trends

**Platform Metrics:**

- Total active salons: XXX
- Total registered users: X,XXX
- Platform revenue (monthly): ETB XXX,XXX
- Commission collected: ETB XX,XXX
- New registrations (this month): XX salons, XXX users

**Repo: Salonpro/frontend**

**File: src/components/dashboard/PlatformAdminDashboard.tsx**
**Purpose:** Platform administrator interface
**Implementation:**

**Platform Admin Features:**

- Salon approval queue
- Commission rate management
- Global analytics and reporting
- User management and support
- System health monitoring

### 3.6 Real-time Updates

**Repo: Salonpro/backend**

**File: apps/notifications/consumers.py**
**Purpose:** WebSocket consumers for real-time updates
**Implementation:**

```python
class DashboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join room based on user role and salon
        self.room_name = f"{user_role}_{salon_id}"
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def appointment_update(self, event):
        # Send real-time appointment updates
        await self.send(text_data=json.dumps(event))

    async def new_booking(self, event):
        # Notify staff of new appointments
        await self.send(text_data=json.dumps(event))
```

**Repo: Salonpro/frontend**

**File: src/hooks/useWebSocket.ts**
**Purpose:** WebSocket connection management
**Implementation:**

- Automatic reconnection
- Room-based subscriptions
- Message type handling
- Connection status indicators

**Real-time Features:**

- New appointment notifications
- Staff availability updates
- Inventory level changes
- Commission updates
- System announcements

### 3.7 Mobile Responsive Design

**Repo: Salonpro/frontend**

**File: src/components/dashboard/MobileDashboard.tsx**
**Purpose:** Mobile-optimized dashboard
**Implementation:**

- Bottom navigation bar
- Swipeable appointment cards
- Touch-optimized quick actions
- Collapsible sections
- Mobile-friendly charts

**Responsive Breakpoints:**

- Desktop: Full dashboard with sidebar
- Tablet: Horizontal scroll, simplified layout
- Mobile: Stacked cards, bottom navigation
- Small mobile: Essential features only

**Mobile-Specific Features:**

- Push notifications for appointments
- Camera integration for inventory photos
- Touch gestures for calendar navigation
- Offline mode for basic viewing
- Quick appointment cancellation

---

## Phase 4 - Payments & Commission Logic (Weeks 6-7)

### 4.1 Payment System Architecture

**Repo: Salonpro/backend**

**File: apps/payments/models.py**
**Purpose:** Payment and commission tracking
**Implementation:**

```python
class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    ]

    PAYMENT_METHODS = [
        ('chapa', 'Chapa'),
        ('telebirr', 'Telebirr'),
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer')
    ]

    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, blank=True)
    external_reference = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Commission(models.Model):
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='commissions')
    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # staff or platform
    commission_type = models.CharField(max_length=20)  # platform, staff, salon
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    settled_at = models.DateTimeField(null=True, blank=True)
```

### 4.2 Ethiopian Payment Integration

**Repo: Salonpro/backend**

**File: apps/payments/chapa.py**
**Purpose:** Chapa payment gateway integration (2025 API v1.1)
**Implementation:**

```python
import requests
import uuid
import hashlib
import hmac
import json
from django.conf import settings

class ChapaPaymentGateway:
    def __init__(self):
        self.secret_key = settings.CHAPA_SECRET_KEY
        self.base_url = 'https://api.chapa.co/v1'
        self.webhook_secret = getattr(settings, 'CHAPA_WEBHOOK_SECRET', '')

    def generate_tx_ref(self):
        """Generate unique transaction reference"""
        return f"SALONPRO-{uuid.uuid4().hex[:12]}"

    def initialize_payment(self, amount, email, first_name, last_name, phone_number=None):
        """Initialize Chapa payment with 2025 API requirements"""
        tx_ref = self.generate_tx_ref()

        payload = {
            'amount': str(amount),
            'currency': 'ETB',
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'tx_ref': tx_ref,  # Required in 2025 API
            'callback_url': f"{settings.BACKEND_URL}/api/payments/chapa/callback/",
            'return_url': f"{settings.FRONTEND_URL}/payment/success?tx_ref={tx_ref}",
            'customization': {
                'title': 'SalonPro Appointment Booking',
                'description': 'Payment for salon services',
                'logo': f"{settings.FRONTEND_URL}/logo.png"
            }
        }

        # Add phone number if provided (required for some businesses)
        if phone_number:
            payload['phone_number'] = phone_number

        headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }

        response = requests.post(
            f"{self.base_url}/transaction/initialize",
            json=payload,
            headers=headers
        )

        result = response.json()
        if response.status_code == 200:
            result['tx_ref'] = tx_ref  # Include tx_ref in response for tracking

        return result

    def verify_payment(self, tx_ref):
        """Verify Chapa payment status using transaction reference"""
        headers = {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }

        response = requests.get(
            f"{self.base_url}/transaction/verify/{tx_ref}",
            headers=headers
        )
        return response.json()

    def verify_webhook_signature(self, payload, signature):
        """Verify webhook signature for security"""
        if not self.webhook_secret:
            return True  # Skip verification if webhook secret not configured

        expected_signature = hmac.new(
            self.webhook_secret.encode(),
            json.dumps(payload, separators=(',', ':')).encode(),
            hashlib.sha256
        ).hexdigest()

        return hmac.compare_digest(expected_signature, signature)

    def process_webhook(self, payload, signature=None):
        """Process incoming webhook from Chapa"""
        # Verify signature if provided
        if signature and not self.verify_webhook_signature(payload, signature):
            raise ValueError("Invalid webhook signature")

        event_type = payload.get('event')
        tx_ref = payload.get('tx_ref')
        status = payload.get('status')

        return {
            'event_type': event_type,
            'tx_ref': tx_ref,
            'status': status,
            'amount': payload.get('amount'),
            'currency': payload.get('currency'),
            'reference': payload.get('reference'),
            'payment_method': payload.get('payment_method')
        }
```

**File: apps/payments/telebirr.py**
**Purpose:** Telebirr payment integration (2025 API v2.0)
**Implementation:**

```python
import base64
import json
import uuid
from datetime import datetime
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_v1_5
from django.conf import settings

class TelebirrPaymentGateway:
    def __init__(self):
        self.app_id = settings.TELEBIRR_APP_ID
        self.app_key = settings.TELEBIRR_APP_KEY
        self.public_key = settings.TELEBIRR_PUBLIC_KEY
        self.short_code = settings.TELEBIRR_SHORT_CODE
        self.base_url = 'https://app.ethiotelecom.et:28443/service-openup/toTradeWebPay'

    def encrypt_payload(self, data):
        """Encrypt payload using RSA encryption (required in v2.0)"""
        try:
            # Import the public key
            rsa_key = RSA.importKey(self.public_key)
            cipher = PKCS1_v1_5.new(rsa_key)

            # Convert data to JSON and encrypt
            json_data = json.dumps(data, separators=(',', ':'))
            encrypted = cipher.encrypt(json_data.encode('utf-8'))

            # Return base64 encoded encrypted data
            return base64.b64encode(encrypted).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Failed to encrypt payload: {str(e)}")

    def generate_payment_request(self, amount, phone_number, order_id=None):
        """Generate Telebirr payment request with 2025 API v2.0 requirements"""
        if not order_id:
            order_id = f"SALONPRO-{uuid.uuid4().hex[:12].upper()}"

        timestamp = str(int(datetime.now().timestamp()))

        # Build request data according to v2.0 API
        data = {
            'appId': self.app_id,
            'appKey': self.app_key,  # Required in v2.0
            'timestamp': timestamp,
            'nonce': order_id,
            'subject': 'SalonPro Appointment Payment',
            'amount': str(amount),
            'notifyUrl': f"{settings.BACKEND_URL}/api/payments/telebirr/callback/",
            'returnUrl': f"{settings.FRONTEND_URL}/payment/success?order_id={order_id}",
            'outTradeNo': order_id,
            'receiveAccount': self.short_code,  # Use SHORT_CODE instead of account
            'expireTime': str(int((datetime.now().timestamp() + 300) * 1000)),  # 5 minutes expiry
            'goodsType': 'SERVICE'  # Service type for salon appointments
        }

        # Encrypt the payload (required in v2.0)
        encrypted_data = self.encrypt_payload(data)

        return {
            'order_id': order_id,
            'encrypted_data': encrypted_data,
            'timestamp': timestamp
        }

    def create_payment_order(self, amount, phone_number):
        """Create payment order and get payment URL"""
        payment_request = self.generate_payment_request(amount, phone_number)

        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'SalonPro/1.0'
        }

        payload = {
            'appId': self.app_id,
            'timestamp': payment_request['timestamp'],
            'nonce': payment_request['order_id'],
            'encryptedData': payment_request['encrypted_data']
        }

        response = requests.post(
            self.base_url,
            json=payload,
            headers=headers,
            timeout=30,
            verify=True  # TLS 1.3 required
        )

        if response.status_code == 200:
            result = response.json()
            return {
                'success': True,
                'order_id': payment_request['order_id'],
                'payment_url': result.get('payUrl'),
                'qr_code': result.get('qrCode'),
                'expires_at': datetime.now().timestamp() + 300  # 5 minutes
            }
        else:
            return {
                'success': False,
                'error': response.text,
                'order_id': payment_request['order_id']
            }

    def verify_callback(self, callback_data):
        """Verify Telebirr callback response"""
        required_fields = ['appId', 'timestamp', 'nonce', 'outTradeNo', 'tradeNo', 'amount', 'status']

        for field in required_fields:
            if field not in callback_data:
                raise ValueError(f"Missing required field in callback: {field}")

        # Additional verification logic here
        # Verify app ID matches
        if callback_data['appId'] != self.app_id:
            raise ValueError("Invalid app ID in callback")

        return {
            'order_id': callback_data['outTradeNo'],
            'trade_no': callback_data['tradeNo'],
            'amount': callback_data['amount'],
            'status': callback_data['status'],
            'payment_method': 'telebirr'
        }
```

### 4.3 Payment Processing Flow

**Repo: Salonpro/backend**

**File: apps/payments/views.py**
**Purpose:** Payment processing endpoints
**Implementation:**

**Payment Endpoints:**

- POST /api/payments/initiate/ - Start payment process
- POST /api/payments/chapa/callback/ - Chapa payment callback (GET and POST)
- POST /api/payments/telebirr/callback/ - Telebirr payment callback
- POST /api/payments/webhooks/chapa/ - Chapa webhook endpoint
- GET /api/payments/{payment\_id}/status/ - Check payment status
- POST /api/payments/{payment\_id}/refund/ - Process refund

**File: apps/payments/webhook\_views.py**
**Purpose:** Payment webhook handlers
**Implementation:**

```python
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
import json
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ChapaWebView(View):
    """Handle Chapa webhooks with signature verification"""

    def post(self, request):
        try:
            # Get signature from headers
            signature = request.headers.get('chapa-signature') or request.headers.get('x-chapa-signature')

            # Parse payload
            payload = json.loads(request.body)

            # Verify webhook signature
            chapa_gateway = ChapaPaymentGateway()
            if not chapa_gateway.verify_webhook_signature(payload, signature):
                logger.warning("Invalid Chapa webhook signature")
                return HttpResponse(status=403)

            # Process webhook
            webhook_data = chapa_gateway.process_webhook(payload, signature)

            # Update payment status based on webhook
            self._process_chapa_webhook(webhook_data)

            return HttpResponse('OK', status=200)

        except Exception as e:
            logger.error(f"Error processing Chapa webhook: {str(e)}")
            return HttpResponse(status=500)

    def _process_chapa_webhook(self, webhook_data):
        """Process Chapa webhook data"""
        tx_ref = webhook_data['tx_ref']
        event_type = webhook_data['event_type']
        status = webhook_data['status']

        # Find the payment by transaction reference
        try:
            payment = Payment.objects.get(transaction_id=tx_ref)

            if event_type == 'charge.success' and status == 'success':
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.save()

                # Calculate and create commissions
                PaymentService().calculate_commissions(payment)

                # Send confirmation notifications
                self._send_payment_confirmation(payment)

            elif event_type in ['charge.failed', 'charge.cancelled']:
                payment.status = 'failed'
                payment.save()

        except Payment.DoesNotExist:
            logger.error(f"Payment not found for tx_ref: {tx_ref}")

@method_decorator(csrf_exempt, name='dispatch')
class TelebirrWebView(View):
    """Handle Telebirr payment callbacks"""

    def post(self, request):
        try:
            # Parse callback data
            callback_data = json.loads(request.body)

            # Verify callback
            telebirr_gateway = TelebirrPaymentGateway()
            verified_data = telebirr_gateway.verify_callback(callback_data)

            # Process callback
            self._process_telebirr_callback(verified_data)

            return JsonResponse({"code": "SUCCESS"}, status=200)

        except Exception as e:
            logger.error(f"Error processing Telebirr callback: {str(e)}")
            return JsonResponse({"code": "ERROR"}, status=500)

    def _process_telebirr_callback(self, callback_data):
        """Process Telebirr callback data"""
        order_id = callback_data['order_id']
        status = callback_data['status']

        # Find the payment by order ID
        try:
            payment = Payment.objects.get(external_reference=order_id)

            if status == 'SUCCESS':
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.save()

                # Calculate commissions
                PaymentService().calculate_commissions(payment)

            else:
                payment.status = 'failed'
                payment.save()

        except Payment.DoesNotExist:
            logger.error(f"Payment not found for order_id: {order_id}")
```

**Payment Flow:**

1. Client confirms appointment booking
2. System initiates payment with chosen gateway
3. Client redirected to payment provider (Chapa/Telebirr)
4. Payment provider processes transaction
5. Callback received from payment provider
6. Payment status updated in database
7. Commissions calculated and distributed
8. Appointment confirmed upon successful payment

**File: apps/payments/services.py**
**Purpose:** Payment processing logic
**Implementation:**

```python
class PaymentService:
    def process_appointment_payment(self, appointment, payment_method):
        """Process payment for appointment"""
        payment = Payment.objects.create(
            appointment=appointment,
            amount=appointment.total_price,
            payment_method=payment_method
        )

        if payment_method == 'chapa':
            return self._process_chapa_payment(payment)
        elif payment_method == 'telebirr':
            return self._process_telebirr_payment(payment)
        elif payment_method == 'cash':
            return self._process_cash_payment(payment)

    def calculate_commissions(self, payment):
        """Calculate and distribute commissions"""
        total_amount = payment.amount

        # Platform commission (5% default)
        platform_rate = payment.appointment.salon.commission_rate / 100
        platform_commission = total_amount * platform_rate

        # Staff commission (50% of remaining amount)
        remaining_amount = total_amount - platform_commission
        staff_commission = remaining_amount * 0.5

        # Create commission records
        Commission.objects.create(
            payment=payment,
            recipient_type='platform',
            amount=platform_commission,
            percentage=payment.appointment.salon.commission_rate
        )

        Commission.objects.create(
            payment=payment,
            recipient=payment.appointment.staff.user,
            recipient_type='staff',
            amount=staff_commission,
            percentage=50.0
        )

        # Salon gets the remaining amount
        salon_commission = remaining_amount - staff_commission
        Commission.objects.create(
            payment=payment,
            recipient=payment.appointment.salon.owner,
            recipient_type='salon',
            amount=salon_commission,
            percentage=0.0
        )
```

### 4.4 Commission Management System

**Repo: Salonpro/backend**

**File: apps/payments/admin.py**
**Purpose:** Django admin for commission management
**Implementation:**

```python
@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = ['payment', 'recipient', 'amount', 'commission_type', 'status', 'created_at']
    list_filter = ['commission_type', 'status', 'created_at']
    search_fields = ['recipient__email', 'payment__transaction_id']
    actions = ['mark_as_settled', 'export_to_csv']

    def mark_as_settled(self, request, queryset):
        updated = queryset.update(settled_at=timezone.now(), status='settled')
        self.message_user(request, f'{updated} commissions marked as settled')
```

**File: apps/analytics/views.py**
**Purpose:** Commission analytics endpoints
**Implementation:**

**Commission Analytics Endpoints:**

- GET /api/analytics/commissions/summary/ - Commission breakdown
- GET /api/analytics/commissions/staff/{staff\_id}/ - Staff commission history
- GET /api/analytics/commissions/platform/ - Platform revenue analytics
- GET /api/analytics/commissions/settlements/ - Settlement reports

### 4.5 Frontend Payment Interface

**Repo: Salonpro/frontend**

**File: src/components/payment/PaymentMethodSelector.tsx**
**Purpose:** Payment method selection
**Implementation:**

```typescript
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'chapa',
    name: 'Chapa',
    icon: '/icons/chapa.svg',
    description: 'Pay with Chapa (Card, Mobile Banking)',
    enabled: true
  },
  {
    id: 'telebirr',
    name: 'Telebirr',
    icon: '/icons/telebirr.svg',
    description: 'Pay with Telebirr Mobile Wallet',
    enabled: true
  },
  {
    id: 'cash',
    name: 'Cash at Salon',
    icon: '/icons/cash.svg',
    description: 'Pay cash when you arrive',
    enabled: true
  }
];
```

**File: src/components/payment/PaymentForm.tsx**
**Purpose:** Payment processing form
**Implementation:**

- Payment method selection
- Amount confirmation
- Terms and conditions acceptance
- Payment initiation
- Loading states and error handling
- Success/failure handling

**File: src/components/payment/PaymentStatus.tsx**
**Purpose:** Payment status tracking
**Implementation:**

- Real-time payment status updates
- Countdown timers for payment completion
- Retry mechanisms for failed payments
- Receipt generation
- Share functionality

### 4.6 Commission Dashboard for Staff

**Repo: Salonpro/frontend**

**File: src/components/commission/CommissionTracker.tsx**
**Purpose:** Personal commission tracking
**Implementation:**

**Commission Features:**

- Daily/weekly/monthly earnings
- Commission breakdown by service
- Payment history and status
- Settlement schedule
- Commission goals tracking
- Export to PDF for records

**File: src/components/commission/EarningsChart.tsx**
**Purpose:** Earnings visualization
**Implementation:**

- Line chart for earnings trends
- Bar chart for service performance
- Comparison with previous periods
- Commission rate analysis
- Goal progress indicators

### 4.7 Financial Reporting

**Repo: Salonpro/backend**

**File: apps/analytics/reports.py**
**Purpose:** Financial report generation
**Implementation:**

**Report Types:**

- Daily Revenue Summary
- Weekly Commission Breakdown
- Monthly Financial Statement
- Quarterly Tax Report
- Annual Performance Report

**Report Features:**

- Automatic report generation
- Email delivery to stakeholders
- PDF export with charts
- Excel export for accounting
- Historical data comparison

### 4.8 Payment Security & Compliance

**Repo: Salonpro/backend**

**File: apps/payments/security.py**
**Purpose:** Payment security measures
**Implementation:**

**Security Features:**

- Payment tokenization
- SSL/TLS encryption for all payment data
- PCI DSS compliance for card payments
- Fraud detection and prevention
- Audit logging for all transactions
- Rate limiting on payment endpoints
- Secure API key management

**Compliance Requirements:**

- Ethiopian banking regulations compliance
- Tax reporting automation
- Data privacy protection
- Transaction record retention
- Anti-money laundering (AML) checks

---

## Phase 5 - Analytics, Reports & Insights (Weeks 8-9)

### 5.1 Analytics Data Pipeline

**Repo: Salonpro/backend**

**File: apps/analytics/models.py**
**Purpose:** Analytics data storage and aggregation
**Implementation:**

```python
class DailyAnalytics(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='daily_analytics')
    date = models.DateField()
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_bookings = models.IntegerField(default=0)
    unique_clients = models.IntegerField(default=0)
    completed_appointments = models.IntegerField(default=0)
    cancelled_appointments = models.IntegerField(default=0)
    no_show_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ServiceAnalytics(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    date = models.DateField()
    bookings_count = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_duration = models.IntegerField(default=0)  # minutes
    created_at = models.DateTimeField(auto_now_add=True)

class StaffAnalytics(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    date = models.DateField()
    appointments_completed = models.IntegerField(default=0)
    revenue_generated = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    commission_earned = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, null=True)
    punctuality_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
```

**File: apps/analytics/tasks.py**
**Purpose:** Scheduled analytics calculations
**Implementation:**

```python
from celery import shared_task
from django.db.models import Count, Sum, Avg
from datetime import date, timedelta

@shared_task
def calculate_daily_analytics():
    """Calculate analytics for all salons for the previous day"""
    yesterday = date.today() - timedelta(days=1)

    for salon in Salon.objects.filter(is_active=True):
        # Calculate daily metrics
        appointments = Appointment.objects.filter(
            salon=salon,
            start_time__date=yesterday
        )

        revenue = Payment.objects.filter(
            appointment__in=appointments,
            status='completed'
        ).aggregate(total=Sum('amount'))['total'] or 0

        # Create or update daily analytics
        DailyAnalytics.objects.update_or_create(
            salon=salon,
            date=yesterday,
            defaults={
                'total_revenue': revenue,
                'total_bookings': appointments.count(),
                'unique_clients': appointments.values('client').distinct().count(),
                'completed_appointments': appointments.filter(status='completed').count(),
                'cancelled_appointments': appointments.filter(status='cancelled').count(),
                'no_show_rate': calculate_no_show_rate(appointments),
                'average_rating': calculate_average_rating(appointments)
            }
        )
```

### 5.2 Salon-Level Analytics

**Repo: Salonpro/backend**

**File: apps/analytics/views.py**
**Purpose:** Salon analytics endpoints
**Implementation:**

**Salon Analytics Endpoints:**

- GET /api/salons/{salon\_id}/analytics/dashboard/ - Dashboard metrics
- GET /api/salons/{salon\_id}/analytics/revenue/ - Revenue trends
- GET /api/salons/{salon\_id}/analytics/services/ - Service performance
- GET /api/salons/{salon\_id}/analytics/staff/ - Staff performance
- GET /api/salons/{salon\_id}/analytics/customers/ - Customer analytics
- GET /api/salons/{salon\_id}/analytics/hours/ - Peak hours analysis

**File: apps/analytics/serializers.py**
**Purpose:** Analytics data serialization
**Implementation:**

```python
class DashboardAnalyticsSerializer(serializers.Serializer):
    # Revenue metrics
    today_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    weekly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    revenue_growth = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Booking metrics
    today_bookings = serializers.IntegerField()
    weekly_bookings = serializers.IntegerField()
    monthly_bookings = serializers.IntegerField()
    booking_growth = serializers.DecimalField(max_digits=5, decimal_places=2)

    # Customer metrics
    new_customers = serializers.IntegerField()
    returning_customers = serializers.IntegerField()
    customer_satisfaction = serializers.DecimalField(max_digits=3, decimal_places=2)

    # Staff metrics
    staff_utilization = serializers.DecimalField(max_digits=5, decimal_places=2)
    top_performers = serializers.ListField()
```

### 5.3 Platform-Level Analytics

**Repo: Salonpro/backend**

**File: apps/analytics/admin\_views.py**
**Purpose:** Platform administrator analytics
**Implementation:**

**Platform Analytics Endpoints:**

- GET /api/admin/analytics/overview/ - Platform overview
- GET /api/admin/analytics/salons/ - Salon performance metrics
- GET /api/admin/analytics/revenue/ - Platform revenue breakdown
- GET /api/admin/analytics/growth/ - Growth trends
- GET /api/admin/analytics/geography/ - Geographic distribution
- GET /api/admin/analytics/compliance/ - Compliance and risk metrics

**Platform Metrics:**

- Total active salons and growth rate
- Platform revenue and commission earnings
- User registration trends
- Geographic distribution of salons
- Service category popularity
- Payment method preferences
- System performance metrics

### 5.4 Frontend Analytics Components

**Repo: Salonpro/frontend**

**File: src/components/analytics/RevenueChart.tsx**
**Purpose:** Revenue visualization using Nivo
**Implementation:**

```typescript
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'

interface RevenueChartProps {
  data: {
    date: string;
    revenue: number;
    bookings: number;
  }[];
  timeRange: '7d' | '30d' | '90d' | '1y';
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, timeRange }) => {
  return (
    <div className="h-96">
      <ResponsiveLine
        data={[
          {
            id: 'revenue',
            data: data.map(item => ({
              x: item.date,
              y: item.revenue
            }))
          }
        ]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
        axisBottom={{ format: '%b %d' }}
        axisLeft={{ format: value => `ETB ${value.toLocaleString()}` }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={false}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
          }
        ]}
      />
    </div>
  )
}
```

**File: src/components/analytics/ServicePerformanceChart.tsx**
**Purpose:** Service performance visualization
**Implementation:**

```typescript
import { ResponsivePie } from '@nivo/pie'

interface ServicePerformanceProps {
  data: {
    service: string;
    bookings: number;
    revenue: number;
    rating: number;
  }[];
}

const ServicePerformanceChart: React.FC<ServicePerformanceProps> = ({ data }) => {
  const pieData = data.map(item => ({
    id: item.service,
    label: item.service,
    value: item.revenue
  }))

  return (
    <ResponsivePie
      data={pieData}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      colors={{ scheme: 'nivo' }}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [ [ 'darker', 0.2 ] ] }}
      radialLabelsSkipAngle={10}
      radialLabelsTextXOffset={6}
      radialLabelsTextColor="#333333"
      radialLabelsLinkOffset={0}
      radialLabelsLinkDiagonalLength={16}
      radialLabelsLinkHorizontalLength={24}
      radialLabelsLinkStrokeWidth={1}
      radialLabelsLinkColor={{ from: 'color' }}
      slicesLabelsSkipAngle={10}
      slicesLabelsTextColor="#333333"
      animate={true}
      motionStiffness={90}
      motionDamping={15}
    />
  )
}
```

**File: src/components/analytics/StaffPerformanceTable.tsx**
**Purpose:** Staff performance ranking
**Implementation:**

- Data table with staff rankings
- Performance metrics (revenue, ratings, punctuality)
- Trend indicators
- Comparison tools
- Export functionality

### 5.5 Real-Time Analytics Dashboard

**Repo: Salonpro/backend**

**File: apps/analytics/consumers.py**
**Purpose:** Real-time analytics updates
**Implementation:**

```python
class AnalyticsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.salon_id = self.scope['url_route']['kwargs']['salon_id']
        self.room_group_name = f'analytics_{self.salon_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def analytics_update(self, event):
        """Send real-time analytics updates"""
        await self.send(text_data=json.dumps({
            'type': 'analytics_update',
            'data': event['data']
        }))
```

**Real-time Features:**

- Live booking count updates
- Revenue tracking throughout the day
- Staff availability changes
- Customer satisfaction ratings
- System performance metrics

### 5.6 Custom Report Builder

**Repo: Salonpro/frontend**

**File: src/components/reports/ReportBuilder.tsx**
**Purpose:** Custom report generation interface
**Implementation:**

**Report Builder Features:**

- Drag-and-drop report designer
- Metric selection and configuration
- Date range and filtering options
- Chart type selection
- Report scheduling
- Export format selection (PDF, Excel, CSV)

**File: src/components/reports/ReportTemplates.tsx**
**Purpose:** Pre-built report templates
**Implementation:**

**Report Templates:**

- Monthly Performance Summary
- Quarterly Business Review
- Staff Performance Report
- Service Revenue Analysis
- Customer Satisfaction Report
- Inventory Utilization Report

### 5.7 Export and Sharing

**Repo: Salonpro/backend**

**File: apps/analytics/export.py**
**Purpose:** Report export functionality
**Implementation:**

```python
import pandas as pd
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO

class ReportExporter:
    def export_to_excel(self, data, filename):
        """Export analytics data to Excel"""
        df = pd.DataFrame(data)

        # Create Excel writer with styling
        output = BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
            df.to_excel(writer, sheet_name='Analytics', index=False)

            # Get the workbook and worksheet for styling
            workbook = writer.book
            worksheet = writer.sheets['Analytics']

            # Add formatting
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#4F81BD',
                'font_color': 'white',
                'border': 1
            })

            for col_num, value in enumerate(df.columns.values):
                worksheet.write(0, col_num, value, header_format)

        output.seek(0)
        return output

    def export_to_pdf(self, data, chart_images, filename):
        """Export analytics report to PDF"""
        buffer = BytesIO()
        p = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Add title
        p.setFont("Helvetica-Bold", 16)
        p.drawString(50, height - 50, "SalonPro Analytics Report")

        # Add charts
        y_position = height - 150
        for chart_path in chart_images:
            p.drawImage(chart_path, 50, y_position, width=500, height=300)
            y_position -= 320

        p.save()
        buffer.seek(0)
        return buffer
```

### 5.8 Predictive Analytics (Future Enhancement)

**Repo: Salonpro/backend**

**File: apps/analytics/predictive.py**
**Purpose:** Predictive analytics for business insights
**Implementation:**

**Predictive Features:**

- Customer lifetime value prediction
- Seasonal demand forecasting
- Staff scheduling optimization
- Inventory demand prediction
- Churn risk analysis

**Machine Learning Models:**

- Time series forecasting for revenue
- Classification models for customer behavior
- Regression models for demand prediction
- Clustering for customer segmentation

---

## Phase 6 - UI/UX Enhancements & Localization (Weeks 10-11)

### 6.1 Design System Enhancement

**Repo: Salonpro/frontend**

**File: src/theme/index.ts**
**Purpose:** Material-UI theme customization
**Implementation:**

```typescript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899', // Pink
      light: '#f472b6',
      dark: '#db2777',
    },
    success: {
      main: '#10b981', // Emerald
    },
    warning: {
      main: '#f59e0b', // Amber
    },
    error: {
      main: '#ef4444', // Red
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});
```

**File: src/components/common/Layout.tsx**
**Purpose:** Consistent layout components
**Implementation:**

- Responsive navigation with mobile menu
- Breadcrumb navigation
- Loading states and skeleton screens
- Error boundaries
- Consistent spacing and layout patterns

### 6.2 Ethiopian Localization

**Repo: Salonpro/backend**

**File: apps/core/translation.py**
**Purpose:** Multi-language support setup
**Implementation:**

```python
# settings/base.py
LANGUAGE_CODE = 'en'
TIME_ZONE = 'Africa/Addis_Ababa'
USE_I18N = True
USE_TZ = True
USE_L10N = True

LANGUAGES = [
    ('en', 'English'),
    ('am', 'Amharic'),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]
```

**File: locale/am/LC\_MESSAGES/django.po**
**Purpose:** Amharic translations
**Implementation:**

```
msgid "Welcome"
msgstr "እንኳን ደህና መጡ"

msgid "Dashboard"
msgstr "ዳሽቦርድ"

msgid "Appointments"
msgstr "ቀጠሮዎች"

msgid "Services"
msgstr "አገልግሎቶች"

msgid "Staff"
msgstr "ሰራተኞች"

msgid "Revenue"
msgstr "ገቢዎች"

msgid "Bookings"
msgstr "ብርያዎች"

msgid "Customers"
msgstr "ደንበኞች"
```

**Repo: Salonpro/frontend**

**File: src/i18n/index.ts**
**Purpose:** Frontend internationalization
**Implementation:**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "appointments": "Appointments",
      "services": "Services",
      "staff": "Staff",
      "revenue": "Revenue",
      "bookings": "Bookings",
      "customers": "Customers"
    }
  },
  am: {
    translation: {
      "welcome": "እንኳን ደህና መጡ",
      "dashboard": "ዳሽቦርድ",
      "appointments": "ቀጠሮዎች",
      "services": "አገልግሎቶች",
      "staff": "ሰራተኞች",
      "revenue": "ገቢዎች",
      "bookings": "ብርያዎች",
      "customers": "ደንበኞች"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
```

### 6.3 Calendar Integration

**Repo: Salonpro/frontend**

**File: src/components/calendar/EthiopianCalendar.tsx**
**Purpose:** Ethiopian calendar support
**Implementation:**

```typescript
interface EthiopianDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

const ethiopianMonths = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
];

const EthiopianCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<EthiopianDate | null>(null);
  const [showGregorian, setShowGregorian] = useState(false);

  const convertToEthiopian = (gregorianDate: Date): EthiopianDate => {
    // Ethiopian calendar conversion logic
    // This is a simplified conversion - actual implementation would be more complex
    const yearOffset = 8; // Ethiopian calendar is ~8 years behind
    return {
      day: gregorianDate.getDate(),
      month: gregorianDate.getMonth() + 1,
      year: gregorianDate.getFullYear() - yearOffset,
      monthName: ethiopianMonths[gregorianDate.getMonth()]
    };
  };

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={showGregorian}
            onChange={(e) => setShowGregorian(e.target.checked)}
          />
        }
        label="Show Gregorian Calendar"
      />

      {!showGregorian ? (
        <Calendar
          view="month"
          locale="am-ET"
          customDateRenderer={EthiopianDateRenderer}
        />
      ) : (
        <Calendar
          view="month"
          locale="en-US"
        />
      )}
    </Box>
  )
};
```

### 6.4 Mobile App Interface

**Repo: Salonpro/frontend**

**File: src/components/mobile/MobileLayout.tsx**
**Purpose:** Mobile-optimized layout
**Implementation:**

```typescript
const MobileLayout: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="fixed" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SalonPro
          </Typography>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <Avatar sx={{ width: 32, height: 32 }}>
            <UserIcon />
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, pt: 8, pb: 7, overflow: 'auto' }}>
        <Routes>
          <Route path="/dashboard" element={<MobileDashboard />} />
          <Route path="/appointments" element={<MobileAppointments />} />
          <Route path="/services" element={<MobileServices />} />
          <Route path="/profile" element={<MobileProfile />} />
        </Routes>
      </Box>

      {/* Bottom Navigation */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation value={value} onChange={handleChange}>
          <BottomNavigationAction label="Home" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Bookings" icon={<CalendarIcon />} />
          <BottomNavigationAction label="Services" icon={<ServiceIcon />} />
          <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
};
```

### 6.5 Notification System

**Repo: Salonpro/backend**

**File: apps/notifications/models.py**
**Purpose:** Notification management
**Implementation:**

```python
class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('appointment_reminder', 'Appointment Reminder'),
        ('booking_confirmation', 'Booking Confirmation'),
        ('payment_received', 'Payment Received'),
        ('staff_message', 'Staff Message'),
        ('promotion', 'Promotion'),
        ('system_update', 'System Update')
    ]

    recipient = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    data = models.JSONField(default=dict)  # Additional data
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)

class EmailNotification(models.Model):
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE)
    to_email = models.EmailField()
    subject = models.CharField(max_length=200)
    body = models.TextField()
    sent_at = models.DateTimeField(null=True, blank=True)
    delivery_status = models.CharField(max_length=20, default='pending')

class SMSNotification(models.Model):
    notification = models.OneToOneField(Notification, on_delete=models.CASCADE)
    to_phone = models.CharField(max_length=20)
    message = models.TextField()
    sent_at = models.DateTimeField(null=True, blank=True)
    delivery_status = models.CharField(max_length=20, default='pending')
```

**File: apps/notifications/services.py**
**Purpose:** Notification delivery services
**Implementation:**

```python
from django.core.mail import send_mail
from django.conf import settings
import requests

class NotificationService:
    def send_appointment_reminder(self, appointment):
        """Send appointment reminder notification"""
        notification = Notification.objects.create(
            recipient=appointment.client,
            notification_type='appointment_reminder',
            title='Appointment Reminder',
            message=f'Your appointment at {appointment.salon.name} is scheduled for {appointment.start_time}',
            data={'appointment_id': appointment.id}
        )

        # Send email
        self._send_email_notification(notification, appointment.client.email)

        # Send SMS if Ethiopian phone number
        if appointment.client.phone_number.startswith('+251'):
            self._send_sms_notification(notification, appointment.client.phone_number)

    def _send_email_notification(self, notification, email):
        """Send email notification"""
        EmailNotification.objects.create(
            notification=notification,
            to_email=email,
            subject=notification.title,
            body=notification.message
        )
        # Actual email sending logic here

    def _send_sms_notification(self, notification, phone):
        """Send SMS notification (Ethiopian SMS service)"""
        SMSNotification.objects.create(
            notification=notification,
            to_phone=phone,
            message=notification.message
        )
        # Integration with Ethiopian SMS service like ethio-telecom
```

**Repo: Salonpro/frontend**

**File: src/components/notifications/NotificationCenter.tsx**
**Purpose:** Notification interface
**Implementation:**

- Real-time notification updates via WebSocket
- Notification list with mark as read functionality
- Push notification support (PWA)
- Notification preferences management
- Sound and vibration options

### 6.6 Accessibility Enhancements

**Repo: Salonpro/frontend**

**File: src/components/common/Accessibility.tsx**
**Purpose:** Accessibility features
**Implementation:**

```typescript
const AccessibilityProvider: React.FC = () => {
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);

  return (
    <Box>
      {/* Font size controls */}
      <FormControl component="fieldset">
        <FormLabel component="legend">Text Size</FormLabel>
        <RadioGroup
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <FormControlLabel value="small" control={<Radio />} label="Small" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="large" control={<Radio />} label="Large" />
        </RadioGroup>
      </FormControl>

      {/* High contrast mode */}
      <FormControlLabel
        control={
          <Switch
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
          />
        }
        label="High Contrast"
      />

      {/* Screen reader optimizations */}
      <Button
        variant="outlined"
        onClick={() => setScreenReaderMode(!screenReaderMode)}
        startIcon={<AccessibilityIcon />}
      >
        {screenReaderMode ? 'Disable' : 'Enable'} Screen Reader Mode
      </Button>
    </Box>
  )
};
```

### 6.7 Progressive Web App (PWA)

**Repo: Salonpro/frontend**

**File: public/manifest.json**
**Purpose:** PWA configuration
**Implementation:**

```json
{
  "name": "SalonPro - Ethiopian Salon Management",
  "short_name": "SalonPro",
  "description": "Complete salon management platform for Ethiopian salons",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**File: public/sw.js**
**Purpose:** Service worker for offline functionality
**Implementation:**

```javascript
const CACHE_NAME = 'salonpro-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

### 6.8 Performance Optimization

**Repo: Salonpro/frontend**

**File: src/utils/performance.ts**
**Purpose:** Performance optimization utilities
**Implementation:**

```typescript
// Lazy loading for heavy components
const LazyDashboard = lazy(() => import('../components/dashboard/DashboardLayout'));
const LazyAnalytics = lazy(() => import('../components/analytics/Analytics'));

// Image optimization
const optimizeImage = (url: string, width: number, quality: number = 80) => {
  return `${url}?w=${width}&q=${quality}&format=webp`;
};

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable: React.FC = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {/* Render row content */}
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </List>
  );
};

// Code splitting and bundle optimization
const loadComponent = (componentName: string) => {
  return import(`../components/${componentName}`).then(module => module.default);
};
```

**Performance Features:**

- Code splitting for better initial load time
- Image optimization and lazy loading
- Virtual scrolling for large data sets
- Service worker for offline support
- Bundle size optimization
- Caching strategies
- Performance monitoring

---

## Phase 7 - Database & Infrastructure Setup (Week 12)

### 7.1 Docker Configuration

**Repo: Salonpro**

**File: docker-compose.yml**
**Purpose:** Complete application orchestration (Docker Compose v2)
**Implementation:**

```yaml
name: salonpro
services:
  # PostgreSQL Database
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: salonpro
      POSTGRES_USER: salonpro_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U salonpro_user -d salonpro"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis for caching and sessions
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # Django Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DEBUG=False
      - DATABASE_URL=postgresql://salonpro_user:${DB_PASSWORD}@db:5432/salonpro
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
      - ALLOWED_HOSTS=localhost,127.0.0.1,${DOMAIN}
    volumes:
      - ./backend:/app
      - static_volume:/app/static
      - media_volume:/app/media
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: >
      sh -c "python manage.py migrate &&
             python manage.py collectstatic --noinput &&
             gunicorn salonpro.wsgi:application --bind 0.0.0.0:8000"

  # React Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - REACT_APP_API_URL=http://localhost:8000
        - REACT_APP_WS_URL=ws://localhost:8000
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: npm start

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - backend
      - frontend

  # Celery Worker for background tasks
  celery:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://salonpro_user:${DB_PASSWORD}@db:5432/salonpro
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis
    command: celery -A salonpro worker -l info

  # Celery Beat for scheduled tasks
  celery-beat:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://salonpro_user:${DB_PASSWORD}@db:5432/salonpro
      - REDIS_URL=redis://redis:6379/0
    volumes:
      - ./backend:/app
    depends_on:
      - db
      - redis
    command: celery -A salonpro beat -l info

volumes:
  postgres_data:
  redis_data:
  static_volume:
  media_volume:
```

**File: backend/Dockerfile**
**Purpose:** Django backend container
**Implementation:**

```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
        gettext \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . /app/

# Create static files directory
RUN mkdir -p /app/static /app/media

# Expose port
EXPOSE 8000

# Run the application
CMD ["gunicorn", "salonpro.wsgi:application", "--bind", "0.0.0.0:8000"]
```

**File: frontend/Dockerfile**
**Purpose:** React frontend container
**Implementation:**

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
ARG REACT_APP_API_URL
ARG REACT_APP_WS_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WS_URL=$REACT_APP_WS_URL

RUN npm run build

# Use nginx for production
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.2 PostgreSQL Database Setup

**Repo: Salonpro/backend**

**File: database/init.sql**
**Purpose:** Initial database setup
**Implementation:**

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For geographic features
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For text search

-- Create indexes for performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_salon_start_time
ON appointments(salon_id, start_time);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_appointments_staff_start_time
ON appointments(staff_id, start_time);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_payments_status_created
ON payments(status, created_at);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email_type
ON authentication_customuser(email, user_type);

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_services_search
ON services USING gin(to_tsvector('english', name || ' ' || description));

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_salons_search
ON salons USING gin(to_tsvector('english', name || ' ' || description));
```

**File: apps/core/middleware.py**
**Purpose:** Database connection optimization
**Implementation:**

```python
from django.db import connection
from django.conf import settings

class DatabaseHealthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check database connection health
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
        except Exception as e:
            # Log database connection error
            logger.error(f"Database connection error: {e}")
            return JsonResponse(
                {"error": "Service temporarily unavailable"},
                status=503
            )

        response = self.get_response(request)

        # Log slow queries
        if len(connection.queries) > 50:  # More than 50 queries in a request
            logger.warning(f"Slow query detected: {len(connection.queries)} queries")

        return response
```

### 7.3 Environment Configuration

**Repo: Salonpro**

**File: .env.example**
**Purpose:** Environment variables template
**Implementation:**

```bash
# Database Configuration
DB_NAME=salonpro
DB_USER=salonpro_user
DB_PASSWORD=your_secure_password_here
DB_HOST=localhost
DB_PORT=5432

# Django Configuration
SECRET_KEY=your-secret-key-here-make-it-long-and-random
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=info@salonpro.com

# Payment Gateway Configuration (2025 APIs)
CHAPA_SECRET_KEY=CHASECK-xxxxxxxxxxxxxxxxxxxx
CHAPA_WEBHOOK_SECRET=your-chapa-webhook-secret-hmac

# Telebirr API v2.0 Configuration
TELEBIRR_APP_ID=your-telebirr-app-id
TELEBIRR_APP_KEY=your-telebirr-app-key
TELEBIRR_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----
TELEBIRR_SHORT_CODE=your-telebirr-short-code

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Upload Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=salonpro-uploads

# SMS Configuration (Ethiopian SMS Service)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=SalonPro

# Security
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True

# Domain Configuration
DOMAIN=yourdomain.com
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

### 7.4 Backup and Recovery Strategy

**Repo: Salonpro/backend**

**File: apps/core/backup.py**
**Purpose:** Automated backup system
**Implementation:**

```python
import subprocess
import os
from datetime import datetime
from django.conf import settings
import boto3

class BackupManager:
    def __init__(self):
        self.s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY
        )

    def create_database_backup(self):
        """Create database backup and upload to S3"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f"salonpro_backup_{timestamp}.sql"
        backup_path = f"/tmp/{backup_filename}"

        # Create database dump
        command = [
            'pg_dump',
            f'postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}',
            '--no-password',
            '--verbose',
            '--clean',
            '--no-acl',
            '--no-owner'
        ]

        with open(backup_path, 'w') as backup_file:
            subprocess.run(command, stdout=backup_file, check=True)

        # Upload to S3
        self.s3_client.upload_file(
            backup_path,
            settings.AWS_STORAGE_BUCKET_NAME,
            f"backups/database/{backup_filename}"
        )

        # Clean up local file
        os.remove(backup_path)

        return backup_filename

    def create_media_backup(self):
        """Create backup of media files"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')

        # Sync media files to S3
        command = [
            'aws', 's3', 'sync',
            settings.MEDIA_ROOT,
            f's3://{settings.AWS_STORAGE_BUCKET_NAME}/backups/media/{timestamp}/'
        ]

        subprocess.run(command, check=True)
        return f"media_backup_{timestamp}"

    def restore_database(self, backup_filename):
        """Restore database from backup"""
        backup_path = f"/tmp/{backup_filename}"

        # Download backup from S3
        self.s3_client.download_file(
            settings.AWS_STORAGE_BUCKET_NAME,
            f"backups/database/{backup_filename}",
            backup_path
        )

        # Restore database
        command = [
            'psql',
            f'postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}',
            '--file', backup_path
        ]

        subprocess.run(command, check=True)
        os.remove(backup_path)
```

**File: apps/core/tasks.py**
**Purpose:** Scheduled backup tasks
**Implementation:**

```python
from celery import shared_task
from .backup import BackupManager

@shared_task
def daily_backup():
    """Perform daily database backup"""
    backup_manager = BackupManager()
    backup_filename = backup_manager.create_database_backup()
    return f"Database backup created: {backup_filename}"

@shared_task
def weekly_media_backup():
    """Perform weekly media backup"""
    backup_manager = BackupManager()
    backup_name = backup_manager.create_media_backup()
    return f"Media backup created: {backup_name}"

@shared_task
def cleanup_old_backups():
    """Clean up backups older than 30 days"""
    # Implementation to clean up old backups from S3
    pass
```

### 7.5 Monitoring and Logging

**Repo: Salonpro/backend**

**File: apps/core/logging.py**
**Purpose:** Centralized logging configuration
**Implementation:**

```python
import logging
import sys
from datetime import datetime

class SalonProLogger:
    def __init__(self):
        self.logger = logging.getLogger('salonpro')
        self.setup_logger()

    def setup_logger(self):
        """Setup logger with formatters and handlers"""
        formatter = logging.Formatter(
            '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        )

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)

        # File handler for error logs
        error_handler = logging.FileHandler('logs/errors.log')
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(formatter)
        self.logger.addHandler(error_handler)

        # File handler for audit logs
        audit_handler = logging.FileHandler('logs/audit.log')
        audit_handler.setFormatter(formatter)
        self.logger.addHandler(audit_handler)

        self.logger.setLevel(logging.INFO)

    def log_user_action(self, user, action, details=None):
        """Log user actions for audit trail"""
        log_data = {
            'user_id': user.id,
            'user_email': user.email,
            'action': action,
            'details': details,
            'timestamp': datetime.now().isoformat()
        }
        self.logger.info(f"AUDIT: {log_data}")

    def log_error(self, error, context=None):
        """Log application errors"""
        self.logger.error(f"ERROR: {error}", exc_info=True, extra={'context': context})
```

**File: docker-compose.monitoring.yml**
**Purpose:** Monitoring services stack
**Implementation:**

```yaml
version: '3.8'

services:
  # Prometheus for metrics collection
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  # Grafana for visualization
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards

  # Redis Commander for Redis monitoring
  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis

volumes:
  prometheus_data:
  grafana_data:
```

### 7.6 Production Deployment Configuration

**Repo: Salonpro**

**File: nginx/nginx.conf**
**Purpose:** Nginx configuration for production
**Implementation:**

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    server {
        listen 80;
        server_name yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login endpoint with stricter rate limiting
        location /api/auth/login/ {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files
        location /static/ {
            alias /var/www/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Media files
        location /media/ {
            alias /var/www/media/;
            expires 1y;
            add_header Cache-Control "public";
        }

        # WebSocket for real-time features
        location /ws/ {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 7.7 Health Checks and Monitoring

**Repo: Salonpro/backend**

**File: apps/core/views.py**
**Purpose:** Health check endpoints
**Implementation:**

```python
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache
import redis

def health_check(request):
    """Comprehensive health check endpoint"""
    health_status = {
        'status': 'healthy',
        'timestamp': timezone.now().isoformat(),
        'services': {}
    }

    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        health_status['services']['database'] = 'healthy'
    except Exception as e:
        health_status['services']['database'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # Check Redis
    try:
        cache.set('health_check', 'ok', 10)
        cache.get('health_check')
        health_status['services']['redis'] = 'healthy'
    except Exception as e:
        health_status['services']['redis'] = f'unhealthy: {str(e)}'
        health_status['status'] = 'unhealthy'

    # Check external services
    try:
        # Check Chapa API (if configured)
        if settings.CHAPA_SECRET_KEY:
            # Make a test request to Chapa
            health_status['services']['chapa'] = 'healthy'

        # Check SMS service (if configured)
        if settings.SMS_API_KEY:
            health_status['services']['sms'] = 'healthy'

    except Exception as e:
        health_status['services']['external'] = f'unhealthy: {str(e)}'

    status_code = 200 if health_status['status'] == 'healthy' else 503
    return JsonResponse(health_status, status=status_code)
```

---

## Phase 8 - Platform Admin Panel (Week 12 continued)

### 8.1 Django Admin Customization

**Repo: Salonpro/backend**

**File: apps/salons/admin.py**
**Purpose:** Enhanced Django admin for salon management
**Implementation:**

```python
from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.http import HttpResponseRedirect
from .models import Salon, Branch, Staff

@admin.register(Salon)
class SalonAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'owner', 'salon_type', 'city',
        'is_active', 'commission_rate', 'created_at',
        'quick_actions'
    ]
    list_filter = ['salon_type', 'is_active', 'created_at', 'city']
    search_fields = ['name', 'owner__email', 'description']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'owner', 'logo')
        }),
        ('Contact Details', {
            'fields': ('phone', 'email', 'address', 'city', 'country')
        }),
        ('Business Details', {
            'fields': ('salon_type', 'size', 'commission_rate')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        })
    )

    def quick_actions(self, obj):
        """Quick action buttons for each salon"""
        actions = []

        # View salon details
        detail_url = reverse('admin:salons_salon_change', args=[obj.id])
        actions.append(f'<a class="button" href="{detail_url}">View</a>')

        # View salon analytics
        analytics_url = reverse('admin:salon_analytics', args=[obj.id])
        actions.append(f'<a class="button" href="{analytics_url}">Analytics</a>')

        # Suspend/Activate salon
        if obj.is_active:
            actions.append(f'<a class="button" href="{reverse("admin:suspend_salon", args=[obj.id])}">Suspend</a>')
        else:
            actions.append(f'<a class="button" href="{reverse("admin:activate_salon", args=[obj.id])}">Activate</a>')

        return format_html(' '.join(actions))

    quick_actions.short_description = 'Actions'

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path('<int:salon_id>/analytics/', self.admin_site.admin_view(self.salon_analytics), name='salon_analytics'),
            path('<int:salon_id>/suspend/', self.admin_site.admin_view(self.suspend_salon), name='suspend_salon'),
            path('<int:salon_id>/activate/', self.admin_site.admin_view(self.activate_salon), name='activate_salon'),
        ]
        return custom_urls + urls

    def salon_analytics(self, request, salon_id):
        """Display salon-specific analytics in admin"""
        salon = get_object_or_404(Salon, pk=salon_id)
        # Analytics logic here
        context = {
            **self.admin_site.each_context(request),
            'salon': salon,
            'analytics': self.get_salon_analytics(salon),
            'title': f'Analytics - {salon.name}'
        }
        return TemplateResponse(request, 'admin/salon_analytics.html', context)

    def suspend_salon(self, request, salon_id):
        """Suspend a salon"""
        salon = get_object_or_404(Salon, pk=salon_id)
        salon.is_active = False
        salon.save()
        self.message_user(request, f'Salon {salon.name} has been suspended.')
        return HttpResponseRedirect(reverse('admin:salons_salon_changelist'))

    def activate_salon(self, request, salon_id):
        """Activate a suspended salon"""
        salon = get_object_or_404(Salon, pk=salon_id)
        salon.is_active = True
        salon.save()
        self.message_user(request, f'Salon {salon.name} has been activated.')
        return HttpResponseRedirect(reverse('admin:salons_salon_changelist'))
```

**File: apps/payments/admin.py**
**Purpose:** Payment and commission management in admin
**Implementation:**

```python
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'transaction_id', 'appointment', 'amount',
        'payment_method', 'status', 'created_at',
        'view_appointment'
    ]
    list_filter = ['payment_method', 'status', 'created_at']
    search_fields = ['transaction_id', 'appointment__client__email']
    readonly_fields = ['transaction_id', 'created_at', 'updated_at']

    actions = ['mark_as_completed', 'process_refund', 'export_to_csv']

    def mark_as_completed(self, request, queryset):
        """Mark selected payments as completed"""
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} payments marked as completed.')

    def process_refund(self, request, queryset):
        """Process refunds for selected payments"""
        for payment in queryset:
            if payment.status == 'completed':
                # Refund logic here
                payment.status = 'refunded'
                payment.save()
        self.message_user(request, f'Refunds processed for {queryset.count()} payments.')

@admin.register(Commission)
class CommissionAdmin(admin.ModelAdmin):
    list_display = [
        'payment', 'recipient', 'commission_type',
        'amount', 'percentage', 'status', 'created_at'
    ]
    list_filter = ['commission_type', 'status', 'created_at']
    search_fields = ['recipient__email', 'payment__transaction_id']

    actions = ['mark_as_settled', 'generate_settlement_report']
```

### 8.2 Platform Analytics Dashboard

**Repo: Salonpro/backend**

**File: apps/admin\_panel/views.py**
**Purpose:** Platform administrator dashboard
**Implementation:**

```python
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count, Sum, Avg
from datetime import datetime, timedelta
from django.utils import timezone

@staff_member_required
def admin_dashboard(request):
    """Main platform administrator dashboard"""

    # Time periods for comparison
    today = timezone.now().date()
    last_month = today - timedelta(days=30)
    two_months_ago = today - timedelta(days=60)

    # Salon statistics
    total_salons = Salon.objects.count()
    active_salons = Salon.objects.filter(is_active=True).count()
    new_salons_this_month = Salon.objects.filter(created_at__gte=last_month).count()
    salon_growth = calculate_growth_rate(Salon, 'created_at', last_month, two_months_ago)

    # User statistics
    total_users = CustomUser.objects.count()
    users_by_type = CustomUser.objects.values('user_type').annotate(count=Count('id'))
    new_users_this_month = CustomUser.objects.filter(date_joined__gte=last_month).count()

    # Revenue statistics
    total_platform_revenue = Commission.objects.filter(
        commission_type='platform',
        created_at__gte=last_month
    ).aggregate(total=Sum('amount'))['total'] or 0

    revenue_this_month = Commission.objects.filter(
        commission_type='platform',
        created_at__gte=last_month
    ).aggregate(total=Sum('amount'))['total'] or 0

    revenue_last_month = Commission.objects.filter(
        commission_type='platform',
        created_at__gte=two_months_ago,
        created_at__lt=last_month
    ).aggregate(total=Sum('amount'))['total'] or 0

    revenue_growth = calculate_growth_percentage(revenue_this_month, revenue_last_month)

    # Appointment statistics
    total_appointments = Appointment.objects.count()
    appointments_this_month = Appointment.objects.filter(
        created_at__gte=last_month
    ).count()

    completed_appointments = Appointment.objects.filter(
        status='completed',
        created_at__gte=last_month
    ).count()

    # Top performing salons
    top_salons = Salon.objects.filter(
        is_active=True
    ).annotate(
        total_revenue=Sum('appointments__payments__amount'),
        appointment_count=Count('appointments')
    ).order_by('-total_revenue')[:10]

    # Geographic distribution
    salons_by_city = Salon.objects.values('city').annotate(
        count=Count('id')
    ).order_by('-count')[:10]

    # Payment method distribution
    payment_methods = Payment.objects.values('payment_method').annotate(
        count=Count('id'),
        total_amount=Sum('amount')
    ).order_by('-count')

    context = {
        'title': 'Platform Dashboard',

        # Salon metrics
        'total_salons': total_salons,
        'active_salons': active_salons,
        'new_salons_this_month': new_salons_this_month,
        'salon_growth': salon_growth,

        # User metrics
        'total_users': total_users,
        'users_by_type': users_by_type,
        'new_users_this_month': new_users_this_month,

        # Revenue metrics
        'total_platform_revenue': total_platform_revenue,
        'revenue_this_month': revenue_this_month,
        'revenue_growth': revenue_growth,

        # Appointment metrics
        'total_appointments': total_appointments,
        'appointments_this_month': appointments_this_month,
        'completed_appointments': completed_appointments,
        'completion_rate': (completed_appointments / appointments_this_month * 100) if appointments_this_month > 0 else 0,

        # Top performers
        'top_salons': top_salons,
        'salons_by_city': salons_by_city,
        'payment_methods': payment_methods,

        # Recent activity
        'recent_salons': Salon.objects.order_by('-created_at')[:5],
        'recent_payments': Payment.objects.order_by('-created_at')[:10],
    }

    return render(request, 'admin/dashboard.html', context)

@staff_member_required
def commission_management(request):
    """Commission rate management"""

    if request.method == 'POST':
        # Update global commission rate
        new_rate = request.POST.get('commission_rate')
        if new_rate:
            # Update commission rate for all salons
            Salon.objects.all().update(commission_rate=new_rate)
            messages.success(request, f'Commission rate updated to {new_rate}% for all salons.')
            return redirect('admin:commission_management')

    # Current commission statistics
    current_rate = Salon.objects.aggregate(
        avg_rate=Avg('commission_rate')
    )['avg_rate'] or 0

    commission_by_rate = Salon.objects.values('commission_rate').annotate(
        count=Count('id')
    ).order_by('commission_rate')

    context = {
        'title': 'Commission Management',
        'current_rate': current_rate,
        'commission_by_rate': commission_by_rate,
        'total_monthly_commission': calculate_monthly_commission(),
    }

    return render(request, 'admin/commission_management.html', context)

@staff_member_required
def salon_approval_queue(request):
    """Salon approval and verification queue"""

    pending_salons = Salon.objects.filter(is_active=False, created_at__gte=timezone.now() - timedelta(days=7))

    context = {
        'title': 'Salon Approval Queue',
        'pending_salons': pending_salons,
    }

    return render(request, 'admin/salon_approval.html', context)
```

### 8.3 Admin Panel Templates

**Repo: Salonpro/backend**

**File: templates/admin/dashboard.html**
**Purpose:** Platform admin dashboard template
**Implementation:**

```html
{% extends "admin/base_site.html" %}
{% load static %}

{% block content %}
<div class="dashboard-container">
    <h1>Platform Administration Dashboard</h1>

    <!-- Key Metrics -->
    <div class="metrics-grid">
        <div class="metric-card">
            <h3>Total Salons</h3>
            <div class="metric-value">{{ total_salons }}</div>
            <div class="metric-change positive">+{{ new_salons_this_month }} this month</div>
        </div>

        <div class="metric-card">
            <h3>Platform Revenue</h3>
            <div class="metric-value">ETB {{ total_platform_revenue|floatformat:2 }}</div>
            <div class="metric-change {% if revenue_growth > 0 %}positive{% else %}negative{% endif %}">
                {{ revenue_growth|floatformat:1 }}% growth
            </div>
        </div>

        <div class="metric-card">
            <h3>Total Users</h3>
            <div class="metric-value">{{ total_users }}</div>
            <div class="metric-change positive">+{{ new_users_this_month }} this month</div>
        </div>

        <div class="metric-card">
            <h3>Completion Rate</h3>
            <div class="metric-value">{{ completion_rate|floatformat:1 }}%</div>
            <div class="metric-change">{{ completed_appointments }}/{{ appointments_this_month }} completed</div>
        </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-section">
        <div class="chart-container">
            <h3>Revenue Trends</h3>
            <canvas id="revenueChart"></canvas>
        </div>

        <div class="chart-container">
            <h3>Salon Distribution by City</h3>
            <canvas id="cityChart"></canvas>
        </div>
    </div>

    <!-- Tables Section -->
    <div class="tables-section">
        <div class="table-container">
            <h3>Top Performing Salons</h3>
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Salon Name</th>
                        <th>Owner</th>
                        <th>Revenue</th>
                        <th>Appointments</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {% for salon in top_salons %}
                    <tr>
                        <td>{{ salon.name }}</td>
                        <td>{{ salon.owner.email }}</td>
                        <td>ETB {{ salon.total_revenue|floatformat:2 }}</td>
                        <td>{{ salon.appointment_count }}</td>
                        <td>
                            <a href="/admin/salons/salon/{{ salon.id }}/change/" class="button">View</a>
                            <a href="/admin/salons/salon/{{ salon.id }}/analytics/" class="button">Analytics</a>
                        </td>
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>

        <div class="table-container">
            <h3>Recent Activity</h3>
            <div class="activity-feed">
                {% for payment in recent_payments %}
                <div class="activity-item">
                    <div class="activity-icon">💰</div>
                    <div class="activity-content">
                        <strong>{{ payment.get_payment_method_display }}</strong> -
                        ETB {{ payment.amount }}
                        <div class="activity-time">{{ payment.created_at|timesince }} ago</div>
                    </div>
                </div>
                {% endfor %}
            </div>
        </div>
    </div>
</div>

<script>
// Chart.js implementation for dashboard charts
const revenueCtx = document.getElementById('revenueChart').getContext('2d');
new Chart(revenueCtx, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Platform Revenue',
            data: [120000, 150000, 180000, 200000, 220000, 250000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return 'ETB ' + value.toLocaleString();
                    }
                }
            }
        }
    }
});

const cityCtx = document.getElementById('cityChart').getContext('2d');
new Chart(cityCtx, {
    type: 'doughnut',
    data: {
        labels: [{% for city in salons_by_city %}'{{ city.city }}'{% if not forloop.last %},{% endif %}{% endfor %}],
        datasets: [{
            data: [{% for city in salons_by_city %}{{ city.count }}{% if not forloop.last %},{% endif %}{% endfor %}],
            backgroundColor: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444']
        }]
    }
});
</script>

<style>
.dashboard-container {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.metric-card {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border-left: 4px solid #6366f1;
}

.metric-value {
    font-size: 2rem;
    font-weight: bold;
    color: #333;
    margin: 10px 0;
}

.metric-change {
    font-size: 0.9rem;
}

.metric-change.positive {
    color: #10b981;
}

.metric-change.negative {
    color: #ef4444;
}

.charts-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 40px;
}

.chart-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.tables-section {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}

.table-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.admin-table {
    width: 100%;
    border-collapse: collapse;
}

.admin-table th,
.admin-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
}

.admin-table th {
    background-color: #f9fafb;
    font-weight: 600;
}

.button {
    background: #6366f1;
    color: white;
    padding: 6px 12px;
    border-radius: 4px;
    text-decoration: none;
    font-size: 0.875rem;
    margin-right: 8px;
}

.button:hover {
    background: #4f46e5;
}

.activity-feed {
    max-height: 400px;
    overflow-y: auto;
}

.activity-item {
    display: flex;
    align-items: flex-start;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
}

.activity-icon {
    font-size: 1.5rem;
    margin-right: 12px;
}

.activity-content {
    flex: 1;
}

.activity-time {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 4px;
}
</style>
{% endblock %}
```

### 8.4 System Configuration Management

**Repo: Salonpro/backend**

**File: apps/admin\_panel/views.py**
**Purpose:** System configuration interface
**Implementation:**

```python
@staff_member_required
def system_settings(request):
    """System configuration management"""

    if request.method == 'POST':
        # Update system settings
        form = SystemSettingsForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'System settings updated successfully.')
            return redirect('admin:system_settings')
    else:
        form = SystemSettingsForm()

    context = {
        'title': 'System Settings',
        'form': form,
        'current_settings': get_system_settings(),
    }

    return render(request, 'admin/system_settings.html', context)

@staff_member_required
def user_management(request):
    """Advanced user management"""

    users = CustomUser.objects.all()

    # Filtering
    user_type = request.GET.get('user_type')
    if user_type:
        users = users.filter(user_type=user_type)

    status = request.GET.get('status')
    if status == 'active':
        users = users.filter(is_active=True)
    elif status == 'inactive':
        users = users.filter(is_active=False)

    # Search
    search_query = request.GET.get('search')
    if search_query:
        users = users.filter(
            Q(email__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query)
        )

    # Pagination
    paginator = Paginator(users, 50)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'title': 'User Management',
        'page_obj': page_obj,
        'user_types': CustomUser.USER_TYPE_CHOICES,
    }

    return render(request, 'admin/user_management.html', context)
```

### 8.5 Audit Trail and Compliance

**Repo: Salonpro/backend**

**File: apps/audit/models.py**
**Purpose:** Audit trail for compliance
**Implementation:**

```python
class AuditLog(models.Model):
    ACTION_TYPES = [
        ('create', 'Create'),
        ('update', 'Update'),
        ('delete', 'Delete'),
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('payment', 'Payment'),
        ('admin_action', 'Admin Action'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    resource_type = models.CharField(max_length=50)  # e.g., 'salon', 'appointment', 'payment'
    resource_id = models.CharField(max_length=50, blank=True)
    old_values = models.JSONField(default=dict)
    new_values = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['action_type', 'timestamp']),
            models.Index(fields=['resource_type', 'resource_id']),
        ]
```

**File: apps/admin\_panel/views.py**
**Purpose:** Compliance and audit reporting
**Implementation:**

```python
@staff_member_required
def audit_logs(request):
    """View and filter audit logs"""

    logs = AuditLog.objects.all()

    # Filtering
    action_type = request.GET.get('action_type')
    if action_type:
        logs = logs.filter(action_type=action_type)

    user_filter = request.GET.get('user')
    if user_filter:
        logs = logs.filter(user__email__icontains=user_filter)

    date_from = request.GET.get('date_from')
    date_to = request.GET.get('date_to')
    if date_from:
        logs = logs.filter(timestamp__gte=date_from)
    if date_to:
        logs = logs.filter(timestamp__lte=date_to)

    # Pagination
    paginator = Paginator(logs, 100)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'title': 'Audit Logs',
        'page_obj': page_obj,
        'action_types': AuditLog.ACTION_TYPES,
    }

    return render(request, 'admin/audit_logs.html', context)

@staff_member_required
def compliance_reports(request):
    """Generate compliance reports"""

    if request.method == 'POST':
        report_type = request.POST.get('report_type')
        date_from = request.POST.get('date_from')
        date_to = request.POST.get('date_to')

        if report_type == 'user_activity':
            report = generate_user_activity_report(date_from, date_to)
        elif report_type == 'financial_summary':
            report = generate_financial_summary_report(date_from, date_to)
        elif report_type == 'salon_compliance':
            report = generate_salon_compliance_report(date_from, date_to)

        return generate_pdf_report(report)

    context = {
        'title': 'Compliance Reports',
    }

    return render(request, 'admin/compliance_reports.html', context)
```

### 8.6 Manual Testing Checklist

**Repo: Salonpro**

**File: MANUAL\_TESTING.md**
**Purpose:** Comprehensive testing checklist
**Implementation:**

```markdown
# SalonPro Manual Testing Checklist

## Phase 1 - Authentication & Onboarding

### Registration Flows
- [ ] Salon admin registration creates both user and salon
- [ ] Client registration works correctly
- [ ] Staff invitation flow functions properly
- [ ] Email verification sent and received
- [ ] Google SSO integration works
- [ ] Password reset functionality
- [ ] Login with correct credentials
- [ ] Login validation for incorrect credentials

### Onboarding Wizard
- [ ] Multi-step form navigation works
- [ ] Progress saved to localStorage
- [ ] All onboarding data collected correctly
- [ ] Salon logo upload works
- [ ] Business hours configuration
- [ ] Service categories setup
- [ ] Staff invitation system

## Phase 2 - Core CRUD Operations

### Staff Management
- [ ] Add new staff member
- [ ] Edit existing staff details
- [ ] Assign roles and permissions
- [ ] Deactivate staff member
- [ ] Staff performance tracking
- [ ] Branch assignment

### Services Management
- [ ] Create new service category
- [ ] Add service with pricing
- [ ] Edit service details
- [ ] Assign staff to services
- [ ] Service scheduling

### Inventory Management
- [ ] Add inventory items
- [ ] Update stock levels
- [ ] Low stock alerts
- [ ] Usage tracking
- [ ] Supplier management

### Appointment System
- [ ] Create new appointment
- [ ] Check availability
- [ ] Reschedule appointment
- [ ] Cancel appointment
- [ ] Confirm appointment
- [ ] Mark appointment complete

## Phase 3 - Role-Based Dashboards

### Salon Admin Dashboard
- [ ] KPI cards display correctly
- [ ] Revenue charts load
- [ ] Recent appointments show
- [ ] Staff performance metrics
- [ ] Quick actions work
- [ ] Branch switching

### Stylist Dashboard
- [ ] Personal schedule view
- [ ] Performance metrics
- [ ] Client history
- [ ] Commission tracking
- [ ] Appointment start/complete

### Client Dashboard
- [ ] Quick booking interface
- [ ] Appointment history
- [ ] Favorite salons
- [ ] Review system
- [ ] Rebooking functionality

## Phase 4 - Payments & Commission

### Payment Processing
- [ ] Chapa payment integration
- [ ] Telebirr payment integration
- [ ] Cash payment recording
- [ ] Payment status updates
- [ ] Refund processing
- [ ] Payment receipts

### Commission System
- [ ] Commission calculation accuracy
- [ ] Platform commission (5%)
- [ ] Staff commission (50% of remaining)
- [ ] Salon commission (remainder)
- [ ] Commission tracking
- [ ] Settlement reports

## Phase 5 - Analytics & Reports

### Analytics Dashboard
- [ ] Revenue trends display
- [ ] Service performance charts
- [ ] Staff performance rankings
- [ ] Customer analytics
- [ ] Real-time updates
- [ ] Export functionality

### Report Generation
- [ ] Custom report builder
- [ ] PDF export works
- [ ] Excel export works
- [ ] Report templates
- [ ] Scheduled reports
- [ ] Email delivery

## Phase 6 - UI/UX & Localization

### Responsive Design
- [ ] Desktop layout works
- [ ] Tablet layout works
- [ ] Mobile layout works
- [ ] Touch interactions
- [ ] Offline functionality

### Localization
- [ ] English language works
- [ ] Amharic language works
- [ ] Language switching
- [ ] Ethiopian calendar
- [ ] Local date formats
- [ ] Currency formatting

## Phase 7 - Infrastructure

### Docker Environment
- [ ] All containers start correctly
- [ ] Database connects
- [ ] Redis connects
- [ ] Static files served
- [ ] Media files upload
- [ ] SSL configuration

### Performance
- [ ] Page load times < 3 seconds
- [ ] Database queries optimized
- [ ] File uploads work
- [ ] API responses fast
- [ ] Caching works

## Phase 8 - Admin Panel

### Django Admin
- [ ] Salon management interface
- [ ] User management
- [ ] Payment oversight
- [ ] Commission management
- [ ] System settings
- [ ] Audit logs

### Platform Dashboard
- [ ] Platform analytics display
- [ ] Salon approval queue
- [ ] Commission rate controls
- [ ] User statistics
- [ ] Revenue tracking
- [ ] Compliance reports

## Cross-Functional Testing

### Multi-Branch Support
- [ ] Branch creation works
- [ ] Staff assignment across branches
- [ ] Inventory management per branch
- [ ] Branch-specific analytics
- [ ] Inter-branch transfers

### Real-time Features
- [ ] WebSocket connections
- [ ] Live notifications
- [ ] Real-time booking updates
- [ ] Staff availability changes
- [ ] Appointment status updates

### Security Testing
- [ ] Authentication security
- [ ] Authorization checks
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting

### Data Integrity
- [ ] Database constraints
- [ ] Data validation
- [ ] Transaction handling
- [ ] Backup and restore
- [ ] Data consistency

## Performance Testing

### Load Testing
- [ ] 100 concurrent users
- [ ] 500 concurrent users
- [ ] Database performance under load
- [ ] Response times remain acceptable
- [ ] No memory leaks
- [ ] Error handling

### Stress Testing
- [ ] Peak traffic simulation
- [ ] Database connection limits
- [ ] File upload limits
- [ ] Email sending limits
- [ ] Payment gateway limits
- [ ] System recovery

## Security Testing

### Authentication Security
- [ ] Password strength requirements
- [ ] Account lockout mechanisms
- [ ] Session management
- [ ] Token expiration
- [ ] OAuth security
- [ ] Two-factor authentication

### Data Security
- [ ] Sensitive data encryption
- [ ] Secure file storage
- [ ] API authentication
- [ ] Data access controls
- [ ] Audit trail completeness
- [ ] Data retention policies
```

---

## Summary & Final Notes

### Implementation Success Criteria

**✅ Project Completion Checklist:**

- [ ] All 8 phases implemented according to specifications
- [ ] Multi-tenant architecture with shared schema
- [ ] Complete CRUD operations for all entities
- [ ] Role-based dashboards functioning
- [ ] Ethiopian payment systems integrated
- [ ] Analytics and reporting system working
- [ ] Mobile-responsive UI with localization
- [ ] Docker deployment configured
- [ ] Platform admin panel functional
- [ ] All security measures implemented
- [ ] Performance benchmarks met
- [ ] Comprehensive testing completed

### Technology Stack Summary (2025 Updated)

- **Backend:** Django 5.1+, PostgreSQL 15, Redis 7, Celery 5.4+
- **Frontend:** React 19, TypeScript 5.6+, Material-UI v6, Nivo charts
- **Infrastructure:** Docker Compose v2, Nginx/Traefik, AWS S3, Prometheus/Grafana
- **Payments:** Chapa API v1.1, Telebirr API v2.0 with RSA encryption
- **Authentication:** JWT + Google OAuth
- **Localization:** English/Amharic with Ethiopian calendar
- **Security:** django-environ, django-axes, webhook signature verification

### Key Architectural Decisions

1. **Multi-tenant shared schema** for scalability and analytics
2. **Microservices-ready monorepo** structure
3. **Event-driven architecture** with WebSocket support
4. **Docker containerization** for deployment consistency
5. **Comprehensive audit trail** for compliance

### Expected Outcomes

- Modern salon management platform tailored for Ethiopian market
- Scalable architecture supporting 1000+ salons
- Mobile-first responsive design
- Complete business analytics suite
- Secure payment processing
- Multi-language support

This comprehensive plan provides a complete roadmap for implementing SalonPro as a modern, scalable salon management platform specifically designed for the Ethiopian market while maintaining global scalability.

---

## 🚀 2025 Updates Applied

### **Technology Stack Updates**

- ✅ **Django 5.1+** (async ORM, better validation)
- ✅ **React 19** (stable release)
- ✅ **TypeScript 5.6+**
- ✅ **Material-UI v6**
- ✅ **Celery 5.4+**
- ✅ **Docker Compose v2** schema

### **Payment Gateway Updates**

- ✅ **Chapa API v1.1** integration with `tx_ref` requirement
- ✅ **Telebirr API v2.0** with RSA encryption
- ✅ **Webhook signature verification** for security
- ✅ **TLS 1.3** requirement for all payment APIs

### **Security Enhancements**

- ✅ **django-environ** for secure environment handling
- ✅ **django-axes** for rate limiting and protection
- ✅ **HMAC signature verification** for webhooks
- ✅ **PyCryptodome** for RSA encryption

### **Key Improvements Made**

1. **Updated all package versions** to 2025 standards
2. **Rewrote payment integrations** for latest Ethiopian APIs
3. **Added webhook security** with signature verification
4. **Enhanced error handling** and logging
5. **Added comprehensive testing checklist**
6. **Updated Docker configuration** for v2
7. **Modernized frontend dependencies** with Vite build system

The plan now reflects current 2025 best practices and the latest Ethiopian payment gateway requirements.
