CREATE TABLE IF NOT EXISTS "votes" (
  "id" integer not null primary key autoincrement,
  "like" integer not null default '0',
  "dislike" integer not null default '0',
  "color_id" integer null,
  "created_at" datetime not null,
  "updated_at" datetime not null,
  foreign key("color_id") references "colors"("id")
);
