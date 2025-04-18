"use client";

import { useParams } from "next/navigation";

export default function CharacterDetail() {
  const { charactername } = useParams();

  return (
    <div className="min-h-screen bg-[#1e1d22] text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Character Detail: {charactername}</h1>
      <p className="text-gray-300">Coming soon: detail build and stats for {charactername}</p>
    </div>
  );
}
