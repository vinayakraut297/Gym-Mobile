-- FitPulse OS Supabase Database Schema
-- Run this script in the SQL Editor of your Supabase project.

-- 1. Create Branches Table
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

-- 2. Create Public Profiles Table
-- Extends the auth.users table in Supabase
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    email text unique not null,
    role text check (role in ('owner', 'trainer', 'member')) not null default 'member',
    branch_id uuid references public.branches(id),
    onboarded boolean default false,
    diet_preference text default '',
    status text check (status in ('active', 'overdue', 'suspended')) default 'active',
    streak integer default 0,
    health_score integer default 70,
    phone text,
    goal text,
    attendance_risk text default 'Low',
    churn_risk text default 'Low',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- 3. Create Workouts Table
create table public.workouts (
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

-- 4. Create Invoices Table
create table public.invoices (
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

-- 5. Create Attendance Table
create table public.attendance (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    branch_id uuid references public.branches(id) on delete set null,
    check_in_time timestamp with time zone default timezone('utc'::text, now()) not null,
    method text check (method in ('app', 'biometric', 'manual')) default 'app' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.attendance enable row level security;


-- 6. Trigger Function to Automatically Create Profile on Signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, onboarded)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'member'),
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 7. Define RLS Policies

-- Profiles: Users can read all profiles (to see trainers and members), but only edit their own.
create policy "Users can read all profiles" on public.profiles 
    for select using (true);
create policy "Users can update their own profile" on public.profiles 
    for update using (auth.uid() = id);

-- Branches: Anyone can read branches. Owners can modify.
create policy "Anyone can read branches" on public.branches 
    for select using (true);
create policy "Owners can modify branches" on public.branches 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'owner'
        )
    );

-- Workouts: Members can read their workouts. Trainers can read and modify. Owners can audit.
create policy "Members can read their own workouts" on public.workouts 
    for select using (auth.uid() = member_id);
create policy "Trainers can manage their client workouts" on public.workouts 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and (profiles.role = 'trainer' or profiles.role = 'owner')
        )
      or auth.uid() = member_id
    );

-- Invoices: Users can read their own invoices. Owners can update or create.
create policy "Users can read their own invoices" on public.invoices 
    for select using (auth.uid() = user_id);
create policy "Owners can manage invoices" on public.invoices 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'owner'
        )
    );

-- Attendance: Users can read and insert their own attendance. Owners can read all logs.
create policy "Users can check-in and read own logs" on public.attendance 
    for select using (auth.uid() = user_id);
create policy "Users can insert check-in logs" on public.attendance 
    for insert with check (auth.uid() = user_id);
create policy "Owners can view all attendance logs" on public.attendance 
    for all using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'owner'
        )
    );


-- 8. Seed Sample Branch
insert into public.branches (id, name, location, capacity, current_occupancy, status, revenue)
values 
  ('b1111111-1111-1111-1111-111111111111', 'Pune Central', 'FC Road, Pune', 300, 85, 'active', 450000),
  ('b2222222-2222-2222-2222-222222222222', 'Aundh South', 'Aundh, Pune', 200, 120, 'active', 395000)
on conflict (id) do nothing;
