import { enka, fetchAssetsIfNeeded } from "@/app/lib/enkaClient";
import { NextResponse } from "next/server";

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("playerId");

  if (!uid || !/^\d+$/.test(uid)) {
    return NextResponse.json({ error: "Valid numeric Player ID is required" }, { status: 400 });
  }

  try {
    console.log(`Handling request for UID: ${uid}`);

    // Check cache first
    const cacheKey = `player-${uid}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      const { data, timestamp } = cachedData;
      // Check if cache is still valid
      if (Date.now() - timestamp < CACHE_TTL) {
        console.log(`Returning cached data for UID: ${uid}`);
        // Add cache header to response
        return NextResponse.json(data, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': `max-age=${Math.floor(CACHE_TTL / 1000)}`
          }
        });
      } else {
        console.log(`Cache expired for UID: ${uid}`);
        cache.delete(cacheKey); // Remove expired cache
      }
    }

    console.log(`Fetching fresh data for UID: ${uid}`);
    
    // Fetch fresh data
    await fetchAssetsIfNeeded();
    const user = await enka.fetchUser(uid);

    console.log("Raw user data:", {
      hasPlayerInfo: !!user.playerInfo,
      nickname: user.playerInfo?.nickname || "N/A",
      signature: user.playerInfo?.signature || "N/A",
      hasCharacters: !!user.characters,
      characterCount: user.characters?.length || 0,
    });

    if (!user || (!user.playerInfo && !user.characters)) {
      return NextResponse.json(
        { error: "Player not found or no public data available" },
        { status: 404 }
      );
    }

    const playerData = {
      // Mengakses nickname berdasarkan dokumentasi
      username: user.playerInfo?.nickname || "Unknown Player",
      signature: user.playerInfo?.signature || "",
      playerId: uid,
      adventureRank: user.playerInfo?.level || 0,
      worldLevel: user.playerInfo?.worldLevel || 0,
      achievements: user.playerInfo?.finishAchievementNum || 0, // Menggunakan finishAchievementNum berdasar dokumentasi
      spiralAbyss: user.playerInfo?.towerFloorIndex
        ? `Floor ${user.playerInfo.towerFloorIndex}-${user.playerInfo.towerLevelIndex}`
        : "Not cleared",
      namecardId: user.playerInfo?.namecardId || 0,
      profilePictureId: user.playerInfo?.profilePicture?.avatarId || 0,
      showNameCardIdList: user.playerInfo?.showNameCardIdList || [],
      characters: (user.characters || []).map((char) => {
        const charData = char.characterData || {};
        const weaponEquip = char.equipments?.find((eq) => eq.type === "WEAPON");

        return {
          name: charData.name?.get("en") || "Unknown",
          level: char.level || 0,
          constellation: char.constellation || 0,
          weapon: weaponEquip?.weaponData?.name?.get("en") || "Unknown",
          buildQuality: "N/A",
          buildIcon: "",
        };
      }),
      ip: "N/A",
    };

    console.log("Prepared player data:", playerData);
    
    // Store in cache
    cache.set(cacheKey, {
      data: playerData,
      timestamp: Date.now()
    });
    
    // Return fresh data with cache headers
    return NextResponse.json(playerData, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': `max-age=${Math.floor(CACHE_TTL / 1000)}`
      }
    });

  } catch (error) {
    console.error("Error fetching player data:", {
      message: error.message,
      stack: error.stack,
      uid,
      status: error.response?.status,
      data: error.response?.data,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch player data",
        details: error.message || "Unknown server error",
        status: error.response?.status || 500,
      },
      { status: 500 }
    );
  }
}

// Optional: Cache maintenance
function cleanupCache() {
  const now = Date.now();
  for (const [key, { timestamp }] of cache.entries()) {
    if (now - timestamp > CACHE_TTL) {
      cache.delete(key);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupCache, 60 * 1000);