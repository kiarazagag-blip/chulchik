import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "האב מנג'ר",
  description:
    "ניהול קהילה ומעקב נוכחות עבור מתחם העבודה The Hub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
