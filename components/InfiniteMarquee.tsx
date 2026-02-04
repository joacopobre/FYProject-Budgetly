import React from "react";

type InfiniteMarqueeProps = {
  itemCount?: number;
  speedSeconds?: number;
};

export default function InfiniteMarquee({
  itemCount = 8,
  speedSeconds = 25,
}: InfiniteMarqueeProps) {
  // create [0,1,2,3...]
  const items = Array.from({ length: itemCount }, (_, i) => i);

  // duplicate the list for the seamless loop
  const duplicated = [...items, ...items];

  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]
      "
    >
      <div
        className="
          flex
          w-max
          gap-6
          animate-marquee
          hover:[animation-play-state:paused]
        "
        style={
          {
            ["--marquee-duration" as any]: `${speedSeconds}s`,
          } as React.CSSProperties
        }
      >
        {duplicated.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="
              shrink-0
              rounded-xl
              bg-white
            "
            style={{
              width: "260px",
              height: "160px",
            }}
          />
        ))}
      </div>
    </div>
  );
}