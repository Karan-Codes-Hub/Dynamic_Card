import { useMemo, useState } from "react";
import type  { PaginationConfig, DataItem } from "../InterfacesForCardView";

/**
 * Hook to paginate an array of data items based on user-defined config.
 *
 * @param data - The full dataset to be paginated.
 * @param config - Pagination configuration object (itemsPerPage, enabled).
 * @returns Paginated data, current page state, and handlers for page navigation.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useCardPagination } from './hooks/useCardPagination';
 * import { Button } from 'antd';
 * 
 * const data = Array.from({ length: 50 }, (_, i) => ({
 *   id: i + 1,
 *   name: `Item ${i + 1}`
 * }));
 * 
 * const config = {
 *   itemsPerPage: 8,
 *   enabled: true
 * };
 * 
 * const PaginatedList = () => {
 *   const {
 *     paginatedData,
 *     currentPage,
 *     totalPages,
 *     nextPage,
 *     prevPage,
 *     goToPage
 *   } = useCardPagination(data, config);
 * 
 *   return (
 *     <div>
 *       <ul>
 *         {paginatedData.map(item => (
 *           <li key={item.id}>{item.name}</li>
 *         ))}
 *       </ul>
 *       <div style={{ marginTop: 16 }}>
 *         <Button onClick={prevPage} disabled={currentPage === 1}>Previous</Button>
 *         <span style={{ margin: '0 12px' }}>
 *           Page {currentPage} of {totalPages}
 *         </span>
 *         <Button onClick={nextPage} disabled={currentPage === totalPages}>Next</Button>
 *       </div>
 *     </div>
 *   );
 * };
 * ```
 */
export function useCardPagination(data: DataItem[], config: PaginationConfig) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = config.itemsPerPage || 10;

  const paginatedData = useMemo(() => {
    if (!config.enabled) return data;

    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage, config.enabled]);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  return {
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    nextPage: () => setCurrentPage(prev => Math.min(prev + 1, totalPages)),
    prevPage: () => setCurrentPage(prev => Math.max(prev - 1, 1))
  };
}
