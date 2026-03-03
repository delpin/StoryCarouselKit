import { useEffect, useRef, useState } from 'react';
import { StoryCarousel as StoryCarouselCore } from '@storycarouselkit/core';
import type {
  CarouselAPI,
  Story,
  StoryCarouselConfig,
  StoryCarouselProps,
  StoryCarouselStateInfo,
} from '../types';

export type UseStoryCarouselOptions = Omit<
  StoryCarouselProps,
  'className' | 'style' | 'renderStory' | 'showControls' | 'apiRef' | 'children'
>;

export interface UseStoryCarouselResult extends CarouselAPI {
  state: StoryCarouselStateInfo | null;
  stories: Story[];
}

export const useStoryCarousel = ({
  stories,
  autoPlay = true,
  defaultDuration = 5000,
  onStoryEnd,
  onStoryStart,
  onComplete,
  onStoryViewed,
  progressUpdateInterval,
}: UseStoryCarouselOptions): UseStoryCarouselResult => {
  const carouselRef = useRef<StoryCarouselCore | null>(null);
  const [state, setState] = useState<StoryCarouselStateInfo | null>(null);

  // Стабилизируем колбэки, чтобы не пересоздавать инстанс ядра при каждом рендере
  const onStoryEndRef = useRef(onStoryEnd);
  const onStoryStartRef = useRef(onStoryStart);
  const onCompleteRef = useRef(onComplete);
  const onStoryViewedRef = useRef(onStoryViewed);

  onStoryEndRef.current = onStoryEnd;
  onStoryStartRef.current = onStoryStart;
  onCompleteRef.current = onComplete;
  onStoryViewedRef.current = onStoryViewed;

  useEffect(() => {
    if (!stories.length) {
      setState(null);
      return;
    }

    const config: StoryCarouselConfig = {
      stories,
      autoPlay,
      defaultDuration,
      progressUpdateInterval,
      onStoryEnd: story => onStoryEndRef.current?.(story),
      onStoryStart: story => onStoryStartRef.current?.(story),
      onComplete: () => onCompleteRef.current?.(),
      onStoryViewed: story => onStoryViewedRef.current?.(story),
    };

    carouselRef.current = new StoryCarouselCore(config);
    setState(carouselRef.current.getState());

    if (autoPlay) {
      carouselRef.current.play();
    }

    const interval = setInterval(() => {
      if (carouselRef.current) {
        setState(carouselRef.current.getState());
      }
    }, 100);

    return () => {
      clearInterval(interval);
      carouselRef.current?.destroy();
      carouselRef.current = null;
    };
  }, [stories, autoPlay, defaultDuration, progressUpdateInterval]);

  const play = () => {
    carouselRef.current?.play();
  };

  const pause = () => {
    carouselRef.current?.pause();
  };

  const next = () => {
    carouselRef.current?.next();
  };

  const prev = () => {
    carouselRef.current?.prev();
  };

  const goTo = (index: number) => {
    carouselRef.current?.goTo(index);
  };

  return {
    state,
    stories,
    play,
    pause,
    next,
    prev,
    goTo,
  };
};
