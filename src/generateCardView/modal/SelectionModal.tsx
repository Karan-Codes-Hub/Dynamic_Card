import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Paper,
  Typography,
  Checkbox,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Fade,
  ListItemButton,
  Popper
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  SelectAll as SelectAllIcon,
  Deselect as DeselectIcon,
} from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';

export interface SelectableItem {
  id: string;
  label: string;
  [key: string]: any;
}

interface SelectionModalProps {
  open: boolean;
  onClose: () => void;
  items: any[];
  selectedItems: SelectableItem[];
  onSelectAll: () => void;
  onClearAll: () => void;
  onToggleItem: (item: SelectableItem) => void;
  title?: string;
  anchorEl?: HTMLElement | null;
  maxHeight?: number;
  getAvatarContent?: (item: SelectableItem) => string;
}

/**
 * A responsive selection modal component for displaying and managing selected items
 * - Desktop: Appears as a dropdown near the trigger using Popper
 * - Mobile: Slides up as a bottom sheet with backdrop
 */
export const SelectionModal: React.FC<SelectionModalProps> = ({
  open,
  onClose,
  items,
  selectedItems,
  onSelectAll,
  onClearAll,
  onToggleItem,
  title = 'Selected Items',
  anchorEl,
  maxHeight = 400,
  getAvatarContent,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0 && !allSelected;

  const getDefaultAvatarContent = (item: SelectableItem) => {
    return item?.label?.charAt(0)?.toUpperCase() || 'U';
  };

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleClearAll = () => {
    onClearAll();
  };

  const handleToggleItem = (item: SelectableItem) => {
    onToggleItem(item);
  };

  const isItemSelected = (item: SelectableItem): boolean => {
    return selectedItems.some(selectedItem => selectedItem.id === item.id);
  };

  // Modal content component
  const modalContent = (
    <Paper
      elevation={isMobile ? 16 : 8}
      sx={{
        borderRadius: isMobile ? '16px 16px 0 0' : '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: isMobile ? '80vh' : maxHeight,
        width: isMobile ? '100%' : '400px',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Header section */}
      <Box
        sx={{
          p: 2,
          pb: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight={600} color="primary">
            {title}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            {/* <Badge
              badgeContent={selectedItems.length}
              color="primary"
              max={999}
              sx={{ mr: 1 }}
            >
              <Typography variant="body2" color="text.secondary">
                Selected
              </Typography>
            </Badge> */}
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="Close selection modal"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Selection actions */}
        <Box display="flex" gap={1} mt={1}>
          {/* ✅ Select All Button */}
          <Button
            size="small"
            variant={allSelected ? "contained" : "outlined"}
            onClick={handleSelectAll}
            startIcon={<SelectAllIcon />}
            disabled={items.length === 0}
            sx={{
              flex: 1,
              fontSize: "0.75rem",
              py: 0.7,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              transition: "all 0.3s ease",
              ...(allSelected
                ? {
                  background: "linear-gradient(45deg, #42a5f5, #1e88e5)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1e88e5, #1565c0)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                  },
                }
                : {
                  borderColor: "#90caf9",
                  color: "#1e88e5",
                  "&:hover": {
                    background: "rgba(33, 150, 243, 0.1)",
                    borderColor: "#1e88e5",
                  },
                }),
            }}
          >
            Select All
          </Button>

          {/* ❌ Clear All Button */}
          <Button
            size="small"
            variant="outlined"
            color={selectedItems.length > 0 ? "error" : "inherit"}
            onClick={handleClearAll}
            startIcon={<DeselectIcon />}
            disabled={selectedItems.length === 0}
            sx={{
              flex: 1,
              fontSize: "0.75rem",
              py: 0.7,
              borderRadius: "8px",
              fontWeight: 600,
              textTransform: "none",
              transition: "all 0.3s ease",
              ...(selectedItems.length > 0
                ? {
                  borderColor: "#ef5350",
                  color: "#d32f2f",
                  "&:hover": {
                    background: "rgba(244, 67, 54, 0.1)",
                    borderColor: "#c62828",
                    transform: "translateY(-2px)",
                  },
                }
                : {
                  borderColor: "#bdbdbd",
                  color: "#757575",
                  cursor: "not-allowed",
                  "&:hover": {
                    background: "transparent",
                  },
                }),
            }}
          >
            Clear All
          </Button>
        </Box>

      </Box>

      {/* Selected items list */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {items.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <CheckBoxOutlineBlankIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
            <Typography variant="body2">
              No items available for selection
            </Typography>
          </Box>
        ) : selectedItems.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              color: theme.palette.text.secondary,
            }}
          >
            <CheckBoxOutlineBlankIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
            <Typography variant="body2">
              No items selected
            </Typography>
            <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
              Use "Select All" or select individual items
            </Typography>
          </Box>
        ) : (
          // <List dense sx={{ p: 0 }}>
          //   {selectedItems.map((item) => (
          //     <Fade in key={item.id}>
          //       <ListItem
          //         onClick={() => handleToggleItem(item)}
          //         sx={{
          //           borderBottom: `1px solid ${theme.palette.divider}`,
          //           '&:last-child': {
          //             borderBottom: 'none',
          //           },
          //           '&:hover': {
          //             backgroundColor: theme.palette.action.hover,
          //           },
          //         }}
          //         disablePadding
          //       >
          //         <ListItemButton>
          //           <ListItemIcon sx={{ minWidth: 40 }}>
          //             <Checkbox
          //               edge="start"
          //               checked={isItemSelected(item)}
          //               tabIndex={-1}
          //               disableRipple
          //               icon={<CheckBoxOutlineBlankIcon />}
          //               checkedIcon={<CheckBoxIcon color="primary" />}
          //             />
          //           </ListItemIcon>

          //           <Avatar
          //             sx={{
          //               width: 32,
          //               height: 32,
          //               fontSize: '0.875rem',
          //               bgcolor: theme.palette.primary.main,
          //               mr: 2,
          //             }}
          //           >
          //             {getAvatarContent
          //               ? getAvatarContent(item)
          //               : getDefaultAvatarContent(item)}
          //           </Avatar>

          //           <ListItemText
          //             primary={
          //               <Typography variant="body2" noWrap>
          //                 {item.label}
          //               </Typography>
          //             }
          //             secondary={
          //               item.description && (
          //                 <Typography variant="caption" color="text.secondary" noWrap>
          //                   {item.description}
          //                 </Typography>
          //               )
          //             }
          //           />

          //           <Chip
          //             label="Selected"
          //             size="small"
          //             color="primary"
          //             variant="filled"
          //             sx={{ ml: 1 }}
          //           />
          //         </ListItemButton>
          //       </ListItem>
          //     </Fade>
          //   ))}
          // </List>
          <></>
        )}
      </Box>

      {/* Footer with summary */}
      <Box
        sx={{
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {selectedItems.length} of {items.length} selected
          </Typography>

          {isMobile && (
            <Button
              variant="contained"
              size="small"
              onClick={onClose}
              sx={{ minWidth: 80 }}
            >
              Done
            </Button>
          )}
        </Box>

        {someSelected && !allSelected && (
          <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
            Partial selection - {items.length - selectedItems.length} items not selected
          </Typography>
        )}
      </Box>
    </Paper>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile backdrop overlay */}
          {/* {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: theme.palette.common.black,
                zIndex: 1299,
              }}
            />
          )} */}

          {/* Desktop: Use Popper for positioning */}
          {!isMobile && anchorEl && (
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="bottom-start"
              style={{ zIndex: 1300 }}
              modifiers={[
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8], // 8px offset from the button
                  },
                },
              ]}
            >
              <ClickAwayListener onClickAway={onClose}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {modalContent}
                </motion.div>
              </ClickAwayListener>
            </Popper>
          )}

          {/* Mobile: Fixed positioning */}
          {isMobile && (
            <ClickAwayListener onClickAway={onClose}>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1300,
                  maxHeight: '80vh',
                }}
              >
                {modalContent}
              </motion.div>
            </ClickAwayListener>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

// Example usage component
interface SelectionModalExampleProps {
  items: SelectableItem[];
  selectedItems: SelectableItem[];
  onSelectAll: () => void;
  onClearAll: () => void;
  onToggleItem: (item: SelectableItem) => void;
}

export const SelectionModalExample: React.FC<SelectionModalExampleProps> = ({
  items,
  selectedItems,
  onSelectAll,
  onClearAll,
  onToggleItem,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <Box display="flex" alignItems="center" marginTop={5} gap={1}>
      <Badge
        badgeContent={selectedItems.length}
        color="primary"
        max={99}
        overlap="circular"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Button
          ref={anchorRef}
          variant="contained"
          onClick={() => setModalOpen(!modalOpen)}
          startIcon={<CheckBoxIcon />}
          size="medium"
          disabled={selectedItems.length === 0}
          sx={{
            textTransform: 'none',
            borderRadius: '999px',
            px: 3,
            py: 1.2,
            fontWeight: 600,
            letterSpacing: 0.3,
            transition: 'all 0.3s ease',
            ...(selectedItems.length > 0
              ? {
                // ✅ Active style
                background: 'linear-gradient(45deg, #42a5f5, #1e88e5)',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1e88e5, #1565c0)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
                },
              }
              : {
                // 🚫 Disabled-like style
                background: 'linear-gradient(45deg, #e0e0e0, #bdbdbd)',
                color: '#757575',
                boxShadow: 'none',
                cursor: 'not-allowed',
                '&:hover': {
                  background: 'linear-gradient(45deg, #e0e0e0, #bdbdbd)',
                  transform: 'none',
                  boxShadow: 'none',
                },
              }),
          }}
        >
          {selectedItems.length > 0 ? 'Selected Items' : 'No Items Selected'}
        </Button>
      </Badge>




      <SelectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={items}
        selectedItems={selectedItems}
        onSelectAll={onSelectAll}
        onClearAll={onClearAll}
        onToggleItem={onToggleItem}
        title="Selected Documents"
        anchorEl={anchorRef.current}
        getAvatarContent={(item) => item?.label?.charAt(0)?.toUpperCase() || 'U'}
      />
    </Box>
  );
};