import { useMemo, useState } from 'react';
import { FilterManager, DataSorter, DataSearcher } from '../utils/FunctionalityHelperFunctionsForCardView';
import type { Filter, SortConfig, SearchConfig } from '../utils/FunctionalityHelperFunctionsForCardView';

/**
 * Props interface for the useAdvancedDataProcessing hook
 * @template T - The type of items in the data array
 */
interface UseAdvancedDataProcessingProps<T> {
  /** Initial data array */
  initialData: T[];
  /** Configuration for available filters */
  filterConfig: any[];
  /** Default sort configuration (optional) */
  defaultSort?: SortConfig;
  /** Default search configuration (optional, without case sensitivity/exact match) */
  defaultSearch?: Omit<SearchConfig, 'caseSensitive' | 'exactMatch'>;
  /** Default case sensitivity setting (optional) */
  defaultCaseSensitive?: boolean;
  /** Default exact match setting (optional) */
  defaultExactMatch?: boolean;
}
/**
 * A comprehensive data processing hook that handles filtering, sorting, and searching
 * with full state management and control functions
 * 
 * @template T - The type of items in the data array
 * @param {UseAdvancedDataProcessingProps<T>} props - Configuration object
 * @returns An object containing processed data and control functions
 *
 * @example
 * ```tsx
 * import { useAdvancedDataProcessing } from './hooks/useAdvancedDataProcessing';
 * import { type Filter } from './utils/FunctionalityHelperFunctionsForCardView';
 * 
 * interface Product {
 *   id: number;
 *   name: string;
 *   price: number;
 *   category: string;
 * }
 * 
 * const productData: Product[] = [...]; // Some array of product data
 * 
 * const filterConfig: Filter[] = [
 *   { id: 'category', label: 'Category', type: 'checkbox', options: ['Electronics', 'Books'] },
 *   { id: 'price', label: 'Price', type: 'range', min: 0, max: 1000 }
 * ];
 * 
 * const {
 *   processedData,
 *   filters,
 *   sortConfig,
 *   searchConfig,
 *   updateFilter,
 *   updateSort,
 *   setSearchConfig,
 *   setData,
 *   setSortConfig,
 *   toggleCaseSensitive,
 *   toggleExactMatch,
 *   resetAll,
 *   originalCount,
 *   filteredCount
 * } = useAdvancedDataProcessing<Product>({
 *   initialData: productData,
 *   filterConfig,
 *   defaultSort: [{ field: 'price', direction: 'asc' }],
 *   defaultSearch: { fields: ['name', 'category'], query: '' },
 *   defaultCaseSensitive: false,
 *   defaultExactMatch: false
 * });
 * 
 * return (
 *   <>
 *     <SearchBar
 *       value={searchConfig.query}
 *       onChange={(e) => setSearchConfig({ ...searchConfig, query: e.target.value })}
 *     />
 *     
 *     <button onClick={() => toggleCaseSensitive()}>Toggle Case Sensitivity</button>
 *     <button onClick={() => toggleExactMatch()}>Toggle Exact Match</button>
 *     <button onClick={resetAll}>Reset All</button>
 *     
 *     <ProductList products={processedData} />
 *   </>
 * );
 * ```
 */

export function useAdvancedDataProcessing<T>({
  initialData,
  filterConfig,
  defaultSort = [],
  defaultSearch = { fields: [], query: '' },
  defaultCaseSensitive = false,
  defaultExactMatch = false
}: UseAdvancedDataProcessingProps<T>) {
  // State management for all data processing aspects
  const [data, setData] = useState<T[]>(initialData); // Original data
  const [filters, setFilters] = useState<Record<string, any>>({}); // Current filter values
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort); // Current sort configuration
  const [searchConfig, setSearchConfig] = useState<SearchConfig>({ // Current search configuration
    ...defaultSearch,
    caseSensitive: defaultCaseSensitive,
    exactMatch: defaultExactMatch
  });
  
  // Search behavior toggles
  const [caseSensitive, setCaseSensitive] = useState(defaultCaseSensitive);
  const [exactMatch, setExactMatch] = useState(defaultExactMatch);

  /**
   * Memoized data processing pipeline:
   * 1. Apply filters
   * 2. Apply search (with current case sensitivity and exact match settings)
   * 3. Apply sorting
   * Only recalculates when dependencies change
   */
  const processedData = useMemo(() => {
    // Step 1: Filter the data based on current filter values
    const filteredData = new FilterManager().applyFilters(data, filters, filterConfig);
    
    // Step 2: Search within filtered results
    const searchedData = DataSearcher.search(filteredData, {
      ...searchConfig,
      caseSensitive,
      exactMatch
    });
    
    // Step 3: Sort the final results
    return DataSorter.sort(searchedData, sortConfig);
  }, [data, filters, filterConfig, sortConfig, searchConfig, caseSensitive, exactMatch]);

  //#region Control Functions

  /**
   * Updates a specific filter value
   * @param filterId - The ID of the filter to update
   * @param value - The new value for the filter
   */
  const updateFilter = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
  };

  /**
   * Updates the sort configuration for a specific field
   * @param field - The field to sort by
   * @param direction - The sort direction ('asc' or 'desc')
   */
  // In your useAdvancedDataProcessing hook, update the updateSort function:
  const updateSort = (field: string, direction: 'asc' | 'desc' | 'none') => {
    setSortConfig(prev => {
      if (direction === 'none') {
        // Remove the sort for this field
        return prev.filter(s => s.field !== field);
      }

      // Check if this field is already in the sort configuration
      const existingIndex = prev.findIndex(s => s.field === field);
      if (existingIndex >= 0) {
        // Update existing sort entry
        const updated = [...prev];
        updated[existingIndex] = { field, direction };
        return updated;
      }
      // Add new sort entry
      return [...prev, { field, direction }];
    });
  };

  /** Toggles case sensitivity for text search */
  const toggleCaseSensitive = () => setCaseSensitive(prev => !prev);

  /** Toggles exact match mode for text search */
  const toggleExactMatch = () => setExactMatch(prev => !prev);

  /** Resets all filters, sorting, and search to their default states */
  const resetAll = () => {
    setFilters({});
    setSortConfig(defaultSort);
    setSearchConfig({
      ...defaultSearch,
      caseSensitive: defaultCaseSensitive,
      exactMatch: defaultExactMatch
    });
    setCaseSensitive(defaultCaseSensitive);
    setExactMatch(defaultExactMatch);
  };

  //#endregion

  return {
    // Processed Data
    processedData, // The final filtered, searched, and sorted data array
    
    // State Values
    filters, // Current filter values
    sortConfig, // Current sort configuration
    searchConfig, // Current search configuration (excluding behavior toggles)
    caseSensitive, // Current case sensitivity setting
    exactMatch, // Current exact match setting
    
    // Control Functions
    updateFilter, // Function to update a specific filter
    updateSort, // Function to update sorting
    setSearchConfig, // Function to update search configuration
    setData, // Function to update the base data
    toggleCaseSensitive, // Function to toggle case sensitivity
    toggleExactMatch, // Function to toggle exact match
    resetAll, // Function to reset all settings
    setSortConfig,
    // Metadata
    originalCount: data.length, // Count of original items
    filteredCount: processedData.length // Count after all processing
  };
}