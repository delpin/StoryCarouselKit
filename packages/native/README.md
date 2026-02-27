# @storycarouselkit/core

Framework-agnostic TypeScript core для создания Instagram-style story carousel компонентов. Поддерживает React, Vue, Svelte, Angular и vanilla JavaScript.

[![npm version](https://badge.fury.io/js/%40storykit%2Fcore.svg)](https://badge.fury.io/js/%40storykit%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Особенности

- ✅ **Framework-agnostic** - работает в любом JavaScript окружении
- ✅ **TypeScript** - полная типизация и IntelliSense поддержка
- ✅ **State machine** - надежное управление состояниями воспроизведения
- ✅ **Auto-play** - автоматическое переключение между историями
- ✅ **Progress tracking** - отслеживание прогресса и просмотренных историй
- ✅ **Event callbacks** - гибкая система событий
- ✅ **Memory safe** - явная очистка ресурсов
- ✅ **Zero dependencies** - минимальный размер бандла

## Установка

```bash
npm install @storycarouselkit/core
# или
pnpm add @storycarouselkit/core
# или
yarn add @storycarouselkit/core
```

## Быстрый старт

```typescript
import { StoryCarousel } from "@storycarouselkit/core";

const stories = [
  { id: "1", content: "Добро пожаловать!", duration: 3000 },
  { id: "2", content: "Это вторая история", duration: 4000 },
  { id: "3", content: "И третья история", duration: 5000 },
];

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryEnd: (story) => console.log(`История ${story.id} завершена`),
  onComplete: () => console.log("Все истории просмотрены!"),
});

carousel.play();
```

## API

### StoryCarousel класс

#### Конструктор

```typescript
new StoryCarousel(config: StoryCarouselConfig)
```

#### Методы управления

- `play()` - запуск воспроизведения
- `pause()` - пауза
- `next()` - следующая история
- `prev()` - предыдущая история
- `goTo(index)` - перейти к истории по индексу
- `addStory(story)` - добавить новую историю
- `getState()` - получить текущее состояние
- `destroy()` - очистить ресурсы

### Типы данных

```typescript
interface Story {
  id: string;
  content: string;
  duration?: number;
  mediaUrl?: string;
}

type StoryCarouselState = "idle" | "playing" | "paused" | "completed";

interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean;
  defaultDuration?: number;
  progressUpdateInterval?: number;
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  onStoryViewed?: (story: Story) => void;
}
```

## Примеры использования

### React интеграция

```tsx
import React from "react";
import { StoryCarousel } from "@storycarouselkit/core";

function StoryViewer({ stories }) {
  const carouselRef = useRef();

  useEffect(() => {
    const carousel = new StoryCarousel({
      stories,
      onStoryStart: (story) => {
        // Обновить UI
        setCurrentStory(story);
      },
    });

    carouselRef.current = carousel;
    return () => carousel.destroy();
  }, [stories]);

  return (
    <div>
      <div id="story-display">{/* Ваш UI для историй */}</div>
      <button onClick={() => carouselRef.current?.next()}>Далее</button>
    </div>
  );
}
```

### Vanilla JavaScript

```html
<div id="story-container"></div>

<script type="module">
  import { StoryCarousel } from "@storycarouselkit/core";

  const container = document.getElementById("story-container");

  const carousel = new StoryCarousel({
    stories: [
      { id: "1", content: "История 1", duration: 3000 },
      { id: "2", content: "История 2", duration: 4000 },
    ],
    onStoryStart: (story) => {
      container.innerHTML = `<h2>${story.content}</h2>`;
    },
    onComplete: () => {
      container.innerHTML = "<p>Все истории просмотрены!</p>";
    },
  });

  carousel.play();
</script>
```

### Отслеживание прогресса

```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryViewed: (story) => {
    // Сохранить в аналитику
    analytics.track("story_viewed", {
      storyId: story.id,
      duration: story.duration,
    });
  },
});

// Мониторинг состояния
setInterval(() => {
  const state = carousel.getState();
  console.log(`Прогресс: ${Math.round(state.progress * 100)}%`);
}, 500);
```

## Архитектура

StoryCarousel использует state machine с 4 состояниями:

- `idle` - ожидание запуска
- `playing` - активное воспроизведение
- `paused` - приостановлено
- `completed` - все истории просмотрены

Каждая история имеет уникальный ID и отслеживается отдельно от данных. Это обеспечивает целостность данных и позволяет гибко управлять воспроизведением.

## Тестирование

Пакет включает полное покрытие unit-тестами с Vitest:

```bash
# Запуск тестов
pnpm test

# Покрытие включает:
# - Инициализацию с различными конфигурациями
# - Переходы между состояниями
# - Управление воспроизведением
# - Динамическое добавление историй
# - Отслеживание просмотров
```

## Совместимость

- **Node.js**: 16+
- **Browsers**: ES2020+
- **TypeScript**: 4.5+
- **React**: 16.8+ (через обертку)
- **Vue**: 3+ (планируется)
- **Svelte**: 3+ (планируется)
- **Angular**: 12+ (планируется)

## Размер бандла

- **ESM**: ~2.5KB gzipped
- **CJS**: ~2.7KB gzipped
- **Zero runtime dependencies**

## Лицензия

MIT © [StoryKit Team](https://github.com/delpin/StoryCarouselKit)

## Ссылки

- [Документация](https://storykit.dev/docs)
- [React интеграция](https://www.npmjs.com/package/@storycarouselkit/react)
- [GitHub](https://github.com/delpin/StoryCarouselKit)
- [Примеры](https://storykit.dev/examples)
