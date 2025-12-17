import React, { useState, useRef, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import { Sparkles, ArrowRight, ArrowLeft, X, ChevronLeft, ChevronRight, Download, Play, Palette, Image as ImageIcon, Video, Zap, Plus, Settings, MonitorPlay, Upload, Globe, Pause, RefreshCw, Type, Move, Layers, Sidebar, FileText, Menu, Grid, LayoutGrid, Trash2, Copy, MousePointer2, Clock, Maximize2, Minimize2, FileJson, FileDown, CircleHelp, Youtube, BookOpen, Check, Edit3, ChevronDown, ChevronUp, Lock, Users, Smartphone, PenTool, Database } from 'lucide-react';
import { generatePresentationContent } from './services/geminiService';
import { SlideData, Theme, TransitionType, SlideLayout } from './types';
import { getPreMadeSlideDeck } from './data/templates';
import SlideRenderer from './components/SlideRenderer';
import ChatAssistant from './components/ChatAssistant';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- DATA TYPES ---
interface CategoryGroup<T> {
  category: string;
  items: T[];
}

// --- EXTENSIVE THEME LIBRARY (50+ Themes) ---
const THEME_CATEGORIES: CategoryGroup<Theme>[] = [
  {
    category: "Dark & Cosmic",
    items: [
      { id: 'cosmic', name: 'Cosmic', bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', textPrimary: '#ffffff', textSecondary: '#cbd5e1', accentColor: '#3b82f6', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.05)' },
      { id: 'obsidian', name: 'Obsidian', bgGradient: 'linear-gradient(135deg, #000000 0%, #111 100%)', textPrimary: '#f8fafc', textSecondary: '#94a3b8', accentColor: '#38bdf8', fontFamily: 'Inter', cardBg: 'rgba(30,41,59,0.4)' },
      { id: 'deep-space', name: 'Deep Space', bgGradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', textPrimary: '#ffffff', textSecondary: '#b1b1b1', accentColor: '#764ba2', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.05)' },
      { id: 'midnight-pro', name: 'Midnight', bgGradient: 'linear-gradient(to right, #232526, #414345)', textPrimary: '#ffffff', textSecondary: '#cccccc', accentColor: '#2193b0', fontFamily: 'Roboto Mono', cardBg: 'rgba(0,0,0,0.3)' },
      { id: 'cyberpunk', name: 'Cyberpunk', bgGradient: 'repeating-linear-gradient(45deg, #000 0, #000 10px, #111 10px, #111 20px)', textPrimary: '#00ff00', textSecondary: '#ff00ff', accentColor: '#00ff00', fontFamily: 'Roboto Mono', cardBg: 'rgba(0,0,0,0.8)' },
      { id: 'nebula', name: 'Nebula', bgGradient: 'linear-gradient(135deg, #200122, #6f0000)', textPrimary: '#ffffff', textSecondary: '#ffcccc', accentColor: '#ff0000', fontFamily: 'Open Sans', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'eclipse', name: 'Eclipse', bgGradient: 'linear-gradient(to bottom, #000000, #434343)', textPrimary: '#ffffff', textSecondary: '#a8a8a8', accentColor: '#ffd700', fontFamily: 'Montserrat', cardBg: 'rgba(50,50,50,0.3)' },
      { id: 'void', name: 'The Void', bgGradient: 'radial-gradient(circle, #333333, #000000)', textPrimary: '#e0e0e0', textSecondary: '#666666', accentColor: '#ffffff', fontFamily: 'Raleway', cardBg: 'rgba(255,255,255,0.05)' },
      { id: 'matrix', name: 'Matrix', bgGradient: 'linear-gradient(to bottom, #000000, #0a0a0a)', textPrimary: '#00ff00', textSecondary: '#008f00', accentColor: '#003300', fontFamily: 'Roboto Mono', cardBg: 'rgba(0,50,0,0.2)' },
      { id: 'abyss', name: 'Abyss', bgGradient: 'linear-gradient(135deg, #090912, #182848)', textPrimary: '#dbeafe', textSecondary: '#60a5fa', accentColor: '#2563eb', fontFamily: 'Inter', cardBg: 'rgba(30,41,59,0.4)' },
    ]
  },
  {
    category: "Clean & Light",
    items: [
      { id: 'light', name: 'Clean Light', bgGradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', textPrimary: '#1e293b', textSecondary: '#475569', accentColor: '#0f172a', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.8)' },
      { id: 'paper', name: 'Paper', bgGradient: '#ffffff', textPrimary: '#333333', textSecondary: '#666666', accentColor: '#ff6b6b', fontFamily: 'Playfair Display', cardBg: '#f9f9f9' },
      { id: 'minimal', name: 'Minimal', bgGradient: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)', textPrimary: '#2d3436', textSecondary: '#636e72', accentColor: '#0984e3', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.6)' },
      { id: 'ivory', name: 'Ivory', bgGradient: '#fffff0', textPrimary: '#5c5c5c', textSecondary: '#8f8f8f', accentColor: '#d4af37', fontFamily: 'Merriweather', cardBg: '#ffffff' },
      { id: 'porcelain', name: 'Porcelain', bgGradient: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)', textPrimary: '#3b3b3b', textSecondary: '#7a7a7a', accentColor: '#3498db', fontFamily: 'Open Sans', cardBg: 'rgba(255,255,255,0.9)' },
      { id: 'linen', name: 'Linen', bgGradient: '#faf0e6', textPrimary: '#4a4a4a', textSecondary: '#8c8c8c', accentColor: '#8b4513', fontFamily: 'Lato', cardBg: 'rgba(255,255,255,0.5)' },
      { id: 'cream', name: 'Cream', bgGradient: 'linear-gradient(to right, #f2994a, #f2c94c)', textPrimary: '#4d3b00', textSecondary: '#806000', accentColor: '#fff', fontFamily: 'Poppins', cardBg: 'rgba(255,255,255,0.4)' },
      { id: 'snow', name: 'Snow', bgGradient: 'linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)', textPrimary: '#2c3e50', textSecondary: '#95a5a6', accentColor: '#34495e', fontFamily: 'Nunito', cardBg: '#fff' },
      { id: 'frost', name: 'Frost', bgGradient: 'linear-gradient(135deg, #e0eafc, #cfdef3)', textPrimary: '#304352', textSecondary: '#7f8c8d', accentColor: '#2980b9', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.7)' },
      { id: 'cloud', name: 'Cloud', bgGradient: 'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)', textPrimary: '#2b5876', textSecondary: '#5e7d91', accentColor: '#1e3c72', fontFamily: 'Quicksand', cardBg: 'rgba(255,255,255,0.8)' },
    ]
  },
  {
    category: "Professional",
    items: [
      { id: 'corporate', name: 'Corporate', bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', textPrimary: '#ffffff', textSecondary: '#bfdbfe', accentColor: '#60a5fa', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.05)' },
      { id: 'blue-steel', name: 'Blue Steel', bgGradient: 'linear-gradient(135deg, #2c3e50, #3498db)', textPrimary: '#ecf0f1', textSecondary: '#bdc3c7', accentColor: '#e74c3c', fontFamily: 'Inter', cardBg: 'rgba(0,0,0,0.2)' },
      { id: 'executive', name: 'Executive', bgGradient: 'linear-gradient(135deg, #2b5876, #4e4376)', textPrimary: '#ffffff', textSecondary: '#dcdcdc', accentColor: '#f39c12', fontFamily: 'Playfair Display', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'finance', name: 'Finance', bgGradient: 'linear-gradient(135deg, #134e5e, #71b280)', textPrimary: '#ffffff', textSecondary: '#e0e0e0', accentColor: '#a8ff78', fontFamily: 'Inter', cardBg: 'rgba(0,0,0,0.2)' },
      { id: 'slate', name: 'Slate', bgGradient: '#2f3542', textPrimary: '#dfe4ea', textSecondary: '#a4b0be', accentColor: '#ff4757', fontFamily: 'Roboto', cardBg: 'rgba(0,0,0,0.2)' },
      { id: 'law', name: 'Law Firm', bgGradient: 'linear-gradient(to right, #243949 0%, #517fa4 100%)', textPrimary: '#f1f2f6', textSecondary: '#ced6e0', accentColor: '#ffa502', fontFamily: 'Merriweather', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'medical', name: 'Medical', bgGradient: 'linear-gradient(to right, #e0eafc, #cfdef3)', textPrimary: '#2c3e50', textSecondary: '#7f8c8d', accentColor: '#e74c3c', fontFamily: 'Open Sans', cardBg: 'rgba(255,255,255,0.9)' },
      { id: 'startup', name: 'Startup', bgGradient: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)', textPrimary: '#ffffff', textSecondary: '#e0c3fc', accentColor: '#00d2ff', fontFamily: 'Poppins', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'industrial', name: 'Industrial', bgGradient: 'linear-gradient(to right, #434343 0%, #black 100%)', textPrimary: '#d1d8e0', textSecondary: '#778ca3', accentColor: '#f7b731', fontFamily: 'Oswald', cardBg: 'rgba(255,255,255,0.05)' },
      { id: 'architect', name: 'Architect', bgGradient: '#353b48', textPrimary: '#f5f6fa', textSecondary: '#dcdde1', accentColor: '#44bd32', fontFamily: 'Lato', cardBg: 'rgba(0,0,0,0.3)' },
    ]
  },
  {
    category: "Vibrant & Creative",
    items: [
      { id: 'sunset', name: 'Sunset', bgGradient: 'linear-gradient(135deg, #4c0519 0%, #7c2d12 100%)', textPrimary: '#fff1f2', textSecondary: '#fda4af', accentColor: '#f43f5e', fontFamily: 'Playfair Display', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'berry', name: 'Berry', bgGradient: 'linear-gradient(135deg, #831843 0%, #500724 100%)', textPrimary: '#fce7f3', textSecondary: '#fbcfe8', accentColor: '#ec4899', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.08)' },
      { id: 'mint', name: 'Fresh Mint', bgGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', textPrimary: '#14532d', textSecondary: '#166534', accentColor: '#22c55e', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.6)' },
      { id: 'lava', name: 'Magma', bgGradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)', textPrimary: '#fef2f2', textSecondary: '#fca5a5', accentColor: '#ef4444', fontFamily: 'Inter', cardBg: 'rgba(0,0,0,0.3)' },
      { id: 'ocean', name: 'Ocean', bgGradient: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)', textPrimary: '#ffffff', textSecondary: '#a0e6ff', accentColor: '#00ffff', fontFamily: 'Inter', cardBg: 'rgba(255,255,255,0.1)' },
      { id: 'coral', name: 'Coral', bgGradient: 'linear-gradient(to right, #ff9966, #ff5e62)', textPrimary: '#fff', textSecondary: '#ffe0d0', accentColor: '#ffcccb', fontFamily: 'Poppins', cardBg: 'rgba(255,255,255,0.2)' },
      { id: 'candy', name: 'Candy', bgGradient: 'linear-gradient(120deg, #f093fb 0%, #f5576c 100%)', textPrimary: '#fff', textSecondary: '#ffe4e1', accentColor: '#fffacd', fontFamily: 'Nunito', cardBg: 'rgba(255,255,255,0.2)' },
      { id: 'forest', name: 'Forest', bgGradient: 'linear-gradient(135deg, #134e5e, #71b280)', textPrimary: '#f0fff4', textSecondary: '#c6f6d5', accentColor: '#9ae6b4', fontFamily: 'Montserrat', cardBg: 'rgba(0,0,0,0.2)' },
      { id: 'flamingo', name: 'Flamingo', bgGradient: 'linear-gradient(to right, #fe8c00, #f83600)', textPrimary: '#fff', textSecondary: '#ffe0b2', accentColor: '#ffccbc', fontFamily: 'Lato', cardBg: 'rgba(255,255,255,0.2)' },
      { id: 'electric', name: 'Electric', bgGradient: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)', textPrimary: '#002f4b', textSecondary: '#004e92', accentColor: '#fff', fontFamily: 'Raleway', cardBg: 'rgba(255,255,255,0.5)' },
    ]
  },
   {
    category: "Retro & Vintage",
    items: [
      { id: 'retro', name: 'Retro 80s', bgGradient: 'linear-gradient(to right, #ff00cc, #333399)', textPrimary: '#00ff00', textSecondary: '#ffff00', accentColor: '#ff0099', fontFamily: 'Oswald', cardBg: 'rgba(0,0,0,0.5)' },
      { id: 'vintage', name: 'Vintage', bgGradient: '#f4e4c1', textPrimary: '#5d4037', textSecondary: '#8d6e63', accentColor: '#d84315', fontFamily: 'Merriweather', cardBg: 'rgba(255,255,255,0.5)' },
      { id: 'sepia', name: 'Sepia', bgGradient: '#704214', textPrimary: '#eaddcf', textSecondary: '#d2b48c', accentColor: '#ffdead', fontFamily: 'Playfair Display', cardBg: 'rgba(0,0,0,0.3)' },
      { id: 'pastel', name: 'Pastel Dream', bgGradient: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)', textPrimary: '#6d6d6d', textSecondary: '#9e9e9e', accentColor: '#ff6b6b', fontFamily: 'Nunito', cardBg: 'rgba(255,255,255,0.6)' },
      { id: 'coffee', name: 'Coffee House', bgGradient: 'linear-gradient(to right, #3e2b25, #6f4e37)', textPrimary: '#d7ccc8', textSecondary: '#a1887f', accentColor: '#8d6e63', fontFamily: 'Lato', cardBg: 'rgba(255,255,255,0.05)' },
    ]
  }
];

// --- EXTENSIVE ANIMATION LIBRARY (100+ Animations) ---
const ANIMATION_CATEGORIES: CategoryGroup<{id: string, label: string}>[] = [
  {
    category: "Attention Seekers",
    items: [
      { id: 'animate__bounce', label: 'Bounce' },
      { id: 'animate__flash', label: 'Flash' },
      { id: 'animate__pulse', label: 'Pulse' },
      { id: 'animate__rubberBand', label: 'Rubber Band' },
      { id: 'animate__shakeX', label: 'Shake X' },
      { id: 'animate__shakeY', label: 'Shake Y' },
      { id: 'animate__headShake', label: 'Head Shake' },
      { id: 'animate__swing', label: 'Swing' },
      { id: 'animate__tada', label: 'Tada' },
      { id: 'animate__wobble', label: 'Wobble' },
      { id: 'animate__jello', label: 'Jello' },
      { id: 'animate__heartBeat', label: 'Heart Beat' },
    ]
  },
  {
    category: "Fading Entrances",
    items: [
      { id: 'animate__fadeIn', label: 'Fade In' },
      { id: 'animate__fadeInDown', label: 'Fade In Down' },
      { id: 'animate__fadeInDownBig', label: 'Fade In Down Big' },
      { id: 'animate__fadeInLeft', label: 'Fade In Left' },
      { id: 'animate__fadeInLeftBig', label: 'Fade In Left Big' },
      { id: 'animate__fadeInRight', label: 'Fade In Right' },
      { id: 'animate__fadeInRightBig', label: 'Fade In Right Big' },
      { id: 'animate__fadeInUp', label: 'Fade In Up' },
      { id: 'animate__fadeInUpBig', label: 'Fade In Up Big' },
      { id: 'animate__fadeInTopLeft', label: 'Fade In Top Left' },
      { id: 'animate__fadeInTopRight', label: 'Fade In Top Right' },
      { id: 'animate__fadeInBottomLeft', label: 'Fade In Bottom Left' },
      { id: 'animate__fadeInBottomRight', label: 'Fade In Bottom Right' },
    ]
  },
  {
    category: "Back Entrances",
    items: [
      { id: 'animate__backInDown', label: 'Back In Down' },
      { id: 'animate__backInLeft', label: 'Back In Left' },
      { id: 'animate__backInRight', label: 'Back In Right' },
      { id: 'animate__backInUp', label: 'Back In Up' },
    ]
  },
  {
    category: "Bouncing Entrances",
    items: [
      { id: 'animate__bounceIn', label: 'Bounce In' },
      { id: 'animate__bounceInDown', label: 'Bounce In Down' },
      { id: 'animate__bounceInLeft', label: 'Bounce In Left' },
      { id: 'animate__bounceInRight', label: 'Bounce In Right' },
      { id: 'animate__bounceInUp', label: 'Bounce In Up' },
    ]
  },
  {
    category: "Flippers",
    items: [
      { id: 'animate__flip', label: 'Flip' },
      { id: 'animate__flipInX', label: 'Flip In X' },
      { id: 'animate__flipInY', label: 'Flip In Y' },
    ]
  },
  {
    category: "Lightspeed",
    items: [
      { id: 'animate__lightSpeedInRight', label: 'Lightspeed In Right' },
      { id: 'animate__lightSpeedInLeft', label: 'Lightspeed In Left' },
    ]
  },
  {
    category: "Rotating Entrances",
    items: [
      { id: 'animate__rotateIn', label: 'Rotate In' },
      { id: 'animate__rotateInDownLeft', label: 'Rotate In Down Left' },
      { id: 'animate__rotateInDownRight', label: 'Rotate In Down Right' },
      { id: 'animate__rotateInUpLeft', label: 'Rotate In Up Left' },
      { id: 'animate__rotateInUpRight', label: 'Rotate In Up Right' },
    ]
  },
  {
    category: "Specials & Custom",
    items: [
      { id: 'animate__jackInTheBox', label: 'Jack In The Box' },
      { id: 'animate__rollIn', label: 'Roll In' },
      { id: 'anim-ken-burns', label: 'Ken Burns (Pan/Zoom)' },
      { id: 'anim-tracking-in', label: 'Tracking In' },
      { id: 'anim-focus-in', label: 'Focus In' },
      { id: 'anim-slit-in', label: 'Slit In' },
      { id: 'anim-swirl', label: 'Swirl In' },
      { id: 'anim-puff', label: 'Puff In' },
    ]
  },
  {
    category: "Zooming Entrances",
    items: [
      { id: 'animate__zoomIn', label: 'Zoom In' },
      { id: 'animate__zoomInDown', label: 'Zoom In Down' },
      { id: 'animate__zoomInLeft', label: 'Zoom In Left' },
      { id: 'animate__zoomInRight', label: 'Zoom In Right' },
      { id: 'animate__zoomInUp', label: 'Zoom In Up' },
    ]
  },
  {
    category: "Sliding Entrances",
    items: [
      { id: 'animate__slideInDown', label: 'Slide In Down' },
      { id: 'animate__slideInLeft', label: 'Slide In Left' },
      { id: 'animate__slideInRight', label: 'Slide In Right' },
      { id: 'animate__slideInUp', label: 'Slide In Up' },
    ]
  }
];

const ANIMATION_SPEEDS = [
  { id: 'animate__faster', label: 'Turbo (500ms)' },
  { id: 'animate__fast', label: 'Fast (800ms)' },
  { id: '', label: 'Normal (1s)' },
  { id: 'animate__slow', label: 'Slow (2s)' },
  { id: 'animate__slower', label: 'Slower (3s)' },
  { id: 'animate__slower-2x', label: 'Cinematic (3s+)' }, // Custom CSS override
];

const AUTO_PLAY_DURATIONS = [
  { value: 3000, label: '3s' },
  { value: 5000, label: '5s' },
  { value: 10000, label: '10s' },
  { value: 15000, label: '15s' },
  { value: 30000, label: '30s' },
];

const SAMPLE_TOPICS = [
  "Future of AI", "Cybersecurity Basics", "Sustainable Energy", "Digital Marketing",
  "Space Exploration", "Mental Health", "Blockchain 101", "Renewable Power",
  "Negotiation Skills", "Modern Architecture", "Color Psychology", "Remote Work",
  "Quantum Computing", "Climate Change", "Social Media Trends", "E-commerce Growth",
  "Future of Education", "Robotics", "The Metaverse", "Personal Finance",
  "Leadership Skills", "Public Speaking", "Nutrition Basics", "Internet History",
  "Mobile App Dev", "Data Science", "Graphic Design", "Content Creation",
  "Agile Management", "Startup Pitch", "Crisis Management", "Employee Engagement",
  "Diversity & Inclusion", "Gig Economy", "Smart Homes", "Electric Vehicles",
  "Ocean Conservation", "Wildlife Photo", "Minimalism", "Yoga for Beginners",
  "Meditation", "Time Management", "Productivity Tools", "Cloud Computing",
  "IoT Basics", "5G Technology", "Augmented Reality", "Virtual Reality",
  "Game Design", "Machine Learning"
];

const FAQS = [
  { q: "Is OrbitSlide AI free to use?", a: "Yes, OrbitSlide AI provides a free tier that allows you to generate and export presentations. Premium features may be added in the future." },
  { q: "Can I export my slides?", a: "Absolutely! You can export your presentation as a JSON file to save your project state or as a PDF for easy sharing and printing." },
  { q: "How does the AI work?", a: "We use advanced large language models (Google Gemini) to understand your topic and structure a coherent narrative, automatically selecting appropriate layouts and visuals." },
  { q: "Can I customize the generated slides?", a: "Yes. After generation, you can edit text, change themes, apply animations, swap images, and even use our Chat Assistant to make complex updates with natural language." },
  { q: "Is my data secure?", a: "Your privacy is our priority. We do not store your presentation data on our servers after your session ends. All generation happens in real-time in your browser session." },
  { q: "Can I collaborate with my team?", a: "Real-time collaboration is on our roadmap. Currently, you can share the project via the JSON export feature and have others import it." },
  { q: "Does it work on mobile?", a: "Yes, OrbitSlide is fully responsive and works on mobile devices, though for the best editing experience, we recommend a tablet or desktop." },
  { q: "Can I upload my own fonts?", a: "Currently we provide a curated list of professional Google Fonts. Custom font uploads are coming in the Pro version." },
  { q: "Do you support PowerPoint export?", a: "Currently, we support PDF and JSON export. PowerPoint (.pptx) export is on our roadmap for future updates." },
  { q: "What happens if I lose internet connection?", a: "The app requires internet for the initial AI generation. Once generated, editing text is local, but fetching new images or AI updates requires a connection." },
  { q: "How many slides can I generate?", a: "By default, the AI generates between 6 to 10 slides depending on the complexity of the topic. You can manually add more slides after generation." },
  { q: "Are the images copyright free?", a: "We use placeholders from Unsplash/Picsum which are generally free for use, but we recommend double-checking licensing for commercial projects or uploading your own images." },
  { q: "Can I save my templates?", a: "You can save your work as a JSON file which acts as a template. In the future, we will support cloud saving for user accounts." },
  { q: "What languages are supported?", a: "OrbitSlide supports input in almost any language supported by Google Gemini. The output will generally match the language of your prompt." },
  { q: "How do I report a bug?", a: "You can reach out to our support team via the contact link in the footer. We appreciate all feedback to improve the platform." }
];

const SUGGESTIONS = [
  "Future of AI",
  "Sustainable Energy",
  "Space Exploration",
  "Digital Marketing"
];

function App() {
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSlides, setGeneratedSlides] = useState<SlideData[] | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Appearance State
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEME_CATEGORIES[0].items[0]);
  
  // Presentation State
  const [isPlaying, setIsPlaying] = useState(false); // Controls Fullscreen Presentation Mode
  const [isAutoPlay, setIsAutoPlay] = useState(false); // Controls Auto Advance logic
  const [slideDuration, setSlideDuration] = useState(5000);
  
  // Helper to get current slide data safely
  const currentSlide = generatedSlides ? generatedSlides[currentSlideIndex] : null;
  
  // Derived animation class from the current slide, or default
  const animType = currentSlide?.animationType || 'animate__fadeInUp';
  const animSpeed = currentSlide?.animationSpeed || '';
  const currentAnimationClass = `animate__animated ${animType} ${animSpeed}`;

  // UI State
  const [activeTool, setActiveTool] = useState<'themes' | 'animations' | 'transitions' | 'settings' | 'none'>('themes');
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  
  const [showChat, setShowChat] = useState(false);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Scaling State
  const canvasRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null); // Ref for Fullscreen
  const [scale, setScale] = useState(1);
  
  const [mediaUrl, setMediaUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoPlayRef = useRef<number | null>(null);

  // Sidebar thumbnail scaling
  const sidebarWidth = 280; // w-[280px]
  const sidebarPadding = 32; // p-4 * 2
  const thumbnailWidth = sidebarWidth - sidebarPadding;
  const thumbnailScale = thumbnailWidth / 1280;

  // Handle Resize for Scaling
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      const { width, height } = canvasRef.current.getBoundingClientRect();
      const targetWidth = 1280;
      const targetHeight = 720;
      
      const widthRatio = width / targetWidth;
      const heightRatio = height / targetHeight;
      
      // If presenting, we fit contained. If editing, we leave padding.
      const buffer = isPlaying ? 0 : 48;
      
      const availableWidth = width - buffer;
      const availableHeight = height - buffer;

      const scaleW = availableWidth / targetWidth;
      const scaleH = availableHeight / targetHeight;
      
      const newScale = Math.min(scaleW, scaleH);
      setScale(Math.max(0.1, newScale));
    };
    
    // Trigger resize on any layout change
    const timeout = setTimeout(handleResize, 50);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [generatedSlides, showRightSidebar, activeTool, isPlaying]);

  // Auto Play Logic
  useEffect(() => {
    // Only run timer if we are in Presentation Mode AND AutoPlay is enabled
    if (isPlaying && isAutoPlay && generatedSlides) {
      autoPlayRef.current = window.setInterval(() => {
        setCurrentSlideIndex(prev => {
           // Loop back to start or stop? Let's loop for smoother auto-play
           if (prev < generatedSlides.length - 1) {
             return prev + 1;
           } else {
             return 0; // Loop back
           }
        });
      }, slideDuration); 
    } else {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) window.clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, isAutoPlay, slideDuration, generatedSlides]);

  // Fullscreen Management
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsPlaying(false);
        setIsAutoPlay(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const enterPresentationMode = async () => {
    try {
      if (appContainerRef.current) {
        await appContainerRef.current.requestFullscreen();
      }
      setIsPlaying(true);
      setIsAutoPlay(false); 
    } catch (err) {
      console.error("Error entering fullscreen:", err);
      // Fallback if fullscreen fails (e.g. permission)
      setIsPlaying(true);
    }
  };

  const exitPresentationMode = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error exiting fullscreen:", err);
    }
    setIsPlaying(false);
    setIsAutoPlay(false);
  };

  // Keyboard Shortcuts for Presentation Mode
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'ArrowRight') {
          nextSlide();
       } else if (e.key === 'ArrowLeft') {
          prevSlide();
       } else if (e.key === ' ') {
          e.preventDefault();
          setIsAutoPlay(prev => !prev); // Toggle AutoPlay
       } else if (e.key === 'Escape') {
          // Native fullscreen exit handles this usually, but good to have sync
          exitPresentationMode();
       }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, generatedSlides]);


  const handleGenerate = async (topic?: string) => {
    const topicToUse = topic || query;
    if (!topicToUse.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const slides = await generatePresentationContent(topicToUse);
      setGeneratedSlides(slides);
      setCurrentSlideIndex(0);
      setActiveTool('none'); // Start with canvas focused
      if (window.innerWidth >= 1024) setShowRightSidebar(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Loads pre-made templates instantly
  const handleLoadSample = (topic: string) => {
    const slides = getPreMadeSlideDeck(topic);
    setGeneratedSlides(slides);
    setCurrentSlideIndex(0);
    setActiveTool('none');
    if (window.innerWidth >= 1024) setShowRightSidebar(true);
  };

  const handleStartFromScratch = () => {
    const initialSlide: SlideData = {
      title: "Your Title Here",
      subtitle: "Created from scratch",
      content: ["Click to edit this content", "Add your points here"],
      layout: SlideLayout.TITLE
    };
    setGeneratedSlides([initialSlide]);
    setCurrentSlideIndex(0);
    setQuery("");
    setActiveTool('themes'); 
    if (window.innerWidth >= 1024) setShowRightSidebar(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGenerate();
  };

  const goHome = () => {
    setGeneratedSlides(null);
    setQuery('');
    setError(null);
    setShowChat(false);
    setIsPlaying(false);
    setActiveTool('none');
  };

  const nextSlide = () => setCurrentSlideIndex(prev => Math.min(prev + 1, (generatedSlides?.length || 1) - 1));
  const prevSlide = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));

  const updateCurrentSlide = (updatedSlide: SlideData) => {
    if (!generatedSlides) return;
    const newSlides = [...generatedSlides];
    newSlides[currentSlideIndex] = updatedSlide;
    setGeneratedSlides(newSlides);
  };

  const updateCurrentSlideAnimation = (type?: string, speed?: string) => {
    if (!currentSlide) return;
    const updated = { ...currentSlide };
    if (type !== undefined) updated.animationType = type;
    if (speed !== undefined) updated.animationSpeed = speed;
    updateCurrentSlide(updated);
  }

  const handleInsertMediaUrl = () => {
    if (!generatedSlides || !mediaUrl) return;
    updateCurrentSlide({
      ...generatedSlides[currentSlideIndex],
      customImage: mediaUrl
    });
    setMediaUrl('');
    setShowMediaInput(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && generatedSlides) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        updateCurrentSlide({
           ...generatedSlides[currentSlideIndex],
           customImage: result
        });
        setShowMediaInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- EXPORT FUNCTIONS ---
  const handleExportJSON = () => {
    if (!generatedSlides) return;
    const dataStr = JSON.stringify(generatedSlides, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'presentation.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    setShowExportMenu(false);
  };

  const handleExportPDF = async () => {
    const element = document.querySelector('.slide-container-export') as HTMLElement;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1280, 720]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
      pdf.save('slide.pdf');
    } catch (e) {
      console.error("Export failed", e);
      alert("Could not generate PDF. Please try again.");
    }
    setShowExportMenu(false);
  };

  const addNewSlide = () => {
     if (!generatedSlides) return;
     const newSlide: SlideData = {
       title: "New Slide",
       content: ["Add your content here"],
       layout: SlideLayout.BULLET_POINTS
     };
     const newSlides = [...generatedSlides];
     newSlides.splice(currentSlideIndex + 1, 0, newSlide);
     setGeneratedSlides(newSlides);
     setCurrentSlideIndex(currentSlideIndex + 1);
  };

  const addTextToSlide = () => {
    if (!generatedSlides) return;
    const current = generatedSlides[currentSlideIndex];
    const newContent = [...current.content, "New Text Block"];
    updateCurrentSlide({ ...current, content: newContent });
  };

  const toggleTool = (tool: typeof activeTool) => {
    setActiveTool(prev => prev === tool ? 'none' : tool);
  };

  // --- EDITOR VIEW ---
  if (generatedSlides) {
    return (
      <div ref={appContainerRef} className="h-screen w-full bg-[#030712] flex flex-col text-white font-sans overflow-hidden">
        
        {/* Header (Hidden in Presentation Mode) */}
        {!isPlaying && (
          <header className="h-14 border-b border-white/5 bg-[#030712] flex items-center justify-between px-4 shrink-0 z-50">
              <div className="flex items-center gap-4">
                 <button onClick={goHome} className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium gap-2 px-2 py-1 rounded hover:bg-white/5">
                   <ChevronLeft size={16} /> <span className="hidden sm:inline">Back</span>
                 </button>
                 <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
                 <h1 className="font-semibold text-sm sm:text-base text-slate-200 truncate max-w-[200px] sm:max-w-md">{query || "Untitled Presentation"}</h1>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setShowChat(!showChat)}
                   className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showChat ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                 >
                   <Sparkles size={16} /> <span className="hidden sm:inline">GeniusBot</span>
                 </button>

                 <div className="relative">
                   <button 
                     onClick={() => setShowExportMenu(!showExportMenu)}
                     className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                   >
                     <Download size={16} /> <span className="hidden sm:inline">Export</span>
                   </button>
                   {showExportMenu && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up">
                       <button onClick={handleExportJSON} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                         <FileJson size={16} className="text-blue-400"/> Save Project (JSON)
                       </button>
                       <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white flex items-center gap-2 border-t border-white/5">
                         <FileDown size={16} className="text-red-400"/> Export Slide (PDF)
                       </button>
                     </div>
                   )}
                 </div>

                 <button 
                   onClick={enterPresentationMode}
                   className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                 >
                   <Play size={14} fill="currentColor" /> 
                   <span>Present</span>
                 </button>
                 
                 <button 
                   onClick={() => setShowRightSidebar(!showRightSidebar)}
                   className={`ml-2 p-2 rounded-lg transition-colors ${showRightSidebar ? 'text-white bg-white/10' : 'text-slate-500 hover:text-white'}`}
                 >
                    <Sidebar size={18} className="rotate-180" />
                 </button>
              </div>
          </header>
        )}

        {showChat && (
          <ChatAssistant 
            currentSlides={generatedSlides} 
            onUpdateSlides={setGeneratedSlides}
            onClose={() => setShowChat(false)}
          />
        )}

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
           
           {/* 1. Left Toolbar (Rail) - Hidden in Presentation */}
           {!isPlaying && (
             <div className="w-16 bg-[#030712] border-r border-white/5 flex flex-col items-center py-4 gap-4 z-30 shrink-0">
                <button 
                  onClick={() => toggleTool('themes')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'themes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  title="Themes"
                >
                   <Palette size={20} />
                </button>
                <button 
                  onClick={() => toggleTool('animations')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'animations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  title="Animations"
                >
                   <Move size={20} />
                </button>
                <button 
                  onClick={() => toggleTool('transitions')}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTool === 'transitions' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  title="Transitions"
                >
                   <Layers size={20} />
                </button>
                <div className="h-px w-8 bg-white/10 my-1"></div>
             </div>
           )}

           {/* 2. Left Panel (Drawer) - Hidden in Presentation */}
           {!isPlaying && activeTool !== 'none' && (
             <div className="w-72 bg-[#0B0F17] border-r border-white/5 flex flex-col shrink-0 animate-fade-in-left z-20">
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0B0F17]">
                   <span className="text-sm font-bold text-white uppercase tracking-wider">{activeTool}</span>
                   <button onClick={() => setActiveTool('none')} className="text-slate-500 hover:text-white"><X size={16}/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                   {/* THEMES PANEL */}
                   {activeTool === 'themes' && (
                     <div className="space-y-6">
                        {THEME_CATEGORIES.map((cat, i) => (
                          <div key={i}>
                            <h4 className="text-[11px] font-bold text-slate-500 mb-3 uppercase tracking-wider pl-1">{cat.category}</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {cat.items.map(t => (
                                <button 
                                  key={t.id}
                                  onClick={() => setCurrentTheme(t)}
                                  className={`group relative rounded-lg border text-left transition-all overflow-hidden ${currentTheme.id === t.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-white/10 hover:border-white/30'}`}
                                >
                                  {/* Preview Gradient */}
                                  <div className="h-16 w-full relative" style={{ background: t.bgGradient }}>
                                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        <div className="bg-white/20 backdrop-blur rounded-full p-1"><Sparkles size={12} className="text-white"/></div>
                                     </div>
                                  </div>
                                  <div className="p-2 bg-[#1a1f2e]">
                                     <div className="text-xs font-medium text-slate-200 truncate">{t.name}</div>
                                     <div className="flex gap-1 mt-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ background: t.accentColor }}></div>
                                        <div className="w-2 h-2 rounded-full border border-white/20" style={{ background: t.textPrimary }}></div>
                                     </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                     </div>
                   )}

                   {/* ANIMATIONS PANEL */}
                   {activeTool === 'animations' && (
                     <div className="space-y-6">
                        <div className="p-3 bg-slate-900 rounded-lg border border-white/5 space-y-3">
                           <div>
                             <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Speed</label>
                             <div className="flex gap-1 flex-wrap">
                               {ANIMATION_SPEEDS.map(s => (
                                 <button 
                                   key={s.id}
                                   onClick={() => updateCurrentSlideAnimation(undefined, s.id)}
                                   className={`flex-1 min-w-[30%] py-1.5 text-[10px] font-medium rounded border transition-all ${animSpeed === s.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5'}`}
                                 >
                                   {s.label}
                                 </button>
                               ))}
                             </div>
                           </div>
                        </div>
                        {ANIMATION_CATEGORIES.map((cat, i) => (
                           <div key={i}>
                             <h4 className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider pl-1">{cat.category}</h4>
                             <div className="space-y-1">
                               {cat.items.map(t => (
                                 <button
                                   key={t.id}
                                   onClick={() => updateCurrentSlideAnimation(t.id)}
                                   className={`w-full px-3 py-2.5 rounded-lg text-xs text-left transition-all flex items-center justify-between group ${animType === t.id ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'text-slate-300 hover:bg-white/5 border border-transparent'}`}
                                 >
                                   {t.label}
                                   {animType === t.id && <MousePointer2 size={12} className="opacity-50" />}
                                 </button>
                               ))}
                             </div>
                           </div>
                         ))}
                     </div>
                   )}

                   {/* TRANSITIONS PANEL */}
                   {activeTool === 'transitions' && (
                     <div className="space-y-2">
                        <p className="text-xs text-slate-500 mb-4 px-1">Select visual effects for slide entry.</p>
                        {ANIMATION_CATEGORIES.map((cat, i) => (
                          <div key={i} className="mb-4">
                             <h4 className="text-[10px] font-bold text-slate-500 mb-2 uppercase">{cat.category}</h4>
                             <div className="grid grid-cols-2 gap-2">
                               {cat.items.map(t => (
                                 <button
                                   key={t.id}
                                   onClick={() => updateCurrentSlideAnimation(t.id)}
                                   className={`px-2 py-2 rounded text-[10px] font-medium text-center border transition-all truncate ${animType === t.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20 hover:text-white'}`}
                                   title={t.label}
                                 >
                                   {t.label}
                                 </button>
                               ))}
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
             </div>
           )}

           {/* 3. Canvas (Center) */}
           <div ref={canvasRef} className={`flex-1 bg-[#05080F] relative flex flex-col items-center justify-center overflow-hidden transition-all duration-500 ${isPlaying ? 'bg-black' : ''}`}>
               
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.03),transparent_70%)] pointer-events-none"></div>

               {/* Overlay Tools - Hidden in Presentation */}
               {!isPlaying && (
                 <div className="absolute top-6 right-6 z-30 flex gap-2">
                    <button onClick={addTextToSlide} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 backdrop-blur hover:bg-slate-700 text-xs font-medium text-slate-300 border border-white/10 transition-colors shadow-lg">
                       <Type size={12} /> <span className="hidden sm:inline">Add Text</span>
                    </button>
                    <button onClick={() => setShowMediaInput(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/90 backdrop-blur hover:bg-slate-700 text-xs font-medium text-slate-300 border border-white/10 transition-colors shadow-lg">
                       <ImageIcon size={12} /> <span className="hidden sm:inline">Media</span>
                    </button>
                 </div>
               )}

               {/* Slide Stage */}
               <div className="relative z-10 transition-all duration-300 ease-out flex items-center justify-center">
                 <div 
                    style={{ 
                      width: '1280px', 
                      height: '720px', 
                      transform: `scale(${scale})`,
                    }}
                    className={`shadow-2xl overflow-hidden bg-black rounded-lg ${!isPlaying ? 'ring-1 ring-white/10' : ''}`}
                  >
                     {/* Add class for export targeting */}
                     <div key={`${currentSlideIndex}-${currentAnimationClass}`} className="w-full h-full slide-container-export">
                        {currentSlide && (
                          <SlideRenderer 
                            slide={currentSlide} 
                            theme={currentTheme} 
                            animationClass={currentAnimationClass}
                            onUpdate={updateCurrentSlide}
                            isEditing={!isPlaying} // Disable editing in presentation mode
                          />
                        )}
                     </div>
                  </div>
               </div>

               {/* Editor Bottom Navigation - Hidden in Presentation */}
               {!isPlaying && (
                 <div className="absolute bottom-6 z-40 flex items-center justify-center">
                    <div className="flex items-center gap-1 bg-[#0F131C]/90 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-2xl">
                       <button 
                         onClick={prevSlide}
                         disabled={currentSlideIndex === 0}
                         className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                       >
                         <ChevronLeft size={18} />
                       </button>
                       <span className="text-xs font-mono text-slate-300 font-medium px-4 min-w-[60px] text-center">
                         {currentSlideIndex + 1} / {generatedSlides.length}
                       </span>
                       <button 
                         onClick={nextSlide}
                         disabled={currentSlideIndex === generatedSlides.length - 1}
                         className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                       >
                         <ChevronRight size={18} />
                       </button>
                    </div>
                 </div>
               )}

               {/* PRESENTATION CONTROL BAR - Visible ONLY in Presentation */}
               {isPlaying && (
                 <div className="absolute bottom-8 z-50 flex items-center gap-4 bg-[#0F131C]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] animate-fade-in-up">
                    
                    {/* Navigation */}
                    <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                      <button onClick={prevSlide} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><ChevronLeft size={20}/></button>
                      <span className="font-mono text-sm text-slate-300 min-w-[50px] text-center">{currentSlideIndex + 1} / {generatedSlides.length}</span>
                      <button onClick={nextSlide} className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"><ChevronRight size={20}/></button>
                    </div>

                    {/* Auto Play Controls */}
                    <div className="flex items-center gap-3 border-r border-white/10 pr-4">
                      <button 
                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isAutoPlay ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                      >
                         {isAutoPlay ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                         <span>{isAutoPlay ? 'Auto' : 'Manual'}</span>
                      </button>

                      {/* Duration Dropdown */}
                      <div className="relative group">
                         <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/20 text-xs font-medium text-slate-400 hover:text-white border border-transparent hover:border-white/10 transition-all">
                            <Clock size={14} />
                            <span>{slideDuration / 1000}s</span>
                         </button>
                         {/* Dropdown Menu */}
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-[#1a1f2e] border border-white/10 rounded-lg shadow-xl overflow-hidden hidden group-hover:block animate-fade-in pb-1">
                            {AUTO_PLAY_DURATIONS.map(d => (
                              <button 
                                key={d.value}
                                onClick={() => setSlideDuration(d.value)}
                                className={`w-full text-center py-2 text-xs hover:bg-white/5 ${slideDuration === d.value ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
                              >
                                {d.label}
                              </button>
                            ))}
                            <div className="border-t border-white/10 my-1"></div>
                            <div className="px-2 py-1 flex items-center gap-1">
                               <input 
                                 type="number" 
                                 min="1" 
                                 max="60"
                                 className="w-full bg-black/30 border border-white/10 rounded px-1 py-1 text-xs text-center text-white outline-none focus:border-blue-500"
                                 placeholder="Custom"
                                 onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    if (val > 0) setSlideDuration(val * 1000);
                                 }}
                               />
                               <span className="text-[10px] text-slate-500">s</span>
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Exit */}
                    <button 
                      onClick={exitPresentationMode}
                      className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                      title="Exit Presentation (Esc)"
                    >
                      <X size={20} />
                    </button>

                 </div>
               )}
           </div>

           {/* 4. Right Sidebar (Slides) - Hidden in Presentation */}
           {!isPlaying && showRightSidebar && (
             <div className="w-[280px] bg-[#0B0F17] border-l border-white/5 flex flex-col shrink-0 z-20 animate-fade-in-right">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                   <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">SLIDES ({generatedSlides.length})</span>
                   <button onClick={addNewSlide} className="text-slate-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-white/5">
                      <Plus size={16} />
                   </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                   {generatedSlides.map((slide, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className="group flex gap-3 cursor-pointer items-start"
                      >
                         <span className={`text-[10px] font-medium mt-1 w-4 text-right ${idx === currentSlideIndex ? 'text-blue-500' : 'text-slate-600'}`}>
                           {idx + 1}
                         </span>
                         
                         <div 
                           className={`
                             flex-1 aspect-video rounded-md border-2 relative overflow-hidden transition-all duration-200 bg-slate-900
                             ${idx === currentSlideIndex ? 'border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'}
                           `}
                         >
                            {/* Real-time thumbnail rendering */}
                            <div className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
                                 style={{ 
                                   width: '1280px', 
                                   height: '720px', 
                                   transform: `scale(${thumbnailScale})` 
                                 }}>
                                <SlideRenderer 
                                  slide={slide} 
                                  theme={currentTheme} 
                                  animationClass="" 
                                  onUpdate={() => {}} 
                                  isEditing={false}
                                />
                            </div>
                         </div>
                      </div>
                   ))}
                   
                   <button 
                     onClick={addNewSlide}
                     className="w-full py-4 border border-dashed border-slate-800 rounded-lg text-slate-500 hover:text-slate-300 hover:border-slate-600 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 group"
                   >
                     <Plus size={18} className="group-hover:scale-110 transition-transform" />
                     <span className="text-xs font-medium">New Slide</span>
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* Media Input Modal */}
        {showMediaInput && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
             <div className="glass-panel p-6 rounded-xl w-full max-w-[400px] shadow-2xl animate-bounce-in border border-slate-700 relative">
                <button onClick={() => setShowMediaInput(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={18}/></button>
                <h4 className="text-xl font-bold text-white mb-6">Insert Media</h4>
                
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-slate-800/30 transition-all cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                     <Upload size={32} className="text-slate-500 group-hover:text-blue-400 mb-2" />
                     <span className="text-sm text-slate-300 font-medium">Upload from Device</span>
                     <span className="text-xs text-slate-500 mt-1">JPG, PNG, GIF up to 5MB</span>
                     <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                  </div>
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase">Or via URL</span>
                    <div className="flex-grow border-t border-slate-700"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
                      <Globe size={16} className="text-slate-500" />
                      <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1 bg-transparent text-sm text-white outline-none" />
                    </div>
                    <button onClick={handleInsertMediaUrl} disabled={!mediaUrl} className="w-full mt-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-2 rounded-lg font-medium transition-colors">Insert from URL</button>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  }

  // --- VIEW: HOME (SCROLLABLE) ---
  return (
    <div className="relative min-h-screen w-full text-white selection:bg-blue-500/30">
      <StarBackground />
      
      {/* Scrollable Container */}
      <div className="relative z-10 w-full h-screen overflow-y-auto overflow-x-hidden custom-scrollbar">
         
         {/* Hero Section */}
         <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
             <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col">
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Presented by</span>
              <div className="flex items-center gap-2">
                  <div className="h-4 w-1 md:h-6 bg-blue-500 rounded-full"></div>
                  <span className="text-lg md:text-2xl font-black tracking-widest text-white">NEXZI</span>
              </div>
            </div>

            <div className="flex flex-col items-center max-w-4xl w-full text-center mt-20 md:mt-0">
              <div className="mb-4 md:mb-8 inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-blue-500/30 bg-blue-950/30 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-float">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                <span className="text-xs md:text-sm font-semibold text-blue-100">OrbitSlide AI 3.0</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-2">Roar into</h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 glow-text">Greatness.</h1>
              <p className="max-w-2xl text-sm md:text-xl text-slate-300 font-light leading-relaxed mb-8 md:mb-12 opacity-90 px-4">Unleash the power of AI to create professional slide decks instantly.</p>

              <div className="w-full max-w-2xl relative group px-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-40 blur-lg group-hover:opacity-60 transition duration-500"></div>
                <div className="relative flex items-center bg-[#0B1221] border border-blue-500/30 rounded-xl p-2 shadow-2xl">
                  <div className="pl-2 md:pl-4 pr-2 md:pr-3 text-slate-400"><Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-400" /></div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    disabled={isGenerating}
                    placeholder="What do you want to create?"
                    className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm md:text-lg py-2 md:py-3 font-medium"
                  />
                  <button 
                    onClick={() => handleGenerate()}
                    disabled={!query.trim() || isGenerating}
                    className={`p-2 md:p-3 rounded-lg flex items-center justify-center transition-all duration-300 ${query.trim() && !isGenerating ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                  >
                    {isGenerating ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm text-slate-400">
                <button onClick={handleStartFromScratch} className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity hover:text-blue-400">
                  <div className="border border-slate-600 rounded px-1.5 py-0.5 text-[10px]">New</div>
                  Start from Scratch
                </button>
                <span className="mx-1 md:mx-2 text-slate-700">•</span>
                <span className="opacity-70">Try:</span>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => setQuery(s)} className="hover:text-blue-400 hover:underline transition-colors hidden sm:inline-block">{s}</button>
                ))}
              </div>
              {error && <div className="mt-6 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse text-sm"><X size={16} /> {error}</div>}
            </div>

            <div className="absolute bottom-10 animate-bounce text-slate-500">
              <ChevronDown size={32} />
            </div>
         </section>

         {/* How It Works Section */}
         <section className="py-24 px-4 max-w-6xl mx-auto border-t border-white/5 bg-[#030712]/50 backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16"><span className="text-blue-500">How</span> It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
               {[
                 { icon: <Type size={32} />, title: "1. Enter Topic", desc: "Type any subject, or paste your rough notes." },
                 { icon: <Zap size={32} />, title: "2. AI Generate", desc: "Our engine structures the narrative & designs slides." },
                 { icon: <Edit3 size={32} />, title: "3. Customize", desc: "Tweak layouts, themes, and content instantly." },
                 { icon: <Download size={32} />, title: "4. Export", desc: "Download as PDF or JSON for your meeting." }
               ].map((step, i) => (
                 <div key={i} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-2xl bg-[#0B1221] border border-white/10 flex items-center justify-center text-blue-400 mb-6 shadow-lg group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-300">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                 </div>
               ))}
            </div>
         </section>

         {/* 50 Sample Presentations */}
         <section className="py-24 px-4 bg-gradient-to-b from-[#0B1221] to-[#030712] border-y border-white/5">
            <div className="max-w-7xl mx-auto">
               <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                 <div>
                   <h2 className="text-3xl md:text-4xl font-bold mb-2">Explore <span className="text-blue-400">50+ Samples</span></h2>
                   <p className="text-slate-400">Click any topic to <b>instantly load</b> a presentation.</p>
                 </div>
                 {/* Decorative element */}
                 <div className="hidden md:flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {SAMPLE_TOPICS.map((topic, i) => (
                    <button 
                      key={i}
                      onClick={() => handleLoadSample(topic)}
                      className="group relative p-4 rounded-xl bg-[#0F172A] border border-white/5 hover:border-blue-500/50 text-left transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/0 group-hover:to-blue-600/10 transition-all"></div>
                      <div className="flex justify-between items-start mb-3">
                         <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all">
                           <FileText size={16} />
                         </div>
                         <span className="text-[10px] text-slate-500 font-mono">#{i+1}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white leading-snug line-clamp-2">{topic}</h3>
                    </button>
                  ))}
               </div>
            </div>
         </section>

         {/* FAQs Section */}
         <section className="py-24 px-4 max-w-3xl mx-auto border-t border-white/5">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Freqently Asked <span className="text-blue-500">Questions</span></h2>
            <p className="text-center text-slate-400 mb-12">Everything you need to know about OrbitSlide.</p>
            
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-white/10 rounded-xl bg-[#0B1221] overflow-hidden transition-all">
                   <button 
                     onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                     className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                   >
                     <span className="font-semibold text-slate-200">{faq.q}</span>
                     {faqOpen === i ? <ChevronUp size={20} className="text-blue-400" /> : <ChevronDown size={20} className="text-slate-500" />}
                   </button>
                   <div 
                     className={`px-6 text-slate-400 text-sm leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${faqOpen === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                   >
                     {faq.a}
                   </div>
                </div>
              ))}
            </div>
         </section>

         {/* Footer */}
         <footer className="py-12 border-t border-white/5 bg-[#030712] text-center">
            <div className="flex items-center justify-center gap-2 mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="h-6 w-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xl font-black tracking-widest text-white">NEXZI</span>
            </div>
            <div className="flex justify-center gap-6 mb-8 text-sm text-slate-500">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-xs text-slate-600">© 2024 OrbitSlide AI. All rights reserved.</p>
         </footer>
      </div>
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-[15%] w-[30vw] h-[30vw] border border-blue-500/10 rounded-full -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute top-1/2 right-[15%] w-[30vw] h-[30vw] border border-blue-500/10 rounded-full -translate-y-1/2 pointer-events-none"></div>
    </div>
  );
}

export default App;