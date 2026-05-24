import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revora UAE - Premium Car Marketplace",
  description: "Find certified sports, luxury, and family cars in Dubai, Abu Dhabi, and across the UAE. Inspired by pkw.de.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-red-500/30 selection:text-red-200">
        {/* Elite Brand Header */}
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-red-400 font-black text-black shadow-md shadow-red-500/20">
                  {/* Localized steering wheel / speed indicator SVG */}
                  <svg className="h-5 w-5 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    <path d="M2 12h20" />
                  </svg>
                </div>
                <span className="font-sans text-xl font-extrabold tracking-tight text-white uppercase">
                  Revora<span className="text-red-500 font-light ml-0.5">UAE</span>
                </span>
              </a>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
                <a href="/listings" className="transition-colors hover:text-white">Browse Fleet</a>
                <a href="#dealers" className="transition-colors hover:text-white">Elite Dealers</a>
                <a href="#favorites" className="transition-colors hover:text-white">Favorites</a>
                <a href="#about" className="transition-colors hover:text-white">About pkw.ae</a>
              </nav>
            </div>

            {/* Localized AED emirates badge & Action CTAs */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-semibold text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>UAE (AED)</span>
              </div>
              <a 
                href="/listings"
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-500/10 transition-all hover:bg-red-500 hover:shadow-red-500/20 active:scale-95"
              >
                Sell My Car
              </a>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-grow flex flex-col">{children}</main>

        {/* Corporate Premium Brand Footer */}
        <footer className="border-t border-zinc-900 bg-black text-left">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Column A: Logo & Brand Pitch */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-red-600 to-red-400 font-black text-black">
                    <svg className="h-4 w-4 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <span className="font-bold text-sm tracking-tight text-white uppercase">REVORA UAE</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                  Inspired by Germany's pkw.de, Revora is the UAE's premier dealer-certified car marketplace offering premium vehicles in Dubai, Abu Dhabi, and Sharjah.
                </p>
              </div>

              {/* Column B: Sitemap Fleet */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Sitemap Fleet</h4>
                <ul className="space-y-2 text-xs text-zinc-500">
                  <li><a href="/listings" className="hover:text-red-500 transition-colors">Search Used Cars</a></li>
                  <li><a href="/listings" className="hover:text-red-500 transition-colors">Search Brand New Cars</a></li>
                  <li><a href="#dealers" className="hover:text-red-500 transition-colors">Partner Dealers</a></li>
                </ul>
              </div>

              {/* Column C: Operating Hours */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Showroom Hours</h4>
                <ul className="space-y-2 text-xs text-zinc-500">
                  <li>Monday - Saturday: 09:00 - 21:00</li>
                  <li>Sunday: 14:00 - 20:00 (Showcase)</li>
                  <li>All UAE Emirates Deliveries</li>
                </ul>
              </div>

              {/* Column D: Support Desk */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Support Desk</h4>
                <ul className="space-y-2 text-xs text-zinc-500">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">📍</span>
                    <span>Sheikh Zayed Rd, Dubai, UAE</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">📞</span>
                    <span>+971 4 555-REVORA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">✉️</span>
                    <span>support@revora.ae</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-zinc-600 gap-4">
              <span>&copy; {new Date().getFullYear()} Revora UAE. Certified Dealer Network. Inspired by pkw.de.</span>
              <div className="flex gap-4">
                <a href="#privacy" className="hover:text-red-500">Privacy Policy</a>
                <a href="#terms" className="hover:text-red-500">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
