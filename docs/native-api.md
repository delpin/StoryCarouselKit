# Нативное API

Нативный пакет `@story-carousel/native` содержит framework-agnostic логику управления историями. Это TypeScript класс, который можно использовать в любом JavaScript окружении.

## Установка

```bash
pnpm add @story-carousel/native
# или
npm install @story-carousel/native
# или
yarn add @story-carousel/native
```

## Основные интерфейсы

### Story

Интерфейс описывает отдельную историю в карусели.

```typescript
interface Story {
  id: string;           // Уникальный идентификатор
  content: string;      // Текстовое содержимое
  duration?: number;    // Длительность в мс (опционально)
  mediaUrl?: string;    // URL медиафайла (опционально)
}
```

### StoryCarouselConfig

Конфигурация для инициализации карусели.

```typescript
interface StoryCarouselConfig {
  stories: Story[];                    // Массив историй
  autoPlay?: boolean;                  // Автозапуск (по умолчанию: true)
  defaultDuration?: number;            // Длительность по умолчанию в мс (по умолчанию: 5000)
  onStoryEnd?: (story: Story) => void; // Коллбэк при завершении истории
  onStoryStart?: (story: Story) => void; // Коллбэк при начале истории
  onComplete?: () => void;             // Коллбэк при завершении всех историй
}
```

### StoryCarouselState

Текущее состояние карусели.

```typescript
interface StoryCarouselState {
  currentIndex: number;    // Индекс текущей истории
  isPlaying: boolean;      // Флаг воспроизведения
  progress: number;        // Прогресс текущей истории (0-1)
  currentStory: Story | null; // Текущая история
}
```

## StoryCarousel класс

### Конструктор

```typescript
const carousel = new StoryCarousel(config: StoryCarouselConfig);
```

### Методы управления

#### getState(): StoryCarouselState
Возвращает текущее состояние карусели.

```typescript
const state = carousel.getState();
console.log(state.currentIndex); // 0
console.log(state.isPlaying);    // true
console.log(state.progress);     // 0.5
```

#### play(): void
Запускает воспроизведение историй.

```typescript
carousel.play();
```

#### pause(): void
Приостанавливает воспроизведение.

```typescript
carousel.pause();
```

#### next(): void
Переходит к следующей истории.

```typescript
carousel.next();
```

#### prev(): void
Переходит к предыдущей истории.

```typescript
carousel.prev();
```

#### goTo(index: number): void
Переходит к истории по индексу.

```typescript
carousel.goTo(2); // Перейти к третьей истории
```

#### destroy(): void
Очищает ресурсы и останавливает таймеры.

```typescript
carousel.destroy();
```

## Примеры использования

### Базовый пример

```javascript
import { StoryCarousel } from '@story-carousel/native';

const stories = [
  { id: '1', content: 'Добро пожаловать!', duration: 3000 },
  { id: '2', content: 'Это вторая история', duration: 4000 },
  { id: '3', content: 'И третья история', duration: 5000 },
];

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryEnd: (story) => {
    console.log(`История ${story.id} завершена`);
  },
  onComplete: () => {
    console.log('Все истории просмотрены!');
  },
});

// Запуск (если autoPlay: false)
carousel.play();

// Управление
setTimeout(() => carousel.pause(), 2000);
setTimeout(() => carousel.next(), 4000);

// Очистка
carousel.destroy();
```

### С мониторингом состояния

```javascript
const carousel = new StoryCarousel({ stories });

// Мониторинг прогресса
const monitor = setInterval(() => {
  const state = carousel.getState();
  console.log(`История ${state.currentIndex + 1}/${stories.length}: ${Math.round(state.progress * 100)}%`);
}, 500);

// Остановка мониторинга
setTimeout(() => clearInterval(monitor), 15000);
```

### Интеграция с UI

```javascript
class StoryViewer {
  constructor(container) {
    this.container = container;
    this.carousel = new StoryCarousel({
      stories: this.loadStories(),
      onStoryStart: (story) => this.renderStory(story),
      onComplete: () => this.showCompletionMessage(),
    });
  }

  renderStory(story) {
    this.container.innerHTML = `
      <div class="story">
        <h2>${story.content}</h2>
        ${story.mediaUrl ? `<img src="${story.mediaUrl}" alt="Story media">` : ''}
      </div>
    `;
  }

  showCompletionMessage() {
    this.container.innerHTML = '<div class="completed">Все истории просмотрены!</div>';
  }

  play() {
    this.carousel.play();
  }

  destroy() {
    this.carousel.destroy();
  }
}
```

## Продвинутые возможности

### Кастомные длительности

```typescript
const stories = [
  { id: '1', content: 'Короткая история', duration: 2000 },
  { id: '2', content: 'Длинная история', duration: 8000 },
  { id: '3', content: 'История по умолчанию' }, // Используется defaultDuration
];
```

### Событийная интеграция

```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryStart: (story) => {
    // Аналитика: начало просмотра
    analytics.track('story_started', { storyId: story.id });
  },
  onStoryEnd: (story) => {
    // Аналитика: завершение просмотра
    analytics.track('story_completed', { storyId: story.id });
  },
  onComplete: () => {
    // Показать CTA или следующее действие
    showCallToAction();
  },
});
```

### Управление памятью

```typescript
class ManagedStoryCarousel {
  constructor() {
    this.carousel = null;
  }

  loadStories(newStories) {
    // Очистка предыдущего экземпляра
    if (this.carousel) {
      this.carousel.destroy();
    }

    this.carousel = new StoryCarousel({
      stories: newStories,
      // ... конфигурация
    });
  }

  destroy() {
    if (this.carousel) {
      this.carousel.destroy();
      this.carousel = null;
    }
  }
}
```

## Обработка ошибок

### Валидация входных данных

```typescript
function createValidatedCarousel(stories) {
  if (!Array.isArray(stories) || stories.length === 0) {
    throw new Error('Stories must be a non-empty array');
  }

  if (stories.some(story => !story.id || !story.content)) {
    throw new Error('Each story must have id and content');
  }

  return new StoryCarousel({ stories });
}
```

### Graceful degradation

```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryEnd: (story) => {
    try {
      // Бизнес-логика
      processStoryCompletion(story);
    } catch (error) {
      console.error('Error processing story completion:', error);
      // Продолжить выполнение
    }
  },
});
```

## Производительность

### Оптимизации

- **Минимальные перерендеры** — состояние обновляется только при необходимости
- **Эффективные таймеры** — один таймер на всю карусель
- **Память** — явная очистка ресурсов через `destroy()`

### Рекомендации

1. **Всегда вызывайте `destroy()`** при удалении компонента
2. **Избегайте частых вызовов `getState()`** в циклах
3. **Используйте throttling** для UI обновлений
4. **Кэшируйте состояния** если нужно сравнивать изменения

---

[← Архитектура](architecture.md) | [→ React интеграция](react-integration.md)</contents>
</xai:function_call name