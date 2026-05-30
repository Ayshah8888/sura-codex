'use client';

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: "header" | "sidebar" | "inline";
  className?: string;
}

export default function AdSlot({ slot, className }: AdSlotProps) {
  const isProd = !!import.meta.env.VITE_ADSENSE_CLIENT;
  const adRef = useRef<HTMLModElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (isProd && adRef.current && !loaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        loaded.current = true;
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isProd]);

  if (!isProd) {
    return (
      <div 
        data-ad-slot={slot}
        className={cn(
          "w-full bg-border/20 border border-dashed border-border/40 flex items-center justify-center text-muted-foreground/50 text-xs my-8",
          slot === "header" ? "h-24 max-w-[728px] mx-auto" : 
          slot === "inline" ? "h-64 max-w-[300px] float-right ml-6 mb-6" : 
          "h-64",
          className
        )}
      >
        Ad Placeholder ({slot})
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-hidden flex justify-center my-8", className)}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
        data-ad-slot="YOUR_AD_SLOT_ID_HERE"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
