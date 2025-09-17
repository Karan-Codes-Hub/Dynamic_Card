import { useState, useCallback, useMemo } from 'react';
import 
type
{ 
  CardViewOptions, 
  DataItem, 
  CardLayoutOptions, 
  CardInteractions, 
  DataOperations, 
  PaginationConfig, 
  ZoomConfig,
  HeaderCardViewOptions,
  CardContentConfig,
  SegregatedData,
  CardSection,
  DataItemDescription
} from '../InterfacesForCardView'; // Adjust the import path

/**
 * Hook for managing and updating card view configuration in real-time
 * @param initialConfig - Initial card view configuration
 * @returns Object with current configuration and update methods
 */
export const useCardViewConfig = (initialConfig: CardViewOptions) => {
  const [config, setConfig] = useState<CardViewOptions>(initialConfig);

  // General update method
  const updateConfig = useCallback((updates: Partial<CardViewOptions>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Data methods
  const updateData = useCallback((newData: DataItem[]) => {
    setConfig(prev => ({ ...prev, data: newData }));
  }, []);

  const updateDataItem = useCallback((itemId: string, updates: Partial<DataItem>) => {
    setConfig(prev => ({
      ...prev,
      data: prev.data.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
  }, []);

  const addDataItem = useCallback((newItem: DataItem) => {
    setConfig(prev => ({ ...prev, data: [...prev.data, newItem] }));
  }, []);

  const removeDataItem = useCallback((itemId: string) => {
    setConfig(prev => ({
      ...prev,
      data: prev.data.filter(item => item.id !== itemId)
    }));
  }, []);

  // Layout methods
  const updateLayout = useCallback((layoutUpdates: Partial<CardLayoutOptions>) => {
    setConfig(prev => ({
      ...prev,
      layout: { ...prev.layout, ...layoutUpdates }
    }));
  }, []);

  // Interaction methods
  const updateInteractions = useCallback((interactionUpdates: Partial<CardInteractions>) => {
    setConfig(prev => ({
      ...prev,
      interactions: { ...prev.interactions, ...interactionUpdates }
    }));
  }, []);

  // Data operations methods
  const updateDataOperations = useCallback((operationsUpdates: Partial<DataOperations>) => {
    setConfig(prev => ({
      ...prev,
      dataOperations: { ...prev.dataOperations, ...operationsUpdates }
    }));
  }, []);

  // Pagination methods
  const updatePagination = useCallback((paginationUpdates: Partial<PaginationConfig>) => {
    setConfig(prev => ({
      ...prev,
      paginationOptions: { ...prev.paginationOptions, ...paginationUpdates }
    }));
  }, []);

  // Zoom methods
  const updateZoom = useCallback((zoomUpdates: Partial<ZoomConfig>) => {
    setConfig(prev => ({
      ...prev,
      zoom: { ...prev.zoom, ...zoomUpdates }
    }));
  }, []);

  // Header methods
  const updateHeader = useCallback((headerUpdates: Partial<HeaderCardViewOptions>) => {
    setConfig(prev => ({
      ...prev,
      headerCardView: { ...prev.headerCardView, ...headerUpdates }
    }));
  }, []);

  // Content methods
//   const updateContent = useCallback((contentUpdates: Partial<CardContentConfig>) => {
//     setConfig(prev => ({
//       ...prev,
//       content: { ...prev.content, ...contentUpdates }
//     }));
//   }, []);

  // Data item description methods
  const updateDataItemDescriptions = useCallback((descriptions: DataItemDescription[]) => {
    setConfig(prev => ({ ...prev, dataItemDescription: descriptions }));
  }, []);

  // Segregated data methods (for dataMode: 'segregated')
  const updateSegregatedData = useCallback((segregatedUpdates: Partial<SegregatedData>) => {
    setConfig(prev => ({
      ...prev,
      segregatedData: { ...prev.segregatedData, ...segregatedUpdates }
    }));
  }, []);

  const updateSection = useCallback((sectionId: string, sectionUpdates: Partial<CardSection>) => {
    setConfig(prev => {
      if (!prev.segregatedData?.sections) return prev;

      return {
        ...prev,
        segregatedData: {
          ...prev.segregatedData,
          sections: prev.segregatedData.sections.map(section =>
            section.id === sectionId ? { ...section, ...sectionUpdates } : section
          )
        }
      };
    });
  }, []);

  const addSection = useCallback((newSection: CardSection) => {
    setConfig(prev => ({
      ...prev,
      segregatedData: {
        ...prev.segregatedData,
        sections: [...(prev.segregatedData?.sections || []), newSection]
      }
    }));
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setConfig(prev => ({
      ...prev,
      segregatedData: {
        ...prev.segregatedData,
        sections: (prev.segregatedData?.sections || []).filter(section => section.id !== sectionId)
      }
    }));
  }, []);

  // Reset to initial configuration
  const resetConfig = useCallback(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  // Export current configuration
  const exportConfig = useCallback(() => {
    return config;
  }, [config]);

  // Memoized methods object to prevent unnecessary re-renders
  const methods = useMemo(() => ({
    // General
    updateConfig,
    resetConfig,
    exportConfig,
    
    // Data
    updateData,
    updateDataItem,
    addDataItem,
    removeDataItem,
    
    // Layout
    updateLayout,
    
    // Interactions
    updateInteractions,
    
    // Data operations
    updateDataOperations,
    
    // Pagination
    updatePagination,
    
    // Zoom
    updateZoom,
    
    // Header
    updateHeader,
    
    // Content
    // updateContent,
    
    // Data item descriptions
    updateDataItemDescriptions,
    
    // Segregated data
    updateSegregatedData,
    updateSection,
    addSection,
    removeSection
  }), [
    updateConfig, resetConfig, exportConfig, updateData, updateDataItem, 
    addDataItem, removeDataItem, updateLayout, updateInteractions, 
    updateDataOperations, updatePagination, updateZoom, updateHeader, 
     updateDataItemDescriptions, updateSegregatedData, 
    updateSection, addSection, removeSection
  ]);

  return {
    config,
    methods
  };
};

// Example usage:
/*
const { config, methods } = useCardViewConfig(initialCardViewConfig);

// Update layout
methods.updateLayout({ type: 'masonry', columns: 4 });

// Update pagination
methods.updatePagination({ itemsPerPage: 20, variant: 'advanced' });

// Add new data item
methods.addDataItem({ id: 'new-item', name: 'New Item', value: 100 });

// Update section in segregated data
methods.updateSection('personal-info', { 
  style: { backgroundColor: '#f0f0f0' },
  collapsible: true 
});
*/