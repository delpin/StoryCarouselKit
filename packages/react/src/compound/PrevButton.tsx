import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { StoryCarouselStateInfo } from '../types';

export interface PrevButtonRenderProps {
  onClick: () => void;
  disabled: boolean;
  state: StoryCarouselStateInfo;
}

export interface PrevButtonProps {
  children?: (props: PrevButtonRenderProps) => ReactNode;
}

const DefaultPrevButton: React.FC<PrevButtonRenderProps> = ({ onClick, disabled }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label='Previous story'
      style={{
        position: 'absolute',
        left: 10,
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
      ‹
    </button>
  );
};

export const PrevButton: React.FC<PrevButtonProps> = ({ children }) => {
  const { state, prev } = useStoryCarouselContext();

  if (!state) {
    return null;
  }

  const disabled = state.currentIndex === 0;

  const handleClick = () => {
    if (!disabled) {
      prev();
    }
  };

  const renderProps: PrevButtonRenderProps = {
    onClick: handleClick,
    disabled,
    state,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  return <DefaultPrevButton {...renderProps} />;
};
