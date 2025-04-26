/* eslint-disable react/react-in-jsx-scope */
'use client'
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from 'next/head';

interface MetaChar {
  name: string;
  image: string;
  role: string;
  tier: string;
  element: string;
}

export default function MetaCharPage() {
  const [metaChars, setMetaChars] = useState<MetaChar[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadMetaChars = async () => {
      try {
        const response = await fetch("/data/metachar.json");
        const data: MetaChar[] = await response.json();
        const sorted = data.sort((a, b) => a.tier.localeCompare(b.tier)); // misal mau sort berdasarkan tier
        setMetaChars(sorted);
      } catch (error) {
        console.error("Failed to load meta characters:", error);
      }
    };
    loadMetaChars();
  }, []);

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white font-sans flex flex-col">
      <Head>
        <title>Meta Characters - Guide</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <nav
        className={`bg-[#16324c] px-6 py-4 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-opacity-90 scale-[0.98] shadow-xl" : "bg-opacity-100"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center text-2xl font-bold">
            Meta Char Guide
          </div>
          <Link href="/" className="text-sm hover:underline">Back Home</Link>
        </div>
      </nav>

      <main className="p-6 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">Meta Character List</h1>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {metaChars.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">No Meta Characters found.</div>
            ) : (
            metaChars.map((char, index) => (
                <Link key={index} href={`/character/${slugify(char.name)}`}>
                <div className="bg-[#16324c] rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
                    <img src={char.image} alt={char.name} className="w-full h-32 object-cover" />
                    <div className="p-4">
                    <h2 className="text-lg font-semibold">{char.name}</h2>
                    <p className="text-sm text-gray-400">{char.role} - {char.tier}</p>
                    <p className="text-xs text-gray-400">Element: {char.element}</p>
                    </div>
                </div>
                </Link>
            ))
            )}  
        </div>
      </main>

      <footer className="bg-[#16324c] text-white py-8 mt-12 text-center text-sm">
        © 2025 Kadek Juli. All rights reserved.
      </footer>
    </div>
  );
}
