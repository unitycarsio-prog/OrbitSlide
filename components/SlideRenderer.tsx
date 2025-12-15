import React, { useRef, useLayoutEffect } from 'react';
import { SlideData, SlideLayout, Theme } from '../types';
import { Quote, Code, ArrowRightLeft, Image as ImageIcon } from 'lucide-react';

interface SlideRendererProps {
  slide: SlideData;
  theme: Theme;
  animationClass: string; // Now passing specific composed class string
  onUpdate: (updatedSlide: SlideData) => void;
  isEditing?: boolean;
}

// Utility to remove Markdown asterisks
const cleanText = (text: string | undefined): string => {
  if (!text) return '';
  return text.replace(/\*/g, '');
};

// Helper for auto-resizing textareas
const AutoTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = Math.max(ref.current.scrollHeight, 24) + 'px';
    }
  }, [props.value]);

  return <textarea ref={ref} rows={1} {...props} />;
};

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide, theme, animationClass, onUpdate, isEditing = true }) => {
  const imageUrl = slide.customImage 
    ? slide.customImage
    : slide.imageKeyword 
      ? `https://picsum.photos/seed/${encodeURIComponent(slide.imageKeyword)}/1200/800` 
      : 'https://picsum.photos/seed/abstract/1200/800';

  const containerStyle = { 
    background: theme.bgGradient,
    fontFamily: theme.fontFamily
  };
  // Ensure text colors are applied with high specificity
  const textPrimary = { color: theme.textPrimary };
  const textSecondary = { color: theme.textSecondary };
  const cardStyle = { backgroundColor: theme.cardBg, borderColor: `${theme.textSecondary}20` };

  const updateTitle = (val: string) => onUpdate({ ...slide, title: val });
  const updateSubtitle = (val: string) => onUpdate({ ...slide, subtitle: val });
  const updateContent = (index: number, val: string) => {
    const newContent = [...slide.content];
    newContent[index] = val;
    onUpdate({ ...slide, content: newContent });
  };

  const renderContent = () => {
    switch (slide.layout) {
      case SlideLayout.TITLE:
        return (
          <div className={`flex flex-col items-center justify-center h-full text-center px-12 ${animationClass}`}>
            <AutoTextarea 
              value={cleanText(slide.title)} 
              onChange={(e) => updateTitle(e.target.value)}
              className="editable-input text-7xl font-bold mb-8 tracking-tight leading-tight drop-shadow-lg text-center bg-transparent min-h-[1.5em]"
              style={textPrimary}
              placeholder="Click to add title"
            />
            <AutoTextarea 
              value={cleanText(slide.subtitle)} 
              onChange={(e) => updateSubtitle(e.target.value)}
              className="editable-input text-3xl font-light max-w-4xl opacity-90 leading-relaxed text-center bg-transparent min-h-[1.5em]"
              style={textSecondary}
              placeholder="Add subtitle..."
            />
            <div className="mt-16 w-40 h-2 rounded-full shadow-lg" style={{ background: theme.accentColor }} />
          </div>
        );

      case SlideLayout.SECTION_HEADER:
        return (
          <div className={`flex flex-row items-center h-full ${animationClass}`}>
            <div className="w-1/2 h-full flex flex-col items-end justify-center p-16 border-r border-opacity-20" style={{ borderColor: theme.textSecondary }}>
               <AutoTextarea 
                  value={cleanText(slide.title)} 
                  onChange={(e) => updateTitle(e.target.value)}
                  className="editable-input text-6xl font-bold leading-tight text-right bg-transparent" 
                  style={textPrimary}
               />
               <div className="mt-6 w-20 h-1" style={{ background: theme.accentColor }}></div>
            </div>
            <div className="w-1/2 h-full flex items-center justify-start p-16">
               <ul className="space-y-6 w-full">
                  {slide.content.map((point, i) => (
                    <li key={i} className="text-2xl flex items-start w-full" style={textSecondary}>
                      <span className="w-2 h-2 rounded-full mr-6 mt-3 shrink-0" style={{ backgroundColor: theme.accentColor }} />
                      <AutoTextarea 
                        value={cleanText(point)}
                        onChange={(e) => updateContent(i, e.target.value)}
                        className="editable-input bg-transparent"
                      />
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        );

      case SlideLayout.BIG_NUMBER:
        return (
          <div className={`flex h-full items-center justify-center p-12 gap-16 ${animationClass}`}>
            <div className="flex-1 text-right">
               <span className="text-[12rem] font-black leading-none block" style={{ color: theme.accentColor }}>
                 {cleanText(slide.title).match(/\d+%?/) ? cleanText(slide.title).match(/\d+%?/)![0] : "100%"}
               </span>
            </div>
            <div className="w-1 h-64 bg-opacity-20 rounded-full" style={{ backgroundColor: theme.textSecondary }}></div>
            <div className="flex-1">
               <AutoTextarea 
                 value={cleanText(slide.title).replace(/\d+%?/, '').trim() || cleanText(slide.title)}
                 onChange={(e) => updateTitle(e.target.value)}
                 className="editable-input text-4xl font-bold mb-6 bg-transparent" 
                 style={textPrimary}
               />
               {slide.content.map((p, i) => (
                 <AutoTextarea 
                    key={i}
                    value={cleanText(p)}
                    onChange={(e) => updateContent(i, e.target.value)}
                    className="editable-input text-xl mb-2 bg-transparent" 
                    style={textSecondary}
                 />
               ))}
            </div>
          </div>
        );

      case SlideLayout.THREE_COLUMN:
        return (
           <div className={`flex flex-col h-full p-12 ${animationClass}`}>
             <AutoTextarea 
                value={cleanText(slide.title)} 
                onChange={(e) => updateTitle(e.target.value)}
                className="editable-input text-4xl font-bold mb-12 text-center bg-transparent" 
                style={textPrimary}
             />
             <div className="flex-1 grid grid-cols-3 gap-8">
               {slide.content.slice(0, 3).map((item, i) => (
                 <div key={i} className="rounded-2xl p-6 border flex flex-col items-center text-center shadow-lg backdrop-blur-sm transition-transform hover:-translate-y-2" style={cardStyle}>
                   <div className="w-12 h-12 rounded-full mb-6 flex items-center justify-center text-white font-bold text-xl shadow-md" style={{ backgroundColor: theme.accentColor }}>{i+1}</div>
                   <AutoTextarea 
                     value={cleanText(item)}
                     onChange={(e) => updateContent(i, e.target.value)}
                     className="editable-input text-lg leading-relaxed text-center bg-transparent h-full" 
                     style={textSecondary}
                   />
                 </div>
               ))}
             </div>
           </div>
        );

      case SlideLayout.COMPARISON:
         return (
           <div className={`flex flex-col h-full p-10 ${animationClass}`}>
             <AutoTextarea 
                value={cleanText(slide.title)} 
                onChange={(e) => updateTitle(e.target.value)}
                className="editable-input text-4xl font-bold mb-10 text-center bg-transparent" 
                style={textPrimary}
             />
             <div className="flex-1 flex gap-8">
                <div className="flex-1 rounded-2xl p-8 border border-opacity-10 bg-green-500/5 border-green-500/30">
                   <h3 className="text-2xl font-bold mb-6 text-green-400">Pros / Before</h3>
                   <ul className="space-y-4">
                     {slide.content.filter((_, i) => i % 2 === 0).map((item, i) => (
                       <li key={i} className="flex items-start text-lg" style={textSecondary}>
                         <span className="mr-3 text-green-400">✓</span> 
                         <AutoTextarea value={cleanText(item)} onChange={(e) => updateContent(i * 2, e.target.value)} className="editable-input bg-transparent" />
                       </li>
                     ))}
                   </ul>
                </div>
                <div className="flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                     <ArrowRightLeft className="text-slate-400" />
                   </div>
                </div>
                <div className="flex-1 rounded-2xl p-8 border border-opacity-10 bg-red-500/5 border-red-500/30">
                   <h3 className="text-2xl font-bold mb-6 text-red-400">Cons / After</h3>
                   <ul className="space-y-4">
                     {slide.content.filter((_, i) => i % 2 !== 0).map((item, i) => (
                       <li key={i} className="flex items-start text-lg" style={textSecondary}>
                         <span className="mr-3 text-red-400">×</span> 
                         <AutoTextarea value={cleanText(item)} onChange={(e) => updateContent(i * 2 + 1, e.target.value)} className="editable-input bg-transparent" />
                       </li>
                     ))}
                   </ul>
                </div>
             </div>
           </div>
         );

      case SlideLayout.QUOTE:
        return (
          <div className={`flex flex-col items-center justify-center h-full px-20 relative ${animationClass}`}>
            <div className="absolute top-10 left-10 opacity-10">
               <Quote size={120} color={theme.textPrimary} />
            </div>
            <AutoTextarea 
               value={cleanText(slide.content[0])} 
               onChange={(e) => updateContent(0, e.target.value)}
               className="editable-input text-5xl font-serif italic text-center leading-relaxed relative z-10 drop-shadow-md bg-transparent" 
               style={textPrimary}
            />
            <div className="mt-12 flex items-center gap-2">
               <span style={{ color: theme.accentColor }} className="text-2xl font-bold">—</span>
               <AutoTextarea 
                 value={cleanText(slide.title)}
                 onChange={(e) => updateTitle(e.target.value)}
                 className="editable-input text-2xl font-bold tracking-wider uppercase bg-transparent w-auto min-w-[200px]" 
                 style={{ color: theme.accentColor }}
               />
            </div>
          </div>
        );

      case SlideLayout.GALLERY:
        return (
          <div className={`flex flex-col h-full p-10 ${animationClass}`}>
            <AutoTextarea 
               value={cleanText(slide.title)} 
               onChange={(e) => updateTitle(e.target.value)}
               className="editable-input text-3xl font-bold mb-6 bg-transparent" 
               style={textPrimary}
            />
            <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
               <div className="row-span-2 rounded-xl overflow-hidden shadow-lg relative group">
                  <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Main" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <AutoTextarea 
                      value={cleanText(slide.content[0])} 
                      onChange={(e) => updateContent(0, e.target.value)}
                      className="editable-input text-white text-xl font-medium bg-transparent"
                    />
                  </div>
               </div>
               <div className="rounded-xl overflow-hidden shadow-lg relative bg-black/30 group">
                  <img src={`https://picsum.photos/seed/${slide.imageKeyword}2/600/400`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Secondary" />
                  <div className="absolute bottom-4 left-4 right-4">
                     <AutoTextarea 
                       value={cleanText(slide.content[1])} 
                       onChange={(e) => updateContent(1, e.target.value)}
                       className="editable-input text-white font-medium bg-transparent"
                     />
                  </div>
               </div>
               <div className="rounded-xl overflow-hidden shadow-lg relative bg-black/30 group">
                  <img src={`https://picsum.photos/seed/${slide.imageKeyword}3/600/400`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Tertiary" />
                   <div className="absolute bottom-4 left-4 right-4">
                     <AutoTextarea 
                       value={cleanText(slide.content[2])} 
                       onChange={(e) => updateContent(2, e.target.value)}
                       className="editable-input text-white font-medium bg-transparent"
                     />
                   </div>
               </div>
            </div>
          </div>
        );

      case SlideLayout.TWO_COLUMN:
        return (
          <div className={`flex h-full ${animationClass}`}>
            <div className="w-1/2 p-14 flex flex-col justify-center">
              <AutoTextarea 
                 value={cleanText(slide.title)} 
                 onChange={(e) => updateTitle(e.target.value)}
                 className="editable-input text-5xl font-bold mb-10 leading-tight bg-transparent" 
                 style={textPrimary}
              />
              <div className="space-y-6">
                {slide.content.map((point, i) => (
                  <AutoTextarea 
                    key={i}
                    value={cleanText(point)}
                    onChange={(e) => updateContent(i, e.target.value)}
                    className="editable-input text-xl leading-relaxed opacity-90 bg-transparent" 
                    style={textSecondary}
                  />
                ))}
              </div>
            </div>
            <div className="w-1/2 p-6 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative group">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={imageUrl} 
                  alt="Slide visual" 
                  className="object-cover w-full h-full transform transition-transform duration-1000 hover:scale-105" 
                />
              </div>
            </div>
          </div>
        );

      case SlideLayout.CODE_BLOCK:
         return (
           <div className={`flex flex-col h-full p-12 ${animationClass}`}>
             <div className="text-3xl font-mono font-bold mb-8 flex items-center gap-4" style={textPrimary}>
               <Code className="text-emerald-400 shrink-0" /> 
               <AutoTextarea 
                 value={cleanText(slide.title)} 
                 onChange={(e) => updateTitle(e.target.value)}
                 className="editable-input bg-transparent"
               />
             </div>
             <div className="flex-1 bg-[#1e1e1e] rounded-xl p-8 overflow-hidden shadow-2xl font-mono text-sm border border-slate-700 relative">
               <div className="absolute top-4 right-4 flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <textarea 
                 value={slide.content.join('\n\n')}
                 onChange={(e) => onUpdate({...slide, content: e.target.value.split('\n\n')})}
                 className="w-full h-full bg-transparent text-slate-300 outline-none resize-none mt-4 whitespace-pre-wrap leading-relaxed"
                 spellCheck={false}
               />
             </div>
           </div>
         );

      case SlideLayout.BULLET_POINTS:
      default:
        return (
          <div className={`p-14 h-full flex flex-col ${animationClass}`}>
            <div className="mb-10 border-b pb-6" style={{ borderColor: theme.accentColor }}>
               <AutoTextarea 
                 value={cleanText(slide.title)} 
                 onChange={(e) => updateTitle(e.target.value)}
                 className="editable-input text-5xl font-bold bg-transparent" 
                 style={textPrimary}
               />
               <AutoTextarea 
                 value={cleanText(slide.subtitle)} 
                 onChange={(e) => updateSubtitle(e.target.value)}
                 className="editable-input text-xl mt-3 font-medium opacity-80 bg-transparent" 
                 style={{ color: theme.accentColor }}
                 placeholder="Subtitle..."
               />
            </div>
            <div className="flex-1 flex flex-col justify-start pt-4 overflow-y-auto custom-scrollbar pr-2">
              <ul className="space-y-6">
                {slide.content.map((point, i) => (
                  <li key={i} className="flex items-start p-5 rounded-xl transition-all hover:bg-white/5" style={cardStyle}>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-5 shadow-sm" style={{ backgroundColor: theme.accentColor, color: theme.cardBg }}>
                      {i + 1}
                    </span>
                    <AutoTextarea 
                      value={cleanText(point)}
                      onChange={(e) => updateContent(i, e.target.value)}
                      className="editable-input text-2xl bg-transparent" 
                      style={textSecondary}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full rounded-xl overflow-hidden shadow-2xl relative transition-all duration-500"
      style={containerStyle}
    >
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(${theme.textSecondary} 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
      {/* Background Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ backgroundColor: theme.accentColor }} />
      <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] rounded-full blur-[120px] opacity-10" style={{ backgroundColor: theme.textPrimary }} />

      <div className="relative z-10 w-full h-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default SlideRenderer;