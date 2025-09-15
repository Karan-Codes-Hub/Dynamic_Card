# CardView Component Documentation

The CardView component is a highly customizable and feature-rich React component designed to display data in a card-based layout. It supports a variety of configurations, including multiple data display modes, flexible layouts, interactive features, and data manipulation options. This comprehensive documentation details the component's interfaces, supported functionalities, and provides in-depth usage examples to illustrate its capabilities.

## Table of Contents
1. [Overview](#overview)
2. [Key Interfaces](#key-interfaces)
   - [DataItem](#dataitem)
   - [CardSelectionOptions](#cardselectionoptions)
   - [CardDragOptions](#carddragoptions)
   - [CardClickOptions](#cardclickoptions)
   - [CardInteractions](#cardinteractions)
   - [SortConfig](#sortconfig)
   - [FilterConfig](#filterconfig)
   - [SearchConfig](#searchconfig)
   - [DataOperations](#dataoperations)
   - [PaginationConfig](#paginationconfig)
   - [ZoomConfig](#zoomconfig)
   - [CardTemplateConfig](#cardtemplateconfig)
   - [CardLayoutOptions](#cardlayoutoptions)
   - [CardElement](#cardelement)
   - [CardSection](#cardsection-1)
   - [CardRow](#cardrow)
   - [CardFieldConfig](#cardfieldconfig)
   - [CardDefaultView](#carddefaultview)
   - [CardStyle](#cardstyle)
   - [HeaderCardViewOptions](#headercardviewoptions)
   - [CardSection (Segregated Mode)](#cardsection-segregated)
   - [SegregatedData](#segregateddata)
   - [CardContentConfig](#cardcontentconfig)
   - [CardViewOptions](#cardviewoptions)
   - [CardViewInstance](#cardviewinstance)
3. [Supported Functionalities](#supported-functionalities)
   - [Data Display Modes](#data-display-modes)
   - [Layout Options](#layout-options)
   - [Interaction Features](#interaction-features)
   - [Data Operations](#data-operations)
   - [Pagination](#pagination)
   - [Zoom](#zoom)
   - [Virtual Scrolling and Lazy Loading](#virtual-scrolling-and-lazy-loading)
   - [Instance API](#instance-api)
4. [Usage Examples](#usage-examples)
   - [Basic Section-Based Card](#basic-section-based-card)
   - [Product Card with Interactions](#product-card-with-interactions)
   - [Social Media Post Card](#social-media-post-card)
   - [Collapsible Sections with Header Configuration](#collapsible-sections-with-header-configuration)
   - [Template-Based Rendering](#template-based-rendering)
5. [Best Practices](#best-practices)
6. [Conclusion](#conclusion)

## Overview

The CardView component is engineered to provide a versatile solution for presenting data in a card-based format within React applications. It supports two primary data modes: `normal` for displaying a flat list of data items and `segregated` for organizing data into multiple sections with distinct configurations. The component is designed to be highly customizable, allowing developers to tailor layouts, interactions, data operations, and rendering strategies to meet specific requirements. It is ideal for use cases such as e-commerce product listings, social media feeds, dashboards, and more. The component also provides an instance API for programmatic control, enhancing its flexibility for dynamic applications.

## Key Interfaces

Below is a detailed description of each interface used to configure the CardView component, including their properties, purposes, and usage scenarios.

### DataItem
Represents a single data item displayed in the card view, serving as the fundamental data structure.

- **Properties**:
  - `id: string` - A unique identifier for the data item, used for referencing and managing items (e.g., for selection or scrolling).
  - `[key: string]: any` - A dynamic key-value structure allowing arbitrary data properties to be attached, providing flexibility for various data types.

- **Purpose**: Acts as the core data unit for rendering cards, enabling the component to handle diverse data structures.

### CardSelectionOptions
Configures the selection behavior for cards, allowing users to select one or multiple items.

- **Properties**:
  - `selectable?: boolean` - Enables or disables item selection (default: `false`). When enabled, users can select cards via clicks or other interactions.
  - `multiSelect?: boolean` - Allows selection of multiple items when `selectable` is `true` (default: `false`). If `false`, only one item can be selected at a time.
  - `onSelect?: (selectedItems: DataItem[]) => void` - A callback function invoked when the selection changes, receiving an array of selected `DataItem` objects.

- **Purpose**: Enables interactive selection, useful for scenarios like selecting products in a shopping cart or marking items in a list.

### CardDragOptions
Configures drag-and-drop functionality for cards.

- **Properties**:
  - `draggable?: boolean` - Enables or disables drag functionality (default: `false`). When enabled, cards can be dragged within the view or to external drop zones.
  - `onDragStart?: (item: DataItem, event: React.DragEvent) => void` - A callback triggered when a drag operation starts, providing the dragged item and the drag event.
  - `onDragEnd?: (item: DataItem, event: React.DragEvent) => void` - A callback triggered when a drag operation ends, providing the dragged item and the drag event.

- **Purpose**: Facilitates drag-and-drop interactions, such as reordering cards or moving items to other components.

### CardClickOptions
Configures click and hover interactions for cards.

- **Properties**:
  - `onClick?: (item: DataItem, event: React.MouseEvent) => void` - A callback for single-click events, providing the clicked item and mouse event.
  - `onDoubleClick?: (item: DataItem, event: React.MouseEvent) => void` - A callback for double-click events, providing the clicked item and mouse event.
  - `onHover?: (item: DataItem, event: React.MouseEvent) => void` - A callback for hover events, providing the hovered item and mouse event.

- **Purpose**: Enables custom responses to user interactions, such as opening a modal on click or showing a tooltip on hover.

### CardInteractions
Combines selection, drag, and click options into a single interface for comprehensive interaction configuration.

- **Extends**: `CardSelectionOptions`, `CardDragOptions`, `CardClickOptions`
- **Purpose**: Provides a unified interface for configuring all interactive behaviors, simplifying the management of complex user interactions.

### SortConfig
Configures sorting functionality for data items.

- **Properties**:
  - `enabled?: boolean` - Enables or disables sorting (default: `false`). When enabled, data can be sorted based on a comparator.
  - `compareFn?: (a: DataItem, b: DataItem) => number` - A custom comparator function for sorting, returning a negative, zero, or positive value to determine order.

- **Purpose**: Allows dynamic sorting of cards, such as sorting products by price or posts by date.

### FilterConfig
Configures filtering functionality for data items.

- **Properties**:
  - `enabled?: boolean` - Enables or disables filtering (default: `false`). When enabled, data can be filtered based on a predicate.
  - `filterFn?: (item: DataItem) => boolean` - A custom predicate function that determines whether an item should be included in the display.

- **Purpose**: Enables filtering of data, such as showing only items that meet specific criteria (e.g., in-stock products).

### SearchConfig
Configures search functionality for data items.

- **Properties**:
  - `enabled?: boolean` - Enables or disables search (default: `false`). When enabled, a search input is available to filter items.
  - `searchFn?: (term: string, item: DataItem) => boolean` - A custom matcher function that determines whether an item matches the search term.

- **Purpose**: Provides a search feature to filter cards based on user input, such as searching for products by name.

### DataOperations
Groups sorting, filtering, and search configurations for data manipulation.

- **Properties**:
  - `sort?: SortConfig` - Sorting configuration.
  - `filter?: FilterConfig` - Filtering configuration.
  - `search?: SearchConfig` - Search configuration.

- **Purpose**: Centralizes data manipulation options, allowing developers to enable multiple data operations seamlessly.

### PaginationConfig
Configures pagination behavior for large datasets.

- **Properties**:
  - `enabled?: boolean` - Enables or disables pagination (default: `false`). When enabled, data is split into pages.
  - `itemsPerPage?: number` - Number of items to display per page (default: `10`).
  - `variant?: 'basic' | 'advanced'` - Specifies the pagination UI style (`basic` for simple navigation, `advanced` for additional controls like page size selection; default: `basic`).

- **Purpose**: Manages large datasets by dividing them into pages, improving performance and user experience.

### ZoomConfig
Configures zoom behavior for cards.

- **Properties**:
  - `enabled?: boolean` - Enables or disables zoom (default: `false`). When enabled, users can zoom in on cards.
  - `maxScale?: number` - Maximum zoom scale (e.g., `2` for 200%; default: `2`).

- **Purpose**: Enhances user interaction by allowing zooming for detailed inspection of card content.

### CardTemplateConfig
Configures template-based rendering for cards.

- **Properties**:
  - `template: string` - A Jinja-style template string defining the card's structure and content.
  - `helpers?: { [name: string]: (...args: any[]) => any }` - Optional helper functions for use within the template.

- **Purpose**: Enables custom rendering using templates, providing flexibility for complex card designs.

### CardLayoutOptions
Configures the layout of cards within the view.

- **Properties**:
  - `type?: 'grid' | 'masonry' | 'carousel' | 'stack'` - Specifies the layout type (default: `grid`).
    - `grid`: Arranges cards in a uniform grid.
    - `masonry`: Arranges cards in a masonry-style layout with variable heights.
    - `carousel`: Displays cards in a horizontal carousel.
    - `stack`: Stacks cards vertically or horizontally.
  - `columns?: number` - Number of columns in grid layout (default: `3`).
  - `gap?: number | string` - Spacing between cards (default: `0`).
  - `padding?: number | string` - Padding around the card container (default: `0`).
  - `breakpoints?: { [screenWidth: number]: { columns?: number; gap?: number | string } }` - Responsive configurations for different screen widths.

- **Purpose**: Provides flexible layout options to adapt to various display requirements and screen sizes.

### CardElement
Configures a single element within a card section.

- **Properties**:
  - `id: string` - Unique identifier for the element.
  - `component: React.ReactNode` - The React component to render for the element.
  - `align?: 'left' | 'center' | 'right'` - Alignment of the element within its section (default: `left`).
  - `style?: React.CSSProperties` - Custom CSS styles for the element.
  - `order?: number` - Order of appearance within the section (lower numbers appear first; default: `0`).

- **Purpose**: Defines individual components within a card section, allowing precise control over content and styling.

### CardSection (Row-Level)
Configures a section (left, center, or right) within a card row.

- **Properties**:
  - `elements: CardElement[]` - Array of elements to display in the section.
  - `style?: React.CSSProperties` - CSS styles for the section container.
  - `justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'` - Alignment of elements within the section (default: `flex-start`).
  - `flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'` - Direction to arrange elements (default: `row`).
  - `gap?: string | number` - Spacing between elements (default: `8px`).

- **Purpose**: Organizes elements within a row, providing layout flexibility for complex card designs.

### CardRow
Configures a single row within a card.

- **Properties**:
  - `id: string` - Unique identifier for the row.
  - `left?: CardSection` - Configuration for the left section of the row.
  - `center?: CardSection` - Configuration for the center section of the row.
  - `right?: CardSection` - Configuration for the right section of the row.
  - `containerStyle?: React.CSSProperties` - CSS styles for the row container.
  - `visible?: boolean` - Whether the row is visible (default: `true`).
  - `onClick?: (row: CardRow) => void` - Callback triggered when the row is clicked.

- **Purpose**: Structures card content into rows with distinct sections, enabling complex layouts within a single card.

### CardFieldConfig
Configures the card layout using rows for field-based rendering.

- **Properties**:
  - `rows: CardRow[]` - Array of row configurations.
  - `cardStyle?: React.CSSProperties` - Global styles for the card container.
  - `rowSpacing?: string | number` - Spacing between rows (default: `8px`).
  - `flexDirection?: 'row' | 'column'` - Direction to arrange rows (default: `column`).
  - `flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'` - Whether to wrap rows when using row direction (default: `nowrap`).

- **Purpose**: Provides a structured approach to card rendering with row-based layouts.

### CardDefaultView
Configures the default view for displaying data as key-value pairs.

- **Properties**:
  - `excludeKeys?: string[]` - Keys to exclude from the default view (default: `[]`).

- **Purpose**: Simplifies rendering by automatically displaying all data properties as key-value pairs, with the option to exclude specific keys.

### CardStyle
Configures styling for the card.

- **Properties**:
  - `className?: string` - CSS class name for the card container.
  - `style?: React.CSSProperties` - Inline CSS styles for the card container.

- **Purpose**: Allows customization of card appearance through CSS classes or inline styles.

### HeaderCardViewOptions
Configures the card header, providing options for custom items, default controls, and styling.

- **Properties**:
  - `headerConfig?: { customItems?, defaultItems?, defaultAlignment?, className? }` - Configuration for header items and layout.
    - `customItems?: Array<{ id: string; component: React.ReactNode; align?: 'left' | 'center' | 'right' }>` - Custom header items (overrides default items if provided).
    - `defaultItems?: { search?, sort?, download?, filter? }` - Default controls to display (e.g., search bar, sort button).
      - `search?: { visible: boolean; placeholder?: string }` - Search input configuration.
      - `sort?: { visible: boolean; multiSort?: boolean }` - Sort control configuration.
      - `download?: { visible: boolean; allowedTypes?: string[]; nameForDownloadFile?: string; allowedColumnsToDownload?: string[] }` - Download button configuration.
      - `filter?: boolean` - Enables filter control.
    - `defaultAlignment?: 'left' | 'center' | 'right'` - Default alignment for header items.
    - `className?: string` - Additional CSS class for the header.
  - `customHeader?: React.ReactNode` - Custom header renderer (overrides `headerConfig` if provided).
  - `visible?: boolean` - Whether to show the header (default: `true`).
  - `style?: React.CSSProperties` - CSS styles for the header.
  - `title?: string` - Header title or text.
  - `additionalActions?: React.ReactNode[]` - Additional action components to display on the right side.

- **Purpose**: Provides flexible header customization, including built-in controls and custom rendering.

### CardSection (Segregated Mode)
Configures a section in segregated data mode, representing a distinct content block within the card.

- **Properties**:
  - `id: string` - Unique identifier for the section.
  - `header?: string | React.ReactNode` - Section title or custom header component.
  - `headerConfig?: HeaderCardViewOptions` - Section-specific header configuration.
  - `data: Record<string, any> | any[]` - Data for the section.
  - `style?: React.CSSProperties` - CSS styles for the section container.
  - `content: CardContentConfig` - Content configuration (field-based, template-based, or default view).
  - `collapsible?: boolean` - Whether the section is collapsible (default: `false`).
  - `initiallyCollapsed?: boolean` - Initial collapsed state (default: `false`).
  - `interactions?: CardInteractions` - Section-specific interaction handlers.

- **Purpose**: Enables modular organization of card content with independent configurations for each section.

### SegregatedData
Configures multiple sections within a card in segregated data mode.

- **Properties**:
  - `globalHeader?: React.ReactNode | HeaderCardViewOptions` - Main header for the entire card.
  - `sections: CardSection[]` - Array of section configurations.
  - `footer?: React.ReactNode | Record<string, any>` - Footer content or configuration.
  - `meta?: Record<string, any>` - Metadata not displayed but available for internal use.
  - `globalStyle?: React.CSSProperties` - Global styles applied to all sections.
  - `sectionContainerStyle?: React.CSSProperties` - Styles for section containers.

- **Purpose**: Supports complex card layouts with multiple sections, each with its own data and configuration.

### CardContentConfig
A discriminated union type for configuring card content display.

- **Variants**:
  - `{ contentDisplayType: 'field-config'; content: CardFieldConfig }` - Row-based layout with sections.
  - `{ contentDisplayType: 'template-config'; content: CardTemplateConfig }` - Template-based rendering with Jinja-style templates.
  - `{ contentDisplayType: 'default-view'; content: CardDefaultView }` - Automatic key-value pair rendering.

- **Purpose**: Provides flexibility in how card content is rendered, catering to different design needs.

### CardViewOptions
The main configuration interface for the CardView component.

- **Properties**:
  - `dataMode: 'segregated' | 'normal'` - Specifies the data mode (`normal` for flat data, `segregated` for section-based data).
  - `data?: DataItem[]` - Array of data items for `normal` mode.
  - `segregatedData?: SegregatedData` - Section-based data structure for `segregated` mode.
  - `renderCard: (item: DataItem) => React.ReactNode` - Function to render individual cards in `normal` mode.
  - `headerCardView?: HeaderCardViewOptions` - Header configuration for the entire view.
  - `content: CardContentConfig` - Content configuration for rendering cards or sections.
  - `layout?: CardLayoutOptions` - Layout configuration for card arrangement.
  - `cardStyle?: CardStyle` - Base styling for cards.
  - `interactions?: CardInteractions` - Interaction handlers for the view.
  - `dataOperations?: DataOperations` - Data manipulation configurations.
  - `pagination?: PaginationConfig` - Pagination settings.
  - `zoom?: ZoomConfig` - Zoom behavior settings.
  - `virtualScroll?: boolean` - Enables virtual scrolling for performance optimization.
  - `lazyLoad?: boolean` - Enables lazy loading of card content.

- **Purpose**: Serves as the central configuration for the CardView component, integrating all features and options.

### CardViewInstance
Provides an API for interacting with a CardView instance programmatically.

- **Methods**:
  - `updateData(newData: DataItem[]): void` - Updates the data displayed in the view.
  - `updateConfig(newConfig: Partial<CardViewOptions>): void` - Updates the component's configuration with new settings.
  - `destroy(): void` - Cleans up the instance, removing event listeners and freeing resources.
  - `getSelected(): DataItem[]` - Returns an array of currently selected items.
  - `filter(predicate: (item: DataItem) => boolean): void` - Applies a custom filter to the data.
  - `sort(compareFn: (a: DataItem, b: DataItem) => number): void` - Applies a custom sort to the data.
  - `refresh(): void` - Forces a re-render of the component.
  - `scrollToItem(id: string): void` - Scrolls to the card with the specified ID.
  - `exportAs(format: 'png' | 'svg' | 'json'): Promise<string>` - Exports the card view content in the specified format.

- **Pagination Methods**:
  - `goToPage(pageNumber: number): void` - Navigates directly to the specified page.
  - `nextPage(): void` - Moves to the next page if available.
  - `previousPage(): void` - Moves to the previous page if available.
  - `goToFirstPage(): void` - Jumps to the very first page.
  - `goToLastPage(): void` - Jumps to the very last page.
  - `quickJumpToPage(pageNumber: number): void` - Quickly jumps to a given page without step-by-step navigation.
  - `resetToFirstPage(): void` - Resets pagination and navigates back to the first page.

- **Pagination Utilities**:
  - `isFirstPage(): boolean` - Returns `true` if the current page is the first page.
  - `isLastPage(): boolean` - Returns `true` if the current page is the last page.
  - `getPaginationState(): PaginationState` - Returns the current pagination state (e.g., current page, total pages, range).
  - `getPageRange(): [number, number]` - Returns the start and end indices of items on the current page.

- **Pagination State**:
  - `currentPage: number` - The current active page.
  - `totalPages: number` - The total number of available pages.
    
- **Data Processing Functionalities**:

  - **Data State (`dataState`)**:
    - `processedData: T[]` - The data after applying filters, sorting, and search.
    - `originalCount: number` - The total number of items before filtering.
    - `filteredCount: number` - The number of items after filtering.

  - **Configuration State (`configState`)**:
    - `filters: FilterConfig[]` - Current filter configurations.
    - `sortConfig: SortConfig[]` - Current sorting configuration.
    - `searchConfig: SearchConfig` - Current search configuration.

  - **Configuration Methods (`configMethods`)**:
    - `updateFilter(filter: FilterConfig): void` - Updates the applied filter.
    - `updateSort(sort: SortConfig): void` - Updates the applied sort order.
    - `setSortConfig(config: SortConfig[]): void` - Sets the sort configuration.
    - `setSearchConfig(config: SearchConfig): void` - Sets the search configuration.
    - `setData(data: T[]): void` - Replaces the underlying dataset.

  - **Toggle Methods (`toggleMethods`)**:
    - `toggleCaseSensitive(): void` - Toggles case sensitivity in search.
    - `toggleExactMatch(): void` - Toggles exact match mode in search.

  - **Reset Methods (`resetMethods`)**:
    - `resetAll(): void` - Resets filters, sorting, and search to default state.

- **Purpose**:  
  Enables dynamic control over the CardView instance, including **data handling, configuration updates, and pagination control**, facilitating seamless integration with application logic.


## Supported Functionalities

### Data Display Modes
- **Normal Mode**: Displays a flat array of `DataItem` objects, rendered using the `renderCard` function. Ideal for simple lists, such as a product catalog or task list.
- **Segregated Mode**: Organizes data into multiple sections, each with its own header, content, and interactions. Suitable for complex layouts like user profiles or dashboards with distinct sections.

### Layout Options
- **Grid Layout**: Arranges cards in a uniform grid with configurable columns and gaps, ideal for product listings or galleries.
- **Masonry Layout**: Displays cards with variable heights, optimizing space usage for content with differing sizes.
- **Carousel Layout**: Presents cards in a horizontal, scrollable carousel, suitable for featured items or slideshows.
- **Stack Layout**: Stacks cards vertically or horizontally, useful for compact displays.
- **Responsive Breakpoints**: Adjusts layout properties (e.g., columns, gaps) based on screen width, ensuring a responsive design.

### Interaction Features
- **Selection**: Supports single or multiple item selection with a callback for handling selection changes, useful for actions like adding items to a cart.
- **Drag-and-Drop**: Enables dragging cards within the view or to external drop zones, with callbacks for drag start and end events.
- **Click and Hover**: Handles single clicks, double clicks, and hover events with customizable callbacks, enabling actions like opening details or showing tooltips.
- **Row-Level Interactions**: Allows click handlers on individual rows within cards, providing fine-grained interaction control.

### Data Operations
- **Sorting**: Supports custom sorting with a comparator function, allowing dynamic reordering of cards (e.g., by price or date).
- **Filtering**: Enables filtering of data with a custom predicate, such as displaying only items that meet specific criteria.
- **Searching**: Provides a search feature to filter cards based on user input, with a custom matcher for flexible search logic.

### Pagination
- Splits large datasets into pages with configurable items per page and UI variants (`basic` for simple navigation, `advanced` for additional controls like page size selection). Improves performance and usability for large datasets.

### Zoom
- Allows users to zoom in on cards for detailed inspection, with a configurable maximum scale to prevent excessive zooming.

### Virtual Scrolling and Lazy Loading
- **Virtual Scrolling**: Renders only visible cards, optimizing performance for large datasets by reducing DOM elements.
- **Lazy Loading**: Loads card content as needed, improving initial load times and reducing resource usage.

### Instance API
- Provides programmatic control over the CardView instance, including updating data, modifying configurations, applying filters, sorting, scrolling, and exporting content in formats like PNG, SVG, or JSON.

## Usage Examples

### Basic Section-Based Card
A simple card with multiple sections for a user profile dashboard.

```typescript
const config: CardViewOptions = {
  dataMode: 'segregated',
  segregatedData: {
    globalHeader: 'User Profile Dashboard',
    sections: [
      {
        id: 'personal-info',
        header: 'Personal Information',
        data: { name: 'John Doe', email: 'john@example.com', age: 30 },
        content: {
          contentDisplayType: 'field-config',
          content: {
            rows: [
              {
                id: 'name-row',
                left: {
                  elements: [{ id: 'name-label', component: <Typography>Name:</Typography> }],
                },
                center: {
                  elements: [{ id: 'name-value', component: <Typography>John Doe</Typography> }],
                },
              },
              {
                id: 'email-row',
                left: {
                  elements: [{ id: 'email-label', component: <Typography>Email:</Typography> }],
                },
                center: {
                  elements: [{ id: 'email-value', component: <Typography>john@example.com</Typography> }],
                },
              },
            ],
            cardStyle: { padding: '16px', borderRadius: '8px' },
          },
        },
      },
    ],
    globalStyle: { fontFamily: 'Roboto, sans-serif' },
  },
  renderCard: (item: DataItem) => <div>{item.name}</div>,
};
```

### Product Card with Interactions
A product card with selection and drag-and-drop support, using Material-UI components for styling.

```typescript
import { Box, Typography, Button } from '@mui/material';

const productCard: CardViewOptions = {
  dataMode: 'normal',
  data: [
    { id: '1', name: 'Wireless Headphones', price: 199.99, inStock: true },
    { id: '2', name: 'Bluetooth Speaker', price: 89.99, inStock: false },
  ],
  renderCard: (item) => (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
      <Typography variant="h6">{item.name}</Typography>
      <Typography variant="body1">${item.price}</Typography>
      <Button variant="contained" disabled={!item.inStock}>
        {item.inStock ? 'Add to Cart' : 'Out of Stock'}
      </Button>
    </Box>
  ),
  interactions: {
    selectable: true,
    multiSelect: false,
    onSelect: (selectedItems) => console.log('Selected items:', selectedItems),
    draggable: true,
    onDragStart: (item, event) => console.log(`Dragging ${item.name} (ID: ${item.id})`),
    onDragEnd: (item, event) => console.log(`Dropped ${item.name} (ID: ${item.id})`),
  },
  layout: {
    type: 'grid',
    columns: 3,
    gap: '16px',
    breakpoints: {
      600: { columns: 2, gap: '12px' },
      400: { columns: 1, gap: '8px' },
    },
  },
  dataOperations: {
    sort: {
      enabled: true,
      compareFn: (a, b) => a.price - b.price,
    },
    filter: {
      enabled: true,
      filterFn: (item) => item.inStock,
    },
  },
};
```

### Social Media Post Card
A social media post card with multiple rows and interactive elements, styled with Material-UI.

```typescript
import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
import { ThumbUp, Comment, Share, MoreVert } from '@mui/icons-material';

const socialPostCard: CardFieldConfig = {
  rows: [
    {
      id: 'post-header',
      containerStyle: { padding: '16px', display: 'flex', alignItems: 'center' },
      left: {
        elements: [
          {
            id: 'user-avatar',
            component: <Avatar src="/user.jpg" sx={{ width: 40, height: 40 }} />,
            style: { marginRight: '12px' },
          },
          {
            id: 'user-info',
            component: (
              <Box>
                <Typography fontWeight="bold">Jane Doe</Typography>
                <Typography variant="caption">2 hours ago</Typography>
              </Box>
            ),
          },
        ],
        justifyContent: 'flex-start',
      },
      right: {
        elements: [
          {
            id: 'more-options',
            component: <IconButton><MoreVert /></IconButton>,
          },
        ],
      },
    },
    {
      id: 'post-content',
      containerStyle: { padding: '16px', paddingBottom: '8px' },
      left: {
        elements: [
          {
            id: 'post-text',
            component: <Typography>Check out this beautiful sunset from my hike yesterday! #nature</Typography>,
          },
          {
            id: 'post-image',
            component: <img src="/sunset.jpg" style={{ width: '100%', borderRadius: '8px', marginTop: '12px' }} />,
          },
        ],
        flexDirection: 'column',
        gap: '8px',
      },
    },
    {
      id: 'post-actions',
      containerStyle: { padding: '8px 16px', borderTop: '1px solid #f0f0f0' },
      left: {
        elements: [
          {
            id: 'like-button',
            component: <Button startIcon={<ThumbUp />} size="small">Like</Button>,
          },
          {
            id: 'comment-button',
            component: <Button startIcon={<Comment />} size="small">Comment</Button>,
            style: { marginLeft: '8px' },
          },
          {
            id: 'share-button',
            component: <Button startIcon={<Share />} size="small">Share</Button>,
            style: { marginLeft: '8px' },
          },
        ],
        gap: '4px',
      },
    },
  ],
  cardStyle: {
    maxWidth: '600px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
};
```

### Collapsible Sections with Header Configuration
A card with collapsible sections and a custom header configuration.

```typescript
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

const collapsibleConfig: CardViewOptions = {
  dataMode: 'segregated',
  segregatedData: {
    globalHeader: {
      title: 'Performance Dashboard',
      defaultItems: {
        search: { visible: true, placeholder: 'Search metrics...' },
        download: { visible: true, allowedTypes: ['csv'], nameForDownloadFile: 'metrics' },
      },
      additionalActions: [
        <Tooltip title="Refresh data">
          <IconButton><RefreshIcon /></IconButton>
        </Tooltip>,
      ],
    },
    globalStyle: { fontFamily: 'Arial, sans-serif', borderRadius: '8px' },
    sectionContainerStyle: { marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    sections: [
      {
        id: 'metrics-section',
        header: 'Quarterly Metrics',
        collapsible: true,
        initiallyCollapsed: false,
        data: { revenue: 100000, growth: '15%' },
        content: {
          contentDisplayType: 'default-view',
          content: { excludeKeys: ['id'] },
        },
        style: { backgroundColor: '#fafafa', padding: '16px' },
      },
    ],
  },
  renderCard: (item) => <div>{item.revenue}</div>,
};
```

### Template-Based Rendering
A card using a template-based configuration for rendering.

```typescript
const templateConfig: CardViewOptions = {
  dataMode: 'segregated',
  segregatedData: {
    sections: [
      {
        id: 'template-section',
        header: 'Custom Template',
        data: { title: 'Sample Item', description: 'This is a sample description' },
        content: {
          contentDisplayType: 'template-config',
          content: {
            template: `
              <div>
                <h3>{{title}}</h3>
                <p>{{description}}</p>
                {{customHelper title}}
              </div>
            `,
            helpers: {
              customHelper: (title: string) => `<span style="color: blue;">${title.toUpperCase()}</span>`,
            },
          },
        },
      },
    ],
  },
  renderCard: (item) => <div>{item.title}</div>,
};
```

## Best Practices
- **Optimize Data Size**: Use virtual scrolling and lazy loading for large datasets to improve performance.
- **Consistent Styling**: Leverage `globalStyle` and `sectionContainerStyle` in segregated mode to maintain a cohesive look.
- **Responsive Design**: Configure `breakpoints` in `CardLayoutOptions` to ensure a good user experience across devices.
- **Clear Interactions**: Provide visual feedback for interactions (e.g., highlighting selected cards) to enhance usability.
- **Modular Sections**: Use segregated mode for complex layouts to keep configurations organized and maintainable.
- **Error Handling**: Validate `DataItem` IDs to ensure uniqueness and prevent rendering issues.
- **Template Safety**: When using `CardTemplateConfig`, sanitize template inputs to prevent XSS vulnerabilities.

## Conclusion
The CardView component is a powerful and flexible solution for displaying data in card-based layouts within React applications. Its support for normal and segregated data modes, combined with extensive configuration options for layouts, interactions, and data operations, makes it suitable for a wide range of use cases. The instance API further enhances its utility by allowing dynamic control, making it an ideal choice for building interactive and responsive user interfaces.