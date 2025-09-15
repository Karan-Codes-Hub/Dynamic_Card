import React, { useEffect, useState, useImperativeHandle } from 'react';
import CardViewHeader from '../header/CardViewHeader';
import CardContentViewRenderer from './CardContentViewRenderer';
import { getCardViewOptions } from './CardViewContext';
import { useAdvancedDataProcessing } from '../customHooks/useAdvancedDataProcessing';
import useValuesForFunctionalitiesButtons from '../customHooks/useValuiesForFunctionalitiesButtons';
import { AdvancedPagination } from "../reusableComponent/PaginationRenderer"
import { usePaginatedData } from '../customHooks/usePaginatedData';
import { usePaginationControls } from '../customHooks/usePaginationControls';
import { useCardViewConfig } from '../customHooks/useCardViewConfig';
import { Button } from '@mui/material';
import CardViewRenderer from './CardContentViewRenderer';

const DEFAULT_PAGINATION_OPTIONS = {
  showSizeChanger: true,
  showTotal: false,
  showQuickJumper: false,
  align: "center" as "left" | "center" | "right",
  pageSizeOptions: [
    { value: 10, label: '10  per page' },
    { value: 20, label: '20 per page' },
    { value: 30, label: '30 per page' },
  ]
};

/**
 * RenderCardViewElements Component
 * 
 * Main container component that orchestrates the Card View functionality.
 * Handles data processing, sorting, filtering, and provides processed data
 * to child components through context.
 * 
 * This component serves as the bridge between data processing logic and
 * the rendering components (Header and Content Renderer).
 * 
 * @component
 * @returns {React.ReactElement} The complete card view structure with header and content
 */
const RenderCardViewElements: React.FC = () => {
  // Retrieve card view options and methods from context
  const { options, refForFunctionalities, addCustomProperty, updateOptions } = getCardViewOptions();
  const { configToApplyFilters } = useValuesForFunctionalitiesButtons(options?.dataItemDescription);
  const { paginationOptions } = options || {};
  const { config, methods } = useCardViewConfig(options);
  const [refresh, setRefresh] = useState(0);
  const isPaginationEnabled = paginationOptions?.enabled;
  const { CardView, showCardLoader, hideCardLoader } = CardViewRenderer();

  /**
   * Handler for filter display toggle
   * @function showFilters
   * @description Logs when the filter display is requested (placeholder for future implementation)
   */
  const showFilters = () => {
    console.log('Show filters clicked');
  };

  /**
   * Type definition for sort configuration
   * @typedef {Object} SortConfig
   * @property {string} id - Unique identifier for the sort
   * @property {string} key - Data field key to sort by
   * @property {'asc'|'desc'|'none'} order - Sort direction
   */
  type SortConfig = { id: string; key: string; order: 'asc' | 'desc' | 'none' };

  /**
   * Advanced data processing hook
   * @description Handles all data transformations including filtering, sorting, and searching
   * @type {Object}
   * @property {Array} processedData - The final processed data after all transformations
   * @property {Array} filters - Current active filters
   * @property {Array} sortConfig - Current sort configuration
   * @property {Object} searchConfig - Current search configuration
   * @property {Function} updateFilter - Function to update filters
   * @property {Function} updateSort - Function to update sorting
   * @property {Function} setSearchConfig - Function to set search configuration
   * @property {Function} setData - Function to update the base data
   * @property {Function} toggleCaseSensitive - Toggle case sensitivity in search
   * @property {Function} toggleExactMatch - Toggle exact match in search
   * @property {Function} resetAll - Reset all data processing to initial state
   * @property {Function} setSortConfig - Function to set sort configuration
   * @property {number} originalCount - Count of original data items
   * @property {number} filteredCount - Count of data items after filtering
   */
  const {
    processedData,
    filters,
    sortConfig,
    searchConfig,
    updateFilter,
    updateSort,
    setSearchConfig,
    setData,
    toggleCaseSensitive,
    toggleExactMatch,
    resetAll,
    setSortConfig,
    originalCount,
    filteredCount
  } = useAdvancedDataProcessing<any>({
    initialData: options?.data,
    filterConfig: configToApplyFilters || [],
    defaultSort: [],
    defaultSearch: { fields: ['name', 'description'], query: '' },
    defaultCaseSensitive: false,
    defaultExactMatch: false
  });
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const returnedPaginatedData = usePaginatedData({
    data: processedData,
    total: processedData.length,
    defaultPageSize: pageSize,
    defaultCurrent: current,
  });
  /**
   * Handles pagination controls and state
   * @function usePaginationControls
   * @description Provides comprehensive pagination controls and utilities
   * @returns {Object} An object containing pagination control functions and state information
   */
  const {
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    quickJumpToPage,
    resetToFirstPage,

    // Utility functions
    isFirstPage,
    isLastPage,
    getPaginationState,
    getPageRange,
    currentPage,
    totalPages
  } = usePaginationControls(returnedPaginatedData);
  // Expose imperative functionalities from this component to parent via ref

  useImperativeHandle(refForFunctionalities, () => ({
    /**
     * --------------------------
     * PAGINATION FUNCTIONALITIES
     * --------------------------
     * Handles everything related to table pagination:
     * navigation methods, utility helpers, and pagination state.
     */
    paginationFunctionalities: {
      // Navigation methods: allow parent to move between pages programmatically
      paginationMethods: {
        goToPage,          // Jump to a specific page
        nextPage,          // Navigate to the next page
        previousPage,      // Navigate to the previous page
        goToFirstPage,     // Reset navigation to the first page
        goToLastPage,      // Jump directly to the last page
        quickJumpToPage,   // Fast jump (e.g., via input box)
        resetToFirstPage,  // Reset pagination back to page 1
      },

      // Utility functions: provide pagination-related checks and helpers
      paginationUtils: {
        isFirstPage,        // Returns true if current page is the first page
        isLastPage,         // Returns true if current page is the last page
        getPaginationState, // Retrieves the full pagination state
        getPageRange,       // Gets the range of items shown on the current page
      },

      // State: current page and total pages (exposed for external usage)
      paginationState: {
        currentPage,        // Currently active page number
        totalPages,         // Total number of pages available
      },
    },

    /**
     * -------------------------------
     * DATA PROCESSING FUNCTIONALITIES
     * -------------------------------
     * Covers filtering, sorting, searching, and managing processed data.
     */
    dataProcessingFunctionalities: {
      // Core data state: gives parent access to current processed dataset
      dataState: {
        processedData,      // Final data after filtering, sorting, searching
        originalCount,      // Count of total unmodified data entries
        filteredCount,      // Count of data entries after filters applied
      },

      // Configurations: track active filters, sort rules, and search settings
      configState: {
        filters,            // Active filter configurations
        sortConfig,         // Current sorting configuration
        searchConfig,       // Current search configuration (case/exact flags etc.)
      },

      // Update methods: allow parent to change filter, sort, and search configs
      configMethods: {
        updateFilter,       // Update filters dynamically
        updateSort,         // Update sorting criteria
        setSortConfig,      // Directly set sorting configuration
        setSearchConfig,    // Directly set search configuration
        setData,            // Update table data externally
      },

      // Toggle methods: enable/disable case sensitivity & exact match for searching
      toggleMethods: {
        toggleCaseSensitive, // Toggle case sensitivity in search
        toggleExactMatch,    // Toggle exact match mode in search
      },

      // Reset methods: revert all configurations and states back to default
      resetMethods: {
        resetAll,           // Reset filters, sorting, searching, and data state
      },
    },
    /**
     * -------------------------------
     * Change Options for the card view
     * -------------------------------
     * Covers changing the card view options, such as data, layout, interactions, and data operations.
     * 
     * @example
     * // Update data
     * methods.updateData([
     *   { id: '1', name: 'John Doe', age: 30 },
     *   { id: '2', name: 'Jane Smith', age: 25 },
     *   { id: '3', name: 'Michael Johnson', age: 35 },
     *   { id: '4', name: 'Emily Davis', age: 40 },
     *   { id: '5', name: 'David Wilson', age: 45 },
     * ]);
     * 
     * @example
     * // Update layout
     * methods.updateLayout({ type: 'masonry', columns: 3 });
     * 
     * @example
     * // Update interactions
     * methods.updateInteractions({ selectable: true });
     * 
     * @example
     * // Update data operations
     * methods.updateDataOperations({ sort: { enabled: true, compareFn: (a, b) => a.age - b.age } });
     * 
     * @example
     * // Update pagination
     * methods.updatePagination({ itemsPerPage: 10, variant: 'advanced' });
     * 
     * @example
     * // Update zoom
     * methods.updateZoom({ enabled: true, maxScale: 2 });
     * 
     * @example
     * // Update header     
     * methods.updateHeader({ title: 'New Title' });
     * 
     * @example
     * // Update content
     * methods.updateContent({ contentDisplayType: 'field-config', content: { rows: [{ id: 'name', field: 'name', component: <div>Custom Content</div> }] } }); 
     * 
     * @example
     * // Update data item descriptions
     * methods.updateDataItemDescriptions([
     *   { key: 'name', label: 'Name', typeOfField: 'string', sortConfiguration: { canSort: true } },
     *   { key: 'age', label: 'Age', typeOfField: 'number', sortConfiguration: { canSort: true } },
     * ]);
     * 
     * @example
     * // Update segregated data
     * methods.updateSegregatedData({ globalHeader: 'Custom Header' });
     * 
     * @example
     * // Update section in segregated data
     * methods.updateSection('personal-info', { 
     *   style: { backgroundColor: '#f0f0f0' },
     *   collapsible: true        
     * });    
     * 
     * @example
     * // Add new section in segregated data    
     * methods.addSection({ id: 'new-section', header: 'New Section', data: { name: 'John Doe', age: 30 } });
     * 
     * @example
     * // Remove section in segregated data   
     *  methods.removeSection('personal-info'); 
     *
     */
    updateOptionsForCardView: {
      ...methods
    },

    /**
     * --------------------------
     * CARD LOADER FUNCTIONALITIES
     * --------------------------
     * Provides methods to control a loader state for individual cards.
     * Useful when you need to simulate loading states for fetching/updating
     * card data.
     */
    cardLoader: {

      /**
      * Show loader on a specific card by ID.
      * 
      * @param cardId - The unique identifier of the card to show the loader for.
      * 
      * @example
      * <Button onClick={() => showCardLoader("emp-1001")}>Load Card</Button>
      */
      showCardLoader: showCardLoader,
      /**
       * Hide loader on a specific card by ID.
       * 
       * @param cardId - The unique identifier of the card to hide the loader for.
       * 
       * @example
       * <Button onClick={() => hideCardLoader("emp-1001")}>Hide Card</Button>
       */
      hideCardLoader: hideCardLoader
    }
  }));



  /**
   * Handles sort operations from the header component
   * @function handleSort
   * @description Processes single or multiple sort configurations and applies them to the data
   * @param {SortConfig | SortConfig[]} newSortConfig - Single sort config or array of sort configs
   */

  const handleSort = (newSortConfig: SortConfig | SortConfig[]) => {
    // Clear all existing sorts first
    setSortConfig([]);

    // Apply each sort in the new config
    if (Array.isArray(newSortConfig)) {
      console.log("Sort clicked", processedData, newSortConfig);
      newSortConfig.forEach(item => {
        if (item.order !== 'none') {
          updateSort(item.key, item.order);
        }
      });
    } else {
      console.log("Sort clicked", processedData, newSortConfig);
      updateSort(newSortConfig?.key, newSortConfig?.order);
    }


  };
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Filter changed:', filters, configToApplyFilters);
    updateFilter(filters);
    // You can perform additional actions here when filters change
  };

  const handleSearch = (query: string) => {
    setSearchConfig({ ...searchConfig, query });
    console.log('Search query:', query);
  };
  const [, setTick] = useState(0);

  const reRender = () => {
    setTick((t) => t + 1); // triggers re-render
  };
  /**
   * Whenever the card view configuration changes,
   * update the card view options in the context with the new configuration
   */
  useEffect(() => {
    if (config) {
      updateOptions(config);
      reRender();
      console.log("in config")
    }
  }, [JSON.stringify(config)]);

  /**
   * After data is processed, add a custom property to the card view
   * to indicate that the data has been processed
   * so that the card view can use the new  processed data
   */
  useEffect(() => {
    addCustomProperty('isDataProcessed', true);
    addCustomProperty("useProcessedData", {
      processedData: paginationOptions.enabled ? returnedPaginatedData.paginatedData : processedData
    });
  }, [JSON.stringify(processedData), JSON.stringify(returnedPaginatedData), options]);


  const handlePageChange = (page: number, size?: number) => {
    console.log('Page: ', page, 'PageSize: ', size);

    returnedPaginatedData.updatePage(page);
    setCurrent(page);
    if (size != pageSize) {
      returnedPaginatedData.updatePageSize(size);
      setPageSize(size);
    }
  };

  return (
    <div>
      {/* <Button onClick={() => previousPage()}>Previous Page </Button>
      <Button onClick={() => nextPage()}>Next Page </Button>

      <Button onClick={() => showCardLoader("emp-1001")}>Load Card</Button>
      <Button onClick={() => hideCardLoader("emp-1001")}>Hide Card</Button> */}
      {/* Header component with sorting capabilities */}
      <CardViewHeader
        onSort={handleSort}
        onFilter={handleFilterChange}
        onSearch={handleSearch}
      // Additional props can be added here for filtering, search, etc.
      />
      {/*Main content renderer that displays the processed data */}
      {CardView}
      {isPaginationEnabled && (
        <AdvancedPagination
          key={refresh}
          currentPage={returnedPaginatedData.pagination.current}
          totalPages={returnedPaginatedData.pagination.totalPages}
          pageSize={returnedPaginatedData.pagination.pageSize}
          total={processedData.length}
          showSizeChanger={
            paginationOptions?.showSizeChanger
            ||
            DEFAULT_PAGINATION_OPTIONS.showSizeChanger
          }
          pageSizeOptions={
            paginationOptions?.pageSizeOptions
            ||
            DEFAULT_PAGINATION_OPTIONS.pageSizeOptions
          }
          showTotal={
            paginationOptions?.showTotal
            ||
            DEFAULT_PAGINATION_OPTIONS.showTotal
          }
          onChange={handlePageChange}
          showQuickJumper={
            paginationOptions?.showQuickJumper
            ||
            DEFAULT_PAGINATION_OPTIONS.showQuickJumper
          }
          align={
            paginationOptions?.align
            ||
            DEFAULT_PAGINATION_OPTIONS.align
          }
        />

      )}


    </div>
  );
};

export default RenderCardViewElements;

