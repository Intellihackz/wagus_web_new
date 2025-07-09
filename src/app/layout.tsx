import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coming Soon | Wagus",
  description: "Wagus is coming soon. Stay tuned for something amazing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} antialiased dark`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
