export type HorizontalAlign = 'left' | 'center' | 'right';

export interface SlideBase {
  backgroundUrl: string;
  showTopPill: boolean;
  showBottomPill: boolean;
}

export interface CoverSlide extends SlideBase {
  type: 'cover';
  titleText: string;
  titleAlign: 'top' | 'center' | 'bottom';
  titleSize: number;
  titleHAlign: HorizontalAlign;
}

export interface ContentSlide extends SlideBase {
  type: 'content';
  titleText: string;
  titleSize: number;
  titleHAlign: HorizontalAlign;
  bodyType: 'bullets' | 'paragraph';
  bodyText: string;
  bodySize: number;
  bodyHAlign: HorizontalAlign;
}

export interface ClosingSlide extends SlideBase {
  type: 'closing';
  ctaText: string;
  ctaSize: number;
  ctaHAlign: HorizontalAlign;
  commentText: string;
  commentSize: number;
  commentHAlign: HorizontalAlign;
}

export type Slide = CoverSlide | ContentSlide | ClosingSlide;

export interface CarouselState {
  profileName: string;
  profileHandle: string;
  slideCount: number;
  slides: Slide[];
}
