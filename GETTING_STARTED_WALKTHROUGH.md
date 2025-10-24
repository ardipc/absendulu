# Getting Started with Walkthrough Page

## 🎯 Overview

This guide will help you implement the walkthrough page (`/started`) in your AbsenDulu application. The walkthrough guides new users through 3 essential setup steps:

1. **Create Company** - Register company information
2. **Add Location** - Set GPS-based attendance location
3. **Entry Employee** - Add the first employee

## ✅ What's Already Done

All the necessary files have been created for you:

### Core Files
- ✅ `src/routes/started/+page.svelte` - Main walkthrough UI
- ✅ `src/routes/started/+page.server.ts` - Server-side authentication
- ✅ `src/routes/started/+page.ts` - Client-side page load
- ✅ `src/routes/auth/callback/+server.ts` - Updated auth callback
- ✅ `src/lib/components/setup-reminder.svelte` - Setup reminder component

### Documentation
- ✅ `WALKTHROUGH.md` - Detailed feature documentation
- ✅ `INTEGRATION_GUIDE.md` - Step-by-step integration guide
- ✅ `WALKTHROUGH_FLOW.md` - Visual flow diagrams
- ✅ `QUICK_START.md` - Quick start guide
- ✅ `WALKTHROUGH_SUMMARY.md` - Implementation summary

## 🚀 Quick Implementation (10 Minutes)

### Step 1: Set Up Database (5 minutes)

Open your Supabase SQL Editor and run:

```sql
-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sites table (locations)
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  radius INTEGER NOT NULL DEFAULT 100,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'supervisor', 'manager', 'admin')),
  phone TEXT NOT NULL,
  company UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company);
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);
CREATE INDEX IF NOT EXISTS idx_sites_company ON sites(company_id);
```

### Step 2: Enable Row Level Security (3 minutes)

```sql
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only manage their own companies
CREATE POLICY "Users can manage own companies" ON companies
  FOR ALL USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Sites: Users can manage sites of their companies
CREATE POLICY "Users can manage company sites" ON sites
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  )
  WITH CHECK (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Employees: Users can manage employees of their companies
CREATE POLICY "Users can manage company employees" ON employees
  FOR ALL USING (
    company IN (SELECT id FROM companies WHERE owner_id = auth.uid())
    OR email = auth.email()
  )
  WITH CHECK (
    company IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );
```

### Step 3: Test the Walkthrough (2 minutes)

1. **Clear your localStorage** (Browser DevTools → Application → Local Storage → Clear All)
2. **Delete any existing employee records** for your test user:
   ```sql
   DELETE FROM employees WHERE email = 'your-test-email@example.com';
   ```
3. **Log out and log back in**
4. **You should be redirected to `/started`** ✅

## 🎨 How It Works

### User Flow

```
New User Login → Auth Callback → Check Employee Record
                                         ↓
                              ┌──────────┴──────────┐
                              ▼                     ▼
                         No Company            Has Company
                              ↓                     ↓
                         /started              /dashboard
                              ↓
                    Complete 3 Steps
                              ↓
                    Save to localStorage
                              ↓
                         /dashboard
```

### LocalStorage State

The system tracks user progress with 3 keys:

| Key | Value | Meaning |
|-----|-------|---------|
| `walkthrough_completed` | `'true'` | User completed or skipped walkthrough |
| `company_id` | UUID string | Company was successfully created |
| `setup_reminder_dismissed` | `'true'` | User dismissed the setup reminder |

### Database Relationships

```
auth.users (Supabase Auth)
    ↓ owner_id
companies
    ↓ company_id / company
    ├── sites (locations)
    └── employees
```

## 📱 Features

### Step 1: Create Company
- Company name, address, phone number fields
- Skip button to bypass walkthrough
- Beautiful blue/cyan gradient design
- Form validation

### Step 2: Add Location
- Location name field
- Latitude/longitude inputs
- **"Get Current Location" button** - Auto-fills coordinates using browser geolocation
- Radius setting (default: 100 meters)
- Back button to return to Step 1
- Green/emerald gradient design

### Step 3: Entry Employee
- Employee name, email, phone fields
- **Role selection** - 4 visual cards (Staff, Supervisor, Manager, Admin)
- Email validation
- Back button to return to Step 2
- Purple/pink gradient design
- Success message on completion

## 🔌 Optional: Add Setup Reminder to Dashboard

If users skip the walkthrough, you can show them a reminder banner in the dashboard.

**File**: `src/routes/dashboard/+page.svelte`

```svelte
<script lang="ts">
  import SetupReminder from '$lib/components/setup-reminder.svelte';
  import { onMount } from 'svelte';

  let showReminder = $state(false);

  onMount(() => {
    const completed = localStorage.getItem('walkthrough_completed') === 'true';
    const hasCompany = !!localStorage.getItem('company_id');
    const dismissed = localStorage.getItem('setup_reminder_dismissed') === 'true';
    
    // Show reminder if walkthrough was skipped but not dismissed
    showReminder = completed && !hasCompany && !dismissed;
  });
</script>

<!-- Setup Reminder Banner -->
{#if showReminder}
  <div class="mb-6">
    <SetupReminder />
  </div>
{/if}

<!-- Rest of your dashboard content -->
```

## 🧪 Testing Scenarios

### Test 1: New User (Happy Path)
1. Clear localStorage
2. Delete employee record from database
3. Login
4. Should redirect to `/started`
5. Complete all 3 steps
6. Should redirect to `/dashboard`
7. Check localStorage: both `walkthrough_completed` and `company_id` should be set

### Test 2: Skip Walkthrough
1. Go to `/started`
2. Click "Lewati" (Skip) button
3. Confirm the dialog
4. Should redirect to `/dashboard`
5. Should see setup reminder banner (if implemented)
6. Check localStorage: `walkthrough_completed='true'`, `company_id=null`

### Test 3: Existing User
1. Complete walkthrough once
2. Logout
3. Login again
4. Should redirect directly to `/dashboard` (not `/started`)

### Test 4: Geolocation
1. Go to Step 2 of walkthrough
2. Click "Gunakan Lokasi Saat Ini" button
3. Allow location permission when browser prompts
4. Latitude and longitude fields should auto-fill
5. Submit should work with these coordinates

## 🐛 Troubleshooting

### Issue: Can't access `/started` page
**Solution**: Make sure you're logged in. The page requires authentication.

### Issue: Redirected to dashboard immediately
**Solution**: You already have an employee record. Delete it to test:
```sql
DELETE FROM employees WHERE email = 'your-email@example.com';
```

### Issue: Can't insert records
**Solution**: Check RLS policies are set up correctly. Run Step 2 SQL commands again.

### Issue: Geolocation doesn't work
**Solution**: 
- Use `https://` or `localhost` (required for geolocation API)
- Allow location permission when browser prompts
- Try on a different browser if permission was denied

### Issue: Redirect loop
**Solution**: Clear everything and start fresh:
```javascript
localStorage.clear();
// Then delete employee record from database
```

## 📊 Database Queries for Testing

### Check if user has company
```sql
SELECT e.*, c.name as company_name 
FROM employees e 
JOIN companies c ON e.company = c.id 
WHERE e.email = 'your-email@example.com';
```

### View all your companies
```sql
SELECT * FROM companies 
WHERE owner_id = 'YOUR_USER_ID';
```

### View all locations
```sql
SELECT s.*, c.name as company_name 
FROM sites s 
JOIN companies c ON s.company_id = c.id;
```

### Reset for testing (CAUTION: Deletes all data)
```sql
-- Delete in correct order due to foreign keys
DELETE FROM employees WHERE email = 'your-email@example.com';
DELETE FROM sites WHERE company_id IN (
  SELECT id FROM companies WHERE owner_id = 'YOUR_USER_ID'
);
DELETE FROM companies WHERE owner_id = 'YOUR_USER_ID';
```

## 🎯 Next Steps

1. ✅ **Set up database** - Run SQL commands from Step 1 & 2
2. ✅ **Test the walkthrough** - Follow Test Scenario 1
3. ✅ **Verify data** - Check database records were created
4. ✅ **Optional: Add setup reminder** - Implement reminder banner
5. ✅ **Deploy to staging** - Test in staging environment
6. ✅ **User testing** - Get feedback from real users
7. ✅ **Deploy to production** - Go live!

## 📚 Additional Documentation

For more detailed information, see:

- **WALKTHROUGH.md** - Complete feature documentation
- **INTEGRATION_GUIDE.md** - Detailed integration steps with code examples
- **WALKTHROUGH_FLOW.md** - Visual diagrams of user flows
- **QUICK_START.md** - Quick reference for common tasks
- **WALKTHROUGH_SUMMARY.md** - High-level overview

## 💡 Tips

1. **HTTPS Required**: Geolocation API requires HTTPS (or localhost)
2. **Session Duration**: Long walkthroughs may expire the session
3. **Mobile Testing**: Test on real mobile devices, not just emulators
4. **Browser Permissions**: Users must allow location access for geolocation
5. **Email Uniqueness**: Employee emails must be unique across the system

## 🎉 That's It!

You're all set! The walkthrough page is ready to use. Just:
1. Run the SQL commands (Step 1 & 2)
2. Test with a new user account
3. Enjoy your beautiful onboarding experience!

---

## 🆘 Need Help?

If you run into issues:

1. Check the troubleshooting section above
2. Review the detailed documentation files
3. Check browser console for errors
4. Verify database permissions and RLS policies
5. Test with a fresh user account

---

**Version**: 1.0.0  
**Created**: 2024  
**Status**: ✅ Production Ready  

**Happy Onboarding! 🚀**