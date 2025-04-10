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
    vision: new Set(), // Ganti dari element ke vision
    weapon: new Set(),
  });


  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const response = await fetch("/characters.json");
        const data: Character[] = await response.json(); // Cast data ke tipe Character[]
  
        const sorted = data.sort((a, b) => {
          if (b.rarity !== a.rarity) return b.rarity - a.rarity;
          return a.name.localeCompare(b.name);
        });
  
        setCharacters(sorted);
      } catch (error) {
        console.error("Gagal memuat karakter:", error);
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
    setActiveFilters(prev => {
      const currentSet = new Set(prev[type]);

      // Kalau udah dipilih, maka hapus (toggle off)
      if (currentSet.has(value)) {
        return { ...prev, [type]: new Set() };
      }

      // Kalau belum dipilih, ganti isinya jadi satu itu aja
      return { ...prev, [type]: new Set([value]) };
    });
  };


  const isCharacterMatched = (character: Character) => {
    const rarityMatch =
      activeFilters.rarity.size === 0 || activeFilters.rarity.has(String(character.rarity));

      const vision = character.vision ? character.vision.toLowerCase() : "";

    const weapon = character.weapon ? character.weapon.toLowerCase() : "";

    const visionMatch =
  activeFilters.vision.size === 0 || activeFilters.vision.has(vision);


    const weaponMatch =
      activeFilters.weapon.size === 0 || activeFilters.weapon.has(weapon);

    return rarityMatch && visionMatch && weaponMatch;
  };

  const filteredCharacters = characters.filter(isCharacterMatched);

  const isNoMatch = filteredCharacters.length === 0 && (
    activeFilters.rarity.size > 0 ||
    activeFilters.vision.size > 0 ||
    activeFilters.weapon.size > 0
  );

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
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
                    <Link href="/" className="block px-4 py-1 hover:bg-[#2a2a2e]">Character</Link>
                    <Link href="/coming-soon" className="block px-4 py-1 hover:bg-[#2a2a2e]">Your Stat</Link>
                  </div>
                )}
              </div>
              <Link href="/coming-soon" className="hover:underline">Farming</Link>
              <Link href="/coming-soon" className="hover:underline">Meta Char</Link>
              <div className="relative group">
                <button
                  className="hover:underline"
                  onClick={() => setIsSelectGameDropdownOpen(!isSelectGameDropdownOpen)}
                >
                  Select Game
                </button>
                {isSelectGameDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow p-2 rounded mt-2 w-48">
                    <Link href="#" className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2a2e]">
                      <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
                    </Link>
                    <Link href="/coming-soon" className="flex items-center gap-2 px-4 py-1 hover:bg-[#2a2a2e]">
                      <img src="/img/etc/unnamed.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
                    </Link>
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
              <Link href="/">Character</Link>
              <Link href="/coming-soon">Your Stat</Link>
            </div>
            <Link href="/coming-soon">Farming</Link>
            <Link href="#">Meta Char</Link>
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Select Game</span>
              <Link href="/coming-soon" className="flex items-center gap-2">
                <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
              </Link>
              <Link href="#" className="flex items-center gap-2">
                <img src="/hsr-icon.png" className="w-5 h-5" alt="HSR" /> Honkai: Star Rail
              </Link>
            </div>
            <select className="bg-[#16324c] text-white border border-white rounded px-2 py-1 text-sm w-fit">
              <option>English</option>
              <option>Indonesia</option>
              <option>日本語</option>
            </select>
          </div>
        )}
      </nav>

      <main className="p-6 flex-grow">
        <h1 className="text-2xl font-bold text-center mb-4">Character List</h1>

        <div className="bg-[#16324c] rounded-lg px-4 py-2 mb-6 overflow-x-auto">
          <div className="flex items-center gap-2 justify-center text-xs">
            <div className="flex items-center gap-1 pr-3 border-r border-[#2a2a2e]">
              {filters.slice(0, 2).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500"
                      : "bg-[#1e1d22] hover:bg-[#2a2a2e]"
                  }`}
                >
                  <img src={filter.image} alt={filter.value} className="w-4 h-4 object-contain" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 pr-3 border-r border-[#2a2a2e]">
              {filters.slice(2, 9).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500"
                      : "bg-[#1e1d22] hover:bg-[#2a2a2e]"
                  }`}
                >
                  <img src={filter.image} alt={filter.value} className="w-4 h-4 object-contain" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              {filters.slice(9).map((filter, index) => (
                <button
                  key={index}
                  onClick={() => toggleFilter(filter.type, filter.value)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition ${
                    activeFilters[filter.type].has(filter.value)
                      ? "bg-yellow-500"
                      : "bg-[#1e1d22] hover:bg-[#2a2a2e]"
                  }`}
                >
                  <img src={filter.image} alt={filter.value} className="w-4 h-4 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2 sm:px-4">
        {isNoMatch ? (
        <div className="col-span-full text-center text-sm text-gray-400">
          Characther Not Found.
        </div>
        ) : (
          filteredCharacters.map((character, index) => (
            <CharacterCard
            key={index}
            name={character.name}
            image={character.image}
          rarity={character.rarity}
          />
          ))
        )}

        </div>
      </main>

      <footer className="bg-[#16324c] text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="flex justify-center gap-4">
            <Link href="https://facebook.com/kadekjuli" className="hover:opacity-80 transition" target="_blank" rel="noopener noreferrer"><img src="/facebook-icon.png" alt="Facebook" className="w-6 h-6" /></Link>
            <Link href="https://discord.com/notdkjuli" className="hover:opacity-80 transition" target="_blank" rel="noopener noreferrer"><img src="/discord-icon.png" alt="Discord" className="w-6 h-6" /></Link>
            <Link href="https://youtube.com" className="hover:opacity-80 transition" target="_blank" rel="noopener noreferrer"><img src="/youtube-icon.png" alt="YouTube" className="w-6 h-6" /></Link>
          </div>
          <div className="text-xs text-center">© 2025 Kadek Juli. All rights reserved.</div>
          <div className="text-xs text-center">This Web Under Development</div>
        </div>
      </footer>
    </div>
  );
}