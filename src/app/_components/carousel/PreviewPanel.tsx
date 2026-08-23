import React, { useEffect, useRef, useState } from "react";

import SlideRenderer from "./SlideRenderer";
import { CarouselState } from "./types";

interface PreviewPanelProps {
  state: CarouselState;
  activeIndex: number;
}

export default function PreviewPanel({
  state,
  activeIndex,
}: PreviewPanelProps) {
  const [previewScale, setPreviewScale] = useState(0.3);
  const slideRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth - 32;
        const h = containerRef.current.clientHeight - 32;
        setPreviewScale(Math.min(w / 1080, h / 1350, 1));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const slide = state.slides[activeIndex];
  if (!slide) return null;

  return (
    <div
      className="bg-background flex h-full items-center justify-center overflow-hidden p-4"
      ref={containerRef}
    >
      <div
        className="relative origin-center"
        style={{
          width: 1080,
          height: 1350,
          transform: `scale(${previewScale})`,
        }}
      >
        <SlideRenderer
          ref={slideRef}
          slide={slide}
          profileName={state.profileName}
          profileHandle={state.profileHandle}
          isFirst={activeIndex === 0}
          isLast={activeIndex === state.slides.length - 1}
        />
      </div>
    </div>
  );
}
