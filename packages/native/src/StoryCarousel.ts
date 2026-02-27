import type {
  Story,
  StoryCarouselConfig,
  StoryCarouselState,
  StoryCarouselStateInfo,
} from "./types";

export class StoryCarousel {
  private config: StoryCarouselConfig;
  private currentIndex: number;
  private state: StoryCarouselState;
  private progress: number;
  private timer: NodeJS.Timeout | null = null;
  private viewedStories: Set<string> = new Set();

  constructor(config: StoryCarouselConfig) {
    this.config = {
      autoPlay: true,
      defaultDuration: 5000,
      progressUpdateInterval: 100,
      ...config,
    };
    this.currentIndex = 0;
    this.state = this.config.autoPlay ? "playing" : "idle";
    this.progress = 0;

    if (this.state === "playing") {
      this.startTimer();
      this.notifyStoryStart();
    }
  }

  getState(): StoryCarouselStateInfo {
    return {
      currentIndex: this.currentIndex,
      state: this.state,
      progress: this.progress,
      currentStory: this.getCurrentStory(),
      viewedStories: Array.from(this.viewedStories),
    };
  }

  private notifyStoryStart(): void {
    const currentStory = this.getCurrentStory();
    if (currentStory) {
      this.config.onStoryStart?.(currentStory);
    }
  }

  play(): void {
    if (this.state === "playing") return;

    // If no stories, immediately complete
    if (this.config.stories.length === 0) {
      this.state = "completed";
      this.config.onComplete?.();
      return;
    }

    this.state = "playing";
    this.startTimer();
    this.notifyStoryStart();
  }

  pause(): void {
    if (this.state !== "playing") return;

    this.state = "paused";
    this.clearTimer();
  }

  next(): void {
    this.clearTimer();
    const nextIndex = this.currentIndex + 1;

    if (nextIndex >= this.config.stories.length) {
      this.state = "completed";
      this.config.onComplete?.();
      return;
    }

    this.currentIndex = nextIndex;
    this.progress = 0;

    if (this.state === "playing") {
      this.startTimer();
      this.notifyStoryStart();
    }
  }

  prev(): void {
    this.clearTimer();
    const prevIndex = Math.max(0, this.currentIndex - 1);

    this.currentIndex = prevIndex;
    this.progress = 0;

    if (this.state === "playing") {
      this.startTimer();
      this.notifyStoryStart();
    }
  }

  goTo(index: number): void {
    if (index < 0 || index >= this.config.stories.length) return;

    this.clearTimer();
    this.currentIndex = index;
    this.progress = 0;

    if (this.state === "playing") {
      this.startTimer();
      this.notifyStoryStart();
    }
  }

  private getCurrentStory(): Story {
    return this.config.stories[this.currentIndex];
  }

  private startTimer(): void {
    const currentStory = this.getCurrentStory();
    if (!currentStory) return;

    const duration = this.calculateDuration(currentStory);
    const steps = duration / this.config.progressUpdateInterval!;
    let currentStep = 0;

    this.timer = setInterval(() => {
      currentStep++;
      this.updateProgress(currentStep, steps);

      if (this.isStoryCompleted(currentStep, steps)) {
        this.handleStoryCompletion(currentStory);
      }
    }, this.config.progressUpdateInterval);
  }

  private calculateDuration(story: Story): number {
    return story.duration || this.config.defaultDuration!;
  }

  private updateProgress(currentStep: number, totalSteps: number): void {
    this.progress = currentStep / totalSteps;
  }

  private isStoryCompleted(currentStep: number, totalSteps: number): boolean {
    return currentStep >= totalSteps;
  }

  private handleStoryCompletion(story: Story): void {
    this.clearTimer();
    this.markStoryAsViewed(story);
    this.config.onStoryEnd?.(story);
    this.next();
  }

  private markStoryAsViewed(story: Story): void {
    this.viewedStories.add(story.id);
    this.config.onStoryViewed?.(story);
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  addStory(story: Story): void {
    this.config.stories.push(story);
  }

  destroy(): void {
    this.clearTimer();
    this.state = "idle";
  }
}
