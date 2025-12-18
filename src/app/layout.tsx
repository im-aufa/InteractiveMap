import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "P2M Interactive Map - Politeknik Negeri Batam",
  description: "Interactive map showcasing P2M (Pengabdian Kepada Masyarakat) programs from Politeknik Negeri Batam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <SplashScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
