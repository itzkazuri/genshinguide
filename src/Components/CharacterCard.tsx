"use client";

interface CharacterCardProps {
  name: string;
  image: string;
  rarity: number;
  onClick?: () => void;
}

export default function CharacterCard({ name, image, rarity, onClick }: CharacterCardProps) {
  const backgroundColor = rarity === 5 ? "#c07826" : "#5c16a8";

  return (
    <div
    className="flex flex-col items-center justify-center rounded-lg text-xs shadow-md hover:shadow-lg transition duration-200 w-full p-2"
    style={{
      backgroundColor,
    }}
  >
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
