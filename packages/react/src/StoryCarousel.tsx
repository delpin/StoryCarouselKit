import React, { forwardRef, useImperativeHandle } from 'react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { CarouselAPI, StoryCarouselProps } from './types';
import { useStoryCarousel } from './hooks/useStoryCarousel';
import { StoryCarouselProvider } from './context/StoryCarouselContext';
import { ProgressBar } from './compound/ProgressBar';
import { Content } from './compound/Content';
import { Controls } from './compound/Controls';
import { PrevButton } from './compound/PrevButton';
import { NextButton } from './compound/NextButton';
import { PlayPauseButton } from './compound/PlayPauseButton';

const StoryCarouselInner = forwardRef<CarouselAPI, StoryCarouselProps>((props, ref) => {
  const { className, style, renderStory, showControls = true, children, ...restProps } = props;

  const carousel = useStoryCarousel(restProps);
  const { state, play, pause, next, prev, goTo } = carousel;

  useImperativeHandle(
    ref,
    () => ({
      play,
      pause,
      next,
      prev,
      goTo,
    }),
    [play, pause, next, prev, goTo]
  );

  if (!state || !state.currentStory) {
    return null;
  }

  const defaultChildren = (
    <>
      <ProgressBar />
      <Content renderStory={renderStory} />
      {showControls && (
        <Controls>
          {() => (
            <>
              <PrevButton />
              <NextButton />
              <PlayPauseButton />
            </>
          )}
        </Controls>
      )}
    </>
  );

  return (
    <StoryCarouselProvider value={carousel}>
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          ...style,
        }}
      >
        {children ?? defaultChildren}
      </div>
    </StoryCarouselProvider>
  );
});

type StoryCarouselComponent = ForwardRefExoticComponent<
  StoryCarouselProps & RefAttributes<CarouselAPI>
> & {
  ProgressBar: typeof ProgressBar;
  Content: typeof Content;
  Controls: typeof Controls;
  PrevButton: typeof PrevButton;
  NextButton: typeof NextButton;
  PlayPauseButton: typeof PlayPauseButton;
};

export const StoryCarousel = StoryCarouselInner as StoryCarouselComponent;

StoryCarousel.ProgressBar = ProgressBar;
StoryCarousel.Content = Content;
StoryCarousel.Controls = Controls;
StoryCarousel.PrevButton = PrevButton;
StoryCarousel.NextButton = NextButton;
StoryCarousel.PlayPauseButton = PlayPauseButton;
