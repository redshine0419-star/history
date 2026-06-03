CREATE TYPE "public"."era" AS ENUM('ancient', 'medieval', 'early-modern', 'modern', 'contemporary');--> statement-breakpoint
CREATE TYPE "public"."exam_level" AS ENUM('none', 'basic', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."region" AS ENUM('europe', 'asia', 'middle-east-africa', 'americas');--> statement-breakpoint
CREATE TABLE "exam_topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"keyword" varchar(100) NOT NULL,
	"era" "era" NOT NULL,
	"region" "region" NOT NULL,
	"exam_level" "exam_level" NOT NULL,
	"frequency" integer DEFAULT 1 NOT NULL,
	"rounds" integer[],
	"post_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "page_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"date" varchar(10) NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(250) NOT NULL,
	"title" varchar(300) NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"full_story" text NOT NULL,
	"summary" text,
	"region" "region" NOT NULL,
	"era" "era" NOT NULL,
	"exam_level" "exam_level" DEFAULT 'none' NOT NULL,
	"exam_keyword" varchar(100),
	"tags" text[],
	"seo_title" varchar(65),
	"seo_desc" varchar(160),
	"thumbnail" varchar(500),
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"question" text NOT NULL,
	"options" text[] NOT NULL,
	"answer" integer NOT NULL,
	"explanation" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"post_id" integer,
	"platform" varchar(20) NOT NULL,
	"url" varchar(500),
	"views" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "exam_topics" ADD CONSTRAINT "exam_topics_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;