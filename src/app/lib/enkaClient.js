import { EnkaClient } from "enka-network-api";

const enka = new EnkaClient({
  cacheDirectory: process.env.NODE_ENV === "development" ? "./cache" : undefined,
  shouldCacheAssets: process.env.NODE_ENV === "development",
});

let enkaAssetsFetched = false;

export async function fetchAssetsIfNeeded() {
  if (!enkaAssetsFetched) {
    console.log("Fetching Genshin data (first time only)...");

    await enka.cachedAssetsManager.fetchAllContents();

    enkaAssetsFetched = true;
    console.log("Genshin data fetched successfully");
  }
}

export { enka };
