/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { Menu, X } from "lucide-react";

// Dummy data for player stats
const dummyStats = {
  playerId: "123456789",
  username: "TravelerLumine",
  adventureRank: 60,
  worldLevel: 8,
  achievements: 520,
  spiralAbyss: "12-3",
  characters: [
    {
      name: "Ayaka",
      level: 90,
      constellation: 4,
      weapon: "Mistsplitter Reforged",
      buildQuality: "Well Built",
      buildIcon: "✅",
    },
    {
      name: "Raiden",
      level: 85,
      constellation: 2,
      weapon: "Engulfing Lightning",
      buildQuality: "Average",
      buildIcon: "⚠️",
    },
    {
      name: "Keqing",
      level: 80,
      constellation: 1,
      weapon: "Lion's Roar",
      buildQuality: "Needs Improvement",
      buildIcon: "❌",
    },
  ],
};

// Dummy IP lookup function
async function fetchPlayerIP(playerId: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return "192.168.1.100"; // Dummy IP
}

// Dummy stats fetch function
async function fetchPlayerStats(playerId: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return dummyStats;
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  sizeClass,
}: {
  src: string;
  alt: string;
  className?: string;
  sizeClass: string;
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div
      className={`${sizeClass} rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-800 shadow-md hover:scale-105 transition-transform ${className}`}
    >
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImgSrc("/img/characters/default.png")}
      />
    </div>
  );
};

export default function YourStat() {
  const [playerId, setPlayerId] = useState("");
  const [playerIP, setPlayerIP] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle player ID search
  const handleSearch = async () => {
    if (!playerId) {
      setError("Please enter a Player ID");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const ip = await fetchPlayerIP(playerId);
      const statsData = await fetchPlayerStats(playerId);
      setPlayerIP(ip);
      setStats(statsData);
    } catch (err) {
      setError("Failed to fetch player data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
      <Head>
        <title>Your Stat - Genshin Guide</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>

      {/* Navbar */}
      <nav
        className={`bg-[#16324c] px-6 py-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-opacity-90 scale-[0.98] shadow-xl" : "bg-opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <ImageWithFallback
              src="/img/etc/ayaka.jpg"
              alt="Logo"
              sizeClass="w-10 h-10"
              className="rounded-full mr-4 border-2 border-gray-600"
            />
            <div className="text-2xl font-bold mr-8">GenshinGuide</div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-blue-300 transition duration-200">
                Character
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300 transition duration-200">
                Farming
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300 transition duration-200">
                Meta Char
              </Link>
            </div>
          </div>
          <select
            className="bg-[#16324c] text-white border border-white/20 rounded px-3 py-1.5 text-sm hidden md:block hover:bg-[#1e1d22] transition duration-200"
          >
            <option>English</option>
            <option>Indonesia</option>
            <option>日本語</option>
          </select>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 px-4 text-sm animate-slideIn">
            <Link href="/" className="hover:text-blue-300 transition duration-200">
              Character
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-300 transition duration-200">
              Farming
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-300 transition duration-200">
              Meta Char
            </Link>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="bg-[#252529] rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center animate-fadeIn">
            Your Genshin Impact Stats
          </h1>

          {/* Player ID Search */}
          <div className="text-center mb-12 animate-fadeIn delay-100">
            <p className="text-lg mb-4">Enter your Player ID to view your game statistics and IP information.</p>
            <div className="flex justify-center gap-4 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Input your Player ID"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
                className="bg-[#2a2a2e] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isLoading ? "Loading..." : "Search"}
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Player Stats Display */}
          {stats && (
            <div className="animate-fadeIn delay-200">
              {/* Player Info */}
              <Section title="Player Profile">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                  <ImageWithFallback
                    src="/img/characters/traveler.webp"
                    alt={stats.username}
                    sizeClass="w-32 h-32 md:w-40 md:h-40"
                    className="rounded-xl border-4 border-gray-600"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold mb-3">{stats.username}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <p><strong>Player ID:</strong> {stats.playerId}</p>
                      <p><strong>Adventure Rank:</strong> {stats.adventureRank}</p>
                      <p><strong>World Level:</strong> {stats.worldLevel}</p>
                      <p><strong>Player IP:</strong> {playerIP}</p>
                      <p><strong>Achievements:</strong> {stats.achievements}</p>
                      <p><strong>Spiral Abyss:</strong> {stats.spiralAbyss}</p>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Character Stats */}
              <Section title="Character Builds">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.characters.map((char: any, index: number) => (
                    <div
                      key={index}
                      className="bg-[#2a2a36] rounded-xl p-5 border border-gray-600 hover:shadow-xl"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <ImageWithFallback
                          src={`/img/genshinchar/${char.name.toLowerCase()}.webp`}
                          alt={char.name}
                          sizeClass="w-16 h-16"
                          className="rounded-full"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-blue-300">{char.name}</h4>
                          <p className="text-sm text-gray-400">Level: {char.level}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p><strong>Constellation:</strong> {char.constellation}</p>
                        <p><strong>Weapon:</strong> {char.weapon}</p>
                        <p>
                          <strong>Build Quality:</strong> {char.buildIcon} {char.buildQuality}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#16324c] text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex justify-center gap-6">
            {[
              { href: "https://facebook.com/kadekjuli", icon: "/facebook-icon.png", alt: "Facebook" },
              { href: "https://discord.com/notdkjuli", icon: "/discord-icon.png", alt: "Discord" },
              { href: "https://youtube.com", icon: "/youtube-icon.png", alt: "YouTube" },
            ].map(({ href, icon, alt }) => (
              <Link key={alt} href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-110">
                <img src={icon} alt={alt} className="w-8 h-8" />
              </Link>
            ))}
          </div>
          <div className="text-sm text-center">
            © 2025 Kadek Juli. All rights reserved.<br />
            <span className="text-gray-400">This Web is Under Development</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-10">
    <h2 className="text-2xl md:text-3xl font-bold mb-4 border-l-4 border-blue-400 pl-3">{title}</h2>
    {children}
  </div>
);