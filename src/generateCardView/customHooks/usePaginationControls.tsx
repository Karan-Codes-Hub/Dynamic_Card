import { useCallback, useMemo } from 'react';

/**
 * A custom hook that provides comprehensive pagination controls and utilities
 * @param {Object} returnedPaginatedData - The pagination data object returned from a data fetching hook
 * @returns {Object} An object containing pagination control functions and state information
 */
export const usePaginationControls = (returnedPaginatedData) => {
  // Extract pagination object from the returned data
  const { updatePage, updatePageSize, pagination } = returnedPaginatedData;
  
  // Destructure pagination methods for easier access
  const {

    handleChange,
    handleSizeChange,
    handleDirectJump,
    handleJumpToStart,
    handleJumpToEnd,
    handleQuickJumperPressEnter,
    setQuickJumperValue,
  } = pagination;

  /**
   * Navigates to a specific page if it's within valid bounds
   * @param {number} pageNumber - The page number to navigate to
   */
  const goToPage = useCallback((pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      handleDirectJump(pageNumber);
      updatePage(pageNumber);
      
    }
  }, [handleDirectJump, pagination.totalPages]);

  /**
   * Changes the number of items displayed per page
   * @param {number} size - The new page size (must be positive)
   */
  const setPageSize = useCallback((size) => {
    if (size > 0) {
      handleSizeChange(size);
    }
  }, [handleSizeChange]);

  /**
   * Navigates to the next page if not already on the last page
   */
  const nextPage = useCallback(() => {
     console.log("nextPage", pagination.current, pagination.totalPages, pagination.current < pagination.totalPages);
    if (pagination.current < pagination.totalPages) {
      handleChange(pagination.current + 1, pagination.pageSize);
    }
  }, [handleChange, pagination.current, pagination.totalPages]);

  /**
   * Navigates to the previous page if not already on the first page
   */
  const previousPage = useCallback(() => {
    if (pagination.current > 1) {
      handleChange(pagination.current - 1);
    }
  }, [handleChange, pagination.current]);

  /**
   * Jumps to the first page
   */
  const goToFirstPage = useCallback(() => {
    handleJumpToStart();
  }, [handleJumpToStart]);

  /**
   * Jumps to the last page
   */
  const goToLastPage = useCallback(() => {
    handleJumpToEnd();
  }, [handleJumpToEnd]);

  /**
   * Checks if the current page is the first page
   * @returns {boolean} True if current page is the first page
   */
  const isFirstPage = useCallback(() => {
    return pagination.current === 1;
  }, [pagination.current]);

  /**
   * Checks if the current page is the last page
   * @returns {boolean} True if current page is the last page
   */
  const isLastPage = useCallback(() => {
    return pagination.current === pagination.totalPages;
  }, [pagination.current, pagination.totalPages]);

  /**
   * Returns the current pagination state with useful derived values
   * @returns {Object} Pagination state object containing:
   *   - current: Current page number
   *   - pageSize: Number of items per page
   *   - totalPages: Total number of pages
   *   - totalItems: Total number of items across all pages
   *   - hasNext: Whether there's a next page
   *   - hasPrevious: Whether there's a previous page
   *   - startIndex: The starting index of items on the current page
   *   - endIndex: The ending index of items on the current page
   */
  const getPaginationState = useCallback(() => {
    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
      totalItems: pagination.total,
      hasNext: pagination.current < pagination.totalPages,
      hasPrevious: pagination.current > 1,
      startIndex: (pagination.current - 1) * pagination.pageSize + 1,
      endIndex: Math.min(pagination.current * pagination.pageSize, pagination.total)
    };
  }, [pagination]);

  /**
   * Generates an array of page numbers around the current page
   * @param {number} range - Number of pages to show on each side of current page (default: 3)
   * @returns {Array} Array of page numbers in the specified range
   */
  const getPageRange = useCallback((range = 3) => {
    const current = pagination.current;
    const total = pagination.totalPages;
    const start = Math.max(1, current - range);
    const end = Math.min(total, current + range);
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination.current, pagination.totalPages]);

  /**
   * Resets pagination to the first page
   */
  const resetToFirstPage = useCallback(() => {
    goToFirstPage();
  }, [goToFirstPage]);

  /**
   * Quickly jumps to a specific page using the quick jumper input
   * @param {string|number} pageNumber - The page number to jump to
   */
  const quickJumpToPage = useCallback((pageNumber) => {
    const page = parseInt(pageNumber);
    if (!isNaN(page) && page >= 1 && page <= pagination.totalPages) {
      setQuickJumperValue(page.toString());
      handleQuickJumperPressEnter();
    }
  }, [setQuickJumperValue, handleQuickJumperPressEnter, pagination.totalPages]);

  // Return all pagination controls and current state
  return {
    // Navigation functions
    goToPage,
    setPageSize,
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
    
    // Current state values (for convenience)
    currentPage: pagination.current,
    pageSize: pagination.pageSize,
    totalPages: pagination.totalPages,
    totalItems: pagination.total,
  };
};  