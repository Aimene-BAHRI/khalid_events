"use client";

import { LanguageProvider } from "./context/languageContext";
import AppLayout from "@/components/AppLayout";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AppLayout>{children}</AppLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
