import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import type  { DataItem, CardInteractions, CardContentConfig, CardFieldConfig, CardTemplateConfig, CardDefaultView } from '../InterfacesForCardView';
import { getCardViewOptions } from '../cardViewComponents/CardViewContext';
import CardLayoutWrapper from '../reusableComponent/CardLayoutWrapper';
import { SelectionModalExample } from '../modal/SelectionModal';
import { useCardInteractions } from '../customHooks/useCardInteractions';
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Enhanced theme configuration with additional interaction states
 */
const theme = {
  colors: {
    primary: '#4895ef',
    primaryLight: '#e8f4ff',
    secondary: '#3f37c9',
    secondaryLight: '#f0efff',
    accent: '#4895ef',
    danger: '#f72585',
    dangerLight: '#ffe6f0',
    success: '#4cc9f0',
    successLight: '#e6f9ff',
    light: '#f8f9fa',
    dark: '#212529',
    muted: '#6c757d',
    white: '#ffffff',
    border: '#e9ecef',
    hover: '#f5f7ff',
    selected: '#e6eeff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    pill: '50px',
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
    lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
    xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    sizes: {
      h1: '2.5rem',
      h2: '2rem',
      h3: '1.75rem',
      h4: '1.5rem',
      h5: '1.25rem',
      h6: '1rem',
      body: '1rem',
      small: '0.875rem',
    },
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },
};

/**
 * Enhanced global styles with better interaction states
 */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: ${theme.typography.fontFamily};
    line-height: 1.6;
    color: ${theme.colors.dark};
    background-color: ${theme.colors.light};
  }

  /* Enhanced animation keyframes for click effects */
  @keyframes clickPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(72, 149, 239, 0.4);
    }
    70% {
      box-shadow: 0 0 0 12px rgba(72, 149, 239, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(72, 149, 239, 0);
    }
  }

  @keyframes doubleClickPulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(63, 55, 201, 0.6);
    }
    50% {
      transform: scale(0.97);
      box-shadow: 0 0 0 15px rgba(63, 55, 201, 0.2);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(63, 55, 201, 0);
    }
  }

  @keyframes rippleEffect {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    100% {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes selectionPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(72, 149, 239, 0.3);
    }
    50% {
      box-shadow: 0 0 0 8px rgba(72, 149, 239, 0.1);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(72, 149, 239, 0);
    }
  }

  @keyframes hoverFloat {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-4px);
    }
  }
`;


const CardViewRenderer = () => {
  const { options, customProperties } = getCardViewOptions();
  const { data, content, interactions, cardStyle } = options
  const contentConfig = content || null
  const { style } = cardStyle || {}
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { cardLoaderProps } = options || {};
  const [loadingCards, setLoadingCards] = useState<Set<string>>(new Set());
  const dataToRender = customProperties?.isDataProcessed
    ? customProperties?.useProcessedData?.processedData
    : data;

  /**
   * Determines whether the selection modal should be shown
   * for seeing the selected items , first of all items must be selectable
   * and secondly, multi select must be allowed
   */
  const canSeeSelectModal = interactions?.selectable && interactions?.multiSelect;
  const { allowAnimations = true } = interactions || {};
  console.log("dataToRender", customProperties, dataToRender)
  /**
   * Handles item selection logic with visual feedback
   * @param {DataItem} item - The item being selected/deselected
   */
  const handleSelect = (item: DataItem) => {
    if (!interactions?.selectable) return;

    let newSelectedItems: DataItem[];
    if (interactions.multiSelect) {
      const isSelected = selectedItems.some(selected => selected.id === item.id);
      newSelectedItems = isSelected
        ? selectedItems.filter(selected => selected.id !== item.id)
        : [...selectedItems, item];
    } else {
      newSelectedItems = selectedItems.some(selected => selected.id === item.id)
        ? []
        : [item];
    }

    setSelectedItems(newSelectedItems);
    interactions?.onSelect?.(newSelectedItems);
  };

  /**
   * Renders a default key-value view of the data item
   * @param {DataItem} item - The data item to render
   * @param {CardDefaultView} config - Configuration for the default view
   * @returns {React.ReactElement} A styled key-value grid
   */
  const renderDefaultView = (item: DataItem, config: CardDefaultView) => {
    const excludeKeys = config.excludeKeys || [];
    const keys = Object.keys(item).filter(key => key !== 'id' && !excludeKeys.includes(key));
    return (
      <div style={{
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        transition: theme.transitions.normal,
        ...cardStyle
      }}>
        <div className="d-flex flex-column">
          {keys.map((key) => (
            <div
              key={key}
              className="d-flex justify-content-between align-items-center"
              style={{
                marginBottom: theme.spacing.xs,
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.light,
                borderRadius: theme.borderRadius.sm,
                transition: theme.transitions.fast,
              }}
            >
              {/* Key */}
              <div
                style={{
                  fontWeight: 600,
                  color: theme.colors.muted,
                  fontSize: theme.typography.sizes.small,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {/* find the label for the key from the dataItemDescription  and so that  */}
                {options?.dataItemDescription.find(dataItem => dataItem.key === key)?.label || key}

              </div>

              {/* Value */}
              <div
                style={{
                  fontSize: theme.typography.sizes.small,
                  color: theme.colors.dark,
                  marginLeft: "8px",
                  textAlign: "right",
                  whiteSpace: "nowrap",
                }}
              >
                {String(item[key])}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renders an item using a custom HTML template
   * @param {DataItem} item - The data item to render
   * @param {CardTemplateConfig} config - Template configuration
   * @returns {React.ReactElement} A component with rendered template HTML
   */
  const renderTemplateView = (item: DataItem, config: CardTemplateConfig) => {
    try {
      // Enhanced template rendering with better styling
      let renderedTemplate = `
        <div style="
          padding: ${theme.spacing.lg};
          background: linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.light} 100%);
          border-radius: ${theme.borderRadius.lg};
          box-shadow: ${theme.shadows.md};
          transition: all ${theme.transitions.normal};
          border-left: 4px solid ${theme.colors.primary};
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background-color: ${theme.colors.primary}10;
            border-bottom-left-radius: 100%;
          "></div>
          ${config.template}
        </div>
      `;

      // Replace placeholders with actual values
      Object.keys(item).forEach(key => {
        renderedTemplate = renderedTemplate.replace(
          new RegExp(`{{${key}}}`, 'g'),
          String(item[key])
        );
      });

      // Apply helpers if they exist
      if (config.helpers) {
        Object.keys(config.helpers).forEach(helperName => {
          const helperFn = config.helpers?.[helperName];
          if (helperFn) {
            renderedTemplate = renderedTemplate.replace(
              new RegExp(`{{${helperName}\\((.*?)\\)}}`, 'g'),
              (match, args) => {
                try {
                  const parsedArgs = args.split(',').map((arg: string) => {
                    const trimmed = arg.trim();
                    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
                      return trimmed.slice(1, -1);
                    }
                    return item[trimmed] ?? trimmed;
                  });
                  return String(helperFn(...parsedArgs));
                } catch (e) {
                  console.error(`Error applying helper ${helperName}:`, e);
                  return match;
                }
              }
            );
          }
        });
      }

      return (
        <div
          style={style}
          dangerouslySetInnerHTML={{ __html: renderedTemplate }}
        />
      );
    } catch (error) {
      console.error('Template rendering error:', error);
      return (
        <div style={{
          padding: theme.spacing.lg,
          backgroundColor: theme.colors.white,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadows.sm,
          color: theme.colors.danger,
          ...style
        }}>
          Error rendering template
        </div>
      );
    }
  };

  /**
   * Renders an item using a fully configurable field-based layout
   * @param {DataItem} item - The data item to render
   * @param {CardFieldConfig} config - Field configuration
   * @returns {React.ReactElement} A component with configured layout
   */
  const renderFieldConfigView = (item: DataItem, config: CardFieldConfig) => {
    const cardStyle = {
      width: '100%',
      maxWidth: '100%',
      backgroundColor: theme.colors.white,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      transition: theme.transitions.normal,
      ...config.cardStyle,
      ...style
    };

    // Helper function to get nested field values
    const getFieldValue = (fieldPath: string) => {
      return fieldPath.split('.').reduce((obj, key) => obj?.[key], item);
    };

    // Render element content
    const renderElementContent = (element: any) => {
      if (element.component) {
        if (typeof element.component === 'function') {
          return element.component(element.field ? getFieldValue(element.field) : item);
        }
        return element.component;
      }
      if (element.field) {
        return getFieldValue(element.field);
      }
      return null;
    };

    return (
      <div style={cardStyle}>
        {config.rows.map(row => {
          if (row.visible === false) return null;

          const rowStyle = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: row.containerStyle?.padding || theme.spacing.md,
            marginBottom: config.rowSpacing || theme.spacing.sm,
            borderBottom: row.containerStyle?.borderBottom || `1px solid ${theme.colors.border}`,
            ...row.containerStyle
          };

          const renderSection = (section: any, alignItems: string = 'center') => (
            <div style={{
              display: 'flex',
              gap: section?.gap || '8px',
              alignItems: 'center',
              justifyContent: section?.justifyContent || 'flex-start',
              flexDirection: section?.flexDirection || 'row',
              flex: section?.style?.flex || '1',
              ...section?.style
            }}>
              {section?.elements
                ?.sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
                .map((element: any) => (
                  <div
                    key={element.id}
                    style={{
                      display: 'flex',
                      alignItems: alignItems,
                      ...element.style
                    }}
                  >
                    {renderElementContent(element)}
                  </div>
                ))}
            </div>
          );

          return (
            <div key={row.id} style={rowStyle}>
              {renderSection(row.left, 'flex-start')}
              {renderSection(row.center, 'center')}
              {renderSection(row.right, 'flex-end')}
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * Renders an individual card item based on contentConfig
   * @param {DataItem} item - The data item to render
   * @returns {React.ReactElement} A card component
   */
  const renderItem = (item: DataItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);

    // Use the custom hook for click interactions
    const {
      clickAnimation,
      ripplePosition,
      isHovered,
      cardRef,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    } = useCardInteractions(

      (item, e) => {
        if (interactions?.selectable) {
          handleSelect(item);
        }
        interactions?.onClick?.(item, e);
      },
      interactions?.onDoubleClick,
      interactions?.onHover
    );


    // Enhanced item style with better interaction states
    const itemStyle = {
      margin: theme.spacing.sm,
      border: isSelected
        ? `2px solid ${theme.colors.primary}`
        : `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      cursor: interactions?.selectable || interactions?.onClick ? 'pointer' : 'default',
      transition: `all ${theme.transitions.normal}`,
      transform: isSelected
        ? 'translateY(-4px)'
        : isHovered
          ? 'translateY(-8px)'
          : 'none',
      boxShadow: isSelected
        ? `${theme.shadows.lg}, 0 0 0 4px ${theme.colors.primaryLight}`
        : isHovered
          ? theme.shadows.md
          : theme.shadows.sm,
      position: 'relative' as const,
      overflow: 'hidden',
      backgroundColor: isSelected ? theme.colors.selected : theme.colors.white,

      // Apply animation styles based on click type
      animation:
        clickAnimation === 'single'
          ? 'clickPulse 0.6s ease-out'
          : clickAnimation === 'double'
            ? 'doubleClickPulse 0.6s ease-out'
            : isSelected
              ? 'selectionPulse 2s ease-in-out infinite'
              : 'none',

      // ✨ Enhanced Hover Effects
      '&:hover': {
        backgroundColor: isSelected ? theme.colors.selected : theme.colors.hover,
        boxShadow: isSelected
          ? `${theme.shadows.lg}, 0 0 0 4px ${theme.colors.primaryLight}`
          : `0 6px 16px rgba(0,0,0,0.15)`,
        transform: isSelected
          ? 'translateY(-6px) scale(1.03)'
          : 'translateY(-4px) scale(1.02)',
        transition: 'all 0.25s ease-in-out',

        // Subtle glow outline
        outline: isSelected ? `2px solid ${theme.colors.primaryLight}` : 'none',

        // Smooth backdrop filter for modern feel
        backdropFilter: 'brightness(1.02)',

        // Optional "shine" overlay effect
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: -50,
          width: '40%',
          height: '100%',
          background:
            'linear-gradient(120deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
          transform: 'skewX(-20deg)',
          transition: '0.5s',
        },
        '&:hover::after': {
          left: '150%',
        },
      },

      ...style,
    };

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(item));
      interactions?.onDragStart?.(item, e);
    };

    const handleDragEnd = (e: React.DragEvent) => {
      interactions?.onDragEnd?.(item, e);
    };

    return (
      <div
        ref={cardRef}
        key={item.id}
        // if animation allowed then apply enhanced styles
        // otherwise apply the original styles  
        style={allowAnimations ? itemStyle : style}
        onClick={(e) => handleClick(item, e)}
        onMouseEnter={(e) => handleMouseEnter(item, e)}
        onMouseLeave={handleMouseLeave}
        draggable={interactions?.draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        aria-selected={isSelected}
        role={interactions?.selectable ? "option" : undefined}
      >
        {/* Selection indicator */}
        {interactions?.selectable && (
          <div style={{
            position: 'absolute',
            top: theme.spacing.xs,
            right: theme.spacing.xs,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: isSelected ? theme.colors.primary : theme.colors.border,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: theme.transitions.fast,
            zIndex: 1,
          }}>
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        )}

        {/* Ripple effect for visual feedback */}
        {ripplePosition && (
          <span
            style={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: clickAnimation === 'single'
                ? 'rgba(72, 149, 239, 0.3)'
                : 'rgba(63, 55, 201, 0.3)',
              transform: 'scale(0)',
              animation: 'rippleEffect 0.6s linear',
              width: '20px',
              height: '20px',
              left: ripplePosition.x - 10, // Center the ripple on click position
              top: ripplePosition.y - 10,
              pointerEvents: 'none'
            }}
          />
        )}

        {contentConfig && contentConfig?.contentDisplayType === 'default-view' && renderDefaultView(item, contentConfig?.content)}
        {contentConfig && contentConfig?.contentDisplayType === 'template-config' && renderTemplateView(item, contentConfig?.content)}
        {contentConfig && contentConfig?.contentDisplayType === 'field-config' && renderFieldConfigView(item, contentConfig?.content)}
      </div>
    );
  };

  // Updated handlers for working with complete objects
  const handleSelectAll = () => {
    setSelectedItems([...dataToRender]); // Store complete objects
  };

  const handleClearAll = () => {
    setSelectedItems([]);
  };

  const handleToggleItem = (item: any) => {
    setSelectedItems(prev =>
      prev.some(selectedItem => selectedItem.id === item.id)
        ? prev.filter(selectedItem => selectedItem.id !== item.id)
        : [...prev, item]
    );
  };

  /**
   * Show loader for a specific card
   * @param cardId - The ID of the card to show loader for
   */
  const showCardLoader = (cardId: string) => {
      setLoadingCards(prev => new Set(prev).add(cardId));
  };

  /**
   * Hide loader for a specific card
   * @param cardId - The ID of the card to hide loader for
   */
  const hideCardLoader = (cardId: string) => {
    setLoadingCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  };

  /**
   * Check if a card is currently loading
   * @param cardId - The ID of the card to check
   * @returns boolean indicating if the card is loading
   */
  const isCardLoading = (cardId: string): boolean => {
    return loadingCards.has(cardId);
  };
  /**
   * CardLoader Component
   *
   * A flexible loading overlay with multiple animation variants.
   * Designed to be placed inside a card, modal, or any container
   * where asynchronous data fetching/loading occurs.
   *
   * @component
   *
   * @example
   * // Default loader (medium spinner with overlay and message)
   * <CardLoader />
   *
   * @example
   * // Large dots loader with a custom message
   * <CardLoader size="large" variant="dots" message="Fetching data..." />
   *
   * @example
   * // Bars loader without overlay
   * <CardLoader variant="bars" overlay={false} />
   *
   * @example
   * // Small pulse-circle loader with custom background
   * <CardLoader
   *   variant="pulse-circle"
   *   size="small"
   *   message="Please wait..."
   *   style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
   * />
   *
   * @param {Object} props - Component props
   * @param {"small"|"medium"|"large"} [props.size="medium"] - Controls loader size (container dimensions & stroke thickness).
   * @param {"spinner"|"dots"|"bars"|"pulse-circle"} [props.variant="spinner"] - The type of loader animation.
   * @param {boolean} [props.overlay=true] - If true, displays a semi-transparent background overlay with blur.
   * @param {string} [props.message="Loading..."] - Message text displayed under the loader (set empty string `""` to hide).
   * @param {string} [props.className] - Custom CSS class for container.
   * @param {Object} [props.style] - Inline style overrides for the container.
   *
   * @returns {JSX.Element} A styled loading indicator component with optional overlay and message.
   */

  const CardLoader = ({
    size = "medium",
    variant = "spinner",
    overlay = true,
    message = "Loading...",
    className = "",
    style = {},
  }) => {
    const sizeMap = {
      small: { container: 24, stroke: 3 },
      medium: { container: 32, stroke: 4 },
      large: { container: 48, stroke: 5 },
    };

    const { container, stroke } = sizeMap[size] || sizeMap.medium;

    // 🔹 Variants
    const Spinner = memo(() => (
      <motion.div
        style={{
          width: container,
          height: container,
          border: `${stroke}px solid ${theme.colors.primaryLight}`,
          borderTop: `${stroke}px solid ${theme.colors.primary}`,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    ));

    const Dots = memo(() => (
      <div style={{ display: "flex", gap: "6px" }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: container / 3,
              height: container / 3,
              borderRadius: "50%",
              backgroundColor: theme.colors.primary,
            }}
            animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    ));

    const Bars = memo(() => (
      <div style={{ display: "flex", gap: "4px", width: container }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              flex: 1,
              height: container,
              backgroundColor: theme.colors.primary,
              borderRadius: 4,
            }}
            animate={{ scaleY: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    ));

    const PulseCircle = memo(() => (
      <motion.div
        style={{
          width: container,
          height: container,
          borderRadius: "50%",
          backgroundColor: theme.colors.primary,
        }}
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 1, 0.3] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      />
    ));

    const LoaderComponent =
      {
        spinner: Spinner,
        dots: Dots,
        bars: Bars,
        "pulse-circle": PulseCircle,
      }[variant] || Spinner;

    return (
      <div
        role="status"
        aria-live="polite"
        className={className}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlay ? "rgba(255,255,255,0.9)" : "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: theme.borderRadius.lg,
          zIndex: 10,
          backdropFilter: overlay ? "blur(3px)" : "none",
          ...style,
        }}
      >
        <LoaderComponent />
        {message && (
          <motion.p
            style={{
              marginTop: 12,
              color: theme.colors.muted,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            {message}
          </motion.p>
        )}
      </div>
    );
  };
  // 🔹 Prop validation
  CardLoader.propTypes = {
    size: PropTypes.oneOf(["small", "medium", "large"]),
    variant: PropTypes.oneOf(["spinner", "dots", "bars", "pulse-circle"]),
    overlay: PropTypes.bool,
    message: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
  };

  /**
   * 
   * @param param0 
   * @description CardItem is a reusable component that can be used to render each card item
   * @returns 
   */
  const CardItem = ({
    item,
    isSelected,
    interactions,
    onSelect,
    contentConfig,
    style: parentStyle,
    allowAnimations,
    renderDefaultView,
    renderTemplateView,
    renderFieldConfigView
  }) => {
    // Now each card can safely use hooks
    const {
      clickAnimation,
      ripplePosition,
      isHovered,
      cardRef,
      handleClick,
      handleMouseEnter,
      handleMouseLeave
    } = useCardInteractions(
      (item, e) => {
        if (interactions?.selectable) {
          onSelect(item);
        }
        interactions?.onClick?.(item, e);
      },
      interactions?.onDoubleClick,
      interactions?.onHover
    );


    // Enhanced item style with better interaction states
    const itemStyle = {
      margin: theme.spacing.sm,
      border: isSelected
        ? `2px solid ${theme.colors.primary}`
        : `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      cursor: interactions?.selectable || interactions?.onClick ? 'pointer' : 'default',
      transition: `all ${theme.transitions.normal}`,
      transform: isSelected
        ? 'translateY(-4px)'
        : isHovered
          ? 'translateY(-8px)'
          : 'none',
      boxShadow: isSelected
        ? `${theme.shadows.lg}, 0 0 0 4px ${theme.colors.primaryLight}`
        : isHovered
          ? theme.shadows.md
          : theme.shadows.sm,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: isSelected ? theme.colors.selected : theme.colors.white,
      animation: clickAnimation === 'single'
        ? 'clickPulse 0.6s ease-out'
        : clickAnimation === 'double'
          ? 'doubleClickPulse 0.6s ease-out'
          : isSelected
            ? 'selectionPulse 2s ease-in-out infinite'
            : 'none',
      ...parentStyle,
    };

    const handleDragStart = (e: any) => {
      e.dataTransfer.setData('text/plain', JSON.stringify(item));
      interactions?.onDragStart?.(item, e);
    };

    const handleDragEnd = (e: any) => {
      interactions?.onDragEnd?.(item, e);
    };

    // Your rendering functions (renderDefaultView, renderTemplateView, renderFieldConfigView)
    // can be moved here or kept as utilities

    const isLoading = isCardLoading(item.id);



    return (
      <motion.div
        ref={cardRef}
        style={{
          ...(allowAnimations ? itemStyle : parentStyle),
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => {
          if (!isLoading) handleClick(item, e);
        }}
        onMouseEnter={(e) => {
          if (!isLoading) handleMouseEnter(item, e);
        }}
        onMouseLeave={handleMouseLeave}
        draggable={interactions?.draggable && !isLoading}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        aria-selected={isSelected}
        aria-busy={isLoading}
        role={interactions?.selectable ? "option" : undefined}
        layout
      >
        {/* Loading overlay with fade animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255,255,255,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <CardLoader {...cardLoaderProps} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selection indicator */}
        {interactions?.selectable && (
          <div
            style={{
              position: "absolute",
              top: theme.spacing.xs,
              right: theme.spacing.xs,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: isSelected ? theme.colors.primary : theme.colors.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            {isSelected && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        )}

        {/* Ripple effect */}
        {ripplePosition && !isLoading && (
          <span
            style={{
              position: "absolute",
              borderRadius: "50%",
              backgroundColor:
                clickAnimation === "single"
                  ? "rgba(72, 149, 239, 0.3)"
                  : "rgba(63, 55, 201, 0.3)",
              transform: "scale(0)",
              animation: "rippleEffect 0.6s linear",
              width: "20px",
              height: "20px",
              left: ripplePosition.x - 10,
              top: ripplePosition.y - 10,
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        {/* Card content - no animation to prevent re-trigger */}
        <div style={{ opacity: isLoading ? 0.5 : 1, transition: "opacity 0.3s" }}>
          {contentConfig?.contentDisplayType === "default-view" &&
            renderDefaultView(item, contentConfig?.content)}
          {contentConfig?.contentDisplayType === "template-config" &&
            renderTemplateView(item, contentConfig?.content)}
          {contentConfig?.contentDisplayType === "field-config" &&
            renderFieldConfigView(item, contentConfig?.content)}
        </div>
      </motion.div>
    );

  }
  // Return the component with the loader functions exposed
  return {
    CardView: (
      <div style={{
        display: 'grid',
      }}>
        {canSeeSelectModal && (
          <SelectionModalExample
            items={data as any}
            selectedItems={selectedItems}
            onSelectAll={handleSelectAll}
            onClearAll={handleClearAll}
            onToggleItem={handleToggleItem}
          />
        )}
        <style>{globalStyles}</style>
        <CardLayoutWrapper>
          {dataToRender.map((item: any) =>
            <CardItem
              key={item.id}
              item={item}
              isSelected={selectedItems.some(selected => selected.id === item.id)}
              interactions={interactions}
              onSelect={handleSelect}
              contentConfig={contentConfig}
              style={style}
              allowAnimations={allowAnimations}
              renderDefaultView={renderDefaultView}
              renderTemplateView={renderTemplateView}
              renderFieldConfigView={renderFieldConfigView}
            />
          )}
        </CardLayoutWrapper>
      </div>
    ),
    showCardLoader,
    hideCardLoader,
    isCardLoading
  };
};

// Usage example in parent component:
/*
const ParentComponent = () => {
  const { CardView, showCardLoader, hideCardLoader, isCardLoading } = CardViewRenderer();
  
  // Example: Show loader for card with ID '123'
  const handleSomeAction = async (cardId: string) => {
    showCardLoader(cardId);
    try {
      // Perform async operation
      await someAsyncOperation();
    } finally {
      hideCardLoader(cardId);
    }
  };
  
  return (
    <div>
      {CardView}
      <button onClick={() => handleSomeAction('123')}>
        Load Data for Card 123
      </button>
    </div>
  );
};
*/

export default CardViewRenderer;