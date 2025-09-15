/**
 * Represents a single data item in the card view
 * @interface DataItem
 * @property {string} id - Unique identifier for the data item
 * @property {any} [key] - Additional dynamic data properties
 */
export interface DataItem {
  id: string;
  [key: string]: any;
}

/**
 * Configuration for card selection behavior
 * @interface CardSelectionOptions
 * @property {boolean} [selectable=false] - Enables item selection
 * @property {boolean} [multiSelect=false] - Allows multiple items to be selected
 * @property {(selectedItems: DataItem[]) => void} [onSelect] - Callback when selection changes
 */
export interface CardSelectionOptions {
  selectable?: boolean;
  multiSelect?: boolean;
  onSelect?: (selectedItems: DataItem[]) => void;
}

/**
 * Configuration for drag and drop behavior
 * @interface CardDragOptions
 * @property {boolean} [draggable=false] - Enables drag functionality
 * @property {(item: DataItem, event: React.DragEvent) => void} [onDragStart] - Drag start handler
 * @property {(item: DataItem, event: React.DragEvent) => void} [onDragEnd] - Drag end handler
 */
export interface CardDragOptions {
  draggable?: boolean;
  onDragStart?: (item: DataItem, event: React.DragEvent) => void;
  onDragEnd?: (item: DataItem, event: React.DragEvent) => void;
}

/**
 * Configuration for click interactions
 * @interface CardClickOptions
 * @property {(item: DataItem, event: React.MouseEvent) => void} [onClick] - Click handler
 * @property {(item: DataItem, event: React.MouseEvent) => void} [onDoubleClick] - Double-click handler
 * @property {boolean} [allowAnimations=true] - Allow animations on interactions
 */
export interface CardClickOptions {
  onClick?: (item: DataItem, event: React.MouseEvent) => void;
  onDoubleClick?: (item: DataItem, event: React.MouseEvent) => void;
  onHover?: (item: DataItem, event: React.MouseEvent) => void;
  allowAnimations?: boolean;
}

/**
 * Complete interaction configuration
 * @interface CardInteractions
 * @extends CardSelectionOptions
 * @extends CardDragOptions
 * @extends CardClickOptions
 */
export interface CardInteractions extends CardSelectionOptions, CardDragOptions, CardClickOptions { }

/**
 * Configuration for sorting functionality
 * @interface SortConfig
 * @property {boolean} [enabled=false] - Enables sorting
 * @property {boolean} [multiSort=false] - Allows multiple sorting
 * @property {(a: DataItem, b: DataItem) => number} [compareFn] - Custom sort comparator
 */
export interface SortConfig {
  enabled?: boolean;
  multiSort?: boolean;
  compareFn?: (a: DataItem, b: DataItem) => number;
}

/**
 * Configuration for filtering functionality
 * @interface FilterConfig
 * @property {boolean} [enabled=false] - Enables filtering
 * @property {(item: DataItem) => boolean} [filterFn] - Custom filter predicate
 */
export interface FilterConfig {
  enabled?: boolean;
  filterFn?: (item: DataItem) => boolean;
}

/**
 * Configuration for search functionality
 * @interface SearchConfig
 * @property {boolean} [enabled=false] - Enables search
 * @property {(term: string, item: DataItem) => boolean} [searchFn] - Custom search matcher
 */
export interface SearchConfig {
  enabled?: boolean;
  searchFn?: (term: string, item: DataItem) => boolean;
}

/**
 * Configuration for data operations
 * @interface DataOperations
 * @property {SortConfig} [sort] - Sorting configuration
 * @property {FilterConfig} [filter] - Filtering configuration
 * @property {SearchConfig} [search] - Search configuration
 */
export interface DataOperations {
  sort?: SortConfig;
  filter?: FilterConfig;
  search?: SearchConfig;
}

/**
 * Configuration for pagination
 * @interface PaginationConfig
 * @property {boolean} [enabled=false] - Enables pagination
 * @property {number} [itemsPerPage=10] - Default items per page
 * @property {'basic'|'advanced'} [variant='basic'] - Pagination UI variant
 * @property {boolean} [showSizeChanger=false] - Whether to allow changing page size
 * @property {{ value: number; label: string }[]} [pageSizeOptions] - Available page size options
 * @property {boolean} [showTotal=false] - Whether to display total item count
 * @property {boolean} [showQuickJumper=false] - Whether to allow quick page jumping
 * @property {'left'|'center'|'right'} [align='left'] - Alignment of pagination controls
 */
export interface PaginationConfig {
  enabled?: boolean;
  itemsPerPage?: number;
  variant?: 'basic' | 'advanced';
  showSizeChanger?: boolean;
  pageSizeOptions?: { value: number; label: string }[];
  showTotal?: boolean;
  showQuickJumper?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * Configuration for zoom behavior
 * @interface ZoomConfig
 * @property {boolean} [enabled=false] - Enables zoom
 * @property {number} [maxScale=2] - Maximum zoom scale (e.g., 2 = 200%)
 */
export interface ZoomConfig {
  enabled?: boolean;
  maxScale?: number;
}

/**
 * Configuration for template-based card rendering
 * @interface CardTemplateConfig
 * @property {string} template - Jinja-style template string
 * @property {Object} [helpers] - Template helper functions
 */
export interface CardTemplateConfig {
  template: string;
  helpers?: {
    [name: string]: (...args: any[]) => any;
  };
}
/**
 * Card Layout Configuration Interface
 * 
 * Defines the layout options for displaying card components in various arrangements.
 * Supports grid, masonry, carousel, and stack layouts with responsive breakpoints.
 * 
 * @interface CardLayoutOptions
 */
export interface CardLayoutOptions {
  /**
   * The type of layout to use for card arrangement
   * @type {'grid' | 'masonry' | 'carousel' | 'stack'}
   * @default 'grid'
   */
  type?: 'grid' | 'masonry' | 'carousel' | 'stack';

  /**
   * Number of columns for grid and masonry layouts
   * @type {number}
   * @default 3
   */
  columns?: number;

  /**
   * Spacing between cards
   * @type {number | string}
   * @default '24px'
   */
  gap?: number | string;

  /**
   * Padding around the card container
   * @type {number | string}
   * @default '16px'
   */
  padding?: number | string;

  /**
   * Grid-specific layout properties
   * Only applicable when type is 'grid'
   */
  gridOptions?: {
    /**
     * Minimum width for each grid item
     * @type {string}
     * @default '300px'
     */
    minItemWidth?: string;

    /**
     * Maximum width for each grid item
     * @type {string}
     * @default '1fr'
     */
    maxItemWidth?: string;

    /**
     * Auto-fit or auto-fill behavior for grid
     * @type {'auto-fit' | 'auto-fill'}
     * @default 'auto-fit'
     */
    autoFlow?: 'auto-fit' | 'auto-fill';
  };

  /**
   * Masonry-specific layout properties
   * Only applicable when type is 'masonry'
   */
  masonryOptions?: {

    /**
     * Gutter between masonry items
     * @type {string}
     * @default '24px'
     */
    gutter?: string;

    /**
     * Masonry layout stager
     * @type {string}
     * @default 'masonry-layout'
     */
    stager?: string;
    /**
     * Column width for masonry layout
     * @type {string}
     * @default '600px'
     */
    columnWidth?: string;

    /**
     * Fit the masonry grid to the container width
     * @type {boolean}
     * @default false
     */
    fitWidth?: boolean;

    /**
     * Maintain horizontal order of items
     * @type {boolean}
     * @default true
     */
    horizontalOrder?: boolean;

    /**
     * Transition duration for layout changes
     * @type {string}
     * @default '0.3s'
     */
    transitionDuration?: string;

    /**
     * Stagger delay for item transitions
     * @type {string}
     * @default '0.03s'
     */
    stagger?: string;

    /**
     * Enable resize handling
     * @type {boolean}
     * @default true
     */
    resize?: boolean;

    /**
     * Initialize layout on creation
     * @type {boolean}
     * @default true
     */
    initLayout?: boolean;

    /**
     * Set origin for positioning to top
     * @type {boolean}
     * @default true
     */
    originTop?: boolean;

    /**
     * Set origin for positioning to left
     * @type {boolean}
     * @default true
     */
    originLeft?: boolean;

    /**
     * Styles for hidden items
     * @type {React.CSSProperties}
     * @default { opacity: 0, transform: 'scale(0.001)' }
     */
    hiddenStyle?: React.CSSProperties;

    /**
     * Styles for visible items
     * @type {React.CSSProperties}
     * @default { opacity: 1, transform: 'scale(1)' }
     */
    visibleStyle?: React.CSSProperties;
  };

  /**
   * Carousel-specific layout properties
   * Only applicable when type is 'carousel'
   */
  carouselOptions?: {

    /** Transition duration for animations */
    transitionDuration?: string;

    /**
     * Number of cards visible at once
     * @type {number}
     * @default 3
     */
    visibleCards?: number;

    /**
     * Enable infinite looping
     * @type {boolean}
     * @default false
     */
    infinite?: boolean;

    /**
     * Auto-play interval in milliseconds
     * @type {number}
     * @default 0 (disabled)
     */
    autoPlay?: number;

    /**
     * CSS easing function for transitions
     * @type {string}
     * @default 'ease-in-out'
     */
    easing?: string;

    /**
     * Show navigation arrows
     * @type {boolean}
     * @default true
     */
    showArrows?: boolean;

    /**
     * Show navigation dots
     * @type {boolean}
     * @default true
     */
    showDots?: boolean;

    /**
     * Position of navigation arrows
     * @type {'sides' | 'bottom' | 'top' | 'none'}
     * @default 'sides'
     */
    arrowPosition?: 'sides' | 'bottom' | 'top' | 'none';

    /**
     * Position of navigation dots
     * @type {'bottom' | 'top' | 'none'}
     * @default 'bottom'
     */
    dotPosition?: 'bottom' | 'top' | 'none';

    /**
     * Responsive settings for different breakpoints
     * @type {Array<{ breakpoint: number; settings: Partial<CarouselBreakpointSettings> }>}
     */
    responsive?: Array<{
      breakpoint: number;
      settings: Partial<{
        visibleCards: number;
        infinite?: boolean;
        showArrows?: boolean;
        showDots?: boolean;
      }>;
    }>;

    /**
     * Enable center mode
     * @type {boolean}
     * @default false
     */
    centerMode?: boolean;

    /**
     * Padding for center mode
     * @type {string}
     * @default '60px'
     */
    centerPadding?: string;

    /**
     * Enable swipe gestures
     * @type {boolean}
     * @default true
     */
    swipe?: boolean;

    /**
     * Touch swipe threshold in pixels
     * @type {number}
     * @default 5
     */
    touchThreshold?: number;

    /**
     * Mouse drag threshold in pixels
     * @type {number}
     * @default 5
     */
    dragThreshold?: number;
  };

  /**
   * Stack-specific layout properties
   * Only applicable when type is 'stack'
   */
  stackOptions?: {

    /** Enable infinite scrolling */
    infinite?: boolean;
    /**
     * Offset between stacked cards
     * @type {number}
     * @default 20
     */
    offset?: number;

    /**
     * Scale factor for stacked cards
     * @type {number}
     * @default 0.95
     */
    scale?: number;

    /**
     * Rotation angle for stacked cards in degrees
     * @type {number}
     * @default 2
     */
    rotation?: number;

    /**
     * Perspective value for 3D transforms
     * @type {number}
     * @default 1000
     */
    perspective?: number;

    /**
     * Transition duration for animations
     * @type {string}
     * @default '0.3s'
     */
    transitionDuration?: string;

    /**
     * CSS easing function for transitions
     * @type {string}
     * @default 'ease-in-out'
     */
    easing?: string;

    /**
     * Maximum number of visible cards
     * @type {number}
     * @default 1
     */
    maxVisible?: number;

    /**
     * Enable spread effect
     * @type {boolean}
     * @default false
     */
    spread?: boolean;

    /**
     * Direction for spread effect
     * @type {'horizontal' | 'vertical'}
     * @default 'horizontal'
     */
    spreadDirection?: 'horizontal' | 'vertical';

    /**
     * Percentage of next card to show (0-100)
     * @type {number}
     * @default 0
     */
    peek?: number;

    /**
     * Enable interactive selection
     * @type {boolean}
     * @default true
     */
    interactive?: boolean;

    /**
     * Enable drag interactions
     * @type {boolean}
     * @default false
     */
    draggable?: boolean;

    /**
     * Drag threshold in pixels
     * @type {number}
     * @default 10
     */
    threshold?: number;

    /**
     * Callback when a card is selected
     * @type {(index: number) => void}
     */
    onSelect?: (index: number) => void;

    /**
     * Callback when a card is deselected
     * @type {(index: number) => void}
     */
    onDeselect?: (index: number) => void;
  };

  /**
   * Responsive breakpoints for adaptive layout
   * @type {Object.<number, BreakpointOptions>}
   */
  breakpoints?: {
    [screenWidth: number]: {
      /**
       * Number of columns at this breakpoint
       * @type {number}
       */
      columns?: number;

      /**
       * Gap spacing at this breakpoint
       * @type {number | string}
       */
      gap?: number | string;

      /**
       * Grid-specific options at this breakpoint
       * @type {Object}
       */
      gridOptions?: {
        minItemWidth?: string;
        maxItemWidth?: string;
      };
    };
  };

  /**
   * Additional CSS class names
   * @type {string}
   * @default ''
   */
  className?: string;

  /**
   * Additional inline styles
   * @type {React.CSSProperties}
   * @default {}
   */
  style?: React.CSSProperties;
}

/**
 * Configuration for a single element within a card section
 */
export interface CardElement {
  /**
   * Unique identifier for the element
   */
  id: string;

  /**
   * React component to render
   */
  component(value?: any): JSX.Element | React.ReactNode;

  /**
   * Alignment of this individual element
   * @default 'left'
   */
  align?: 'left' | 'center' | 'right';

  /**
   * CSS styles for this element
   */
  style?: React.CSSProperties;

  /**
   * Order of appearance (lower numbers appear first)
   * @default 0
   */
  order?: number;
}

/**
 * Configuration for a section (left/center/right) of a card row
 */
export interface CardSection {
  /**
   * Array of elements in this section
   */
  elements: CardElement[];

  /**
   * CSS styles for the section container
   */
  style?: React.CSSProperties;

  /**
   * How to align all elements in this section
   * @default 'flex-start' (left)
   */
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';

  /**
   * Direction to arrange elements
   * @default 'row'
   */
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /**
   * Spacing between elements
   * @default '8px'
   */
  gap?: string | number;
}

/**
 * Configuration for a single row in the card
 */
export interface CardRow {
  /**
   * Unique identifier for the row
   */
  id: string;

  /**
   * Left section configuration
   */
  left?: CardSection;

  /**
   * Center section configuration
   */
  center?: CardSection;

  /**
   * Right section configuration
   */
  right?: CardSection;

  /**
   * CSS styles for the entire row container
   */
  containerStyle?: React.CSSProperties;

  /**
   * Whether the row is visible
   * @default true
   */
  visible?: boolean;

  /**
   * Callback when row is clicked
   */
  onClick?: (row: CardRow) => void;
}

/**
 * Complete card configuration
 */

/**
 * Card Layout Configuration Examples
 * 
 * @example
 * // Product card with multiple elements in each section
 * const productCard: CardConfig = {
 *   rows: [
 *     {
 *       id: 'product-header',
 *       containerStyle: { padding: '16px', borderBottom: '1px solid #eee' },
 *       left: {
 *         elements: [
 *           {
 *             id: 'product-badge',
 *             component: <Chip label="Sale" color="error" size="small" />,
 *             style: { marginRight: '8px' }
 *           },
 *           {
 *             id: 'product-rating',
 *             component: <Rating value={4.5} precision={0.5} readOnly size="small" />,
 *             align: 'left'
 *           }
 *         ],
 *         justifyContent: 'flex-start',
 *         gap: '8px'
 *       },
 *       right: {
 *         elements: [
 *           {
 *             id: 'wishlist-button',
 *             component: <IconButton><FavoriteBorder /></IconButton>,
 *             align: 'right'
 *           },
 *           {
 *             id: 'share-button',
 *             component: <IconButton><Share /></IconButton>,
 *             align: 'right'
 *           }
 *         ],
 *         gap: '4px'
 *       }
 *     },
 *     {
 *       id: 'product-content',
 *       containerStyle: { padding: '16px' },
 *       left: {
 *         elements: [
 *           {
 *             id: 'product-image',
 *             component: <img src="/product.jpg" style={{ width: '100%', maxWidth: '200px' }} />,
 *             align: 'center'
 *           }
 *         ],
 *         style: { width: '30%' }
 *       },
 *       center: {
 *         elements: [
 *           {
 *             id: 'product-title',
 *             component: <Typography variant="h6">Wireless Headphones</Typography>,
 *             align: 'left'
 *           },
 *           {
 *             id: 'product-description',
 *             component: <Typography variant="body2">Noise cancelling with 30hr battery life</Typography>,
 *             align: 'left',
 *             style: { marginTop: '8px' }
 *           },
 *           {
 *             id: 'product-colors',
 *             component: (
 *               <Box sx={{ display: 'flex', gap: '8px', mt: 2 }}>
 *                 {['black', 'blue', 'white'].map(color => (
 *                   <Box key={color} sx={{ 
 *                     width: 24, 
 *                     height: 24, 
 *                     backgroundColor: color,
 *                     borderRadius: '50%',
 *                     border: '1px solid #ddd'
 *                   }} />
 *                 ))}
 *               </Box>
 *             )
 *           }
 *         ],
 *         flexDirection: 'column',
 *         gap: '4px',
 *         style: { flex: 1, padding: '0 16px' }
 *       },
 *       right: {
 *         elements: [
 *           {
 *             id: 'product-price',
 *             component: <Typography variant="h5">$199.99</Typography>,
 *             align: 'right'
 *           },
 *           {
 *             id: 'add-to-cart',
 *             component: <Button variant="contained" fullWidth>Add to Cart</Button>,
 *             align: 'right',
 *             style: { marginTop: '16px' }
 *           }
 *         ],
 *         flexDirection: 'column',
 *         style: { width: '25%' }
 *       }
 *     }
 *   ],
 *   cardStyle: {
 *     maxWidth: '800px',
 *     borderRadius: '12px',
 *     boxShadow: 2
 *   }
 * };
 * 
 * @example
 * // Social media post card with multiple interactive elements
 * const socialPostCard: CardConfig = {
 *   rows: [
 *     {
 *       id: 'post-header',
 *       containerStyle: { p: 2, display: 'flex', alignItems: 'center' },
 *       left: {
 *         elements: [
 *           {
 *             id: 'user-avatar',
 *             component: <Avatar src="/user.jpg" sx={{ width: 40, height: 40 }} />,
 *             style: { marginRight: '12px' }
 *           },
 *           {
 *             id: 'user-info',
 *             component: (
 *               <Box>
 *                 <Typography fontWeight="bold">Jane Doe</Typography>
 *                 <Typography variant="caption">2 hours ago</Typography>
 *               </Box>
 *             )
 *           }
 *         ],
 *         justifyContent: 'flex-start'
 *       },
 *       right: {
 *         elements: [
 *           {
 *             id: 'more-options',
 *             component: <IconButton><MoreVert /></IconButton>
 *           }
 *         ]
 *       }
 *     },
 *     {
 *       id: 'post-content',
 *       containerStyle: { px: 2, pb: 1 },
 *       left: {
 *         elements: [
 *           {
 *             id: 'post-text',
 *             component: <Typography>Check out this beautiful sunset from my hike yesterday! #nature #outdoors</Typography>
 *           },
 *           {
 *             id: 'post-image',
 *             component: <img src="/sunset.jpg" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />
 *           }
 *         ],
 *         flexDirection: 'column',
 *         gap: '8px'
 *       }
 *     },
 *     {
 *       id: 'post-actions',
 *       containerStyle: { px: 2, py: 1, borderTop: '1px solid #f0f0f0' },
 *       left: {
 *         elements: [
 *           {
 *             id: 'like-button',
 *             component: <Button startIcon={<ThumbUp />} size="small">Like</Button>
 *           },
 *           {
 *             id: 'comment-button',
 *             component: <Button startIcon={<Comment />} size="small">Comment</Button>,
 *             style: { marginLeft: '8px' }
 *           },
 *           {
 *             id: 'share-button',
 *             component: <Button startIcon={<Share />} size="small">Share</Button>,
 *             style: { marginLeft: '8px' }
 *           }
 *         ],
 *         gap: '4px'
 *       },
 *       right: {
 *         elements: [
 *           {
 *             id: 'view-count',
 *             component: <Typography variant="caption" color="text.secondary">1.2k views</Typography>
 *           }
 *         ]
 *       }
 *     }
 *   ],
 *   cardStyle: {
 *     maxWidth: '600px',
 *     bgcolor: 'background.paper',
 *     borderRadius: '8px'
 *   },
 *   rowSpacing: '0px'
 * };
 */

export interface CardFieldConfig {
  /**
   * Array of row configurations
   */
  rows: CardRow[];

  /**
   * Global styles for the card container
   */
  cardStyle?: React.CSSProperties;

  /**
   * Spacing between rows
   * @default '8px'
   */
  rowSpacing?: string | number;

  /**
   * Direction to arrange rows
   * @default 'column'
   */
  flexDirection?: 'row' | 'column';

  /**
   * Whetcontenther to wrap rows when using row direction
   * @default false
   */
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

/**
 * Default view configuration
 * @interface CardDefaultView
 * @property {string[]} [excludeKeys=[]] - Keys to exclude from the default view
 * @description This configuration will be the default configuration for the care view 
 * it will just show all the data , as key and value pair(one item per row)
 * @example
 * // Default view configuration
 * const defaultViewConfig: CardDefaultView = {
 *   excludeKeys: ['id', 'created-at', 'last-updated-at']
 * };
 */

export interface CardDefaultView {
  /**
   * Keys to exclude from the default view
   * @default []
   */
  excludeKeys?: string[];
}


/**
 * Card styling configuration
 * @interface CardStyle
 * @property {string} [className] - CSS class name  
 * @property {React.CSSProperties} [style] - CSS style object
 */
export interface CardStyle {
  className?: string;
  style?: React.CSSProperties;

}
/**
 * Header card view configuration
 * @interface HeaderCardViewOptions
 * @property {Array<{id: string, component: React.ReactNode, align?: 'left' | 'center' | 'right'}>} [headerConfig.customItems] - Custom header items array (overrides default if provided)
 * @property {object} [headerConfig.defaultItems] - Which default items to show
 * @property {'left' | 'center' | 'right'} [headerConfig.defaultAlignment] - Default alignment for items
 * @property {string} [headerConfig.className] - Additional CSS class for header
 * @property {() => void} [onDownload] - Callback when download is clicked
 * @property {React.ReactNode} [customHeader] - Custom header renderer (overrides all other header config if provided)
 * @property {boolean} [visible=true] - Whether to show the header
 * @property {React.CSSProperties} [style] - Header styling
 * @property {string} [title] - Header title/text 
 * @property {React.ReactNode[]} [additionalActions] - Additional actions to show on the right side
 */
export interface HeaderCardViewOptions {
  /**
   * Configuration for header items and layout
   */
  headerConfig?: {
    /**
     * Custom header items array (overrides default if provided)
     */
    customItems?: Array<{
      id: string;
      component: React.ReactNode;
      align?: 'left' | 'center' | 'right';
    }>;
    /**
     * Which default items to show
     */
    defaultItems?: {
      search?: {
        visible: boolean;
        placeholder?: string;
      };
      sort?: {
        visible: boolean;
        multiSort?: boolean;
      };
      download?: {
        visible: boolean;
        allowedTypes?: string[];
        nameForDownloadFile?: string;
        allowedColumnsToDownload?: string[];
        excludeColumnsFromDownload?: string[];
      };
      filter?: boolean;
    };
    /**
     * Default alignment for items
     */
    defaultAlignment?: 'left' | 'center' | 'right';
    /**
    * Additional CSS class for applying custom styling to the header.
    * Can be used to override or extend default styles.
    */
    className?: string;

  };

  /**
 * make header sticky
 */
  makeHeaderSticky?: boolean;
  /**
   * Custom header renderer (overrides all other header config if provided)
   */
  customHeader?: React.ReactNode;

  /**
   * Whether to show the header
   * @default true
   */
  visible?: boolean;

  /**
   * Header styling
   */
  style?: React.CSSProperties;

  /**
   * Header title/text
   */
  title?: string;

  /**
   * Additional actions to show on the right side
   */
  additionalActions?: React.ReactNode[];
}

/**
 * Section Configuration
 */
export interface CardSection {
  /**
   * Unique identifier for the section
   */
  id: string;

  /**
   * Section title/header (can be string or React component)
   */
  header?: string | React.ReactNode;

  /**
   * Section-specific header configuration
   */
  headerConfig?: HeaderCardViewOptions;

  /**
   * Section content data
   */
  data: Record<string, any> | any[];

  /**
   * Section styling
   */
  style?: React.CSSProperties;

  /**
   * Section content configuration
   */
  content: CardContentConfig;

  /**
   * Whether the section is collapsible
   * @default false
   */
  collapsible?: boolean;

  /**
   * Initial collapsed state (if collapsible)
   * @default false
   */
  initiallyCollapsed?: boolean;

  /**
   * Section-specific interactions
   */
  interactions?: CardInteractions;
}

/**
 * Segregated Data Configuration with Multiple Sections
 */
export interface SegregatedData {
  /**
   * Main header configuration (applies to entire card)
   */
  globalHeader?: React.ReactNode | HeaderCardViewOptions;

  /**
   * Array of card sections
   */
  sections: CardSection[];

  /**
   * Footer configuration (applies to entire card)
   */
  footer?: React.ReactNode | Record<string, any>;

  /**
   * Metadata (not displayed)
   */
  meta?: Record<string, any>;

  /**
   * Global styling that applies to all sections
   */
  globalStyle?: React.CSSProperties;

  /**
   * Section container styling
   */
  sectionContainerStyle?: React.CSSProperties;
}
/**
 * EditableFieldConfiguration
 * --------------------------
 * Configuration for editable fields, defining how they should be edited in the UI.
 */
export type EditableFieldConfiguration = {
  /**
   * Whether this field can be edited inline or in a form.
   */
  isEditable: boolean;

  /**
   * The type of editor to display when editing this field:
   * - "text" → Text input (default for strings)
   * - "textarea" → Multi-line text area
   * - "number" → Number input with validation
   * - "select" → Dropdown with predefined options
   * - "multi-select" → Multi-select dropdown with checkboxes
   * - "date" → Date picker
   * - "datetime" → Date and time picker
   * - "checkbox" → Single checkbox for boolean values
   * - "radio" → Radio button group
   * - "color" → Color picker
   * - "file" → File upload
   * - "rich-text" → Rich text editor (WYSIWYG)
   */
  editorType?: "text" | "textarea" | "number" | "select" | "multi-select" | "date" | "datetime" | "checkbox" | "radio" | "color" | "file" | "rich-text";

  /**
   * Options for select, multi-select, or radio editor types
   */
  editorOptions?: string[];

  /**
   * Placeholder text for the editor
   */
  placeholder?: string;

  /**
   * Validation rules for the editor
   */
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    pattern?: RegExp;
  };

  /**
   * A callback function triggered when the field is edited.
   * Receives:
   * - id → The unique identifier of the item being edited.
   * - newValue → The new value entered by the user.
   */
  onEdit?: (id: string, newValue: any) => void;
};

/**
 * SortConfiguration
 * -----------------
 * Configuration for sorting capabilities of a field.
 */
export type SortConfiguration = {
  canSort: boolean;
};

/**
 * FilterConfiguration
 * -------------------
 * Configuration for filtering capabilities of a field.
 */
export type FilterConfiguration = {
  /**
   * Whether filtering is enabled for this field.
   */
  canFilter: boolean;

  /**
   * The type of filter UI to show:
   * - "text" → Text input (e.g., filter by name/email).
   * - "select" → Dropdown with predefined options (e.g., department/status).
   * - "range" → Numeric range selector (e.g., price, rating).
   * - "date" → Date picker or date range selector (e.g., hireDate).
   */
  filterType?: "text" | "select" | "range" | "date";

  /**
   * Options for "select" filter types.
   */
  filterOptions?: string[];
};

/**
 * DataItemDescription
 * --------------------
 * A metadata schema that describes how each field in a data item should behave in a generic card view, table, or list.
 * This structure allows dynamic generation of UI components like filters, sorters, editors, and field renderers.
 */
export type DataItemDescription = {
  /**
   * The exact key from the data object.
   * Example: "name", "email", "hireDate".
   */
  key: string;

  /**
   * The human-readable label to display for this field in the UI.
   * Example: "Full Name" for the key "name".
   */
  label: string;

  /**
   * The type of data the field holds. 
   * This helps determine how the field is displayed and interacted with.
   *
   * - "string" → Plain text (e.g., name, role).
   * - "number" → Numeric values (e.g., price, rating).
   * - "date" → Dates or timestamps (e.g., hireDate).
   * - "image" → Image fields (e.g., avatar).
   * - "status" → Status indicators (e.g., active/inactive).
   * - "custom" → For complex or special UI rendering (e.g., tags, badges).
   */
  typeOfField: "string" | "number" | "date" | "image" | "status" | "custom";

  /**
   * Sorting configuration for this field.
   */
  sortConfiguration?: SortConfiguration;

  /**
   * Filtering configuration for this field.
   */
  filterConfiguration?: FilterConfiguration;

  /**
   * Editing configuration for this field.
   */
  editableConfiguration?: EditableFieldConfiguration;
};

/**
 * Discriminated union type for card content configuration
 */
export type CardContentConfig =
  | { contentDisplayType: 'field-config'; content: CardFieldConfig }
  | { contentDisplayType: 'template-config'; content: CardTemplateConfig }
  | { contentDisplayType: 'default-view'; content: CardDefaultView };

/**
* Loader sizes available for the CardLoader component.
* - `small`   → Compact size, good for inline or tight spaces.
* - `medium`  → Default size, suitable for most use cases.
* - `large`   → Bigger size, useful for full-page or modal loaders.
*/
export type LoaderSize = "small" | "medium" | "large";

/**
 * Loader animation variants.
 * - `spinner`       → Circular rotating spinner.
 * - `dots`          → Three pulsing dots.
 * - `bars`          → Vertical bars stretching animation.
 * - `pulse-circle`  → A single pulsing circle.
 */
export type LoaderVariant = "spinner" | "dots" | "bars" | "pulse-circle";

/**
 * Common props shared across all loader variants.
 * These control general loader appearance and behavior.
 */
export interface BaseLoaderProps {
  /**
   * Loader size - affects container dimensions and stroke thickness.
   * @default "medium"
   */
  size?: LoaderSize;

  /**
   * Whether to show a semi-transparent background overlay with blur.
   * Useful when you want to block interaction with underlying content.
   * @default true
   */
  overlay?: boolean;

  /**
   * Message text displayed under the loader animation.
   * Pass an empty string `""` to hide the message.
   * @default "Loading..."
   */
  message?: string;

  /**
   * Additional CSS class applied to the loader container.
   * Useful for applying external styles or utility classes.
   */
  className?: string;

  /**
   * Inline style overrides for the loader container.
   * Merges with default loader styles.
   */
  style?: React.CSSProperties;
}

/**
 * Props when the loader is in spinner mode.
 * Renders a circular rotating spinner.
 */
export interface SpinnerLoaderProps extends BaseLoaderProps {
  /** Loader variant - must be `"spinner"` */
  variant: "spinner";
}

/**
 * Props when the loader is in dots mode.
 * Renders three pulsing dots side by side.
 */
export interface DotsLoaderProps extends BaseLoaderProps {
  /** Loader variant - must be `"dots"` */
  variant: "dots";
}

/**
 * Props when the loader is in bars mode.
 * Renders three vertical bars stretching up and down.
 */
export interface BarsLoaderProps extends BaseLoaderProps {
  /** Loader variant - must be `"bars"` */
  variant: "bars";
}

/**
 * Props when the loader is in pulse-circle mode.
 * Renders a single circle that continuously pulses.
 */
export interface PulseCircleLoaderProps extends BaseLoaderProps {
  /** Loader variant - must be `"pulse-circle"` */
  variant: "pulse-circle";
}

/**
 * Final Loader Props
 *
 * Developers must explicitly choose a `variant` from one of the supported options:
 * - `"spinner"`
 * - `"dots"`
 * - `"bars"`
 * - `"pulse-circle"`
 *
 * This ensures type safety and auto-completion in IDEs.
 */
export type CardLoaderProps =
  | SpinnerLoaderProps
  | DotsLoaderProps
  | BarsLoaderProps
  | PulseCircleLoaderProps;


/**
 * Main card view configuration
 * @interface CardViewOptions
 * @property {DataItem[]} data - Array of data items to display
 * @property {(item: DataItem) => React.ReactNode} renderCard - Card render function
 * @property {DataItemDescription[]} [dataItemDescription] - Array of data item descriptions
 * @property {HeaderCardViewOptions} [headerCardView] - Header card view configuration
 * @property {CardLayoutOptions} [layout] - Layout configuration
 * @property {React.CSSProperties} [style] - Base card styling
 * @property {CardInteractions} [interactions] - Interaction handlers
 * @property {DataOperations} [dataOperations] - Data manipulation config
 * @property {PaginationConfig} [pagination] - Pagination config
 * @property {ZoomConfig} [zoom] - Zoom behavior config
 * @property {boolean} [virtualScroll] - Enables virtual scrolling
 * @property {boolean} [lazyLoad] - Enables lazy loading
 */
/**
 * Card View Configuration with Multiple Sections Support
 * 
 * @example <caption>Basic multiple sections configuration</caption>
 * const config: CardViewOptions = {
 *   dataMode: 'segregated',
 *   segregatedData: {
 *     globalHeader: 'User Profile Dashboard',
 *     sections: [
 *       {
 *         id: 'personal-info',
 *         header: 'Personal Information',
 *         data: { name: 'John Doe', email: 'john@example.com' },
 *         content: {
 *           contentDisplayType: 'field-config',
 *           content: {
 *             rows: [
 *               {
 *                 id: 'name-row',
 *                 left: {
 *                   elements: [{ id: 'name-label', component: <Typography>Name:</Typography> }]
 *                 },
 *                 center: {
 *                   elements: [{ id: 'name-value', component: <Typography>{data.name}</Typography> }]
 *                 }
 *               }
 *             ]
 *           }
 *         }
 *       },
 *       {
 *         id: 'employment-section',
 *         header: <EmploymentHeader />,
 *         data: employmentData,
 *         collapsible: true,
 *         content: {
 *           contentDisplayType: 'template-config',
 *           content: {
 *             template: <EmploymentTemplate />
 *           }
 *         }
 *       }
 *     ]
 *   }
 * };
 *
 * @example <caption>Section with full header configuration</caption>
 * const sectionWithHeader: CardSection = {
 *   id: 'performance-metrics',
 *   headerConfig: {
 *     title: 'Quarterly Metrics',
 *     defaultItems: {
 *       download: {
 *         visible: true,
 *         allowedTypes: ['csv'],
 *         nameForDownloadFile: 'Q2-metrics'
 *       }
 *     },
 *     additionalActions: [
 *       <Tooltip title="Refresh data">
 *         <IconButton><RefreshIcon /></IconButton>
 *       </Tooltip>
 *     ]
 *   },
 *   data: metricsData,
 *   style: { backgroundColor: '#fafafa' },
 *   content: {
 *     contentDisplayType: 'default-view',
 *     content: {
 *       viewType: 'detailed'
 *     }
 *   }
 * };
 *
 * @example <caption>Collapsible sections with global styling</caption>
 * const collapsibleConfig: SegregatedData = {
 *   globalStyle: {
 *     fontFamily: 'Arial, sans-serif',
 *     borderRadius: '8px'
 *   },
 *   sectionContainerStyle: {
 *     marginBottom: '16px',
 *     boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
 *   },
 *   sections: [
 *     {
 *       id: 'section-1',
 *       header: 'First Section',
 *       collapsible: true,
 *       initiallyCollapsed: false,
 *       data: section1Data,
 *       content: { /* content config *\/ }
 *     },
 *     {
 *       id: 'section-2',
 *       header: <CustomSectionHeader title="Second Section" />,
 *       collapsible: true,
 *       initiallyCollapsed: true,
 *       data: section2Data,
 *       content: { /* content config *\/ }
 *     }
 *   ]
 * };
 *
 * @example <caption>Mixed header types</caption>
 * const mixedHeaders: SegregatedData = {
 *   sections: [
 *     {
 *       id: 'simple-header',
 *       header: 'Simple Text Header', // string header
 *       data: simpleData,
 *       content: { /* content config *\/ }
 *     },
 *     {
 *       id: 'component-header',
 *       header: <ComplexHeader title="Component" icon={<StarIcon />} />, // React component
 *       data: componentData,
 *       content: { /* content config *\/ }
 *     },
 *     {
 *       id: 'config-header',
 *       headerConfig: { // full header configuration
 *         title: 'Configured Header',
 *         defaultItems: {
 *           search: { visible: true }
 *         }
 *       },
 *       data: configData,
 *       content: { /* content config *\/ }
 *     }
 *   ]
 * };
 */
export interface CardViewOptions {
  /**
   * Data mode identifier
   */
  dataMode: 'segregated' | 'normal';

  /**
   * Normal data array
   */
  data: DataItem[];

  dataItemDescription: DataItemDescription[];

  /**
   * Segregated data structure with multiple sections
   */
  segregatedData?: SegregatedData;
  /**
   * 
   * @param item 
   * @description if the developer wants to render the 
   * card with custom component then they can use this function
   * they  will get complete dataItem so can use it to render the card
   * as per their requirement
   * @returns 
   */
  renderCard?: (item: DataItem) => React.ReactNode;

  // Header card view 
  headerCardView?: HeaderCardViewOptions;

  /**
   * Content configuration with type discriminator
   * 
   * @example
   * // Using field config
   * {
   *   contentDisplayType: 'field-config',
   *   content: {
   *     rows: [...]
   *   }
   * }
   * 
   * @example
   * // Using template config
   * {
   *   contentDisplayType: 'template-config',
   *   content: {
   *     template: <Template />,
   *     helpers: { ... }
   *   }
   * }
   * 
   * @example
   * // Using default view config
   * {
   *   contentDisplayType: 'default-view',
   *   content: {
   *     excludeKeys: ['id', 'created-at', 'last-updated-at']
   *   }
   * }
   */
  content: CardContentConfig;

  // Layout
  layout?: CardLayoutOptions;

  // Styling
  cardStyle?: CardStyle;

  // Interactions
  interactions?: CardInteractions;

  // Data
  dataOperations?: DataOperations;

  // Features
  paginationOptions?: PaginationConfig;
  zoom?: ZoomConfig;
  virtualScroll?: boolean;
  lazyLoad?: boolean;
  cardLoaderProps?: CardLoaderProps;
}

/**
 * Props for the RenderCardView component
 * @interface RenderCardViewProps
 * @property {CardViewOptions} options - The configuration object for the card view
 * @property {HTMLDivElement | null} ref - Reference to the card view container
 */
export interface RenderCardViewProps {
  options: CardViewOptions;
  refForFunctionalities: any;
}
/**
 * -----------------------------
 * PAGINATION FUNCTIONALITIES
 * -----------------------------
 */
export interface PaginationMethods {
  /** Jump to a specific page (1-based index). */
  goToPage: (page: number) => void;
  /** Navigate to the next page. */
  nextPage: () => void;
  /** Navigate to the previous page. */
  previousPage: () => void;
  /** Reset navigation to the first page. */
  goToFirstPage: () => void;
  /** Jump directly to the last page. */
  goToLastPage: () => void;
  /** Fast jump to a page (e.g., via input box). */
  quickJumpToPage: (page: number) => void;
  /** Reset pagination back to page 1. */
  resetToFirstPage: () => void;
}

export interface PaginationUtils {
  /** Returns true if current page is the first page. */
  isFirstPage: () => boolean;
  /** Returns true if current page is the last page. */
  isLastPage: () => boolean;
  /** Retrieves the full pagination state. */
  getPaginationState: () => { currentPage: number; totalPages: number };
  /** Gets the range of items shown on the current page. */
  getPageRange: () => [number, number];
}

export interface PaginationState {
  /** Currently active page number. */
  currentPage: number;
  /** Total number of pages available. */
  totalPages: number;
}

/**
 * -----------------------------
 * DATA PROCESSING FUNCTIONALITIES
 * -----------------------------
 */
export interface DataState<T = any> {
  /** Final data after filtering, sorting, searching. */
  processedData: T[];
  /** Count of total unmodified data entries. */
  originalCount: number;
  /** Count of data entries after filters applied. */
  filteredCount: number;
}

export interface ConfigState {
  /** Active filter configurations. */
  filters: Record<string, any>;
  /** Current sorting configuration. */
  sortConfig: Record<string, any>;
  /** Current search configuration (case/exact flags etc.). */
  searchConfig: { caseSensitive: boolean; exactMatch: boolean };
}

export interface ConfigMethods<T = any> {
  /** Update filters dynamically. */
  updateFilter: (filter: Record<string, any>) => void;
  /** Update sorting criteria. */
  updateSort: (sort: Record<string, any>) => void;
  /** Directly set sorting configuration. */
  setSortConfig: (sort: Record<string, any>) => void;
  /** Directly set search configuration. */
  setSearchConfig: (config: { caseSensitive: boolean; exactMatch: boolean }) => void;
  /** Update table data externally. */
  setData: (data: T[]) => void;
}

export interface ToggleMethods {
  /** Toggle case sensitivity in search. */
  toggleCaseSensitive: () => void;
  /** Toggle exact match mode in search. */
  toggleExactMatch: () => void;
}

export interface ResetMethods {
  /** Reset filters, sorting, searching, and data state. */
  resetAll: () => void;
}

export interface CardViewConfigMethods {
  /**
   * General method to update any part of the configuration
   * @param updates - Partial configuration updates
   */
  updateConfig: (updates: Partial<CardViewOptions>) => void;

  /**
   * Reset configuration to initial state
   */
  resetConfig: () => void;

  /**
   * Export current configuration
   * @returns Current card view configuration
   */
  exportConfig: () => CardViewOptions;

  // Data management methods
  /**
   * Replace entire data array
   * @param newData - New array of data items
   */
  updateData: (newData: DataItem[]) => void;

  /**
   * Update specific data item by ID
   * @param itemId - ID of the item to update
   * @param updates - Partial updates for the item
   */
  updateDataItem: (itemId: string, updates: Partial<DataItem>) => void;

  /**
   * Add new data item to the collection
   * @param newItem - New data item to add
   */
  addDataItem: (newItem: DataItem) => void;

  /**
   * Remove data item by ID
   * @param itemId - ID of the item to remove
   */
  removeDataItem: (itemId: string) => void;

  // Layout methods
  /**
   * Update layout configuration
   * @param layoutUpdates - Partial layout updates
   */
  updateLayout: (layoutUpdates: Partial<CardLayoutOptions>) => void;

  // Interaction methods
  /**
   * Update interaction configuration
   * @param interactionUpdates - Partial interaction updates
   */
  updateInteractions: (interactionUpdates: Partial<CardInteractions>) => void;

  // Data operations methods
  /**
   * Update data operations configuration (sorting, filtering, search)
   * @param operationsUpdates - Partial data operations updates
   */
  updateDataOperations: (operationsUpdates: Partial<DataOperations>) => void;

  // Pagination methods
  /**
   * Update pagination configuration
   * @param paginationUpdates - Partial pagination updates
   */
  updatePagination: (paginationUpdates: Partial<PaginationConfig>) => void;

  // Zoom methods
  /**
   * Update zoom configuration
   * @param zoomUpdates - Partial zoom updates
   */
  updateZoom: (zoomUpdates: Partial<ZoomConfig>) => void;

  // Header methods
  /**
   * Update header configuration
   * @param headerUpdates - Partial header updates
   */
  updateHeader: (headerUpdates: Partial<HeaderCardViewOptions>) => void;

  // Content methods
  /**
   * Update content configuration
   * @param contentUpdates - Partial content updates
   */
  updateContent: (contentUpdates: Partial<CardContentConfig>) => void;

  // Data item description methods
  /**
   * Update data item descriptions
   * @param descriptions - New array of data item descriptions
   */
  updateDataItemDescriptions: (descriptions: DataItemDescription[]) => void;

  // Segregated data methods (for dataMode: 'segregated')
  /**
   * Update segregated data configuration
   * @param segregatedUpdates - Partial segregated data updates
   */
  updateSegregatedData: (segregatedUpdates: Partial<SegregatedData>) => void;

  /**
   * Update specific section in segregated data
   * @param sectionId - ID of the section to update
   * @param sectionUpdates - Partial section updates
   */
  updateSection: (sectionId: string, sectionUpdates: Partial<CardSection>) => void;

  /**
   * Add new section to segregated data
   * @param newSection - New section to add
   */
  addSection: (newSection: CardSection) => void;

  /**
   * Remove section from segregated data
   * @param sectionId - ID of the section to remove
   */
  removeSection: (sectionId: string) => void;
}

/**
 * --------------------------
 * CARD LOADER FUNCTIONALITIES
 * --------------------------
 * Provides methods to control a loader state for individual cards.
 * Useful when you need to simulate loading states for fetching/updating
 * card data.
 */
export interface CardLoaderMethods {
  /**
   * Show loader on a specific card by ID.
   * 
   * @param cardId - The unique identifier of the card to show the loader for.
   * 
   * @example
   * <Button onClick={() => showCardLoader("emp-1001")}>Load Card</Button>
   */
  showCardLoader: (cardId: string) => void;

  /**
   * Hide loader on a specific card by ID.
   * 
   * @param cardId - The unique identifier of the card to hide the loader for.
   * 
   * @example
   * <Button onClick={() => hideCardLoader("emp-1001")}>Hide Card</Button>
   */
  hideCardLoader: (cardId: string) => void;
}

/**
 * Main interface for table functionalities exposed via useImperativeHandle
 */
export interface CardFunctionalities<T = any> {
  paginationFunctionalities: {
    paginationMethods: PaginationMethods;
    paginationUtils: PaginationUtils;
    paginationState: PaginationState;
  };
  dataProcessingFunctionalities: {
    dataState: DataState<T>;
    configState: ConfigState;
    configMethods: ConfigMethods<T>;
    toggleMethods: ToggleMethods;
    resetMethods: ResetMethods;
  };
  updateOptionsForCardView: CardViewConfigMethods;
  cardLoader: CardLoaderMethods
}


/**
 * Card view instance API
 * @interface CardViewInstance
 * @property {Function} updateData - Updates the displayed data
 * @property {Function} updateConfig - Updates the configuration
 * @property {Function} destroy - Cleans up the instance
 * @property {Function} getSelected - Gets currently selected items
 * @property {Function} filter - Applies custom filter
 * @property {Function} sort - Applies custom sort
 * @property {Function} refresh - Forces re-render
 * @property {Function} scrollToItem - Scrolls to specific item
 * @property {Function} exportAs - Exports content in various formats
 */
export interface CardViewInstance {
  updateData: (newData: DataItem[]) => void;
  updateConfig: (newConfig: Partial<CardViewOptions>) => void;
  destroy: () => void;
  getSelected: () => DataItem[];
  filter: (predicate: (item: DataItem) => boolean) => void;
  sort: (compareFn: (a: DataItem, b: DataItem) => number) => void;
  refresh: () => void;
  scrollToItem: (id: string) => void;
  exportAs: (format: 'png' | 'svg' | 'json') => Promise<string>;
}