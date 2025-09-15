import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CardLayoutOptions } from '../InterfacesForCardView';
import GridWrapper from './GridWrapper';
import {getCardViewOptions} from "../cardViewComponents/CardViewContext";
interface CardLayoutWrapperProps {
  /** Layout configuration options */
  layoutOptions?: CardLayoutOptions;
  /** React children to be rendered in the layout */
  children: React.ReactNode;
  /** Additional class name for custom styling */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
  /** Optional ID for accessibility */
  id?: string;
}

/**
 * Universal Card Layout Wrapper Component
 * Renders children in grid, masonry, carousel, or stack layout with modern, industry-standard styling
 */
const CardLayoutWrapper: React.FC<CardLayoutWrapperProps> = ({
  children,
  id,
}) => {
  const { options } = getCardViewOptions();
  const layoutOptions: CardLayoutOptions = options?.layout || {} as CardLayoutOptions;
  const className= options?.layout?.className || '';
  const style = options?.layout?.style || {};
  const {
    type = 'grid',
    columns = 4,
    gap = '24px',
    padding = '16px',
    gridOptions = {},
    masonryOptions = {},
    carouselOptions = {},
    stackOptions = {},
    breakpoints,
  } = layoutOptions;

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStackIndex, setCurrentStackIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Validate props
  useEffect(() => {
    if (!React.Children.count(children)) {
      setError('CardLayoutWrapper requires at least one child component');
    } else if (type === 'carousel' && carouselOptions.visibleCards && carouselOptions.visibleCards > React.Children.count(children)) {
      setError('visibleCards cannot exceed the number of children');
    } else {
      setError(null);
    }
  }, [children, type, carouselOptions.visibleCards]);

  // Memoize child count
  const childCount = useMemo(() => React.Children.count(children), [children]);

  // Carousel auto-play effect
  useEffect(() => {
    if (type !== 'carousel' || !carouselOptions.autoPlay || carouselOptions.autoPlay <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        const visibleCards = carouselOptions.visibleCards || 3;
        const maxSlide = Math.max(0, childCount - visibleCards);
        
        return carouselOptions.infinite
          ? (prev + 1) % (maxSlide + 1)
          : prev >= maxSlide ? 0 : prev + 1;
      });
    }, carouselOptions.autoPlay);

    return () => clearInterval(interval);
  }, [type, carouselOptions, childCount]);

  // Scroll carousel to current slide
  useEffect(() => {
    if (type === 'carousel' && carouselRef.current) {
      const visibleCards = carouselOptions.visibleCards || 3;
      const itemWidth = carouselRef.current.scrollWidth / childCount;
      carouselRef.current.scrollTo({
        left: currentSlide * itemWidth * visibleCards,
        behavior: 'smooth',
      });
    }
  }, [currentSlide, type, carouselOptions, childCount]);

  // Handle drag/touch events
  const handleDragStart = useCallback((clientX: number) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setStartX(clientX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  }, []);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const x = clientX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  }, [handleDragStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDrag(e.touches[0].clientX);
  }, [handleDrag]);

  // Stack navigation
  const showNextStack = useCallback(() => {
    const maxVisible = stackOptions.maxVisible || 5;
    const maxIndex = Math.max(0, childCount - maxVisible);
    
    setCurrentStackIndex(prev => 
      prev < maxIndex 
        ? prev + 1 
        : stackOptions.infinite ? 0 : prev
    );
  }, [stackOptions, childCount]);

  const showPreviousStack = useCallback(() => {
    const maxVisible = stackOptions.maxVisible || 5;
    const maxIndex = Math.max(0, childCount - maxVisible);
    
    setCurrentStackIndex(prev => 
      prev > 0 
        ? prev - 1 
        : stackOptions.infinite ? maxIndex : prev
    );
  }, [stackOptions, childCount]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (type === 'stack') {
        if (e.key === 'ArrowRight') showNextStack();
        if (e.key === 'ArrowLeft') showPreviousStack();
      }
      if (type === 'carousel') {
        const visibleCards = carouselOptions.visibleCards || 3;
        const maxSlide = Math.max(0, childCount - visibleCards);
        
        if (e.key === 'ArrowRight') {
          setCurrentSlide(prev => 
            prev < maxSlide 
              ? prev + 1 
              : carouselOptions.infinite ? 0 : prev
          );
        }
        if (e.key === 'ArrowLeft') {
          setCurrentSlide(prev => 
            prev > 0 
              ? prev - 1 
              : carouselOptions.infinite ? maxSlide : prev
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, carouselOptions, childCount, showNextStack, showPreviousStack]);

  const renderGridLayout = useCallback(() => {
    const { minItemWidth = '300px', maxItemWidth = '1fr', autoFlow = 'auto-fit' } = gridOptions;
    
    return (
      <GridWrapper
        columns={columns}
        gap={typeof gap === 'number' ? `${gap}px` : gap}
        minItemWidth={minItemWidth}
        maxItemWidth={maxItemWidth}
        // autoFlow={autoFlow}
        className={`dark:bg-gray-800 ${className}`}
        style={{
          padding: typeof padding === 'number' ? `${padding}px` : padding,
          ...style,
        }}
      >
        {children}
      </GridWrapper>
    );
  }, [columns, gap, gridOptions, padding, className, style, children]);

  const renderMasonryLayout = useCallback(() => {
    const { columnWidth = '300px', gutter = gap, transitionDuration = '0.3s', stagger = '0.03s' } = masonryOptions;

    const masonryStyles = `
      .masonry-layout {
        column-count: ${columns};
        column-gap: ${typeof gutter === 'number' ? `${gutter}px` : gutter};
        column-width: ${columnWidth};
        padding: ${typeof padding === 'number' ? `${padding}px` : padding};
        width: 100%;
        box-sizing: border-box;
        background: linear-gradient(180deg, #ffffff, #f9fafb);
        dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900;
        border-radius: 12px;
      }

      .masonry-item {
        break-inside: avoid;
        margin-bottom: ${typeof gutter === 'number' ? `${gutter}px` : gutter};
        width: 100% !important;
        transition: all ${transitionDuration} ease;
        animation: fadeIn 0.5s ease forwards;
        animation-delay: calc(${stagger} * var(--index));
        opacity: 0;
        transform: translateY(20px);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .masonry-item:hover {
        transform: translateY(10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      @keyframes fadeIn {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      ${breakpoints ? Object.entries(breakpoints).map(([breakpoint, config]) => `
        @media (max-width: ${breakpoint}px) {
          .masonry-layout {
            column-count: ${config?.columns || columns};
            column-gap: ${config?.gap ? (typeof config?.gap === 'number' ? `${config?.gap}px` : config?.gap) : gutter};
          }
        }
      `).join('') : ''}

      @media (max-width: 1024px) {
        .masonry-layout {
          column-count: ${Math.max(1, Math.floor(columns * 0.75))};
        }
      }

      @media (max-width: 768px) {
        .masonry-layout {
          column-count: ${Math.max(1, Math.floor(columns * 0.5))};
        }
      }

      @media (max-width: 480px) {
        .masonry-layout {
          column-count: 1;
        }
      }
    `;

    return (
      <div
        id={id}
        className={`masonry-layout ${className}`}
        style={style}
        data-layout-type="masonry"
        role="region"
        aria-label="Masonry layout"
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="masonry-item"
            style={{ '--index': index } as React.CSSProperties}
            role="group"
            aria-label={`Card ${index + 1}`}
          >
            {child}
          </div>
        ))}
        <style>{masonryStyles}</style>
      </div>
    );
  }, [columns, gap, masonryOptions, padding, className, style, id, children]);

  const renderCarouselLayout = useCallback(() => {
    const { visibleCards = 3, transitionDuration = 300, centerMode = false, centerPadding = '60px', showArrows = true, showDots = true } = carouselOptions;
    const maxSlide = Math.max(0, childCount - visibleCards);

    const carouselStyles = `
      .carousel-container {
        position: relative;
        width: 100%;
        touch-action: pan-y;
        background: linear-gradient(180deg, #ffffff, #f9fafb);
        dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900;
        border-radius: 12px;
        padding: 16px;
      }

      .carousel-layout {
        display: flex;
        gap: ${typeof gap === 'number' ? `${gap}px` : gap};
        padding: ${typeof padding === 'number' ? `${padding}px` : padding};
        overflow-x: hidden;
        scroll-behavior: smooth;
        transition: all ${transitionDuration}ms ease-in-out;
        ${centerMode ? `padding-left: ${centerPadding}; padding-right: ${centerPadding};` : ''}
        cursor: ${isDragging ? 'grabbing' : 'grab'};
        user-select: none;
      }

      .carousel-item {
        flex: 0 0 calc(${100 / visibleCards}% - ${typeof gap === 'number' ? `${gap}px` : gap} * (${visibleCards - 1} / ${visibleCards}));
        min-width: 0;
        transition: transform ${transitionDuration}ms ease-in-out, box-shadow 0.2s ease;
        ${centerMode ? 'transform: scale(0.95);' : ''}
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .carousel-item.active {
        ${centerMode ? 'transform: scale(1);' : ''}
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .carousel-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px;
        cursor: pointer;
        border-radius: 50%;
        z-index: 10;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .carousel-nav:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .carousel-nav:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-50%) scale(1.1);
      }

      .carousel-nav.prev {
        left: 16px;
      }

      .carousel-nav.next {
        right: 16px;
      }

      .carousel-controls {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-top: 16px;
      }

      .carousel-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #d1d5db;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .carousel-dot:hover:not(.active) {
        transform: scale(1.2);
        background: #9ca3af;
      }

      .carousel-dot.active {
        background: #3b82f6;
        border-color: #2563eb;
        transform: scale(1.2);
      }
    `;

    return (
      <div className="carousel-container" id={id} role="region" aria-label="Carousel layout">
        <div
          ref={carouselRef}
          className={`carousel-layout ${className}`}
          style={style}
          data-layout-type="carousel"
          onMouseLeave={handleDragEnd}
          onMouseUp={handleDragEnd}
          onMouseMove={e => handleDrag(e.clientX)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={`carousel-item ${index >= currentSlide && index < currentSlide + visibleCards ? 'active' : ''}`}
              role="group"
              aria-label={`Slide ${index + 1}`}
            >
              {child}
            </div>
          ))}
        </div>

        {showArrows && (
          <>
            <button
              className="carousel-nav prev"
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0 && !carouselOptions.infinite}
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              className="carousel-nav next"
              onClick={() => setCurrentSlide(prev => Math.min(maxSlide, prev + 1))}
              disabled={currentSlide === maxSlide && !carouselOptions.infinite}
              aria-label="Next slide"
            >
              →
            </button>
          </>
        )}

        {showDots && (
          <div className="carousel-controls" role="tablist">
            {Array.from({ length: maxSlide + 1 }).map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                role="tab"
                aria-selected={index === currentSlide}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        <style>{carouselStyles}</style>
      </div>
    );
  }, [carouselOptions, childCount, className, style, id, isDragging, handleDragStart, handleDragEnd, handleDrag, handleTouchStart, handleTouchMove, currentSlide]);

  const renderStackLayout = useCallback(() => {
    const { offset = 30, scale = 0.9, rotation = 5, perspective = 1200, maxVisible = 5, transitionDuration = '0.4s', peek = 0 } = stackOptions;
    const maxIndex = Math.max(0, childCount - maxVisible);

    const stackStyles = `
      .stack-container {
        position: relative;
        width: 100%;
        height: ${offset * maxVisible + 200}px;
        perspective: ${perspective}px;
        touch-action: pan-y;
        background: linear-gradient(180deg, #ffffff, #f9fafb);
        dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900;
        border-radius: 12px;
        padding: 16px;
      }

      .stack-layout {
        position: relative;
        width: 100%;
        height: 100%;
        transition: all ${transitionDuration};
      }

      .stack-item {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: all ${transitionDuration} ease-in-out;
        transform-origin: center center;
        cursor: pointer;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        background: #ffffff;
        dark:bg-gray-700;
        user-select: none;
      }

      .stack-item:hover {
        z-index: 1000;
        transform: scale(1.05) rotate(0deg) !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
        background: #f9fafb;
        dark:bg-gray-600;
      }

      .stack-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: #3b82f6;
        color: white;
        border: none;
        padding: 12px;
        cursor: pointer;
        border-radius: 50%;
        z-index: 20;
        font-size: 18px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .stack-nav:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .stack-nav:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-50%) scale(1.1);
      }

      .stack-nav.prev {
        left: 16px;
      }

      .stack-nav.next {
        right: 16px;
      }

      .stack-counter {
        position: absolute;
        bottom: 16px;
        left: 50%;
        transform: translateX(-50%);
        background: #3b82f6;
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 20;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .stack-peek {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 64px;
        background: #6b7280;
        border-radius: 4px;
        cursor: pointer;
        z-index: 15;
        transition: background 0.2s ease;
      }

      .stack-peek:hover {
        background: #4b5563;
      }
    `;

    return (
      <div className="stack-container" id={id} role="region" aria-label="Stack layout">
        <div className={`stack-layout ${className}`} style={style}>
          {React.Children.map(children, (child, index) => {
            if (index < currentStackIndex || index >= currentStackIndex + maxVisible) return null;

            const stackPosition = index - currentStackIndex;
            const translateY = stackPosition * offset;
            const itemScale = Math.pow(scale, stackPosition);
            const itemRotation = stackPosition * rotation * (stackPosition % 2 === 0 ? 1 : -1);
            const zIndex = maxVisible - stackPosition;
            const opacity = 1 - stackPosition * 0.1;
            const peekOffset = stackPosition === maxVisible - 1 ? peek : 0;

            return (
              <div
                key={index}
                className="stack-item"
                style={{
                  transform: `translateY(${translateY}px) translateX(${peekOffset}px) scale(${itemScale}) rotate(${itemRotation}deg)`,
                  zIndex,
                  opacity,
                  cursor: stackPosition === 0 ? 'pointer' : 'default',
                }}
                onClick={() => stackPosition === 0 && showNextStack()}
                role="group"
                aria-label={`Card ${index + 1}`}
              >
                {child}
              </div>
            );
          })}
        </div>

        <button
          className="stack-nav prev"
          onClick={showPreviousStack}
          disabled={currentStackIndex === 0 && !stackOptions.infinite}
          aria-label="Previous card"
        >
          ←
        </button>

        <button
          className="stack-nav next"
          onClick={showNextStack}
          disabled={currentStackIndex >= maxIndex && !stackOptions.infinite}
          aria-label="Next card"
        >
          →
        </button>

        <div className="stack-counter" aria-live="polite">
          {currentStackIndex + 1} / {childCount}
        </div>

        {peek > 0 && currentStackIndex < maxIndex && (
          <div
            className="stack-peek"
            onClick={showNextStack}
            title="Show next card"
            role="button"
            aria-label="Show next card"
          />
        )}

        <style>{stackStyles}</style>
      </div>
    );
  }, [stackOptions, childCount, currentStackIndex, className, style, id, showNextStack, showPreviousStack, children]);

  if (error) {
    return (
      <div role="alert" className="bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  switch (type) {
    case 'masonry':
      return renderMasonryLayout();
    case 'carousel':
      return renderCarouselLayout();
    case 'stack':
      return renderStackLayout();
    case 'grid':
    default:
      return renderGridLayout();
  }
};

// Memoize the component to prevent unnecessary re-renders
export default React.memo(CardLayoutWrapper);