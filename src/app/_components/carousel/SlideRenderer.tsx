import { ArrowRight } from "lucide-react";
import React from "react";

import DeVoxLogo from "@/public/DeVox.svg";

import { Slide } from "./types";

interface SlideRendererProps {
  slide: Slide;
  profileName: string;
  profileHandle: string;
  isFirst: boolean;
  isLast: boolean;
}

function renderHighlightedText(
  text: string | undefined,
  baseSize: number,
  className: string = "",
) {
  const lines = (text || "").split("\n");
  const highlightSize = baseSize * 1.25;
  return (
    <span className={className}>
      {lines.map((line, lineIdx) => (
        <React.Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, i) => {
            if (part.startsWith("*") && part.endsWith("*")) {
              return (
                <span
                  key={i}
                  className="font-highlight"
                  style={{ fontSize: highlightSize }}
                >
                  {part.slice(1, -1)}
                </span>
              );
            }
            return <span key={i}>{part}</span>;
          })}
        </React.Fragment>
      ))}
    </span>
  );
}

function TopPill({
  profileName,
  profileHandle,
}: {
  profileName: string;
  profileHandle: string;
}) {
  return (
    <div className="absolute top-[72px] left-1/2 z-20 -translate-x-1/2">
      <div
        className="flex items-center gap-3 rounded-full px-4 py-2"
        style={{
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1.5px solid rgba(255,255,255,0.3)",
        }}
      >
        <DeVoxLogo className="h-8 w-8" />
        <span className="font-vastago-medium text-[22px] tracking-wide text-white">
          {profileName} <span className="mx-1 opacity-60">●</span>{" "}
          {profileHandle}
        </span>
      </div>
    </div>
  );
}

function BottomPill() {
  return (
    <div className="absolute bottom-[72px] left-1/2 z-20 -translate-x-1/2">
      <div
        className="flex items-center gap-2 rounded-full px-4 py-2 font-sans text-[20px] leading-none tracking-wide"
        style={{
          border: "2px solid #FFF7E6",
          color: "#FFF7E6",
          background: "transparent",
        }}
      >
        <span>arraste para o lado</span>
        <ArrowRight />
      </div>
    </div>
  );
}

function SlideBackground({ url }: { url: string }) {
  if (!url) {
    return <div className="noise-bg absolute inset-0" />;
  }
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${url})` }}
    />
  );
}

function GradientOverlay() {
  return (
    <div className="absolute inset-0 z-10 bg-radial from-black/60 from-20% to-black/90" />
  );
}

function CoverContent({ slide }: { slide: Extract<Slide, { type: "cover" }> }) {
  const align = slide.titleAlign || "bottom";

  return (
    <div
      className={`absolute inset-0 z-20 flex flex-col items-center ${
        align === "top"
          ? "justify-start pt-[180px]"
          : align === "center"
            ? "justify-center"
            : "justify-end pb-[180px]"
      }`}
      style={{ paddingLeft: 72, paddingRight: 72 }}
    >
      <div
        className="w-full"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          textAlign: slide.titleHAlign || "center",
        }}
      >
        <h1
          className="font-primary text-white leading-[0.8] tracking-tight"
          style={{ fontSize: slide.titleSize || 110 }}
        >
          {renderHighlightedText(slide.titleText, slide.titleSize || 110)}
        </h1>
      </div>
    </div>
  );
}

function ContentBody({
  slide,
}: {
  slide: Extract<Slide, { type: "content" }>;
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{
        padding: "72px",
        maxHeight: "65%",
        top: "17.5%",
        bottom: "17.5%",
      }}
    >
      <div
        className="mb-12 w-full"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          textAlign: slide.titleHAlign || "center",
        }}
      >
        <h2
          className="font-primary font-bold text-white leading-none tracking-tight"
          style={{ fontSize: slide.titleSize || 96 }}
        >
          {renderHighlightedText(slide.titleText, slide.titleSize || 96)}
        </h2>
      </div>
      <div
        className="w-full"
        style={{ textAlign: slide.bodyHAlign || (slide.bodyType === "bullets" ? "left" : "center") }}
      >
        {slide.bodyType === "bullets" ? (
          <ul className="space-y-5" style={{ textAlign: slide.bodyHAlign || "left" }}>
            {(slide.bodyText || "").split("\n").filter(Boolean).map((line, i) => {
              const hAlign = slide.bodyHAlign || "left";
              return (
                <li key={i} className={`flex items-start gap-4 ${hAlign === "center" ? "justify-center" : hAlign === "right" ? "justify-end" : ""}`}>
                  <span className="mt-2.5 w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#FE6900" }} />
                  <span className="font-primary text-white leading-none" style={{ fontSize: slide.bodySize || 48 }}>{line}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-primary text-white leading-none" style={{ fontSize: slide.bodySize || 48, wordBreak: "break-word", overflowWrap: "break-word" }}>
            {slide.bodyText}
          </p>
        )}
      </div>
    </div>
  );
}

function ClosingContent({
  slide,
}: {
  slide: Extract<Slide, { type: "closing" }>;
}) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{ padding: "72px" }}
    >
      <div
        className="mb-12 w-full"
        style={{
          wordBreak: "break-word",
          overflowWrap: "break-word",
          textAlign: slide.ctaHAlign || "center",
        }}
      >
        <h1
          className="font-primary font-bold text-white leading-[0.8] tracking-tight"
          style={{ fontSize: slide.ctaSize || 110 }}
        >
          {renderHighlightedText(slide.ctaText, slide.ctaSize || 110)}
        </h1>
      </div>
      <p
        className="font-primary leading-none w-full"
        style={{
          color: "#fff",
          fontSize: slide.commentSize || 48,
          wordBreak: "break-word",
          overflowWrap: "break-word",
          textAlign: slide.commentHAlign || "center",
        }}
      >
        {renderHighlightedText(slide.commentText, slide.commentSize || 48)}
      </p>
    </div>
  );
}

const SlideRenderer = React.forwardRef<HTMLDivElement, SlideRendererProps>(
  ({ slide, profileName, profileHandle }, ref) => {

    return (
      <div
        ref={ref}
        className="relative overflow-hidden"
        style={{
          width: 1080,
          height: 1350,
        }}
      >
        <SlideBackground url={slide.backgroundUrl} />
        <GradientOverlay />
        {slide.showTopPill && <TopPill profileName={profileName} profileHandle={profileHandle} />}
        {slide.showBottomPill && <BottomPill />}

        {slide.type === "cover" && <CoverContent slide={slide} />}
        {slide.type === "content" && <ContentBody slide={slide} />}
        {slide.type === "closing" && <ClosingContent slide={slide} />}
      </div>
    );
  },
);

SlideRenderer.displayName = "SlideRenderer";

export default SlideRenderer;
