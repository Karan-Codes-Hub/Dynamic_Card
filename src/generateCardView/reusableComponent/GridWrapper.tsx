import React from 'react';

interface GridWrapperProps {
  /** Number of columns in the grid (default: 3) */
  columns?: number;
  /** Gap between grid items (default: '24px') */
  gap?: string;
  /** Minimum width for each grid item (default: '300px') */
  minItemWidth?: string;
  /**Maximum width for each grid item (default: '1fr') */
  maxItemWidth?: string;
  /** React children to be rendered in the grid */
  children: React.ReactNode;
  /** Additional class name for custom styling */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

/**
 * A responsive grid wrapper component that automatically adjusts columns based on available space.
 */
const GridWrapper: React.FC<GridWrapperProps> = ({
  columns = 3,
  gap = "24px",
  minItemWidth = "500px", 
  maxItemWidth = "1fr",
  children,
  className = "",
  style = {},
}) => {
  const gridStyles = `
    .grid-wrapper {
      display: grid;
      gap: ${gap};
      grid-template-columns: repeat(auto-fill, minmax(${minItemWidth}, ${maxItemWidth}));
      width: 100%;
    }

  `;  

  return (
    <div
      className={`grid-wrapper ${className}`}
      style={style}
      data-testid="grid-wrapper"
    >
      {children}
      <style>{gridStyles}</style>
    </div>
  );
};


export default GridWrapper;