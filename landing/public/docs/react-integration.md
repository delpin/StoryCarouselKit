# React интеграция

React обертка `@storycarouselkit/react` предоставляет готовый компонент с полным UI и интеграцией с React экосистемой.

## Установка

```bash
pnpm add @storycarouselkit/react
# или
npm install @storycarouselkit/react
# или
yarn add @storycarouselkit/react
```

## Основные пропсы

### Обязательные пропсы

```typescript
interface StoryCarouselProps {
  stories: Story[]; // Массив историй для отображения
}
```

### Опциональные пропсы

```typescript
interface StoryCarouselProps {
  // Управление воспроизведением
  autoPlay?: boolean; // Автозапуск (по умолчанию: true)
  defaultDuration?: number; // Длительность по умолчанию в мс (по умолчанию: 5000)

  // Кастомизация внешнего вида
  className?: string; // CSS класс для контейнера
  style?: React.CSSProperties; // Inline стили

  // Кастомный рендеринг
  renderStory?: (story: Story, progress: number) => React.ReactNode;

  // События
  onStoryEnd?: (story: Story) => void;
  onStoryStart?: (story: Story) => void;
  onComplete?: () => void;
}
```

## Базовое использование

```tsx
import React from 'react';
import { StoryCarousel } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: 'Добро пожаловать!', duration: 3000 },
  { id: '2', content: 'Это вторая история', duration: 4000 },
  { id: '3', content: 'И третья история', duration: 5000 },
];

function App() {
  return (
    <div style={{ width: '400px', height: '600px' }}>
      <StoryCarousel stories={stories} autoPlay={true} />
    </div>
  );
}
```

## Кастомизация контента

### Простой рендеринг

```tsx
<StoryCarousel
  stories={stories}
  renderStory={(story, progress) => (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '24px',
      }}
    >
      {story.content}
    </div>
  )}
/>
```

### С изображениями

```tsx
const storiesWithImages = [
  { id: '1', content: 'Котик', mediaUrl: '/cat.jpg', duration: 4000 },
  { id: '2', content: 'Собачка', mediaUrl: '/dog.jpg', duration: 3500 },
];

<StoryCarousel
  stories={storiesWithImages}
  renderStory={(story, progress) => (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <img
        src={story.mediaUrl}
        alt={story.content}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {story.content}
      </div>
    </div>
  )}
/>;
```

### С видео

```tsx
<StoryCarousel
  stories={storiesWithVideos}
  renderStory={(story, progress) => (
    <video
      src={story.mediaUrl}
      autoPlay
      muted
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  )}
/>
```

## Стилизация

### CSS классы

```tsx
<StoryCarousel stories={stories} className='my-story-carousel' />
```

```css
.my-story-carousel {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.my-story-carousel button {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 2px solid #fff;
}

.my-story-carousel button:hover {
  background: #fff;
}
```

### Inline стили

```tsx
<StoryCarousel
  stories={stories}
  style={{
    width: '100%',
    maxWidth: '400px',
    height: '600px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  }}
/>
```

## События и коллбэки

### Базовые события

```tsx
<StoryCarousel
  stories={stories}
  onStoryStart={story => {
    console.log('Начало истории:', story.id);
    // Аналитика: пользователь начал смотреть историю
    analytics.track('story_view_start', { storyId: story.id });
  }}
  onStoryEnd={story => {
    console.log('Конец истории:', story.id);
    // Аналитика: пользователь досмотрел историю до конца
    analytics.track('story_view_complete', { storyId: story.id });
  }}
  onComplete={() => {
    console.log('Все истории просмотрены');
    // Показать CTA или перенаправить
    showNextAction();
  }}
/>
```

### Интеграция с состоянием

```tsx
import { useState } from 'react';

function StoryViewer() {
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [completedStories, setCompletedStories] = useState([]);

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        setCurrentStoryId(story.id);
      }}
      onStoryEnd={story => {
        setCompletedStories(prev => [...prev, story.id]);
      }}
      onComplete={() => {
        console.log('Завершено историй:', completedStories.length);
      }}
    />
  );
}
```

## Продвинутые паттерны

### Контролируемый компонент

```tsx
import { useRef } from 'react';

function ControlledStoryCarousel({ stories, currentIndex, onIndexChange }) {
  const carouselRef = useRef();

  // Синхронизация внешнего состояния
  useEffect(() => {
    if (carouselRef.current && currentIndex !== undefined) {
      carouselRef.current.goTo(currentIndex);
    }
  }, [currentIndex]);

  return (
    <StoryCarousel
      ref={carouselRef}
      stories={stories}
      autoPlay={false}
      onStoryStart={story => {
        const index = stories.findIndex(s => s.id === story.id);
        onIndexChange?.(index);
      }}
    />
  );
}
```

### Lazy loading изображений

```tsx
import { useState } from 'react';

function LazyStoryCarousel({ stories }) {
  const [loadedImages, setLoadedImages] = useState(new Set());

  const handleImageLoad = storyId => {
    setLoadedImages(prev => new Set([...prev, storyId]));
  };

  return (
    <StoryCarousel
      stories={stories}
      renderStory={(story, progress) => {
        const isLoaded = loadedImages.has(story.id);

        return (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!isLoaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Загрузка...
              </div>
            )}
            <img
              src={story.mediaUrl}
              alt={story.content}
              onLoad={() => handleImageLoad(story.id)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          </div>
        );
      }}
    />
  );
}
```

### Интеграция с React Router

```tsx
import { useNavigate } from 'react-router-dom';

function StoryNavigation() {
  const navigate = useNavigate();

  return (
    <StoryCarousel
      stories={stories}
      onComplete={() => {
        // Перенаправление после просмотра всех историй
        navigate('/next-page');
      }}
      renderStory={(story, progress) => (
        <div
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={() => navigate(`/story/${story.id}`)}
        >
          {/* Контент истории */}
        </div>
      )}
    />
  );
}
```

## Hooks и утилиты

### useStoryProgress (кастомный hook)

```tsx
import { useState, useEffect } from 'react';

function useStoryProgress(stories) {
  const [progress, setProgress] = useState({});
  const [currentStory, setCurrentStory] = useState(null);

  const updateProgress = (storyId, storyProgress) => {
    setProgress(prev => ({
      ...prev,
      [storyId]: storyProgress,
    }));
  };

  const getTotalProgress = () => {
    const totalStories = stories.length;
    const completedStories = Object.values(progress).filter(p => p >= 1).length;
    return completedStories / totalStories;
  };

  return {
    progress,
    currentStory,
    updateProgress,
    totalProgress: getTotalProgress(),
  };
}
```

### Story context

```tsx
import { createContext, useContext } from 'react';

const StoryContext = createContext();

function StoryProvider({ children }) {
  const [storyState, setStoryState] = useState({
    currentIndex: 0,
    isPlaying: false,
  });

  return (
    <StoryContext.Provider value={{ storyState, setStoryState }}>{children}</StoryContext.Provider>
  );
}

function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error('useStory must be used within StoryProvider');
  }
  return context;
}
```

## Производительность

### Memoization

```tsx
import { memo, useMemo } from 'react';

const MemoizedStoryCarousel = memo(StoryCarousel);

function App() {
  const stories = useMemo(
    () => [
      { id: '1', content: 'История 1' },
      { id: '2', content: 'История 2' },
    ],
    []
  );

  const handleStoryEnd = useCallback(story => {
    console.log('Story ended:', story);
  }, []);

  return <MemoizedStoryCarousel stories={stories} onStoryEnd={handleStoryEnd} />;
}
```

### Virtual scrolling (для большого количества историй)

```tsx
// Для большого количества историй можно реализовать виртуализацию
function VirtualizedStoryCarousel({ allStories, visibleCount = 10 }) {
  const [visibleStories, setVisibleStories] = useState(allStories.slice(0, visibleCount));

  // Логика подгрузки следующих историй
  const loadMore = () => {
    const nextStories = allStories.slice(
      visibleStories.length,
      visibleStories.length + visibleCount
    );
    setVisibleStories(prev => [...prev, ...nextStories]);
  };

  return <StoryCarousel stories={visibleStories} onComplete={loadMore} />;
}
```

## Тестирование

### Unit тесты

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StoryCarousel } from '@storycarouselkit/react';

const mockStories = [
  { id: '1', content: 'Test story 1' },
  { id: '2', content: 'Test story 2' },
];

describe('StoryCarousel', () => {
  it('renders first story', () => {
    render(<StoryCarousel stories={mockStories} autoPlay={false} />);
    expect(screen.getByText('Test story 1')).toBeInTheDocument();
  });

  it('navigates to next story', () => {
    render(<StoryCarousel stories={mockStories} autoPlay={false} />);
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText('Test story 2')).toBeInTheDocument();
  });
});
```

### Integration тесты

```tsx
import { render, waitFor } from '@testing-library/react';

it('auto-plays stories', async () => {
  const onComplete = jest.fn();
  render(<StoryCarousel stories={mockStories} autoPlay={true} onComplete={onComplete} />);

  // Ждем завершения всех историй
  await waitFor(
    () => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    },
    { timeout: 10000 }
  );
});
```

## Troubleshooting

### Проблема: Компонент не перерендеривается

```tsx
// Неправильно: мутация массива
const stories = [{ id: '1', content: 'Story' }];
stories[0].content = 'Updated'; // Не вызовет перерендер

// Правильно: новый массив
const [stories, setStories] = useState([{ id: '1', content: 'Story' }]);
setStories([{ id: '1', content: 'Updated' }]);
```

### Проблема: Таймеры не очищаются

```tsx
// Правильно: использование useEffect cleanup
useEffect(() => {
  return () => {
    // Очистка ресурсов
  };
}, []);
```

### Проблема: Конфликт стилей

```tsx
// Используйте CSS modules или scoped стили
import styles from './StoryCarousel.module.css';

<StoryCarousel className={styles.container} />;
```

---

[← Нативное API](native-api.md) | [→ Vue интеграция](vue-integration.md)</contents>
</xai:function_call name</xai:function_call name
