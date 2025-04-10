import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1e1d22] text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#16324c] px-6 py-3 shadow">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-4">
              <img src="/img/etc/ayaka.jpg" alt="Genshin Impact" className="w-full h-full object-cover" />
            </div>
            <div className="text-xl font-bold mr-8">juligenshin</div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <a href="#" className="hover:underline">Guide</a>
              <a href="#" className="hover:underline">Farming</a>
              <a href="#" className="hover:underline">Meta Char</a>
              <a href="#" className="hover:underline">Select Game</a>
            </div>
          </div>
          <select className="bg-[#16324c] text-white border border-white rounded px-2 py-1 text-sm hidden md:block">
            <option>English</option>
            <option>Indonesia</option>
            <option>日本語</option>
          </select>
        </div>
      </nav>

      {/* 404 Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
  <img
    src="/img/etc/ayakalost.webp"
    alt="Lost Image"
    className="w-64 h-auto mb-6"
  />
  <h1 className="text-4xl font-bold mb-2">404 - OOPS Looks like you’re lost</h1>
  <p className="text-gray-400 mb-6 max-w-md">
    I think you typed the wrong URL, or the character is not available.
  </p>
  <Link href="/" className="bg-[#16324c] px-4 py-2 rounded hover:bg-[#2a2a2e] transition">
    Go to Homepage
  </Link>
</main>


      {/* Footer */}
      <footer className="bg-[#16324c] text-white py-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
          <div className="text-xs text-center">© 2025 Kadek Juli. All rights reserved.</div>
          <div className="text-xs text-center">This Web Under Development</div>
        </div>
      </footer>
    </div>
  );
}
