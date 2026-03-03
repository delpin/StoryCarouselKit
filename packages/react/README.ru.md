# StoryCarouselKit React

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Freact.svg)](https://badge.fury.io/js/%40storycarouselkit%2Freact)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Instagram-style карусель историй для React с типобезопасным API, автопроигрыванием и прогресс-индикаторами.

[🇺🇸 English](README.md) • [🇷🇺 Русский](README.ru.md) • [🇨🇳 中文](README.cn.md)

## ✨ Возможности

- **React-first API**: компонентный API с поддержкой compound-компонентов и render prop
- **Типобезопасные истории**: те же типы Story, что и в ядре `@storycarouselkit/core`
- **Автовоспроизведение и колбэки**: `onStoryStart`, `onStoryEnd`, `onStoryViewed`, `onComplete`
- **Прогресс в реальном времени**: индикатор прогресса для каждой истории
- **Готовые кнопки управления**: предыдущая/следующая история и пауза/возобновление
- **Собственный layout**: заменяйте дефолтный шаблон через `StoryCarousel.Controls`, `StoryCarousel.Content`, `StoryCarousel.ProgressBar`
- **Единый источник состояния**: логика синхронизирована с хук-based состоянием
- **Совместимость с ядром**: можно использовать те же данные историй, что и в `@storycarouselkit/core`

## 📦 Установка

```bash
npm install @storycarouselkit/react @storycarouselkit/core
```

или

```bash
yarn add @storycarouselkit/react
```

или

```bash
pnpm add @storycarouselkit/react
```

## 🚀 Примеры

### 1) Минимальная интеграция

```tsx
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: 'Привет, это история 1', duration: 3000 },
  { id: '2', content: 'Привет, это история 2', duration: 4000 },
  { id: '3', content: 'Привет, это история 3', duration: 3500 },
];

export default function App() {
  return (
    <div style={{ width: 360, height: 640 }}>
      <StoryCarousel
        stories={stories}
        autoPlay
        onStoryEnd={story => console.log('Завершена:', story.content)}
      />
    </div>
  );
}
```

### 2) Управление через ref и кастомная отрисовка

```tsx
import { useRef, useState } from 'react';
import { StoryCarousel, type CarouselAPI } from '@storycarouselkit/react';

export function ControlledStoryCarousel() {
  const apiRef = useRef<CarouselAPI | null>(null);
  const [isPlaying, setPlaying] = useState(true);

  const stories = [
    { id: '1', content: 'Первая история', duration: 2500 },
    { id: '2', content: 'Вторая история', duration: 3200 },
    { id: '3', content: 'Третья история', duration: 2800 },
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
            <small>Прогресс: {Math.round(progress * 100)}%</small>
          </div>
        )}
        onStoryStart={story => console.log('Старт:', story.id)}
        onComplete={() => console.log('Серия завершена')}
      />

      <button onClick={toggle} style={{ position: 'absolute', right: 12, bottom: 16 }}>
        {isPlaying ? 'Пауза' : 'Воспроизвести'}
      </button>
    </div>
  );
}
```

### 3) Полный кастомный layout через compound API

```tsx
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: 'Блок 1', duration: 4000 },
  { id: '2', content: 'Блок 2', duration: 3800 },
  { id: '3', content: 'Блок 3', duration: 4500 },
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
              <button onClick={api.prev}>Назад</button>
              <button onClick={api.next}>Вперёд</button>
            </div>
          )}
        </StoryCarousel.Controls>
      </StoryCarousel>
    </div>
  );
}
```

## 🔌 API в действии

### Пропсы (`StoryCarouselProps`)

- `stories: Story[]` (обязателен)
- `autoPlay?: boolean` (`true` по умолчанию)
- `defaultDuration?: number` (мс, по умолчанию `5000`)
- `progressUpdateInterval?: number` (мс)
- `renderStory?: (story, progress) => ReactNode`
- `showControls?: boolean` (`true` по умолчанию)
- `children?: ReactNode`
- `onStoryEnd?: (story) => void`
- `onStoryStart?: (story) => void`
- `onStoryViewed?: (story) => void`
- `onComplete?: () => void`

### Imperative API (`ref`)

- `play()`
- `pause()`
- `next()`
- `prev()`
- `goTo(index: number)`

### Compound-компоненты

- `StoryCarousel.ProgressBar`
- `StoryCarousel.Content`
- `StoryCarousel.Controls`
- `StoryCarousel.PrevButton`
- `StoryCarousel.NextButton`
- `StoryCarousel.PlayPauseButton`

## 📚 Практические советы

- Для SSR задайте высоту контейнера у родителя, чтобы убрать прыжок разметки.
- Если список историй меняется, компонент начнет проигрывание заново с первой истории.
- Для карточного контента рендерьте видео/изображения в `renderStory`.

## 📄 Лицензия

MIT — см. [LICENSE](../../LICENSE).

