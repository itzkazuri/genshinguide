"use client";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function ComingSoon() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isSelectGameDropdownOpen, setIsSelectGameDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white flex flex-col">
      <nav className="bg-[#16324c] px-6 py-3 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-4">
              <img src="/img/etc/ayaka.jpg" alt="Genshin Impact" className="w-full h-full object-cover" />
            </div>
            <div className="text-xl font-bold mr-8">juligenshin</div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="relative group">
                <button
                  className="hover:underline"
                  onClick={() => setIsGuideDropdownOpen(!isGuideDropdownOpen)}
                >
                  Guide
                </button>
                {isGuideDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow p-2 rounded mt-2 w-32">
                    <a href="/" className="block px-4 py-1 hover:bg-[#2a2a2e]">Character</a>
                    <a href="/coming-soon" className="block px-4 py-1 hover:bg-[#2a2a2e]">Your Stat</a>
                  </div>
                )}
              </div>
              <a href="/coming-soon" className="hover:underline">Farming</a>
              <a href="/coming-soon" className="hover:underline">Meta Char</a>
              <div className="relative group">
                <button
                  className="hover:underline"
                  onClick={() => setIsSelectGameDropdownOpen(!isSelectGameDropdownOpen)}
                >
                  Select Game
                </button>
                {isSelectGameDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow p-2 rounded mt-2 w-48">
                    <a href="/" className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2a2e]">
                      <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
                    </a>
                    <a href="/coming-soon" className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2a2e]">
                      <img src="/img/etc/unnamed.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <select className="bg-[#16324c] text-white border border-white rounded px-2 py-1 text-sm hidden md:block">
            <option>English</option>
            <option>Indonesia</option>
            <option>日本語</option>
          </select>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 px-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Guide</span>
              <a href="/">Character</a>
              <a href="/coming-soon">Your Stat</a>
            </div>
            <a href="/coming-soon">Farming</a>
            <a href="/coming-soon">Meta Char</a>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Select Game</span>
              <a href="/" className="flex items-center gap-2">
                <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
              </a>
              <a href="/coming-soon" className="flex items-center gap-2">
                <img src="/hsr-icon.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
              </a>
            </div>
            <select className="bg-[#16324c] text-white border border-white rounded px-2 py-1 text-sm w-fit">
              <option>English</option>
              <option>Indonesia</option>
              <option>日本語</option>
            </select>
          </div>
        )}
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold mb-4"> Coming Soon </h1>
        <p className="text-gray-400 mb-6 max-w-md">
          This feature is still under development. Stay tuned for future updates!
        </p>
        {/* TEMPAT TARO GIF/GSAP */}
        <img src="/img/etc/ayaka.gif" alt="Coming Soon" className="w-64 h-auto" />
      </main>

      <footer className="bg-[#16324c] text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:opacity-80 transition"><img src="/twitter-icon.png" alt="Twitter" className="w-6 h-6" /></a>
            <a href="#" className="hover:opacity-80 transition"><img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#" className="hover:opacity-80 transition"><img src="/discord-icon.png" alt="Discord" className="w-6 h-6" /></a>
            <a href="#" className="hover:opacity-80 transition"><img src="/youtube-icon.png" alt="YouTube" className="w-6 h-6" /></a>
          </div>
          <div className="text-xs text-center">© 2025 Kadek Juli. All rights reserved.</div>
          <div className="text-xs text-center">This Web Under Development</div>
        </div>
      </footer>
    </div>
  );
}
