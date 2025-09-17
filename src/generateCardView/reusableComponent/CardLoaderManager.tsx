    import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  ReactNode,
} from "react";
import type { CardLoaderProps } from "../InterfacesForCardView";
import CardLoader from "./CardLoader";

export interface CardLoaderManagerRef {
  showCardLoader: (cardId: string) => void;
  hideCardLoader: (cardId: string) => void;
  isCardLoading: (cardId: string) => boolean;
}

/**
 * Utility function to get the appropriate loader
 * based on props. If no props are provided, returns
 * a default spinner loader.
 */
export function getLoader(props?: CardLoaderProps): JSX.Element {
  if (!props) {
    return <CardLoader variant="spinner" size="medium" message="Loading..." />;
  }
  return <CardLoader {...props} />;
}

/**
 * CardLoaderManager
 *
 * Parent wrapper to manage multiple card loaders
 * via exposed methods (`showCardLoader`, `hideCardLoader`, `isCardLoading`).
 */
const CardLoaderManager = forwardRef<CardLoaderManagerRef, { children: ReactNode }>(
  ({ children }, ref) => {
    const [loadingCards, setLoadingCards] = useState<Set<string>>(new Set());

    useImperativeHandle(ref, () => ({
      showCardLoader: (cardId: string) => {
         console.log("loading caard")
        setLoadingCards((prev) => new Set(prev).add(cardId));
      },
      hideCardLoader: (cardId: string) => {
         console.log("loading caard")   
        setLoadingCards((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cardId);
          return newSet;
        });
      },
      isCardLoading: (cardId: string) => loadingCards.has(cardId),
    }));

    return <>{children}</>;
  }
);

export default CardLoaderManager;
