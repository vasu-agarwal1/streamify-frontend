import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/components/AuthInitializer";

export const metadata: Metadata = {
  title: "Streamify",
  description: "A video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <AuthInitializer>
            <Navbar />
             <div className="p-16">
                {children}
             </div>
          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}
