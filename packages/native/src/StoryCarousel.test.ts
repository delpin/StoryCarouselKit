import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StoryCarousel } from './StoryCarousel';
import type { Story } from './types';

// Helper functions
const createTestStories = (count: number): Story[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `story-${i + 1}`,
    content: `Story ${i + 1}`,
    duration: 1000, // 1 second for faster tests
  }));
};

const createCarousel = (stories: Story[] = [], config: Partial<{ autoPlay: boolean; defaultDuration: number }> = {}) => {
  return new StoryCarousel({
    stories,
    autoPlay: false,
    defaultDuration: 1000,
    ...config,
  });
};

describe('StoryCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('Initialization', () => {
    it('should initialize with idle state when autoPlay is false', () => {
      const stories = createTestStories(1);
      const carousel = createCarousel(stories, { autoPlay: false });

      const state = carousel.getState();
      expect(state.state).toBe('idle');
      expect(state.currentIndex).toBe(0);
      expect(state.progress).toBe(0);
    });

    it('should initialize with playing state when autoPlay is true', () => {
      const stories = createTestStories(1);
      const carousel = createCarousel(stories, { autoPlay: true });

      const state = carousel.getState();
      expect(state.state).toBe('playing');
      expect(state.currentIndex).toBe(0);
    });

    it('should set state to completed when play is called with no stories', () => {
      const carousel = createCarousel([]);

      carousel.play();

      const state = carousel.getState();
      expect(state.state).toBe('completed');
    });
  });

  describe('Single story playback', () => {
    it('should play single story and complete', () => {
      const onComplete = vi.fn();
      const onStoryEnd = vi.fn();
      const stories = createTestStories(1);
      const carousel = new StoryCarousel({
        stories,
        autoPlay: false,
        defaultDuration: 1000,
        onComplete,
        onStoryEnd,
      });

      carousel.play();

      // Should start playing
      expect(carousel.getState().state).toBe('playing');

      // Fast forward to end of story (1 second)
      vi.advanceTimersByTime(1000);

      // Should be completed
      expect(carousel.getState().state).toBe('completed');
      expect(onStoryEnd).toHaveBeenCalledWith(stories[0]);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('Multiple stories playback', () => {
    it('should play 3 stories sequentially and complete', () => {
      const onComplete = vi.fn();
      const onStoryEnd = vi.fn();
      const onStoryStart = vi.fn();
      const stories = createTestStories(3);
      const carousel = new StoryCarousel({
        stories,
        autoPlay: false,
        defaultDuration: 1000,
        onComplete,
        onStoryEnd,
        onStoryStart,
      });

      carousel.play();

      // Should start playing first story
      expect(carousel.getState().state).toBe('playing');
      expect(carousel.getState().currentIndex).toBe(0);

      // Fast forward to end of first story
      vi.advanceTimersByTime(1000);
      expect(onStoryEnd).toHaveBeenCalledWith(stories[0]);
      expect(onStoryStart).toHaveBeenCalledWith(stories[1]);
      expect(carousel.getState().currentIndex).toBe(1);

      // Fast forward to end of second story
      vi.advanceTimersByTime(1000);
      expect(onStoryEnd).toHaveBeenCalledWith(stories[1]);
      expect(onStoryStart).toHaveBeenCalledWith(stories[2]);
      expect(carousel.getState().currentIndex).toBe(2);

      // Fast forward to end of third story
      vi.advanceTimersByTime(1000);
      expect(onStoryEnd).toHaveBeenCalledWith(stories[2]);
      expect(onComplete).toHaveBeenCalled();
      expect(carousel.getState().state).toBe('completed');
    });
  });

  describe('Dynamic story management', () => {
    it('should add story during playback and continue to newly added story', () => {
      const onComplete = vi.fn();
      const onStoryEnd = vi.fn();
      const onStoryStart = vi.fn();
      const stories = createTestStories(2);
      const carousel = new StoryCarousel({
        stories,
        autoPlay: false,
        defaultDuration: 1000,
        onComplete,
        onStoryEnd,
        onStoryStart,
      });

      carousel.play();

      // Should start playing first story
      expect(carousel.getState().state).toBe('playing');
      expect(carousel.getState().currentIndex).toBe(0);

      // Fast forward to halfway through first story
      vi.advanceTimersByTime(500);

      // Add new story during playback
      const newStory: Story = { id: 'new-story', content: 'New Story', duration: 1000 };
      carousel.addStory(newStory);

      // Continue to end of first story
      vi.advanceTimersByTime(500);
      expect(onStoryEnd).toHaveBeenCalledWith(stories[0]);
      expect(onStoryStart).toHaveBeenCalledWith(stories[1]);
      expect(carousel.getState().currentIndex).toBe(1);

      // Continue to end of second story
      vi.advanceTimersByTime(1000);
      expect(onStoryEnd).toHaveBeenCalledWith(stories[1]);
      expect(onStoryStart).toHaveBeenCalledWith(newStory);
      expect(carousel.getState().currentIndex).toBe(2);

      // Continue to end of newly added story
      vi.advanceTimersByTime(1000);
      expect(onStoryEnd).toHaveBeenCalledWith(newStory);
      expect(onComplete).toHaveBeenCalled();
      expect(carousel.getState().state).toBe('completed');
    });

    it('should allow playing again after adding story when completed', () => {
      const onComplete = vi.fn();
      const onStoryStart = vi.fn();
      const stories = createTestStories(1);
      const carousel = new StoryCarousel({
        stories,
        autoPlay: false,
        defaultDuration: 1000,
        onComplete,
        onStoryStart,
      });

      carousel.play();

      // Play and complete the single story
      vi.advanceTimersByTime(1000);
      expect(carousel.getState().state).toBe('completed');
      expect(onComplete).toHaveBeenCalled();

      // Add new story after completion
      const newStory: Story = { id: 'after-complete', content: 'After Complete', duration: 1000 };
      carousel.addStory(newStory);

      // Should be able to play again - reset to beginning and include all stories
      carousel.play();
      expect(carousel.getState().state).toBe('playing');
      expect(carousel.getState().currentIndex).toBe(0); // Reset to first story
      expect(onStoryStart).toHaveBeenCalledWith(stories[0]);
    });
  });

  describe('Story viewing tracking', () => {
    it('should track viewed stories without modifying story objects', () => {
      const onStoryViewed = vi.fn();
      const originalStory: Story = { id: 'test', content: 'Test', duration: 1000 };
      const stories = [originalStory];
      const carousel = new StoryCarousel({
        stories,
        autoPlay: false,
        defaultDuration: 1000,
        onStoryViewed,
      });

      carousel.play();

      // Play through the story
      vi.advanceTimersByTime(1000);

      // Story object should remain unchanged (data integrity)
      expect(originalStory).toEqual({ id: 'test', content: 'Test', duration: 1000 });
      expect(originalStory).not.toHaveProperty('completed');
      expect(originalStory).not.toHaveProperty('isCompleted');
      expect(originalStory).not.toHaveProperty('viewed');
      expect(originalStory).not.toHaveProperty('played');

      // But viewing should be tracked separately
      const state = carousel.getState();
      expect(state.viewedStories).toContain('test');
      expect(onStoryViewed).toHaveBeenCalledWith(originalStory);
    });

    it('should track multiple viewed stories', () => {
      const stories = createTestStories(3);
      const carousel = createCarousel(stories);

      carousel.play();

      // Play through all stories
      vi.advanceTimersByTime(1000); // First story
      expect(carousel.getState().viewedStories).toEqual(['story-1']);

      vi.advanceTimersByTime(1000); // Second story
      expect(carousel.getState().viewedStories).toEqual(['story-1', 'story-2']);

      vi.advanceTimersByTime(1000); // Third story
      expect(carousel.getState().viewedStories).toEqual(['story-1', 'story-2', 'story-3']);
    });
  });
});