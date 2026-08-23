import { useCallback, useEffect, useState } from 'react';

import { CarouselState, ContentSlide,Slide } from './types';

function createDefaultSlides(count: number): Slide[] {
  const slides: Slide[] = [];

  slides.push({
    type: 'cover',
    backgroundUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80',
    titleText: 'O futuro do *marketing digital*\ncomeça com *estratégia*',
    titleAlign: 'bottom',
    titleSize: 140,
    titleHAlign: 'center',
    showTopPill: true,
    showBottomPill: true,
  });

  const contentDefaults = [
    {
      titleText: 'Conteúdo que *conecta*\ncom o seu *público*',
      bodyType: 'bullets' as const,
      bodyText: 'Identifique as dores reais da sua audiência\nCrie narrativas que geram identificação\nUse dados para validar cada decisão\nTransforme seguidores em comunidade',
      backgroundUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&q=80',
    },
    {
      titleText: 'Métricas que *importam*\npara o seu *negócio*',
      bodyType: 'paragraph' as const,
      bodyText: 'Pare de olhar apenas para curtidas. Foque em métricas de conversão, retenção e engajamento real. Os números certos guiam as decisões certas.',
      backgroundUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&q=80',
    },
    {
      titleText: 'Automatize sem perder\na *autenticidade*',
      bodyType: 'bullets' as const,
      bodyText: 'Fluxos inteligentes de nutrição\nPersonalização em escala\nIA como aliada, não substituta\nHumanize cada ponto de contato',
      backgroundUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080&q=80',
    },
  ];

  for (let i = 0; i < count - 2; i++) {
    const def = contentDefaults[i % contentDefaults.length];
    slides.push({
      type: 'content',
      backgroundUrl: def.backgroundUrl,
      titleText: def.titleText,
      titleSize: 96,
      titleHAlign: 'left',
      bodyType: def.bodyType,
      bodyText: def.bodyText,
      bodySize: 40,
      bodyHAlign: def.bodyType === 'bullets' ? 'left' : 'center',
      showTopPill: true,
      showBottomPill: true,
    });
  }

  slides.push({
    type: 'closing',
    backgroundUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&q=80',
    ctaText: 'Pronto para *transformar*\nseus *resultados*?',
    ctaSize: 110,
    ctaHAlign: 'center',
    commentText: 'Comente "*quero*" e receba nosso guia gratuito',
    commentSize: 48,
    commentHAlign: 'center',
    showTopPill: true,
    showBottomPill: false,
  });

  return slides;
}

const defaultState: CarouselState = {
  profileName: 'DeVox',
  profileHandle: '@devox.labs',
  slideCount: 5,
  slides: createDefaultSlides(5),
};

export function useCarouselState() {
  const [state, setState] = useState<CarouselState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('carouselState');
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('carouselState', JSON.stringify(state));
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }
    }
  }, [state, isLoaded]);

  const updateGlobal = useCallback((profileName: string, profileHandle: string) => {
    setState(prev => ({ ...prev, profileName, profileHandle }));
  }, []);

  const updateSlideCount = useCallback((count: number) => {
    setState(prev => {
      const newSlides = [...prev.slides];
      const currentCount = newSlides.length;

      if (count > currentCount) {
        const closing = newSlides.pop()!;
        for (let i = currentCount - 1; i < count - 1; i++) {
          newSlides.push({
            type: 'content',
            backgroundUrl: '',
            titleText: `Título do slide ${i + 1}\nlinha 2`,
            titleSize: 96,
            titleHAlign: 'left',
            bodyType: 'bullets',
            bodyText: 'Ponto 1\nPonto 2\nPonto 3',
            bodySize: 40,
            bodyHAlign: 'left',
            showTopPill: true,
            showBottomPill: true,
          } as ContentSlide);
        }
        newSlides.push(closing);
      } else if (count < currentCount) {
        const closing = newSlides.pop()!;
        newSlides.splice(count - 1);
        newSlides.push(closing);
      }

      return { ...prev, slideCount: count, slides: newSlides };
    });
  }, []);

  const updateSlide = useCallback((index: number, updates: Partial<Slide>) => {
    setState(prev => {
      const newSlides = [...prev.slides];
      newSlides[index] = { ...newSlides[index], ...updates } as Slide;
      return { ...prev, slides: newSlides };
    });
  }, []);

  return { state, isLoaded, updateGlobal, updateSlideCount, updateSlide };
}
