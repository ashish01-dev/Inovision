import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profile: jsonb("profile"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizResults = pgTable("quiz_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  answers: jsonb("answers").notNull(),
  results: jsonb("results").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const colleges = pgTable("colleges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  state: text("state").notNull(),
  type: text("type").notNull(), // government, private
  streams: jsonb("streams").notNull(), // array of streams offered
  facilities: jsonb("facilities"),
  cutoffs: jsonb("cutoffs"),
  isActive: boolean("is_active").default(true),
});

export const timelines = pgTable("timelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // admission, scholarship, exam
  deadline: timestamp("deadline").notNull(),
  streams: jsonb("streams"), // applicable streams
  isActive: boolean("is_active").default(true),
});

export const savedItems = pgTable("saved_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  itemType: text("item_type").notNull(), // college, career, timeline
  itemId: varchar("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  profile: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  userId: true,
  answers: true,
  results: true,
});

export const insertCollegeSchema = createInsertSchema(colleges).pick({
  name: true,
  location: true,
  state: true,
  type: true,
  streams: true,
  facilities: true,
  cutoffs: true,
});

export const insertTimelineSchema = createInsertSchema(timelines).pick({
  title: true,
  description: true,
  type: true,
  deadline: true,
  streams: true,
});

export const insertSavedItemSchema = createInsertSchema(savedItems).pick({
  userId: true,
  itemType: true,
  itemId: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type InsertCollege = z.infer<typeof insertCollegeSchema>;
export type InsertTimeline = z.infer<typeof insertTimelineSchema>;
export type InsertSavedItem = z.infer<typeof insertSavedItemSchema>;

export type User = typeof users.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
export type College = typeof colleges.$inferSelect;
export type Timeline = typeof timelines.$inferSelect;
export type SavedItem = typeof savedItems.$inferSelect;
