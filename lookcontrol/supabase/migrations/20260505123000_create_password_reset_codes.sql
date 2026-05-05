create table if not exists public.password_reset_codes (
  id bigint generated always as identity primary key,
  email text not null,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  attempts integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists password_reset_codes_email_created_idx
  on public.password_reset_codes (email, created_at desc);

alter table public.password_reset_codes enable row level security;
