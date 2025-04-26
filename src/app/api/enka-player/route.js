import { enka, fetchAssetsIfNeeded } from "@/app/lib/enkaClient";
import { NextResponse } from "next/server";
import { kv } from '@vercel/kv'; // Import Vercel KV

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

async function getPlayerData(uid) {
  try {
    await fetchAssetsIfNeeded();
    const user = await enka.fetchUser(uid);

    if (!user || (!user.playerInfo && !user.characters)) {
      return { error: "Player not found or no public data available", status: 404 };
    }

    const playerData = {
      username: user.playerInfo?.nickname || "Unknown Player",
      signature: user.playerInfo?.signature || "",
      playerId: uid,
      adventureRank: user.playerInfo?.level || 0,
      worldLevel: user.playerInfo?.worldLevel || 0,
      achievements: user.playerInfo?.finishAchievementNum || 0,
      spiralAbyss: user.playerInfo?.towerFloorIndex
        ? `Floor ${user.playerInfo.towerFloorIndex}-${user.playerInfo.towerLevelIndex}`
        : "Not cleared",
      namecardId: user.playerInfo?.namecardId || 0,
      profilePictureId: user.playerInfo?.profilePicture?.avatarId || 0,
      showNameCardIdList: user.playerInfo?.showNameCardIdList || [],
      characters: (user.characters || []).map((char) => {
        const charData = char.characterData || {};
        const weaponEquip = char.equipments?.find((eq) => eq.type === "WEAPON");
        const characterName = charData.name?.get("en") || "Unknown";

        let localIconName = "";
        const nameParts = characterName.split(" ");

        if (nameParts.length > 1) {
          localIconName = nameParts[nameParts.length - 1].toLowerCase() + ".webp";
        } else if (nameParts.length === 1) {
          localIconName = nameParts[0].toLowerCase().replace(" ", "") + ".webp";
        }

        const localIconUrl = `/img/genshinchar/${localIconName}`;

        return {
          name: characterName,
          level: char.level || 0,
          constellation: char.constellation || 0,
          weapon: weaponEquip?.weaponData?.name?.get("en") || "Unknown",
          buildQuality: "N/A",
          buildIcon: "",
          iconUrl: localIconUrl,
        };
      }),
      ip: "N/A",
    };

    return { data: playerData, status: 200 };

  } catch (error) {
    console.error("Error fetching player data:", {
      message: error.message,
      stack: error.stack,
      uid,
      status: error.response?.status,
      data: error.response?.data,
    });
    return {
      error: "Failed to fetch player data",
      details: error.message || "Unknown server error",
      status: error.response?.status || 500,
    };
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("playerId");

  if (!uid || !/^\d+$/.test(uid)) {
    return NextResponse.json({ error: "Valid numeric Player ID is required" }, { status: 400 });
  }

  const cacheKey = `player-${uid}`;

  // Check Vercel KV cache for player data
  const cachedData = await kv.get(cacheKey);

  if (cachedData) {
    console.log(`Returning cached data for UID: ${uid}`);
    return NextResponse.json(cachedData, {
      headers: {
        'X-Cache': 'HIT',
        'Cache-Control': `max-age=${Math.floor(CACHE_TTL / 1000)}`,
      },
    });
  }

  console.log(`Fetching fresh data for UID: ${uid}`);
  const result = await getPlayerData(uid);

  if (result.error) {
    return NextResponse.json({ error: result.error, details: result.details }, { status: result.status });
  }

  // Store fresh data in Vercel KV cache with TTL
  await kv.set(cacheKey, result.data, { ex: Math.floor(CACHE_TTL / 1000) }); // TTL dalam detik

  console.log("Prepared and returning fresh player data:", result.data);
  return NextResponse.json(result.data, {
    headers: {
      'X-Cache': 'MISS',
      'Cache-Control': `max-age=${Math.floor(CACHE_TTL / 1000)}`,
    },
  });
}

export const runtime = "nodejs"; // Or 'edge' depending on your deployment
