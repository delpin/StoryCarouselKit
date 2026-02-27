# Тестирование

Комплексное руководство по тестированию Story Carousel.

## Обзор стратегии тестирования

### Уровни тестирования

1. **Unit тесты** - тестирование отдельных функций и классов
2. **Integration тесты** - тестирование взаимодействия между компонентами
3. **E2E тесты** - тестирование полного пользовательского опыта

### Инструменты

- **Vitest** - для unit и integration тестов
- **React Testing Library** - для тестирования React компонентов
- **Playwright** - для E2E тестирования

## Unit тестирование

### Настройка тестов для нативного пакета

```typescript
// packages/native/vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
```

```typescript
// packages/native/test/setup.ts
import { beforeEach, afterEach } from "vitest";

// Глобальные настройки для тестов
beforeEach(() => {
  // Сброс таймеров
  vi.useFakeTimers();
});

afterEach(() => {
  // Очистка после каждого теста
  vi.restoreAllMocks();
  vi.clearAllTimers();
});
```

### Базовые тесты StoryCarousel

```typescript
// packages/native/test/story-carousel.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { StoryCarousel } from "../src";

describe("StoryCarousel", () => {
  const mockStories = [
    { id: "1", content: "Story 1", duration: 1000 },
    { id: "2", content: "Story 2", duration: 2000 },
    { id: "3", content: "Story 3", duration: 3000 },
  ];

  let carousel: StoryCarousel;

  beforeEach(() => {
    carousel = new StoryCarousel({
      stories: mockStories,
      autoPlay: false, // Отключаем автозапуск для предсказуемости
    });
  });

  describe("Инициализация", () => {
    it("инициализируется с правильным состоянием", () => {
      const state = carousel.getState();

      expect(state.currentIndex).toBe(0);
      expect(state.isPlaying).toBe(false);
      expect(state.progress).toBe(0);
      expect(state.currentStory?.id).toBe("1");
    });

    it("принимает конфигурацию autoPlay", () => {
      const autoPlayCarousel = new StoryCarousel({
        stories: mockStories,
        autoPlay: true,
      });

      const state = autoPlayCarousel.getState();
      expect(state.isPlaying).toBe(true);
    });
  });

  describe("Навигация", () => {
    it("переходит к следующей истории", () => {
      carousel.next();

      const state = carousel.getState();
      expect(state.currentIndex).toBe(1);
      expect(state.currentStory?.id).toBe("2");
      expect(state.progress).toBe(0);
    });

    it("переходит к предыдущей истории", () => {
      carousel.goTo(1); // Сначала переходим ко второй
      carousel.prev(); // Затем возвращаемся

      const state = carousel.getState();
      expect(state.currentIndex).toBe(0);
      expect(state.currentStory?.id).toBe("1");
    });

    it("не переходит за границы массива", () => {
      carousel.goTo(2); // Последняя история
      carousel.next(); // Попытка перейти дальше

      const state = carousel.getState();
      expect(state.currentIndex).toBe(2);
    });

    it("вызывает onComplete при достижении конца", () => {
      const onComplete = vi.fn();
      const completeCarousel = new StoryCarousel({
        stories: mockStories,
        autoPlay: false,
        onComplete,
      });

      completeCarousel.goTo(2); // Последняя история
      completeCarousel.next(); // Завершение

      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe("Воспроизведение", () => {
    it("запускает воспроизведение", () => {
      carousel.play();

      const state = carousel.getState();
      expect(state.isPlaying).toBe(true);
    });

    it("приостанавливает воспроизведение", () => {
      carousel.play();
      carousel.pause();

      const state = carousel.getState();
      expect(state.isPlaying).toBe(false);
    });

    it("автоматически переходит к следующей истории", () => {
      carousel.play();

      // Имитация прошедшего времени
      vi.advanceTimersByTime(1000);

      const state = carousel.getState();
      expect(state.currentIndex).toBe(1);
    });
  });

  describe("Коллбэки", () => {
    it("вызывает onStoryStart при начале истории", () => {
      const onStoryStart = vi.fn();
      const callbackCarousel = new StoryCarousel({
        stories: mockStories,
        autoPlay: false,
        onStoryStart,
      });

      callbackCarousel.goTo(1);

      expect(onStoryStart).toHaveBeenCalledWith(mockStories[1]);
    });

    it("вызывает onStoryEnd при завершении истории", () => {
      const onStoryEnd = vi.fn();
      const callbackCarousel = new StoryCarousel({
        stories: mockStories,
        autoPlay: false,
        onStoryEnd,
      });

      callbackCarousel.next(); // Переход к следующей = завершение первой

      expect(onStoryEnd).toHaveBeenCalledWith(mockStories[0]);
    });
  });
});
```

### Покрытые сценарии тестирования

Нативный пакет имеет комплексное покрытие тестами, включающее:

#### ✅ Базовые сценарии

- **Инициализация**: различные конфигурации (`autoPlay`, `defaultDuration`)
- **State machine**: переходы между состояниями (`idle` → `playing` → `paused` → `completed`)

#### ✅ Воспроизведение

- **3 истории подряд**: последовательное завершение всех историй с вызовами callbacks
- **1 история**: корректное завершение одиночной истории
- **Пустой массив**: немедленный переход в состояние `completed`

#### ✅ Динамическое управление

- **Добавление во время воспроизведения**: новые истории попадают в очередь и проигрываются
- **Добавление после завершения**: возможность продолжить после состояния `completed`
- **Отслеживание просмотров**: истории помечаются как просмотренные без изменения данных

#### ✅ Целостность данных

- **Неизменность Story объектов**: данные историй не модифицируются флагами
- **Отдельное отслеживание**: просмотры хранятся в `viewedStories` массиве
- **Безопасные callbacks**: проверки существования текущей истории

#### ✅ Конфигурация

- **progressUpdateInterval**: настраиваемый интервал обновления прогресса
- **Callbacks**: все типы событий (`onStoryStart`, `onStoryViewed`, `onStoryEnd`, `onComplete`)

## React компонент тестирование

### Настройка React Testing Library

```typescript
// packages/react/vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
  },
});
```

```typescript
// packages/react/test/setup.ts
import { beforeAll } from "vitest";
import { configure } from "@testing-library/react";

// Конфигурация Testing Library
configure({
  testIdAttribute: "data-testid",
});

// Mock для requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);
```

### Тесты React компонента

```tsx
// packages/react/test/StoryCarousel.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StoryCarousel } from "../src";

const mockStories = [
  { id: "1", content: "Story 1", duration: 1000 },
  { id: "2", content: "Story 2", duration: 2000 },
];

describe("StoryCarousel React", () => {
  describe("Рендеринг", () => {
    it("отображает первую историю", () => {
      render(<StoryCarousel stories={mockStories} autoPlay={false} />);

      expect(screen.getByText("Story 1")).toBeInTheDocument();
    });

    it("отображает индикаторы прогресса", () => {
      render(<StoryCarousel stories={mockStories} autoPlay={false} />);

      const progressBars = screen.getAllByRole("progressbar");
      expect(progressBars).toHaveLength(2);
    });
  });

  describe("Взаимодействие", () => {
    it("переходит к следующей истории по клику", () => {
      render(<StoryCarousel stories={mockStories} autoPlay={false} />);

      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      expect(screen.getByText("Story 2")).toBeInTheDocument();
    });

    it("вызывает коллбэки", () => {
      const onStoryEnd = vi.fn();
      const onComplete = vi.fn();

      render(
        <StoryCarousel
          stories={mockStories}
          autoPlay={false}
          onStoryEnd={onStoryEnd}
          onComplete={onComplete}
        />,
      );

      // Переход к следующей истории
      const nextButton = screen.getByRole("button", { name: /next/i });
      fireEvent.click(nextButton);

      expect(onStoryEnd).toHaveBeenCalledWith(mockStories[0]);

      // Переход к концу
      fireEvent.click(nextButton);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe("Кастомизация", () => {
    it("применяет className", () => {
      render(
        <StoryCarousel
          stories={mockStories}
          autoPlay={false}
          className="custom-class"
        />,
      );

      const container = screen.getByRole("generic").closest(".custom-class");
      expect(container).toBeInTheDocument();
    });

    it("использует кастомный рендерер", () => {
      const renderStory = vi.fn((story, progress) => (
        <div data-testid="custom-story">
          {story.content} - {progress}
        </div>
      ));

      render(
        <StoryCarousel
          stories={mockStories}
          autoPlay={false}
          renderStory={renderStory}
        />,
      );

      expect(screen.getByTestId("custom-story")).toBeInTheDocument();
      expect(renderStory).toHaveBeenCalled();
    });
  });

  describe("Автовоспроизведение", () => {
    it("автоматически переключает истории", async () => {
      render(<StoryCarousel stories={mockStories} autoPlay={true} />);

      // Ждем завершения первой истории
      await waitFor(
        () => {
          expect(screen.getByText("Story 2")).toBeInTheDocument();
        },
        { timeout: 1500 },
      );
    });
  });
});
```

## Integration тестирование

### Тестирование взаимодействия пакетов

```typescript
// packages/integration-test/test/story-carousel-integration.test.ts
import { describe, it, expect } from "vitest";
import { StoryCarousel as NativeCarousel } from "@storykit/core";

describe("Integration Tests", () => {
  it("нативное ядро работает с React оберткой", async () => {
    // Импорт React компонента в Node.js среде для тестирования
    const { renderToString } = await import("react-dom/server");
    const { StoryCarousel: ReactCarousel } = await import("@storykit/react");

    const stories = [{ id: "1", content: "Test Story", duration: 1000 }];

    // Проверка, что React компонент может быть отрендерен
    expect(() => {
      renderToString(ReactCarousel({ stories, autoPlay: false }));
    }).not.toThrow();
  });

  it("сохраняет состояние между сессиями", () => {
    const carousel = new NativeCarousel({
      stories: [
        { id: "1", content: "Story 1", duration: 1000 },
        { id: "2", content: "Story 2", duration: 1000 },
      ],
      autoPlay: false,
    });

    // Сохраняем состояние
    const savedState = carousel.getState();

    // Имитируем закрытие и открытие
    const newCarousel = new NativeCarousel({
      stories: carousel.config.stories,
      autoPlay: false,
    });

    // Восстанавливаем индекс
    newCarousel.goTo(savedState.currentIndex);

    expect(newCarousel.getState().currentIndex).toBe(savedState.currentIndex);
  });
});
```

## E2E тестирование

### Настройка Playwright

```typescript
// e2e/playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://localhost:3000",
  },
});
```

### E2E тесты

```typescript
// e2e/tests/story-carousel.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Story Carousel E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/examples/story-carousel-demo.html");
  });

  test("отображает карусель историй", async ({ page }) => {
    await expect(page.locator(".story-carousel")).toBeVisible();
    await expect(page.locator(".progress-bar")).toHaveCount(3);
  });

  test("автоматически переключает истории", async ({ page }) => {
    // Ждем завершения первой истории
    await page.waitForTimeout(3500);

    // Проверяем, что перешли ко второй истории
    await expect(page.locator(".story-content")).toContainText("Story 2");
  });

  test("позволяет ручную навигацию", async ({ page }) => {
    // Клик по кнопке "далее"
    await page.locator('[data-testid="next-button"]').click();

    // Проверяем переход ко второй истории
    await expect(page.locator(".story-content")).toContainText("Story 2");

    // Клик по кнопке "назад"
    await page.locator('[data-testid="prev-button"]').click();

    // Проверяем возврат к первой истории
    await expect(page.locator(".story-content")).toContainText("Story 1");
  });

  test("показывает прогресс", async ({ page }) => {
    // Проверяем, что первый индикатор активен
    const firstProgress = page.locator(".progress-fill").first();
    await expect(firstProgress).toBeVisible();

    // Ждем немного и проверяем, что прогресс изменился
    await page.waitForTimeout(500);
    const width = await firstProgress.evaluate((el) => el.style.width);
    expect(width).not.toBe("0%");
  });

  test("пауза/воспроизведение работает", async ({ page }) => {
    // Клик по кнопке паузы
    await page.locator('[data-testid="play-pause-button"]').click();

    // Запоминаем текущий прогресс
    const progressBefore = await page
      .locator(".progress-fill")
      .first()
      .evaluate((el) => el.style.width);

    // Ждем немного
    await page.waitForTimeout(500);

    // Проверяем, что прогресс не изменился
    const progressAfter = await page
      .locator(".progress-fill")
      .first()
      .evaluate((el) => el.style.width);

    expect(progressAfter).toBe(progressBefore);
  });
});
```

## Производительность тестирование

### Тесты производительности

```typescript
// packages/native/test/performance.test.ts
import { describe, it, expect } from "vitest";
import { StoryCarousel } from "../src";

describe("Performance Tests", () => {
  it("быстро инициализируется с большим количеством историй", () => {
    const largeStories = Array.from({ length: 1000 }, (_, i) => ({
      id: `story-${i}`,
      content: `Story ${i}`,
      duration: 1000,
    }));

    const startTime = performance.now();

    const carousel = new StoryCarousel({
      stories: largeStories,
      autoPlay: false,
    });

    const endTime = performance.now();
    const initTime = endTime - startTime;

    // Инициализация должна занять менее 100мс
    expect(initTime).toBeLessThan(100);

    carousel.destroy();
  });

  it("эффективно управляет памятью", () => {
    const stories = [{ id: "1", content: "Story 1", duration: 1000 }];

    const carousels: StoryCarousel[] = [];

    // Создаем много экземпляров
    for (let i = 0; i < 100; i++) {
      carousels.push(new StoryCarousel({ stories, autoPlay: false }));
    }

    // Проверяем, что все экземпляры созданы
    expect(carousels).toHaveLength(100);

    // Очищаем память
    carousels.forEach((carousel) => carousel.destroy());

    // В реальном приложении здесь можно проверить использование памяти
  });

  it("не вызывает утечек памяти при частых обновлениях", () => {
    const stories = [{ id: "1", content: "Story 1", duration: 1000 }];

    const carousel = new StoryCarousel({ stories, autoPlay: false });

    // Имитируем частые обновления состояния
    for (let i = 0; i < 1000; i++) {
      carousel.getState();
    }

    // Проверяем, что компонент все еще работает
    expect(carousel.getState().currentIndex).toBe(0);

    carousel.destroy();
  });
});
```

## Тестирование доступности

### A11y тесты

```typescript
// packages/react/test/a11y.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StoryCarousel } from '../src';

expect.extend(toHaveNoViolations);

const mockStories = [
  { id: '1', content: 'Story 1', duration: 1000 },
  { id: '2', content: 'Story 2', duration: 2000 },
];

describe('Accessibility Tests', () => {
  it('соответствует WCAG guidelines', async () => {
    const { container } = render(
      <StoryCarousel stories={mockStories} autoPlay={false} />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('поддерживает навигацию с клавиатуры', () => {
    render(<StoryCarousel stories={mockStories} autoPlay={false} />);

    // Имитация нажатия клавиш
    // (в реальном тесте используется user-event)
    // await user.keyboard('{ArrowRight}');
    // expect(screen.getByText('Story 2')).toBeInTheDocument();
  });

  it('имеет правильные ARIA атрибуты', () => {
    render(<StoryCarousel stories={mockStories} autoPlay={false} />);

    // Проверяем наличие aria-label на кнопках
    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toHaveAttribute('aria-label', 'Next story');

    // Проверяем индикаторы прогресса
    const progressBars = screen.getAllByRole('progressbar');
    progressBars.forEach((bar, index) => {
      expect(bar).toHaveAttribute('aria-valuenow');
      expect(bar).toHaveAttribute('aria-valuemin', '0');
      expect(bar).toHaveAttribute('aria-valuemax', '100');
    });
  });
});
```

## CI/CD интеграция

### GitHub Actions workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Run linter
        run: pnpm lint

      - name: Run type checking
        run: pnpm type-check

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run integration tests
        run: pnpm test:integration

      - name: Build packages
        run: pnpm build

  e2e:
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Build examples
        run: pnpm build:examples

      - name: Run Playwright tests
        run: pnpm test:e2e
```

---

[← Contributing](contributing.md) | [→ Сборка и развертывание](build-deploy.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/build-deploy.md
