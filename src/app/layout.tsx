import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import AuthInitializer from "@/components/AuthInitializer";
import AppShell from "@/components/AppShell"; // <--- Import the Shell

export const metadata: Metadata = {
  title: "Streamify",
  description: "Next.js Video Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <StoreProvider>
          <AuthInitializer>
            <Navbar />
            
            {/* Replace the old hardcoded divs with AppShell */}
            <AppShell>
               {children}
            </AppShell>

          </AuthInitializer>
        </StoreProvider>
      </body>
    </html>
  );
}