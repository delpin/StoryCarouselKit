# Методы управления

Методы класса StoryCarousel для программного управления воспроизведением.

## Основные методы

### getState(): StoryCarouselStateInfo

Возвращает полную информацию о состоянии карусели.

```typescript
getState(): StoryCarouselStateInfo
```

**Возвращает:**
- `StoryCarouselStateInfo` - Объект с полным состоянием

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });
const state = carousel.getState();

console.log(`Текущая история: ${state.currentIndex}`);
console.log(`Состояние: ${state.state}`); // 'idle', 'playing', 'paused', 'completed'
console.log(`Прогресс: ${(state.progress * 100).toFixed(1)}%`);
console.log(`Просмотрено историй: ${state.viewedStories.length}`);
```

### play(): void

Запускает воспроизведение историй.

```typescript
play(): void
```

**Пример:**
```typescript
const carousel = new StoryCarousel({
  stories,
  autoPlay: false, // Отключаем автозапуск
});

// Ручной запуск
carousel.play();
```

### pause(): void

Приостанавливает воспроизведение.

```typescript
pause(): void
```

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Приостановка через 2 секунды
setTimeout(() => {
  carousel.pause();
}, 2000);
```

### next(): void

Переходит к следующей истории.

```typescript
next(): void
```

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Переход к следующей истории
carousel.next();
```

### prev(): void

Переходит к предыдущей истории.

```typescript
prev(): void
```

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Возврат к предыдущей истории
carousel.prev();
```

### goTo(index: number): void

Переходит к истории по указанному индексу.

```typescript
goTo(index: number): void
```

**Параметры:**
- `index: number` - Индекс истории (начиная с 0)

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Переход к третьей истории
carousel.goTo(2);
```

### destroy(): void

Очищает ресурсы и останавливает все таймеры.

```typescript
destroy(): void
```

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Очистка при размонтировании компонента
componentWillUnmount() {
  carousel.destroy();
}
```

### addStory(story: Story): void

Добавляет новую историю в конец очереди.

```typescript
addStory(story: Story): void
```

**Параметры:**
- `story: Story` - История для добавления

**Пример:**
```typescript
const carousel = new StoryCarousel({ stories });

// Динамическое добавление истории
carousel.addStory({
  id: 'new-story',
  content: 'Новая история',
  duration: 3000,
});

// Добавление во время воспроизведения
setTimeout(() => {
  carousel.addStory({
    id: 'another-story',
    content: 'Еще одна история',
    duration: 4000,
  });
}, 2000);
```

## React-специфичные методы

### useImperativeHandle (React)

```tsx
import { forwardRef, useImperativeHandle } from 'react';

const StoryCarouselWithRef = forwardRef<StoryCarouselHandle, StoryCarouselProps>(
  (props, ref) => {
    const carouselRef = useRef<StoryCarouselCore | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => carouselRef.current?.play(),
      pause: () => carouselRef.current?.pause(),
      next: () => carouselRef.current?.next(),
      prev: () => carouselRef.current?.prev(),
      goTo: (index: number) => carouselRef.current?.goTo(index),
      getState: () => carouselRef.current?.getState(),
    }));

    return <StoryCarousel {...props} ref={carouselRef} />;
  }
);

export interface StoryCarouselHandle {
  play(): void;
  pause(): void;
  next(): void;
  prev(): void;
  goTo(index: number): void;
  getState(): StoryCarouselState;
}
```

**Использование:**
```tsx
function App() {
  const carouselRef = useRef<StoryCarouselHandle>(null);

  return (
    <div>
      <StoryCarouselWithRef ref={carouselRef} stories={stories} />

      <div>
        <button onClick={() => carouselRef.current?.play()}>▶</button>
        <button onClick={() => carouselRef.current?.pause()}>⏸</button>
        <button onClick={() => carouselRef.current?.next()}>→</button>
        <button onClick={() => carouselRef.current?.prev()}>←</button>
      </div>
    </div>
  );
}
```

## Продвинутые методы

### Управление скоростью

```typescript
class ExtendedStoryCarousel extends StoryCarousel {
  private speedMultiplier = 1;

  setSpeed(multiplier: number) {
    this.speedMultiplier = Math.max(0.1, Math.min(5, multiplier));
  }

  getSpeed(): number {
    return this.speedMultiplier;
  }

  // Переопределяем внутренние методы для учета скорости
  protected getEffectiveDuration(story: Story): number {
    const baseDuration = story.duration || this.config.defaultDuration!;
    return baseDuration / this.speedMultiplier;
  }
}
```

**Использование:**
```typescript
const carousel = new ExtendedStoryCarousel({ stories });

// Ускоренное воспроизведение
carousel.setSpeed(2);

// Замедленное воспроизведение
carousel.setSpeed(0.5);
```

### Управление очередью

```typescript
class QueueableStoryCarousel extends StoryCarousel {
  private queue: Story[] = [];

  addToQueue(story: Story) {
    this.queue.push(story);
  }

  addMultipleToQueue(stories: Story[]) {
    this.queue.push(...stories);
  }

  clearQueue() {
    this.queue = [];
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  processQueue() {
    if (this.queue.length > 0) {
      const nextStory = this.queue.shift();
      // Добавить к текущим историям
      this.config.stories.push(nextStory!);
    }
  }
}
```

### Методы для навигации

```typescript
class NavigationStoryCarousel extends StoryCarousel {
  // Переход к первой истории
  goToFirst() {
    this.goTo(0);
  }

  // Переход к последней истории
  goToLast() {
    this.goTo(this.config.stories.length - 1);
  }

  // Переход к следующему блоку историй
  nextBlock(blockSize: number = 3) {
    const currentBlock = Math.floor(this.state.currentIndex / blockSize);
    const nextBlockStart = (currentBlock + 1) * blockSize;

    if (nextBlockStart < this.config.stories.length) {
      this.goTo(nextBlockStart);
    } else {
      this.config.onComplete?.();
    }
  }

  // Проверка возможности навигации
  canGoNext(): boolean {
    return this.state.currentIndex < this.config.stories.length - 1;
  }

  canGoPrev(): boolean {
    return this.state.currentIndex > 0;
  }

  // Циклическая навигация
  nextCircular() {
    if (this.canGoNext()) {
      this.next();
    } else {
      this.goToFirst();
    }
  }

  prevCircular() {
    if (this.canGoPrev()) {
      this.prev();
    } else {
      this.goToLast();
    }
  }
}
```

## Методы для работы с состоянием

### Сериализация состояния

```typescript
class SerializableStoryCarousel extends StoryCarousel {
  // Сохранение состояния
  saveState(): string {
    const state = this.getState();
    return JSON.stringify({
      currentIndex: state.currentIndex,
      isPlaying: state.isPlaying,
      progress: state.progress,
      timestamp: Date.now(),
    });
  }

  // Восстановление состояния
  loadState(savedState: string): boolean {
    try {
      const parsed = JSON.parse(savedState);
      const age = Date.now() - parsed.timestamp;

      // Проверка актуальности (не старше 24 часов)
      if (age > 24 * 60 * 60 * 1000) {
        return false;
      }

      this.goTo(parsed.currentIndex);

      if (parsed.isPlaying) {
        this.play();
      } else {
        this.pause();
      }

      return true;
    } catch {
      return false;
    }
  }

  // Сохранение в localStorage
  saveToStorage(key: string = 'story-carousel-state') {
    localStorage.setItem(key, this.saveState());
  }

  // Загрузка из localStorage
  loadFromStorage(key: string = 'story-carousel-state'): boolean {
    const saved = localStorage.getItem(key);
    if (saved) {
      return this.loadState(saved);
    }
    return false;
  }
}
```

### Методы для тестирования

```typescript
class TestableStoryCarousel extends StoryCarousel {
  // Быстрая перемотка для тестирования
  fastForward(duration: number = 1000) {
    // Ускоренное завершение текущей истории
    setTimeout(() => {
      this.next();
    }, duration);
  }

  // Перемотка всех историй
  fastForwardAll() {
    let index = 0;
    const fastForwardNext = () => {
      if (index < this.config.stories.length) {
        this.goTo(index);
        setTimeout(() => {
          index++;
          fastForwardNext();
        }, 100);
      }
    };
    fastForwardNext();
  }

  // Моделирование взаимодействия пользователя
  simulateUserInteraction(type: 'tap' | 'swipe', position?: { x: number; y: number }) {
    // Имитация события взаимодействия
    this.config.onInteraction?.({
      type,
      story: this.state.currentStory!,
      position,
      timestamp: Date.now(),
    });
  }

  // Получение статистики для тестирования
  getTestStats() {
    return {
      totalStories: this.config.stories.length,
      currentIndex: this.state.currentIndex,
      isPlaying: this.state.isPlaying,
      progress: this.state.progress,
      hasCompleted: this.state.currentIndex >= this.config.stories.length,
    };
  }
}
```

## Асинхронные методы

### Promise-based API

```typescript
class AsyncStoryCarousel extends StoryCarousel {
  async playAsync(): Promise<void> {
    return new Promise((resolve) => {
      this.play();
      // Разрешить промис при следующем изменении состояния
      const checkPlaying = () => {
        if (this.state.isPlaying) {
          resolve();
        } else {
          setTimeout(checkPlaying, 10);
        }
      };
      checkPlaying();
    });
  }

  async waitForCompletion(): Promise<void> {
    return new Promise((resolve) => {
      const originalComplete = this.config.onComplete;
      this.config.onComplete = () => {
        originalComplete?.();
        resolve();
      };
    });
  }

  async waitForStory(storyId: string): Promise<Story> {
    return new Promise((resolve) => {
      const checkCurrent = () => {
        if (this.state.currentStory?.id === storyId) {
          resolve(this.state.currentStory);
        } else {
          setTimeout(checkCurrent, 100);
        }
      };
      checkCurrent();
    });
  }
}
```

**Использование асинхронных методов:**
```typescript
async function runStorySequence() {
  const carousel = new AsyncStoryCarousel({ stories });

  await carousel.playAsync();
  console.log('Воспроизведение начато');

  await carousel.waitForStory('story-2');
  console.log('Дошли до второй истории');

  await carousel.waitForCompletion();
  console.log('Все истории просмотрены');
}
```

---

[← События](events.md) | [→ Contributing](contributing.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/contributing.md