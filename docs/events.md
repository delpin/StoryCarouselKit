# События и коллбэки

Система событий Story Carousel позволяет реагировать на различные действия пользователя и изменения состояния.

## Основные события

### onStoryStart

Вызывается при начале отображения истории.

```typescript
interface StoryCarouselConfig {
  onStoryStart?: (story: Story) => void;
}
```

**Параметры:**
- `story: Story` - История, которая начала отображаться

**Примеры использования:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryStart: (story) => {
    console.log(`Начало истории: ${story.id}`);

    // Аналитика
    analytics.track('story_started', {
      storyId: story.id,
      timestamp: Date.now(),
    });

    // Предзагрузка следующей истории
    preloadNextStory(story);
  },
});
```

```tsx
<StoryCarousel
  stories={stories}
  onStoryStart={(story) => {
    // Обновление заголовка страницы
    document.title = story.content;

    // Отправка в аналитику
    gtag('event', 'story_view', {
      story_id: story.id,
    });
  }}
/>
```

### onStoryEnd

Вызывается при завершении отображения истории (по таймеру или действию пользователя).

```typescript
interface StoryCarouselConfig {
  onStoryEnd?: (story: Story) => void;
}
```

**Параметры:**
- `story: Story` - История, которая завершилась

**Примеры использования:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryEnd: (story) => {
    console.log(`Завершена история: ${story.id}`);

    // Сохранение прогресса
    saveProgress(story.id, 'completed');

    // Отправка статистики
    api.post('/story-views', {
      storyId: story.id,
      completedAt: new Date(),
    });
  },
});
```

```tsx
<StoryCarousel
  stories={stories}
  onStoryEnd={(story) => {
    // Обновление счетчика просмотров
    updateViewCount(story.id);

    // Показать следующий контент
    if (story.id === 'intro') {
      showTutorialStep(2);
    }
  }}
/>
```

### onStoryViewed

Вызывается при просмотре истории (когда она завершается воспроизведение).

```typescript
interface StoryCarouselConfig {
  onStoryViewed?: (story: Story) => void;
}
```

**Параметры:**
- `story: Story` - Просмотренная история

**Примеры использования:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onStoryViewed: (story) => {
    console.log(`История ${story.id} просмотрена`);

    // Сохранение в localStorage
    const viewed = JSON.parse(localStorage.getItem('viewedStories') || '[]');
    viewed.push({
      id: story.id,
      timestamp: Date.now(),
      duration: story.duration
    });
    localStorage.setItem('viewedStories', JSON.stringify(viewed));

    // Аналитика
    analytics.track('story_viewed', {
      storyId: story.id,
      timeSpent: story.duration,
      totalViewed: viewed.length,
    });
  },
});
```

```tsx
<StoryCarousel
  stories={stories}
  onStoryViewed={(story) => {
    // Обновление прогресса обучения
    updateLearningProgress(story.id);

    // Отправка в аналитику
    mixpanel.track('Story Viewed', {
      story_id: story.id,
      story_type: story.mediaUrl ? 'media' : 'text',
    });
  }}
/>
```

### onComplete

Вызывается при завершении просмотра всех историй.

```typescript
interface StoryCarouselConfig {
  onComplete?: () => void;
}
```

**Параметры:** Нет

**Примеры использования:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onComplete: () => {
    console.log('Все истории просмотрены!');

    // Показать финальное сообщение
    showCompletionMessage();

    // Перенаправить пользователя
    setTimeout(() => {
      window.location.href = '/next-step';
    }, 2000);
  },
});
```

```tsx
<StoryCarousel
  stories={stories}
  onComplete={() => {
    // Аналитика завершения
    analytics.track('onboarding_completed');

    // Сохранить статус в локальном хранилище
    localStorage.setItem('onboarding_complete', 'true');

    // Показать следующий экран
    setShowWelcomeScreen(true);
  }}
/>
```

## Продвинутые события

### События состояния (React-specific)

```tsx
interface AdvancedStoryCarouselProps extends StoryCarouselProps {
  /** Коллбэк при изменении состояния воспроизведения */
  onPlayStateChange?: (isPlaying: boolean) => void;

  /** Коллбэк при изменении прогресса */
  onProgressChange?: (progress: number, story: Story) => void;

  /** Коллбэк при изменении текущей истории */
  onCurrentStoryChange?: (story: Story | null) => void;
}
```

**Примеры:**
```tsx
function AdvancedStoryCarousel() {
  return (
    <StoryCarousel
      stories={stories}
      onPlayStateChange={(isPlaying) => {
        console.log(`Воспроизведение: ${isPlaying ? 'активно' : 'пауза'}`);
      }}
      onProgressChange={(progress, story) => {
        console.log(`Прогресс истории ${story.id}: ${(progress * 100).toFixed(1)}%`);
      }}
      onCurrentStoryChange={(story) => {
        if (story) {
          console.log(`Текущая история: ${story.id}`);
        } else {
          console.log('Истории закончились');
        }
      }}
    />
  );
}
```

### Кастомные события

Можно создавать собственные события для специфических сценариев:

```typescript
class ExtendedStoryCarousel extends StoryCarouselCore {
  private eventListeners: Map<string, Function[]> = new Map();

  addEventListener(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  removeEventListener(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  protected emitEvent(event: string, ...args: any[]) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(...args));
    }
  }

  next() {
    super.next();
    this.emitEvent('navigation', 'next', this.getState());
  }

  prev() {
    super.prev();
    this.emitEvent('navigation', 'prev', this.getState());
  }

  play() {
    super.play();
    this.emitEvent('playback', 'play');
  }

  pause() {
    super.pause();
    this.emitEvent('playback', 'pause');
  }
}
```

**Использование кастомных событий:**
```typescript
const carousel = new ExtendedStoryCarousel({ stories });

carousel.addEventListener('navigation', (direction, state) => {
  console.log(`Навигация ${direction} к истории ${state.currentIndex}`);
});

carousel.addEventListener('playback', (action) => {
  console.log(`Воспроизведение: ${action}`);
});
```

## Обработка ошибок

### onError

Событие для обработки ошибок во время работы карусели.

```typescript
interface StoryCarouselConfig {
  onError?: (error: Error, context?: any) => void;
}
```

**Примеры ошибок:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onError: (error, context) => {
    console.error('Ошибка в карусели:', error);

    // Логирование ошибок
    errorReporting.captureException(error, {
      tags: { component: 'story-carousel' },
      extra: { context },
    });

    // Fallback поведение
    if (error.message.includes('media')) {
      showFallbackContent();
    }
  },
});
```

## События взаимодействия

### onInteraction

Отслеживание взаимодействий пользователя с каруселью.

```typescript
interface InteractionEvent {
  type: 'tap' | 'swipe' | 'hold' | 'release';
  story: Story;
  position?: { x: number; y: number };
  timestamp: number;
}

interface StoryCarouselConfig {
  onInteraction?: (event: InteractionEvent) => void;
}
```

**Примеры:**
```typescript
const carousel = new StoryCarousel({
  stories,
  onInteraction: (event) => {
    console.log(`Взаимодействие: ${event.type} на истории ${event.story.id}`);

    // Аналитика взаимодействий
    analytics.track('story_interaction', {
      interaction_type: event.type,
      story_id: event.story.id,
      position: event.position,
    });

    // Специальная обработка
    if (event.type === 'hold') {
      showPauseIndicator();
    } else if (event.type === 'release') {
      hidePauseIndicator();
    }
  },
});
```

## Асинхронные коллбэки

### Promise-based события

```typescript
interface AsyncStoryCarouselConfig extends StoryCarouselConfig {
  onStoryStartAsync?: (story: Story) => Promise<void>;
  onStoryEndAsync?: (story: Story) => Promise<void>;
  onCompleteAsync?: () => Promise<void>;
}
```

**Примеры асинхронных операций:**
```typescript
const carousel = new AsyncStoryCarousel({
  stories,
  onStoryStartAsync: async (story) => {
    // Асинхронная загрузка дополнительных данных
    const extraData = await api.get(`/stories/${story.id}/extra`);
    console.log('Дополнительные данные:', extraData);
  },
  onStoryEndAsync: async (story) => {
    // Асинхронное сохранение прогресса
    await api.post('/progress', {
      storyId: story.id,
      completed: true,
    });
  },
  onCompleteAsync: async () => {
    // Асинхронное завершение сессии
    await api.post('/session/complete', {
      sessionType: 'story_carousel',
      totalStories: stories.length,
    });
  },
});
```

## События жизненного цикла

### onMount / onUnmount

```typescript
interface LifecycleEvents {
  onMount?: () => void;
  onUnmount?: () => void;
  onBeforeDestroy?: () => void;
}
```

**Использование:**
```tsx
function LifecycleAwareCarousel() {
  const [mounted, setMounted] = useState(false);

  return (
    <StoryCarousel
      stories={stories}
      onMount={() => {
        console.log('Карусель смонтирована');
        setMounted(true);
      }}
      onUnmount={() => {
        console.log('Карусель размонтирована');
        setMounted(false);
      }}
    />
  );
}
```

## Debounced события

### Группировка частых событий

```typescript
function useDebouncedProgress(onProgress: (progress: number) => void, delay: number = 100) {
  const [debouncedProgress, setDebouncedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onProgress(debouncedProgress);
    }, delay);

    return () => clearTimeout(timer);
  }, [debouncedProgress, delay, onProgress]);

  return setDebouncedProgress;
}
```

**Использование:**
```tsx
function DebouncedProgressCarousel() {
  const handleProgress = useDebouncedProgress((progress) => {
    console.log(`Дебounced прогресс: ${(progress * 100).toFixed(1)}%`);
  }, 200);

  return (
    <StoryCarousel
      stories={stories}
      onProgressChange={handleProgress}
    />
  );
}
```

## События для тестирования

### Test events

```typescript
interface TestEvents {
  onTestStart?: () => void;
  onTestEnd?: (results: TestResults) => void;
  onTestError?: (error: Error) => void;
}

interface TestResults {
  totalStories: number;
  completedStories: number;
  totalTime: number;
  interactions: InteractionEvent[];
}
```

**Применение в тестах:**
```typescript
describe('StoryCarousel', () => {
  it('should complete all stories', async () => {
    const results: TestResults = {
      totalStories: 0,
      completedStories: 0,
      totalTime: 0,
      interactions: [],
    };

    render(
      <StoryCarousel
        stories={testStories}
        onTestStart={() => {
          results.totalStories = testStories.length;
        }}
        onComplete={() => {
          results.completedStories = testStories.length;
        }}
        onInteraction={(event) => {
          results.interactions.push(event);
        }}
      />
    );

    // Ожидание завершения
    await waitFor(() => {
      expect(results.completedStories).toBe(results.totalStories);
    });
  });
});
```

---

[← Типы данных](types.md) | [→ Методы управления](methods.md)</contents>
</xai:function_call name="xai:function_call>### Завершение документации

Я создал базовую структуру документации для проекта Story Carousel. Давайте завершим её оставшимися файлами для полноты.

Создам оставшиеся файлы: methods.md, contributing.md, testing.md, build-deploy.md