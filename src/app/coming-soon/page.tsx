"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function ComingSoon() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isSelectGameDropdownOpen, setIsSelectGameDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white flex flex-col">
      {/* Navbar */}
      <nav
        className={`bg-[#16324c] px-6 py-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-opacity-90 scale-[0.98] shadow-xl" : "bg-opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
              <img
                src="/img/etc/ayaka.jpg"
                alt="Genshin Impact"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-2xl font-bold mr-8">juligenshin</div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="relative group">
                <button
                  className="hover:underline transition duration-200"
                  onClick={() => setIsGuideDropdownOpen(!isGuideDropdownOpen)}
                >
                  Guide
                </button>
                {isGuideDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow-lg p-2 rounded mt-2 w-32 animate-fadeIn">
                    <Link
                      href="/"
                      className="block px-4 py-2 hover:bg-[#2a2a2e] rounded transition duration-200"
                    >
                      Character
                    </Link>
                    <Link
                      href="/coming-soon"
                      className="block px-4 py-2 hover:bg-[#2a2a2e] rounded transition duration-200"
                    >
                      Your Stat
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/coming-soon" className="hover:underline transition duration-200">
                Farming
              </Link>
              <Link href="/coming-soon" className="hover:underline transition duration-200">
                Meta Char
              </Link>
              <div className="relative group">
                <button
                  className="hover:underline transition duration-200"
                  onClick={() => setIsSelectGameDropdownOpen(!isSelectGameDropdownOpen)}
                >
                  Select Game
                </button>
                {isSelectGameDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow-lg p-2 rounded mt-2 w-48 animate-fadeIn">
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2e] rounded transition duration-200"
                    >
                      <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
                    </Link>
                    <Link
                      href="/coming-soon"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2e] rounded transition duration-200"
                    >
                      <img src="/img/etc/unnamed.png" className="w-5 h-5" alt="HSR" /> Honkai: Star
                      Rail
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <select
            className="bg-[#16324c] text-white border border-white/20 rounded px-3 py-1.5 text-sm hidden md:block hover:bg-[#1e1d22] transition duration-200"
          >
            <option>English</option>
            <option>Indonesia</option>
            <option>日本語</option>
          </select>
          <div className="md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 px-4 text-sm animate-slideIn">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-base">Guide</span>
              <Link href="/" className="hover:underline">
                Character
              </Link>
              <Link href="/coming-soon" className="hover:underline">
                Your Stat
              </Link>
            </div>
            <Link href="/coming-soon" className="hover:underline">
              Farming
            </Link>
            <Link href="/coming-soon" className="hover:underline">
              Meta Char
            </Link>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-base">Select Game</span>
              <Link href="/" className="flex items-center gap-2">
                <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
              </Link>
              <Link href="/coming-soon" className="flex items-center gap-2">
                <img src="/img/etc/unnamed.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
              </Link>
            </div>
            <select
              className="bg-[#16324c] text-white border border-white/20 rounded px-3 py-1.5 text-sm w-fit hover:bg-[#1e1d22] transition duration-200"
            >
              <option>English</option>
              <option>Indonesia</option>
              <option>日本語</option>
            </select>
          </div>
        )}
      </nav>

      {/* Coming Soon Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fadeIn">
          Coming Soon!
        </h1>
        <p className="text-gray-400 mb-8 max-w-md text-base sm:text-lg animate-fadeIn delay-100">
          We're working hard to bring this feature to life. Stay tuned for something awesome!
        </p>
        <img
          src="/img/etc/ayaka.gif"
          alt="Coming Soon"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto mb-8 animate-fadeIn delay-200"
        />
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn delay-300">
          <Link
            href="/"
            className="bg-gradient-to-r from-[#16324c] to-[#2a2a2e] px-6 py-3 rounded-lg text-sm font-semibold hover:from-[#2a2a2e] hover:to-[#16324c] transition-all duration-300 shadow-md"
          >
            Back to Homepage
          </Link>
          <Link
            href="/"
            className="border border-white/20 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-[#2a2a2e] transition-all duration-300"
          >
            Browse Characters
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#16324c] text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex justify-center gap-6">
            <Link
              href="https://facebook.com/kadekjuli"
              className="hover:scale-110 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/facebook-icon.png" alt="Facebook" className="w-8 h-8" />
            </Link>
            <Link
              href="https://discord.com/notdkjuli"
              className="hover:scale-110 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/discord-icon.png" alt="Discord" className="w-8 h-8" />
            </Link>
            <Link
              href="https://youtube.com"
              className="hover:scale-110 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/youtube-icon.png" alt="YouTube" className="w-8 h-8" />
            </Link>
          </div>
          <div className="text-sm text-center">© 2025 Kadek Juli. All rights reserved.</div>
          <div className="text-sm text-center text-gray-400">This Web is Under Development</div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}