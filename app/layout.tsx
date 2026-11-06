import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VoiceOrder AI | Voice orders, made structured",
  description:
    "VoiceOrder AI turns customer conversations into structured business orders.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
