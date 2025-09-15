import React, { useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Sort as SortIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';

// ========== TYPE DEFINITIONS ========== //
/**
 * The direction of sorting (ascending or descending)
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Configuration for a single sort operation
 * @property {string} key - The field to sort by
 * @property {SortDirection} order - The sort direction
 */
export interface SingleSortConfig {
  key: string;
  order: SortDirection;
}

/**
 * Extended configuration for multiple sort operations
 * @extends SingleSortConfig
 * @property {string} id - Unique identifier for each sort criteria
 */
export interface MultiSortConfig extends SingleSortConfig {
  id: string;
}

/**
 * Available sorting options
 * @property {string} id - Unique identifier
 * @property {string} key - Field key for sorting
 * @property {string} label - Display label
 */
export interface SortOption {
  id: string;
  key: string;
  label: string;
}

interface SortingModalProps {
  options: SortOption[];
  value: SingleSortConfig | MultiSortConfig[] | null;
  onChange: (newValue: SingleSortConfig | MultiSortConfig[]) => void;
  iconSize?: number;
  position?: 'left' | 'right';
  onClearSort?: () => void;
  multiSort?: boolean;
}

/**
 * A responsive sorting modal component that works on both desktop and mobile
 * - Desktop: Appears as a dropdown near the trigger button
 * - Mobile: Slides up as a bottom sheet with backdrop
 * 
 * Features:
 * - Supports both single and multiple sorting
 * - Animated transitions
 * - Clean, intuitive UI
 * - Fully accessible
 * 
 * @param {SortingModalProps} props - Component props
 * @param {string} props.options - The available sorting options
 * @param {SingleSortConfig | MultiSortConfig[] | null} props.value - The current sorting value
 * @param {string} props.iconSize - The size of the sorting icon
 * @param {string} props.position - The position of the sorting icon
 * @param {(sortValue: SingleSortConfig | MultiSortConfig[] | null) => void} props.onChange - Callback for sorting changes
 * @param {(sortValue: SingleSortConfig | MultiSortConfig[] | null) => void} props.onClearSort - Callback for clearing sorting
 * @param {boolean} props.multiSort - Whether to allow multiple sorting     
 * @returns {JSX.Element} The SortingModal component
 */
export const SortingModal: React.FC<SortingModalProps> = ({
  options,
  value,
  onChange,
  iconSize = 24,
  position = 'right',
  onClearSort,
  multiSort = false,
}) => {
  // Component state
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Handles selection of a sort option
   * @param {string} id - The option id
   * @param {string} key - The field key to sort by
   * @param {SortDirection} order - The sort direction
   */
  const handleSelect = (id: string, key: string, order: SortDirection) => {
    if (multiSort) {
      // For multi-sort, add or update the sort criteria
      const currentSorts = Array.isArray(value) ? [...value] : [];
      const existingIndex = currentSorts.findIndex(item => item.key === key);

      if (existingIndex >= 0) {
        // Update existing sort
        currentSorts[existingIndex] = { ...currentSorts[existingIndex], order };
      } else {
        // Add new sort
        currentSorts.push({ id, key, order });
      }
      onChange(currentSorts);
    } else {
      // For single sort, just set the new value
      onChange({ key, order });
      setOpen(false); // Close immediately for single sort
    }
  };

  /**
   * Removes a sort criteria from multi-sort
   * @param {string} id - The id of the sort to remove
   */
  const handleRemoveSort = (id: string) => {
    if (!Array.isArray(value)) return;
    const newSorts = value.filter(item => item.id !== id);
    onChange(newSorts.length > 0 ? newSorts : []);
  };

  /**
   * Clears all sorting
   */
  const clearSort = () => {
    if (multiSort) {
      onChange([]);
    } else {
      onChange(null);
    }
    onClearSort?.();
    setOpen(false);
  };

  /**
   * Checks if a field is currently sorted
   * @param {string} key - The field key to check
   * @param {SortDirection} [order] - Optional specific direction to check
   * @returns {boolean} Whether the field is sorted
   */
  const isSorted = (key: string, order?: SortDirection) => {
    if (!value) return false;
    
    if (Array.isArray(value)) {
      const sortItem = value.find(item => item.key === key);
      return order ? sortItem?.order === order : !!sortItem;
    } else {
      return order 
        ? value.key === key && value.order === order 
        : value.key === key;
    }
  };

  /**
   * Gets the display label for a sort id
   * @param {string} id - The sort id
   * @returns {string} The corresponding label
   */
  const getLabelAgainstId = (id: string) => {
    return options.find(opt => opt.id === id)?.label || '';
  };

  /**
   * Gets the number of active sorts for badge display
   */
  const getActiveSortCount = () => {
    if (!value) return 0;
    if (Array.isArray(value)) return value.length;
    return 1; // Single sort
  };

  /**
   * Gets the direction icon for a sorted field
   * @param {string} key - The field key
   * @returns {JSX.Element|null} The direction icon or null if not sorted
   */
  const getDirectionIcon = (key: string) => {
    if (isSorted(key, 'asc')) return <ArrowUpwardIcon fontSize="small" />;
    if (isSorted(key, 'desc')) return <ArrowDownwardIcon fontSize="small" />;
    return null;
  };

  /**
   * Gets the summary text for active sorts
   * @returns {string} The summary text
   */
  const getSortSummary = () => {
    if (!value) return 'No sorts applied';
    
    if (Array.isArray(value)) {
      if (value.length === 0) return 'No sorts applied';
      if (value.length === 1) {
        const item = value[0];
        return `${getLabelAgainstId(item.id)} (${item.order === 'asc' ? 'A→Z' : 'Z→A'})`;
      }
      return `${value.length} sorts applied`;
    } else {
      return `${getLabelAgainstId(options.find(o => o.key === value.key)?.id || value.key)} (${value.order === 'asc' ? 'A→Z' : 'Z→A'})`;
    }
  };

  return (
    <Box position="relative" display="inline-block">
      {/* Sort trigger button with badge for active sorts */}
      <Badge 
        badgeContent={getActiveSortCount()} 
        color="primary" 
        overlap="circular"
        invisible={getActiveSortCount() === 0}
      >
        <IconButton
          aria-label="Open sort options"
          onClick={() => setOpen(prev => !prev)}
          sx={{
            color: value && ((Array.isArray(value) && value.length > 0) || !Array.isArray(value))
              ? 'primary.main'
              : 'text.secondary',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'primary.dark',
              backgroundColor: 'action.hover',
            },
            position: 'relative',
          }}
        >
          <SortIcon fontSize="inherit" sx={{ fontSize: iconSize }} />
          
          {/* Small indicator for active sorts */}
          {getActiveSortCount() > 0 && multiSort && (
            <Box
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
              }}
            />
          )}
        </IconButton>
      </Badge>

   

      {/* Mobile backdrop overlay (only visible on mobile) */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1299, // Below modal but above other content
            }}
          />
        )}
      </AnimatePresence>

      {/* Main modal content */}
      <AnimatePresence>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <motion.div
              // Different animations for mobile vs desktop
              initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: -10 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              style={{
                position: isMobile ? 'fixed' : 'absolute',
                bottom: isMobile ? 0 : undefined,
                top: isMobile ? undefined : '2.8rem',
                [position]: isMobile ? 0 : 0,
                zIndex: 1300,
                width: isMobile ? '100%' : 300,
                ...(isMobile && {
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }),
              }}
            >
              <Paper
                elevation={isMobile ? 8 : 6}
                sx={{
                  borderRadius: isMobile ? '16px 16px 0 0' : '12px',
                  boxShadow: isMobile ? theme.shadows[16] : '0 8px 20px rgba(0, 0, 0, 0.08)',
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  width: '100%',
                  height: '100%',
                }}
              >
                {/* Modal header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <SortIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Sort By
                    </Typography>
                    {getActiveSortCount() > 0 && multiSort && (
                      <Chip 
                        label={getActiveSortCount()} 
                        size="small" 
                        color="primary" 
                        variant="filled"
                      />
                    )}
                  </Box>
                  {isMobile && (
                    <IconButton 
                      aria-label="Close sort options"
                      onClick={() => setOpen(false)} 
                      size="small"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                
                {/* Active sorts summary */}
                {getActiveSortCount() > 0 && multiSort && (
                  <>
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Active sorts:
                      </Typography>
                    </Box>
                    
                    {/* Active sort chips with priority indicators */}
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mb: 2,
                        flexWrap: 'wrap',
                        gap: 1,
                        maxHeight: 120,
                        overflowY: 'auto',
                      }}
                    >
                      <AnimatePresence>
                        {Array.isArray(value) ? (
                          // Multi-sort chips with priority numbers
                          value.map((sortItem, index) => (
                            <motion.div
                              key={sortItem.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Chip
                                label={
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    <Typography variant="caption" fontWeight="bold">
                                      {index + 1}.
                                    </Typography>
                                    {getLabelAgainstId(sortItem.id)}
                                    {sortItem.order === 'asc' ? (
                                      <ArrowUpwardIcon fontSize="small" />
                                    ) : (
                                      <ArrowDownwardIcon fontSize="small" />
                                    )}
                                  </Box>
                                }
                                onDelete={() => handleRemoveSort(sortItem.id)}
                                deleteIcon={<CloseIcon />}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </motion.div>
                          ))
                        ) : (
                          // Single sort chip
                          value && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Chip
                                label={
                                  <Box display="flex" alignItems="center" gap={0.5}>
                                    {getLabelAgainstId(options.find(o => o.key === value.key)?.id || value.key)}
                                    {value.order === 'asc' ? (
                                      <ArrowUpwardIcon fontSize="small" />
                                    ) : (
                                      <ArrowDownwardIcon fontSize="small" />
                                    )}
                                  </Box>
                                }
                                onDelete={clearSort}
                                deleteIcon={<CloseIcon />}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </motion.div>
                          )
                        )}
                      </AnimatePresence>
                    </Stack>
                    <Divider sx={{ mb: 2 }} />
                  </>
                )}

                {/* Sort options list */}
                <Box
                  sx={{
                    maxHeight: isMobile ? 'calc(40vh - 200px)' : 200,
                    overflowY: 'auto',
                    pr: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, pl: 1 }}>
                    Select field to sort:
                  </Typography>
                  
                  {options.map(opt => {
                    const isAsc = isSorted(opt.key, 'asc');
                    const isDesc = isSorted(opt.key, 'desc');
                    const isAnyDirectionSorted = isAsc || isDesc;

                    return (
                      <Box
                        key={opt.key}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        px={1}
                        py={1.2}
                        borderRadius={1}
                        sx={{
                          transition: 'background 0.2s',
                          backgroundColor: isAnyDirectionSorted ? 'action.selected' : 'transparent',
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color={isAnyDirectionSorted ? 'primary.main' : 'text.primary'}>
                            {opt.label}
                          </Typography>
                          {getDirectionIcon(opt.key)}
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <Button
                            aria-label={`Sort ${opt.label} ascending`}
                            size="small"
                            variant={isAsc ? 'contained' : 'outlined'}
                            color={isAsc ? 'primary' : 'inherit'}
                            onClick={() => handleSelect(opt.id, opt.key, 'asc')}
                            sx={{
                              minWidth: 36,
                              px: 1,
                              py: 0.5,
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                            }}
                          >
                            <ArrowUpwardIcon fontSize="small" />
                          </Button>
                          <Button
                            aria-label={`Sort ${opt.label} descending`}
                            size="small"
                            variant={isDesc ? 'contained' : 'outlined'}
                            color={isDesc ? 'primary' : 'inherit'}
                            onClick={() => handleSelect(opt.id, opt.key, 'desc')}
                            sx={{
                              minWidth: 36,
                              px: 1,
                              py: 0.5,
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                            }}
                          >
                            <ArrowDownwardIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Multi-sort indicator */}
                {multiSort && (
                  <FormControlLabel
                    control={<Checkbox checked={multiSort} disabled />}
                    label="Multiple sorting enabled"
                    sx={{ mt: 1, fontSize: '0.8rem' }}
                  />
                )}

                {/* Clear sort button */}
                {(value && ((Array.isArray(value) && value.length > 0) || !Array.isArray(value))) && (
                  <Button
                    aria-label="Clear all sorting"
                    onClick={clearSort}
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    startIcon={<CloseIcon />}
                    sx={{
                      mt: 1.5,
                      fontSize: '0.8rem',
                      textTransform: 'none',
                      fontWeight: 500,
                      borderRadius: '8px',
                    }}
                  >
                    {multiSort ? "Clear All Sorts" : "Clear Sort"}
                  </Button>
                )}

                {/* Mobile close button */}
                {isMobile && (
                  <Button
                    aria-label="Close sort options"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </Button>
                )}
              </Paper>
            </motion.div>
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </Box>
  );
};