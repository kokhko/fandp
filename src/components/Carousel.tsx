import React, { useEffect, useState, useRef } from 'react';
import { GalleryItem } from '../types';
import { ChevronLeft, ChevronRight, Eye, LayoutGrid, Heart } from 'lucide-react';

interface CarouselProps {
  items: GalleryItem[];
  onViewAllClick: () => void;
}

export default function Carousel({ items, onViewAllClick }: CarouselProps) {
  const publicItems = items.filter(item => item.isPublic);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setCurrentIndex((prevIndex) =>
          prevIndex === publicItems.length - 1 ? 0 : prevIndex + 1
        ),
      4000 // auto scroll every 4 seconds
    );

    return () => {
      resetTimeout();
    };
  }, [currentIndex, publicItems.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? publicItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === publicItems.length - 1 ? 0 : prev + 1));
  };

  if (publicItems.length === 0) return null;

  return (
    <div className="bg-sand/15 text-stone-900 py-12 sm:py-16 border-t border-wood/10 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title row */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 text-center sm:text-left gap-4">
          <div>
            <h3 className="font-display font-extrabold text-2xl text-forest tracking-tight">수려한 오프캠프 전경 롤러</h3>
            <span className="text-xs text-stone-500 font-semibold font-sans block mt-1">
              ※ F&P 갤러리 피드에서 [전체 공유]로 설정된 리얼 타임 포토 스냅들이 자동으로 노출됩니다.
            </span>
          </div>
          <button
            onClick={onViewAllClick}
            className="flex items-center space-x-1.5 bg-forest hover:bg-forest-dark text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md active:scale-95 cursor-pointer transition-all"
          >
            <LayoutGrid className="h-4 w-4" />
            <span>추억 전체보기</span>
          </button>
        </div>

        {/* Carousel stage */}
        <div className="relative group/carousel h-[38vh] sm:h-[45vh] md:h-[50vh] rounded-2xl overflow-hidden shadow-2xl border border-wood/20">
          
          {/* Slides */}
          <div className="w-full h-full relative">
            {publicItems.map((item, index) => {
              const isActive = index === currentIndex;
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                    isActive 
                      ? 'opacity-100 scale-100 z-10' 
                      : 'opacity-0 scale-95 pointer-events-none z-0'
                  }`}
                >
                  {/* Photo content background */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Backdrop Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Context Cards */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10 text-left space-y-2 max-w-3xl z-10">
                    <div className="flex items-center space-x-2 text-[10px] sm:text-xs">
                      <span className="bg-forest text-white px-2.5 py-1 rounded-full font-bold">
                        {item.division}
                      </span>
                      <span className="text-stone-300 font-bold">
                        올린 사람: {item.author} 회원
                      </span>
                      <span className="text-stone-400 font-mono font-semibold">
                        | {item.createdAt}
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-display text-white drop-shadow-md tracking-tight leading-tight">
                      {item.title}
                    </h4>
                    
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal line-clamp-2 md:line-clamp-none max-w-2xl drop-shadow-sm opacity-95">
                      {item.description}
                    </p>

                    <div className="pt-2 flex items-center space-x-4 text-xs">
                      <span className="inline-flex items-center space-x-1.5 text-red-400">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        <span className="font-mono font-bold">{item.likes} Likes</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls arrows (hidden by default, show on hover) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:block"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/80 text-white opacity-0 group-hover/carousel:opacity-100 transition-opacity z-20 cursor-pointer hidden sm:block"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-4 right-4 flex space-x-1.5 z-25">
            {publicItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  index === currentIndex ? 'w-5 bg-sand' : 'w-2 bg-stone-400/50'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
