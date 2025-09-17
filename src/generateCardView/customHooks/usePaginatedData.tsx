import { useMemo } from 'react';
import { usePagination } from './usePagination'; 
import type { UsePaginationProps } from './usePagination';
/**
 * Interface for usePaginatedData hook configuration
 * Extends UsePaginationProps and adds data-specific properties
 */
interface UsePaginatedDataProps<T> extends UsePaginationProps {
  data: T[];                    // The complete dataset to be paginated
  initialData?: T[];            // Initial data (optional, falls back to data)
}

/**
 * Interface for the return value of usePaginatedData hook
 */
interface UsePaginatedDataReturn<T> {
  paginatedData: T[];           // Data for the current page
  pagination: ReturnType<typeof usePagination>; // Pagination state and handlers
  total: number;                // Total number of items in the dataset
  isEmpty: boolean;             // Whether the dataset is empty
  hasData: boolean;             // Whether there is data to display
  currentPageData: T[];         // Alias for paginatedData
  updatePage: Function;
  updatePageSize: Function;
}

/**
 * A custom React hook that paginates an array of data
 * Works seamlessly with the usePagination hook to provide complete pagination functionality
 * 
 * @template T - The type of data being paginated
 * @param props - Configuration object for pagination and data
 * @returns Object containing paginated data and pagination utilities
 * 
 * @example
 * const { paginatedData, pagination, total, isEmpty } = usePaginatedData({
 *   data: users,
 *   total: users.length,
 *   defaultPageSize: 10,
 *   defaultCurrent: 1
 * });
 */
export const usePaginatedData = <T,>(props: UsePaginatedDataProps<T>): UsePaginatedDataReturn<T> => {
  const {
    data,
    initialData = [],
    total: propTotal,
    ...paginationProps
  } = props;

  // Use the provided total or calculate from data length
  // This allows using a subset of data while knowing the total available
  const total = propTotal !== undefined ? propTotal : data.length;

  // Initialize pagination hook with provided props
  // This handles all pagination state and logic
  const pagination = usePagination({
    ...paginationProps,
    total, // Pass the calculated total to pagination
  });

  // Memoize the paginated data to prevent unnecessary recalculations
  // Only recalculates when data, current page, or page size changes
  const paginatedData = useMemo(() => {
    // Return empty array if no data or invalid pagination state
    if (!data || data.length === 0 || pagination.current < 1 || pagination.pageSize < 1) {
      return [];
    }

    // Calculate start and end indices for the current page
    const startIndex = (pagination.current - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;

    // Return the slice of data for the current page
    // Uses slice() for safe array operations
    return data.slice(startIndex, endIndex);
  }, [data, pagination.current, pagination.pageSize]);

  // Helper boolean to check if dataset is empty
  const isEmpty = useMemo(() => data.length === 0, [data.length]);

  // Helper boolean to check if there is data to display
  const hasData = useMemo(() => !isEmpty && paginatedData.length > 0, [isEmpty, paginatedData.length]);

  const updatePage = (page: number) => {
    pagination.handleChange(page, pagination.pageSize);
  };
  const updatePageSize = (size: number) => {
    pagination.handleSizeChange(pagination.current, size);
  };
  console.log(pagination, "paginationINnnnn");
  return {
    paginatedData,          // The data to display on the current page
    pagination,             // All pagination state and handler functions
    total,                  // Total number of items in the dataset
    isEmpty,                // Whether the dataset is completely empty
    hasData,                // Whether there is data on the current page
    currentPageData: paginatedData, // Alias for paginatedData for convenience
    updatePage,
    updatePageSize
  };
};

/**
 * Alternative hook for server-side pagination scenarios
 * Use when data is fetched page by page from an API
 * 
 * @template T - The type of data being paginated
 * @param props - Configuration for server-side pagination
 * @returns Object containing current page data and pagination utilities
 */
export const useServerPaginatedData = <T,>(props: UsePaginatedDataProps<T>): UsePaginatedDataReturn<T> => {
  const {
    data, // This should be the data for the current page when using server-side pagination
    initialData = [],
    total: propTotal,
    ...paginationProps
  } = props;

  // For server-side pagination, total comes from the server response
  const total = propTotal !== undefined ? propTotal : 0;

  // Initialize pagination for server-side scenario
  const pagination = usePagination({
    ...paginationProps,
    total,
  });

  // In server-side pagination, the data prop should already be the current page's data
  const paginatedData = data || initialData;

  const isEmpty = useMemo(() => paginatedData.length === 0, [paginatedData.length]);
  const hasData = useMemo(() => !isEmpty, [isEmpty]);
  
  const updatePage = (page: number) => {
    pagination.handleChange(page, pagination.pageSize);
  };

  const updatePageSize = (size: number) => {
    pagination.handleSizeChange(pagination.current, size);
  };
  return {
    paginatedData,
    pagination,
    total,
    isEmpty,
    hasData,
    currentPageData: paginatedData,
    updatePage,
    updatePageSize
  };
};

/**
 * Hook for paginating data with filtering capabilities
 * Useful when you need to filter data before paginating
 * 
 * @template T - The type of data being paginated
 * @param props - Configuration including filter function
 * @returns Object containing filtered and paginated data
 */
interface UseFilteredPaginatedDataProps<T> extends UsePaginatedDataProps<T> {
  filterFn?: (item: T) => boolean; // Filter function to apply before pagination
}

export const useFilteredPaginatedData = <T,>(
  props: UseFilteredPaginatedDataProps<T>
): UsePaginatedDataReturn<T> & { filteredData: T[]; filteredTotal: number } => {
  const {
    data,
    filterFn,
    ...paginationProps
  } = props;

  // Apply filter function to data if provided
  const filteredData = useMemo(() => {
    if (!filterFn) return data;
    return data.filter(filterFn);
  }, [data, filterFn]);

  const filteredTotal = filteredData.length;

  // Use the main pagination hook with filtered data
  const paginationResult = usePaginatedData({
    ...paginationProps,
    data: filteredData,
    total: filteredTotal,
  });

  return {
    ...paginationResult,
    filteredData,     // The complete filtered dataset (before pagination)
    filteredTotal,    // Total number of items after filtering
  };
};