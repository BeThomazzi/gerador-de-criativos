import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const baskervilleFont = localFont({
  src: "../../public/fonts/Baskerville.ttf",
  variable: "--font-highlight",
});

const vastagoFont = localFont({
  src: [
    {
      path: "../../public/fonts/VastagoGrotesk.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/VastagoGroteskMedium.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-vastago",
});

export const metadata: Metadata = {
  title: "Gerador de Carrosséis",
  description: "Gerarador de Carrosséis Automático",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={cn("h-full", "antialiased", inter.variable)}>
      <body
        className={`flex min-h-full flex-col ${baskervilleFont.variable} ${vastagoFont.variable}`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
