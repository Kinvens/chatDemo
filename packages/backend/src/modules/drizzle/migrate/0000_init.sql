CREATE TYPE chat_history_role AS ENUM ('human', 'ai');
CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(20) NOT NULL,
	"user_id" varchar(24) NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text,
	"role" "chat_history_role" NOT NULL,
	"user_id" varchar(24),
	"chat_id" integer,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"name" varchar(25) NOT NULL,
	"password" varchar(20) NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
