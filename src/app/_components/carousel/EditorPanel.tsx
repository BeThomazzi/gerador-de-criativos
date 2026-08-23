"use client";
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  MessageSquare,
  Minus,
  Plus,
  Settings,
  Type,
  Upload,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/_components/ui/dialog";
import { Input } from "@/app/_components/ui/input";
import { Switch } from "@/app/_components/ui/switch";
import { Textarea } from "@/app/_components/ui/textarea";
import DeVoxLogo from "@/public/DeVox.svg"

import AISuggestionPanel from "./AISuggestionPanel";
import PostScheduler from "./PostScheduler";
import ProjectGallery from "./ProjectGallery";
import { CarouselState, ContentSlide, HorizontalAlign, Slide } from "./types";

interface EditorPanelProps {
  state: CarouselState;
  updateGlobal: (name: string, handle: string) => void;
  updateSlideCount: (count: number) => void;
  updateSlide: (index: number, updates: Partial<Slide>) => void;
}

function Section({ title, icon, children, defaultOpen = false }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-6 text-left bg-background rounded-none hover:bg-muted border-muted border-b"
      >
        {icon}
        <span className="font-semibold text-sm flex-1">{title}</span>
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
      {open && <div className="px-4 py-4 space-y-3">{children}</div>}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full bg-editor-surface border border-editor-border rounded-md px-3 py-2 text-sm font-barlow text-editor-text placeholder:text-editor-text-muted/50 focus:outline-none focus:ring-1 focus:ring-primary";
const textareaClass = `${inputClass} min-h-[80px] resize-y`;

function SizeControl({
  value,
  onChange,
  min = 14,
  max = 150,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => onChange(Math.max(min, value - 2))}
        className="py-2 px-3 transition-colors"
        variant="outline"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="mr-1 w-10 text-xl">{value}px</span>
      <Button
        onClick={() => onChange(Math.min(max, value + 2))}
        className="py-2 px-3 transition-colors"
        variant="outline"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

function AlignControl({
  value,
  onChange,
}: {
  value: HorizontalAlign;
  onChange: (v: HorizontalAlign) => void;
}) {
  const opts: { val: HorizontalAlign; icon: React.ReactNode }[] = [
    { val: "left", icon: <AlignStartVertical className="h-3.5 w-3.5" /> },
    { val: "center", icon: <AlignCenterVertical className="h-3.5 w-3.5" /> },
    { val: "right", icon: <AlignEndVertical className="h-3.5 w-3.5" /> },
  ];
  return (
    <div className="flex gap-1">
      {opts.map((o) => (
        <Button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={`p-1.5 transition-colors ${
            value === o.val
              ? "bg-background border-primary hover:bg-muted"
              : "bg-background border-muted hover:bg-muted"
          }`}
          variant="outline"
          size="sm"
        >
          {o.icon}
        </Button>
      ))}
    </div>
  );
}

function VerticalAlignControl({
  value,
  onChange,
}: {
  value: "top" | "center" | "bottom";
  onChange: (v: "top" | "center" | "bottom") => void;
}) {
  const opts: { val: "top" | "center" | "bottom"; icon: React.ReactNode }[] = [
    { val: "top", icon: <AlignStartHorizontal className="h-3.5 w-3.5" /> },
    { val: "center", icon: <AlignCenterHorizontal className="h-3.5 w-3.5" /> },
    { val: "bottom", icon: <AlignEndHorizontal className="h-3.5 w-3.5" /> },
  ];
  return (
    <div className="flex gap-1">
      {opts.map((o) => (
        <Button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={`p-1.5 transition-colors ${
            value === o.val
              ? "bg-background border-primary hover:bg-muted"
              : "bg-background border-muted hover:bg-muted"
          }`}
          variant="outline"
          size="sm"
        >
          {o.icon}
        </Button>
      ))}
    </div>
  );
}

function ImageInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;
          const maxDim = 1500;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height / width) * maxDim;
              width = maxDim;
            } else {
              width = (width / height) * maxDim;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          onChange(compressed);
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex gap-2">
      <Input
        className={`${inputClass} flex-1`}
        placeholder="https://..."
        value={value.startsWith("data:") ? "(imagem local)" : value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Button onClick={() => fileRef.current?.click()} title="Upload imagem" variant="outline">
        <Upload className="h-4 w-4" />
      </Button>
      <Input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default function EditorPanel({
  state,
  updateGlobal,
  updateSlideCount,
  updateSlide,
}: EditorPanelProps) {

  const handleLoadProject = useCallback((projectState: CarouselState) => {
    loadState(projectState);
    setActiveIndex(0);
    toast.success('Projeto carregado', { description: 'O carrossel foi atualizado com o projeto selecionado.' });
  }, [loadState]);

  const handleApplyAI = useCallback((slides: Slide[], slideCount: number) => {
    loadState({ ...state, slides, slideCount });
    setActiveIndex(0);
    toast.success('Roteiro aplicado', { description: `${slideCount} slides gerados pela IA foram aplicados.` });
  }, [loadState, state]);

  const handleSchedule = useCallback((data: { date: Date; time: string }) => {
    toast.success('Publicação agendada', { description: `Agendado para ${data.date.toLocaleDateString('pt-BR')} às ${data.time}` });
  }, []);

  const inProgress = () => {
    toast.warning("Em desenvolvimento", { description: "Funcionalidade em desenvolvimento" });
  }

  return (
    <div className="h-full overflow-y-auto flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="px-4 py-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <DeVoxLogo className="h-6 w-6" />
            Gerador de Criativos
          </h1>

          {/* Global Configuration */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-muted border"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-background border-muted">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 font-bold font-baskerville">
                  <Settings className="h-5 w-5 text-primary" />
                  Configurações Globais
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="flex gap-4">
                  <Field label="Nome do perfil">
                    <Input
                      className={inputClass}
                      value={state.profileName}
                      onChange={(e) => updateGlobal(e.target.value, state.profileHandle)}
                    />
                  </Field>
                  <Field label="Usuário do Instagram">
                    <Input
                      className={inputClass}
                      value={state.profileHandle}
                      onChange={(e) => updateGlobal(state.profileName, e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Número de imagens">
                  <Input
                    type="number"
                    min={3}
                    max={20}
                    className={inputClass}
                    value={state.slideCount}
                    onChange={(e) =>
                      updateSlideCount(
                        Math.max(3, Math.min(20, parseInt(e.target.value) || 5)),
                      )
                    }
                  />
                </Field>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        {/* Slides */}
        {state.slides.map((slide, index) => {
          const isFirst = index === 0;
          const isLast = index === state.slides.length - 1;
          const label = isFirst
            ? "Slide 1 — Capa"
            : isLast
              ? `Slide ${index + 1} — Encerramento`
              : `Slide ${index + 1} — Conteúdo`;
          const icon = isFirst ? (
            <ImageIcon className="h-4 w-4 text-primary" />
          ) : isLast ? (
            <MessageSquare className="h-4 w-4 text-primary" />
          ) : (
            <Type className="h-4 w-4 text-primary" />
          );

          return (
            <Section key={index} title={label} icon={icon}>
              {/* Pill toggles */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.showTopPill}
                    onCheckedChange={(v) => updateSlide(index, { showTopPill: v })}
                  />
                  <span className="text-xs">Nome e Usuário</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={slide.showBottomPill}
                    onCheckedChange={(v) => updateSlide(index, { showBottomPill: v })}
                  />
                  <span className="text-xs">Próxima imagem</span>
                </div>
              </div>

              {/* Background Image */}
              <Field label="Imagem de fundo">
                <ImageInput
                  value={slide.backgroundUrl}
                  onChange={(v) => updateSlide(index, { backgroundUrl: v })}
                />
              </Field>

              {/* Slide Type */}
              {slide.type === "cover" && (
                <>
                  <Field label="Título (use *texto* para destaque)">
                    <Textarea
                      className={textareaClass}
                      value={slide.titleText}
                      onChange={(e) => updateSlide(index, { titleText: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xs">Tamanho do Texto</span>
                      <SizeControl
                        value={slide.titleSize || 110}
                        onChange={(v) => updateSlide(index, { titleSize: v })}
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-xs">Alinhamento</span>
                      <AlignControl
                        value={slide.titleHAlign || "center"}
                        onChange={(v) => updateSlide(index, { titleHAlign: v })}
                      />
                      <VerticalAlignControl
                        value={slide.titleAlign || "bottom"}
                        onChange={(val) => updateSlide(index, { titleAlign: val })}
                      />
                    </div>
                  </div>
                </>
              )}

              {slide.type === "content" && (
                <>
                  <Field label="Título (use *texto* para destaque)">
                    <Textarea
                      className={textareaClass}
                      value={slide.titleText}
                      onChange={(e) => updateSlide(index, { titleText: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <Field label="Tamanho título">
                      <SizeControl
                        value={slide.titleSize || 96}
                        onChange={(v) => updateSlide(index, { titleSize: v })}
                      />
                    </Field>
                    <Field label="Alinhamento título">
                      <AlignControl
                        value={slide.titleHAlign || "center"}
                        onChange={(v) => updateSlide(index, { titleHAlign: v })}
                      />
                    </Field>
                  </div>
                  <Field label="Tipo de corpo">
                    <div className="flex gap-2">
                      {(["bullets", "paragraph"] as const).map((t) => (
                        <Button
                          key={t}
                          onClick={() =>
                            updateSlide(index, { bodyType: t } as Partial<ContentSlide>)
                          }
                          className={`flex-1 text-xs font-semibold transition-colors ${
                            (slide as ContentSlide).bodyType === t
                              ? "bg-primary"
                              : "bg-background border border-muted hover:bg-muted"
                          }`}
                        >
                          {t === "bullets" ? "Bullets" : "Parágrafo"}
                        </Button>
                      ))}
                    </div>
                  </Field>
                  <Field
                    label={
                      slide.bodyType === "bullets"
                        ? "Bullets (um por linha)"
                        : "Parágrafo"
                    }
                  >
                    <Textarea
                      className={textareaClass}
                      value={slide.bodyText}
                      onChange={(e) => updateSlide(index, { bodyText: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <Field label="Tamanho corpo">
                      <SizeControl
                        value={slide.bodySize || 28}
                        onChange={(v) => updateSlide(index, { bodySize: v })}
                      />
                    </Field>
                    <Field label="Alinhamento corpo">
                      <AlignControl
                        value={slide.bodyHAlign || "left"}
                        onChange={(v) => updateSlide(index, { bodyHAlign: v })}
                      />
                    </Field>
                  </div>
                </>
              )}

              {slide.type === "closing" && (
                <>
                  <Field label="CTA (use *texto* para destaque)">
                    <Textarea
                      className={textareaClass}
                      value={slide.ctaText}
                      onChange={(e) => updateSlide(index, { ctaText: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <Field label="Tamanho CTA">
                      <SizeControl
                        value={slide.ctaSize || 60}
                        onChange={(v) => updateSlide(index, { ctaSize: v })}
                      />
                    </Field>
                    <Field label="Alinhamento CTA">
                      <AlignControl
                        value={slide.ctaHAlign || "center"}
                        onChange={(v) => updateSlide(index, { ctaHAlign: v })}
                      />
                    </Field>
                  </div>
                  <Field label="Texto de comentário (use *texto* para destaque)">
                    <Textarea
                      className={textareaClass}
                      value={slide.commentText}
                      onChange={(e) => updateSlide(index, { commentText: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-3">
                    <Field label="Tamanho comentário">
                      <SizeControl
                        value={slide.commentSize || 28}
                        onChange={(v) => updateSlide(index, { commentSize: v })}
                      />
                    </Field>
                    <Field label="Alinhamento comentário">
                      <AlignControl
                        value={slide.commentHAlign || "center"}
                        onChange={(v) => updateSlide(index, { commentHAlign: v })}
                      />
                    </Field>
                  </div>
                </>
              )}
            </Section>
          );
        })}
      </div>

      <footer className="flex p-4 gap-2 w-full justify-between border-t border-muted">
          <ProjectGallery currentState={state} onLoadProject={handleLoadProject} />
          <AISuggestionPanel onApplySuggestion={handleApplyAI} /> 
          <PostScheduler projectName={state.profileName} onSchedule={handleSchedule} />
      </footer>
    </div>
  );
}
function loadState(projectState: CarouselState) {
  throw new Error("Function not implemented.");
}

function setActiveIndex(arg0: number) {
  throw new Error("Function not implemented.");
}

