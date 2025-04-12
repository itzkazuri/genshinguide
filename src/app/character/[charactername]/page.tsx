"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from 'next/image';
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface CharacterData {
  name: string;
  element: string;
  weapon: string;
  image: string;
  rarity: number;
  talentUpGuide: string[];
  bestWeapons: { name: string; image: string }[];
  materialFarming: {
    talentBooks: string;
    bossMaterial: string;
    commonMaterial: string;
    ascensionGem: string;
    localSpecialty: string;
    totalMora: string;
  };
  artifactSubstats: {
    freezeParty?: string[];
    meltParty?: string[];
    [key: string]: string[] | undefined;
  };
  teams: {
    [key: string]: { members: string[]; description?: string };
  };
  partyImagePath?: string;
  showcaseVideo?: string;
}

// Updated function to get element image path
const getElementImage = (element: string) => {
  switch (element.toLowerCase()) {
    case "pyro":
      return "/img/Vision/element_pyro.webp";
    case "hydro":
      return "/img/Vision/element_hydro.webp";
    case "anemo":
      return "/img/Vision/element_anemo.webp";
    case "electro":
      return "/img/Vision/element_electro.webp";
    case "dendro":
      return "/img/Vision/element_dendro.webp";
    case "cryo":
      return "/img/Vision/element_cryo.webp";
    case "geo":
      return "/img/Vision/element_geo.webp";
    default:
      return "/img/Vision/element_default.webp";
  }
};

// Komponen SmallIcon untuk ikon talent
const SmallIcon = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc("/img/characters/default.png");
      setHasError(true);
    }
  };

  return (
    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800 flex items-center justify-center shadow-md transition-transform hover:scale-105">
      <img
        src={imgSrc}
        alt={alt || "Talent Icon"}
        className="w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
};

// Komponen FarmingItem untuk material
const FarmingItem = ({ src, alt }: { src: string; alt: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc("/img/characters/default.png");
      setHasError(true);
    }
  };

  return (
    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-800 flex items-center justify-center shadow-md transition-transform hover:scale-105">
      <img
        src={imgSrc}
        alt={alt || "Material"}
        className="w-full h-full object-cover"
        onError={handleError}
      />
    </div>
  );
};

// Komponen PartyMember untuk anggota tim
const PartyMember = ({ src, alt, element }: { src: string; alt: string; element?: string }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc("/img/characters/default.png");
      setHasError(true);
    }
  };

  return (
    <div className="flex flex-col items-center group">
      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600 bg-gray-800 shadow-md transition-transform duration-200 group-hover:scale-105">
        <img
          src={imgSrc}
          alt={alt || "Party Member"}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      </div>
      {element && (
        <div className="w-6 h-6 rounded-full border border-gray-800 shadow-sm mt-2 flex items-center justify-center">
          <img
            src={getElementImage(element)}
            alt={element}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <span className="text-xs mt-1 text-center capitalize text-gray-200 group-hover:text-blue-300 transition-colors">
        {alt}
      </span>
    </div>
  );
};

// Komponen untuk menampilkan video showcase
const ShowcaseVideo = ({ videoUrl }: { videoUrl: string }) => {
  const getEmbedUrl = (url: string) => {
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return `https://www.youtube.com/embed/${url}`;
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <Section title="Showcase Video">
      <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-600 animate-fadeIn">
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl(videoUrl)}
            title="Character Showcase Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </Section>
  );
};

export default function CharacterDetailPage() {
  const params = useParams();
  const charactername = typeof params.charactername === "string" ? params.charactername : "";
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const res = await fetch(`/data/character/${charactername}.json`);
        if (!res.ok) throw new Error("Character not found");
        const data = await res.json();
        setCharacter(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (charactername) {
      fetchCharacter();
    } else {
      setError(true);
      setLoading(false);
    }
  }, [charactername]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1e1d22] text-white flex items-center justify-center">
        <div className="text-center text-lg animate-pulse">Loading...</div>
      </div>
    );
  if (error || !character) return notFound();

  const getTeamName = (key: string) => {
    const teamTypes: Record<string, string> = {
      freeze: "Freeze",
      melt: "Melt",
      vaporize: "Vaporize",
      spread: "Spread",
      aggravate: "Aggravate",
      hyperbloom: "Hyperbloom",
      burgeon: "Burgeon",
      mono: "Mono Element",
      national: "National",
      taser: "Taser",
      physical: "Physical",
    };

    const matchedType = Object.keys(teamTypes).find((type) => key.toLowerCase().includes(type));
    const baseName = key
      .replace(/([A-Z])/g, " $1")
      .replace(new RegExp(Object.keys(teamTypes).join("|"), "gi"), "")
      .replace(/TeamOption?/g, "")
      .trim();

    return matchedType ? `${teamTypes[matchedType]}${baseName ? ` ${baseName}` : ""}` : key.replace(/([A-Z])/g, " $1").trim();
  };

  const getCharacterElement = (characterName: string) => {
    const elementMap: Record<string, string> = {
      varesa: "Electro",
      diluc: "Pyro",
      kokomi: "Hydro",
      ayaka: "Cryo",
    };
    return elementMap[characterName.toLowerCase()] || "Unknown";
  };

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
      {/* Navbar */}
      <nav
        className={`bg-[#16324c] px-6 py-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-opacity-90 scale-[0.98] shadow-xl" : "bg-opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-4 border-2 border-gray-600">
              <img
                src="/img/etc/ayaka.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== "/img/characters/default.png") {
                    img.src = "/img/characters/default.png";
                  }
                }}
              />
            </div>
            <div className="text-2xl font-bold mr-8">juligenshin</div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="relative group">
                <button
                  className="hover:text-blue-300 transition-colors"
                  onClick={() => setIsGuideDropdownOpen(!isGuideDropdownOpen)}
                >
                  Guide
                </button>
                {isGuideDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow-lg p-2 rounded mt-2 w-32 animate-fadeIn">
                    <Link
                      href="/"
                      className="block px-4 py-2 hover:bg-[#2a2a2e] rounded transition-colors"
                    >
                      Character
                    </Link>
                    <Link
                      href="/coming-soon"
                      className="block px-4 py-2 hover:bg-[#2a2a2e] rounded transition-colors"
                    >
                      Your Stat
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/coming-soon" className="hover:text-blue-300 transition-colors">
                Farming
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300 transition-colors">
                Meta Char
              </Link>
              <div className="relative group">
                <button
                  className="hover:text-blue-300 transition-colors"
                  onClick={() => setIsSelectGameDropdownOpen(!isSelectGameDropdownOpen)}
                >
                  Select Game
                </button>
                {isSelectGameDropdownOpen && (
                  <div className="absolute left-0 bg-[#1e1d22] shadow-lg p-2 rounded mt-2 w-48 animate-fadeIn">
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2e] rounded transition-colors"
                    >
                      <img src="/genshin-icon.png" className="w-5 h-5" alt="Genshin" /> Genshin
                    </Link>
                    <Link
                      href="/coming-soon"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#2a2a2e] rounded transition-colors"
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
              <Link href="/" className="hover:text-blue-300">
                Character
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300">
                Your Stat
              </Link>
            </div>
            <Link href="/coming-soon" className="hover:text-blue-300">
              Farming
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-300">
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="bg-[#252529] rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 animate-fadeIn">
            <div className="relative">
              <img
                src={`/img/genshinchar/${character.image}`}
                alt={character.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border-4 border-gray-600 shadow-lg transition-transform hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src !== "/img/characters/default.png") {
                    img.src = "/img/characters/default.png";
                  }
                }}
              />
              {character.rarity && (
                <div
                  className={`absolute -top-3 -right-3 ${
                    character.rarity === 5 ? "bg-yellow-400" : "bg-purple-400"
                  } text-black font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-transform hover:scale-110`}
                >
                  {character.rarity}★
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{character.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#1e1d22] to-[#2a2a2e] rounded-lg px-4 py-2 shadow-md">
                  <div className="w-8 h-8 rounded-full shadow-sm overflow-hidden">
                    <img
                      src={getElementImage(character.element)}
                      alt={character.element}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="capitalize text-lg">{character.element}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#1e1d22] to-[#2a2a2e] rounded-lg px-4 py-2 shadow-md">
                  <img
                    src={`/img/weapons/${character.weapon.toLowerCase()}.png`}
                    alt={character.weapon}
                    className="w-8 h-8"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src !== "/img/weapons/default.png") {
                        img.src = "/img/weapons/default.png";
                      }
                    }}
                  />
                  <span className="capitalize text-lg">{character.weapon}</span>
                </div>
              </div>
            </div>
          </div>

          {character.talentUpGuide?.length > 0 && (
            <Section title="Talent Priority">
              <div className="flex flex-wrap gap-6 justify-center md:justify-start animate-fadeIn delay-100">
                {character.talentUpGuide.map((talent, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <SmallIcon
                      src={`/img/talents/${talent.toLowerCase().replace(/\s+/g, "-")}.png`}
                      alt={talent}
                    />
                    <span className="text-sm mt-2 text-center text-gray-200">{talent}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {character.bestWeapons?.length > 0 && (
            <Section title="Recommended Weapons">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fadeIn delay-200">
                {character.bestWeapons.map((weapon, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e1d22] rounded-lg p-4 flex flex-col items-center hover:bg-[#2d2d32] transition-all shadow-md border border-gray-600"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600 mb-3">
                      <img
                        src={`/img/weapons/${weapon.image}`}
                        alt={weapon.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src !== "/img/weapons/default.png") {
                            img.src = "/img/weapons/default.png";
                          }
                        }}
                      />
                    </div>
                    <span className="text-sm text-center font-medium text-gray-200">{weapon.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {character.materialFarming && (
            <Section title="Ascension Materials">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-fadeIn delay-300">
                {Object.entries(character.materialFarming)
                  .filter(([key]) => key !== "totalMora")
                  .map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm mb-2 font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <FarmingItem
                        src={`/img/materials/${value.toLowerCase().replace(/\s+/g, "-")}.png`}
                        alt={value}
                      />
                      <span className="text-xs mt-2 text-gray-400 text-center">{value}</span>
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {character.artifactSubstats && Object.keys(character.artifactSubstats).length > 0 && (
            <Section title="Recommended Artifact Stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn delay-400">
                {Object.entries(character.artifactSubstats)
                  .filter(([_, stats]) => stats && stats.length > 0)
                  .map(([key, stats], idx) => (
                    <div
                      key={idx}
                      className="bg-[#1e1d22] rounded-lg p-5 shadow-md border border-gray-600 hover:bg-[#2d2d32] transition-all"
                    >
                      <h3 className="font-semibold mb-3 text-lg capitalize text-yellow-400">
                        {key.replace(/Party$/, " Team")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {stats?.map((stat, i) => (
                          <div
                            key={i}
                            className="bg-[#2a2a2e] rounded-md px-3 py-2 text-sm flex items-center text-gray-200 hover:bg-[#3a3a3e] transition-colors"
                          >
                            <span>{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {character.teams && Object.keys(character.teams).length > 0 && (
            <Section title="Team Compositions">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn delay-500">
                {Object.entries(character.teams)
                  .filter(([_, teamData]) => teamData?.members && teamData.members.length > 0)
                  .map(([teamKey, teamData], i) => (
                    <div
                      key={i}
                      className="bg-[#2a2a36] rounded-xl p-5 shadow-lg hover:shadow-xl transition-all border border-gray-600"
                    >
                      <h4 className="text-lg font-semibold mb-4 text-blue-300 capitalize text-center">
                        {getTeamName(teamKey)}
                      </h4>
                      <div className="flex flex-wrap justify-center gap-4">
                        {teamData.members.map((member, idx) => (
                          <PartyMember
                            key={idx}
                            src={`/img/genshinchar/${member.toLowerCase()}.webp`}
                            alt={member}
                            element={getCharacterElement(member)}
                          />
                        ))}
                      </div>
                      {teamData.description ? (
                        <p className="text-sm text-gray-300 mt-4 text-center max-w-xs mx-auto">
                          {teamData.description}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400 mt-4 text-center italic max-w-xs mx-auto">
                          Synergizes well with {character.name}'s abilities.
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {character.showcaseVideo && <ShowcaseVideo videoUrl={character.showcaseVideo} />}
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

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 last:mb-0">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 border-l-4 border-blue-400 pl-3 text-white">
        {title}
      </h2>
      {children}
    </div>
  );
}