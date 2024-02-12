import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import colors from "tailwindcss/colors";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://statguess.toasted.devd"),
  title: {
    default: "Statguess",
    template: "%s — Statguess",
  },
  description:
    "Guess your favorite statistics creators by their titles and thumbnails..",
  twitter: {
    card: "summary_large_image",
    creator: "@ToastedDev",
    creatorId: "1145171094556426240",
  },
  openGraph: {
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: "#dc2626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>{children}</body>
    </html>
  );
}
