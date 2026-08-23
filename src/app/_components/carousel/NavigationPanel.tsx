import { Download, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

import { CarouselState } from "@/app/_components/carousel/types";
import { Button } from "@/app/_components/ui/button";

interface NavigationPanelProps {
  state: CarouselState;
  activeIndex: number;
  onSelect: (index: number) => void;
}

function getSlideLabel(index: number, total: number) {
  if (index === 0) return "Capa";
  if (index === total - 1) return "Encerramento";
  return `Slide ${index + 1}`;
}

async function fetchAndDownloadSlide(
  slideIndex: number,
  state: CarouselState,
  filename: string,
): Promise<void> {
  const response = await fetch("/api/export-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ slideIndex, state }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err?.detail ?? err?.error ?? "Falha na exportação");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function NavigationPanel({
  state,
  activeIndex,
  onSelect,
}: NavigationPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [exportingAll, setExportingAll] = useState(false);

  /** Export only the currently selected slide */
  const exportSlide = useCallback(async () => {
    setExporting(true);
    try {
      await fetchAndDownloadSlide(
        activeIndex,
        state,
        `slide-${activeIndex + 1}.png`,
      );
    } catch (error) {
      console.error("Erro ao exportar slide:", error);
    } finally {
      setExporting(false);
    }
  }, [activeIndex, state]);

  /** Export every slide sequentially */
  const exportAll = useCallback(async () => {
    setExportingAll(true);
    try {
      for (let i = 0; i < state.slides.length; i++) {
        await fetchAndDownloadSlide(
          i,
          state,
          `slide-${i + 1}.png`,
        );
        // Brief pause so the browser can process each download
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (error) {
      console.error("Erro ao exportar todos os slides:", error);
    } finally {
      setExportingAll(false);
    }
  }, [state]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Slide grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {state.slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`group relative aspect-4/5 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                i === activeIndex
                  ? "border-primary"
                  : "border-muted hover:border-primary"
              }`}
            >
              {/* Thumbnail background */}
              {slide.backgroundUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all group-hover:blur-sm"
                  style={{ backgroundImage: `url(${slide.backgroundUrl})` }}
                />
              ) : (
                <div className="noise-bg absolute inset-0 transition-all group-hover:blur-sm" />
              )}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 transition-all group-hover:bg-black/60" />
              {/* Label */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="px-1 text-center font-sans text-xs font-semibold text-white">
                  {getSlideLabel(i, state.slides.length)}
                </span>
              </div>
              {/* Always visible index */}
              <div className="absolute right-1.5 bottom-1">
                <span className="font-sans text-[10px] font-bold text-white/70">
                  {i + 1}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Export buttons */}
      <div className="border-editor-border space-y-2 border-t p-3">
        <Button
          onClick={exportSlide}
          disabled={exporting || exportingAll}
          className="flex w-full items-center justify-center gap-2 p-5 transition-opacity hover:opacity-90 disabled:opacity-50 rounded-lg"
          variant="outline"
        >
          {exporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exportar Slide
        </Button>
        <Button
          onClick={exportAll}
          disabled={exportingAll || exporting}
          className="hover:bg-primary/70 flex w-full items-center justify-center gap-2 border p-5 transition-colors disabled:opacity-50 rounded-lg"
          variant="default"
        >
          {exportingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exportar Todos
        </Button>
      </div>
    </div>
  );
}
