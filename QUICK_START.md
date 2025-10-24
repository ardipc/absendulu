# Quick Start Guide - Walkthrough Implementation

## 🚀 Get Started in 5 Minutes

This guide will help you quickly implement and test the walkthrough system in your AbsenDulu application.

---

## Prerequisites

- ✅ SvelteKit project set up
- ✅ Supabase configured with auth
- ✅ Google OAuth enabled
- ✅ Database tables created (companies, sites, employees)

---

## Step 1: Verify Database Schema (2 minutes)

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'sites', 'employees');

-- If tables don't exist, create them:

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  radius INTEGER NOT NULL DEFAULT 100,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT NOT NULL,
  company UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_company ON employees(company);
CREATE INDEX IF NOT EXISTS idx_companies_owner ON companies(owner_id);
```

---

## Step 2: Enable Row Level Security (1 minute)

```sql
-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own companies" ON companies
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can manage company sites" ON sites
  USING (company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid()))
  WITH CHECK (company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid()));

CREATE POLICY "Users can manage company employees" ON employees
  USING (
    company IN (SELECT id FROM companies WHERE owner_id = auth.uid())
    OR email = auth.email()
  )
  WITH CHECK (
    company IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );
```

---

## Step 3: Test the Walkthrough (2 minutes)

### Option A: Clean Test (New User Simulation)

1. **Open your browser's DevTools** (F12)
2. **Go to Application/Storage tab**
3. **Clear LocalStorage**:
   ```javascript
   localStorage.clear();
   ```
4. **Log out** from your application
5. **Log in again** with Google OAuth
6. **You should be redirected to `/started`** ✅

### Option B: Force Walkthrough (Existing User)

1. **Clear LocalStorage**:
   ```javascript
   localStorage.clear();
   ```
2. **Delete your employee record** (Supabase Dashboard):
   ```sql
   DELETE FROM employees WHERE email = 'your-email@example.com';
   ```
3. **Refresh the page or visit `/started`**
4. **Complete the walkthrough** ✅

---

## Step 4: Verify Flow (5 minutes)

### Test Checklist

Go through each step and verify:

#### ✅ Step 1: Create Company
- [ ] Form displays correctly
- [ ] All fields are required
- [ ] Submit button creates company
- [ ] Skip button redirects to dashboard
- [ ] Company saved to database
- [ ] Moves to Step 2 after submission

#### ✅ Step 2: Add Location
- [ ] Form displays correctly
- [ ] "Get Current Location" button works
- [ ] Latitude/Longitude fields populate
- [ ] Radius slider works
- [ ] Back button returns to Step 1
- [ ] Submit saves location to database
- [ ] Moves to Step 3 after submission

#### ✅ Step 3: Entry Employee
- [ ] Form displays correctly
- [ ] Role selection works (4 options)
- [ ] Email validation works
- [ ] Back button returns to Step 2
- [ ] Submit saves employee to database
- [ ] Success message displays
- [ ] Redirects to dashboard
- [ ] LocalStorage flags are set

---

## Common Issues & Quick Fixes

### Issue 1: Redirected to login after Step 1
**Cause:** Session expired  
**Fix:** Increase session timeout in Supabase settings

### Issue 2: Can't insert into tables
**Cause:** RLS policies blocking  
**Fix:** Run Step 2 SQL commands again

### Issue 3: Geolocation doesn't work
**Cause:** HTTPS required or permission denied  
**Fix:** 
- Use `localhost` in development
- Check browser location permissions
- Allow location access when prompted

### Issue 4: Redirect loop between /started and /dashboard
**Cause:** LocalStorage and DB state mismatch  
**Fix:**
```javascript
localStorage.clear();
// Then delete employee record from database
```

### Issue 5: Skip button doesn't work
**Cause:** localStorage not setting properly  
**Fix:** Check browser console for errors

---

## Testing Different Scenarios

### Scenario 1: Happy Path (Complete Walkthrough)
```javascript
// 1. Clear storage
localStorage.clear();

// 2. Login → Should redirect to /started

// 3. Complete all 3 steps

// 4. Verify localStorage
console.log(localStorage.getItem('walkthrough_completed')); // 'true'
console.log(localStorage.getItem('company_id')); // UUID string
```

### Scenario 2: Skip Walkthrough
```javascript
// 1. Clear storage
localStorage.clear();

// 2. Login → /started

// 3. Click "Skip" button → Confirm

// 4. Should redirect to /dashboard

// 5. Verify localStorage
console.log(localStorage.getItem('walkthrough_completed')); // 'true'
console.log(localStorage.getItem('company_id')); // null
```

### Scenario 3: Existing User
```javascript
// 1. Complete walkthrough once

// 2. Logout and login again

// 3. Should redirect to /dashboard directly (not /started)
```

---

## Debugging Commands

### Check Database Records
```sql
-- Check companies
SELECT * FROM companies WHERE owner_id = 'YOUR_USER_ID';

-- Check sites
SELECT s.*, c.name as company_name 
FROM sites s 
JOIN companies c ON s.company_id = c.id;

-- Check employees
SELECT e.*, c.name as company_name 
FROM employees e 
JOIN companies c ON e.company = c.id;
```

### Check LocalStorage (Browser Console)
```javascript
// View all walkthrough-related items
console.log({
  walkthrough_completed: localStorage.getItem('walkthrough_completed'),
  company_id: localStorage.getItem('company_id'),
  setup_reminder_dismissed: localStorage.getItem('setup_reminder_dismissed')
});

// Clear all walkthrough state
localStorage.removeItem('walkthrough_completed');
localStorage.removeItem('company_id');
localStorage.removeItem('setup_reminder_dismissed');
```

### Check Authentication (Browser Console)
```javascript
// Check current session
const { data: { session } } = await supabase.auth.getSession();
console.log(session);

// Check user
console.log(session?.user);
```

---

## Integration with Existing App

### Update Login Flow

If you have custom login logic, add this after successful authentication:

```typescript
// After successful login
const { data: employeeData } = await supabase
  .from('employees')
  .select('company')
  .eq('email', session.user.email)
  .single();

if (!employeeData || !employeeData.company) {
  goto('/started');
} else {
  goto('/dashboard');
}
```

### Add Setup Reminder to Dashboard

In your dashboard page:

```svelte
<script lang="ts">
  import SetupReminder from '$lib/components/setup-reminder.svelte';
  import { onMount } from 'svelte';

  let showReminder = $state(false);

  onMount(() => {
    const completed = localStorage.getItem('walkthrough_completed') === 'true';
    const hasCompany = !!localStorage.getItem('company_id');
    const dismissed = localStorage.getItem('setup_reminder_dismissed') === 'true';
    
    showReminder = completed && !hasCompany && !dismissed;
  });
</script>

{#if showReminder}
  <div class="mb-6">
    <SetupReminder />
  </div>
{/if}

<!-- Rest of dashboard -->
```

---

## Performance Tips

1. **Cache Company Data**: After walkthrough, store company data in SvelteKit stores
2. **Lazy Load Icons**: Use dynamic imports for Lucide icons
3. **Optimize Images**: Compress any logo/background images
4. **Preload Routes**: Add `data-sveltekit-preload-data` to navigation links

---

## Next Steps

✅ Complete walkthrough implementation  
✅ Test all scenarios  
✅ Deploy to staging  
✅ User testing  
✅ Deploy to production  

### Recommended Enhancements

1. **Add Progress Persistence**: Save partial progress to database
2. **Add Email Verification**: Send welcome email after completion
3. **Add Analytics**: Track walkthrough completion rates
4. **Add Tutorial Videos**: Embed helpful videos in each step
5. **Add Multi-language**: Internationalize the walkthrough
6. **Add Interactive Map**: Visual location picker for Step 2
7. **Add Bulk Import**: CSV upload for multiple employees

---

## Support Resources

- 📚 **Full Documentation**: See `WALKTHROUGH.md`
- 🔄 **Flow Diagram**: See `WALKTHROUGH_FLOW.md`
- 🔧 **Integration Guide**: See `INTEGRATION_GUIDE.md`
- 💬 **Support Email**: support@absendulu.com

---

## Quick Reference Commands

```bash
# Start dev server
npm run dev

# Check TypeScript
npm run check

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Happy Coding! 🎉**

If you encounter any issues not covered here, please check the detailed documentation files or reach out to support.

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Maintained by**: AbsenDulu Team