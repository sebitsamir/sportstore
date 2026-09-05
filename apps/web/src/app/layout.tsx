import type { Metadata } from "next";
import { Outfit, Teko } from "next/font/google";
import { StoreProvider } from "@/store/store";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sport Store — Football & Basketball Gear",
    template: "%s · Sport Store",
  },
  description:
    "Sport Store — premium football and basketball gear for the pitch and the court.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${teko.variable} h-full`}>
      <body className="min-h-full antialiased">
        <StoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </StoreProvider>
      </body>
    </html>
  );
}
