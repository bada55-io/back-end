CREATE TABLE IF NOT EXISTS "colors" (
  "id" integer not null primary key autoincrement,
  "name" varchar not null,
  "label" varchar not null,
  "author" varchar null,
  "twitter" integer not null default '0',
  "active" integer not null default '0',
  "created_at" datetime not null,
  "updated_at" datetime not null,
  "lumen" float null,
  "token" varchar null
);
CREATE UNIQUE INDEX colors_name_unique on "colors" ("name");
