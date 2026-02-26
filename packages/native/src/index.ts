// Framework-agnostic story carousel core logic
export interface Story {
  id: string;
  content: string;
  duration?: number; // in milliseconds
  mediaUrl?: string;
}

export interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean;
  defaultDuration?: number;
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
}

export interface StoryCarouselState {
  currentIndex: number;
  isPlaying: boolean;
  progress: number; // 0-1
  currentStory: Story | null;
}

export class StoryCarousel {
  private config: StoryCarouselConfig;
  private state: StoryCarouselState;
  private timer: NodeJS.Timeout | null = null;

  constructor(config: StoryCarouselConfig) {
    this.config = {
      autoPlay: true,
      defaultDuration: 5000,
      ...config,
    };
    this.state = {
      currentIndex: 0,
      isPlaying: false,
      progress: 0,
      currentStory: config.stories[0] || null,
    };
  }

  getState(): StoryCarouselState {
    return { ...this.state };
  }

  play(): void {
    if (this.state.isPlaying) return;

    this.state.isPlaying = true;
    this.startTimer();
    this.config.onStoryStart?.(this.state.currentStory!);
  }

  pause(): void {
    if (!this.state.isPlaying) return;

    this.state.isPlaying = false;
    this.clearTimer();
  }

  next(): void {
    this.clearTimer();
    const nextIndex = this.state.currentIndex + 1;

    if (nextIndex >= this.config.stories.length) {
      this.config.onComplete?.();
      this.state.isPlaying = false;
      return;
    }

    this.state.currentIndex = nextIndex;
    this.state.currentStory = this.config.stories[nextIndex];
    this.state.progress = 0;

    if (this.state.isPlaying) {
      this.startTimer();
      this.config.onStoryStart?.(this.state.currentStory);
    }
  }

  prev(): void {
    this.clearTimer();
    const prevIndex = Math.max(0, this.state.currentIndex - 1);

    this.state.currentIndex = prevIndex;
    this.state.currentStory = this.config.stories[prevIndex];
    this.state.progress = 0;

    if (this.state.isPlaying) {
      this.startTimer();
      this.config.onStoryStart?.(this.state.currentStory);
    }
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.config.stories.length) return;

    this.clearTimer();
    this.state.currentIndex = index;
    this.state.currentStory = this.config.stories[index];
    this.state.progress = 0;

    if (this.state.isPlaying) {
      this.startTimer();
      this.config.onStoryStart?.(this.state.currentStory);
    }
  }

  private startTimer(): void {
    const duration = this.state.currentStory?.duration || this.config.defaultDuration!;
    const interval = 100; // update progress every 100ms
    const steps = duration / interval;
    let currentStep = 0;

    this.timer = setInterval(() => {
      currentStep++;
      this.state.progress = currentStep / steps;

      if (currentStep >= steps) {
        this.clearTimer();
        this.config.onStoryEnd?.(this.state.currentStory!);
        this.next();
      }
    }, interval);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  destroy(): void {
    this.clearTimer();
    this.state.isPlaying = false;
  }
}