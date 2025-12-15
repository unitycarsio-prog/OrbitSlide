export enum SlideLayout {
  TITLE = 'title',
  BULLET_POINTS = 'bullet_points',
  TWO_COLUMN = 'two_column',
  THREE_COLUMN = 'three_column', // New
  QUOTE = 'quote',
  SECTION_HEADER = 'section_header',
  BIG_NUMBER = 'big_number', // New
  GALLERY = 'gallery', // New
  COMPARISON = 'comparison', // New
  CODE_BLOCK = 'code_block' // New
}

export interface SlideData {
  title: string;
  subtitle?: string;
  content: string[];
  layout: SlideLayout;
  imageKeyword?: string; 
  customImage?: string; // URL for inserted media
  notes?: string;
}

export interface Presentation {
  topic: string;
  slides: SlideData[];
}

export type TransitionType = 
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-x'
  | 'flip-y'
  | 'rotate'
  | 'bounce'
  | 'elastic'
  | 'blur'
  | 'glitch';

export interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  fontFamily: string;
  cardBg: string;
}