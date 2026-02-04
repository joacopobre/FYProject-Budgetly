"use client";

import React, { useEffect, useRef } from "react";

export default function Marquee() {
  const ITEM_COUNT = 18;
  const ITEM_WIDTH = 260; // px
  const GAP = 24; // px (gap-6)

  const items = Array.from({ length: ITEM_COUNT }, (_, i) => i);
  const duplicated = [...items, ...items];
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const el = trackRef.current;
  if (!el) return;

  const setDistance = () => {
    const distance = el.scrollWidth / 2;
    el.style.setProperty("--marquee-distance", `${distance}px`);
  };

  setDistance();

  const ro = new ResizeObserver(setDistance);
  ro.observe(el);

  window.addEventListener("resize", setDistance);
  return () => {
    ro.disconnect();
    window.removeEventListener("resize", setDistance);
  };
}, []);

  return (
    <div className="relative w-full overflow-hidden edge-fade">

  {/* marquee track */}
  <div
    ref={trackRef}
    className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]"
    style={
      {
        ["--marquee-duration" as any]: "50s",
      } as React.CSSProperties
    }
  >
    {duplicated.map((i, idx) => (
      <div
        key={`${i}-${idx}`}
        className="shrink-0 rounded-xl bg-white"
        style={{ width: ITEM_WIDTH, height: 360 }}
      />
    ))}
  </div>

  {/* left shadow */}
  <div className="pointer-events-none absolute inset-y-0 left-0 w-100 bg-linear-to-r from-gray-100 to-transparent" />

  {/* right shadow */}
  <div className="pointer-events-none absolute inset-y-0 right-0 w-100 bg-linear-to-l from-gray-100 to-transparent" />

</div>
  );
}