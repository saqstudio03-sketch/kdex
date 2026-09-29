import { useState, useRef, useEffect } from "react";
import { Play, Film, RotateCcw, Volume2, Sparkles, CheckCircle2 } from "lucide-react";
import Hls from "hls.js";
import type { TrailerMedia } from "@/types";

interface TrailerPlayerProps {
  title: string;
  seed?: string;
  trailer?: TrailerMedia;
}

/**
 * Interactive Official Game Trailer Player.
 * Supports native MP4 videos and HLS adaptive video streams via hls.js.
 */
export function TrailerPlaceholder({ title, seed, trailer }: TrailerPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [hlsError, setHlsError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = trailer?.videoUrl || trailer?.mp4Url || trailer?.hlsUrl;
  const posterUrl = trailer?.poster;
  const trailerName = trailer?.name || `${title} — Official Trailer`;

  useEffect(() => {
    if (!playing || !videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    const isHls = videoUrl.includes(".m3u8") || Boolean(trailer?.hlsUrl);
    const targetSource = trailer?.hlsUrl || videoUrl;

    let hls: Hls | null = null;

    if (isHls && !video.canPlayType("application/vnd.apple.mpegurl")) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });

        hls.loadSource(targetSource);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) => {
            console.warn("Autoplay blocked or playback deferred:", err);
          });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error("Fatal HLS stream error:", data);
            setHlsError(true);
            hls?.destroy();
          }
        });
      } else {
        // Fallback for browsers that don't support MediaSource Extensions
        video.src = targetSource;
        video.play().catch(() => {});
      }
    } else {
      // Native MP4 or Native WebKit/Safari HLS
      video.src = targetSource;
      video.play().catch((err) => {
        console.warn("Autoplay deferred:", err);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [playing, videoUrl, trailer?.hlsUrl]);

  // If no trailer URL is available for this game, render clean placeholder
  if (!videoUrl) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,92,53,0.35), transparent 60%), radial-gradient(circle at 75% 65%, rgba(124,58,237,0.35), transparent 60%), #0B0D13`,
          }}
        />
        <div className="nx-grid-bg absolute inset-0 opacity-40" />

        <div className="relative flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-line bg-card/70 text-muted">
            <Film className="h-7 w-7" />
          </span>
          <p className="font-display text-lg font-bold text-white">{title}</p>
          <p className="text-xs text-muted max-w-md">
            Official trailer has not yet been syndicated for this title. Preview
            screenshots and gameplay details are available in the gallery.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-black shadow-2xl">
      {!playing ? (
        <div className="group relative h-full w-full cursor-pointer" onClick={() => setPlaying(true)}>
          {/* Poster Image */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} trailer poster`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-surface" />
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

          {/* Quality Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white backdrop-blur-md">
              OFFICIAL 1080p HD
            </span>
            <span className="flex items-center gap-1 rounded-md border border-accent/30 bg-accent/10 px-2 py-1 text-[11px] font-medium text-accent backdrop-blur-md">
              <Sparkles className="h-3 w-3" /> Steam Syndicated
            </span>
          </div>

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play ${title} trailer`}
              className="group-hover:scale-110 grid h-20 w-20 place-items-center rounded-full border-2 border-accent bg-accent/90 text-black shadow-2xl shadow-accent/40 transition-all duration-300 hover:bg-accent focus:outline-none focus:ring-4 focus:ring-accent/40"
            >
              <Play className="ml-1 h-9 w-9 fill-black text-black" />
            </button>

            <div>
              <p className="font-display text-lg font-bold text-white drop-shadow-md md:text-xl">
                {trailerName}
              </p>
              <p className="mt-1 text-xs text-white/70 drop-shadow">
                Click to stream official gameplay trailer with audio
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-full w-full bg-black">
          <video
            ref={videoRef}
            controls
            autoPlay
            poster={posterUrl}
            className="h-full w-full object-contain"
          >
            Your browser does not support the video tag.
          </video>

          {hlsError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/90 p-6 text-center">
              <p className="text-sm text-warning">
                Live stream encountered a network glitch.
              </p>
              <button
                onClick={() => {
                  setHlsError(false);
                  setPlaying(false);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-white hover:border-accent"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reload Trailer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Named alias
export { TrailerPlaceholder as TrailerPlayer };
