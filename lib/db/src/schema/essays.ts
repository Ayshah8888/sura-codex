import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const essaysTable = pgTable("essays", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("writing"),
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  featured: boolean("featured").notNull().default(false),
  readingTime: integer("reading_time").notNull().default(5),
});

export const insertEssaySchema = createInsertSchema(essaysTable).omit({ id: true });
export type InsertEssay = z.infer<typeof insertEssaySchema>;
export type Essay = typeof essaysTable.$inferSelect;
