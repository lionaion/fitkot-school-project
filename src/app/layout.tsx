import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitKot — Train in je kot",
  description:
    "Fitness tracking app voor Vlaamse studenten die trainen in kleine ruimtes zonder materiaal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow+Semi+Condensed:wght@500;600&family=DM+Mono:wght@400&family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
