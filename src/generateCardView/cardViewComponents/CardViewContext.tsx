// CardViewContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import type { CardViewOptions, CardViewInstance } from '../InterfacesForCardView';

/**
 * Defines the shape of the context value for the Card View system.
 * 
 * - `options`: Current card view options passed to the main component.
 * - `instance`: Optional reference to the live card view instance (if needed).
 * - `updateOptions`: A method to update the current options dynamically.
 * - `customProperties`: Object containing custom properties added dynamically.
 * - `addCustomProperty`: Method to add custom properties to the context.
 * - `removeCustomProperty`: Method to remove custom properties from the context.
 */
interface CardViewContextType {
  options: CardViewOptions;
  refForFunctionalities?: any;
  instance?: CardViewInstance;
  updateOptions?: (newOptions: Partial<CardViewOptions>) => void;
  customProperties: Record<string, any>;
  addCustomProperty: (key: string, value: any) => void;
  removeCustomProperty: (key: string) => void;
}

/**
 * React context for the Card View system.
 * This context allows nested components to access or update
 * the card view options and instance globally, without prop drilling.
 */
const CardViewContext = createContext<CardViewContextType | undefined>(undefined);

/**
 * Props for the `CardViewProvider` component.
 * 
 * - `options`: The initial configuration for the card view component.
 * - `instance`: Optional card view instance object.
 * - `children`: React children that should have access to the context.
 */
interface CardViewProviderProps {
  options: CardViewOptions;
  refForFunctionalities: any;
  instance?: CardViewInstance;
  children?: ReactNode;
}

/**
 * CardViewProvider
 * 
 * A context provider component that wraps your card view system.
 * It provides the card view options and instance to all nested components.
 * 
 * You can also dynamically update options and add custom properties.
 * 
 * @example
 * ```tsx
 * <CardViewProvider options={initialOptions}>
 *   <CardView />
 * </CardViewProvider>
 * ```
 */
export const CardViewProvider: React.FC<CardViewProviderProps> = ({
  options,
  refForFunctionalities,
  instance,
  children,
}) => {
  const [currentOptions, setCurrentOptions] = React.useState<CardViewOptions>(options);
  const [customProperties, setCustomProperties] = React.useState<Record<string, any>>({});

  /**
   * Updates the current card view options by merging with new partial values.
   * 
   * @param newOptions Partial updates to the card view options.
   */
  const updateOptions = (newOptions: Partial<CardViewOptions>) => {
    setCurrentOptions(prev => ({ ...prev, ...newOptions }));
  };

  /**
   * Adds a custom property to the context.
   * 
   * @param key The key for the custom property.
   * @param value The value of the custom property.
   */
  const addCustomProperty = (key: string, value: any) => {
    setCustomProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Removes a custom property from the context.
   * 
   * @param key The key of the custom property to remove.
   */
  const removeCustomProperty = (key: string) => {
    setCustomProperties(prev => {
      const newProperties = { ...prev };
      delete newProperties[key];
      return newProperties;
    });
  };

  return (
    <CardViewContext.Provider value={{
      options: currentOptions,
      refForFunctionalities : refForFunctionalities,
      instance,
      updateOptions,
      customProperties,
      addCustomProperty,
      removeCustomProperty,
    }}>
      {children}
    </CardViewContext.Provider>
  );
};

/**
 * Custom hook to access the CardViewContext.
 * 
 * Must be used inside a `CardViewProvider` or it will throw an error.
 * 
 * @returns The current context value including options, instance, updateOptions, and custom properties methods.
 * 
 * @example
 * ```tsx
 * const { options, updateOptions, addCustomProperty, customProperties } = getCardViewOptions();
 * updateOptions({ visible: false });
 * addCustomProperty('userPreferences', { theme: 'dark' });
 * ```
 */
export const getCardViewOptions = () => {
  const context = useContext(CardViewContext);
  if (context === undefined) {
    throw new Error('getCardViewOptions must be used within a CardViewProvider');
  }
  return context;
};