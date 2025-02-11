import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Tolarys Auto-École",
  description: "Plateforme de gestion d'auto-école moderne et intuitive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${geist.variable} font-sans`}>
      <body className="min-h-screen bg-white text-gray-dark">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
