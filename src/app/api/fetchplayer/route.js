import { EnkaNetwork } from "enkanetwork";

const enka = new EnkaNetwork();

export default async function handler(req, res) {
  const { playerId } = req.query;

  if (!playerId || isNaN(playerId)) {
    return res.status(400).json({ error: "Invalid Player ID" });
  }

  try {
    const data = await enka.fetchUser(playerId);

    const playerStats = {
      playerId,
      username: data.playerInfo.nickname || "Unknown",
      adventureRank: data.playerInfo.level || 0,
      worldLevel: data.playerInfo.worldLevel || 0,
      achievements: data.playerInfo.finishAchievementNum || 0,
      spiralAbyss: data.playerInfo.abyssFloor
        ? `${data.playerInfo.abyssFloor}-${data.playerInfo.abyssChamber || 0}`
        : "N/A",
      characters: (data.charactersPreview || []).map((char) => ({
        name: char.name || "Unknown",
        level: char.level || 1,
        constellation: char.constellation || 0,
        weapon: char.equipments?.find((eq) => eq.flat?.itemType === "EQUIP_WEAPON")?.flat?.name || "None",
        buildQuality: evaluateBuildQuality(char),
        buildIcon: getBuildIcon(char),
      })),
    };

    res.status(200).json({ stats: playerStats, ip: "N/A" });
  } catch (error) {
    console.error("Error fetching player data:", error);
    if (error?.response?.status === 404) {
      return res.status(404).json({ error: `Player with ID ${playerId} not found` });
    }
    res.status(500).json({ error: "Failed to fetch player data" });
  }
}

function evaluateBuildQuality(character) {
  const artifactCount = character.equipments?.filter((eq) => eq.flat?.itemType === "EQUIP_SUIT")?.length || 0;
  const critRate = character.fightPropMap?.[2001] || 0;
  if (artifactCount >= 5 && critRate > 0.5) return "Well Built";
  if (artifactCount >= 3) return "Average";
  return "Needs Improvement";
}

function getBuildIcon(character) {
  const quality = evaluateBuildQuality(character);
  if (quality === "Well Built") return "✅";
  if (quality === "Average") return "⚠️";
  return "❌";
}