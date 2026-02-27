// Framework-agnostic story carousel core logic types

export interface Story {
  id: string;
  content: string;
  duration?: number; // in milliseconds
  mediaUrl?: string;
}

export type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';

export interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean;
  defaultDuration?: number;
  progressUpdateInterval?: number; // in milliseconds, default: 100
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  onStoryViewed?: (story: Story) => void;
}

export interface StoryCarouselStateInfo {
  currentIndex: number;
  state: StoryCarouselState;
  progress: number; // 0-1
  currentStory: Story | null;
  viewedStories: string[]; // Array of story IDs that have been viewed
}