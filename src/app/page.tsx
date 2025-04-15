/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CharacterCard from "@/Components/CharacterCard";
import { Menu, X } from "lucide-react";

interface Character {
  name: string;
  image: string;
  rarity: number;
  vision: string;
  weapon: string;
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const [isSelectGameDropdownOpen, setIsSelectGameDropdownOpen] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: Set<string> }>({
    rarity: new Set(),
    vision: new Set(),
    weapon: new Set(),
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load characters
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetch("/characters.json");
        const data: Character[] = await response.json();
        const sorted = data.sort((a, b) => {
          if (b.rarity !== a.rarity) return b.rarity - a.rarity;
          return a.name.localeCompare(b.name);
        });
        setCharacters(sorted);
      } catch (error) {
        console.error("Failed to load characters:", error);
      }
    };

    loadCharacters();
  }, []);

  const filters = [
    { type: "rarity", value: "5", image: "/5-star.png" },
    { type: "rarity", value: "4", image: "/4-star.png" },
    { type: "vision", value: "anemo", image: "/img/vision/element_anemo.webp" },
    { type: "vision", value: "geo", image: "/img/vision/element_geo.webp" },
    { type: "vision", value: "electro", image: "/img/vision/element_electro.webp" },
    { type: "vision", value: "dendro", image: "/img/vision/element_dendro.webp" },
    { type: "vision", value: "hydro", image: "/img/vision/element_hydro.webp" },
    { type: "vision", value: "pyro", image: "/img/vision/element_pyro.webp" },
    { type: "vision", value: "cryo", image: "/img/vision/element_cryo.webp" },
    { type: "weapon", value: "sword", image: "/sword.png" },
    { type: "weapon", value: "claymore", image: "/claymore.png" },
    { type: "weapon", value: "bow", image: "/bow.png" },
    { type: "weapon", value: "catalyst", image: "/catalyst.png" },
  ];

  const toggleFilter = (type: string, value: string) => {
    setActiveFilters((prev) => {
      const currentSet = new Set(prev[type]);
      return {
        ...prev,
        [type]: currentSet.has(value) ? new Set() : new Set([value]),
      };
    });
  };

  const isCharacterMatched = (character: Character) => {
    const vision = character.vision?.toLowerCase() ?? "";
    const weapon = character.weapon?.toLowerCase() ?? "";
    return (
      (activeFilters.rarity.size === 0 || activeFilters.rarity.has(String(character.rarity))) &&
      (activeFilters.vision.size === 0 || activeFilters.vision.has(vision)) &&
      (activeFilters.weapon.size === 0 || activeFilters.weapon.has(weapon))
    );
  };

  const filteredCharacters = characters.filter(isCharacterMatched);

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
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
                  <div className="absolute left-0 bg-[#  shadow-lg p-2 rounded mt-2 w-32 animate-fadeIn">
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
                      href="#"
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
            <Link href="#" className="hover:underline">
              Meta Char
            </Link>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-base">Select Game</span>
              <Link href="/coming-soon" className="flex items-center gap-2">
                <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <img src="/hsr-icon.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
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

      <main className="p-6 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">Character List</h1>

        <div className="bg-[#16324c] rounded-xl px-4 py-3 mb-8 overflow-x-auto shadow-md">
          <div className="flex items-center gap-3 justify-center text-xs flex-wrap">
            <div className="flex items-center gap-2 pr-4 border-r border-[#2a2a2e]">
              {filters.slice(0, 2).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500 w-8 h-8"
                      : "bg-[#1e1d22] w-6 h-6 hover:bg-[#2a2a2e] hover:scale-110"
                  }`}
                >
                  <img
                    src={filter.image}
                    alt={filter.value}
                    className="w-4 h-4 object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pr-4 border-r border-[#2a2a2e]">
              {filters.slice(2, 9).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500 w-8 h-8"
                      : "bg-[#1e1d22] w-6 h-6 hover:bg-[#2a2a2e] hover:scale-110"
                  }`}
                >
                  <img
                    src={filter.image}
                    alt={filter.value}
                    className="w-4 h-4 object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {filters.slice(9).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`flex items-center justify-center rounded-full transition-all duration-200 ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500 w-8 h-8"
                      : "bg-[#1e1d22] w-6 h-6 hover:bg-[#2a2a2e] hover:scale-110"
                  }`}
                >
                  <img
                    src={filter.image}
                    alt={filter.value}
                    className="w-4 h-4 object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        
<div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2 sm:px-4">
  {filteredCharacters.length === 0 ? (
    <div className="col-span-full text-center text-base text-gray-400">
      Character Not Found.
    </div>
  ) : (
    filteredCharacters.map((character, index) => (
      <Link key={index} href={`/character/${slugify(character.name)}`}>
        <div className="transform transition duration-200 hover:scale-105 hover:shadow-lg">
          <CharacterCard
            name={character.name}
            image={character.image}
            rarity={character.rarity}
            vision={character.vision} // Tambahkan prop vision
          />
        </div>
      </Link>
    ))
  )}
</div>
      </main>

      <footer className="bg-[#16324c] text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="flex justify-center gap-6">
            <Link
              href="https://facebook.com/kadekjuli"
              className="hover:opacity-80 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/facebook-icon.png" alt="Facebook" className="w-8 h-8" />
            </Link>
            <Link
              href="https://discord.com/notdkjuli"
              className="hover:opacity-80 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/discord-icon.png" alt="Discord" className="w-8 h-8" />
            </Link>
            <Link
              href="https://youtube.com"
              className="hover:opacity-80 transition duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/youtube-icon.png" alt="YouTube" className="w-8 h-8" />
            </Link>
          </div>
          <div className="text-sm text-center">
            © 2025 Kadek Juli. All rights reserved.
          </div>
          <div className="text-sm text-center text-gray-400">
            This Web is Under Development
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}