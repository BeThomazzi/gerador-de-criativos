"use client"
import { use, useEffect, useState } from 'react';

import SlideRenderer from "@/app/_components/carousel/SlideRenderer";
import { CarouselState } from "@/app/_components/carousel/types";

export default function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [state, setState] = useState<CarouselState | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const injected = (window as any).__INJECTED_CAROUSEL_STATE__;
      if (injected) {
        // eslint-disable-next-line
        setState(injected);
        return;
      }
      const saved = localStorage.getItem('carouselState');
      if (saved) {
        setState(JSON.parse(saved));
      }
    }
  }, []);

  if (!state) return null;

  const slideIndex = parseInt(id, 10);
  const slide = state.slides[slideIndex];

  if (!slide) return <div className="p-4 text-white">Slide não encontrado</div>;

  return (
    <div className="w-[1080px] h-[1350px] overflow-hidden bg-black m-0 p-0">
      <SlideRenderer
        slide={slide}
        profileName={state.profileName}
        profileHandle={state.profileHandle}
        isFirst={slideIndex === 0}
        isLast={slideIndex === state.slides.length - 1}
      />
    </div>
  );
}