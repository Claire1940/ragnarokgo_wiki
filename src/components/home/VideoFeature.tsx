"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // iframe 是否已加载（进入视口自动触发，或用户点击触发）
  const [activated, setActivated] = useState(false);
  // 用户是否手动点击播放（手动播放不强制静音）
  const [userPlayed, setUserPlayed] = useState(false);

  // IntersectionObserver：视频区域进入视口时自动静音播放
  useEffect(() => {
    const el = containerRef.current;
    if (!el || activated) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActivated(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [activated]);

  // 点击播放按钮作为后备（不静音）
  const handleManualPlay = useCallback(() => {
    setUserPlayed(true);
    setActivated(true);
  }, []);

  const embedUrl = useMemo(() => {
    if (!activated) return null;
    const params = userPlayed
      ? `autoplay=1&rel=0&playsinline=1`
      : `autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0&playsinline=1`;
    return `https://www.youtube.com/embed/${videoId}?${params}`;
  }, [activated, userPlayed, videoId]);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  // 封面预览图（sddefault 清晰度优先，hqdefault 兜底）
  const posterUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    [videoId],
  );

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {embedUrl ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={handleManualPlay}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label={`Play video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <span
              className="absolute inset-0 flex items-center justify-center
                            bg-black/30 group-hover:bg-black/20 transition-colors"
            >
              <span
                className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center
                              rounded-full bg-[hsl(var(--nav-theme))] text-white
                              shadow-lg shadow-[hsl(var(--nav-theme)/0.4)]
                              group-hover:scale-105 transition-transform"
              >
                <Play className="h-8 w-8 md:h-10 md:w-10 translate-x-0.5" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
