import { pgTable, serial, text, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  essayId: integer("essay_id"),
  novelId: integer("novel_id"),
  parentId: integer("parent_id"),
  userId: varchar("user_id"),
  authorName: text("author_name").notNull(),
  authorImage: text("author_image"),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const likesTable = pgTable("likes", {
  id: serial("id").primaryKey(),
  essayId: integer("essay_id"),
  novelId: integer("novel_id"),
  userId: varchar("user_id"),
  sessionKey: text("session_key"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sharesTable = pgTable("shares", {
  id: serial("id").primaryKey(),
  essayId: integer("essay_id"),
  novelId: integer("novel_id"),
  userId: varchar("user_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  essayId: integer("essay_id"),
  novelId: integer("novel_id"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Comment = typeof commentsTable.$inferSelect;
export type Like = typeof likesTable.$inferSelect;
export type Share = typeof sharesTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
