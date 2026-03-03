import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { StoryCarouselStateInfo } from '../types';

export interface PlayPauseButtonRenderProps {
  onClick: () => void;
  isPlaying: boolean;
  state: StoryCarouselStateInfo;
}

export interface PlayPauseButtonProps {
  children?: (props: PlayPauseButtonRenderProps) => ReactNode;
}

const DefaultPlayPauseButton: React.FC<PlayPauseButtonRenderProps> = ({ onClick, isPlaying }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={isPlaying ? 'Pause stories' : 'Play stories'}
      style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 50,
        height: 50,
        cursor: 'pointer',
        zIndex: 10,
      }}
    >
      {isPlaying ? '⏸' : '▶'}
    </button>
  );
};

export const PlayPauseButton: React.FC<PlayPauseButtonProps> = ({ children }) => {
  const { state, play, pause } = useStoryCarouselContext();

  if (!state) {
    return null;
  }

  const isPlaying = state.state === 'playing';

  const handleClick = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const renderProps: PlayPauseButtonRenderProps = {
    onClick: handleClick,
    isPlaying,
    state,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  return <DefaultPlayPauseButton {...renderProps} />;
};
