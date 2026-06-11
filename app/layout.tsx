import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tonio Alucema — CV",
  description: "Design-engineer based in the PNW.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
