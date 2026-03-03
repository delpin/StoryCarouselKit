import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { UseStoryCarouselResult } from '../hooks/useStoryCarousel';

export type StoryCarouselContextValue = UseStoryCarouselResult;

const StoryCarouselContext = createContext<StoryCarouselContextValue | null>(null);

export interface StoryCarouselProviderProps {
  value: StoryCarouselContextValue;
  children: ReactNode;
}

export const StoryCarouselProvider: React.FC<StoryCarouselProviderProps> = ({
  value,
  children,
}) => {
  return <StoryCarouselContext.Provider value={value}>{children}</StoryCarouselContext.Provider>;
};

export const useStoryCarouselContext = (): StoryCarouselContextValue => {
  const context = useContext(StoryCarouselContext);

  if (!context) {
    throw new Error('useStoryCarouselContext must be used within a StoryCarouselProvider');
  }

  return context;
};
