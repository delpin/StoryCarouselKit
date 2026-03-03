import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { Story, StoryCarouselStateInfo } from '../types';

export interface ProgressBarRenderProps {
  stories: Story[];
  state: StoryCarouselStateInfo;
}

export interface ProgressBarProps {
  children?: (props: ProgressBarRenderProps) => ReactNode;
}

const DefaultProgressBar: React.FC<ProgressBarRenderProps> = ({ stories, state }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        zIndex: 10,
        display: 'flex',
        gap: 4,
      }}
    >
      {stories.map((_, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: index === state.currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
              width:
                index === state.currentIndex
                  ? `${state.progress * 100}%`
                  : index < state.currentIndex
                    ? '100%'
                    : '0%',
              transition: index === state.currentIndex ? 'none' : 'width 0.3s ease',
            }}
          />
        </div>
      ))}
    </div>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ children }) => {
  const { stories, state } = useStoryCarouselContext();

  if (!state) {
    return null;
  }

  const renderProps: ProgressBarRenderProps = {
    stories,
    state,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  return <DefaultProgressBar {...renderProps} />;
};
