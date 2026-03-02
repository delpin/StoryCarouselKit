# StoryCarouselKit Core

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Fcore.svg)](https://badge.fury.io/js/%40storycarouselkit%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> 适用于故事轮播组件的框架无关核心逻辑

[🇺🇸 English](README.md) • [🇷🇺 Russian](README.ru.md)

## ✨ 特性

- **框架无关**: 纯 TypeScript 实现，可与任何 UI 框架配合使用
- **类型安全**: 完整的 TypeScript 支持和全面的类型定义
- **自动播放**: 可配置的自动前进和进度跟踪
- **导航**: 直观的下一页/上一页导航，支持键盘操作
- **进度跟踪**: 为自定义 UI 组件提供实时进度更新
- **事件系统**: 丰富的事件系统用于故事生命周期管理
- **内存高效**: 轻量级实现，最小化依赖

## 📦 安装

```bash
npm install @storycarouselkit/core
```

或者

```bash
yarn add @storycarouselkit/core
```

## 🚀 快速开始

```typescript
import { StoryCarousel, type Story, type StoryCarouselConfig } from '@storycarouselkit/core';

// 定义你的故事
const stories: Story[] = [
  {
    id: 'story-1',
    content: '欢迎来到我们的故事！',
    duration: 3000, // 3秒
    mediaUrl: 'https://example.com/story1.jpg'
  },
  {
    id: 'story-2',
    content: '这是第二个故事',
    duration: 5000, // 5秒
  }
];

// 配置轮播
const config: StoryCarouselConfig = {
  stories,
  autoPlay: true,
  defaultDuration: 4000,
  onStoryStart: (story) => console.log(`开始: ${story.content}`),
  onStoryEnd: (story) => console.log(`结束: ${story.content}`),
  onComplete: () => console.log('所有故事已完成!')
};

// 创建轮播实例
const carousel = new StoryCarousel(config);

// 开始播放
carousel.play();

// 控制播放
carousel.pause();
carousel.next();
carousel.prev();
carousel.goTo(1); // 跳转到特定故事

// 获取当前状态
const state = carousel.getState();
console.log(state.currentIndex, state.progress, state.state);
```

## 📚 API 参考

### StoryCarousel 类

#### 构造函数

```typescript
new StoryCarousel(config: StoryCarouselConfig)
```

#### 方法

- `play()`: 开始或恢复播放
- `pause()`: 暂停播放
- `next()`: 前进到下一个故事
- `prev()`: 返回到上一个故事
- `goTo(index: number)`: 跳转到指定索引的故事
- `getState(): StoryCarouselStateInfo`: 获取当前轮播状态
- `addStory(story: Story)`: 向轮播添加新故事
- `destroy()`: 清理资源

#### 事件

在 `StoryCarouselConfig` 中配置事件处理器：

- `onStoryStart(story)`: 故事开始播放时触发
- `onStoryEnd(story)`: 故事播放结束时触发
- `onComplete()`: 所有故事都被查看时触发
- `onStoryViewed(story)`: 故事被标记为已查看时触发

### 类型

```typescript
interface Story {
  id: string;           // 唯一标识符
  content: string;      // 故事内容/描述
  duration?: number;    // 显示持续时间（毫秒，可选）
  mediaUrl?: string;    // 媒体 URL 用于图片/视频（可选）
}

type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';

interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean;           // 默认: true
  defaultDuration?: number;     // 默认: 5000ms
  progressUpdateInterval?: number; // 默认: 100ms
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  onStoryViewed?: (story: Story) => void;
}

interface StoryCarouselStateInfo {
  currentIndex: number;
  state: StoryCarouselState;
  progress: number;     // 0-1 进度值
  currentStory: Story | null;
  viewedStories: string[]; // 已查看故事 ID 数组
}
```

## 🎯 高级用法

### 自定义进度 UI

```typescript
import { StoryCarousel } from '@storycarouselkit/core';

const carousel = new StoryCarousel({
  stories: myStories,
  progressUpdateInterval: 50, // 更频繁的更新
  onStoryStart: updateProgressUI,
  onStoryEnd: updateProgressUI
});

function updateProgressUI() {
  const state = carousel.getState();
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${state.progress * 100}%`;
}
```

### 键盘导航

```typescript
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
    case ' ': // 空格键
      carousel.next();
      break;
    case 'ArrowLeft':
      carousel.prev();
      break;
    case ' ': // 空格键（防止页面滚动）
      event.preventDefault();
      carousel.play();
      break;
  }
});
```

### React 集成示例

```typescript
import React, { useEffect, useState } from 'react';
import { StoryCarousel, type StoryCarouselStateInfo } from '@storycarouselkit/core';

function StoryComponent({ stories }) {
  const [carousel] = useState(() => new StoryCarousel({ stories }));
  const [state, setState] = useState<StoryCarouselStateInfo>();

  useEffect(() => {
    const updateState = () => setState(carousel.getState());
    updateState();

    // 设置进度更新
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
      <button onClick={() => carousel.prev()}>上一页</button>
      <button onClick={() => carousel.next()}>下一页</button>
    </div>
  );
}
```

## 🤝 贡献

我们欢迎贡献！请查看我们的[贡献指南](../../CONTRIBUTING.md)了解详情。

## 📄 许可证

MIT 许可证 - 详情请见 [LICENSE](../../LICENSE) 文件。

## 🔗 链接

- [主页](https://storykit.dev)
- [GitHub 仓库](https://github.com/delpin/StoryCarouselKit)
- [NPM 包](https://www.npmjs.com/package/@storycarouselkit/core)
- [问题](https://github.com/delpin/StoryCarouselKit/issues)