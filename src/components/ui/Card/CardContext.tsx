import { createContext, useContext } from 'react';

// Context for Card compound components
export interface CardContextValue {
  size: 'sm' | 'md' | 'lg';
  isExpanded: boolean;
  isCollapsible: boolean;
  toggleExpanded: () => void;
  isLoading: boolean;
}

export const CardContext = createContext<CardContextValue>({
  size: 'md',
  isExpanded: true,
  isCollapsible: false,
  toggleExpanded: () => { },
  isLoading: false,
});

// Hook for consuming card context
export const useCardContext = () => useContext(CardContext);
