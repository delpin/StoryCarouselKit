# Нативное API

Нативный пакет `@storykit/core` содержит framework-agnostic логику управления историями. Это TypeScript класс с state machine, который можно использовать в любом JavaScript окружении.

## Установка

```bash
pnpm add@storycarouselkit/core
# или
npm install@storycarouselkit/core
# или
yarn add@storycarouselkit/core
```

## Основные интерфейсы

### Story

Интерфейс описывает отдельную историю в карусели.

```typescript
interface Story {
  id: string; // Уникальный идентификатор
  content: string; // Текстовое содержимое
  duration?: number; // Длительность в мс (опционально)
  mediaUrl?: string; // URL медиафайла (опционально)
}
```

### StoryCarouselState

State machine для управления состоянием карусели вместо простого булевого флага.

```typescript
type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';
```

**Состояния:**

- `'idle'` - начальное состояние, ожидание запуска
- `'playing'` - активное воспроизведение
- `'paused'` - воспроизведение приостановлено
- `'completed'` - все истории просмотрены

### StoryCarouselConfig

Конфигурация для инициализации карусели.

```typescript
interface StoryCarouselConfig {
  stories: Story[]; // Массив историй для отображения
  autoPlay?: boolean; // Автозапуск (по умолчанию: true)
  defaultDuration?: number; // Длительность по умолчанию в мс (по умолчанию: 5000)
  progressUpdateInterval?: number; // Интервал обновления прогресса в мс (по умолчанию: 100)
  onStoryEnd?: (story: Story) => void; // Коллбэк при завершении истории
  onStoryStart?: (story: Story) => void; // Коллбэк при начале истории
  onComplete?: () => void; // Коллбэк при завершении всех историй
  onStoryViewed?: (story: Story) => void; // Коллбэк при просмотре истории
}
```

### StoryCarouselStateInfo

Полная информация о состоянии карусели.

```typescript
interface StoryCarouselStateInfo {
  currentIndex: number; // Индекс текущей истории (начиная с 0)
  state: StoryCarouselState; // Текущее состояние state machine
  progress: number; // Прогресс текущей истории (0.0 до 1.0)
  currentStory: Story | null; // Текущая история или null
  viewedStories: string[]; // Массив ID просмотренных историй
}
```

## StoryCarousel класс

### Конструктор

```typescript
const carousel = new StoryCarousel(config: StoryCarouselConfig);
```

### Методы управления

#### getState(): StoryCarouselStateInfo

Возвращает полную информацию о состоянии карусели.

```typescript
const state = carousel.getState();
console.log(state.currentIndex); // 0
console.log(state.state); // 'playing'
console.log(state.progress); // 0.5
console.log(state.viewedStories); // ['story-1', 'story-2']
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

#### addStory(story: Story): void

Добавляет новую историю в конец очереди.

```typescript
carousel.addStory({
  id: 'new-story',
  content: 'Новая история',
  duration: 3000,
});
```

#### destroy(): void

Очищает ресурсы и останавливает таймеры.

```typescript
carousel.destroy();
```

## Примеры использования

### Базовый пример

```javascript
import { StoryCarousel } from '@storykit/core';

const stories = [
  { id: '1', content: 'Добро пожаловать!', duration: 3000 },
  { id: '2', content: 'Это вторая история', duration: 4000 },
  { id: '3', content: 'И третья история', duration: 5000 },
];

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryStart: story => {
    console.log(`Начало истории: ${story.id}`);
  },
  onStoryViewed: story => {
    console.log(`История ${story.id} просмотрена`);
    // Сохранить в аналитику или localStorage
  },
  onStoryEnd: story => {
    console.log(`История ${story.id} завершена`);
  },
  onComplete: () => {
    console.log('Все истории просмотрены!');
    const state = carousel.getState();
    console.log(`Просмотрено историй: ${state.viewedStories.length}`);
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
  console.log(
    `История ${state.currentIndex + 1}/${stories.length}: ${Math.round(state.progress * 100)}%`
  );
}, 500);

// Остановка мониторинга
setTimeout(() => clearInterval(monitor), 15000);
```

### С отслеживанием просмотренных историй

```javascript
const carousel = new StoryCarousel({
  stories,
  onStoryViewed: story => {
    // Сохранить в localStorage
    const viewed = JSON.parse(localStorage.getItem('viewedStories') || '[]');
    viewed.push({ id: story.id, timestamp: Date.now() });
    localStorage.setItem('viewedStories', JSON.stringify(viewed));

    // Аналитика
    analytics.track('story_viewed', {
      storyId: story.id,
      timeSpent: story.duration,
    });
  },
});

// Получить список просмотренных
const state = carousel.getState();
console.log('Просмотренные истории:', state.viewedStories);
```

### Динамическое добавление историй

```javascript
const carousel = new StoryCarousel({ stories: [] });

// Добавление историй во время работы
carousel.addStory({
  id: 'dynamic-1',
  content: 'Динамическая история',
  duration: 3000,
});

carousel.play(); // Теперь будет воспроизводить добавленную историю

// Добавление еще одной во время воспроизведения
setTimeout(() => {
  carousel.addStory({
    id: 'dynamic-2',
    content: 'Еще одна история',
    duration: 4000,
  });
  // Новая история будет воспроизведена после текущей
}, 2000);
```

### Интеграция с UI

```javascript
class StoryViewer {
  constructor(container) {
    this.container = container;
    this.carousel = new StoryCarousel({
      stories: this.loadStories(),
      onStoryStart: story => this.renderStory(story),
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
  onStoryStart: story => {
    // Аналитика: начало просмотра
    analytics.track('story_started', { storyId: story.id });
  },
  onStoryEnd: story => {
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
  onStoryEnd: story => {
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

## Тестирование

Пакет включает комплексные unit-тесты с использованием Vitest. Тесты покрывают все основные сценарии использования.

### Запуск тестов

```bash
# Из корня проекта
pnpm test --filter@storycarouselkit/core

# Или в папке пакета
cd packages/native
pnpm test
```

### Покрытые сценарии

#### Базовые тесты состояния

- ✅ Инициализация с различными конфигурациями (`autoPlay: true/false`)
- ✅ Переходы между состояниями state machine (`idle` → `playing` → `completed`)

#### Тесты воспроизведения

- ✅ **3 истории**: последовательное воспроизведение всех историй
- ✅ **1 история**: завершение одиночной истории
- ✅ **Пустой массив**: немедленный переход в `completed`

#### Динамическое управление

- ✅ **Добавление во время воспроизведения**: новые истории попадают в очередь
- ✅ **Добавление после завершения**: возможность продолжить после `completed`
- ✅ **Отслеживание просмотров**: истории помечаются как просмотренные

#### Целостность данных

- ✅ **Story объекты неизменны**: нет добавления флагов завершения
- ✅ **Отдельное отслеживание**: просмотры хранятся отдельно от данных

### Структура тестов

```typescript
describe('StoryCarousel', () => {
  describe('Initialization', () => {
    // Тесты инициализации
  });

  describe('Playback', () => {
    // Тесты воспроизведения
  });

  describe('Dynamic story management', () => {
    // Тесты динамического управления
  });

  describe('Story data integrity', () => {
    // Тесты целостности данных
  });
});
```

### Mock и helpers

Тесты используют fake timers для контроля времени и callback mocks для проверки событий:

```typescript
const mockCallbacks = {
  onStoryStart: vi.fn(),
  onStoryViewed: vi.fn(),
  onStoryEnd: vi.fn(),
  onComplete: vi.fn(),
};
```

---

[← Архитектура](architecture.md) | [→ React интеграция](react-integration.md)</contents>
</xai:function_call name
