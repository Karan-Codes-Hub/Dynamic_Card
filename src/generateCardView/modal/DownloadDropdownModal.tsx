import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  ClickAwayListener,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import DownloadIcon from '@mui/icons-material/Download';

interface DownloadDropdownModalProps {
  /** 
   * Callback function triggered when a download option is selected
   * @param type - The file format selected for download ('csv' | 'json' | 'excel')
   */
  onDownload: (type: 'csv' | 'json' | 'excel') => void;

  /**
   * Optional prop to control the size of the download icon
   * @default 'medium'
   */
  iconSize?: 'small' | 'medium' | 'large';
  /**
   * Optional prop to control the allowed file types
   * @default ['csv', 'json', 'excel']
   */
  allowedTypes?: string[];
}

type ExportType = 'excel' | 'csv' | 'json';

interface ExportOption {
  type: ExportType;
  label: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  { type: 'excel', label: 'Excel (.xlsx)' },
  { type: 'csv', label: 'CSV (.csv)' },
  { type: 'json', label: 'JSON (.json)' },
];

/**
 * A responsive download dropdown modal component that adapts to screen size.
 * 
 * Features:
 * - Desktop: Appears as a dropdown menu below the download button
 * - Mobile: Slides up as a bottom sheet with backdrop overlay
 * - Smooth animations using Framer Motion
 * - Three download format options (Excel, CSV, JSON)
 * - Accessible and keyboard-navigable
 * 
 * Usage:
 * <DownloadDropdownModal onDownload={(type) => handleDownload(type)} />
 */
export const DownloadDropdownModal: React.FC<DownloadDropdownModalProps> = ({
  onDownload,
  iconSize = 'medium',
  allowedTypes = ['csv', 'json', 'excel']
}) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Handles the selection of a download format
   * @param type - The selected download format
   */
  const handleSelect = (type: 'csv' | 'json' | 'excel') => {
    onDownload(type);
    setOpen(false);
  };



  return (
    <Box position="relative" display="inline-block">
      {/* Download trigger button */}
      <IconButton
        aria-label="Download options"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          backgroundColor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            color: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
        size={iconSize}
      >
        <DownloadIcon fontSize={iconSize} />
      </IconButton>

      {/* Mobile backdrop overlay (only shown on mobile) */}
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
              zIndex: 1299, // Below the modal but above other content
            }}
          />
        )}
      </AnimatePresence>

      {/* Download options modal */}
      <AnimatePresence>
        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <motion.div
              // Different animations for mobile vs desktop
              initial={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: -10 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { scale: 0.95, opacity: 0, y: -10 }}
              transition={{
                duration: 0.2,
                ease: isMobile ? 'easeOut' : 'easeInOut'
              }}
              style={{
                position: isMobile ? 'fixed' : 'absolute',
                bottom: isMobile ? 0 : undefined,
                top: isMobile ? undefined : 'calc(100% + 8px)',
                right: isMobile ? 0 : 0,
                width: isMobile ? '100%' : '220px',
                zIndex: 1300,
                // Ensures proper positioning in mobile view
                ...(isMobile && {
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }),
              }}
            >
              <Paper
                elevation={isMobile ? 0 : 4}
                sx={{
                  borderRadius: isMobile ? '16px 16px 0 0' : '12px',
                  boxShadow: isMobile ? theme.shadows[10] : theme.shadows[4],
                  p: 2,
                  backgroundColor: theme.palette.background.paper,
                  // Full width in mobile, fixed width in desktop
                  width: '100%',
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                  Download As
                </Typography>

                {/* Download options list */}
                {EXPORT_OPTIONS
                  .filter(option => allowedTypes.includes(option.type))
                  .map(option => (
                    <MenuItem
                      key={option.type}
                      onClick={() => handleSelect(option.type)}
                      sx={{ py: 1.5 }}
                    >
                      {option.label}
                    </MenuItem>
                  ))
                }

                {/* Mobile-specific cancel button */}
                {isMobile && (
                  <Button
                    fullWidth
                    variant="text"
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      py: 1.5
                    }}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
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