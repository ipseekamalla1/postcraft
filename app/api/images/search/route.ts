import { searchPhotos } from "@/lib/unsplash";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return new Response("Missing query", { status: 400 });
  }

  try {
    const photos = await searchPhotos(query);
    return Response.json(photos);
  } catch (error) {
    console.error("Unsplash error:", error);
    return new Response("Image search failed", { status: 500 });
  }
}