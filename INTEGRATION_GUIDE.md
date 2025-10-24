# Integration Guide for Walkthrough System

## Overview
This guide explains how to integrate the walkthrough system (`/started`) into your AbsenDulu application flow.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication Flow](#authentication-flow)
3. [Dashboard Integration](#dashboard-integration)
4. [LocalStorage Management](#localstorage-management)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. User Registration Flow

After a user successfully signs up or logs in with Google OAuth, they will be automatically redirected to `/started` if they haven't completed the setup.

```
Login/Signup → Auth Callback → Check Employee Record → /started or /dashboard
```

### 2. The Walkthrough Process

Users must complete 3 steps in order:
1. **Create Company** - Company information (name, address, phone)
2. **Add Location** - GPS coordinates and geofence radius
3. **Entry Employee** - First employee details

### 3. Completion

After completing all steps:
- `localStorage.setItem('walkthrough_completed', 'true')`
- `localStorage.setItem('company_id', 'COMPANY_ID')`
- User is redirected to `/dashboard`

---

## Authentication Flow

### File: `src/routes/auth/callback/+server.ts`

The authentication callback has been updated to check if a user needs the walkthrough:

```typescript
export const GET = async (event) => {
  const { url, locals: { supabase } } = event;
  const code = url.searchParams.get('code') as string;

  if (code) {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      // Check if user already has a company setup
      const { data: employeeData } = await supabase
        .from('employees')
        .select('company')
        .eq('email', data.session.user.email)
        .single();

      // If no company found, redirect to walkthrough
      if (!employeeData || !employeeData.company) {
        throw redirect(303, '/started');
      }

      // Otherwise, redirect to dashboard
      throw redirect(303, '/dashboard');
    }
  }

  throw redirect(303, '/auth/auth-code-error');
};
```

### Key Points:
- Checks if user has an employee record with a company
- New users → `/started`
- Existing users → `/dashboard`
- Failed auth → `/auth/auth-code-error`

---

## Dashboard Integration

### Option 1: Setup Reminder Component

Use the `setup-reminder.svelte` component to show a banner for users who skipped the walkthrough:

```svelte
<script lang="ts">
  import SetupReminder from '$lib/components/setup-reminder.svelte';
  import { onMount } from 'svelte';

  let showSetupReminder = $state(false);

  onMount(() => {
    // Check if walkthrough was completed
    const walkthroughCompleted = localStorage.getItem('walkthrough_completed');
    const companyId = localStorage.getItem('company_id');
    
    // Show reminder if walkthrough was skipped but not dismissed
    if (walkthroughCompleted === 'true' && !companyId) {
      const dismissed = localStorage.getItem('setup_reminder_dismissed');
      showSetupReminder = dismissed !== 'true';
    }
  });
</script>

{#if showSetupReminder}
  <div class="mb-6">
    <SetupReminder />
  </div>
{/if}

<!-- Rest of your dashboard content -->
```

### Option 2: Check Company Status

Verify company setup in your dashboard load function:

```typescript
// src/routes/dashboard/+page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  const { session, user } = await locals.safeGetSession();

  if (!session || !user) {
    throw redirect(303, '/login');
  }

  // Check if user has completed company setup
  const { data: employeeData } = await locals.supabase
    .from('employees')
    .select('company, companies(id, name)')
    .eq('email', user.email)
    .single();

  return {
    user,
    company: employeeData?.company || null,
    hasCompany: !!employeeData?.company
  };
};
```

Then in your Svelte component:

```svelte
<script lang="ts">
  let { data } = $props();

  // Redirect to walkthrough if no company
  if (!data.hasCompany) {
    goto('/started');
  }
</script>
```

---

## LocalStorage Management

### Keys Used

| Key | Type | Purpose |
|-----|------|---------|
| `walkthrough_completed` | `'true'` \| `null` | Indicates if user has gone through walkthrough |
| `company_id` | `string` \| `null` | Stores the created company ID |
| `setup_reminder_dismissed` | `'true'` \| `null` | Tracks if user dismissed the setup reminder |

### Helper Functions

Create a utility file for managing walkthrough state:

```typescript
// src/lib/walkthrough.ts

export function isWalkthroughCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('walkthrough_completed') === 'true';
}

export function getCompanyId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('company_id');
}

export function markWalkthroughCompleted(companyId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('walkthrough_completed', 'true');
  localStorage.setItem('company_id', companyId);
}

export function resetWalkthrough(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('walkthrough_completed');
  localStorage.removeItem('company_id');
  localStorage.removeItem('setup_reminder_dismissed');
}

export function needsSetupReminder(): boolean {
  if (typeof window === 'undefined') return false;
  const completed = localStorage.getItem('walkthrough_completed') === 'true';
  const hasCompany = !!localStorage.getItem('company_id');
  const dismissed = localStorage.getItem('setup_reminder_dismissed') === 'true';
  
  return completed && !hasCompany && !dismissed;
}
```

Usage:

```typescript
import { isWalkthroughCompleted, markWalkthroughCompleted } from '$lib/walkthrough';

// Check if completed
if (!isWalkthroughCompleted()) {
  goto('/started');
}

// Mark as completed after final step
markWalkthroughCompleted(companyId);
```

---

## Database Schema

### Required Tables

#### `companies`
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `sites`
```sql
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  radius INTEGER NOT NULL DEFAULT 100,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `employees`
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('staff', 'supervisor', 'manager', 'admin')),
  phone TEXT NOT NULL,
  company UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes (Recommended)

```sql
-- For faster lookups during auth callback
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_company ON employees(company);

-- For company owner queries
CREATE INDEX idx_companies_owner ON companies(owner_id);

-- For site location queries
CREATE INDEX idx_sites_company ON sites(company_id);
```

### Row Level Security (RLS)

Enable RLS on all tables:

```sql
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only see their own companies
CREATE POLICY "Users can view own companies" ON companies
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create own companies" ON companies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Sites: Users can view sites of their company
CREATE POLICY "Users can view company sites" ON sites
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create company sites" ON sites
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );

-- Employees: Users can view employees of their company
CREATE POLICY "Users can view company employees" ON employees
  FOR SELECT USING (
    company IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
    OR email = auth.email()
  );

CREATE POLICY "Users can create company employees" ON employees
  FOR INSERT WITH CHECK (
    company IN (
      SELECT id FROM companies WHERE owner_id = auth.uid()
    )
  );
```

---

## API Endpoints

### Creating Company (Step 1)

```typescript
const { data, error } = await supabase
  .from('companies')
  .insert([{
    name: companyName,
    address: companyAddress,
    phone: companyPhone,
    owner_id: userId
  }])
  .select()
  .single();
```

### Creating Location (Step 2)

```typescript
const { data, error } = await supabase
  .from('sites')
  .insert([{
    name: locationName,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    radius: locationRadius,
    company_id: companyId
  }])
  .select()
  .single();
```

### Creating Employee (Step 3)

```typescript
const { error } = await supabase
  .from('employees')
  .insert([{
    name: employeeName,
    email: employeeEmail,
    role: employeeRole,
    phone: employeePhone,
    company: companyId
  }]);
```

### Checking User Setup Status

```typescript
const { data: employeeData } = await supabase
  .from('employees')
  .select('company, companies(id, name)')
  .eq('email', userEmail)
  .single();

const hasCompany = !!employeeData?.company;
```

---

## Troubleshooting

### Issue: User stuck in redirect loop

**Cause**: LocalStorage and database state mismatch

**Solution**: Clear localStorage and check database:
```typescript
// Clear all walkthrough state
localStorage.removeItem('walkthrough_completed');
localStorage.removeItem('company_id');
localStorage.removeItem('setup_reminder_dismissed');

// Then reload the page
window.location.reload();
```

### Issue: Walkthrough completed but user still sees reminder

**Cause**: `company_id` not saved in localStorage

**Solution**: Ensure Step 3 completion saves both flags:
```typescript
localStorage.setItem('walkthrough_completed', 'true');
localStorage.setItem('company_id', companyId); // Must include this
```

### Issue: Geolocation not working

**Cause**: HTTPS required for geolocation API

**Solution**: 
- Development: Use `localhost` (allowed by browsers)
- Production: Ensure site is served over HTTPS
- Check browser permissions for location access

### Issue: User redirected to login after completing Step 1

**Cause**: Session expired during walkthrough

**Solution**: Add session check before each step:
```typescript
async function handleSubmit() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    alert('Sesi Anda telah berakhir. Silakan login kembali.');
    goto('/login');
    return;
  }
  
  // Continue with form submission
}
```

### Issue: RLS policies blocking inserts

**Cause**: User doesn't have permission or policies misconfigured

**Solution**: Check that:
1. User is authenticated (`auth.uid()` returns a value)
2. RLS policies allow the operation
3. Foreign key references are correct

Debug query:
```sql
SELECT 
  auth.uid() as user_id,
  auth.email() as user_email;
```

---

## Testing Checklist

- [ ] New user can complete all 3 steps successfully
- [ ] Existing user with company is redirected to dashboard
- [ ] Skip button works and shows reminder later
- [ ] Dismiss button hides reminder permanently
- [ ] Geolocation button requests permission
- [ ] Form validation works on all fields
- [ ] Back button navigation works
- [ ] Session persistence during walkthrough
- [ ] Mobile responsive on all steps
- [ ] Loading states show during submissions
- [ ] Error messages display properly
- [ ] LocalStorage persists after page reload
- [ ] RLS policies allow all operations

---

## Best Practices

### 1. Always Check Authentication
```typescript
onMount(async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    goto('/login');
  }
});
```

### 2. Handle Errors Gracefully
```typescript
try {
  const { data, error } = await supabase.from('table').insert([...]);
  if (error) throw error;
} catch (error) {
  console.error('Database error:', error);
  alert('Terjadi kesalahan. Silakan coba lagi.');
}
```

### 3. Provide User Feedback
```typescript
let isSubmitting = $state(false);

async function handleSubmit() {
  isSubmitting = true;
  try {
    // ... submission logic
  } finally {
    isSubmitting = false;
  }
}
```

### 4. Validate Before Submission
```typescript
if (!companyName || !companyAddress || !companyPhone) {
  alert('Semua field harus diisi');
  return;
}
```

### 5. Clean Up on Unmount
```typescript
onDestroy(() => {
  // Clean up any subscriptions or listeners
});
```

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [SvelteKit Routing](https://kit.svelte.dev/docs/routing)
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

---

## Support

For questions or issues:
- Create an issue in the project repository
- Contact: support@absendulu.com
- Documentation: See WALKTHROUGH.md for detailed feature docs

---

**Last Updated**: 2024
**Version**: 1.0.0