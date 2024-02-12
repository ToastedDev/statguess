import { db } from "@/db";
import Guess from "../guess";
import { notFound } from "next/navigation";
import { randomChoice } from "@/lib/utils";

export default async function GuessByTitle() {
  const videos = await db.query.videos.findMany({
    with: {
      channel: true,
    },
  });
  if (!videos) return notFound();
  return <Guess by="title" videos={videos} firstVideo={randomChoice(videos)} />;
}
