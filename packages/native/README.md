# StoryCarouselKit Core

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Fcore.svg)](https://badge.fury.io/js/%40storycarouselkit%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Framework-agnostic core logic for story carousel components

[🇷🇺 Russian](README.ru.md) • [🇨🇳 Chinese](README.cn.md)

## ✨ Features

- **Framework Agnostic**: Pure TypeScript implementation, works with any UI framework
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Auto Play**: Configurable auto-advancement with progress tracking
- **Navigation**: Intuitive next/previous navigation with keyboard support
- **Progress Tracking**: Real-time progress updates for custom UI components
- **Event System**: Rich event system for story lifecycle management
- **Memory Efficient**: Lightweight implementation with minimal dependencies

## 📦 Installation

```bash
npm install @storycarouselkit/core
```

or

```bash
yarn add @storycarouselkit/core
```

## 🚀 Quick Start

```typescript
import { StoryCarousel, type Story, type StoryCarouselConfig } from '@storycarouselkit/core';

// Define your stories
const stories: Story[] = [
  {
    id: 'story-1',
    content: 'Welcome to our story!',
    duration: 3000, // 3 seconds
    mediaUrl: 'https://example.com/story1.jpg',
  },
  {
    id: 'story-2',
    content: 'This is the second story',
    duration: 5000, // 5 seconds
  },
];

// Configure the carousel
const config: StoryCarouselConfig = {
  stories,
  autoPlay: true,
  defaultDuration: 4000,
  onStoryStart: story => console.log(`Started: ${story.content}`),
  onStoryEnd: story => console.log(`Ended: ${story.content}`),
  onComplete: () => console.log('All stories completed!'),
};

// Create carousel instance
const carousel = new StoryCarousel(config);

// Start playing
carousel.play();

// Control playback
carousel.pause();
carousel.next();
carousel.prev();
carousel.goTo(1); // Jump to specific story

// Get current state
const state = carousel.getState();
console.log(state.currentIndex, state.progress, state.state);
```

## 📚 API Reference

### StoryCarousel Class

#### Constructor

```typescript
new StoryCarousel(config: StoryCarouselConfig)
```

#### Methods

- `play()`: Start or resume playback
- `pause()`: Pause playback
- `next()`: Advance to next story
- `prev()`: Go back to previous story
- `goTo(index: number)`: Jump to specific story by index
- `getState(): StoryCarouselStateInfo`: Get current carousel state
- `addStory(story: Story)`: Add a new story to the carousel
- `destroy()`: Clean up resources

#### Events

Configure event handlers in the `StoryCarouselConfig`:

- `onStoryStart(story)`: Fired when a story begins playing
- `onStoryEnd(story)`: Fired when a story finishes playing
- `onComplete()`: Fired when all stories have been viewed
- `onStoryViewed(story)`: Fired when a story is marked as viewed

### Types

```typescript
interface Story {
  id: string; // Unique identifier
  content: string; // Story content/description
  duration?: number; // Display duration in milliseconds (optional)
  mediaUrl?: string; // Media URL for images/videos (optional)
}

type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';

interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean; // Default: true
  defaultDuration?: number; // Default: 5000ms
  progressUpdateInterval?: number; // Default: 100ms
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  onStoryViewed?: (story: Story) => void;
}

interface StoryCarouselStateInfo {
  currentIndex: number;
  state: StoryCarouselState;
  progress: number; // 0-1 progress value
  currentStory: Story | null;
  viewedStories: string[]; // Array of viewed story IDs
}
```

## 🎯 Advanced Usage

### Custom Progress UI

```typescript
import { StoryCarousel } from '@storycarouselkit/core';

const carousel = new StoryCarousel({
  stories: myStories,
  progressUpdateInterval: 50, // More frequent updates
  onStoryStart: updateProgressUI,
  onStoryEnd: updateProgressUI,
});

function updateProgressUI() {
  const state = carousel.getState();
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${state.progress * 100}%`;
}
```

### Keyboard Navigation

```typescript
document.addEventListener('keydown', event => {
  switch (event.key) {
    case 'ArrowRight':
    case ' ': // Spacebar
      carousel.next();
      break;
    case 'ArrowLeft':
      carousel.prev();
      break;
    case ' ': // Spacebar (prevent page scroll)
      event.preventDefault();
      carousel.play();
      break;
  }
});
```

### React Integration Example

```typescript
import React, { useEffect, useState } from 'react';
import { StoryCarousel, type StoryCarouselStateInfo } from '@storycarouselkit/core';

function StoryComponent({ stories }) {
  const [carousel] = useState(() => new StoryCarousel({ stories }));
  const [state, setState] = useState<StoryCarouselStateInfo>();

  useEffect(() => {
    const updateState = () => setState(carousel.getState());
    updateState();

    // Set up progress updates
    const interval = setInterval(updateState, 100);

    return () => {
      clearInterval(interval);
      carousel.destroy();
    };
  }, [carousel]);

  return (
    <div className="story-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(state?.progress || 0) * 100}%` }}
        />
      </div>
      <div className="story-content">
        {state?.currentStory?.content}
      </div>
      <button onClick={() => carousel.prev()}>Previous</button>
      <button onClick={() => carousel.next()}>Next</button>
    </div>
  );
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## 📄 License

MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🔗 Links

- [Homepage](https://delpin.github.io/StoryCarouselKit/)
- [GitHub Repository](https://github.com/delpin/StoryCarouselKit)
- [NPM Package](https://www.npmjs.com/package/@storycarouselkit/core)
- [Issues](https://github.com/delpin/StoryCarouselKit/issues)
