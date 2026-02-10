"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CanvaEmbedProps {
  blockId: string;
  title?: string;
}

export function CanvaEmbed({ blockId, title }: CanvaEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch(`/api/embed-url/${blockId}`);
        if (!res.ok) {
          throw new Error("Embed konnte nicht geladen werden");
        }
        const data = await res.json();
        setEmbedUrl(data.url);
      } catch {
        setError("Inhalt konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    }
    fetchUrl();
  }, [blockId]);

  if (error || (!loading && !embedUrl)) {
    return (
      <Card className="border-destructive/20">
        <CardContent className="flex items-center gap-3 p-4">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <span className="text-sm text-muted-foreground">
            {error || "Embed konnte nicht geladen werden."}
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {title && (
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      )}
      <div
        className="relative w-full overflow-hidden rounded-lg border border-border bg-muted"
        style={{ minHeight: "70vh" }}
      >
        {/* Skeleton while loading */}
        {(loading || !iframeLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Wird geladen...</p>
          </div>
        )}
        {embedUrl && (
          <iframe
            src={embedUrl}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            allowFullScreen
            allow="fullscreen"
            title={title || "Canva Präsentation"}
            onLoad={() => setIframeLoaded(true)}
          />
        )}
      </div>
    </div>
  );
}
