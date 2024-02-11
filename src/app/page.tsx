import { buttonVariants } from "@/components/ui/button";
import { Text, Image } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3 text-center">
      <div className="flex flex-col gap-1 text-center items-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-red-600">
          Guess statistics creators
        </h1>
        <p className="text-muted-foreground max-w-md [text-wrap:pretty]">
          We give you their titles and thumbnails, and you see if you can guess
          the creators correctly.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/guess/title"
          className={buttonVariants({ className: "flex items-center gap-1" })}
        >
          <Text className="w-5 h-5" />
          Guess by titles
        </Link>
        <Link
          href="/guess/thumbnail"
          className={buttonVariants({ className: "flex items-center gap-1" })}
        >
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image className="w-5 h-5" />
          Guess by thumbnails
        </Link>
      </div>
    </div>
  );
}
