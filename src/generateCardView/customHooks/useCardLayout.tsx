import { useEffect, useState } from "react";
import type { CardLayoutOptions } from "../InterfacesForCardView";

/**
 * Custom hook to determine and manage the card layout (grid/list) 
 * based on configuration and responsive breakpoints.
 *
 * @param config - Configuration object that defines layout behavior, including columns, breakpoints, padding, and gap.
 * @returns {object} - Returns the number of columns to display, layout type, and spacing preferences.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useCardLayout } from './hooks/useCardLayout';
 * import './ProductGrid.css'; // assuming some grid styles are defined
 * 
 * const config = {
 *   type: 'grid',
 *   columns: 4,
 *   gap: 16,
 *   padding: 24,
 *   breakpoints: {
 *     1200: { columns: 3 },
 *     992: { columns: 2 },
 *     768: { columns: 1 }
 *   }
 * };
 * 
 * const ProductGrid = ({ products }) => {
 *   const { columns, layoutType, gap, padding } = useCardLayout(config);
 * 
 *   return (
 *     <div
 *       className={`grid-container ${layoutType}`}
 *       style={{
 *         display: 'grid',
 *         gridTemplateColumns: `repeat(${columns}, 1fr)`,
 *         gap,
 *         padding
 *       }}
 *     >
 *       {products.map(product => (
 *         <div key={product.id} className="product-card">
 *           <h4>{product.name}</h4>
 *           <p>${product.price}</p>
 *         </div>
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export function useCardLayout(config: CardLayoutOptions) {
  const [columns, setColumns] = useState(config.columns || 3);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!config.breakpoints) return;

    const sortedBreakpoints = Object.keys(config.breakpoints)
      .map(Number)
      .sort((a, b) => b - a);

    const matchingBreakpoint = sortedBreakpoints.find(bp => windowWidth <= bp);

    if (matchingBreakpoint) {
      const bpConfig = config.breakpoints[matchingBreakpoint];
      if (bpConfig.columns) setColumns(bpConfig.columns);
    } else if (config.columns) {
      setColumns(config.columns);
    }
  }, [windowWidth, config.breakpoints, config.columns]);

  return {
    columns,
    layoutType: config.type || 'grid',
    gap: config.gap || 0,
    padding: config.padding || 0
  };
}
