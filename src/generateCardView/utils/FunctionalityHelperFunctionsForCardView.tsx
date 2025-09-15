import dayjs from 'dayjs';

/**
 * Base interface for all filters
 * @example
 * {
 *   id: 'category',
 *   name: 'Product Category'
 * }
 */
interface FilterBase {
  id: string;
  name: string;
}

/**
 * Date filter configuration
 * @example
 * {
 *   id: 'createdAt',
 *   name: 'Creation Date',
 *   type: 'date',
 *   isRange: true,
 *   allowedDateRange: { start: '2023-01-01', end: '2023-12-31' }
 * }
 */
interface DateFilter extends FilterBase {
  type: 'date';
  allowedDateRange?: { start: string; end: string };
  isRange?: boolean;
}

/**
 * Checkbox filter configuration
 * @example
 * {
 *   id: 'status',
 *   name: 'Status',
 *   type: 'checkbox',
 *   values: ['active', 'pending', 'archived']
 * }
 */
interface CheckboxFilter extends FilterBase {
  type: 'checkbox';
  values: string[];
}

/**
 * Dropdown filter configuration
 * @example
 * {
 *   id: 'department',
 *   name: 'Department',
 *   type: 'dropdown',
 *   values: ['HR', 'Engineering', 'Marketing'],
 *   singleSelect: true
 * }
 */
interface DropdownFilter extends FilterBase {
  type: 'dropdown';
  values: string[];
  singleSelect?: boolean;
}

/**
 * Dropdown filter with conditional string matching
 * @example
 * {
 *   id: 'name',
 *   name: 'Name Filter',
 *   type: 'dropdownConditionMatching',
 *   conditions: ['contains', 'equals', 'starts with']
 * }
 */
interface DropdownConditionMatchingFilter extends FilterBase {
  type: 'dropdownConditionMatching';
  conditions: string[];
}

/**
 * Text filter with conditions like contains, equals, etc.
 * @example
 * {
 *   id: 'description',
 *   name: 'Description',
 *   type: 'text'
 * }
 */
interface TextFilter extends FilterBase {
  type: 'text';
}

/**
 * Number filter with conditions like greater than, between, etc.
 * @example
 * {
 *   id: 'price',
 *   name: 'Price',
 *   type: 'number'
 * }
 */
interface NumberFilter extends FilterBase {
  type: 'number';
}

/**
 * Union type representing all possible filters
 * @example
 * const filters: Filter[] = [
 *   {
 *     id: 'date',
 *     name: 'Date',
 *     type: 'date',
 *     isRange: true
 *   },
 *   {
 *     id: 'category',
 *     name: 'Category',
 *     type: 'dropdown',
 *     values: ['Books', 'Electronics']
 *   }
 * ]
 */
export type Filter = DateFilter | CheckboxFilter | DropdownFilter |
              DropdownConditionMatchingFilter | TextFilter | NumberFilter;

/**
 * Single filter's current value
 * @example
 * const dateFilterValue = { start: '2023-01-01', end: '2023-01-31' }
 * const checkboxFilterValue = new Set(['active', 'pending'])
 */
type FilterValue = any;

/**
 * Record of active filters keyed by their ID
 * @example
 * {
 *   dateRange: { start: '2023-01-01', end: '2023-01-31' },
 *   status: new Set(['active']),
 *   category: 'Electronics'
 * }
 */
type FilterValues = Record<string, FilterValue>;

/**
 * Abstract base class for all filter handlers
 * @example
 * class CustomFilterHandler extends FilterHandler {
 *   matches(itemValue, filterValue, filterDef) {
 *     // Custom implementation
 *   }
 * }
 */
abstract class FilterHandler {
  abstract matches(itemValue: any, filterValue: FilterValue, filterDef: Filter): boolean;

  /**
   * Shared text-based condition evaluation
   * @example
   * compareText('hello world', 'contains', 'hello') // returns true
   */
  protected compareText(value: string, condition: string, filterText: string): boolean {
    const fieldVal = value.toLowerCase();
    const filterVal = filterText.toLowerCase();

    switch (condition) {
      case 'equals': return fieldVal === filterVal;
      case 'not equals': return fieldVal !== filterVal;
      case 'contains': return fieldVal.includes(filterVal);
      case 'does not contain': return !fieldVal.includes(filterVal);
      case 'starts with': return fieldVal.startsWith(filterVal);
      case 'ends with': return fieldVal.endsWith(filterVal);
      case 'is empty': return !fieldVal || fieldVal.trim() === '';
      case 'is not empty': return !!fieldVal && fieldVal.trim() !== '';
      default: return true;
    }
  }
}

/**
 * Handles date-based filtering
 * @example
 * const handler = new DateFilterHandler();
 * const matches = handler.matches('2023-01-15', { start: '2023-01-01', end: '2023-01-31' }, { isRange: true });
 */
class DateFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: FilterValue, filterDef: DateFilter): boolean {
    if (!filterValue) return true;

    if (filterDef.isRange) {
      return this.handleDateRange(itemValue, filterValue);
    }
    return dayjs(itemValue).isSame(dayjs(filterValue), 'day');
  }

  private handleDateRange(fieldValue: string, filterValue: { start?: string; end?: string }): boolean {
    const fieldDate = dayjs(fieldValue);
    const startDate = filterValue.start ? dayjs(filterValue.start) : null;
    const endDate = filterValue.end ? dayjs(filterValue.end) : null;

    if (startDate && endDate) {
      return fieldDate.isAfter(startDate) && fieldDate.isBefore(endDate);
    } else if (startDate) {
      return fieldDate.isAfter(startDate);
    } else if (endDate) {
      return fieldDate.isBefore(endDate);
    }
    return true;
  }
}

/**
 * Handles checkbox-based filtering
 * @example
 * const handler = new CheckboxFilterHandler();
 * const matches = handler.matches('active', new Set(['active', 'pending']));
 */
class CheckboxFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: Set<string>): boolean {
    if (!filterValue || filterValue.size === 0) return true;

    const fieldValues = Array.isArray(itemValue) ? itemValue : [itemValue];
    return fieldValues.some(val => filterValue.has(String(val)));
  }
}

/**
 * Handles dropdown filtering with optional multi-select
 * @example
 * const handler = new DropdownFilterHandler();
 * const matches = handler.matches('HR', ['HR', 'Finance'], { type: 'dropdown' });
 */
class DropdownFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: FilterValue, filterDef: DropdownFilter): boolean {
    if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true;

    // Convert itemValue into array for uniformity
    const fieldValues = Array.isArray(itemValue) ? itemValue.map(String) : [String(itemValue)];

    if (Array.isArray(filterValue)) {
      const normalizedFilters = filterValue.map(fv => String(fv.value));
      return fieldValues.some(val => normalizedFilters.includes(val));
    }

    return fieldValues.includes(String(filterValue.value));
  }
}


/**
 * Handles filters with condition + value (e.g., dropdownConditionMatching)
 * @example
 * const handler = new ConditionalFilterHandler();
 * const matches = handler.matches('hello world', { condition: 'contains', value: 'hello' });
 */
class ConditionalFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: { condition: string; value: string }): boolean {
    if (!filterValue || !filterValue.condition) return true;
    return this.compareText(String(itemValue), filterValue.condition, filterValue.value);
  }
}

/**
 * Handles text field filters with conditions
 * @example
 * const handler = new TextFilterHandler();
 * const matches = handler.matches('hello', { condition: 'starts with', value: 'he' });
 */
class TextFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: { condition: string; value: string }): boolean {
    if (!filterValue || !filterValue.condition) return true;
    return this.compareText(String(itemValue), filterValue.condition, filterValue.value);
  }
}

/**
 * Handles number filters with range, conditionals, etc.
 * @example
 * const handler = new NumberFilterHandler();
 * const matches = handler.matches(42, { condition: 'greater than', value: 30 });
 */
class NumberFilterHandler extends FilterHandler {
  matches(itemValue: any, filterValue: { condition: string; value: number | [number, number] }): boolean {
    if (!filterValue || !filterValue.condition) return true;

    const numValue = Number(itemValue);
    if (isNaN(numValue)) return false;

    switch (filterValue.condition) {
      case 'equals': return numValue === Number(filterValue.value);
      case 'not equals': return numValue !== Number(filterValue.value);
      case 'greater than': return numValue > Number(filterValue.value);
      case 'greater than or equal': return numValue >= Number(filterValue.value);
      case 'less than': return numValue < Number(filterValue.value);
      case 'less than or equal': return numValue <= Number(filterValue.value);
      case 'between':
        if (Array.isArray(filterValue.value) && filterValue.value.length === 2) {
          return numValue >= filterValue.value[0] && numValue <= filterValue.value[1];
        }
        return true;
      case 'is empty': return itemValue === null || itemValue === undefined || itemValue === '';
      case 'is not empty': return itemValue !== null && itemValue !== undefined && itemValue !== '';
      default: return true;
    }
  }
}

/**
 * Filter manager responsible for applying all filters to data
 * @example
 * const filterManager = new FilterManager();
 * const filteredData = filterManager.applyFilters(
 *   products,
 *   { price: { condition: 'less than', value: 100 } },
 *   [{ id: 'price', name: 'Price', type: 'number' }]
 * );
 */
export class FilterManager {
  private handlers: Record<string, FilterHandler> = {
    date: new DateFilterHandler(),
    checkbox: new CheckboxFilterHandler(),
    dropdown: new DropdownFilterHandler(),
    dropdownConditionMatching: new ConditionalFilterHandler(),
    text: new TextFilterHandler(),
    number: new NumberFilterHandler(),
  };

  /**
   * Applies active filters to a dataset
   * @example
   * const result = filterManager.applyFilters(
   *   [{ id: 1, price: 50 }, { id: 2, price: 150 }],
   *   { price: { condition: 'less than', value: 100 } },
   *   [{ id: 'price', name: 'Price', type: 'number' }]
   * );
   * // Returns [{ id: 1, price: 50 }]
   */
  applyFilters(data: any[], filters: FilterValues, filterConfig: Filter[]): any[] {
    if (!filters || Object.keys(filters).length === 0) return data;

    return data.filter(item => {
      return Object.entries(filters).every(([filterId, filterValue]) => {
        const filterDef = filterConfig.find(f => f.id === filterId);
      
        if (!filterDef) return true;

        const handler = this.handlers[filterDef.type];
        if (!handler) return true;

        const itemValue = item[filterId];
        return handler.matches(itemValue, filterValue, filterDef);
      });
    });
  }
}

/**
 * Sorting configuration types
 * @example
 * const sortConfig: SortConfig = [
 *   { field: 'name', direction: 'asc' },
 *   { field: 'price', direction: 'desc' }
 * ]
 */
interface SortCriteria {
  field: string;
  direction: 'asc' | 'desc';
}

export type SortConfig = SortCriteria[];

/**
 * Sorts data based on multiple criteria
 * @example
 * const sorted = DataSorter.sort(
 *   [{ name: 'B', price: 10 }, { name: 'A', price: 20 }],
 *   [{ field: 'name', direction: 'asc' }]
 * );
 */
export class DataSorter {
  /**
   * Sorts an array of items based on the provided sort configuration
   * @example
   * const sortedProducts = DataSorter.sort(products, [
   *   { field: 'category', direction: 'asc' },
   *   { field: 'price', direction: 'desc' }
   * ]);
   */
  static sort<T extends Record<string, any>>(data: T[], sortConfig: SortConfig): T[] {
    if (!sortConfig || sortConfig.length === 0) return [...data];

    return [...data].sort((a, b) => {
      for (const criteria of sortConfig) {
        const comparison = this.compareValues(a[criteria.field], b[criteria.field]);
        if (comparison !== 0) {
          return criteria.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }

  /**
   * Compares two values of any type for sorting
   * @example
   * compareValues('a', 'b') // returns -1
   * compareValues(10, 5) // returns 1
   */
  private static compareValues(a: any, b: any): number {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;

    if (this.isDate(a) && this.isDate(b)) {
      return new Date(a).getTime() - new Date(b).getTime();
    }

    if (typeof a === 'number' && typeof b === 'number') {
      return a - b;
    }

    return String(a).localeCompare(String(b));
  }

  private static isDate(value: any): boolean {
    if (value instanceof Date) return true;
    return !isNaN(Date.parse(value));
  }
}

/**
 * Search configuration types
 * @example
 * const searchConfig: SearchConfig = {
 *   fields: ['name', 'description'],
 *   query: 'laptop',
 *   caseSensitive: false
 * }
 */
export interface SearchConfig {
  fields: string[];
  query: string;
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

/**
 * Provides text search functionality across multiple fields
 * @example
 * const results = DataSearcher.search(
 *   products,
 *   { fields: ['name'], query: 'phone', caseSensitive: false }
 * );
 */
export class DataSearcher {
  /**
   * Searches data based on the provided configuration
   * @example
   * const matchingItems = DataSearcher.search(
   *   [{ name: 'iPhone' }, { name: 'Samsung' }],
   *   { fields: ['name'], query: 'iphone' }
   * );
   */
  static search<T extends Record<string, any>>(data: T[], config: SearchConfig): T[] {
    if (!config?.query) return [...data];

    const { fields, query, caseSensitive = false, exactMatch = false } = config;
    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return data.filter(item => {
      return fields.some(field => {
        const fieldValue = item[field];
        if (fieldValue == null) return false;

        const valueToSearch = caseSensitive 
          ? String(fieldValue) 
          : String(fieldValue).toLowerCase();

        return exactMatch
          ? valueToSearch === searchTerm
          : valueToSearch.includes(searchTerm);
      });
    });
  }
}