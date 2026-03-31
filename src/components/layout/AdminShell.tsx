'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-950 flex relative">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      
      {/* Hamburger Menu to Open */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-3.5 left-4 z-40 p-2 text-zinc-400 hover:text-emerald-400 bg-zinc-900 border border-zinc-800 rounded-lg shadow-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Main content wrapper */}
      <main 
        className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? 'ml-0 sm:ml-64' : 'ml-0'
        }`}
      >
        <div className="w-full relative">
          {children}
        </div>
      </main>
    </div>
  );
}
