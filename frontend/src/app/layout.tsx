import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import FullScreenAlert from "@/components/FullScreenAlert";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Grantify | Nigerian Grant & Scholarship Intelligence",
  description: "Simplifying access to grants and scholarships exclusively for Nigerians. AI-powered writing assistance for successful applications.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased font-sans`}>
        <ThemeProvider>
          <div className="bg-mesh" />
          <AuthProvider>
            <SubscriptionProvider>
              {children}
              <FullScreenAlert />
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
