import { db } from "@/db";
import Guess from "../guess";
import { notFound } from "next/navigation";
import { randomChoice } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guess By Thumbnail",
  description: "Guess your favorite statistics creators by their thumbnails.",
};

export default async function GuessByThumbnail() {
  const videos = await db.query.videos.findMany({
    with: {
      channel: true,
    },
  });
  if (!videos) return notFound();
  return (
    <Guess by="thumbnail" videos={videos} firstVideo={randomChoice(videos)} />
  );
}
