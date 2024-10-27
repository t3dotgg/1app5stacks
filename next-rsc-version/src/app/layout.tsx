import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Roundest - RSC edition",
  description: "A web app for voting on which Pokemon is the most round",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-bold">Roundest</h1>
              </Link>
              <nav className="flex gap-4">
                <Link
                  href="/prefetched"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Prefetched
                </Link>
                <Link
                  href="/results"
                  className="text-blue-500 hover:text-blue-600"
                >
                  Results
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="py-4">
          <div className="container mx-auto px-4"></div>
        </footer>
      </body>
    </html>
  );
}
