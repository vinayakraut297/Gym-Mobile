-- FitPulse OS Supabase Database Schema (Complete Production-Ready Setup)
-- Run this entire script in the SQL Editor of your Supabase project.

-- =========================================================================
-- 1. Create Branches Table
-- =========================================================================
create table if not exists public.branches (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    location text,
    capacity integer,
    current_occupancy integer default 0,
    status text default 'active',
    revenue numeric default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.branches enable row level security;

-- =========================================================================
-- 2. Create Public Profiles Table
-- =========================================================================
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique not null,
    role text check (role in ('super_admin', 'gym_owner', 'trainer', 'member')) not null default 'member',
    branch_id uuid references public.branches(id),
    onboarded boolean default false,
    diet_preference text default '',
    status text check (status in ('active', 'overdue', 'suspended')) default 'active',
    streak integer default 0,
    health_score integer default 70,
    phone text,
    goal text,
    avatar_url text,
    attendance_risk text default 'Low',
    churn_risk text default 'Low',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- =========================================================================
-- 3. Create Workouts Table
-- =========================================================================
create table if not exists public.workouts (
    id uuid primary key default gen_random_uuid(),
    member_id uuid references public.profiles(id) on delete cascade not null,
    trainer_id uuid references public.profiles(id) on delete set null,
    name text not null,
    date date default current_date not null,
    status text check (status in ('Scheduled', 'Completed', 'Cancelled')) default 'Scheduled' not null,
    exercises jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.workouts enable row level security;

-- =========================================================================
-- 4. Create Invoices Table
-- =========================================================================
create table if not exists public.invoices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    plan_id text not null,
    amount numeric not null,
    status text check (status in ('paid', 'overdue', 'unpaid')) default 'unpaid' not null,
    due_date date not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.invoices enable row level security;

-- =========================================================================
-- 5. Create Attendance Table
-- =========================================================================
create table if not exists public.attendance (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    branch_id uuid references public.branches(id) on delete set null,
    check_in_time timestamp with time zone default timezone('utc'::text, now()) not null,
    method text check (method in ('app', 'biometric', 'manual')) default 'app' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.attendance enable row level security;

-- =========================================================================
-- 6. Trigger Function to Automatically Create Profile on Signup
-- =========================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'member'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 7. Define RLS Policies for Tables
-- =========================================================================

-- Profiles: Anyone can read profiles to see trainers and members, users can update their own
drop policy if exists "Users can read all profiles" on public.profiles;
create policy "Users can read all profiles" on public.profiles 
    for select using (true);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles 
    for update using (auth.uid() = id);

-- Branches: Anyone can read branches. Owners can modify.
drop policy if exists "Anyone can read branches" on public.branches;
create policy "Anyone can read branches" on public.branches 
    for select using (true);

drop policy if exists "Owners can modify branches" on public.branches;
create policy "Owners can modify branches" on public.branches 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'gym_owner'
        )
    );

-- Workouts: Members can read their workouts. Trainers and owners can manage.
drop policy if exists "Members can read their own workouts" on public.workouts;
create policy "Members can read their own workouts" on public.workouts 
    for select using (auth.uid() = member_id);

drop policy if exists "Trainers can manage their client workouts" on public.workouts;
create policy "Trainers can manage their client workouts" on public.workouts 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and (profiles.role = 'trainer' or profiles.role = 'gym_owner')
        )
      or auth.uid() = member_id
    );

-- Invoices: Users can read their own invoices. Owners can manage.
drop policy if exists "Users can read their own invoices" on public.invoices;
create policy "Users can read their own invoices" on public.invoices 
    for select using (auth.uid() = user_id);

drop policy if exists "Owners can manage invoices" on public.invoices;
create policy "Owners can manage invoices" on public.invoices 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'gym_owner'
        )
    );

-- Attendance: Users can check-in and read own logs. Owners can view all logs.
drop policy if exists "Users can check-in and read own logs" on public.attendance;
create policy "Users can check-in and read own logs" on public.attendance 
    for select using (auth.uid() = user_id);

drop policy if exists "Users can insert check-in logs" on public.attendance;
create policy "Users can insert check-in logs" on public.attendance 
    for insert with check (auth.uid() = user_id);

drop policy if exists "Owners can view all attendance logs" on public.attendance;
create policy "Owners can view all attendance logs" on public.attendance 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'gym_owner'
        )
    );

-- =========================================================================
-- 8. Seed Sample Branches
-- =========================================================================
insert into public.branches (id, name, location, capacity, current_occupancy, status, revenue)
values 
  ('b1111111-1111-1111-1111-111111111111', 'Pune Central', 'FC Road, Pune', 300, 85, 'active', 450000),
  ('b2222222-2222-2222-2222-222222222222', 'Aundh South', 'Aundh, Pune', 200, 120, 'active', 395000)
on conflict (id) do nothing;

-- =========================================================================
-- 9. Initialize Supabase Storage Buckets & Policies
-- =========================================================================

-- Create storage buckets if they don't exist
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('gym-images', 'gym-images', true),
  ('member-images', 'member-images', true),
  ('exercise-images', 'exercise-images', true)
on conflict (id) do nothing;

-- Storage RLS Policies: Allow public read access to all buckets
drop policy if exists "Public Select Access" on storage.objects;
create policy "Public Select Access" on storage.objects
    for select using (true);

-- Allow authenticated users management access to all buckets
drop policy if exists "Authenticated Insert Access" on storage.objects;
create policy "Authenticated Insert Access" on storage.objects
    for insert with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated Update Access" on storage.objects;
create policy "Authenticated Update Access" on storage.objects
    for update using (auth.role() = 'authenticated');

drop policy if exists "Authenticated Delete Access" on storage.objects;
create policy "Authenticated Delete Access" on storage.objects
    for delete using (auth.role() = 'authenticated');
