const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY!;

export interface UnsplashPhoto {
  id: string;
  url: string;
  thumb: string;
  authorName: string;
  authorUrl: string;
  downloadLocation: string;
}

export async function searchPhotos(
  query: string,
  count: number = 12
): Promise<UnsplashPhoto[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!res.ok) throw new Error("Unsplash fetch failed");

  const data = await res.json();

  return data.results.map((photo: any) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    authorName: photo.user.name,
    authorUrl: photo.user.links.html,
    downloadLocation: photo.links.download_location,
  }));
}