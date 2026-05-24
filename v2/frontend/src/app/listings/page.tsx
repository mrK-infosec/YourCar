import React from 'react';

export default function ListingsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title & Status */}
      <div className="space-y-2 border-b border-zinc-900 pb-6 text-left">
        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
          Phase 1 Active Route
        </span>
        <h1 className="text-3xl font-extrabold text-white font-sans tracking-tight">
          UAE Certified Fleet
        </h1>
        <p className="text-sm text-zinc-500">
          Showing mock results for Phase 1 routing verification.
        </p>
      </div>

      {/* Empty State / Grid Mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="rounded-xl border border-zinc-900 bg-zinc-900/10 p-6 space-y-4">
            <div className="aspect-[16/9] w-full bg-zinc-900 rounded-lg animate-pulse" />
            <div className="space-y-2 text-left">
              <div className="h-4 w-1/3 bg-zinc-800 rounded animate-pulse" />
              <div className="h-6 w-2/3 bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse" />
            </div>
            <div className="border-t border-zinc-900 pt-4 flex justify-between items-center text-xs">
              <span className="text-zinc-600">Pending DB Phase 2...</span>
              <span className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
