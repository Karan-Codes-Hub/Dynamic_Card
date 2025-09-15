import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  InputAdornment, 
  TextField,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  ClickAwayListener
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Close as CloseIcon
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

interface MobileSearchSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleClear: () => void;
  autoFocus: boolean;
  placeholder: string;
}

interface DesktopSearchProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleClear: () => void;
  autoFocus: boolean;
  placeholder: string;
  className: string;
  fullWidth: boolean;
  desktopSearchRef: React.RefObject<HTMLDivElement>;
}

// Memoized mobile search sheet to prevent unnecessary re-renders
const MobileSearchSheet = memo<MobileSearchSheetProps>(({ 
  open, 
  setOpen, 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  handleKeyDown, 
  handleClear, 
  autoFocus, 
  placeholder 
}) => {
  const theme = useTheme();
  
  return (
    <>
      {/* Backdrop overlay with fade animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" }
            }}
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1299,
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet with slide animation */}
      <AnimatePresence>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <motion.div
              key="mobile-search-sheet"
              initial={{ y: '100%' }}
              animate={{ 
                y: 0,
                transition: { 
                  type: 'spring',
                  damping: 25,
                  stiffness: 200
                }
              }}
              exit={{ 
                y: '100%',
                transition: { 
                  type: 'spring',
                  damping: 30,
                  stiffness: 200
                }
              }}
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                padding: '16px',
                paddingBottom: '32px',
                backgroundColor: theme.palette.background.paper,
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                boxShadow: theme.shadows[16],
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1, fontWeight: 600 }}>
                  Search
                </Typography>
                <IconButton onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <TextField
                id="mobile-search-input"
                fullWidth
                autoFocus={autoFocus}
                variant="outlined"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={handleClear}
                        aria-label="clear search"
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: '12px',
                    backgroundColor: 'background.default',
                  },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={!searchQuery.trim()}
                sx={{
                  mt: 3,
                  borderRadius: '12px',
                  py: 1.5,
                  fontWeight: 500,
                }}
              >
                Search
              </Button>
            </motion.div>
          </ClickAwayListener>
        )}
      </AnimatePresence>
    </>
  );
});

// Memoized desktop search component
const DesktopSearch = memo<DesktopSearchProps>(({ 
  open, 
  setOpen, 
  searchQuery, 
  setSearchQuery, 
  handleSearch, 
  handleKeyDown, 
  handleClear, 
  autoFocus, 
  placeholder, 
  className, 
  fullWidth, 
  desktopSearchRef 
}) => {
  const theme = useTheme();
  
  return (
    <Box 
      ref={desktopSearchRef}
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: fullWidth ? '100%' : 'auto'
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="desktop-search-input"
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: fullWidth ? '100%' : 240,
              opacity: 1,
              transition: { 
                type: 'spring',
                damping: 25,
                stiffness: 200
              }
            }}
            exit={{ 
              width: 0,
              opacity: 0,
              transition: { 
                type: 'spring',
                damping: 30,
                stiffness: 200,
                opacity: { duration: 0.15 }
              }
            }}
            style={{ overflow: 'hidden' }}
          >
            <TextField
              id="search-input"
              className={className}
              size="small"
              variant="outlined"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus={autoFocus && open}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  backgroundColor: 'background.default',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      aria-label="clear search"
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search icon - only visible when search is closed or not fullWidth */}
      <AnimatePresence>
        {(!open || !fullWidth) && (
          <motion.div
            key="desktop-search-icon"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ 
              opacity: open ? 0 : 1,
              scale: open ? 0.9 : 1,
              transition: { duration: 0.15 }
            }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              onClick={() => {
                setOpen(true);
                setTimeout(() => {
                  const input = document.getElementById(`search-input`);
                  input?.focus();
                }, 50);
              }}
              sx={{
                color: 'text.secondary',
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'action.hover',
                },
                ml: fullWidth ? 1 : 0
              }}
              aria-label="open search"
            >
              <SearchIcon />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
});

// Add display names for better debugging
MobileSearchSheet.displayName = 'MobileSearchSheet';
DesktopSearch.displayName = 'DesktopSearch';

/**
 * Enhanced Responsive Search Bar with Smooth Animations
 * 
 * Features:
 * - Mobile: Full-screen search sheet with slide-up animation
 * - Desktop: Expanding search field with smooth transitions
 * - Search icon visibility toggles based on search state in desktop view
 * - Optimized animations for performance
 * - Clean keyboard handling (Enter to search, Escape to close)
 * 
 * Behavior:
 * - On desktop:
 *   - Clicking search icon makes it invisible and opens search field
 *   - When search field closes (empty query + click away), icon reappears
 *   - Search icon remains hidden while search field is open
 * - On mobile:
 *   - Standard bottom sheet pattern with overlay
 */
export const SearchBarComponent: React.FC<SearchBarProps> = ({
  onSearch,
  className = '',
  fullWidth = false,
  autoFocus = true,
  placeholder = 'Search...'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Search handler
  const handleSearch = useCallback(() => {
    // if (searchQuery.trim()) {
      onSearch(searchQuery);
      if (isMobile) setOpen(false);
    // }
  }, [searchQuery, onSearch, isMobile]);

  // Keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [handleSearch]);

  // Clear handler
  const handleClear = useCallback(() => {
    setSearchQuery('');
    if (!isMobile) {
      const input = document.getElementById('search-input');
      input?.focus();
    }
  }, [isMobile]);

  // Click outside handler (desktop only)
  const handleClickOutside = useCallback(() => {
    if (open && !searchQuery) {
      setOpen(false);
    }
  }, [open, searchQuery]);

  // Desktop click-away listener
  useEffect(() => {
    if (!isMobile && open) {
      const handleDocumentClick = (e: MouseEvent) => {
        if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
          handleClickOutside();
        }
      };

      document.addEventListener('mousedown', handleDocumentClick);
      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
      };
    }
  }, [isMobile, open, handleClickOutside]);

  return (
    <>
      {/* Mobile trigger button */}
      {isMobile && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              color: 'text.secondary',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'primary.main',
              },
            }}
            aria-label="open search"
          >
            <SearchIcon />
          </IconButton>
        </motion.div>
      )}

      {/* Render the appropriate component */}
      {isMobile ? (
        <MobileSearchSheet 
          open={open}
          setOpen={setOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
          handleClear={handleClear}
          autoFocus={autoFocus}
          placeholder={placeholder}
        />
      ) : (
        <DesktopSearch 
          open={open}
          setOpen={setOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          handleKeyDown={handleKeyDown}
          handleClear={handleClear}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={className}
          fullWidth={fullWidth}
          desktopSearchRef={desktopSearchRef}
        />
      )}
    </>
  );
};