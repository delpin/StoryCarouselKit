import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { StoryCarouselStateInfo } from '../types';

export interface NextButtonRenderProps {
  onClick: () => void;
  disabled: boolean;
  state: StoryCarouselStateInfo;
}

export interface NextButtonProps {
  children?: (props: NextButtonRenderProps) => ReactNode;
}

const DefaultNextButton: React.FC<NextButtonRenderProps> = ({ onClick, disabled }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label='Next story'
      style={{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 40,
        height: 40,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        zIndex: 10,
      }}
    >
      ›
    </button>
  );
};

export const NextButton: React.FC<NextButtonProps> = ({ children }) => {
  const { state, stories, next } = useStoryCarouselContext();

  if (!state) {
    return null;
  }

  const disabled = state.currentIndex === stories.length - 1;

  const handleClick = () => {
    if (!disabled) {
      next();
    }
  };

  const renderProps: NextButtonRenderProps = {
    onClick: handleClick,
    disabled,
    state,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  return <DefaultNextButton {...renderProps} />;
};
