# Contributing

Руководство по внесению вклада в развитие Story Carousel.

## Как внести вклад

### 1. Форк и клонирование

```bash
# Форк репозитория на GitHub
# Клонирование вашего форка
git clone https://github.com/YOUR_USERNAME/story-carousel-monorepo.git
cd story-carousel-monorepo

# Добавление upstream
git remote add upstream https://github.com/original/story-carousel-monorepo.git
```

### 2. Настройка среды разработки

```bash
# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev

# Сборка всех пакетов
pnpm build
```

### 3. Создание ветки для изменений

```bash
# Создание ветки для новой функциональности
git checkout -b feature/new-feature-name

# Или для исправления бага
git checkout -b fix/bug-description
```

## Структура проекта

```
packages/
├── native/           # Ядро на TypeScript
│   ├── src/
│   │   └── index.ts  # Основная логика
│   └── test/         # Тесты
├── react/            # React обертка
│   ├── src/
│   │   ├── StoryCarousel.tsx
│   │   └── index.ts
│   └── test/
├── vue/              # Vue обертка (планируется)
├── svelte/           # Svelte обертка (планируется)
└── angular/          # Angular обертка (планируется)
```

## Разработка новых фреймворк-оберток

### Шаблон для новой обертки

```typescript
// packages/framework-name/src/index.ts
import {
  StoryCarousel as StoryCarouselCore,
  Story,
  StoryCarouselConfig,
} from "@storykit/core";

// Типы для фреймворка
export interface FrameworkStoryCarouselProps {
  stories: Story[];
  autoPlay?: boolean;
  defaultDuration?: number;
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
  // Framework-specific пропсы
  className?: string;
  style?: FrameworkStyleType;
}

// Основной компонент
export class FrameworkStoryCarousel {
  private core: StoryCarouselCore;
  private container: FrameworkElement;

  constructor(props: FrameworkStoryCarouselProps) {
    this.core = new StoryCarouselCore({
      stories: props.stories,
      autoPlay: props.autoPlay,
      defaultDuration: props.defaultDuration,
      onStoryEnd: props.onStoryEnd,
      onStoryStart: props.onStoryStart,
      onComplete: props.onComplete,
    });

    this.setupUI(props);
    this.setupEventListeners();
  }

  private setupUI(props: FrameworkStoryCarouselProps) {
    // Создание UI элементов фреймворка
    this.container = createFrameworkElement("div", {
      className: props.className,
      style: props.style,
    });

    // Создание индикаторов прогресса
    this.createProgressIndicators();

    // Создание контейнера контента
    this.createContentContainer();
  }

  private setupEventListeners() {
    // Настройка слушателей событий фреймворка
    // Синхронизация с нативным ядром
  }

  private createProgressIndicators() {
    // Создание индикаторов прогресса
  }

  private createContentContainer() {
    // Создание контейнера для контента историй
  }

  // Публичные методы
  play() {
    this.core.play();
  }
  pause() {
    this.core.pause();
  }
  next() {
    this.core.next();
  }
  prev() {
    this.core.prev();
  }
  destroy() {
    this.core.destroy();
  }
}
```

## Тестирование

### Запуск тестов

```bash
# Все тесты
pnpm test

# Тесты конкретного пакета
pnpm --filter@storycarouselkit/core test

# Тесты в watch режиме
pnpm --filter @storykit/react test -- --watch
```

### Написание тестов

```typescript
// packages/native/test/story-carousel.test.ts
import { StoryCarousel } from "../src";

describe("StoryCarousel", () => {
  const mockStories = [
    { id: "1", content: "Story 1", duration: 1000 },
    { id: "2", content: "Story 2", duration: 1000 },
  ];

  it("should initialize with correct state", () => {
    const carousel = new StoryCarousel({ stories: mockStories });

    const state = carousel.getState();
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.currentStory?.id).toBe("1");
  });

  it("should navigate to next story", () => {
    const carousel = new StoryCarousel({
      stories: mockStories,
      autoPlay: false,
    });

    carousel.next();
    const state = carousel.getState();
    expect(state.currentIndex).toBe(1);
    expect(state.currentStory?.id).toBe("2");
  });

  it("should call onComplete when reaching end", () => {
    const onComplete = jest.fn();
    const carousel = new StoryCarousel({
      stories: mockStories,
      autoPlay: false,
      onComplete,
    });

    // Перейти к последней истории
    carousel.goTo(1);
    // Завершить последнюю историю
    carousel.next();

    expect(onComplete).toHaveBeenCalled();
  });
});
```

## Code Style и качество

### Pre-commit hooks

Проект использует Husky для pre-commit hooks:

```bash
# Автоматическая установка hooks
pnpm install

# Ручная проверка
pnpm lint
pnpm test
pnpm build
```

### TypeScript конфигурация

Все пакеты используют строгую TypeScript конфигурацию:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Code formatting

```bash
# Форматирование кода
pnpm format

# Проверка форматирования
pnpm format:check
```

## Добавление новых фич

### Процесс разработки фич

1. **Создание Issue** - Опишите предлагаемую функциональность
2. **Обсуждение** - Согласуйте детали с maintainers
3. **Реализация** - Следуйте TDD подходу
4. **Тестирование** - Напишите всесторонние тесты
5. **Документация** - Обновите документацию
6. **Pull Request** - Создайте PR с подробным описанием

### Архитектурные решения

#### Добавление новой функциональности в ядро

```typescript
// packages/native/src/index.ts

// Новые поля в конфигурации
export interface StoryCarouselConfig {
  // ... существующие поля
  enableKeyboardNavigation?: boolean;
  enableSwipeGestures?: boolean;
}

// Новые методы в классе
export class StoryCarousel {
  // ... существующие методы

  private handleKeyboard = (event: KeyboardEvent) => {
    if (!this.config.enableKeyboardNavigation) return;

    switch (event.key) {
      case "ArrowRight":
        this.next();
        break;
      case "ArrowLeft":
        this.prev();
        break;
      case " ":
        event.preventDefault();
        if (this.state.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
        break;
    }
  };

  private setupKeyboardListeners() {
    if (this.config.enableKeyboardNavigation) {
      document.addEventListener("keydown", this.handleKeyboard);
    }
  }
}
```

#### Добавление опций в React обертку

```tsx
// packages/react/src/StoryCarousel.tsx

export interface StoryCarouselProps extends Omit<
  StoryCarouselConfig,
  "onStoryEnd" | "onStoryStart" | "onComplete"
> {
  // ... существующие пропсы
  enableKeyboardNavigation?: boolean;
  enableSwipeGestures?: boolean;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({
  enableKeyboardNavigation = false,
  enableSwipeGestures = true,
  // ... другие пропсы
}) => {
  // ... существующая логика

  useEffect(() => {
    const config: StoryCarouselConfig = {
      // ... существующая конфигурация
      enableKeyboardNavigation,
      enableSwipeGestures,
    };

    carouselRef.current = new StoryCarouselCore(config);
  }, [enableKeyboardNavigation, enableSwipeGestures]);
};
```

## Сборка и релиз

### Сборка пакетов

```bash
# Сборка всех пакетов
pnpm build

# Сборка конкретного пакета
pnpm --filter @storykit/react build
```

### Публикация

```bash
# Bump версии (patch, minor, major)
pnpm version patch

# Публикация всех пакетов
pnpm publish --recursive

# Или публикация конкретного пакета
pnpm publish --filter @storykit/react
```

### Release процесс

1. Обновление CHANGELOG.md
2. Создание git tag
3. Публикация на npm
4. Создание GitHub release

## Troubleshooting

### Распространенные проблемы

#### Проблема: "Cannot resolve dependency"

```bash
# Очистка кэша и переустановка
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Проблема: "TypeScript errors"

```bash
# Проверка типов
pnpm --filter@storycarouselkit/core run type-check

# Или для всех пакетов
pnpm type-check
```

#### Проблема: "Build fails"

```bash
# Очистка и пересборка
pnpm clean
pnpm build
```

## Сообщество

### Каналы связи

- **GitHub Issues** - для багов и фич-реквестов
- **GitHub Discussions** - для вопросов и обсуждений
- **Discord** - для быстрого общения

### Кодекс поведения

Мы следуем [Contributor Covenant](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

### Благодарности

Спасибо всем контрибьюторам! Ваши вклады делают проект лучше.

---

[← Методы управления](methods.md) | [→ Тестирование](testing.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/testing.md
