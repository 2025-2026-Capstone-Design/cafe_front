import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cafe Review ABSA",
  description: "Capstone Project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      {/* 폰트 변수를 body에 입히고 font-sans 클래스를 추가하면 스타일이 먹힙니다 */}
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-full flex flex-col antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
