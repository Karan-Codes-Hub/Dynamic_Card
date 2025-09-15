import React from 'react';
import { useState, useMemo, useRef } from 'react';
import { SearchBar, DownloadButton, FilterButton } from '../Icons';
import styles from '../generateCardView.module.css'
import { SortingModal } from '../modal/SortingModal';
import dayjs from 'dayjs';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { ResponsivePopoverModal } from '../modal/ResponsivePopoverModal';
import { DownloadDropdownModal } from '../modal/DownloadDropdownModal';
import { IconButton } from '@mui/material';
import { SearchBarComponent } from '../reusableComponent/SearchBarComponent';
import { useDownloadData } from '../customHooks/useDownloadData';
import { getCardViewOptions } from '../cardViewComponents/CardViewContext';
import useValuesForFunctionalitiesButtons from '../customHooks/useValuiesForFunctionalitiesButtons';
import FilterModal from "../modal/FilterModal";
import { Badge } from '@mui/material';
interface HeaderItem {
  id: string;
  component: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}
/**
 *@property {HeaderItem[]} customItems - Custom header items array (overrides default if provided)
 *@property {object} defaultItems - Which default items to show
 *@property {'left' | 'center' | 'right'} defaultAlignment - Default alignment for items
 *@property {(term: string) => void} onSearch - Callback when search is performed
 *@property {() => void} onSort - Callback when sort is clicked
 *@property {() => void} onDownload - Callback when download is clicked
 *@property {() => void} onFilter - Callback when filter is clicked 
 *@property {string} className - Additional class names for styling
 *@example
 *----------------basic usage
 *<CardViewHeader 
 *  onSearch={(term) => handleSearch(term)}
 *  onSort={handleSort}
 *  onDownload={handleDownload}         
 * />    
 * ----------------use custom items
 * <CardViewHeader
 *   customItems={[
 *     {
 *       id: 'download',
 *       component: <DownloadButton onClick={handleDownload} />,
 *       align: 'left'
 *     },
 *     {
 *       id: 'search',
 *       component: <SearchBar onSearch={handleSearch} />,
 *       align: 'right'
 *     },
 *     {
 *       id: 'custom-btn',
 *       component: <button onClick={customAction}>Custom</button>,
 *       align: 'center'
 *     }
 *   ]}         
 * />
 * ----------------important usuage
 * <CardViewHeader
 *   defaultItems={{ search: true, sort: false, download: true , filter: true }}
 *   defaultAlignment="right"
 *   customItems={[
 *     {
 *       id: 'filter',
 *       component: <FilterButton onClick={showFilters} />,
 *       align: 'left'
 *     }
 *   ]}
 *   onSearch={handleSearch}
 *   onDownload={handleDownload}         
 * />
*/
interface HeaderProps {
  /**
   * Callback fired when a search term is entered
   */
  onSearch?: (term: string) => void;

  /**
   * Callback fired when sorting is applied
   */
  onSort?: (newSortConfig: any) => void;

  /**
   * Callback fired when download is triggered
   */
  onDownload?: () => void;

  /**
   * Callback fired when filter is applied
   */
  onFilter?: (filters: Record<string, any>) => void;
}

const CardViewHeader: React.FC<HeaderProps> = ({
  onSearch,
  onSort,
  onDownload,
  onFilter,
}) => {
  const { options, customProperties } = getCardViewOptions();
  const headerCardView = options?.headerCardView || {}
  const dataItemDescriptions = options?.dataItemDescription || [];
  const { headerConfig, visible, title, style, customHeader, additionalActions, makeHeaderSticky } = headerCardView
  const { customItems, defaultItems, defaultAlignment, className } = headerConfig;
  const {search , sort, download, filter} = defaultItems;
  const { downloadCSV, downloadJSON, downloadExcel } = useDownloadData<any>();
  const downloadFileName = 'dummyData';
  const downloadColumns = ['name', 'price'];
  const defaultControlItems: HeaderItem[] = [];
  const [sortConfig, setSortConfig] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { sortingOptions, filterConfigurations } = useValuesForFunctionalitiesButtons(dataItemDescriptions);
  const renderedData = customProperties?.isDataProcessed
    ? customProperties?.useProcessedData?.processedData
    : options?.data;
  const downloadColumnsConfig = {
  ...(download?.allowedColumnsToDownload && {
    allowedColumnsToDownload: download.allowedColumnsToDownload,
  }),
  ...(download?.excludeColumnsFromDownload && {
    excludeColumnsFromDownload: download.excludeColumnsFromDownload,
  }),
};


  // Handle button actions
  const handleButtonClick = (buttonName: string, selectedFilters: Record<string, any>) => {
    if (buttonName === 'Apply') {
      onFilter?.(selectedFilters);
      // Perform filtering operation
     
    } else if (buttonName === 'Cancel') {
      onFilter?.(selectedFilters)
      // Handle cancel action
    } else if (buttonName === 'ClearAll') {
      onFilter?.({});
      // All filters are already cleared by the component
    }
    
  };
  // Memoize the search component to prevent remounting
  const searchBarComponent = useMemo(() => (
    <Box sx={{
      width: isMobile ? '100%' : 'auto',
      transition: 'all 0.3s ease',
    }}>
      <SearchBarComponent
        onSearch={(query) => 
        ( onSearch?.(query),
          console.log(query))}
        placeholder= {search?.placeholder || "Search..."}
        fullWidth={isMobile}
      />
    </Box>
  ), [isMobile]); // Only recreate when isMobile changes
  if (defaultItems?.search && search?.visible) {
    defaultControlItems.push({
      id: 'search',
      component: searchBarComponent,
      align: defaultAlignment
    });
  }

  if (defaultItems?.filter) {
    const filterButtonRef = useRef(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({});

    defaultControlItems.push({
      id: 'filter',
      component: (
        <>
          <Badge
            badgeContent={Object.keys(selectedFilters).length}
            color="primary"
            overlap="circular"
            invisible={Object.keys(selectedFilters).length === 0}
          >
            <IconButton
              ref={filterButtonRef}
              onClick={() => setShowFilterModal(prev => !prev)}
              sx={{
                color: Object.keys(selectedFilters).length > 0 ? 'primary.main' : 'tex.secondary',  
                transition: 'color 0.3s ease',
                position: 'relative',
                padding: '8px',
                '&:hover': {
                  color: 'primary.dark',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <FilterButton
                sx={{
                  fontSize: '16px',
                  color: Object.keys(selectedFilters).length > 0 ? 'primary.main' : 'inherit'
                }}
              />
            </IconButton>
          </Badge>
          <FilterModal
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            filterConfig={filterConfigurations}
            onChange={(filters, id, value) => {
              setSelectedFilters(filters);
            }}
            onClose={() => setShowFilterModal(false)}
            onButtonClick={(buttonName, selectedFilters) => {
              handleButtonClick(buttonName, selectedFilters);
              setShowFilterModal(false);
            }}
            open={showFilterModal}
            anchorEl={filterButtonRef.current}
          />
        </>
      ),
      align: defaultAlignment
    });
  }
  if (defaultItems?.sort && sort?.visible) {
    defaultControlItems.push({
      id: 'sort',
      component: (
        <>

          {sort?.visible && (
            <SortingModal
              //options={sortOptions}
              options={sortingOptions}
              value={sortConfig}
              onChange={(newSort) => {
                setSortConfig(newSort);

                onSort(newSort)
                console.log(newSort, "newSort");
              }}
              onClearSort={() => {
                // onSort?.(null);
                // setSortModalOpen(false);
              }}
              multiSort={sort?.multiSort}
            />
          )}
        </>
      ),
      align: defaultAlignment
    });
  }

  if (defaultItems?.download && download?.visible) {
    defaultControlItems.push({
      id: 'download',
      component: (
        <DownloadDropdownModal
          onDownload={(type) => {
            // your logic for download
            if (type === 'csv') downloadCSV(
              renderedData, 
              download?.nameForDownloadFile || downloadFileName, 
              // download?.allowedColumnsToDownload || downloadColumns,
              downloadColumnsConfig
             
            );
            else if (type === 'json') downloadJSON(
              renderedData,
              download?.nameForDownloadFile || downloadFileName,
              downloadColumnsConfig
            );
            else if (type === 'excel') downloadExcel(
              renderedData, 
              download?.nameForDownloadFile || downloadFileName,
              "sheet1", 
              downloadColumnsConfig
            );
          }}
          // to only send the value when it is defined
          {...(download?.allowedTypes ? { allowedTypes: download.allowedTypes } : {})}
        />
      ),
      align: defaultAlignment,
    });
  }


  // Merge with custom items if provided
  const headerItems = customItems ? [...customItems, ...defaultControlItems] : defaultControlItems;

  // Group items by alignment
  const groupedItems = headerItems.reduce((acc, item) => {
    const align = item.align || 'left';
    if (!acc[align]) acc[align] = [];
    acc[align].push(item.component);
    return acc;
  }, {} as Record<string, React.ReactNode[]>);
  return (
    <>
      {visible && (
        <header
          className={`${styles.cardViewHeader} ${className}`}
          style={{
            ...(makeHeaderSticky ? { position: "sticky", top: 0, zIndex: 10 } : {}),
            ...style, // merge custom style from headerCardView
          }}
        >
          {customHeader ? (
            <div className={styles.customHeader}>{customHeader}</div>
          ) : (
            <>
                <div className={`${styles.headerSection} ${styles.left}`}>
                  {groupedItems['left']?.map((item, index) => (
                    <div key={`left-${index}`} className={styles.headerItem}>
                      {item}
                    </div>
                  ))}
                </div>

              <div className={`${styles.headerSection} ${styles.center}`}>
                {groupedItems['center']?.map((item, index) => (
                  <div key={`center-${index}`} className={styles.headerItem}>
                    {item}
                  </div>
                ))}
              </div>

              <div className={`${styles.headerSection} ${styles.right}`}>
                {groupedItems['right']?.map((item, index) => (
                  <div key={`right-${index}`} className={styles.headerItem}>
                    {item}
                  </div>
                ))}
              </div>

            </>
          )}
        </header>
      )}
    </>

  );

};

export default CardViewHeader;
