import React, { useState, useRef, useEffect } from 'react';
import { DataItem } from '../InterfacesForCardView';

/**
 * A custom hook for handling card interactions including clicks, double clicks, and hover events
 * with visual feedback through ripple animations.
 * 
 * @param onClick - Optional callback for single click events
 * @param onDoubleClick - Optional callback for double click events
 * @param onHover - Optional callback for hover events
 * @returns An object containing interaction state and handlers
 * 
 * @example
 * const {
 *   clickAnimation,
 *   ripplePosition,
 *   isHovered,
 *   cardRef,
 *   handleClick,
 *   handleMouseEnter,
 *   handleMouseLeave
 * } = useCardInteractions(
 *   (item, e) => console.log('Single click', item),
 *   (item, e) => console.log('Double click', item),
 *   (item, e) => console.log('Hover', item)
 * );
 */
export const useCardInteractions = (
  onClick?: (item: DataItem, event: React.MouseEvent) => void,
  onDoubleClick?: (item: DataItem, event: React.MouseEvent) => void,
  onHover?: (item: DataItem, event: React.MouseEvent) => void
) => {
  // Tracks the current animation type (null when no animation)
  const [clickAnimation, setClickAnimation] = useState<'single' | 'double' | 'select' | null>(null);
  
  // Stores the position where the ripple effect should originate
  const [ripplePosition, setRipplePosition] = useState<{ x: number, y: number } | null>(null);
  
  // Tracks whether the card is currently being hovered
  const [isHovered, setIsHovered] = useState(false);
  
  // Ref to the card element for position calculations
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Ref to store the timeout ID for click detection
  const timeoutRef = useRef<any>(null);

  /**
   * Calculates the relative position of a mouse event within the card element
   * @param event - The mouse event
   * @returns An object with x and y coordinates relative to the card
   */
  const getRelativePosition = (event: React.MouseEvent) => {
    if (!cardRef.current) return { x: 0, y: 0 };

    const rect = cardRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  /**
   * Handles click events and distinguishes between single and double clicks
   * @param item - The data item associated with the card
   * @param event - The mouse event
   */
  const handleClick = (item: DataItem, event: React.MouseEvent) => {
    // Clear any existing timeout to prevent single click after double click
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      
      // This was a double click
      setClickAnimation('double');
      const position = getRelativePosition(event);
      setRipplePosition(position);
      onDoubleClick?.(item, event);

      // Reset animation after delay
      setTimeout(() => {
        setClickAnimation(null);
        setRipplePosition(null);
      }, 600);
    } else {
      // Set timeout to wait for potential double click
      timeoutRef.current = setTimeout(() => {
        // This was a single click
        setClickAnimation('single');
        const position = getRelativePosition(event);
        setRipplePosition(position);
        onClick?.(item, event);

        // Reset animation after delay
        setTimeout(() => {
          setClickAnimation(null);
          setRipplePosition(null);
        }, 600);

        timeoutRef.current = null;
      }, 300); // Wait 300ms to see if this is a double click
    }
  };

  /**
   * Handles mouse enter events and triggers hover callback
   * @param item - The data item associated with the card
   * @param event - The mouse event
   */
  const handleMouseEnter = (item: DataItem, event: React.MouseEvent) => {
    setIsHovered(true);
    onHover?.(item, event);
  };

  /**
   * Handles mouse leave events and resets hover state
   */
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Clean up timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    clickAnimation,  // Current animation type: 'single', 'double', 'select', or null
    ripplePosition,  // Position for ripple effect: {x, y} or null
    isHovered,       // Boolean indicating if card is being hovered
    cardRef,         // Ref to attach to the card element
    handleClick,     // Click handler function
    handleMouseEnter,// Mouse enter handler function
    handleMouseLeave // Mouse leave handler function
  };
};