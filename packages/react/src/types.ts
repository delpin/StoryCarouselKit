import type { CSSProperties, ReactNode } from 'react';
import type {
  Story as CoreStory,
  StoryCarouselConfig as CoreStoryCarouselConfig,
  StoryCarouselState as CoreStoryCarouselState,
  StoryCarouselStateInfo as CoreStoryCarouselStateInfo,
} from '@storycarouselkit/core';

export type Story = CoreStory;
export type StoryCarouselConfig = CoreStoryCarouselConfig;
export type StoryCarouselState = CoreStoryCarouselState;
export type StoryCarouselStateInfo = CoreStoryCarouselStateInfo;

export type CarouselAPI = {
  play: () => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
};

export interface StoryCarouselProps extends Omit<
  StoryCarouselConfig,
  'onStoryEnd' | 'onStoryStart' | 'onComplete'
> {
  className?: string;
  style?: CSSProperties;
  renderStory?: (story: Story, progress: number) => ReactNode;
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  showControls?: boolean;
  children?: ReactNode;
}
