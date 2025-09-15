import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Props for the ResponsivePopoverModal component
 * 
 * @property {React.ReactNode} trigger - The element that triggers the modal to open
 * @property {React.ReactNode} children - Content to be displayed inside the modal
 * @property {boolean} show - Controls the visibility of the modal
 * @property {(val: boolean) => void} setShow - Function to control the show state
 * @property {number | string} [width='max-content'] - Width of the modal in desktop view
 * @property {number | string} [height='auto'] - Height of the modal in mobile view
 */
type ResponsivePopoverModalProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  show: boolean;
  setShow: (val: boolean) => void;
  width?: number | string;
  height?: number | string;
};

/**
 * A responsive popover/modal component that adapts its behavior based on screen size.
 * 
 * Features:
 * - Desktop: Appears as a dropdown popover positioned absolutely
 * - Mobile: Slides up from bottom as a bottom sheet modal
 * - Smooth animations using Framer Motion
 * - Backdrop overlay for mobile view
 * - Responsive to Material-UI breakpoints
 * 
 * Usage:
 * <ResponsivePopoverModal 
 *   trigger={<button>Open</button>}
 *   show={isOpen}
 *   setShow={setIsOpen}
 * >
 *   <div>Modal Content</div>
 * </ResponsivePopoverModal>
 */
export const ResponsivePopoverModal: React.FC<ResponsivePopoverModalProps> = ({
  trigger,
  children,
  show,
  setShow,
  width = 'max-content',
  height = 'auto',
}) => {
  const theme = useTheme();
  // Detect mobile view using Material-UI breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      className="responsive-popover-wrapper" 
      position="relative" 
      display="inline-block"
    >
      {/* Trigger element that opens the modal */}
      {trigger}

      {/* Animation wrapper from Framer Motion */}
      <AnimatePresence>
        {/* Mobile backdrop overlay */}
        {show && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShow(false)}
            style={{
              position: 'fixed',
              inset: 0, 
              zIndex: 1200, 
            }}
          />
        )}

        {/* Main modal content */}
        {show && (
          <motion.div
            // Different animations for mobile vs desktop
            initial={isMobile ? { y: '100%' } : { opacity: 0, y: -10 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            style={
              isMobile
                ? // Mobile styles (bottom sheet)
                  {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    zIndex: 1301, // Above the backdrop
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                    padding: '1rem',
                    height: height,
                    maxHeight: '80vh', // Prevent modal from being too tall
                    overflowY: 'auto', // Scrollable if content is too long
                  }
                : // Desktop styles (dropdown popover)
                  {
                    position: 'absolute',
                    top: '100%', // Position below trigger
                    right: 0, // Align to right of trigger
                    marginTop: 8, // Small gap from trigger
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.1)',
                    zIndex: 1301,
                    width: width,
                    padding: '1rem',
                  }
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};