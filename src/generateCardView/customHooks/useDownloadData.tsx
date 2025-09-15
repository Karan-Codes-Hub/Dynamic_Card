import { useCallback } from 'react';
import * as XLSX from 'xlsx';

/**
 * Hook for downloading data in various formats with column selection support
 * @template T - Type of the data items (must extend Record<string, any>)
 * 
 * @example
 * ```tsx
 * import { useDownloadData } from "./useDownloadData";
 * 
 * interface Product {
 *   id: string;
 *   name: string;
 *   price: number;
 *   stock: number;
 *   category: string;
 * }
 * 
 * const products: Product[] = [
 *   { id: "1", name: "Laptop", price: 999, stock: 10, category: "Electronics" },
 *   { id: "2", name: "Phone", price: 499, stock: 20, category: "Electronics" },
 * ];
 * 
 * export function DownloadExample() {
 *   const { downloadCSV, downloadJSON, downloadExcel } = useDownloadData<Product>();
 * 
 *   // Columns to include in downloads
 *   const basicColumns = ['name', 'price', 'stock'];
 *   const allColumns = ['id', 'name', 'price', 'stock', 'category'];
 * 
 *   return (
 *     <div className="export-buttons">
 *       <button 
 *         onClick={() => downloadCSV(
 *           products, 
 *           'products', 
 *           { allowedColumnsToDownload: basicColumns }
 *         )}
 *         title="Export name, price and stock as CSV"
 *       >
 *         Download Basic CSV
 *       </button>
 *       
 *       <button 
 *         onClick={() => downloadJSON(
 *           products, 
 *           'products-full', 
 *           { excludeColumnsFromDownload: ['id'] }
 *         )}
 *         title="Export all data except ID as JSON"
 *       >
 *         Download JSON (No ID)
 *       </button>
 *       
 *       <button 
 *         onClick={() => downloadExcel(
 *           products, 
 *           'products-report', 
 *           'Inventory',
 *           { allowedColumnsToDownload: ['name', 'category', 'stock'] }
 *         )}
 *         title="Export inventory report as Excel"
 *       >
 *         Download Excel Report
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useDownloadData<T extends Record<string, any>>() {
    /**
     * Internal function to determine which columns to include based on allowed and excluded columns
     * @param {string[]} allColumns - All available columns from the data
     * @param {string[]} [allowedColumns] - Optional allowed columns to include
     * @param {string[]} [excludedColumns] - Optional columns to exclude
     * @returns {string[]} Final array of columns to include
     */
    const determineColumnsToInclude = useCallback((
        allColumns: string[],
        allowedColumns?: string[],
        excludedColumns?: string[]
    ): string[] => {
        // If allowedColumns is provided, use only those columns (and filter out any excluded ones)
        if (allowedColumns && allowedColumns.length > 0) {
            return allowedColumns.filter(col => !excludedColumns?.includes(col));
        }
        
        // If no allowedColumns but excludedColumns is provided, exclude those columns
        if (excludedColumns && excludedColumns.length > 0) {
            return allColumns.filter(col => !excludedColumns.includes(col));
        }
        
        // If neither is provided, return all columns
        return allColumns;
    }, []);

    /**
     * Internal function to filter data columns
     * @param {T[]} data - Original data
     * @param {string[]} [allowedColumns] - Optional allowed columns to include
     * @param {string[]} [excludedColumns] - Optional columns to exclude
     * @returns {Record<string, any>[]} Filtered data
     */
    const filterColumns = useCallback((
        data: T[], 
        allowedColumns?: string[], 
        excludedColumns?: string[]
    ): Record<string, any>[] => {
        if (!data.length) return [];
        
        // Get all available columns from the first data item
        const allColumns = Object.keys(data[0]);
        
        // Determine which columns to include
        const columnsToInclude = determineColumnsToInclude(allColumns, allowedColumns, excludedColumns);
        
        // If no columns to include after filtering, return empty array
        if (columnsToInclude.length === 0) {
            console.warn('No columns to include after filtering. Check your allowedColumnsToDownload and excludeColumnsFromDownload settings.');
            return [];
        }

        return data.map(row => {
            const filteredRow: Record<string, any> = {};
            columnsToInclude.forEach(col => {
                filteredRow[col] = row[col];
            });
            return filteredRow;
        });
    }, [determineColumnsToInclude]);

    /**
     * Internal helper to trigger file download
     * @param {Blob} blob - File content as Blob
     * @param {string} filename - Full filename with extension
     */
    const downloadFile = useCallback((blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    /**
     * Download options interface
     */
    interface DownloadOptions {
        allowedColumnsToDownload?: string[];
        excludeColumnsFromDownload?: string[];
    }

    /**
     * Download data as CSV file
     * @param {T[]} data - Array of data to download
     * @param {string} filename - Name of the file (without extension)
     * @param {DownloadOptions} [options] - Optional download configuration
     */
    const downloadCSV = useCallback((
        data: T[], 
        filename: string, 
        options?: DownloadOptions
    ) => {
        try {
            // Filter columns based on options
            const filteredData = filterColumns(
                data, 
                options?.allowedColumnsToDownload, 
                options?.excludeColumnsFromDownload
            );

            // Check if we have data after filtering
            if (filteredData.length === 0) {
                console.warn('No data to download after column filtering');
                return;
            }

            // Convert to CSV
            const headers = Object.keys(filteredData[0]);
            const csvRows = [
                headers.join(','), // Header row
                ...filteredData.map(row =>
                    headers.map(fieldName =>
                        `"${String(row[fieldName] ?? '').replace(/"/g, '""')}"`
                    ).join(',')
                )
            ];

            // Create download
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            downloadFile(blob, `${filename}.csv`);
        } catch (error) {
            console.error('Error generating CSV:', error);
            throw error;
        }
    }, [filterColumns, downloadFile]);

    /**
     * Download data as JSON file
     * @param {T[]} data - Array of data to download
     * @param {string} filename - Name of the file (without extension)
     * @param {DownloadOptions} [options] - Optional download configuration
     */
    const downloadJSON = useCallback((
        data: T[], 
        filename: string, 
        options?: DownloadOptions
    ) => {
        try {
            const filteredData = filterColumns(
                data, 
                options?.allowedColumnsToDownload, 
                options?.excludeColumnsFromDownload
            );

            // Check if we have data after filtering
            if (filteredData.length === 0) {
                console.warn('No data to download after column filtering');
                return;
            }

            const jsonContent = JSON.stringify(filteredData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json' });
            downloadFile(blob, `${filename}.json`);
        } catch (error) {
            console.error('Error generating JSON:', error);
            throw error;
        }
    }, [filterColumns, downloadFile]);

    /**
     * Download data as Excel file (XLSX)
     * @param {T[]} data - Array of data to download
     * @param {string} filename - Name of the file (without extension)
     * @param {string} [sheetName='Data'] - Name of the worksheet
     * @param {DownloadOptions} [options] - Optional download configuration
     */
    const downloadExcel = useCallback((
        data: T[],
        filename: string,
        sheetName = 'Data',
        options?: DownloadOptions
    ) => {
        try {
            // Filter columns based on options
            const filteredData = filterColumns(
                data, 
                options?.allowedColumnsToDownload, 
                options?.excludeColumnsFromDownload
            );

            // Check if we have data after filtering
            if (filteredData.length === 0) {
                console.warn('No data to download after column filtering');
                return;
            }

            // Convert data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(filteredData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

            // Generate and download
            XLSX.writeFile(workbook, `${filename}.xlsx`, {
                bookType: 'xlsx',
                type: 'array'
            });
        } catch (error) {
            console.error('Error generating Excel:', error);
            throw error;
        }
    }, [filterColumns]);

    return {
        downloadCSV,
        downloadJSON,
        downloadExcel
    };
}