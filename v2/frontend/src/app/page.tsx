import Image from "next/image";

export default function Home() {
  const emirates = [
    "All Emirates",
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain"
  ];

  const popularBrands = [
    { name: "Toyota", count: "1,842 listings" },
    { name: "Nissan", count: "1,290 listings" },
    { name: "Mercedes-Benz", count: "956 listings" },
    { name: "BMW", count: "840 listings" },
    { name: "Lexus", count: "721 listings" },
    { name: "Porsche", count: "489 listings" }
  ];

  return (
    <div className="flex flex-col min-h-full">
      {/* 1. HERO SECTION WITH SEARCH SYSTEM MOCKUP */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        {/* Futuristic Background Blur */}
        <div className="absolute top-0 left-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[300px] w-[500px] translate-x-1/2 rounded-full bg-red-500/5 blur-[100px]" />

        <div className="relative mx-auto max-w-5xl text-center space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 uppercase tracking-widest border border-red-500/20">
              ⚡ Certified UAE Dealer Network
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl font-sans">
              Find Your Next Elite Drive in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">UAE</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-zinc-400">
              The UAE's high-performance car marketplace. Inspired by Germany's pkw.de — offering transparency, price indicators, and trusted dealership listings.
            </p>
          </div>

          {/* Localized UAE Search Box Panel */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md shadow-2xl shadow-black/80">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              {/* Brand Select */}
              <div className="flex flex-col text-left space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand / Model</label>
                <select className="h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none focus:border-red-500 transition-colors">
                  <option>All Brands</option>
                  <option>Toyota</option>
                  <option>Nissan</option>
                  <option>Mercedes-Benz</option>
                  <option>BMW</option>
                  <option>Lexus</option>
                </select>
              </div>

              {/* Emirate Select */}
              <div className="flex flex-col text-left space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Emirate Location</label>
                <select className="h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none focus:border-red-500 transition-colors">
                  {emirates.map((emirate) => (
                    <option key={emirate}>{emirate}</option>
                  ))}
                </select>
              </div>

              {/* Max Price Select */}
              <div className="flex flex-col text-left space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Max Price (AED)</label>
                <select className="h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-300 outline-none focus:border-red-500 transition-colors">
                  <option>No Limit</option>
                  <option>50,000 AED</option>
                  <option>100,000 AED</option>
                  <option>150,000 AED</option>
                  <option>250,000 AED</option>
                  <option>500,000 AED +</option>
                </select>
              </div>

              {/* Search button */}
              <div className="flex items-end">
                <a 
                  href="/listings"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 font-bold text-white shadow-lg shadow-red-500/10 hover:bg-red-500 hover:shadow-red-500/20 transition-all duration-300 active:scale-[0.98]"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  Search Fleet
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PKW.DE VALUE SYSTEM SECTIONS */}
      <section className="bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider font-sans sm:text-3xl">
              Engineered For Transparency
            </h2>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              We import the high-fidelity features of pkw.de to the Middle East.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 font-bold text-lg">
                🏷️
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Price Indicator System</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Our database automatically benchmarks vehicles against live UAE market data to flag deals as "Super Price", "Fair Price", or "Overpriced" instantly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 font-bold text-lg">
                🤝
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Verified Dealers Only</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Zero spam listings. Every dealer undergoes a background check and physical verification inside the Emirates before listing is approved.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-900/30 p-6 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10 text-red-500 font-bold text-lg">
                ⏱️
              </div>
              <h3 className="text-lg font-bold text-white font-sans">Fast-Lane Checkout</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Instantly connect with showroom advisors, request online reservation sheets, or book certified inspection appointments in under 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR BRANDS GRID */}
      <section className="bg-zinc-950 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-12">
          <div className="flex justify-between items-end border-b border-zinc-900 pb-4">
            <h2 className="text-xl font-bold text-white font-sans uppercase tracking-wider">
              Explore Popular Brands
            </h2>
            <a href="/listings" className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors">
              View All Brands &rarr;
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {popularBrands.map((brand) => (
              <a 
                key={brand.name}
                href={`/listings?brand=${brand.name}`}
                className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-red-500/30 hover:-translate-y-1 transition-all duration-300 gap-2"
              >
                <span className="font-extrabold text-sm text-zinc-100">{brand.name}</span>
                <span className="text-[10px] text-zinc-600 font-medium">{brand.count}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
