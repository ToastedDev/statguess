"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { channels, videos } from "@/db/schema";
import { cn, randomChoice } from "@/lib/utils";
import { Image as ImageIcon, LucideIcon, Text } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Video = typeof videos.$inferSelect & {
  channel: typeof channels.$inferSelect;
};

const guessTypes = ["title", "thumbnail"] as const;
type GuessType = (typeof guessTypes)[number];
const guessTypeIcons: Record<GuessType, LucideIcon> = {
  title: Text,
  thumbnail: ImageIcon,
};

type GuessedType = "right" | "wrong" | "skipped";

export default function Guess({
  by,
  videos,
  firstVideo,
}: {
  by: GuessType;
  videos: Video[];
  firstVideo: Video;
}) {
  const otherGamemode = guessTypes.filter((type) => type !== by)[0];
  const OtherGamemodeIcon = guessTypeIcons[otherGamemode];

  const [video, setVideo] = useState<Video>(firstVideo);
  const [attempts, setAttempts] = useState(0);
  const [guessed, setGuessed] = useState<GuessedType>();
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [video]);

  function submitGuess(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const guess = inputRef.current!.value;
    if (!guess.length) return;

    if (guess.toLowerCase() !== video.channel.name.toLowerCase()) {
      if (attempts >= 2) {
        setGuessed("wrong");
        setAttempts(0);
        setScore(0);
      } else setAttempts((attempts) => attempts + 1);
    } else {
      setGuessed("right");
      setAttempts(0);
      setScore((score) => score + 1);
    }
    inputRef.current!.value = "";
  }

  function skip() {
    setGuessed("skipped");
    setScore(0);
    setAttempts(0);
  }

  function reset() {
    setVideo(randomChoice(videos));
    setGuessed(undefined);
    setAttempts(0);
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3">
      <div className="bg-neutral-950 p-4 rounded-lg w-[350px] flex flex-col gap-2">
        {by === "thumbnail" || guessed ? (
          <Image
            src={video.thumbnail}
            alt="Video Thumbnail"
            width={318}
            height={179}
            className="aspect-video rounded-lg object-cover"
          />
        ) : (
          <div className="h-48 aspect-video bg-neutral-900 rounded-lg w-full"></div>
        )}
        {by === "title" || guessed ? (
          <p className="font-semibold tracking-tight">{video.title}</p>
        ) : (
          <div className="h-6 w-full bg-neutral-900 rounded-lg"></div>
        )}
        <div className="flex items-center gap-1">
          {guessed ? (
            <Image
              src={video.channel.avatar}
              alt="Channel Avatar"
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-neutral-900"></div>
          )}
          {guessed ? (
            <p className="text-sm">{video.channel.name}</p>
          ) : (
            <div className="h-4 w-1/2 rounded-lg bg-neutral-900"></div>
          )}
        </div>
      </div>
      {guessed ? (
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div>
            <h1
              className={cn(
                "text-3xl font-bold tracking-tighter",
                guessed === "right" && "text-green-500",
                guessed === "wrong" && "text-red-600",
              )}
            >
              {guessed === "right"
                ? "Correct!"
                : guessed === "wrong"
                  ? "Wrong!"
                  : guessed === "skipped"
                    ? "Skipped"
                    : null}
            </h1>
            <p className="text-muted-foreground text-sm">
              The channel was {video.channel.name}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={reset}>Play again</Button>
            <Link
              href={`/guess/${otherGamemode}`}
              className={buttonVariants({
                variant: "outline",
                className: "flex items-center gap-1",
              })}
            >
              <OtherGamemodeIcon className="w-5 h-5" />
              Guess by {otherGamemode}
            </Link>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={submitGuess} className="flex items-center gap-2">
            <Input
              className={cn("bg-neutral-950 w-80")}
              placeholder="Take your guess..."
              ref={inputRef}
            />
            <Button>Guess!</Button>
            <Button variant="outline" onClick={skip}>
              Skip
            </Button>
          </form>
        </>
      )}
      {attempts > 0 ? (
        <p className="text-red-600 font-semibold text-sm tracking-tight mt-0.5">
          Wrong! {3 - attempts} attempts left...
        </p>
      ) : null}
      {score > 0 && guessed !== "wrong" ? (
        <p className="font-semibold text-sm tracking-tight mt-0.5">
          <span className="text-muted-foreground">Score:</span>{" "}
          {score.toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
