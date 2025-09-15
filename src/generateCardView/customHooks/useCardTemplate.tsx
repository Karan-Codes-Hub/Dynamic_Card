import { useCallback } from "react";
import { CardTemplateConfig, DataItem } from "../InterfacesForCardView";

/**
 * Hook to parse and render a templated card string using data and optional helper functions.
 *
 * @param config - Object containing the string template and optional helper functions.
 * @returns A `renderTemplate` function that returns the rendered string for a given data item.
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useCardTemplate } from './hooks/useCardTemplate';
 * 
 * const config = {
 *   template: "Hello, {{uppercase(name)}}! Your score is {{score}}.",
 *   helpers: {
 *     uppercase: (str: string) => str.toUpperCase()
 *   }
 * };
 * 
 * const data = [
 *   { name: "alice", score: 95 },
 *   { name: "bob", score: 88 }
 * ];
 * 
 * const TemplateCardView = () => {
 *   const { renderTemplate } = useCardTemplate(config);
 * 
 *   return (
 *     <div>
 *       {data.map((item, index) => (
 *         <p key={index}>{renderTemplate(item)}</p>
 *       ))}
 *     </div>
 *   );
 * };
 * 
 * export default TemplateCardView;
 * ```
 */
export function useCardTemplate(config: CardTemplateConfig) {
  const renderTemplate = useCallback((item: DataItem) => {
    let output = config.template;

    // Basic variable replacement
    output = output.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return item[key] ?? '';
    });

    // Helper function support
    if (config.helpers) {
      output = output.replace(/\{\{(\w+)\((.*?)\)\}\}/g, (_, helperName, args) => {
        const helper = config.helpers?.[helperName];
        if (helper) {
          const parsedArgs = args.split(',').map(arg => {
            const trimmed = arg.trim();
            return trimmed.startsWith('"') || trimmed.startsWith("'") 
              ? trimmed.slice(1, -1)
              : item[trimmed] ?? trimmed;
          });
          return helper(...parsedArgs);
        }
        return '';
      });
    }

    return output;
  }, [config.template, config.helpers]);

  return {
    renderTemplate
  };
}
