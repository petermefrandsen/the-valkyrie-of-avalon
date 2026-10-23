import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.thevalkyrieofavalon.com"),
  title: "The Valkyrie of Avalon | Handcrafted Artisan Goods & Small-Batch Crafts",
  description: "Independent artisan workshop producing hand-bound leather journals, forged jewelry, carved wood items, and small-batch pottery.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://www.thevalkyrieofavalon.com",
    title: "The Valkyrie of Avalon",
    description: "Independent artisan workshop producing hand-bound leather journals, forged jewelry, carved wood items, and small-batch pottery.",
    siteName: "The Valkyrie of Avalon",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-main)] text-[var(--text-body)] transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
