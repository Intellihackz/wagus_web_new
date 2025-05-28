import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import Providers from "@/components/privy-provider";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Wagus",
  description: "We all gonna use solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.className} bg-black text-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
