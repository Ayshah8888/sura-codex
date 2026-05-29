import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const novelsTable = pgTable("novels", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  synopsis: text("synopsis").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("draft"),
  chaptersCount: integer("chapters_count").notNull().default(1),
});

export const insertNovelSchema = createInsertSchema(novelsTable).omit({ id: true });
export type InsertNovel = z.infer<typeof insertNovelSchema>;
export type Novel = typeof novelsTable.$inferSelect;
