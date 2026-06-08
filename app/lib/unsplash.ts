export async function fetchUnsplashThumbnail(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    )
    const data = await res.json()
    const photo = data?.results?.[0]
    return photo?.urls?.regular ?? null
  } catch {
    return null
  }
}
