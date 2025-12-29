-- Create a table for public profiles
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text check (role in ('client', 'admin', 'reviewer')) default 'client'
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

drop policy if exists "Public profiles are viewable by everyone." on profiles;
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on profiles;
create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on profiles;
create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create requests table
create table if not exists requests (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  client_id uuid references profiles(id) not null,
  reviewer_id uuid references profiles(id),
  status text default 'New',
  urgency text default 'Normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table requests enable row level security;

-- Requests policies
drop policy if exists "Clients can view their own requests" on requests;
create policy "Clients can view their own requests" on requests
  for select using (auth.uid() = client_id);

drop policy if exists "Admins and reviewers can view all requests" on requests;
create policy "Admins and reviewers can view all requests" on requests
  for select using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('admin', 'reviewer')
    )
  );

drop policy if exists "Clients can create requests" on requests;
create policy "Clients can create requests" on requests
  for insert with check (auth.uid() = client_id);

drop policy if exists "Admins can update any request" on requests;
create policy "Admins can update any request" on requests
  for update using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

drop policy if exists "Reviewers can update requests assigned to them" on requests;
create policy "Reviewers can update requests assigned to them" on requests
  for update using (
    reviewer_id = auth.uid()
  );

-- Create messages table
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references requests(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  text text not null,
  is_internal boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

-- Messages policies
drop policy if exists "Users can view messages for requests they can see" on messages;
create policy "Users can view messages for requests they can see" on messages
  for select using (
    exists (
      select 1 from requests
      where requests.id = request_id
    ) AND (
      is_internal = false OR
      exists (
        select 1 from profiles
        where profiles.id = auth.uid()
        and profiles.role in ('admin', 'reviewer')
      )
    )
  );

drop policy if exists "Users can insert messages" on messages;
create policy "Users can insert messages" on messages
  for insert with check (auth.uid() = user_id);

-- Create request_views table for tracking unseen messages
create table if not exists request_views (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references requests(id) on delete cascade not null,
  user_id uuid references profiles(id) not null,
  last_viewed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, request_id)
);

alter table request_views enable row level security;

drop policy if exists "Users can manage their own views" on request_views;
create policy "Users can manage their own views" on request_views
  for all using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_role text;
begin
  -- Try to get role from metadata, fallback to 'client'
  user_role := (new.raw_user_meta_data->>'role')::text;
  
  if user_role is null or user_role = '' then
    user_role := 'client';
  end if;
  
  -- Final safety check
  if user_role not in ('client', 'admin', 'reviewer') then
    user_role := 'client';
  end if;

  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    user_role
  )
  on conflict (id) do update 
  set role = excluded.role,
      email = excluded.email;
      
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call handle_new_user on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
