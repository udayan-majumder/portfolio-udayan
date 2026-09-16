import { NextResponse } from "next/server";
import { playlistIds } from "@/data/spotify";

const REVALIDATE = 86_400;

export const revalidate = 86400;

export interface PlaylistMeta {
  id: string;
  title: string;
  thumbnail: string | null;
}

/* oEmbed is public and needs no credentials — enough for the title and cover,
   which is all the UI shows. Track listings come from the embed itself. */
async function resolve(id: string): Promise<PlaylistMeta> {
  const res = await fetch(
    `https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${id}`,
    { next: { revalidate: REVALIDATE } },
  );

  if (!res.ok) return { id, title: "Playlist", thumbnail: null };

  const data = (await res.json()) as {
    title?: string;
    thumbnail_url?: string;
  };

  return {
    id,
    title: data.title ?? "Playlist",
    thumbnail: data.thumbnail_url ?? null,
  };
}

export async function GET() {
  const playlists = await Promise.all(playlistIds.map(resolve));

  return NextResponse.json(
    { playlists },
    {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate",
      },
    },
  );
}
