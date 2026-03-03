# StoryCarouselKit React

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Freact.svg)](https://badge.fury.io/js/%40storycarouselkit%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Instagram-style story carousel for React with type-safe API, autoplay, progress tracking, and composable controls.

[🇺🇸 English](README.md) • [🇷🇺 Русский](README.ru.md) • [🇨🇳 中文](README.cn.md)

## ✨ Features

- **React-native API**: Component API and compound components built around render props
- **Type-safe stories**: Shared Story types from the core package
- **Auto-play and callbacks**: `onStoryStart`, `onStoryEnd`, `onStoryViewed`, `onComplete`
- **Progress bar out of the box**: Built-in progress UI and per-story progress state
- **Keyboard-like controls pattern**: Prev / next / play-pause by API or built-in buttons
- **Composable controls**: Replace default layout with `StoryCarousel.Controls`, `Content`, and `ProgressBar`
- **Zero custom events wiring**: All state is driven by a single source of truth from the hook
- **Framework-agnostic core compatibility**: Works with the same stories data used in `@storycarouselkit/core`

## 📦 Installation

```bash
npm install @storycarouselkit/react @storycarouselkit/core
```

or

```bash
yarn add @storycarouselkit/react
```

or

```bash
pnpm add @storycarouselkit/react
```

## 🚀 Quick examples

### 1) Minimal React usage

```tsx
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: 'Hello from story 1', duration: 3000 },
  { id: '2', content: 'Hello from story 2', duration: 4000 },
  { id: '3', content: 'Hello from story 3', duration: 3500 },
];

export default function App() {
  return (
    <div style={{ width: 360, height: 640 }}>
      <StoryCarousel
        stories={stories}
        autoPlay
        onStoryEnd={story => console.log('Done:', story.content)}
      />
    </div>
  );
}
```

### 2) Custom rendering + imperative API

```tsx
import { useRef, useState } from 'react';
import { StoryCarousel, type CarouselAPI } from '@storycarouselkit/react';

export function ControlledStoryCarousel() {
  const playerRef = useRef<CarouselAPI | null>(null);
  const [isPlaying, setPlaying] = useState(true);

  const stories = [
    { id: '1', content: 'First story', duration: 2500 },
    { id: '2', content: 'Second story', duration: 3200 },
    { id: '3', content: 'Third story', duration: 2800 },
  ];

  const handleToggle = () => {
    if (isPlaying) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setPlaying(play => !play);
  };

  return (
    <div style={{ width: 360, height: 640, position: 'relative' }}>
      <StoryCarousel
        ref={playerRef}
        stories={stories}
        autoPlay
        showControls={false}
        renderStory={(story, progress) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, #06b6d4, #3b82f6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h3>{story.content}</h3>
            <small>{Math.round(progress * 100)}% watched</small>
          </div>
        )}
        onStoryStart={story => console.log('Started:', story.id)}
        onComplete={() => console.log('Sequence complete')}
      />

      <button
        onClick={handleToggle}
        style={{ position: 'absolute', right: 12, bottom: 16 }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
```

### 3) Full custom layout with compound components

```tsx
import { type CSSProperties } from 'react';
import { StoryCarousel } from '@storycarouselkit/react';

const shell: CSSProperties = {
  width: 360,
  height: 640,
  borderRadius: 18,
  overflow: 'hidden',
  position: 'relative',
};

export function BrandedLayout() {
  return (
    <div style={shell}>
      <StoryCarousel
        stories={[
          { id: '1', content: 'Brand page', duration: 4000 },
          { id: '2', content: 'Offer page', duration: 3800 },
          { id: '3', content: 'CTA page', duration: 4500 },
        ]}
        autoPlay={false}
      >
        <StoryCarousel.ProgressBar>
          {({ stories, state }) => (
            <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: 6 }}>
              {stories.map((_, index) => (
                <div key={index} style={{ flex: 1, height: 4, borderRadius: 2, background: '#ffffff44' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${index === state.currentIndex ? state.progress * 100 : index < state.currentIndex ? 100 : 0}%`,
                      background: '#fff',
                      borderRadius: 2,
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </StoryCarousel.ProgressBar>

        <StoryCarousel.Content>
          {({ story }) => (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, #0f172a, #1e293b)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 28,
              }}
            >
              {story.content}
            </div>
          )}
        </StoryCarousel.Content>

        <StoryCarousel.Controls>
          {({ api }) => (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 12px',
              }}
            >
              <button onClick={api.prev}>Back</button>
              <button onClick={api.next}>Next</button>
            </div>
          )}
        </StoryCarousel.Controls>
      </StoryCarousel>
    </div>
  );
}
```

## 🔌 API by usage

### Props (`StoryCarouselProps`)

- `stories: Story[]` (required)
- `autoPlay?: boolean` (`true` by default)
- `defaultDuration?: number` (ms, default `5000`)
- `progressUpdateInterval?: number` (ms)
- `renderStory?: (story, progress) => ReactNode`
- `showControls?: boolean` (`true` by default)
- `children?: ReactNode`
- `onStoryEnd?: (story) => void`
- `onStoryStart?: (story) => void`
- `onStoryViewed?: (story) => void`
- `onComplete?: () => void`
- `apiRef` is not used in this component; use `ref` for imperative access

### Imperative API (`CarouselAPI`)

- `play()`
- `pause()`
- `next()`
- `prev()`
- `goTo(index: number)`

### Compound components

- `StoryCarousel.ProgressBar`
- `StoryCarousel.Content`
- `StoryCarousel.Controls`
- `StoryCarousel.PrevButton`
- `StoryCarousel.NextButton`
- `StoryCarousel.PlayPauseButton`

## 📚 Recipes

- **SSR**: render height/width container from parent to avoid layout shift
- **Story list updates**: pass a new `stories` array to reset the sequence
- **Story media support**: add `mediaUrl` to stories and render it inside `renderStory`

## 🤝 Contributing

Contributions are welcome. Check the repository and open a pull request or issue.

- Repository: https://github.com/delpin/StoryCarouselKit
- NPM package: https://www.npmjs.com/package/@storycarouselkit/react
- NPM package (core): https://www.npmjs.com/package/@storycarouselkit/core
- Issues: https://github.com/delpin/StoryCarouselKit/issues

## 📄 License

MIT License. See [LICENSE](../../LICENSE).

