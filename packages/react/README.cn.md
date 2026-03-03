# StoryCarouselKit React

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Freact.svg)](https://badge.fury.io/js/%40storycarouselkit%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> 支持 TypeScript、自动播放与进度追踪的 React 故事轮播组件。

[🇺🇸 English](README.md) • [🇷🇺 Русский](README.ru.md) • [🇨🇳 中文](README.cn.md)

## ✨ 特性

- **React-first API**：支持组件化组合与 render props 的 React 组件
- **类型安全 Story**：复用 `@storycarouselkit/core` 的 Story 类型
- **自动播放与生命周期回调**：`onStoryStart`、`onStoryEnd`、`onStoryViewed`、`onComplete`
- **实时进度**：每个故事的实时进度显示
- **内置控制按钮**：上一条/下一条/播放暂停
- **可替换布局**：通过 `StoryCarousel.Controls`、`StoryCarousel.Content`、`StoryCarousel.ProgressBar` 自定义 UI
- **统一状态源**：状态完全由内部 Hook 管理
- **与核心兼容**：可复用同一套 stories 数据

## 📦 安装

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

## 🚀 示例

### 1) 最小接入

```tsx
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: '你好，故事 1', duration: 3000 },
  { id: '2', content: '你好，故事 2', duration: 4000 },
  { id: '3', content: '你好，故事 3', duration: 3500 },
];

export default function App() {
  return (
    <div style={{ width: 360, height: 640 }}>
      <StoryCarousel
        stories={stories}
        autoPlay
        onStoryEnd={story => console.log('播放结束:', story.content)}
      />
    </div>
  );
}
```

### 2) 通过 ref 控制 + 自定义渲染

```tsx
import { useRef, useState } from 'react';
import { StoryCarousel, type CarouselAPI } from '@storycarouselkit/react';

export function ControlledStoryCarousel() {
  const apiRef = useRef<CarouselAPI | null>(null);
  const [isPlaying, setPlaying] = useState(true);

  const stories = [
    { id: '1', content: '第一条故事', duration: 2500 },
    { id: '2', content: '第二条故事', duration: 3200 },
    { id: '3', content: '第三条故事', duration: 2800 },
  ];

  const toggle = () => {
    if (isPlaying) {
      apiRef.current?.pause();
    } else {
      apiRef.current?.play();
    }
    setPlaying(v => !v);
  };

  return (
    <div style={{ width: 360, height: 640, position: 'relative' }}>
      <StoryCarousel
        ref={apiRef}
        stories={stories}
        autoPlay
        showControls={false}
        renderStory={(story, progress) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <h3>{story.content}</h3>
            <small>进度: {Math.round(progress * 100)}%</small>
          </div>
        )}
        onStoryStart={story => console.log('开始:', story.id)}
        onComplete={() => console.log('全部播放完成')}
      />

      <button onClick={toggle} style={{ position: 'absolute', right: 12, bottom: 16 }}>
        {isPlaying ? '暂停' : '播放'}
      </button>
    </div>
  );
}
```

### 3) 用 compound API 自定义布局

```tsx
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: '页面 1', duration: 4000 },
  { id: '2', content: '页面 2', duration: 3800 },
  { id: '3', content: '页面 3', duration: 4500 },
];

export function BrandedLayout() {
  return (
    <div style={{ width: 360, height: 640, borderRadius: 18, overflow: 'hidden', position: 'relative' }}>
      <StoryCarousel stories={stories} autoPlay={false}>
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
              <button onClick={api.prev}>上一页</button>
              <button onClick={api.next}>下一页</button>
            </div>
          )}
        </StoryCarousel.Controls>
      </StoryCarousel>
    </div>
  );
}
```

## 🔌 可用 API

### Props（`StoryCarouselProps`）

- `stories: Story[]`（必需）
- `autoPlay?: boolean`（默认 `true`）
- `defaultDuration?: number`（毫秒，默认 `5000`）
- `progressUpdateInterval?: number`（毫秒）
- `renderStory?: (story, progress) => ReactNode`
- `showControls?: boolean`（默认 `true`）
- `children?: ReactNode`
- `onStoryEnd?: (story) => void`
- `onStoryStart?: (story) => void`
- `onStoryViewed?: (story) => void`
- `onComplete?: () => void`

### Imperative API（`ref`）

- `play()`
- `pause()`
- `next()`
- `prev()`
- `goTo(index: number)`

### Compound 组件

- `StoryCarousel.ProgressBar`
- `StoryCarousel.Content`
- `StoryCarousel.Controls`
- `StoryCarousel.PrevButton`
- `StoryCarousel.NextButton`
- `StoryCarousel.PlayPauseButton`

## 📚 实践建议

- SSR 场景下应在父容器上设置固定高宽，避免布局抖动。
- 更新 `stories` 会从第一条故事重新开始播放。
- 在 `renderStory` 中添加图片/视频播放逻辑以构建富媒体故事。

## 📄 许可证

MIT，详见 [LICENSE](../../LICENSE)。

