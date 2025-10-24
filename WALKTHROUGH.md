# Walkthrough Page Documentation

## Overview
The `/started` page is a guided walkthrough for new users to set up their AbsenDulu account. It consists of 3 main steps that must be completed in order.

## Features

### 1. **Step-by-Step Setup**
   - **Step 1: Create Company** - Register company information
   - **Step 2: Add Location** - Set up GPS-based attendance location
   - **Step 3: Entry Employee** - Add the first employee

### 2. **Progress Tracking**
   - Visual progress indicators showing completed, current, and upcoming steps
   - Ability to go back to previous steps
   - Completed steps are marked with checkmarks

### 3. **LocalStorage State Management**
   - `walkthrough_completed`: Boolean flag indicating if the user has completed the walkthrough
   - `company_id`: Stores the created company ID for future reference

## User Flow

### Entry Points
1. **New User Registration**: After signing up, users should be redirected to `/started`
2. **Manual Access**: Users can visit `/started` directly if authenticated

### Exit Points
1. **Completion**: After completing all 3 steps, users are redirected to `/dashboard`
2. **Skip**: Users can skip the walkthrough at any time (from Step 1)
3. **Already Setup**: Users who already have a company are automatically redirected to `/dashboard`

## Page Structure

### Step 1: Create Company
**Required Fields:**
- Company Name (text)
- Address (textarea)
- Phone Number (tel)

**Actions:**
- Submit: Creates company in `companies` table and moves to Step 2
- Skip: Marks walkthrough as completed and redirects to dashboard

### Step 2: Add Location
**Required Fields:**
- Location Name (text)
- Latitude (text/number)
- Longitude (text/number)
- Radius (number, default: 100 meters)

**Features:**
- "Use Current Location" button to automatically get GPS coordinates
- Visual feedback for radius setting

**Actions:**
- Submit: Creates location in `sites` table and moves to Step 3
- Back: Returns to Step 1

### Step 3: Entry Employee
**Required Fields:**
- Full Name (text)
- Email (email)
- Role (selection: Staff, Supervisor, Manager, Admin)
- Phone Number (tel)

**Actions:**
- Submit: Creates employee in `employees` table, marks walkthrough as completed, and redirects to dashboard
- Back: Returns to Step 2

## Database Schema

### Tables Used

#### `companies`
```sql
- id (uuid, primary key)
- name (text)
- address (text)
- phone (text)
- owner_id (uuid, foreign key to auth.users)
- created_at (timestamp)
```

#### `sites`
```sql
- id (uuid, primary key)
- name (text)
- latitude (float)
- longitude (float)
- radius (integer)
- company_id (uuid, foreign key to companies)
- created_at (timestamp)
```

#### `employees`
```sql
- id (uuid, primary key)
- name (text)
- email (text)
- role (text)
- phone (text)
- company (uuid, foreign key to companies)
- created_at (timestamp)
```

## Authentication & Authorization

### Server-Side Checks (`+page.server.ts`)
1. **Session Validation**: Checks if user is authenticated
   - If not authenticated → Redirect to `/login`
2. **Duplicate Prevention**: Checks if user already has a company
   - If company exists → Redirect to `/dashboard`

### Client-Side Checks (`+page.svelte`)
1. **LocalStorage Check**: On mount, checks if `walkthrough_completed` is true
   - If true → Redirect to `/dashboard`

## Implementation Details

### State Management
The page uses Svelte 5 runes for reactive state:
- `$state()`: For form inputs and UI state
- `$props()`: For receiving server data

### Form Submission
Each step has its own submit handler:
- `handleCompanySubmit()`: Creates company and stores `companyId`
- `handleLocationSubmit()`: Creates location linked to `companyId`
- `handleEmployeeSubmit()`: Creates employee linked to `companyId`

### Error Handling
- Try-catch blocks for database operations
- User-friendly alert messages
- Loading states during submissions
- Form validation with required fields

### Geolocation API
The `getCurrentLocation()` function:
- Requests user permission for location access
- Automatically fills latitude and longitude fields
- Provides error feedback if location access is denied

## Styling

### Design System
- **Colors**: 
  - Step 1 (Company): Blue/Cyan gradient
  - Step 2 (Location): Green/Emerald gradient
  - Step 3 (Employee): Purple/Pink gradient
- **Components**: Rounded cards, gradient backgrounds, shadow effects
- **Responsive**: Mobile-first design with `md:` breakpoints

### Animations
- Hover effects on buttons and steps
- Scale transitions on interactive elements
- Smooth color transitions

## Integration Points

### After Walkthrough Completion
1. Set `localStorage.setItem('walkthrough_completed', 'true')`
2. Set `localStorage.setItem('company_id', companyId)`
3. Show success message: "Setup berhasil! Selamat datang di AbsenDulu 🎉"
4. Redirect to `/dashboard`

### Recommended Login/Signup Flow
```
User Signs Up → Email Verification → Login → /started (walkthrough) → /dashboard
```

### Skip Walkthrough Flow
```
User Clicks "Skip" → Confirm Dialog → Set localStorage → Redirect to /dashboard
```

## Testing Checklist

- [ ] User can complete all 3 steps successfully
- [ ] Form validation works for all required fields
- [ ] Geolocation button requests permission and fills coordinates
- [ ] Back button navigation works between steps
- [ ] Skip button shows confirmation and redirects
- [ ] Authenticated users can access the page
- [ ] Unauthenticated users are redirected to login
- [ ] Users with existing company are redirected to dashboard
- [ ] LocalStorage state persists across page reloads
- [ ] Error messages display for failed operations
- [ ] Loading states show during async operations
- [ ] Mobile responsive design works correctly

## Future Enhancements

1. **Interactive Map**: Visual map component to select location instead of manual coordinates
2. **Bulk Employee Import**: CSV upload for adding multiple employees
3. **Email Invitations**: Send email invites to employees automatically
4. **Company Logo Upload**: Allow uploading company logo in Step 1
5. **Progress Persistence**: Save partial progress in database
6. **Onboarding Tour**: Tooltips and highlights for first-time dashboard users
7. **Multi-language Support**: Internationalization for different languages
8. **Tutorial Videos**: Embedded video guides for each step

## Support

For issues or questions:
- Email: support@absendulu.com
- Documentation: See main README.md

## License

This file is part of the AbsenDulu project.