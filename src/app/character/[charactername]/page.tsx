/* eslint-disable react/react-in-jsx-scope */
"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  materialFarming: Record<string, string>;
  artifactSubstats: Record<string, string[] | undefined>;
  artifactTypes?: Record<string, string[]>;
  teams: Record<string, { members: string[]; description?: string }>;
  partyImagePath?: string;
  showcaseVideo?: string;
}

const elementImages: Record<string, string> = {
  pyro: "/img/Vision/element_pyro.webp",
  hydro: "/img/Vision/element_hydro.webp",
  anemo: "/img/Vision/element_anemo.webp",
  electro: "/img/Vision/element_electro.webp",
  dendro: "/img/Vision/element_dendro.webp",
  cryo: "/img/Vision/element_cryo.webp",
  geo: "/img/Vision/element_geo.webp",
  default: "/img/Vision/element_default.webp",
};

const getElementImage = (element: string) =>
  elementImages[element.toLowerCase()] || elementImages.default;

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

const PartyMember = ({ src, alt, element }: { src: string; alt: string; element?: string }) => (
  <div className="flex flex-col items-center group">
    <ImageWithFallback src={src} alt={alt} sizeClass="w-20 h-20" />
    {element && (
      <img
        src={getElementImage(element)}
        alt={element}
        className="w-6 h-6 rounded-full border border-gray-800 shadow-sm mt-2"
      />
    )}
    <span className="text-xs mt-1 capitalize text-gray-200 group-hover:text-blue-300">
      {alt}
    </span>
  </div>
);

const ShowcaseVideo = ({ videoUrl }: { videoUrl: string }) => {
  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : `https://www.youtube.com/embed/${url}`;
  };

  return (
    <Section title="Showcase Video">
      <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-600">
        <div className="pb-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={getEmbedUrl(videoUrl)}
            title="Character Showcase Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </Section>
  );
};

export default function CharacterDetailPage() {
  const { charactername } = useParams();
  const [character, setCharacter] = useState<CharacterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof charactername !== "string") return notFound();
    fetch(`/data/character/${charactername}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setCharacter)
      .catch(() => notFound())
      .finally(() => setLoading(false));
  }, [charactername]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#1e1d22] text-white flex items-center justify-center">
        <div className="text-lg animate-pulse">Loading...</div>
      </div>
    );

  if (!character) return null;

  const getTeamName = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/TeamOption?|freeze|melt|vaporize|spread|aggravate|hyperbloom|burgeon|mono|national|taser|physical/gi, (m) =>
        ({
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
        }[m.toLowerCase()] || "")
      )
      .trim();

  const getCharacterElement = (name: string) =>
    ({
      varesa: "Electro",
      diluc: "Pyro",
      kokomi: "Hydro",
      ayaka: "Cryo",
    }[name.toLowerCase()] || "Unknown");

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
      <nav
        className={`bg-[#16324c] px-6 py-4 shadow-lg sticky top-0 z-50 transition-all ${
          isScrolled ? "bg-opacity-90 scale-[0.98]" : ""
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
            <div className="text-2xl font-bold mr-8">juligenshin</div>
            <div className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-blue-300">
                Character
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300">
                Farming
              </Link>
              <Link href="/coming-soon" className="hover:text-blue-300">
                Meta Char
              </Link>
            </div>
          </div>
          <select className="bg-[#16324c] text-white border border-white/20 rounded px-3 py-1.5 text-sm hidden md:block hover:bg-[#1e1d22]">
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
            <Link href="/" className="hover:text-blue-300">
              Character
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-300">
              Farming
            </Link>
            <Link href="/coming-soon" className="hover:text-blue-300">
              Meta Char
            </Link>
            <select className="bg-[#16324c] text-white border border-white/20 rounded px-3 py-1.5 text-sm w-fit hover:bg-[#1e1d22]">
              <option>English</option>
              <option>Indonesia</option>
              <option>日本語</option>
            </select>
          </div>
        )}
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="bg-[#252529] rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
            <div className="relative">
              <ImageWithFallback
                src={`/img/genshinchar/${character.image}`}
                alt={character.name}
                sizeClass="w-32 h-32 md:w-40 md:h-40"
                className="rounded-xl border-4 border-gray-600"
              />
              {character.rarity && (
                <div
                  className={`absolute -top-3 -right-3 ${
                    character.rarity === 5 ? "bg-yellow-400" : "bg-purple-400"
                  } text-black font-bold rounded-full w-10 h-10 flex items-center justify-center`}
                >
                  {character.rarity}★
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{character.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#1e1d22] to-[#2a2a2e] rounded-lg px-4 py-2">
                  <img
                    src={getElementImage(character.element)}
                    alt={character.element}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="capitalize text-lg">{character.element}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-[#1e1d22] to-[#2a2a2e] rounded-lg px-4 py-2">
                  <ImageWithFallback
                    src={`/img/weapons/${character.weapon.toLowerCase()}.png`}
                    alt={character.weapon}
                    sizeClass="w-8 h-8"
                  />
                  <span className="capitalize text-lg">{character.weapon}</span>
                </div>
              </div>
            </div>
          </div>

          {character.talentUpGuide?.length > 0 && (
                <Section title="Talent Priority">
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                {character.talentUpGuide.map((talent, idx) => {
                      // Mengambil nama belakang karakter dari 'name' (contoh: 'Ayaka' -> 'ayaka')
                      const characterName = character.name.toLowerCase().split(" ").pop();  // Ambil kata terakhir, misalnya "Ayaka" -> "ayaka"

                      // Membuat nama gambar talenta berdasarkan talenta dan nama belakang karakter
                      const imageName = `${talent.toLowerCase().replace(/\s+/g, "-")}-${characterName}.png`;

                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <ImageWithFallback
                            src={`/img/talents/${imageName}`}  // Pemanggilan gambar dinamis dengan nama belakang karakter
                            alt={talent}
                            sizeClass="w-12 h-12"
                            className="rounded-full"
                          />
                          <span className="text-sm mt-2 text-gray-200">{talent}</span>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}



          {character.bestWeapons?.length > 0 && (
            <Section title="Recommended Weapons">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {character.bestWeapons.map((weapon, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e1d22] rounded-lg p-4 flex flex-col items-center hover:bg-[#2d2d32] border border-gray-600"
                  >
                    <ImageWithFallback
                      src={`/img/weapons/${weapon.image}`}
                      alt={weapon.name}
                      sizeClass="w-16 h-16"
                    />
                    <span className="text-sm text-center font-medium text-gray-200 mt-3">{weapon.name}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {character.materialFarming && (
            <Section title="Ascension Materials">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {Object.entries(character.materialFarming)
                  .filter(([key]) => key !== "totalMora")
                  .map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm mb-2 font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <ImageWithFallback
                        src={`/img/materials/${value.toLowerCase().replace(/\s+/g, "-")}.png`}
                        alt={value}
                        sizeClass="w-16 h-16"
                      />
                      <span className="text-xs mt-2 text-gray-400 text-center">{value}</span>
                    </div>
                  ))}
              </div>
            </Section>
          )}

{character.artifactTypes && Object.keys(character.artifactTypes).length > 0 && (
  <Section title={`${character.name} Best Artifacts`}>
    <div className="space-y-4">
      {Object.entries(character.artifactTypes).map(([partyKey, sets], idx) => (
        <div key={idx}>
          <h3 className="font-semibold mb-2 text-lg capitalize text-yellow-400">
            {partyKey.replace(/Party$/, " Team")}
          </h3>
          <div className="flex flex-wrap gap-3">
            {sets.map((set, i) => {
              // Mengambil nama artifact tanpa angka
              const imageNameWithoutNumber = set
                .replace(/\s*\(\d+\)/, "")  // Menghapus angka dalam tanda kurung
                .toLowerCase()
                .replace(/\s+/g, "-");

              // Mengambil angka dari nama artifact jika ada
              const pieceCount = set.match(/\((\d+)\)/)?.[1] || ""; 

              // Cek apakah ada angka dalam nama artifact
              const imageName = pieceCount
                ? `${imageNameWithoutNumber}-${pieceCount}` // Jika ada angka, sertakan dalam nama file
                : imageNameWithoutNumber; // Jika tidak ada angka, hanya nama set tanpa angka

              return ( 
                <div 
                  key={i} 
                  className="flex items-center space-x-2 bg-[#1e1d22] border border-gray-600 rounded-lg p-2 hover:bg-[#2a2a2e]" 
                > 
                  <ImageWithFallback 
                    src={`/img/artifacts/${imageName}.png`} 
                    alt={set} 
                    sizeClass="w-10 h-10" 
                    className="rounded-md" 
                  /> 
                  <div className="flex flex-col"> 
                    <span className="text-sm text-gray-200">{set.replace(/\s*\(\d+\)/, "")}</span> 
                    <span className="text-xs text-gray-400">{pieceCount} Piece(s)</span> 
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </Section>
)}



          {character.artifactSubstats && Object.keys(character.artifactSubstats).length > 0 && (
            <Section title="Recommended Artifact Stats">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(character.artifactSubstats)
                  .filter(([_, stats]) => stats?.length)
                  .map(([key, stats], idx) => (
                    <div
                      key={idx}
                      className="bg-[#1e1d22] rounded-lg p-5 border border-gray-600 hover:bg-[#2d2d32]"
                    >
                      <h3 className="font-semibold mb-3 text-lg capitalize text-yellow-400">
                        {key.replace(/Party$/, " Team")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {stats?.map((stat, i) => (
                          <div
                            key={i}
                            className="bg-[#2a2a2e] rounded-md px-3 py-2 text-sm text-gray-200 hover:bg-[#3a3a3e]"
                          >
                            {stat}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(character.teams)
                  .filter(([_, team]) => team?.members?.length)
                  .map(([teamKey, team], i) => (
                    <div
                      key={i}
                      className="bg-[#2a2a36] rounded-xl p-5 border border-gray-600 hover:shadow-xl"
                    >
                      <h4 className="text-lg font-semibold mb-4 text-blue-300 capitalize text-center">
                        {getTeamName(teamKey)}
                      </h4>
                      <div className="flex flex-wrap justify-center gap-4">
                        {team.members.map((member, idx) => (
                          <PartyMember
                            key={idx}
                            src={`/img/genshinchar/${member.toLowerCase()}.webp`}
                            alt={member}
                            element={getCharacterElement(member)}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-300 mt-4 text-center max-w-xs mx-auto">
                        {team.description || `Synergizes well with ${character.name}'s abilities.`}
                      </p>
                    </div>
                  ))}
              </div>
            </Section>
          )}

          {character.showcaseVideo && <ShowcaseVideo videoUrl={character.showcaseVideo} />}
        </div>
      </main>

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
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
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