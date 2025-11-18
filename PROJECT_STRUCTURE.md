# L.A.M.A. Pet Care Frontend - Project Structure

This document provides a comprehensive overview of the frontend project structure, explaining what each page does and the key functions/services used.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/            # Reusable React components
├── services/              # API service layer
├── interfaces/            # TypeScript type definitions
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── sections/              # Page sections/components
├── utils/                 # Utility functions
└── config/               # Configuration files
```

---

## 🏠 Pages Overview

### 1. **Home Page** (`/`)

**File:** `src/app/page.tsx`

**Purpose:** Landing page for the L.A.M.A. Pet Care platform

**Components Used:**

- `Hero` - Main hero section with call-to-action
- `Features` - Platform features showcase
- `Services` - Available services overview
- `CallToAction` - Final call-to-action section

**Functions:**

- Static page, no API calls
- Displays marketing content and platform information

---

### 2. **Authentication Pages**

#### **Login Page** (`/auth/login`)

**File:** `src/app/auth/login/page.tsx`

**Purpose:** User authentication (login)

**Components Used:**

- `LoginForm` - Login form component

**Services Used:**

- `authService.tsx` - `login()` function

**Functions:**

- Authenticates users (pet owners, caretakers, doctors)
- Stores JWT token in localStorage
- Redirects to appropriate dashboard based on user role

---

#### **Register Page** (`/auth/register`)

**File:** `src/app/auth/register/page.tsx`

**Purpose:** New user registration

**Components Used:**

- `RegisterForm` - Registration form component

**Services Used:**

- `authService.tsx` - `register()` function

**Functions:**

- Creates new user accounts
- Handles role-based registration (owner, caretaker, doctor)
- Redirects to login after successful registration

---

### 3. **Reservation Flow Pages**

#### **Reservation Selection** (`/reservation`)

**File:** `src/app/reservation/page.tsx`

**Purpose:** Initial reservation setup - mode and date selection

**Components Used:**

- `PetOwnerCardSection` - Displays pet owner information
- `ModeSelection` - Choose between "full-day" or "within-day" reservation
- `CalendarWithMode` - Date picker based on selected mode

**Context Used:**

- `ReservationSelectionContext` - Manages reservation state across the flow

**Functions:**

- `handleModeSelect()` - Sets reservation mode (full-day/within-day)
- `handleDateSelect()` - Captures selected dates
- `handleNext()` - Navigates to next step in reservation flow
- `canProceed()` - Validates if user can proceed to next step

**Navigation:**

- Full-day mode → `/reservation/book-full-day`
- Within-day mode → `/reservation/book`

---

#### **Book Page (Within-Day)** (`/reservation/book`)

**File:** `src/app/reservation/book/page.tsx` (wrapper)
**Client Component:** `src/app/reservation/book/BookClient.tsx`

**Purpose:** Complete booking for within-day reservations (single date)

**Services Used:**

- `serviceService.tsx`:
  - `getAvailableStaff()` - Fetches available staff (doctors/caretakers)
  - `getAvailableTimeSlots()` - Gets available time slots for selected date
  - `getStripeLink()` - Creates Stripe payment session
- `petservice.tsx`:
  - `getMyPets()` - Fetches user's pets for selection

**Functions:**

- `handlePayment()` - Creates booking payload and redirects to Stripe
- Fetches available staff based on service type (mservice/cservice)
- Fetches available time slots for selected date and staff
- Allows pet selection from user's pets
- Creates booking and redirects to Stripe payment

**Data Flow:**

1. User selects pet, service type, staff, and time slots
2. Creates `CreateBookingPayload` with reservation details
3. Calls `getStripeLink()` to create payment session
4. Redirects to Stripe for payment
5. After payment, redirects to success page

---

#### **Book Full-Day Page** (`/reservation/book-full-day`)

**File:** `src/app/reservation/book-full-day/page.tsx`

**Purpose:** Complete booking for full-day reservations (date range)

**Services Used:**

- Same as within-day booking page
- `serviceService.tsx` - Staff and time slot fetching
- `petservice.tsx` - Pet selection

**Functions:**

- Similar to within-day booking but handles date ranges
- Calculates total nights for pricing
- Handles start and end times for full-day services

---

#### **Select Staff Page** (`/reservation/select-staff`)

**File:** `src/app/reservation/select-staff/page.tsx`

**Purpose:** Staff selection interface (if separated from main booking flow)

**Services Used:**

- `serviceService.tsx` - `getAvailableStaff()`

**Functions:**

- Displays available staff members
- Filters by service type (doctor/caretaker)
- Allows staff selection

---

#### **Time Slots Page** (`/reservation/time-slots`)

**File:** `src/app/reservation/time-slots/page.tsx`

**Purpose:** Time slot selection interface

**Services Used:**

- `serviceService.tsx` - `getAvailableTimeSlots()`

**Functions:**

- Displays available time slots
- Allows multiple time slot selection
- Validates slot availability

---

#### **Reservation Success** (`/reservation/success`)

**File:** `src/app/reservation/success/page.tsx`

**Purpose:** Confirmation page after successful reservation and payment

**Components Used:**

- `SuccessClient` - Success page content

**Functions:**

- Displays reservation confirmation
- Shows booking details
- Provides navigation back to dashboard

---

### 4. **Reserve History Page** (`/reserve-history`)

**File:** `src/app/reserve-history/page.tsx`

**Purpose:** View and manage all user reservations

**Services Used:**

- `reservationService.tsx`:
  - `getAllReservation()` - Fetches all user's reservations
  - `updateReservationStatus()` - Updates reservation status (for staff/doctors)
- `paymentService.tsx`:
  - `getAllPayment()` - Fetches all payments to match with reservations

**Functions:**

- `fetchReservations()` - Loads all reservations
- `fetchPayments()` - Loads all payments
- `handleUpdateStatus()` - Updates reservation status (ongoing/wait/finish)
- `filteredReservations` - Filters by status (wait/ongoing/finished/all)
- `getPriceDisplay()` - Displays price from reservation or payment data

**Features:**

- Displays reservation ID, date, time, price, and status
- Status filtering tabs (Wait, Ongoing, Finished, All)
- Role-based status updates:
  - **Pet Owner**: View only (cannot change status)
  - **Caretaker/Doctor**: Can change status via dropdown

**Data Display:**

- Reservation ID (shortened)
- Reservation date
- Reservation time
- Service price (from reservation or payment)
- Status (with update capability for staff)

---

### 5. **Reviews Page** (`/reviews`)

**File:** `src/app/reviews/page.tsx`

**Purpose:** Review services (for owners) or view review summary (for caretakers)

**Services Used:**

- `reviewService.tsx`:
  - `getUnreviewedServices()` - Fetches finished services without reviews
  - `submitRating()` - Submits review (rating + comment)
  - `getStaffReviewSummary()` - Fetches caretaker's review summary
  - `getCaretakersForOwner()` - Gets list of caretakers for owner
- `profileService.tsx`:
  - `getProfile()` - Fetches user profile information

**Functions:**

**For Pet Owners:**

- `fetchServices()` - Loads unreviewed finished services
- `handleRatingChange()` - Updates rating for a service
- `handleCommentChange()` - Updates comment for a service
- `handleSubmit()` - Submits review to backend
- `fetchCaretakers()` - Loads caretaker information

**For Caretakers:**

- `fetchCaretakerReviews()` - Loads review summary
- Displays average rating, total reviews, and individual review items

**Features:**

- **Owner View:**

  - Lists finished `cservice` (caretaker services) that haven't been reviewed
  - Star rating input (1-5 stars)
  - Comment text area
  - Submit review button
  - Shows pet name, caretaker name, service date

- **Caretaker View:**
  - Displays review summary with:
    - Average rating
    - Total number of reviews
    - List of individual reviews with:
      - Rating
      - Comment
      - Date
      - Pet owner name

**Filtering:**

- Only shows `cservice` (caretaker services)
- Excludes `mservice` (medical services) - not reviewable
- Only shows services with status "finish"
- Excludes services that already have reviews

---

### 6. **Profile Page** (`/profile`)

**File:** `src/app/profile/page.tsx`

**Purpose:** User profile management and information display

**Components Used:**

- `TopProfile` - Profile header with avatar and basic info
- `BodyProfile` - Profile body with detailed information
  - `PersonalInfo` - Personal information section
  - `Animal` - Pet information section
  - `Display` - Display preferences

**Services Used:**

- `profileService.tsx`:
  - `getProfile()` - Fetches user profile
  - `updateProfile()` - Updates user profile
- `petservice.tsx`:
  - `getMyPets()` - Fetches user's pets
  - `createPet()` - Creates new pet
  - `updatePet()` - Updates pet information
  - `deletePet()` - Deletes pet

**Functions:**

- Displays user information
- Manages pet information (add, edit, delete)
- Updates personal information
- Handles profile image upload

---

### 7. **Admin Pages**

#### **Admin Dashboard** (`/admin`)

**File:** `src/app/admin/page.tsx`

**Purpose:** Main admin dashboard

**Components Used:**

- `AdminShell` - Admin layout wrapper

**Functions:**

- Central admin hub
- Navigation to admin sub-pages

---

#### **Admin Services** (`/admin/services`)

**File:** `src/app/admin/services/page.tsx`

**Purpose:** Manage all services in the system

**Services Used:**

- `adminService.tsx` - Service management functions
- `adminServiceApi.ts` - Service API calls

**Functions:**

- View all services
- Filter services by status
- Search services
- Edit service details (via `/admin/services/edit`)

---

#### **Admin Services Edit** (`/admin/services/edit`)

**File:** `src/app/admin/services/edit/page.tsx`

**Purpose:** Edit individual service details

**Functions:**

- Edit service information
- Update service status
- Modify service details

---

#### **Admin Users** (`/admin/users`)

**File:** `src/app/admin/users/page.tsx`

**Purpose:** Manage all users in the system

**Services Used:**

- `adminService.tsx` - User management functions
- `adminApi.tsx` - User API calls

**Functions:**

- View all users
- Filter users by role
- Search users
- Edit user details (via `/admin/users/edit`)

---

#### **Admin Users Edit** (`/admin/users/edit`)

**File:** `src/app/admin/users/edit/page.tsx`

**Purpose:** Edit individual user details

**Functions:**

- Edit user information
- Update user role
- Modify user permissions

---

## 🔧 Key Services

### **authService.tsx**

Authentication-related API calls:

- `login(email, password)` - User login
- `register(userData)` - User registration
- `logout()` - User logout

### **reservationService.tsx**

Reservation management:

- `getAllReservation()` - Fetch all reservations
- `getSinglePageReservation(page, limit)` - Fetch paginated reservations
- `updateReservationStatus(reservationId, newStatus)` - Update reservation status

### **serviceService.tsx**

Service and booking operations:

- `getAvailableStaff(params)` - Get available staff for booking
- `getAvailableTimeSlots(params)` - Get available time slots
- `getStripeLink(payload)` - Create Stripe payment session

### **paymentService.tsx**

Payment management:

- `getAllPayment()` - Fetch all payments
- `getSinglePagePayment(page, limit)` - Fetch paginated payments

### **reviewService.tsx**

Review operations:

- `getUnreviewedServices()` - Get services that need reviews
- `getReviewedServices()` - Get services with reviews
- `submitRating(review)` - Submit a review
- `getStaffReviewSummary(staffId)` - Get caretaker's review summary

### **profileService.tsx**

User profile operations:

- `getProfile()` - Fetch user profile
- `updateProfile(profileData)` - Update user profile

### **petservice.tsx**

Pet management:

- `getMyPets()` - Fetch user's pets
- `createPet(petData)` - Create new pet
- `updatePet(petId, petData)` - Update pet information
- `deletePet(petId)` - Delete pet

### **adminService.tsx** & **adminApi.tsx**

Admin operations:

- User management
- Service management
- System administration

---

## 🎯 Context Providers

### **ReservationSelectionContext**

**File:** `src/context/ReservationSelectionContext.tsx`

**Purpose:** Manages reservation selection state across the booking flow

**State:**

- `mode` - Reservation mode (full-day/within-day)
- `date` - Selected date (within-day)
- `startDate` / `endDate` - Date range (full-day)
- `serviceType` - Selected service type
- `petId` - Selected pet
- `staffId` - Selected staff
- `timeSlot` - Selected time slots

**Functions:**

- `updateSelection()` - Update reservation selection
- Persists selection across navigation

---

### **RoleContext**

**File:** `src/context/RoleContext.tsx`

**Purpose:** Manages user role and authentication state

**State:**

- User role (owner, caretaker, doctor, admin)
- Authentication status

---

## 🪝 Custom Hooks

### **useAuth**

**File:** `src/hooks/useAuth.ts`

**Purpose:** Authentication hook

**Returns:**

- `isAuthed` - Boolean indicating if user is authenticated
- `userRole` - Current user's role
- `userId` - Current user's ID

**Functions:**

- Checks localStorage for authentication token
- Validates authentication status
- Provides user role information

---

## 📦 Key Components

### **Header**

**File:** `src/components/Headers/Header.tsx`

**Purpose:** Main navigation header

**Features:**

- Navigation links
- User name display (styled)
- Logout functionality
- Role-based navigation items

---

### **Sidebar**

**File:** `src/components/Sidebar/Siderbar.tsx`

**Purpose:** Side navigation menu

**Features:**

- Role-based menu items
- Navigation links
- User information display

---

### **StarRating**

**File:** `src/components/StarRating.tsx`

**Purpose:** Star rating input component

**Used In:**

- Reviews page (rating input)

---

## 🔄 Data Flow

### **Reservation Flow:**

1. `/reservation` - Select mode and date
2. `/reservation/book` or `/reservation/book-full-day` - Select pet, staff, time slots
3. Create booking payload
4. Call `getStripeLink()` to create payment session
5. Redirect to Stripe
6. After payment → `/reservation/success`
7. View in `/reserve-history`

### **Review Flow:**

1. Service completes (status = "finish")
2. Appears in `/reviews` for owner
3. Owner submits review (rating + comment)
4. Review stored in backend
5. Caretaker can view review summary in `/reviews`

---

## 🎨 Styling

- **Framework:** Tailwind CSS
- **Color Scheme:** Green theme (#61C5AA, #3AB795)
- **Responsive:** Mobile-first design
- **Custom Scrollbars:** Styled scrollbars for lists

---

## 🔐 Authentication & Authorization

- **Token Storage:** localStorage
- **Token Field:** `token`
- **User ID Field:** `user_id`
- **Role Field:** `role`

**Role-Based Access:**

- **Pet Owner:** Can create reservations, view history, submit reviews
- **Caretaker:** Can view reservations, update status, view review summary
- **Doctor:** Can view reservations, update status
- **Admin:** Full system access

---

## 📝 Notes

- All API calls go through the service layer (Anti-Corruption Layer)
- Error handling is implemented at multiple levels (global, query, component)
- React Query is used for server-side data fetching and caching
- State management: React Context for app-wide state, useState/useReducer for component-local state
- API responses are validated using Zod schemas before use

---

## 🚀 Getting Started

See the main [README.md](./README.md) for setup instructions and development guidelines.
