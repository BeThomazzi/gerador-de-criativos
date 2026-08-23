"use client"
import { Check, Clock,FolderOpen, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import React, { useCallback,useEffect, useState } from 'react';

import { Button } from '@/app/_components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/ui/dialog';
import { Input } from '@/app/_components/ui/input';

import { CarouselState } from './types';

interface SavedProject {
  id: string;
  name: string;
  thumbnail: string;
  slideCount: number;
  updatedAt: string;
  state: CarouselState;
}

interface ProjectGalleryProps {
  currentState: CarouselState;
  onLoadProject: (state: CarouselState) => void;
}

const STORAGE_KEY = 'carousel-projects';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjects(projects: SavedProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export default function ProjectGallery({ currentState, onLoadProject }: ProjectGalleryProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setProjects(loadProjects());
  }, [open]);

  const handleSave = useCallback(() => {
    if (!projectName.trim()) return;
    setSaving(true);

    setTimeout(() => {
      const newProject: SavedProject = {
        id: generateId(),
        name: projectName.trim(),
        thumbnail: currentState.slides[0]?.backgroundUrl || '',
        slideCount: currentState.slideCount,
        updatedAt: new Date().toISOString(),
        state: currentState,
      };

      const updated = [newProject, ...projects];
      saveProjects(updated);
      setProjects(updated);
      setSaving(false);
      setSaved(true);
      setProjectName('');
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }, [projectName, currentState, projects]);

  const handleDelete = useCallback((id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    setProjects(updated);
  }, [projects]);

  const handleLoad = useCallback((project: SavedProject) => {
    onLoadProject(project.state);
    setOpen(false);
  }, [onLoadProject]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-4 py-5 transition-colors rounded-lg"
          variant="outline"
        >
          <FolderOpen className="w-4 h-4 text-primary" />
          Projetos
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] bg-background border-muted overflow-auto">

        <DialogHeader>
          <DialogTitle className="font-baskerville text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Galeria de Projetos
          </DialogTitle>
        </DialogHeader>

        {/* Save current */}
        <div className="flex gap-2 p-3 rounded-lg border border-muted">
          <Input
            className="flex-1 bg-editor-bg border border-muted rounded-md px-3 py-2 text-sm font-baskerville text-white placeholder:text-white-muted/50 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Nome do projeto..."
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <Button
            onClick={handleSave}
            disabled={saving || !projectName.trim()}
            className="flex items-center gap-2 px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar'}
          </Button>
        </div>

        {/* Project list */}
        <div className="space-y-2">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white-muted">
              <Plus className="w-10 h-10 mb-3 opacity-40" />
              <p className="font-baskerville text-sm">Nenhum projeto salvo ainda</p>
              <p className="font-baskerville text-xs mt-1 opacity-60">Salve seu primeiro carrossel acima</p>
            </div>
          ) : (
            projects.map(project => (
              <div
                key={project.id}
                className="group flex items-center gap-3 p-3 rounded-lg bg-editor-surface border border-muted hover:border-primary/40 transition-colors cursor-pointer"
                onClick={() => handleLoad(project)}
              >
                {/* Thumbnail */}
                <div className="w-14 h-[70px] rounded-md overflow-hidden shrink-0 bg-editor-bg">
                  {project.thumbnail ? (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${project.thumbnail})` }}
                    />
                  ) : (
                    <div className="w-full h-full noise-bg" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-baskerville font-semibold text-sm text-white truncate">
                    {project.name}
                  </h3>
                  <p className="font-baskerville text-xs text-white-muted mt-0.5">
                    {project.slideCount} slides
                  </p>
                  <p className="font-baskerville text-xs text-white-muted/60 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {formatDate(project.updatedAt)}
                  </p>
                </div>

                {/* Actions */}
                <Button
                  onClick={e => { e.stopPropagation(); handleDelete(project.id); }}
                  className="p-2 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/20 hover:text-destructive transition-all"
                  title="Excluir projeto"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
