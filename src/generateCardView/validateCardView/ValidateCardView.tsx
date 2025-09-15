import React, { forwardRef } from "react";
import {
  CardViewOptions,
  DataItem,
  CardInteractions,
  DataOperations,
  PaginationConfig,
  ZoomConfig,
  CardLayoutOptions,
  CardFieldConfig,
  CardTemplateConfig,
  CardDefaultView,
  HeaderCardViewOptions,
  SegregatedData,
  CardSection,
  DataItemDescription,
  CardContentConfig
} from "../InterfacesForCardView";
import styles from "./validateCardView.module.css"
import RenderCardView from "../cardViewComponents/RenderCardView";

// Interface for the exposed methods of the component via ref
interface CardViewRef {
  refresh: () => void;
  getSelected: () => DataItem[];
}

/**
 * Validates the `data` array to ensure each item is a valid DataItem
 */
const validateDataItems = (data: DataItem[]): string[] => {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    return ["'data' must be an array of DataItem objects"];
  }

  data.forEach((item, index) => {
    if (typeof item !== 'object' || item === null) {
      errors.push(`Data item at index ${index} must be an object`);
      return;
    }

    if (!('id' in item)) {
      errors.push(`Data item at index ${index} is missing required 'id' property`);
    } else if (typeof item.id !== 'string') {
      errors.push(`'id' property in data item at index ${index} must be a string`);
    }
  });

  return errors;
};

/**
 * Validates interaction-related props such as select, drag, click, etc.
 */
const validateInteractions = (interactions?: CardInteractions): string[] => {
  const errors: string[] = [];

  if (!interactions) return errors;

  // Validation for selection features
  if (interactions.selectable) {
    if (interactions.onSelect && typeof interactions.onSelect !== 'function') {
      errors.push("'onSelect' must be a function when 'selectable' is true");
    }
    if (interactions.multiSelect && !interactions.selectable) {
      errors.push("'multiSelect' requires 'selectable' to be true");
    }
  }

  // Validation for draggable features
  if (interactions.draggable) {
    if (interactions.onDragStart && typeof interactions.onDragStart !== 'function') {
      errors.push("'onDragStart' must be a function when 'draggable' is true");
    }
    if (interactions.onDragEnd && typeof interactions.onDragEnd !== 'function') {
      errors.push("'onDragEnd' must be a function when 'draggable' is true");
    }
  }

  // Click handlers
  if (interactions.onClick && typeof interactions.onClick !== 'function') {
    errors.push("'onClick' must be a function");
  }
  if (interactions.onDoubleClick && typeof interactions.onDoubleClick !== 'function') {
    errors.push("'onDoubleClick' must be a function");
  }
  if (interactions.onHover && typeof interactions.onHover !== 'function') {
    errors.push("'onHover' must be a function");
  }

  return errors;
};

/**
 * Validates sorting, filtering, and search functions in data operations
 */
const validateDataOperations = (operations?: DataOperations): string[] => {
  const errors: string[] = [];

  if (!operations) return errors;

  if (operations.sort?.enabled && operations.sort.compareFn && typeof operations.sort.compareFn !== 'function') {
    errors.push("'compareFn' in sort must be a function");
  }

  if (operations.filter?.enabled && operations.filter.filterFn && typeof operations.filter.filterFn !== 'function') {
    errors.push("'filterFn' in filter must be a function");
  }

  if (operations.search?.enabled && operations.search.searchFn && typeof operations.search.searchFn !== 'function') {
    errors.push("'searchFn' in search must be a function");
  }

  return errors;
};

/**
 * Validates pagination config like items per page and pagination type
 */
const validatePagination = (pagination?: PaginationConfig): string[] => {
  const errors: string[] = [];

  if (!pagination) return errors;

  if (pagination.enabled) {
    if (pagination.itemsPerPage && (typeof pagination.itemsPerPage !== 'number' || pagination.itemsPerPage <= 0)) {
      errors.push("'itemsPerPage' must be a positive number");
    }

    if (pagination.variant && !['basic', 'advanced'].includes(pagination.variant)) {
      errors.push("'variant' must be either 'basic' or 'advanced'");
    }

    if (pagination.align && !['left', 'center', 'right'].includes(pagination.align)) {
      errors.push("'align' must be either 'left', 'center', or 'right'");
    }

    if (pagination.pageSizeOptions && Array.isArray(pagination.pageSizeOptions)) {
      pagination.pageSizeOptions.forEach((option, index) => {
        if (typeof option.value !== 'number' || option.value <= 0) {
          errors.push(`pageSizeOptions[${index}].value must be a positive number`);
        }
        if (typeof option.label !== 'string') {
          errors.push(`pageSizeOptions[${index}].label must be a string`);
        }
      });
    }
  }

  return errors;
};

/**
 * Validates zoom behavior, especially `maxScale`
 */
const validateZoom = (zoom?: ZoomConfig): string[] => {
  const errors: string[] = [];

  if (!zoom) return errors;

  if (zoom.enabled && zoom.maxScale && (typeof zoom.maxScale !== 'number' || zoom.maxScale <= 1)) {
    errors.push("'maxScale' must be a number greater than 1");
  }

  return errors;
};

/**
 * Validates card layout configuration including type, columns, and breakpoints
 */
const validateLayout = (layout?: CardLayoutOptions): string[] => {
  const errors: string[] = [];

  if (!layout) return errors;

  const layoutType = layout.type || 'grid';
  if (!['grid', 'masonry', 'carousel', 'stack'].includes(layoutType)) {
    errors.push("'type' must be one of: 'grid', 'masonry', 'carousel', 'stack'");
  }

  if (layout.columns && (typeof layout.columns !== 'number' || layout.columns <= 0)) {
    errors.push("'columns' must be a positive number");
  }

  if (layout.gap && (typeof layout.gap !== 'number' && typeof layout.gap !== 'string')) {
    errors.push("'gap' must be a number or string");
  }

  if (layout.padding && (typeof layout.padding !== 'number' && typeof layout.padding !== 'string')) {
    errors.push("'padding' must be a number or string");
  }

  // Grid-specific validation
  if (layout.gridOptions) {
    if (layout.gridOptions.autoFlow && !['auto-fit', 'auto-fill'].includes(layout.gridOptions.autoFlow)) {
      errors.push("'gridOptions.autoFlow' must be either 'auto-fit' or 'auto-fill'");
    }
  }

  // Carousel-specific validation
  if (layout.carouselOptions) {
    if (layout.carouselOptions.visibleCards && (typeof layout.carouselOptions.visibleCards !== 'number' || layout.carouselOptions.visibleCards <= 0)) {
      errors.push("'carouselOptions.visibleCards' must be a positive number");
    }
    if (layout.carouselOptions.autoPlay && (typeof layout.carouselOptions.autoPlay !== 'number' || layout.carouselOptions.autoPlay < 0)) {
      errors.push("'carouselOptions.autoPlay' must be a non-negative number");
    }
    if (layout.carouselOptions.arrowPosition && !['sides', 'bottom', 'top', 'none'].includes(layout.carouselOptions.arrowPosition)) {
      errors.push("'carouselOptions.arrowPosition' must be one of: 'sides', 'bottom', 'top', 'none'");
    }
    if (layout.carouselOptions.dotPosition && !['bottom', 'top', 'none'].includes(layout.carouselOptions.dotPosition)) {
      errors.push("'carouselOptions.dotPosition' must be one of: 'bottom', 'top', 'none'");
    }
    if (layout.carouselOptions.touchThreshold && (typeof layout.carouselOptions.touchThreshold !== 'number' || layout.carouselOptions.touchThreshold < 0)) {
      errors.push("'carouselOptions.touchThreshold' must be a non-negative number");
    }
    if (layout.carouselOptions.dragThreshold && (typeof layout.carouselOptions.dragThreshold !== 'number' || layout.carouselOptions.dragThreshold < 0)) {
      errors.push("'carouselOptions.dragThreshold' must be a non-negative number");
    }
  }

  // Stack-specific validation
  if (layout.stackOptions) {
    if (layout.stackOptions.maxVisible && (typeof layout.stackOptions.maxVisible !== 'number' || layout.stackOptions.maxVisible <= 0)) {
      errors.push("'stackOptions.maxVisible' must be a positive number");
    }
    if (layout.stackOptions.spreadDirection && !['horizontal', 'vertical'].includes(layout.stackOptions.spreadDirection)) {
      errors.push("'stackOptions.spreadDirection' must be either 'horizontal' or 'vertical'");
    }
    if (layout.stackOptions.peek && (typeof layout.stackOptions.peek !== 'number' || layout.stackOptions.peek < 0 || layout.stackOptions.peek > 100)) {
      errors.push("'stackOptions.peek' must be a number between 0 and 100");
    }
    if (layout.stackOptions.threshold && (typeof layout.stackOptions.threshold !== 'number' || layout.stackOptions.threshold < 0)) {
      errors.push("'stackOptions.threshold' must be a non-negative number");
    }
  }

  // Responsive layout validation
  if (layout.breakpoints && typeof layout.breakpoints === 'object') {
    Object.entries(layout.breakpoints).forEach(([key, value]) => {
      const screenWidth = Number(key);
      if (isNaN(screenWidth)) {
        errors.push(`Breakpoint key '${key}' must be a number`);
      }

      if (value?.columns && (typeof value.columns !== 'number' || value.columns <= 0)) {
        errors.push(`Breakpoint ${key}: 'columns' must be a positive number`);
      }

      if (value?.gap && (typeof value.gap !== 'number' && typeof value.gap !== 'string')) {
        errors.push(`Breakpoint ${key}: 'gap' must be a number or string`);
      }
    });
  }

  return errors;
};

/**
 * Validates field configuration for card content
 */
const validateFieldConfig = (config: CardFieldConfig): string[] => {
  const errors: string[] = [];

  if (!config.rows || !Array.isArray(config.rows)) {
    errors.push("'rows' must be an array in field configuration");
    return errors;
  }

  config.rows.forEach((row, rowIndex) => {
    if (!row.id || typeof row.id !== 'string') {
      errors.push(`Row at index ${rowIndex} must have a string 'id'`);
    }

    // Validate sections (left, center, right)
    const sections = ['left', 'center', 'right'] as const;
    sections.forEach(section => {
      if (row[section]) {
        if (!row[section]?.elements || !Array.isArray(row[section]?.elements)) {
          errors.push(`Row ${rowIndex} ${section} section must have an 'elements' array`);
        } else {
          row[section]?.elements.forEach((element, elementIndex) => {
            if (!element.id || typeof element.id !== 'string') {
              errors.push(`Element at index ${elementIndex} in row ${rowIndex} ${section} section must have a string 'id'`);
            }
            if (!element.component || typeof element.component !== 'function') {
              errors.push(`Element '${element.id}' in row ${rowIndex} ${section} section must have a 'component' function`);
            }
            if (element.align && !['left', 'center', 'right'].includes(element.align)) {
              errors.push(`Element '${element.id}' in row ${rowIndex} ${section} section must have valid alignment: 'left', 'center', or 'right'`);
            }
          });
        }
      }
    });
  });

  return errors;
};

/**
 * Validates template configuration for card content
 */
const validateTemplateConfig = (config: CardTemplateConfig): string[] => {
  const errors: string[] = [];

  if (!config.template || typeof config.template !== 'string') {
    errors.push("Template config: 'template' is required and must be a string");
  }

  if (config.helpers && typeof config.helpers !== 'object') {
    errors.push("Template config: 'helpers' must be an object with function properties");
  } else if (config.helpers) {
    Object.entries(config.helpers).forEach(([name, fn]) => {
      if (typeof fn !== 'function') {
        errors.push(`Template helper '${name}' must be a function`);
      }
    });
  }

  return errors;
};

/**
 * Validates default view configuration
 */
const validateDefaultView = (config: CardDefaultView): string[] => {
  const errors: string[] = [];

  if (config.excludeKeys && !Array.isArray(config.excludeKeys)) {
    errors.push("'excludeKeys' must be an array of strings");
  } else if (config.excludeKeys) {
    config.excludeKeys.forEach((key, index) => {
      if (typeof key !== 'string') {
        errors.push(`excludeKeys[${index}] must be a string`);
      }
    });
  }

  return errors;
};

/**
 * Validates content configuration based on its type
 */
const validateContent = (content: CardContentConfig): string[] => {
  const errors: string[] = [];

  if (!content) {
    errors.push("'content' is required");
    return errors;
  }

  switch (content.contentDisplayType) {
    case 'field-config':
      errors.push(...validateFieldConfig(content.content));
      break;
    case 'template-config':
      errors.push(...validateTemplateConfig(content.content));
      break;
    case 'default-view':
      errors.push(...validateDefaultView(content.content));
      break;
    default:
      errors.push(`Unknown content display type: ${(content as any).contentDisplayType}`);
  }

  return errors;
};

/**
 * Validates header card view configuration
 */
const validateHeaderCardView = (header?: HeaderCardViewOptions): string[] => {
  const errors: string[] = [];

  if (!header) return errors;

  if (header.headerConfig?.customItems && Array.isArray(header.headerConfig.customItems)) {
    header.headerConfig.customItems.forEach((item, index) => {
      if (!item.id || typeof item.id !== 'string') {
        errors.push(`Custom header item at index ${index} must have a string 'id'`);
      }
      if (!item.component) {
        errors.push(`Custom header item '${item.id}' must have a 'component'`);
      }
      if (item.align && !['left', 'center', 'right'].includes(item.align)) {
        errors.push(`Custom header item '${item.id}' must have valid alignment: 'left', 'center', or 'right'`);
      }
    });
  }

  return errors;
};

/**
 * Validates data item descriptions
 */
const validateDataItemDescriptions = (descriptions?: DataItemDescription[]): string[] => {
  const errors: string[] = [];

  if (!descriptions) return errors;

  if (!Array.isArray(descriptions)) {
    errors.push("'dataItemDescription' must be an array");
    return errors;
  }

  descriptions.forEach((desc, index) => {
    if (!desc.key || typeof desc.key !== 'string') {
      errors.push(`DataItemDescription at index ${index} must have a string 'key'`);
    }
    if (!desc.label || typeof desc.label !== 'string') {
      errors.push(`DataItemDescription at index ${index} must have a string 'label'`);
    }
    if (!desc.typeOfField || !['string', 'number', 'date', 'image', 'status', 'custom'].includes(desc.typeOfField)) {
      errors.push(`DataItemDescription at index ${index} must have a valid 'typeOfField'`);
    }

    // Validate filter configuration
    if (desc.filterConfiguration) {
      if (desc.filterConfiguration.filterType && !['text', 'select', 'range', 'date'].includes(desc.filterConfiguration.filterType)) {
        errors.push(`DataItemDescription '${desc.key}' has invalid filterType`);
      }
    }

    // Validate editable configuration
    if (desc.editableConfiguration) {
      const validEditorTypes = ['text', 'textarea', 'number', 'select', 'multi-select', 'date', 'datetime', 'checkbox', 'radio', 'color', 'file', 'rich-text'];
      if (desc.editableConfiguration.editorType && !validEditorTypes.includes(desc.editableConfiguration.editorType)) {
        errors.push(`DataItemDescription '${desc.key}' has invalid editorType`);
      }
      if (desc.editableConfiguration.onEdit && typeof desc.editableConfiguration.onEdit !== 'function') {
        errors.push(`DataItemDescription '${desc.key}' onEdit must be a function`);
      }
    }
  });

  return errors;
};

/**
 * Validates segregated data configuration
 */
const validateSegregatedData = (segregatedData?: SegregatedData): string[] => {
  const errors: string[] = [];

  if (!segregatedData) return errors;

  if (!segregatedData.sections || !Array.isArray(segregatedData.sections)) {
    errors.push("'sections' must be an array in segregated data");
    return errors;
  }

  segregatedData.sections.forEach((section, index) => {
    if (!section.id || typeof section.id !== 'string') {
      errors.push(`Section at index ${index} must have a string 'id'`);
    }
    if (!section.content) {
      errors.push(`Section '${section.id}' must have 'content' configuration`);
    } else {
      errors.push(...validateContent(section.content));
    }
    if (section.headerConfig) {
      errors.push(...validateHeaderCardView(section.headerConfig as HeaderCardViewOptions));
    }
  });

  return errors;
};

/**
 * Runs all the validation functions and aggregates their errors
 */
const validateCardViewProps = (props: CardViewOptions): string[] => {
  const errors: string[] = [];
  console.log("props", props)
  // Validate data mode
  if (!props.dataMode || !['normal', 'segregated'].includes(props.dataMode)) {
    errors.push("'dataMode' must be either 'normal' or 'segregated'");
  }

  // Validate data based on mode
  if (props.dataMode === 'normal') {
    if (!props.data) {
      errors.push("'data' is required for normal data mode");
    } else {
      errors.push(...validateDataItems(props.data));
    }
  } else if (props.dataMode === 'segregated') {
    if (!props.segregatedData) {
      errors.push("'segregatedData' is required for segregated data mode");
    } else {
      errors.push(...validateSegregatedData(props.segregatedData));
    }
  }

  // Validate renderCard function if provided
  if (props.renderCard && typeof props.renderCard !== 'function') {
    errors.push("'renderCard' must be a function");
  }

  // Validate content configuration
  if (!props.content) {
    errors.push("'content' is required");
  } else {
    errors.push(...validateContent(props.content));
  }

  // Validate data item descriptions if provided
  if (props.dataItemDescription) {
    errors.push(...validateDataItemDescriptions(props.dataItemDescription));
  }

  // Validate header configuration if provided
  if (props.headerCardView) {
    errors.push(...validateHeaderCardView(props.headerCardView));
  }

  // Validate other configurations
  if (props.layout) errors.push(...validateLayout(props.layout));
  if (props.interactions) errors.push(...validateInteractions(props.interactions));
  if (props.dataOperations) errors.push(...validateDataOperations(props.dataOperations));
  if (props.paginationOptions) errors.push(...validatePagination(props.paginationOptions));
  if (props.zoom) errors.push(...validateZoom(props.zoom));

  if (props.virtualScroll && props.layout?.type !== 'grid') {
    errors.push("'virtualScroll' requires layout type to be 'grid'");
  }

  if (props.lazyLoad && !props.virtualScroll) {
    errors.push("'lazyLoad' requires 'virtualScroll' to be enabled");
  }

  return errors;
};

type ValidateCardViewProps = {
  options: CardViewOptions;
};

/**
 * CardView wrapper component that validates configuration
 * and displays error list if invalid
 */
const ValidateCardView = forwardRef<any, ValidateCardViewProps>(
  ({ options }, refForFunctionalities) => {
    const errors = validateCardViewProps(options)
  if (errors.length > 0) {
    console.error("CardView validation errors:", errors);
    return (
      <div className={styles.cardViewValidationError}>
        <h3>CardView Configuration Errors</h3>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
     <RenderCardView
      options={options}
      refForFunctionalities={refForFunctionalities}
    />
  );
});

ValidateCardView.displayName = "ValidateCardView";

export default ValidateCardView;
