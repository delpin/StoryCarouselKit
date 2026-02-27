# API Reference: Типы данных

Полное описание всех TypeScript интерфейсов и типов Story Carousel.

## Базовые типы

### Story

Основной интерфейс для описания истории в карусели.

```typescript
interface Story {
  /** Уникальный идентификатор истории */
  id: string;

  /** Текстовое содержимое истории */
  content: string;

  /** Длительность отображения в миллисекундах (опционально) */
  duration?: number;

  /** URL медиафайла (изображение/видео) (опционально) */
  mediaUrl?: string;
}
```

**Примеры использования:**
```typescript
const textStory: Story = {
  id: 'welcome',
  content: 'Добро пожаловать!',
  duration: 3000,
};

const mediaStory: Story = {
  id: 'photo1',
  content: 'Мой отпуск',
  mediaUrl: '/vacation.jpg',
  duration: 4000,
};
```

### StoryCarouselConfig

Конфигурация для инициализации экземпляра StoryCarousel.

```typescript
interface StoryCarouselConfig {
  /** Массив историй для отображения */
  stories: Story[];

  /** Автоматический запуск воспроизведения (по умолчанию: true) */
  autoPlay?: boolean;

  /** Длительность по умолчанию для историй в мс (по умолчанию: 5000) */
  defaultDuration?: number;

  /** Интервал обновления прогресса в мс (по умолчанию: 100) */
  progressUpdateInterval?: number;

  /** Коллбэк при завершении истории */
  onStoryEnd?: (story: Story) => void;

  /** Коллбэк при начале истории */
  onStoryStart?: (story: Story) => void;

  /** Коллбэк при завершении всех историй */
  onComplete?: () => void;

  /** Коллбэк при просмотре истории */
  onStoryViewed?: (story: Story) => void;
}
```

**Примеры конфигурации:**
```typescript
const config: StoryCarouselConfig = {
  stories: myStories,
  autoPlay: true,
  defaultDuration: 4000,
  progressUpdateInterval: 50, // Более плавная анимация
  onStoryStart: (story) => console.log(`Начата: ${story.id}`),
  onStoryViewed: (story) => {
    // Сохранить в аналитику
    analytics.track('story_viewed', { storyId: story.id });
  },
  onStoryEnd: (story) => console.log(`Завершена: ${story.id}`),
  onComplete: () => console.log('Все истории просмотрены'),
};
```

### StoryCarouselState

State machine для управления состоянием карусели.

```typescript
type StoryCarouselState = 'idle' | 'playing' | 'paused' | 'completed';
```

**Состояния:**
- `'idle'` - начальное состояние, ожидание запуска
- `'playing'` - активное воспроизведение
- `'paused'` - воспроизведение приостановлено
- `'completed'` - все истории просмотрены

### StoryCarouselStateInfo

Полная информация о состоянии карусели.

```typescript
interface StoryCarouselStateInfo {
  /** Индекс текущей истории (начиная с 0) */
  currentIndex: number;

  /** Текущее состояние state machine */
  state: StoryCarouselState;

  /** Прогресс текущей истории (0.0 до 1.0) */
  progress: number;

  /** Текущая история или null */
  currentStory: Story | null;

  /** Массив ID просмотренных историй */
  viewedStories: string[];
}
```

**Использование:**
```typescript
const carousel = new StoryCarousel(config);
const state = carousel.getState();

console.log(`История ${state.currentIndex + 1} из ${config.stories.length}`);
console.log(`Состояние: ${state.state}`); // 'playing', 'paused', etc.
console.log(`Прогресс: ${(state.progress * 100).toFixed(1)}%`);
console.log(`Просмотрено: ${state.viewedStories.length} историй`);
```

## React-специфичные типы

### StoryCarouselProps (React)

Пропсы для React компонента StoryCarousel.

```typescript
interface StoryCarouselProps extends Omit<StoryCarouselConfig, 'onStoryEnd' | 'onStoryStart' | 'onComplete'> {
  /** CSS класс для контейнера */
  className?: string;

  /** Inline стили для контейнера */
  style?: React.CSSProperties;

  /** Кастомный рендерер для историй */
  renderStory?: (story: Story, progress: number) => React.ReactNode;

  /** Коллбэк при завершении истории */
  onStoryEnd?: (story: Story) => void;

  /** Коллбэк при начале истории */
  onStoryStart?: (story: Story) => void;

  /** Коллбэк при завершении всех историй */
  onComplete?: () => void;
}
```

**Примеры использования:**
```tsx
// Базовое использование
<StoryCarousel stories={stories} />

// С кастомными стилями
<StoryCarousel
  stories={stories}
  className="my-carousel"
  style={{ width: '400px', height: '600px' }}
/>

// С кастомным рендерингом
<StoryCarousel
  stories={stories}
  renderStory={(story, progress) => (
    <div style={{ background: '#000', color: '#fff' }}>
      {story.content}
    </div>
  )}
/>
```

## Расширенные типы

### TypedStory

Расширенный тип истории с дополнительными полями для сложных сценариев.

```typescript
interface TypedStory extends Story {
  /** Тип контента истории */
  type: 'text' | 'image' | 'video' | 'interactive';

  /** Дополнительные метаданные */
  metadata?: {
    /** Автор контента */
    author?: string;

    /** Дата создания */
    createdAt?: Date;

    /** Тэги для категоризации */
    tags?: string[];

    /** Геолокация */
    location?: {
      lat: number;
      lng: number;
      name?: string;
    };
  };

  /** Настройки интерактивности (для type: 'interactive') */
  interactive?: {
    /** Тип взаимодействия */
    interactionType: 'poll' | 'quiz' | 'cta';

    /** Вопрос для опроса/викторины */
    question?: string;

    /** Варианты ответов */
    options?: string[];

    /** Правильный ответ (для викторин) */
    correctAnswer?: number;

    /** URL для CTA */
    ctaUrl?: string;

    /** Текст CTA */
    ctaText?: string;
  };
}
```

**Примеры расширенных историй:**
```typescript
const pollStory: TypedStory = {
  id: 'poll1',
  content: 'Опрос',
  type: 'interactive',
  duration: 8000,
  metadata: {
    author: 'Команда продукта',
    tags: ['опрос', 'фидбек'],
  },
  interactive: {
    interactionType: 'poll',
    question: 'Какую функцию вы хотели бы видеть?',
    options: ['Темная тема', 'Экспорт данных', 'Оффлайн режим'],
  },
};

const ctaStory: TypedStory = {
  id: 'cta1',
  content: 'Специальное предложение!',
  type: 'image',
  mediaUrl: '/promo.jpg',
  duration: 5000,
  interactive: {
    interactionType: 'cta',
    ctaUrl: '/promo',
    ctaText: 'Узнать больше',
  },
};
```

### StoryMetrics

Тип для отслеживания метрик просмотров.

```typescript
interface StoryMetrics {
  /** Уникальный ID просмотра */
  viewId: string;

  /** ID истории */
  storyId: string;

  /** ID пользователя */
  userId?: string;

  /** Время начала просмотра */
  startedAt: Date;

  /** Время завершения просмотра */
  completedAt?: Date;

  /** Общее время просмотра в мс */
  timeSpent: number;

  /** Доля просмотра (0.0 до 1.0) */
  completionRate: number;

  /** Тип взаимодействия */
  interactionType?: 'tap' | 'swipe' | 'auto' | 'pause';

  /** Дополнительные данные */
  metadata?: Record<string, any>;
}
```

**Использование для аналитики:**
```typescript
const trackStoryView = (story: Story, metrics: Partial<StoryMetrics>) => {
  const viewMetrics: StoryMetrics = {
    viewId: generateId(),
    storyId: story.id,
    startedAt: new Date(),
    timeSpent: 0,
    completionRate: 0,
    ...metrics,
  };

  // Отправка в аналитику
  analytics.track('story_view', viewMetrics);
};
```

## Утилитарные типы

### DeepPartial

Утилитарный тип для создания частичных объектов с глубокой вложенностью.

```typescript
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
```

**Использование:**
```typescript
// Частичная конфигурация
const partialConfig: DeepPartial<StoryCarouselConfig> = {
  autoPlay: false,
  onStoryEnd: (story) => console.log(story),
};
```

### StoryCarouselEvents

Типизированные события карусели.

```typescript
interface StoryCarouselEvents {
  /** Событие начала истории */
  storyStart: (story: Story) => void;

  /** Событие завершения истории */
  storyEnd: (story: Story) => void;

  /** Событие завершения всех историй */
  complete: () => void;

  /** Событие изменения состояния */
  stateChange: (state: StoryCarouselState) => void;

  /** Событие ошибки */
  error: (error: Error) => void;
}
```

### StoryRenderer

Тип для кастомных рендереров историй.

```typescript
type StoryRenderer<T = any> = (
  story: Story,
  progress: number,
  context?: T
) => React.ReactNode | HTMLElement | string;
```

**Примеры рендереров:**
```tsx
// React рендерер
const reactRenderer: StoryRenderer = (story, progress) => (
  <div style={{ background: '#000', color: '#fff' }}>
    {story.content}
  </div>
);

// HTML рендерер
const htmlRenderer: StoryRenderer = (story, progress) => {
  const div = document.createElement('div');
  div.style.background = '#000';
  div.style.color = '#fff';
  div.textContent = story.content;
  return div;
};
```

## Перечисления и константы

### StoryTypes

```typescript
enum StoryTypes {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  INTERACTIVE = 'interactive',
  CAROUSEL = 'carousel',
}
```

### InteractionTypes

```typescript
enum InteractionTypes {
  POLL = 'poll',
  QUIZ = 'quiz',
  CTA = 'cta',
  SHARE = 'share',
  SAVE = 'save',
}
```

### DefaultValues

```typescript
const DefaultValues = {
  DURATION: 5000,
  AUTOPLAY: true,
  PROGRESS_UPDATE_INTERVAL: 100,
} as const;
```

## Обобщенные типы

### GenericStoryCarousel

Обобщенный тип для типизированных историй.

```typescript
interface GenericStoryCarousel<T extends Story = Story> {
  constructor(config: StoryCarouselConfig<T>): void;
  getState(): StoryCarouselState<T>;
  // ... другие методы
}
```

### ThemeConfig

Тип для конфигурации тем.

```typescript
interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: number;
      medium: number;
      large: number;
    };
  };
  animations: {
    duration: number;
    easing: string;
  };
}
```

**Пример темы:**
```typescript
const darkTheme: ThemeConfig = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#ff6b6b',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      small: 14,
      medium: 16,
      large: 20,
    },
  },
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
};
```

---

[← Продвинутые опции](advanced-options.md) | [→ События](events.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/events.md