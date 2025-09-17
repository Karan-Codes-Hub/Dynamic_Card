import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { DataItemDescription } from '../InterfacesForCardView';

/**
 * Custom hook to generate sorting options and filter configurations
 * based on provided data item descriptions
 * 
 * @param {Array} dataItemDescriptions - Array of objects describing each data field
 * @returns {Object} Object containing sortingOptions, filterConfigurations, and configToApplyFilters
 */
const useValuesForFunctionalitiesButtons = (dataItemDescriptions: DataItemDescription[]) => {
  // Generate sorting options from data item descriptions
  const sortingOptions = useMemo(() => {
    return dataItemDescriptions
      .filter(item => item.sortConfiguration?.canSort)
      .map((item, index) => ({
        id: `${index + 1}`,
        key: item.key,
        label: item.label,
        typeOfField: item.typeOfField
      }));
  }, [dataItemDescriptions]);

  // Generate filter configurations from data item descriptions (original structure)
  const filterConfigurations = useMemo(() => {
    return dataItemDescriptions
      .filter(item => item.filterConfiguration?.canFilter)
      .map(item => {
        const baseConfig = {
          id: item.key,
          name: item.label,
          type: mapFilterTypeToComponentType(item.filterConfiguration.filterType, item.typeOfField)
        };

        // Add properties based on filter type
        switch (baseConfig.type) {
          case 'checkbox':
          case 'radio':
            return {
              ...baseConfig,
              values: item.filterConfiguration.filterOptions || [],
              singleSelect: baseConfig.type === 'radio'
            };
          
          case 'select':
            return {
              ...baseConfig,
              values: item.filterConfiguration.filterOptions || [],
              singleSelect: true
            };
          
          case 'date':
            return {
              ...baseConfig,
              isRange: item.filterConfiguration.filterType === 'range',
              allowedDateRange: {
                start: '2020-01-01',
                end: dayjs().format('YYYY-MM-DD')
              }
            };
          
          case 'text':
            return baseConfig;
          
          case 'range':
            return {
              ...baseConfig,
              conditions: ['Greater than', 'Less than', 'Equal to'],
              values: []
            };
          
          default:
            return baseConfig;
        }
      });
  }, [dataItemDescriptions]);

  // Generate configToApplyFilters with the new structure
  const configToApplyFilters = useMemo(() => {
    return dataItemDescriptions
      .filter(item => item.filterConfiguration?.canFilter)
      .map(item => {
        const baseConfig = {
          id: item.key,
          label: item.label,
        };

        // Map to the appropriate filter type based on filter configuration
        switch (item.filterConfiguration.filterType) {
          // case 'checkbox':
          //   return {
          //     ...baseConfig,
          //     type: 'checkbox' as const,
          //     options: item.filterConfiguration.filterOptions || []
          //   };
          
          // case 'radio':
          case 'select':
            return {
              ...baseConfig,
              type: 'dropdown' as const,
              options: item.filterConfiguration.filterOptions || [],
              singleSelect: true
            };
          
          case 'date':
          // case 'dateRange':
            // return {
            //   ...baseConfig,
            //   type: 'date' as const,
            //   isRange: item.filterConfiguration.filterType === 'dateRange'
            // };
          
          case 'text':
            return {
              ...baseConfig,
              type: 'text' as const
            };
          
          case 'range':
            if (item.typeOfField === 'number') {
              return {
                ...baseConfig,
                type: 'range' as const,
                min: 0, // Default values, you might want to calculate these
                max: 1000 // Default values, you might want to calculate these
              };
            } else {
              return {
                ...baseConfig,
                type: 'dropdownConditionMatching' as const,
                conditions: ['contains', 'equals', 'starts with']
              };
            }
          
          default:
            return {
              ...baseConfig,
              type: 'text' as const
            };
        }
      });
  }, [dataItemDescriptions]);

  return {
    sortingOptions,
    filterConfigurations,
    configToApplyFilters
  };
};

// Helper function to map filter type to component type
const mapFilterTypeToComponentType = (filterType, fieldType) => {
  const typeMap = {
    text: 'text',
    select: 'select',
    checkbox: 'checkbox',
    radio: 'radio',
    date: 'date',
    dateRange: 'date',
    range: 'range'
  };
  
  return typeMap[filterType] || 'text';
};

export default useValuesForFunctionalitiesButtons;