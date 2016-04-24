CREATE TABLE IF NOT EXISTS "users" (
  "id" integer not null primary key autoincrement,
  "email" varchar not null,
  "password" varchar not null,
  "name" varchar not null,
  "created_at" datetime not null,
  "updated_at" datetime not null,
  "remember_token" varchar null
);
CREATE UNIQUE INDEX users_email_unique on "users" ("email");
