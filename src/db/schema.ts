import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const videos = pgTable("videos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  thumbnail: text("thumbnail").notNull(),
  channelId: text("channel_id").notNull(),
});

export const videosRelations = relations(videos, ({ one }) => ({
  channel: one(channels, {
    fields: [videos.channelId],
    references: [channels.id],
  }),
}));

export const channels = pgTable("channels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar").notNull(),
});

export const channelsRelations = relations(channels, ({ many }) => ({
  videos: many(videos),
}));
