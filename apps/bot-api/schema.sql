create table if not exists telegram_users (
  id bigserial primary key,
  telegram_user_id text not null unique,
  chat_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists mood_entries (
  id bigserial primary key,
  telegram_user_id text not null references telegram_users(telegram_user_id) on delete cascade,
  entry_date date not null,
  score int not null check (score between 1 and 10),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (telegram_user_id, entry_date)
);

create index if not exists idx_mood_entries_user_date
  on mood_entries(telegram_user_id, entry_date);
