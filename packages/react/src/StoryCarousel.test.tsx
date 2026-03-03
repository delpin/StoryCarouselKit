import React, { createRef } from 'react';
import type { ReactElement } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StoryCarousel } from './StoryCarousel';
import { StoryCarouselProvider } from './context/StoryCarouselContext';
import type { StoryCarouselContextValue } from './context/StoryCarouselContext';
import { Content } from './compound/Content';
import { Controls } from './compound/Controls';
import { PrevButton } from './compound/PrevButton';
import { NextButton } from './compound/NextButton';
import { PlayPauseButton } from './compound/PlayPauseButton';
import { ProgressBar } from './compound/ProgressBar';
import type { CarouselAPI, Story, StoryCarouselStateInfo } from './types';

const stories: Story[] = [
  { id: '1', content: 'Story 1', duration: 1000 },
  { id: '2', content: 'Story 2', duration: 1000 },
];

const createMockState = (
  overrides: Partial<StoryCarouselStateInfo> = {}
): StoryCarouselStateInfo => {
  return {
    currentIndex: 0,
    progress: 0,
    currentStory: stories[0],
    state: 'idle' as StoryCarouselStateInfo['state'],
    ...overrides,
  } as StoryCarouselStateInfo;
};

const createMockContextValue = (
  overrides: Partial<StoryCarouselContextValue> = {}
): StoryCarouselContextValue => {
  return {
    state: createMockState(),
    stories,
    play: vi.fn(),
    pause: vi.fn(),
    next: vi.fn(),
    prev: vi.fn(),
    goTo: vi.fn(),
    ...overrides,
  } as StoryCarouselContextValue;
};

const renderWithContext = (
  ui: ReactElement,
  valueOverrides: Partial<StoryCarouselContextValue> = {}
) => {
  const value = createMockContextValue(valueOverrides);

  return render(<StoryCarouselProvider value={value}>{ui}</StoryCarouselProvider>);
};

describe('StoryCarousel (react)', () => {
  it('renders current story content', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <StoryCarousel stories={stories} autoPlay={false} />
      </div>
    );

    // Проверяем, что текст присутствует в DOM без jest-dom матчеров
    expect(screen.getByText('Story 1').textContent).toBe('Story 1');
  });

  it('exposes imperative API via ref', () => {
    const ref = createRef<CarouselAPI>();

    render(
      <div style={{ width: 300, height: 500 }}>
        <StoryCarousel ref={ref} stories={stories} autoPlay={false} />
      </div>
    );

    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.next).toBe('function');
    expect(typeof ref.current?.play).toBe('function');
  });

  it('allows custom layout via compound children', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <StoryCarousel stories={stories} autoPlay={false}>
          <StoryCarousel.ProgressBar>
            {({ stories: ctxStories, state }) => (
              <div data-testid='custom-progress'>
                {ctxStories.length}-{state.currentIndex}
              </div>
            )}
          </StoryCarousel.ProgressBar>
          <StoryCarousel.Content>
            {({ story }) => <div data-testid='custom-content'>{story.content}</div>}
          </StoryCarousel.Content>
          <StoryCarousel.Controls>
            {({ api }) => (
              <button type='button' onClick={api.next} data-testid='controls-next'>
                Next
              </button>
            )}
          </StoryCarousel.Controls>
        </StoryCarousel>
      </div>
    );

    const content = screen.getByTestId('custom-content');
    expect(content.textContent).toBe('Story 1');

    const progress = screen.getByTestId('custom-progress');
    expect(progress.textContent?.startsWith('2-')).toBe(true);

    const controlsNext = screen.getByTestId('controls-next');
    expect(controlsNext).toBeDefined();
  });

  it('hides default controls when showControls is false', () => {
    render(
      <div style={{ width: 300, height: 500 }}>
        <StoryCarousel stories={stories} autoPlay={false} showControls={false} />
      </div>
    );

    expect(screen.queryByRole('button', { name: 'Next story' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Previous story' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Play stories' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Pause stories' })).toBeNull();
  });

  it('returns null when there are no stories', () => {
    const { container } = render(<StoryCarousel stories={[]} autoPlay={false} />);

    expect(container.firstChild).toBeNull();
  });
});

describe('Content', () => {
  it('renders default layout with current story from context', () => {
    renderWithContext(<Content />);

    expect(screen.getByText('Story 1').textContent).toBe('Story 1');
  });

  it('supports children as render-prop', () => {
    renderWithContext(
      <Content>
        {({ story, progress }) => (
          <div data-testid='content-render-prop'>
            {story.id}-{progress}
          </div>
        )}
      </Content>,
      {
        state: createMockState({ progress: 0.42 }),
      }
    );

    const el = screen.getByTestId('content-render-prop');
    expect(el.textContent?.startsWith('1-')).toBe(true);
  });

  it('uses renderStory prop when provided', () => {
    renderWithContext(
      <Content
        renderStory={(story, progress) => (
          <div data-testid='renderStory'>
            {story.id}-{progress}
          </div>
        )}
      />,
      {
        state: createMockState({ progress: 0.7 }),
      }
    );

    const el = screen.getByTestId('renderStory');
    expect(el.textContent?.startsWith('1-')).toBe(true);
  });

  it('returns null when state is null', () => {
    const { container } = renderWithContext(<Content />, {
      state: null,
    });

    expect(container.firstChild).toBeNull();
  });

  it('returns null when currentStory is missing', () => {
    const stateWithoutStory = createMockState({
      currentStory: null as unknown as Story,
    });

    const { container } = renderWithContext(<Content />, {
      state: stateWithoutStory,
    });

    expect(container.firstChild).toBeNull();
  });
});

describe('Controls', () => {
  it('supports children as render-prop and passes api/state/stories', () => {
    const nextMock: StoryCarouselContextValue['next'] = vi.fn();
    const customState = createMockState({ currentIndex: 1 });
    const customStories: Story[] = [...stories];

    let receivedState: StoryCarouselStateInfo | null = null;
    let receivedStories: Story[] | null = null;

    renderWithContext(
      <Controls>
        {({ api, state, stories: ctxStories }) => {
          receivedState = state;
          receivedStories = ctxStories;

          return (
            <button type='button' onClick={api.next} data-testid='controls-btn'>
              Next
            </button>
          );
        }}
      </Controls>,
      {
        state: customState,
        stories: customStories,
        next: nextMock,
      }
    );

    const btn = screen.getByTestId('controls-btn');
    fireEvent.click(btn);

    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(receivedState).toBe(customState);
    expect(receivedStories).toBe(customStories);
  });

  it('renders children as ReactNode without modification', () => {
    renderWithContext(
      <Controls>
        <div data-testid='static-controls'>Static</div>
      </Controls>
    );

    expect(screen.getByTestId('static-controls').textContent).toBe('Static');
  });

  it('works when state is null', () => {
    renderWithContext(
      <Controls>
        <div data-testid='controls-null-state'>Null state</div>
      </Controls>,
      {
        state: null,
        stories: [],
      }
    );

    expect(screen.getByTestId('controls-null-state').textContent).toBe('Null state');
  });
});

describe('PrevButton', () => {
  it('calls prev when not at the first story', () => {
    const prevMock: StoryCarouselContextValue['prev'] = vi.fn();

    renderWithContext(<PrevButton />, {
      prev: prevMock,
      stories,
      state: createMockState({
        currentIndex: 1,
        currentStory: stories[1],
      }),
    });

    const button = screen.getByRole('button', { name: 'Previous story' });
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(false);

    fireEvent.click(button);
    expect(prevMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not call prev on first story', () => {
    const prevMock: StoryCarouselContextValue['prev'] = vi.fn();

    renderWithContext(<PrevButton />, {
      prev: prevMock,
      stories,
      state: createMockState({
        currentIndex: 0,
        currentStory: stories[0],
      }),
    });

    const button = screen.getByRole('button', { name: 'Previous story' });
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(true);

    fireEvent.click(button);
    expect(prevMock).toHaveBeenCalledTimes(0);
  });

  it('returns null when state is null', () => {
    renderWithContext(<PrevButton />, {
      state: null,
    });

    expect(screen.queryByRole('button', { name: 'Previous story' })).toBeNull();
  });

  it('supports custom render-prop children', () => {
    const prevMock: StoryCarouselContextValue['prev'] = vi.fn();

    renderWithContext(
      <PrevButton>
        {({ onClick, disabled }) => (
          <button type='button' onClick={onClick} disabled={disabled} data-testid='custom-prev'>
            Prev
          </button>
        )}
      </PrevButton>,
      {
        prev: prevMock,
        stories,
        state: createMockState({
          currentIndex: 1,
          currentStory: stories[1],
        }),
      }
    );

    const button = screen.getByTestId('custom-prev') as HTMLButtonElement;
    expect(button.disabled).toBe(false);

    fireEvent.click(button);
    expect(prevMock).toHaveBeenCalledTimes(1);
  });
});

describe('NextButton', () => {
  it('calls next when not at the last story', () => {
    const nextMock: StoryCarouselContextValue['next'] = vi.fn();

    renderWithContext(<NextButton />, {
      next: nextMock,
      stories,
      state: createMockState({
        currentIndex: 0,
        currentStory: stories[0],
      }),
    });

    const button = screen.getByRole('button', { name: 'Next story' });
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(false);

    fireEvent.click(button);
    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not call next on last story', () => {
    const nextMock: StoryCarouselContextValue['next'] = vi.fn();

    renderWithContext(<NextButton />, {
      next: nextMock,
      stories,
      state: createMockState({
        currentIndex: stories.length - 1,
        currentStory: stories[stories.length - 1],
      }),
    });

    const button = screen.getByRole('button', { name: 'Next story' });
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(true);

    fireEvent.click(button);
    expect(nextMock).toHaveBeenCalledTimes(0);
  });

  it('returns null when state is null', () => {
    renderWithContext(<NextButton />, {
      state: null,
    });

    expect(screen.queryByRole('button', { name: 'Next story' })).toBeNull();
  });

  it('supports custom render-prop children', () => {
    const nextMock: StoryCarouselContextValue['next'] = vi.fn();

    renderWithContext(
      <NextButton>
        {({ onClick, disabled }) => (
          <button type='button' onClick={onClick} disabled={disabled} data-testid='custom-next'>
            Next
          </button>
        )}
      </NextButton>,
      {
        next: nextMock,
        stories,
        state: createMockState({
          currentIndex: 0,
          currentStory: stories[0],
        }),
      }
    );

    const button = screen.getByTestId('custom-next') as HTMLButtonElement;
    expect(button.disabled).toBe(false);

    fireEvent.click(button);
    expect(nextMock).toHaveBeenCalledTimes(1);
  });
});

describe('PlayPauseButton', () => {
  it('shows pause state and calls pause when state is playing', () => {
    const playMock: StoryCarouselContextValue['play'] = vi.fn();
    const pauseMock: StoryCarouselContextValue['pause'] = vi.fn();

    renderWithContext(<PlayPauseButton />, {
      play: playMock,
      pause: pauseMock,
      state: createMockState({
        state: 'playing' as StoryCarouselStateInfo['state'],
      }),
    });

    const button = screen.getByRole('button', { name: 'Pause stories' });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(pauseMock).toHaveBeenCalledTimes(1);
    expect(playMock).toHaveBeenCalledTimes(0);
  });

  it('shows play state and calls play when not playing', () => {
    const playMock: StoryCarouselContextValue['play'] = vi.fn();
    const pauseMock: StoryCarouselContextValue['pause'] = vi.fn();

    renderWithContext(<PlayPauseButton />, {
      play: playMock,
      pause: pauseMock,
      state: createMockState({
        state: 'paused' as StoryCarouselStateInfo['state'],
      }),
    });

    const button = screen.getByRole('button', { name: 'Play stories' });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(playMock).toHaveBeenCalledTimes(1);
    expect(pauseMock).toHaveBeenCalledTimes(0);
  });

  it('returns null when state is null', () => {
    renderWithContext(<PlayPauseButton />, {
      state: null,
    });

    expect(
      screen.queryByRole('button', { name: 'Play stories' }) ||
        screen.queryByRole('button', { name: 'Pause stories' })
    ).toBeNull();
  });

  it('supports custom render-prop children', () => {
    const playMock: StoryCarouselContextValue['play'] = vi.fn();
    const pauseMock: StoryCarouselContextValue['pause'] = vi.fn();

    renderWithContext(
      <PlayPauseButton>
        {({ isPlaying, onClick }) => (
          <button
            type='button'
            onClick={onClick}
            data-testid='custom-play'
            data-playing={isPlaying ? 'true' : 'false'}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
        )}
      </PlayPauseButton>,
      {
        play: playMock,
        pause: pauseMock,
        state: createMockState({
          state: 'playing' as StoryCarouselStateInfo['state'],
        }),
      }
    );

    const button = screen.getByTestId('custom-play') as HTMLButtonElement;
    expect(button.getAttribute('data-playing')).toBe('true');

    fireEvent.click(button);
    expect(pauseMock).toHaveBeenCalledTimes(1);
    expect(playMock).toHaveBeenCalledTimes(0);
  });
});

describe('ProgressBar', () => {
  it('renders segments according to stories and progress', () => {
    const extendedStories: Story[] = [...stories, { id: '3', content: 'Story 3', duration: 1000 }];

    const { container } = renderWithContext(<ProgressBar />, {
      stories: extendedStories,
      state: createMockState({
        currentIndex: 1,
        currentStory: extendedStories[1],
        progress: 0.5,
      }),
    });

    const wrapper = container.firstChild as HTMLDivElement | null;
    expect(wrapper).not.toBeNull();

    const segments = wrapper?.querySelectorAll('div[style*="height: 2px"]') ?? [];
    expect(segments.length).toBe(extendedStories.length);

    const segmentArray = Array.from(segments) as HTMLDivElement[];
    const prevBar = segmentArray[0].firstChild as HTMLDivElement;
    const currentBar = segmentArray[1].firstChild as HTMLDivElement;
    const nextBar = segmentArray[2].firstChild as HTMLDivElement;

    expect(prevBar.style.width).toBe('100%');
    expect(currentBar.style.width).toBe('50%');
    expect(nextBar.style.width).toBe('0%');
  });

  it('returns null when state is null', () => {
    const { container } = renderWithContext(<ProgressBar />, {
      state: null,
    });

    expect(container.firstChild).toBeNull();
  });

  it('supports custom render-prop children', () => {
    renderWithContext(
      <ProgressBar>
        {({ stories: ctxStories, state }) => (
          <div data-testid='custom-progress'>
            {ctxStories.length}-{state.currentIndex}
          </div>
        )}
      </ProgressBar>,
      {
        state: createMockState({ currentIndex: 1 }),
      }
    );

    const el = screen.getByTestId('custom-progress');
    expect(el.textContent?.startsWith('2-')).toBe(true);
  });
});
