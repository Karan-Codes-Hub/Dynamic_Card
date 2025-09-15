import { useState, useMemo } from 'react';

export interface UsePaginationProps {
  current?: number;           // Controlled current page (for controlled mode)
  defaultCurrent?: number;    // Default current page (for uncontrolled mode)
  pageSize?: number;          // Controlled page size (for controlled mode)
  defaultPageSize?: number;   // Default page size (for uncontrolled mode)
  total: number;              // Total number of items to paginate
  onChange?: (page: number, pageSize: number) => void;        // Callback when page changes
  onShowSizeChange?: (current: number, size: number) => void; // Callback when page size changes          // Callback to update current page
}

/**
 * A custom React hook for managing pagination state and logic
 * Supports both controlled and uncontrolled usage patterns
 * Provides comprehensive pagination functionality including:
 * - Page navigation
 * - Page size changes
 * - Quick jumping to specific pages
 * - Boundary navigation (first/last page)
 * - Range calculations for display purposes
 * 
 * @param props - Configuration object for pagination behavior
 * @returns Object containing pagination state and handler functions
 */
export const usePagination = (props: UsePaginationProps) => {
  const {
    current: controlledCurrent,
    defaultCurrent = 1,
    pageSize: controlledPageSize,
    defaultPageSize = 10,
    total,
    onChange,
    onShowSizeChange,
  } = props;

  // State for uncontrolled usage - maintains internal state when no controlled values are provided
  const [internalCurrent, setInternalCurrent] = useState(defaultCurrent);
  const [internalPageSize, setInternalPageSize] = useState(defaultPageSize);
  const [quickJumperValue, setQuickJumperValue] = useState<string>(''); // Input value for quick jump functionality
    
  // Determine if we're in controlled or uncontrolled mode
  // Controlled mode: parent component manages the state
  // Uncontrolled mode: hook manages the state internally
  const isCurrentControlled = controlledCurrent !== undefined;
  const isPageSizeControlled = controlledPageSize !== undefined;
    
  // Use controlled values if provided, otherwise use internal state
  // This allows the hook to work in both controlled and uncontrolled scenarios
  const current = isCurrentControlled ? controlledCurrent : internalCurrent;
  const pageSize = isPageSizeControlled ? controlledPageSize : internalPageSize;
    
  // Calculate total pages - memoized to prevent unnecessary recalculations
  const totalPages = useMemo(() => Math.ceil(total / pageSize), [total, pageSize]);
    
  /**
   * Handles page change events
   * @param page - The target page number to navigate to
   * @param newPageSize - Optional new page size (if changing both page and size)
   */
  const handleChange = (page: number, newPageSize?: number) => {
    console.log("handleChange", page, newPageSize, pageSize);
    const finalPageSize = newPageSize || pageSize;
    // Notify parent component of change if callback provided
    if (onChange) {
      onChange(page, finalPageSize);
    }
        
    // Only update internal state if we're in uncontrolled mode
    // Prevents double updates in controlled mode
    if (!isCurrentControlled) {
      console.log("handleChangeInternaal", page, newPageSize, pageSize,  newPageSize != pageSize);
      newPageSize != pageSize ? setInternalCurrent(1) : setInternalCurrent(page);
      // setInternalCurrent(page);
    }
        
    // If page size changed and we're in uncontrolled mode for pageSize
    // Update internal page size state
    if (newPageSize && newPageSize !== pageSize && !isPageSizeControlled) {
      setInternalPageSize(newPageSize);
    }
  };
    
  /**
   * Handles page size change events
   * Typically triggered by a page size selector component
   * @param currentPage - The current page before the size change
   * @param size - The new page size
   */
  const handleSizeChange = (currentPage: number, size: number) => {
    // Notify parent component of size change if callback provided
    if (onShowSizeChange) { 
      onShowSizeChange(currentPage, size);
    }
        
    // Only update internal state if we're in uncontrolled mode
    if (!isPageSizeControlled) {
      setInternalPageSize(size);
    }
        
    // Reset to first page when page size changes
    // This is standard pagination behavior to avoid empty pages
    handleChange(1, size);
  };
    
  /**
   * Handles direct page navigation via input or programmatic calls
   * Validates input and navigates to the specified page if valid
   * @param value - Page number as number, string, or null
   */
  const handleDirectJump = (value: number | string | null) => {
    const pageNum = typeof value === 'string' ? parseInt(value, 10) : value;
    
    // Validate page number is within valid range
    if (pageNum && pageNum >= 1 && pageNum <= totalPages) {
      handleChange(pageNum, pageSize);
      setQuickJumperValue(''); // Clear input after successful jump
    }
  };
    
  // Convenience functions for boundary navigation
  const handleJumpToStart = () => handleChange(1, pageSize);     // Navigate to first page
  const handleJumpToEnd = () => handleChange(totalPages, pageSize); // Navigate to last page
    
  /**
   * Handles quick jumper input changes
   * Updates the input value state as user types
   * @param e - React change event from input element
   */
  const handleQuickJumperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickJumperValue(e.target.value);
  };
    
  /**
   * Handles Enter key press in quick jumper input
   * Triggers navigation to the specified page
   */
  const handleQuickJumperPressEnter = () => {
    handleDirectJump(quickJumperValue);
  };

  // Calculate the range of items currently being displayed
  // Useful for showing "Showing 1-10 of 100 items" type messages
  const startItem = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);
  console.log(current, "current")
  // Return all state and handlers for consumption by components
  return {
    // State values
    current,                   // Current active page number
    pageSize,                  // Number of items per page
    totalPages,                // Total number of pages available
    quickJumperValue,          // Current value in quick jump input
    startItem,                 // First item number in current page
    endItem,                   // Last item number in current page
    isCurrentControlled,       // Flag indicating if current page is controlled
    isPageSizeControlled,      // Flag indicating if page size is controlled
        
    // Handler functions
    handleChange,              // General page change handler
    handleSizeChange,          // Page size change handler
    handleDirectJump,          // Direct page navigation handler
    handleJumpToStart,         // Navigate to first page
    handleJumpToEnd,           // Navigate to last page
    handleQuickJumperChange,   // Quick jump input change handler
    handleQuickJumperPressEnter, // Quick jump submit handler
        
    // Setters (for external control when needed)
    setQuickJumperValue,       // Programmatically set quick jump value
  };
};