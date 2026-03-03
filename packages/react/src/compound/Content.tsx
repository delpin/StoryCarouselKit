import React from 'react';
import type { ReactNode } from 'react';
import { useStoryCarouselContext } from '../context/StoryCarouselContext';
import type { Story, StoryCarouselStateInfo } from '../types';

export interface ContentRenderProps {
  story: Story;
  progress: number;
  state: StoryCarouselStateInfo;
}

export interface ContentProps {
  children?: (props: ContentRenderProps) => ReactNode;
  renderStory?: (story: Story, progress: number) => ReactNode;
}

const DefaultContent: React.FC<ContentRenderProps> = ({ story }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '24px',
      }}
    >
      {story.content}
    </div>
  );
};

export const Content: React.FC<ContentProps> = ({ children, renderStory }) => {
  const { state } = useStoryCarouselContext();

  if (!state || !state.currentStory) {
    return null;
  }

  const renderProps: ContentRenderProps = {
    story: state.currentStory,
    progress: state.progress,
    state,
  };

  if (typeof children === 'function') {
    return <>{children(renderProps)}</>;
  }

  if (renderStory) {
    return <>{renderStory(renderProps.story, renderProps.progress)}</>;
  }

  return <DefaultContent {...renderProps} />;
};
