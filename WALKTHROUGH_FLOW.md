# Walkthrough Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NEW USER REGISTRATION                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │   User Clicks Login   │
                          │   with Google OAuth   │
                          └───────────────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │  Google Auth Process  │
                          └───────────────────────┘
                                      │
                                      ▼
                          ┌───────────────────────┐
                          │  /auth/callback       │
                          │  Exchange Code        │
                          └───────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
        ┌────────────────────┐              ┌────────────────────┐
        │  Check Employee    │              │   Auth Failed?     │
        │  Record in DB      │              │                    │
        └────────────────────┘              └────────────────────┘
                    │                                   │
                    │                                   ▼
        ┌───────────┴──────────┐           ┌────────────────────┐
        │                      │           │ /auth/auth-code-   │
        ▼                      ▼           │      error         │
┌──────────────┐      ┌──────────────┐    └────────────────────┘
│ Has Company? │      │ No Company?  │
│    (YES)     │      │    (NO)      │
└──────────────┘      └──────────────┘
        │                      │
        ▼                      ▼
┌──────────────┐      ┌──────────────┐
│  /dashboard  │      │   /started   │
└──────────────┘      └──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WALKTHROUGH PROCESS                                │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    STEP 1 OF 3    │
                    │  Create Company   │
                    │                   │
                    │ Fields:           │
                    │ • Company Name    │
                    │ • Address         │
                    │ • Phone Number    │
                    └───────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌─────────────┐    ┌─────────────┐
            │   Submit    │    │    Skip     │
            └─────────────┘    └─────────────┘
                    │                   │
                    │                   │
                    │                   └──────────────┐
                    ▼                                  │
        ┌──────────────────────┐                      │
        │ Save to 'companies'  │                      │
        │ Store company_id     │                      │
        └──────────────────────┘                      │
                    │                                  │
                    ▼                                  │
                    ┌───────────────────┐              │
                    │    STEP 2 OF 3    │              │
                    │   Add Location    │              │
                    │                   │              │
                    │ Fields:           │              │
                    │ • Location Name   │              │
                    │ • Latitude        │              │
                    │ • Longitude       │              │
                    │ • Radius (meters) │              │
                    │                   │              │
                    │ [Get Current Loc] │              │
                    └───────────────────┘              │
                              │                        │
                    ┌─────────┴─────────┐              │
                    │                   │              │
                    ▼                   ▼              │
            ┌─────────────┐    ┌─────────────┐        │
            │   Submit    │    │    Back     │        │
            └─────────────┘    └─────────────┘        │
                    │                   │              │
                    │                   └──────┐       │
                    ▼                          │       │
        ┌──────────────────────┐               │       │
        │  Save to 'sites'     │               │       │
        │  Link to company_id  │               │       │
        └──────────────────────┘               │       │
                    │                          │       │
                    ▼                          │       │
                    ┌───────────────────┐      │       │
                    │    STEP 3 OF 3    │      │       │
                    │  Entry Employee   │      │       │
                    │                   │      │       │
                    │ Fields:           │      │       │
                    │ • Full Name       │      │       │
                    │ • Email           │      │       │
                    │ • Role (Select)   │      │       │
                    │ • Phone Number    │      │       │
                    └───────────────────┘      │       │
                              │                │       │
                    ┌─────────┴─────────┐      │       │
                    │                   │      │       │
                    ▼                   ▼      ▼       │
            ┌─────────────┐    ┌─────────────┐        │
            │   Submit    │    │    Back     │        │
            └─────────────┘    └─────────────┘        │
                    │                                  │
                    ▼                                  │
        ┌──────────────────────┐                      │
        │ Save to 'employees'  │                      │
        │ Link to company_id   │                      │
        └──────────────────────┘                      │
                    │                                  │
                    ▼                                  │
        ┌──────────────────────┐                      │
        │  Set LocalStorage:   │                      │
        │  • walkthrough_      │                      │
        │    completed='true'  │◄─────────────────────┘
        │  • company_id=ID     │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │   Success Message    │
        │   "Setup berhasil!"  │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  Redirect to         │
        │   /dashboard         │
        └──────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LocalStorage Keys                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  walkthrough_completed                                           │
│  ├─ 'true'  → User completed or skipped walkthrough             │
│  └─ null    → User hasn't started walkthrough                   │
│                                                                  │
│  company_id                                                      │
│  ├─ 'uuid'  → User created a company                            │
│  └─ null    → User skipped or hasn't created company            │
│                                                                  │
│  setup_reminder_dismissed                                        │
│  ├─ 'true'  → User dismissed setup reminder                     │
│  └─ null    → Reminder hasn't been dismissed                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Database Relationships

```
┌─────────────────────┐
│    auth.users       │
│  (Supabase Auth)    │
└──────────┬──────────┘
           │ owner_id
           │
           ▼
┌─────────────────────┐
│    companies        │
│  • id (PK)          │
│  • name             │
│  • address          │
│  • phone            │
│  • owner_id (FK)    │
└──────────┬──────────┘
           │
           ├──────────────────┐
           │                  │
           │ company_id       │ company
           │                  │
           ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│     sites       │  │   employees     │
│  • id (PK)      │  │  • id (PK)      │
│  • name         │  │  • name         │
│  • latitude     │  │  • email        │
│  • longitude    │  │  • role         │
│  • radius       │  │  • phone        │
│  • company_id   │  │  • company      │
└─────────────────┘  └─────────────────┘
```

## Role Selection

```
┌─────────────────────────────────────────────────────────────────┐
│                    Employee Roles                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Staff   │  │Supervisor│  │ Manager  │  │  Admin   │       │
│  │  👤      │  │  🛡️      │  │  💼      │  │  ✨      │       │
│  │          │  │          │  │          │  │          │       │
│  │ Basic    │  │ Monitor  │  │ Manage   │  │ Full     │       │
│  │ Access   │  │ Team     │  │ Dept.    │  │ Control  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Page Component Structure

```
/started (+page.svelte)
│
├─ Header Section
│  ├─ Welcome Badge
│  ├─ Title: "Ayo Mulai Setup 🚀"
│  └─ Description
│
├─ Progress Steps (Visual)
│  ├─ Step 1 Circle (Building2 Icon)
│  ├─ Progress Line
│  ├─ Step 2 Circle (MapPin Icon)
│  ├─ Progress Line
│  └─ Step 3 Circle (Users Icon)
│
├─ Main Card
│  │
│  ├─ Step 1: Create Company
│  │  ├─ Header (Blue Gradient)
│  │  ├─ Info Banner
│  │  ├─ Form Fields
│  │  │  ├─ Company Name (text)
│  │  │  ├─ Address (textarea)
│  │  │  └─ Phone (tel)
│  │  └─ Actions
│  │     ├─ Skip Button
│  │     └─ Submit Button
│  │
│  ├─ Step 2: Add Location
│  │  ├─ Header (Green Gradient)
│  │  ├─ Info Banner
│  │  ├─ Form Fields
│  │  │  ├─ Location Name (text)
│  │  │  ├─ Latitude (text)
│  │  │  ├─ Longitude (text)
│  │  │  ├─ Get Current Location (button)
│  │  │  └─ Radius (number)
│  │  └─ Actions
│  │     ├─ Back Button
│  │     └─ Submit Button
│  │
│  └─ Step 3: Entry Employee
│     ├─ Header (Purple Gradient)
│     ├─ Info Banner
│     ├─ Form Fields
│     │  ├─ Full Name (text)
│     │  ├─ Email (email)
│     │  ├─ Role (button grid)
│     │  └─ Phone (tel)
│     └─ Actions
│        ├─ Back Button
│        └─ Submit Button
│
└─ Help Section
   └─ Support Contact Info
```

## User Scenarios

### Scenario 1: Complete Walkthrough
```
User Login → /started → Complete Step 1 → Complete Step 2 → 
Complete Step 3 → localStorage set → /dashboard
```

### Scenario 2: Skip Walkthrough
```
User Login → /started → Click Skip → Confirm → 
localStorage.walkthrough_completed='true' → /dashboard → 
See Setup Reminder Banner
```

### Scenario 3: Partial Completion
```
User Login → /started → Complete Step 1 → 
[Session Expires or Browser Close] → Login Again → 
[Server Check: No Employee Record] → /started (Start Over)
```

### Scenario 4: Existing User
```
User Login → /auth/callback → 
[Check: Has Employee Record with Company] → /dashboard
```

### Scenario 5: Dismiss Reminder
```
User in Dashboard → See Setup Reminder → Click Dismiss → 
localStorage.setup_reminder_dismissed='true' → 
Reminder Hidden Forever
```

### Scenario 6: Complete Setup Later
```
User in Dashboard → See Setup Reminder → Click "Mulai Setup" → 
localStorage.walkthrough_completed removed → /started → 
Complete Walkthrough → /dashboard
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Server-Side Checks                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  +page.server.ts                                                 │
│  │                                                               │
│  ├─ Check Session                                               │
│  │  └─ No Session? → redirect(/login)                           │
│  │                                                               │
│  ├─ Check Employee Record                                       │
│  │  ├─ Query: SELECT company FROM employees                     │
│  │  │         WHERE email = user.email                          │
│  │  │                                                            │
│  │  └─ Has Company? → redirect(/dashboard)                      │
│  │                                                               │
│  └─ Return User Data                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Client-Side Checks                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  +page.svelte (onMount)                                          │
│  │                                                               │
│  ├─ Check LocalStorage                                          │
│  │  └─ walkthrough_completed === 'true'?                        │
│  │     └─ redirect(/dashboard)                                  │
│  │                                                               │
│  └─ Render Walkthrough                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Row Level Security                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Companies                                                       │
│  └─ Policy: auth.uid() = owner_id                               │
│                                                                  │
│  Sites                                                           │
│  └─ Policy: company_id IN (user's companies)                    │
│                                                                  │
│  Employees                                                       │
│  └─ Policy: company IN (user's companies) OR                    │
│             email = auth.email()                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling

```
┌─────────────────────────────────────────────────────────────────┐
│                    Error Scenarios                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Session Expired                                                 │
│  └─ Show Alert → Redirect to /login                             │
│                                                                  │
│  Database Error                                                  │
│  └─ Log Error → Show Alert → Stay on Current Step               │
│                                                                  │
│  Network Error                                                   │
│  └─ Show Alert → Allow Retry                                    │
│                                                                  │
│  Validation Error                                                │
│  └─ Show Field Error → Highlight Field                          │
│                                                                  │
│  Geolocation Denied                                              │
│  └─ Show Alert → Allow Manual Entry                             │
│                                                                  │
│  RLS Policy Block                                                │
│  └─ Log Error → Show Alert → Check Permissions                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

**Legend:**
- `→` Flow direction
- `├─` Branch/Option
- `▼` Downward flow
- `◄─` Return flow
- `[...]` Condition check
- `(...)` Additional info