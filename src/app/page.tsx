"use client";
import { useState } from "react";

import EditorPanel from "./_components/carousel/EditorPanel";
import NavigationPanel from "./_components/carousel/NavigationPanel";
import PreviewPanel from "./_components/carousel/PreviewPanel";
import { useCarouselState } from "./_components/carousel/useCarouselState";

export default function Index() {
  const { state, updateGlobal, updateSlideCount, updateSlide } =
    useCarouselState();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex h-screen flex-col overflow-hidden lg:flex-row">
      {/* Editor */}
      <div className="border-editor-border h-1/3 w-full shrink-0 border-b lg:h-full lg:w-64 lg:border-r lg:border-b-0 xl:w-[420px]">
        <EditorPanel
          state={state}
          updateGlobal={updateGlobal}
          updateSlideCount={updateSlideCount}
          updateSlide={updateSlide}
        />
      </div>

      {/* Preview (center) */}
      <div className="h-1/3 min-w-0 flex-1 lg:h-full">
        <PreviewPanel state={state} activeIndex={activeIndex} />
      </div>

      {/* Navigation + Export (right) */}
      <div className="border-editor-border h-1/3 w-full shrink-0 border-t lg:h-full lg:w-[220px] lg:border-t-0 lg:border-l xl:w-[260px]">
        <NavigationPanel
          state={state}
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
        />
      </div>
    </div>
  );
}
