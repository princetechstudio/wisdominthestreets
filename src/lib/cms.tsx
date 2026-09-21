import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { EPISODES, QUOTES, type Episode, type Quote } from "../data/content";
import { supabase } from "./supabase";

export interface PublishedMedia {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  description?: string;
  publishedAt: string;
}

interface CmsContextValue {
  episodes: Episode[];
  quotes: Quote[];
  media: PublishedMedia[];
  loading: boolean;
  configured: boolean;
  refresh: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue>({
  episodes: EPISODES,
  quotes: QUOTES,
  media: [],
  loading: false,
  configured: false,
  refresh: async () => undefined,
});

export function CmsProvider({ children }: { children: ReactNode }) {
  const [publishedEpisodes, setPublishedEpisodes] = useState<Episode[]>([]);
  const [publishedQuotes, setPublishedQuotes] = useState<Quote[]>([]);
  const [media, setMedia] = useState<PublishedMedia[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));

  const refresh = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [episodesResult, quotesResult, mediaResult] = await Promise.all([
      supabase.from("published_episodes").select("id,payload").order("published_at", { ascending: false }),
      supabase.from("published_quotes").select("id,payload").order("published_at", { ascending: false }),
      supabase.from("published_media").select("id,title,type,url,thumbnail_url,description,published_at").order("published_at", { ascending: false }),
    ]);
    if (episodesResult.error) console.error("Could not load published episodes", episodesResult.error);
    if (quotesResult.error) console.error("Could not load published quotes", quotesResult.error);
    if (mediaResult.error) console.error("Could not load published media", mediaResult.error);
    setPublishedEpisodes((episodesResult.data ?? []).map((row) => row.payload as Episode));
    setPublishedQuotes((quotesResult.data ?? []).map((row) => row.payload as Quote));
    setMedia((mediaResult.data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      url: row.url,
      thumbnailUrl: row.thumbnail_url ?? undefined,
      description: row.description ?? undefined,
      publishedAt: row.published_at,
    })));
    setLoading(false);
  };

  useEffect(() => { void refresh(); }, []);

  const value = useMemo(() => {
    const episodeMap = new Map((supabase ? publishedEpisodes : EPISODES).map((episode) => [episode.id, episode]));
    if (supabase) publishedEpisodes.forEach((episode) => episodeMap.set(episode.id, episode));
    const quoteMap = new Map((supabase ? publishedQuotes : QUOTES).map((quote) => [quote.id, quote]));
    if (supabase) publishedQuotes.forEach((quote) => quoteMap.set(quote.id, quote));
    return {
      episodes: [...episodeMap.values()].sort((a, b) => b.date.localeCompare(a.date)),
      quotes: [...quoteMap.values()],
      media,
      loading,
      configured: Boolean(supabase),
      refresh,
    };
  }, [publishedEpisodes, publishedQuotes, media, loading]);

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);
