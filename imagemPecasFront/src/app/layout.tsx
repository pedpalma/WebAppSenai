import type { Metadata } from "next";
import { Outfit, Space_Mono, Syncopate } from "next/font/google";
import { NotificationContainer } from "@/components";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-outfit" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
const syncopate = Syncopate({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-syncopate" });

export const metadata: Metadata = {
  title: "Galeria · ImagemPeças",
  description: "Álbum online de imagens de peças industriais",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${spaceMono.variable} ${syncopate.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <NotificationContainer />
      </body>
    </html>
  );
}
