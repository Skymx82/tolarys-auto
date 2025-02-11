import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tolarys",
  description: "Logiciel de gestion d'auto-école",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={geist.className}>
      <body className="min-h-screen bg-white text-gray-dark">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
