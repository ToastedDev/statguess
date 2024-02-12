import { db } from ".";
import { channels, videos as videosTable } from "./schema";

async function main() {
  const channelId = process.argv.slice(2)[0];
  if (!channelId) throw new SyntaxError("No channel ID specified.");

  const data = await fetch(
    `https://yt.lemnoslife.com/noKey/search?part=snippet&channelId=${channelId}&maxResults=10&order=viewCount&type=video`,
  ).then((res) => res.json());
  const videos = data.items.filter(
    (video: any) => video.snippet.liveBroadcastContent === "none",
  );
  if (videos.length < 10) {
    let nextPageToken = data.nextPageToken;
    while (videos.length < 10 && nextPageToken) {
      const data = await fetch(
        `https://yt.lemnoslife.com/noKey/search?part=snippet&channelId=${channelId}&maxResults=10&order=viewCount&type=video&pageToken=${nextPageToken}`,
      ).then((res) => res.json());
      videos.push(
        ...data.items
          .filter((video: any) => video.snippet.liveBroadcastContent === "none")
          .slice(0, 10 - videos.length),
      );
    }
  }

  const channelData = await fetch(
    `https://yt.lemnoslife.com/noKey/channels?part=snippet&id=${channelId}`,
  ).then((res) => res.json());
  await db
    .insert(channels)
    .values([
      {
        id: channelId,
        name: channelData.items[0].snippet.title,
        avatar:
          channelData.items[0].snippet.thumbnails.high?.url ??
          channelData.items[0].snippet.thumbnails.medium?.url ??
          channelData.items[0].snippet.thumbnails.default?.url,
      },
    ])
    .onConflictDoNothing();

  await db.insert(videosTable).values(
    videos.map((video: any) => ({
      id: video.id.videoId,
      title: video.snippet.title
        .replace("&#39;", "'")
        .replace("&quot;", '"')
        .replace("&amp;", "&"),
      thumbnail: `https://img.youtube.com/vi/${video.id.videoId}/maxresdefault.jpg`,
      channelId,
    })),
  );
}

main();
