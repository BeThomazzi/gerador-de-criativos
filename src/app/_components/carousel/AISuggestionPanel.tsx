"use client"
import { CheckCircle2, Loader2, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { useCallback,useState } from 'react';

import { Button } from '@/app/_components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/app/_components/ui/dialog';
import { Input } from '@/app/_components/ui/input';

import { Slide } from './types';

interface AISuggestionPanelProps {
  onApplySuggestion: (slides: Slide[], slideCount: number) => void;
}

function generateMockSlides(theme: string): Slide[] {
  const titleWords = theme.split(' ');
  const highlightWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : titleWords[0];

  const slides: Slide[] = [
    {
      type: 'cover',
      backgroundUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80',
      titleText: `O guia definitivo de\n*${theme}*`,
      titleAlign: 'bottom',
      titleSize: 64,
      titleHAlign: 'center',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1080&q=80',
      titleText: `Por que *${highlightWord}*\né tão importante?`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'bullets',
      bodyText: `Aumenta o *engajamento* do público\nGera *autoridade* no nicho\nMelhora a *conversão* de vendas\nCria uma *comunidade* fiel`,
      bodySize: 28,
      bodyHAlign: 'left',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&q=80',
      titleText: `Os 3 *pilares*\ndo sucesso`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'bullets',
      bodyText: `*Consistência* na publicação\n*Qualidade* acima de quantidade\n*Análise* constante de dados`,
      bodySize: 28,
      bodyHAlign: 'left',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080&q=80',
      titleText: `Como *aplicar* isso\nna *prática*?`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'paragraph',
      bodyText: `Comece definindo seus *objetivos* claros. Depois, crie um *calendário editorial* e siga-o com disciplina. Use ferramentas de *análise* para medir resultados e ajustar sua estratégia.`,
      bodySize: 28,
      bodyHAlign: 'center',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1080&q=80',
      titleText: `*Erros* comuns que\nvocê deve *evitar*`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'bullets',
      bodyText: `Não ter um *planejamento* definido\nIgnorar os *dados* e métricas\nCopiar sem *adaptar* ao seu público\nDesistir *cedo* demais`,
      bodySize: 28,
      bodyHAlign: 'left',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1080&q=80',
      titleText: `Ferramentas\n*essenciais*`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'bullets',
      bodyText: `*Canva* para design rápido\n*Analytics* para medir resultados\n*Planejadores* de conteúdo\nIA como *aliada* na criação`,
      bodySize: 28,
      bodyHAlign: 'left',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'content',
      backgroundUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1080&q=80',
      titleText: `O *segredo* que ninguém\nte conta`,
      titleSize: 52,
      titleHAlign: 'center',
      bodyType: 'paragraph',
      bodyText: `O verdadeiro diferencial não está nas *ferramentas*, mas na sua capacidade de *entender* seu público e criar *conexões* genuínas. A autenticidade sempre vence.`,
      bodySize: 28,
      bodyHAlign: 'center',
      showTopPill: true,
      showBottomPill: true,
    },
    {
      type: 'closing',
      backgroundUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&q=80',
      ctaText: `Pronto para dominar\n*${highlightWord}*?`,
      ctaSize: 60,
      ctaHAlign: 'center',
      commentText: `Comente "*quero*" e receba nosso\nguia completo gratuito`,
      commentSize: 28,
      commentHAlign: 'center',
      showTopPill: true,
      showBottomPill: false,
    },
  ];

  return slides;
}

export default function AISuggestionPanel({ onApplySuggestion }: AISuggestionPanelProps) {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<Slide[] | null>(null);
  const [open, setOpen] = useState(false);

  const handleGenerate = useCallback(() => {
    if (!theme.trim()) return;
    setLoading(true);
    setGeneratedSlides(null);

    // Simulate AI delay
    setTimeout(() => {
      const slides = generateMockSlides(theme.trim());
      setGeneratedSlides(slides);
      setLoading(false);
    }, 2000);
  }, [theme]);

  const handleApply = useCallback(() => {
    if (!generatedSlides) return;
    onApplySuggestion(generatedSlides, generatedSlides.length);
    setOpen(false);
    setGeneratedSlides(null);
    setTheme('');
  }, [generatedSlides, onApplySuggestion]);

  const suggestions = [
    'Marketing Digital',
    'Produtividade',
    'Finanças Pessoais',
    'Liderança',
    'Vendas Online',
    'Mindset Empreendedor',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-2 px-4 py-5 hover:opacity-90 transition-opacity rounded-lg"
          variant="default"
        >
          <Sparkles className="w-4 h-4" />
          Assistente IA
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[85vh] bg-background border-muted overflow-y-auto">
        
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Assistente de Roteiro com IA
          </DialogTitle>
        </DialogHeader>

        {/* Theme input */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs mb-1.5">
              Qual o tema do seu carrossel?
            </label>
            <div className="flex gap-2">
              <Input
                className="flex-1 bg-background border border-muted rounded-lg px-3 py-2.5 placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Ex: Marketing Digital, Produtividade, Finanças..."
                value={theme}
                onChange={e => setTheme(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              />
              <Button
                onClick={handleGenerate}
                disabled={loading || !theme.trim()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                variant="default"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4" />
                )}
                {loading ? 'Gerando...' : 'Gerar'}
              </Button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div>
            <label className="block text-xs font-barlow text-editor-text-muted mb-1.5">
              Sugestões rápidas
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <Button
                  key={s}
                  onClick={() => setTheme(s)}
                  className="px-3 py-1.5 rounded-full text-xs transition-colors"
                  variant="outline"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="relative">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <Sparkles className="w-4 h-4 text-primary absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p className="font-barlow text-sm text-editor-text-muted mt-4">
              Criando roteiro sobre <span className="text-primary font-semibold">{theme}</span>...
            </p>
            <p className="font-barlow text-xs text-editor-text-muted/60 mt-1">
              Gerando estrutura de {8} slides com destaques automáticos
            </p>
          </div>
        )}

        {/* Generated preview */}
        {generatedSlides && !loading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-barlow text-sm text-editor-text">
                <CheckCircle2 className="w-4 h-4 text-green-500 inline mr-1.5" />
                {generatedSlides.length} slides gerados com sucesso
              </p>
              <Button
                onClick={handleGenerate}
                className="flex items-center gap-1.5 text-xs font-barlow text-editor-text-muted hover:text-primary transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerar
              </Button>
            </div>

            <div className="space-y-2">
              {generatedSlides.map((slide, i) => {
                const label = i === 0 ? 'Capa' : i === generatedSlides.length - 1 ? 'Encerramento' : `Slide ${i + 1}`;
                const text = slide.type === 'cover' ? slide.titleText :
                             slide.type === 'closing' ? slide.ctaText :
                             slide.titleText;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-editor-surface border border-muted"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary font-barlow font-bold text-xs flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="font-barlow text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {label}
                      </span>
                      <p className="font-barlow text-xs text-editor-text-muted truncate mt-0.5">
                        {text.replace(/\*/g, '').replace(/\n/g, ' ')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 px-4 py-5 rounded-lg font-barlow font-semibold text-sm text-primary-foreground bg-primary hover:opacity-90 transition-opacity"
            >
              <CheckCircle2 className="w-4 h-4" />
              Aplicar Roteiro ao Carrossel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
