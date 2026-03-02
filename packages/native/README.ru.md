# StoryCarouselKit Core

[![npm version](https://badge.fury.io/js/%40storycarouselkit%2Fcore.svg)](https://badge.fury.io/js/%40storycarouselkit%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> Фреймворк-независимая основная логика для компонентов карусели историй

[🇺🇸 English](README.md) • [🇨🇳 Chinese](README.cn.md)

## ✨ Возможности

- **Фреймворк-независимый**: Чистая реализация на TypeScript, работает с любым UI фреймворком
- **Типобезопасный**: Полная поддержка TypeScript с всесторонними определениями типов
- **Автовоспроизведение**: Настраиваемое автоматическое продвижение с отслеживанием прогресса
- **Навигация**: Интуитивная навигация вперед/назад с поддержкой клавиатуры
- **Отслеживание прогресса**: Обновления прогресса в реальном времени для кастомных UI компонентов
- **Система событий**: Богатая система событий для управления жизненным циклом историй
- **Эффективное использование памяти**: Легковесная реализация с минимальными зависимостями

## 📦 Установка

```bash
npm install @storycarouselkit/core
```

или

```bash
yarn add @storycarouselkit/core
```

## 🚀 Быстрый старт

```typescript
import { StoryCarousel, type Story, type StoryCarouselConfig } from '@storycarouselkit/core';

// Определите ваши истории
const stories: Story[] = [
  {
    id: 'story-1',
    content: 'Добро пожаловать в нашу историю!',
    duration: 3000, // 3 секунды
    mediaUrl: 'https://example.com/story1.jpg'
  },
  {
    id: 'story-2',
    content: 'Это вторая история',
    duration: 5000, // 5 секунд
  }
];

// Настройте карусель
const config: StoryCarouselConfig = {
  stories,
  autoPlay: true,
  defaultDuration: 4000,
  onStoryStart: (story) => console.log(`Начато: ${story.content}`),
  onStoryEnd: (story) => console.log(`Завершено: ${story.content}`),
  onComplete: () => console.log('Все истории просмотрены!')
};

// Создайте экземпляр карусели
const carousel = new StoryCarousel(config);

// Начните воспроизведение
carousel.play();

// Управляйте воспроизведением
carousel.pause();
carousel.next();
carousel.prev();
carousel.goTo(1); // Перейти к конкретной истории

// Получите текущее состояние
const state = carousel.getState();
console.log(state.currentIndex, state.progress, state.state);
```

## 📚 Справочник API

### Класс StoryCarousel

#### Конструктор

```typescript
new StoryCarousel(config: StoryCarouselConfig)
```

#### Методы

- `play()`: Начать или возобновить воспроизведение
- `pause()`: Приостановить воспроизведение
- `next()`: Перейти к следующей истории
- `prev()`: Вернуться к предыдущей истории
- `goTo(index: number)`: Перейти к конкретной истории по индексу
- `getState(): StoryCarouselStateInfo`: Получить текущее состояние карусели
- `addStory(story: Story)`: Добавить новую историю в карусель
- `destroy()`: Очистить ресурсы

#### События

Настройте обработчики событий в `StoryCarouselConfig`:

- `onStoryStart(story)`: Срабатывает при начале воспроизведения истории
- `onStoryEnd(story)`: Срабатывает при завершении воспроизведения истории
- `onComplete()`: Срабатывает при просмотре всех историй
- `onStoryViewed(story)`: Срабатывает при отметке истории как просмотренной

### Типы

```typescript
interface Story {
  id: string;           // Уникальный идентификатор
  content: string;      // Содержимое/описание истории
  duration?: number;    // Длительность отображения в миллисекундах (необязательно)
  mediaUrl?: string;    // URL медиа для изображений/видео (необязательно)
}

type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';

interface StoryCarouselConfig {
  stories: Story[];
  autoPlay?: boolean;           // По умолчанию: true
  defaultDuration?: number;     // По умолчанию: 5000мс
  progressUpdateInterval?: number; // По умолчанию: 100мс
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  onStoryViewed?: (story: Story) => void;
}

interface StoryCarouselStateInfo {
  currentIndex: number;
  state: StoryCarouselState;
  progress: number;     // Значение прогресса 0-1
  currentStory: Story | null;
  viewedStories: string[]; // Массив ID просмотренных историй
}
```

## 🎯 Продвинутое использование

### Кастомный UI прогресса

```typescript
import { StoryCarousel } from '@storycarouselkit/core';

const carousel = new StoryCarousel({
  stories: myStories,
  progressUpdateInterval: 50, // Более частые обновления
  onStoryStart: updateProgressUI,
  onStoryEnd: updateProgressUI
});

function updateProgressUI() {
  const state = carousel.getState();
  const progressBar = document.getElementById('progress-bar');
  progressBar.style.width = `${state.progress * 100}%`;
}
```

### Навигация с клавиатуры

```typescript
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowRight':
    case ' ': // Пробел
      carousel.next();
      break;
    case 'ArrowLeft':
      carousel.prev();
      break;
    case ' ': // Пробел (предотвратить прокрутку страницы)
      event.preventDefault();
      carousel.play();
      break;
  }
});
```

### Пример интеграции с React

```typescript
import React, { useEffect, useState } from 'react';
import { StoryCarousel, type StoryCarouselStateInfo } from '@storycarouselkit/core';

function StoryComponent({ stories }) {
  const [carousel] = useState(() => new StoryCarousel({ stories }));
  const [state, setState] = useState<StoryCarouselStateInfo>();

  useEffect(() => {
    const updateState = () => setState(carousel.getState());
    updateState();

    // Настройка обновлений прогресса
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
      <button onClick={() => carousel.prev()}>Предыдущая</button>
      <button onClick={() => carousel.next()}>Следующая</button>
    </div>
  );
}
```

## 🤝 Содействие

Мы приветствуем вклад! Пожалуйста, ознакомьтесь с нашим [Руководством по содействию](../../CONTRIBUTING.md) для получения подробностей.

## 📄 Лицензия

Лицензия MIT - подробности в файле [LICENSE](../../LICENSE).

## 🔗 Ссылки

- [Домашняя страница](https://storykit.dev)
- [Репозиторий GitHub](https://github.com/delpin/StoryCarouselKit)
- [Пакет NPM](https://www.npmjs.com/package/@storycarouselkit/core)
- [Проблемы](https://github.com/delpin/StoryCarouselKit/issues)