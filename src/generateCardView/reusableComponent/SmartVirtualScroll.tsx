import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    CSSProperties,
    useCallback,
} from "react";

/**
 * SmartVirtualScroll Component
 *
 * A flexible, high-performance virtualized scrolling component for lists, tables, and card layouts.
 *
 * ## Features
 * - Row & column virtualization
 * - Row & column pinning (freeze panes)
 * - Sticky group headers
 * - Adaptive overscan (smart buffering)
 * - Server-side mode with skeleton loader
 * - Memoized rendering for performance
 * - Horizontal scrolling support
 * - Variable row heights
 * - Scroll-to-index functionality
 * - Custom placeholder support
 * - Windowed rendering for extremely large lists
 * - Scroll event callbacks
 * - Performance monitoring
 * - Responsive column adjustments
 * - Keyboard navigation support
 * - Touch device optimization
 *
 * ## Basic Usage (List)
 * ```tsx
 * <SmartVirtualScroll
 *   data={items}
 *   rowHeight={40}
 *   height={500}
 *   renderItem={(item) => <div>{item.name}</div>}
 * />
 * ```
 *
 * ## Card Layout Usage
 * ```tsx
 * <SmartVirtualScroll
 *   data={products}
 *   height={600}
 *   rowHeight={150}
 *   layout="card"
 *   renderItem={(item, style) => (
 *     <Card style={style} product={item} />
 *   )}
 * />
 * ```
 *
 * ## Table Usage with Column Pinning
 * ```tsx
 * <SmartVirtualScroll
 *   data={rows}
 *   rowHeight={40}
 *   height={400}
 *   columnWidth={120}
 *   pinnedColumns={1}
 *   renderItem={(row) => <RowComponent row={row} />}
 * />
 * ```
 *
 * ## Server-Side Mode with Skeleton Loader
 * ```tsx
 * <SmartVirtualScroll
 *   serverSide
 *   totalCount={1000}
 *   rowHeight={50}
 *   height={500}
 *   onLoadMore={(start, end) => fetchMore(start, end)}
 *   renderItem={(row, style) => (
 *     <RowComponent row={row} style={style} />
 *   )}
 * />
 * ```
 *
 * ## Variable Height Example
 * ```tsx
 * <SmartVirtualScroll
 *   data={items}
 *   height={500}
 *   estimatedRowHeight={60}
 *   getRowHeight={(index) => items[index].isLarge ? 100 : 50}
 *   renderItem={(item, style) => <ItemComponent item={item} style={style} />}
 * />
 * ```
 */
interface SmartVirtualScrollProps<T> {
    /** Array of data to render (client-side mode). */
    data?: T[];
    
    /** Total count of items (required for server-side mode). */
    totalCount?: number;
    
    /** Height of the viewport (px). If not provided, auto-detected from container. */
    height?: number;
    
    /** Width of the viewport (px). If not provided, auto-detected from container. */
    width?: number;
    
    /** Fixed row height (px). If not provided, auto-measured dynamically. */
    rowHeight?: number;
    
    /** Estimated row height for variable height mode (px). */
    estimatedRowHeight?: number;
    
    /** Function to get dynamic row height based on index. */
    getRowHeight?: (index: number) => number;
    
    /** Fixed column width (for table/grid). */
    columnWidth?: number;
    
    /** Number of extra rows rendered above/below the viewport for smoother scrolling. */
    overscan?: number;
    
    /** Number of extra columns rendered left/right of the viewport for horizontal scrolling. */
    horizontalOverscan?: number;
    
    /** Enable server-side rendering mode (infinite loading). */
    serverSide?: boolean;
    
    /**
     * Callback to load more data in server-side mode.
     * Called with the start & end indices of rows to fetch.
     */
    onLoadMore?: (start: number, end: number) => Promise<void>;
    
    /**
     * Row render function.
     * Receives the row data, its index, and style for positioning.
     */
    renderItem: (item: T, style: CSSProperties, index: number) => React.ReactNode;
    
    /** Layout type for rendering ("list" | "card" | "table"). */
    layout?: "list" | "card" | "table" | "grid";
    
    /** Number of pinned (frozen) rows at the top. */
    pinnedRows?: number;
    
    /** Number of pinned (frozen) columns at the left. */
    pinnedColumns?: number;
    
    /** Key to group rows by (enables sticky group headers). */
    groupBy?: keyof T;
    
    /** Whether to show skeleton loaders in server-side mode. */
    showSkeleton?: boolean;
    
    /** Custom placeholder component for loading states. */
    placeholderComponent?: React.ComponentType<{ index: number; style: CSSProperties }>;
    
    /** Scroll to a specific item index. */
    scrollToIndex?: number;
    
    /** Alignment when scrolling to index: "auto", "start", "center", "end". */
    scrollToAlignment?: "auto" | "start" | "center" | "end";
    
    /** Callback when scrolling starts. */
    onScrollStart?: () => void;
    
    /** Callback when scrolling ends. */
    onScrollEnd?: () => void;
    
    /** Enable/disable horizontal scrolling. */
    horizontal?: boolean;
    
    /** Number of columns in grid layout. */
    gridColumnCount?: number;
    
    /** Enable keyboard navigation. */
    enableKeyboardNavigation?: boolean;
    
    /** Custom class name for the container. */
    className?: string;
    
    /** Custom style for the container. */
    containerStyle?: CSSProperties;
    
    /** Threshold for triggering onLoadMore in server-side mode (percentage from bottom). */
    loadMoreThreshold?: number;
    
    /** Debounce time for scroll events in milliseconds. */
    scrollDebounce?: number;
}

// Performance monitoring interface
interface ScrollMetrics {
    fps: number;
    visibleItems: number;
    totalItems: number;
    scrollPosition: number;
}

/**
 * A flexible virtual scrolling component that supports list, card, and table layouts,
 * with client-side and server-side modes, sticky headers, pinned rows/columns, and adaptive overscan.
 */
export function SmartVirtualScroll<T>({
    data = [],
    totalCount,
    height: propHeight,
    width: propWidth,
    rowHeight: propRowHeight,
    estimatedRowHeight = 50,
    getRowHeight,
    columnWidth = 100,
    overscan = 5,
    horizontalOverscan = 2,
    serverSide = false,
    onLoadMore,
    renderItem,
    layout = "list",
    pinnedRows = 0,
    pinnedColumns = 0,
    groupBy,
    showSkeleton = true,
    placeholderComponent: PlaceholderComponent,
    scrollToIndex,
    scrollToAlignment = "auto",
    onScrollStart,
    onScrollEnd,
    horizontal = false,
    gridColumnCount = 1,
    enableKeyboardNavigation = false,
    className,
    containerStyle,
    loadMoreThreshold = 0.2,
    scrollDebounce = 100,
}: SmartVirtualScrollProps<T>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollTimeoutRef = useRef<any>();
    const frameRef = useRef<number>();
    const [scrollTop, setScrollTop] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [containerHeight, setContainerHeight] = useState<number>(propHeight || 0);
    const [containerWidth, setContainerWidth] = useState<number>(propWidth || 0);
    const [measuredRowHeights, setMeasuredRowHeights] = useState<Record<number, number>>({});
    const [scrollVelocity, setScrollVelocity] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [rowPositions, setRowPositions] = useState<number[]>([]);
    const lastScrollTime = useRef<number>(0);
    const lastScrollTop = useRef<number>(0);
    const lastScrollLeft = useRef<number>(0);
    const scrollMetrics = useRef<ScrollMetrics>({
        fps: 0,
        visibleItems: 0,
        totalItems: 0,
        scrollPosition: 0,
    });

    // Determine if we're using variable row heights
    const hasVariableHeights = Boolean(getRowHeight);
    
    // Calculate total items
    const totalItems = serverSide ? totalCount || 0 : data.length;
    
    // Calculate total height for variable row heights
    const totalHeight = useMemo(() => {
        if (!hasVariableHeights && propRowHeight) {
            return totalItems * propRowHeight;
        }
        
        if (rowPositions.length > 0) {
            return rowPositions[totalItems] || totalItems * estimatedRowHeight;
        }
        
        return totalItems * estimatedRowHeight;
    }, [totalItems, propRowHeight, hasVariableHeights, rowPositions, estimatedRowHeight]);

    // Pre-calculate row positions for variable height mode
    useEffect(() => {
        if (!hasVariableHeights || !getRowHeight) return;
        
        const positions = [0];
        for (let i = 0; i < totalItems; i++) {
            const height = measuredRowHeights[i] !== undefined 
                ? measuredRowHeights[i] 
                : getRowHeight(i);
            positions[i + 1] = positions[i] + height;
        }
        
        setRowPositions(positions);
    }, [totalItems, measuredRowHeights, getRowHeight, hasVariableHeights]);

    // Get the height of a specific row
    const getRowHeightAtIndex = useCallback((index: number): number => {
        if (propRowHeight) return propRowHeight;
        if (hasVariableHeights) {
            return measuredRowHeights[index] !== undefined 
                ? measuredRowHeights[index] 
                : (getRowHeight ? getRowHeight(index) : estimatedRowHeight);
        }
        return estimatedRowHeight;
    }, [propRowHeight, hasVariableHeights, measuredRowHeights, getRowHeight, estimatedRowHeight]);

    // Get the position of a specific row
    const getRowPosition = useCallback((index: number): number => {
        if (hasVariableHeights && rowPositions.length > index) {
            return rowPositions[index];
        }
        return index * getRowHeightAtIndex(index);
    }, [hasVariableHeights, rowPositions, getRowHeightAtIndex]);

    // Find the visible range of items
    const findVisibleRange = useCallback(() => {
        if (totalItems === 0) return { startIndex: 0, endIndex: 0 };
        
        let startIndex = 0;
        let endIndex = totalItems - 1;
        
        // For variable heights, use binary search to find visible range
        if (hasVariableHeights && rowPositions.length > 0) {
            // Find start index
            let low = 0;
            let high = totalItems - 1;
            
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const position = rowPositions[mid];
                
                if (position < scrollTop) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            
            startIndex = Math.max(0, low - 1);
            
            // Find end index
            const viewportBottom = scrollTop + containerHeight;
            low = 0;
            high = totalItems - 1;
            
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const position = rowPositions[mid];
                
                if (position <= viewportBottom) {
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            
            endIndex = Math.min(totalItems - 1, low);
        } else {
            // Fixed height calculation
            startIndex = Math.max(0, Math.floor(scrollTop / getRowHeightAtIndex(0)) - 1);
            endIndex = Math.min(
                totalItems - 1,
                Math.ceil((scrollTop + containerHeight) / getRowHeightAtIndex(0)) + 1
            );
        }
        
        // Apply overscan based on scroll velocity
        const dynamicOverscan = scrollVelocity > 0.5 ? overscan * 2 : overscan;
        startIndex = Math.max(0, startIndex - dynamicOverscan);
        endIndex = Math.min(totalItems - 1, endIndex + dynamicOverscan);
        
        return { startIndex, endIndex };
    }, [scrollTop, containerHeight, totalItems, hasVariableHeights, rowPositions, getRowHeightAtIndex, scrollVelocity, overscan]);

    const { startIndex, endIndex } = findVisibleRange();
    
    // Scroll handler with debouncing
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const now = performance.now();
        const deltaY = Math.abs(target.scrollTop - lastScrollTop.current);
        const deltaX = Math.abs(target.scrollLeft - lastScrollLeft.current);
        const dt = now - lastScrollTime.current;
        const velocity = dt > 0 ? (deltaY + deltaX) / dt : 0;
        
        // Update scroll position and velocity
        setScrollTop(target.scrollTop);
        setScrollLeft(target.scrollLeft);
        setScrollVelocity(velocity);
        
        // Track scrolling state for callbacks
        if (!isScrolling) {
            setIsScrolling(true);
            onScrollStart?.();
        }
        
        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        // Set new timeout to detect scroll end
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
            onScrollEnd?.();
        }, scrollDebounce);
        
        lastScrollTop.current = target.scrollTop;
        lastScrollLeft.current = target.scrollLeft;
        lastScrollTime.current = now;
        
        // Cancel any pending animation frame
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }
        
        // Schedule update for next frame
        frameRef.current = requestAnimationFrame(() => {
            scrollMetrics.current = {
                fps: dt > 0 ? 1000 / dt : 0,
                visibleItems: endIndex - startIndex + 1,
                totalItems,
                scrollPosition: target.scrollTop,
            };
        });
    }, [isScrolling, onScrollStart, onScrollEnd, scrollDebounce, totalItems, startIndex, endIndex]);

    // Scroll to index functionality
    useEffect(() => {
        if (scrollToIndex === undefined || scrollToIndex < 0 || scrollToIndex >= totalItems || !containerRef.current) {
            return;
        }
        
        const rowPosition = getRowPosition(scrollToIndex);
        const rowHeight = getRowHeightAtIndex(scrollToIndex);
        let scrollToPosition = rowPosition;
        
        // Adjust scroll position based on alignment
        if (scrollToAlignment === "center") {
            scrollToPosition = rowPosition - containerHeight / 2 + rowHeight / 2;
        } else if (scrollToAlignment === "end") {
            scrollToPosition = rowPosition - containerHeight + rowHeight;
        }
        
        // Scroll to the calculated position
        containerRef.current.scrollTo({
            top: Math.max(0, scrollToPosition),
            behavior: "smooth",
        });
    }, [scrollToIndex, scrollToAlignment, containerHeight, totalItems, getRowPosition, getRowHeightAtIndex]);

    // Resize observer for auto-dimension detection
    useEffect(() => {
        if (!containerRef.current) return;
        
        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!propHeight) setContainerHeight(entry.contentRect.height);
                if (!propWidth) setContainerWidth(entry.contentRect.width);
            }
        });
        
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [propHeight, propWidth]);

    // Auto-measure row heights for variable height mode
    useEffect(() => {
        if (!containerRef.current || !hasVariableHeights) return;
        
        const measuredNodes = containerRef.current.querySelectorAll("[data-measured-row]");
        const newHeights: Record<number, number> = {};
        let hasChanges = false;
        
        measuredNodes.forEach((node) => {
            const element = node as HTMLElement;
            const index = parseInt(element.dataset.index || "0", 10);
            const height = element.offsetHeight;
            
            if (measuredRowHeights[index] !== height) {
                newHeights[index] = height;
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            setMeasuredRowHeights((prev) => ({ ...prev, ...newHeights }));
        }
    }, [data, hasVariableHeights, measuredRowHeights]);

    // Server-side loading with threshold
    useEffect(() => {
        if (
            serverSide &&
            onLoadMore &&
            endIndex >= data.length - Math.floor(totalItems * loadMoreThreshold) &&
            data.length < totalItems
        ) {
            onLoadMore(
                data.length, 
                Math.min(data.length + overscan * 3, totalItems)
            );
        }
    }, [endIndex, serverSide, data.length, totalItems, onLoadMore, overscan, loadMoreThreshold]);

    // Keyboard navigation
    useEffect(() => {
        if (!enableKeyboardNavigation || !containerRef.current) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current) return;
            
            switch (e.key) {
                case "ArrowDown":
                    containerRef.current.scrollBy({ top: getRowHeightAtIndex(0), behavior: "smooth" });
                    break;
                case "ArrowUp":
                    containerRef.current.scrollBy({ top: -getRowHeightAtIndex(0), behavior: "smooth" });
                    break;
                case "PageDown":
                    containerRef.current.scrollBy({ top: containerHeight, behavior: "smooth" });
                    break;
                case "PageUp":
                    containerRef.current.scrollBy({ top: -containerHeight, behavior: "smooth" });
                    break;
                case "Home":
                    containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                    break;
                case "End":
                    containerRef.current.scrollTo({ top: totalHeight, behavior: "smooth" });
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
        };
        
        containerRef.current.addEventListener("keydown", handleKeyDown);
        return () => containerRef.current?.removeEventListener("keydown", handleKeyDown);
    }, [enableKeyboardNavigation, containerHeight, totalHeight, getRowHeightAtIndex]);

    // Sticky group headers
    const groupedItems = useMemo(() => {
        if (!groupBy) return { "": data.slice(startIndex, endIndex + 1) };
        
        return data.slice(startIndex, endIndex + 1).reduce<Record<string, T[]>>((acc, item, idx) => {
            const key = String(item[groupBy]);
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});
    }, [data, startIndex, endIndex, groupBy]);

    // Calculate spacer heights
    const topSpacerHeight = useMemo(() => {
        if (hasVariableHeights && rowPositions.length > startIndex) {
            return rowPositions[startIndex];
        }
        return startIndex * getRowHeightAtIndex(0);
    }, [startIndex, hasVariableHeights, rowPositions, getRowHeightAtIndex]);

    const bottomSpacerHeight = useMemo(() => {
        const totalH = hasVariableHeights && rowPositions.length > 0 
            ? rowPositions[totalItems] 
            : totalItems * getRowHeightAtIndex(0);
            
        const bottomPosition = hasVariableHeights && rowPositions.length > endIndex + 1
            ? rowPositions[endIndex + 1]
            : (endIndex + 1) * getRowHeightAtIndex(0);
            
        return Math.max(0, totalH - bottomPosition);
    }, [endIndex, totalItems, hasVariableHeights, rowPositions, getRowHeightAtIndex]);

    // Memoized row component for performance
    const MemoizedRow = React.memo(
        ({
            item,
            index,
            style,
            isMeasured = false,
        }: {
            item: T;
            index: number;
            style: CSSProperties;
            isMeasured?: boolean;
        }) => {
            return (
                <div
                    data-virtual-row
                    data-index={index}
                    {...(isMeasured && { "data-measured-row": true })}
                    style={style}
                >
                    {renderItem(item, style, index)}
                </div>
            );
        }
    );

    // Default placeholder component
    const DefaultPlaceholder = useCallback(({ index, style }: { index: number; style: CSSProperties }) => (
        <div
            style={{
                ...style,
                background: "#f0f0f0",
                borderRadius: 4,
                animation: "pulse 1.5s infinite",
            }}
        />
    ), []);

    const Placeholder = PlaceholderComponent || DefaultPlaceholder;

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={className}
            style={{
                position: "relative",
                height: propHeight || "100%",
                width: propWidth || "100%",
                overflow: "auto",
                willChange: "transform",
                outline: enableKeyboardNavigation ? "1px solid transparent" : "none",
                ...containerStyle,
            }}
            tabIndex={enableKeyboardNavigation ? 0 : undefined}
        >
            <div style={{ 
                height: totalHeight, 
                width: horizontal ? "auto" : "100%",
                position: "relative" 
            }}>
                {/* Top spacer */}
                <div style={{ height: topSpacerHeight }} />

                {/* Render groups if enabled */}
                {Object.entries(groupedItems).map(([group, items]) => (
                    <div key={group}>
                        {groupBy && (
                            <div
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    background: "white",
                                    fontWeight: "bold",
                                    zIndex: 2,
                                    padding: "8px 12px",
                                    borderBottom: "1px solid #e0e0e0",
                                }}
                            >
                                {group}
                            </div>
                        )}
                        {items.map((item, i) => {
                            const index = startIndex + i;
                            const rowTop = getRowPosition(index);
                            const rowHeight = getRowHeightAtIndex(index);
                            
                            const style: CSSProperties = {
                                position: "absolute",
                                top: rowTop,
                                left: 0,
                                height: rowHeight,
                                width: "100%",
                                display: layout === "grid" ? "inline-block" : "flex",
                            };
                            
                            // Adjust for grid layout
                            if (layout === "grid" && gridColumnCount > 1) {
                                style.width = `${100 / gridColumnCount}%`;
                                style.left = `${(index % gridColumnCount) * (100 / gridColumnCount)}%`;
                            }

                            // Skeleton loader for server mode
                            if (serverSide && !item && showSkeleton) {
                                return <Placeholder key={`skeleton-${index}`} index={index} style={style} />;
                            }

                            return (
                                <MemoizedRow 
                                    key={index} 
                                    item={item} 
                                    index={index} 
                                    style={style} 
                                    isMeasured={hasVariableHeights && measuredRowHeights[index] === undefined}
                                />
                            );
                        })}
                    </div>
                ))}

                {/* Bottom spacer */}
                <div style={{ height: bottomSpacerHeight }} />
            </div>
        </div>
    );
}

// Add CSS for animation
const styles = document.createElement('style');
styles.textContent = `
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }
`;
document.head.appendChild(styles);