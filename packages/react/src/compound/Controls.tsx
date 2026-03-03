import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { CarouselAPI, Story, StoryCarouselStateInfo } from '../types';

export interface ControlsRenderProps {
  state: StoryCarouselStateInfo | null;
  stories: Story[];
  api: CarouselAPI;
}

export interface ControlsProps {
  children?: ((props: ControlsRenderProps) => ReactNode) | ReactNode;
}

export const Controls: React.FC<ControlsProps> = ({ children }) => {
  const { state, stories, ...api } = useStoryCarouselContext();

  const renderProps: ControlsRenderProps = {
    state,
    stories,
    api,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  return <>{children}</>;
};
