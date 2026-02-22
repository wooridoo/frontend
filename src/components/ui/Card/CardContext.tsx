import { createContext, useContext } from 'react';

// 보조 처리
export interface CardContextValue {
  size: 'sm' | 'md' | 'lg';
  isExpanded: boolean;
  isCollapsible: boolean;
  toggleExpanded: () => void;
  isLoading: boolean;
}

/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const CardContext = createContext<CardContextValue>({
  size: 'md',
  isExpanded: true,
  isCollapsible: false,
  toggleExpanded: () => { },
  isLoading: false,
});

// 보조 처리
/**
    * 동작 설명은 추후 세분화 예정입니다.
 */
export const useCardContext = () => useContext(CardContext);
