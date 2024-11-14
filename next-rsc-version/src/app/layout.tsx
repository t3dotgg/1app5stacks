import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist();

export const metadata = {
  title: "Roundest (RSC Version)",
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
        className={`${geistSans.className} antialiased bg-gray-950 text-white flex flex-col justify-between min-h-screen border-t-2 border-blue-300`}
      >
        <header className="py-4 px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <Link href="/" className="font-bold text-3xl">
                round<span className="text-blue-300">est</span>
                <span className="text-gray-400 font-extralight pl-2 text-2xl">
                  (React Server Components)
                </span>
              </Link>
            </div>
            <nav className="flex flex-row items-center gap-8">
              <Link
                href="/turbo"
                className="hover:underline text-lg"
                prefetch={false}
              >
                Turbo Version
              </Link>
              <Link href="/results" className="hover:underline text-lg">
                Results
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="font-light text-center py-3 text-gray-500">
          <a
            href="https://github.com/t3dotgg/1app5stacks"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
