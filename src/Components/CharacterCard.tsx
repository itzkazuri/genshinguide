/* eslint-disable react/react-in-jsx-scope */
"use client";

interface CharacterCardProps {
  name: string;
  image: string;
  rarity: number;
  vision?: string; // Tambahkan prop vision
}

const visionIcons: { [key: string]: string } = {
  anemo: "/img/vision/element_anemo.webp",
  geo: "/img/vision/element_geo.webp",
  electro: "/img/vision/element_electro.webp",
  dendro: "/img/vision/element_dendro.webp",
  hydro: "/img/vision/element_hydro.webp",
  pyro: "/img/vision/element_pyro.webp",
  cryo: "/img/vision/element_cryo.webp",
};

export default function CharacterCard({ name, image, rarity, vision }: CharacterCardProps) {
  const backgroundColor = rarity === 5 ? "#c07826" : "#5c16a8";

  return (
    <div
      className="relative flex flex-col items-center justify-center rounded-lg text-xs shadow-md hover:shadow-lg transition duration-200 w-full p-2"
      style={{ backgroundColor }}
    >
      {/* Ikon Vision di Pojok Kanan Atas */}
      {vision && visionIcons[vision.toLowerCase()] && (
        <img
          src={visionIcons[vision.toLowerCase()]}
          alt={`${vision} vision`}
          className="absolute top-1 right-1 w-6 h-6 object-contain"
        />
      )}
      <img
        src={image}
        alt={name}
        className="w-16 h-16 object-contain rounded"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          if (!img.src.includes("default-character.png")) {
            img.src = "/default-character.png";
          }
        }}
      />
      <span className="text-white text-center truncate w-full mt-1">{name}</span>
    </div>
  );
}