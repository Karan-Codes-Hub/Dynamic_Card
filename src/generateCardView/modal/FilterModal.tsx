import { useState, useMemo, useEffect, useRef } from "react";
import dayjs from "dayjs";
import { Checkbox, FormControlLabel, useMediaQuery, useTheme, Chip, IconButton, Collapse } from "@mui/material";
import { 
  Close as CloseIcon, 
  FilterList as FilterIcon, 
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import DisplayDatePicker from "../reusableComponent/DisplayDatePicker";
import TextInputField from "../reusableComponent/TextInputField";
import SelectField from "../reusableComponent/SelectField";
import MultipleSelectField from "../reusableComponent/MultipleSelectField";
import "./modalStyling/FilterModal.scss";

/**
 * Interface defining the structure of a filter configuration
 */
export interface Filter {
  id: string;
  name: string;
  type: 'text' | 'date' | 'select' | 'range' | 'checkbox';
  allowedDateRange?: { start: string; end: string };
  values?: string[];
  singleSelect?: boolean;
  conditions?: string[];
  isRange?: boolean;
}

/**
 * Expected format for FilterHandler
 */
interface FilterValue {
  condition?: string;
  value: any;
}

/**
 * Props for the FilterComponent
 */
interface FilterModalProps {
  selectedFilters: any;
  setSelectedFilters: (value: any) => void;
  filterConfig: Filter[];
  onChange: (filters: Record<string, FilterValue>, id: string, value: FilterValue | null) => void;
  onClose: () => void;
  onButtonClick: (buttonName: string, selectedFilters: Record<string, FilterValue>) => void;
  anchorEl?: any;
  open: boolean;
}

/**
 * A comprehensive filter component that supports multiple filter types
 */
const FilterModal: React.FC<FilterModalProps> = ({
  selectedFilters,
  setSelectedFilters,
  filterConfig,
  onChange,
  onClose,
  onButtonClick,
  anchorEl,
  open
}) => {
  const [activeFilterId, setActiveFilterId] = useState<string>(filterConfig[0]?.id || "");
  const [searchTerms, setSearchTerms] = useState<Record<string, string>>({});
  const [dropdownConditions, setDropdownConditions] = useState<Record<string, string>>({});
  const [dropdownInputs, setDropdownInputs] = useState<Record<string, string>>({});
  const [showActiveFilters, setShowActiveFilters] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get the currently active filter
  const activeFilter = useMemo(() => 
    filterConfig.find(filter => filter.id === activeFilterId),
    [filterConfig, activeFilterId]
  );

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Calculate position for desktop dropdown
  const getModalPosition = () => {
    if (!anchorEl || isMobile) return {};
    
    const rect = anchorEl.getBoundingClientRect();
    return {
      position: 'absolute' as const,
      top: rect.bottom + 8,
      left: rect.left,
      minWidth: rect.width
    };
  };

  // Count active filters for each category
  const getActiveFilterCount = (filterId: string) => {
    const filterValue = selectedFilters[filterId];
    if (!filterValue) return 0;

    const filterType = filterConfig.find(f => f.id === filterId)?.type;
    
    switch (filterType) {
      case 'checkbox':
        return Array.isArray(filterValue.value) ? filterValue.value.length : 0;
      case 'select':
      case 'range':
        return filterValue.value && filterValue.value.length > 0 ? 1 : 0;
      case 'date':
        if (filterConfig.find(f => f.id === filterId)?.isRange) {
          return (filterValue.value?.start || filterValue.value?.end) ? 1 : 0;
        }
        return filterValue.value ? 1 : 0;
      default:
        return filterValue.value ? 1 : 0;
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  /**
   * Handles checkbox selection changes
   */
  const handleCheckboxChange = (filterId: string, value: string, isSingleSelect: boolean) => {
setSelectedFilters((prev: Record<string, FilterValue>) => {
  const updated = { ...prev };
      
      if (isSingleSelect) {
        updated[filterId] = { value: [value] };
      } else {
        const currentValues = updated[filterId]?.value || [];
        const valueArray = Array.isArray(currentValues) ? currentValues : [];
        
        if (valueArray.includes(value)) {
          updated[filterId] = { 
            value: valueArray.filter(v => v !== value),
            condition: updated[filterId]?.condition 
          };
        } else {
          updated[filterId] = { 
            value: [...valueArray, value],
            condition: updated[filterId]?.condition 
          };
        }
        
        if (updated[filterId].value.length === 0) {
          delete updated[filterId];
        }
      }
      
      onChange(updated, filterId, updated[filterId] || null);
      return updated;
    });
  };

  /**
   * Handles date selection changes
   */
  const handleDateChange = (filterId: string, value: Date | null) => {
    const formattedDate = value ? dayjs(value).format("YYYY-MM-DD") : null;
    const updated = { 
      ...selectedFilters, 
      [filterId]: { value: formattedDate } 
    };
    setSelectedFilters(updated);
    onChange(updated, filterId, updated[filterId]);
  };

  /**
   * Handles date range selection changes
   */
  const handleDateRangeChange = (filterId: string, type: 'start' | 'end', value: Date | null) => {
    const formatted = value ? dayjs(value).format("YYYY-MM-DD") : null;
    const prev = selectedFilters[filterId]?.value || {};
    const updated = {
      ...selectedFilters,
      [filterId]: { 
        value: { ...prev, [type]: formatted } 
      },
    };
    setSelectedFilters(updated);
    onChange(updated, filterId, updated[filterId]);
  };

  /**
   * Handles dropdown selection changes
   */
  const handleDropdownChange = (
    filterId: string,
    condition: string,
    inputValue: string | string[]
  ) => {
    const updatedValue: FilterValue = {
      condition,
      value: inputValue
    };

    const updated = { ...selectedFilters, [filterId]: updatedValue };
    setSelectedFilters(updated);
    onChange(updated, filterId, updatedValue);
  };

  /**
   * Handles text input changes
   */
  const handleTextInputChange = (filterId: string, value: string) => {
    const condition = selectedFilters[filterId]?.condition || 'contains';
    const updatedValue: FilterValue = {
      condition,
      value
    };

    const updated = { ...selectedFilters, [filterId]: updatedValue };
    setSelectedFilters(updated);
    onChange(updated, filterId, updatedValue);
  };

  /**
   * Handler for Apply button
   */
  const handleApply = () => onButtonClick("Apply", selectedFilters);

  /**
   * Handler for Cancel button (clears current filter)
   */
  const handleCancel = () => {
    if (activeFilterId) {
      const updated = { ...selectedFilters };
      delete updated[activeFilterId];
      setSelectedFilters(updated);
      onChange(updated, activeFilterId, null);
    }
    onButtonClick("Cancel", selectedFilters);
  };

  /**
   * Handler for Clear All button (clears all filters)
   */
  const handleClearAll = () => {
    setSelectedFilters({});
    setSearchTerms({});
    setDropdownConditions({});
    setDropdownInputs({});
    onChange({}, "", null);
    onButtonClick("ClearAll", selectedFilters);
  };

  /**
   * Renders the appropriate filter input based on the filter type
   */
  const renderFilterInput = (filter: Filter) => {
    const selectedValue = selectedFilters[filter.id];
    const condition = dropdownConditions[filter.id] || selectedValue?.condition || "";
    const inputValue = dropdownInputs[filter.id] || selectedValue?.value || "";
    const searchTerm = searchTerms[filter.id] || "";

    switch (filter.type) {
      case "text":
        return (
          <div className="text-filter-container">
            <SelectField
              name={`${filter.id}-condition`}
              value={condition}
              handleChange={(name, val) => {
                setDropdownConditions(prev => ({ ...prev, [filter.id]: val }));
                handleTextInputChange(filter.id, selectedValue?.value || "");
              }}
              label="Condition"
              options={[
                { value: 'contains', label: 'Contains' },
                { value: 'equals', label: 'Equals' },
                { value: 'not equals', label: 'Not Equals' },
                { value: 'starts with', label: 'Starts With' },
                { value: 'ends with', label: 'Ends With' },
                { value: 'is empty', label: 'Is Empty' },
                { value: 'is not empty', label: 'Is Not Empty' }
              ]}
              placeholder="Select Condition"
            />
            <TextInputField
              id={filter.id}
              value={selectedValue?.value || ""}
              onChange={(e) => handleTextInputChange(filter.id, e.target.value)}
              placeholder={`Enter ${filter.name.toLowerCase()}`}
              label={filter.name}
              type="text"
            />
          </div>
        );

      case "date":
        return filter.isRange ? (
          <div className="date-range-container">
            <div className="date-picker-group">
              <label htmlFor={`${filter.id}-start`} className="form-label">Start Date</label>
              <DisplayDatePicker
                id={`${filter.id}-start`}
                value={selectedValue?.value?.start ? new Date(selectedValue.value.start) : null}
                onChange={(date) => handleDateRangeChange(filter.id, "start", date)}
                minDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.start) : undefined}
                maxDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.end) : undefined}
                dateFormat="yyyy-MM-dd"
                placeholder="Select Start Date"
              />
            </div>
            <div className="date-picker-group">
              <label htmlFor={`${filter.id}-end`} className="form-label">End Date</label>
              <DisplayDatePicker
                id={`${filter.id}-end`}
                value={selectedValue?.value?.end ? new Date(selectedValue.value.end) : null}
                onChange={(date) => handleDateRangeChange(filter.id, "end", date)}
                minDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.start) : undefined}
                maxDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.end) : undefined}
                dateFormat="yyyy-MM-dd"
                placeholder="Select End Date"
              />
            </div>
          </div>
        ) : (
          <div className="date-picker-group">
            <label htmlFor={`${filter.id}-date`} className="form-label">Select Date</label>
            <DisplayDatePicker
              id={`${filter.id}-date`}
              value={selectedValue?.value ? new Date(selectedValue.value) : null}
              onChange={(date) => handleDateChange(filter.id, date)}
              minDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.start) : undefined}
              maxDate={filter.allowedDateRange ? new Date(filter.allowedDateRange.end) : undefined}
              dateFormat="yyyy-MM-dd"
              placeholder="Select Date"
            />
          </div>
        );

      case "checkbox":
        return (
          <>
            <TextInputField
              id={`search-${filter.id}`}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerms(prev => ({ ...prev, [filter.id]: e.target.value }))}
              label="Search"
              externalClassofInputBox="search-input"
            />
            <div className="checkbox-list-container">
              {filter.values
                ?.filter(val => val.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(val => (
                  <FormControlLabel
                    key={val}
                    control={
                      <Checkbox
                        checked={selectedValue?.value?.includes(val) || false}
                        onChange={() => handleCheckboxChange(filter.id, val, !!filter.singleSelect)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<span className="checkbox-label">{val}</span>}
                  />
                ))}
            </div>
          </>
        );

      case "select":
        return filter.singleSelect ? (
          <SelectField
            label={filter.name}
            name={filter.id}
            value={selectedValue?.value || ""}
            handleChange={(name, val) => {
              setDropdownInputs(prev => ({ ...prev, [name]: val }));
              handleDropdownChange(name, "", val);
            }}
            placeholder={`Select ${filter.name.toLowerCase()}`}
            options={filter.values?.map(v => ({ value: v, label: v })) || []}
          />
        ) : (
          <MultipleSelectField
            label={filter.name}
            name={filter.id}
            value={selectedValue?.value || []}
            handleChange={(name, val) => {
              setDropdownInputs(prev => ({ ...prev, [name]: val }));
              handleDropdownChange(name, "", val);
            }}
            placeholder={`Select ${filter.name.toLowerCase()}`}
            options={filter.values?.map(v => ({ value: v, label: v })) || []}
          />
        );

      case "range":
        return (
          <div className="conditional-dropdown-container">
            <SelectField
              name={filter.id}
              value={selectedValue?.condition || ""}
              handleChange={(name, val) => {
                setDropdownConditions(prev => ({ ...prev, [name]: val }));
                handleDropdownChange(name, val, selectedValue?.value || "");
              }}
              label="Select Condition"
              options={filter.conditions?.map(cond => ({ value: cond, label: cond })) || []}
              placeholder="Select Condition"
            />
            <TextInputField
              id={filter.id}
              value={selectedValue?.value || ""}
              onChange={(e) => {
                const newVal = e.target.value;
                setDropdownInputs(prev => ({ ...prev, [filter.id]: newVal }));
                handleDropdownChange(filter.id, condition, newVal);
              }}
              placeholder="Enter value"
              label="Value"
              type="number"
            />
          </div>
        );

      default:
        return <div>Unsupported filter type</div>;
    }
  };

  // Animation variants
  const desktopVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const mobileVariants = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } }
  };

  // Format filter value for display
  const formatFilterValue = (filterId: string, filterValue: any) => {
    const filter = filterConfig.find(f => f.id === filterId);
    if (!filter) return '';
    
    const { condition, value } = filterValue;
    
    switch (filter.type) {
      case 'checkbox':
        return Array.isArray(value) ? value.join(', ') : '';
      case 'date':
        if (filter.isRange) {
          return `${value?.start || ''} - ${value?.end || ''}`;
        }
        return value;
      case 'select':
      case 'range':
        return Array.isArray(value) ? value.join(', ') : value;
      case 'text':
        return `${condition}: ${value}`;
      default:
        return value;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile overlay */}
          {isMobile && (
            <motion.div
              className="filter-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          
          <motion.div
            ref={modalRef}
            className={`filter-modal-container ${isMobile ? 'mobile' : 'desktop'}`}
            variants={isMobile ? mobileVariants : desktopVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {/* Filter sidebar */}
            <div className="filter-sidebar">    
              <div className="filter-sidebar-header">
                <div className="filter-title-container">
                  <FilterIcon sx={{ fontSize: 20, mr: 1 }} />
                  <h3 className="filter-title">Filters</h3>
                  {hasActiveFilters && (
                    <Chip 
                      label={Object.keys(selectedFilters).length}
                      size="small"
                      color="primary"
                      sx={{ ml: 1, height: 20, fontSize: '12px' }}
                    />
                  )}
                </div>
                {isMobile && (
                  <div className="close-icon" onClick={onClose}>
                    <CloseIcon />
                  </div>
                )}
              </div>

              <div className="filter-list">
                {filterConfig.map(filter => {
                  const activeCount = getActiveFilterCount(filter.id);
                  const isActive = activeCount > 0;
                  
                  return (
                    <div
                      key={filter.id}
                      className={`filter-item ${activeFilterId === filter.id ? 'active' : ''} ${isActive ? 'has-active' : ''}`}
                      onClick={() => setActiveFilterId(filter.id)}
                    >
                      <span className="filter-item-name">{filter.name}</span>
                      {isActive && (
                        <span className="filter-indicator">
                          {activeCount}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {hasActiveFilters && (
                <button 
                  className="btn-clear-all" 
                  onClick={handleClearAll}
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {/* Filter content area */}
            <div className="filter-content">
              {!isMobile && (
                <div className="filter-content-header">
                  <h3 className="filter-type-title">
                    {activeFilter?.name}
                    {getActiveFilterCount(activeFilterId) > 0 && (
                      <span className="active-badge">
                        ({getActiveFilterCount(activeFilterId)})
                      </span>
                    )}
                  </h3>
                  <div className="close-icon" onClick={onClose}>
                    <CloseIcon />
                  </div>
                </div>
              )}
              
              <div className="filter-content-body">
                {activeFilter && (
                  <motion.div 
                    className="filter-type-container"
                    key={activeFilterId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderFilterInput(activeFilter)}
                  </motion.div>
                )}
              </div>

              {/* Display current applied filters */}
              {hasActiveFilters && (
                <div className="current-filters-section">
                  <div 
                    className="current-filters-header"
                    onClick={() => setShowActiveFilters(!showActiveFilters)}
                  >
                    <div className="current-filters-title">
                      <span>Applied Filters</span>
                      <Chip 
                        label={Object.keys(selectedFilters).length} 
                        size="small" 
                        color="primary"
                        className="filter-count-chip"
                      />
                    </div>
                    <IconButton size="small">
                      {showActiveFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </div>
                  
                  <Collapse in={showActiveFilters}>
                    <motion.div 
                      className="current-filters-list-compact"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      {Object.entries(selectedFilters).map(([key, filterValue]) => {
                        const filter = filterConfig.find(f => f.id === key);
                        if (!filter) return null;
                        
                        const displayValue = formatFilterValue(key, filterValue);
                        
                        return (
                          <motion.div
                            key={key}
                            className="current-filter-item"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className="filter-item-header">
                              <span className="filter-item-name">{filter.name}</span>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const updated = { ...selectedFilters };
                                  delete updated[key];
                                  setSelectedFilters(updated);
                                  onChange(updated, key, null);
                                }}
                                className="remove-filter-btn"
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </div>
                            <div className="filter-item-value">{displayValue}</div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </Collapse>
                </div>
              )}

              {/* Action Buttons */}
              <div className="filter-actions">
                <button className="btn-secondary" onClick={handleCancel}>
                  Clear Current
                </button>
                <button className="btn-primary" onClick={handleApply}>
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;