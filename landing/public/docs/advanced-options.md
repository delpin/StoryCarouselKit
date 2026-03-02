# Продвинутые опции

Расширенные возможности и конфигурации Story Carousel.

## Кастомные контроллеры

### Внешнее управление воспроизведением

```tsx
import { useRef } from 'react';

function StoryPlayerWithControls() {
  const carouselRef = useRef<any>();

  const play = () => carouselRef.current?.play();
  const pause = () => carouselRef.current?.pause();
  const next = () => carouselRef.current?.next();
  const prev = () => carouselRef.current?.prev();
  const goTo = (index: number) => carouselRef.current?.goTo(index);

  return (
    <div>
      {/* Карусель */}
      <StoryCarousel
        ref={carouselRef}
        stories={stories}
        autoPlay={false} // Отключаем автозапуск
      />

      {/* Кастомные контроллы */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginTop: '20px',
        }}
      >
        <button onClick={prev}>Предыдущая</button>
        <button onClick={play}>▶ Воспроизвести</button>
        <button onClick={pause}>⏸ Пауза</button>
        <button onClick={next}>Следующая</button>
      </div>

      {/* Навигация по историям */}
      <div
        style={{
          display: 'flex',
          gap: '5px',
          justifyContent: 'center',
          marginTop: '10px',
        }}
      >
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Синхронизация нескольких каруселей

```tsx
function SyncedStoryCarousels() {
  const [masterIndex, setMasterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStoryChange = (index: number) => {
    setMasterIndex(index);
  };

  const handlePlayStateChange = (playing: boolean) => {
    setIsPlaying(playing);
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Основная карусель */}
      <StoryCarousel
        stories={stories}
        onStoryStart={story => {
          const index = stories.findIndex(s => s.id === story.id);
          handleStoryChange(index);
        }}
        onComplete={() => setIsPlaying(false)}
      />

      {/* Синхронизированные мини-карусели */}
      {thumbnails.map((thumbnail, index) => (
        <div
          key={index}
          onClick={() => handleStoryChange(index)}
          style={{
            width: '100px',
            height: '150px',
            border: index === masterIndex ? '3px solid #007bff' : '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            opacity: index === masterIndex ? 1 : 0.6,
          }}
        >
          <img
            src={thumbnail}
            alt={`Story ${index + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  );
}
```

## Расширенная обработка событий

### Аналитика и метрики

```tsx
function AnalyticsStoryCarousel() {
  const [metrics, setMetrics] = useState({
    views: 0,
    completions: 0,
    avgTimeSpent: 0,
    dropOffPoints: [],
  });

  const trackEvent = (eventName: string, data: any) => {
    console.log(`Analytics: ${eventName}`, data);
    // Отправка в аналитику (Google Analytics, Mixpanel, etc.)
  };

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        trackEvent('story_view_start', {
          storyId: story.id,
          timestamp: Date.now(),
        });

        setMetrics(prev => ({
          ...prev,
          views: prev.views + 1,
        }));
      }}
      onStoryEnd={story => {
        trackEvent('story_view_complete', {
          storyId: story.id,
          timeSpent: story.duration,
          completionRate: 1,
        });
      }}
      onComplete={() => {
        trackEvent('stories_complete', {
          totalStories: stories.length,
          totalTimeSpent: stories.reduce((sum, s) => sum + s.duration, 0),
        });

        setMetrics(prev => ({
          ...prev,
          completions: prev.completions + 1,
        }));
      }}
    />
  );
}
```

### Обработка ошибок и fallback

```tsx
function ResilientStoryCarousel() {
  const [error, setError] = useState<string | null>(null);
  const [fallbackStories, setFallbackStories] = useState([]);

  const loadStories = async () => {
    try {
      const response = await fetch('/api/stories');
      if (!response.ok) throw new Error('Failed to load stories');

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error loading stories:', err);
      setError('Не удалось загрузить истории');
      // Возвращаем fallback контент
      return [{ id: 'error', content: 'Контент временно недоступен', duration: 3000 }];
    }
  };

  useEffect(() => {
    loadStories().then(setFallbackStories);
  }, []);

  if (error && fallbackStories.length === 0) {
    return <div>Загрузка...</div>;
  }

  return (
    <StoryCarousel
      stories={fallbackStories}
      onStoryStart={story => {
        if (story.id === 'error') {
          // Специальная обработка для fallback контента
          console.log('Showing fallback content');
        }
      }}
      renderStory={story => {
        if (story.id === 'error') {
          return (
            <div
              style={{
                background: '#f8f9fa',
                color: '#6c757d',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
              <h3>Контент временно недоступен</h3>
              <p>Попробуйте обновить страницу позже</p>
            </div>
          );
        }

        return (
          <div
            style={{
              background: '#000',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {story.content}
          </div>
        );
      }}
    />
  );
}
```

## Кастомные рендереры

### Условный рендеринг на основе типа контента

```tsx
type StoryType = 'text' | 'image' | 'video' | 'interactive';

interface TypedStory extends Story {
  type: StoryType;
  mediaUrl?: string;
  question?: string;
  options?: string[];
}

function AdvancedStoryRenderer() {
  const stories: TypedStory[] = [
    {
      id: '1',
      content: 'Простой текст',
      type: 'text',
      duration: 3000,
    },
    {
      id: '2',
      content: 'Изображение',
      type: 'image',
      mediaUrl: '/image.jpg',
      duration: 4000,
    },
    {
      id: '3',
      content: 'Видео',
      type: 'video',
      mediaUrl: '/video.mp4',
      duration: 6000,
    },
    {
      id: '4',
      content: 'Опрос',
      type: 'interactive',
      question: 'Ваш любимый цвет?',
      options: ['Красный', 'Синий', 'Зеленый'],
      duration: 8000,
    },
  ];

  const renderStory = (story: TypedStory, progress: number) => {
    switch (story.type) {
      case 'text':
        return (
          <div
            style={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '40px',
            }}
          >
            {story.content}
          </div>
        );

      case 'image':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
              }}
            >
              {story.content}
            </div>
          </div>
        );

      case 'video':
        return (
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
        );

      case 'interactive':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <h2 style={{ marginBottom: '30px' }}>{story.question}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              {story.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => console.log('Selected:', option)}
                  style={{
                    padding: '15px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '25px',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return <div>Неизвестный тип контента</div>;
    }
  };

  return <StoryCarousel stories={stories} renderStory={renderStory} />;
}
```

### Ленивая загрузка медиа

```tsx
function LazyLoadingStoryCarousel() {
  const [loadedMedia, setLoadedMedia] = useState<Set<string>>(new Set());

  const handleMediaLoad = (storyId: string) => {
    setLoadedMedia(prev => new Set([...prev, storyId]));
  };

  const renderStory = (story: Story, progress: number) => {
    const isLoaded = loadedMedia.has(story.id);

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Заглушка во время загрузки */}
        {!isLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666',
            }}
          >
            <div>Загрузка...</div>
          </div>
        )}

        {/* Медиа контент */}
        {story.mediaUrl && (
          <img
            src={story.mediaUrl}
            alt={story.content}
            onLoad={() => handleMediaLoad(story.id)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Текст поверх медиа */}
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease 0.1s',
          }}
        >
          {story.content}
        </div>
      </div>
    );
  };

  return <StoryCarousel stories={stories} renderStory={renderStory} />;
}
```

## Интеграция с внешними сервисами

### API интеграция

```tsx
function APIDrivenStoryCarousel() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryEnd = async (story: Story) => {
    // Отправка статистики на сервер
    try {
      await fetch('/api/story-viewed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: story.id,
          viewedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error tracking story view:', error);
    }
  };

  if (loading) {
    return <div>Загрузка историй...</div>;
  }

  return (
    <StoryCarousel
      stories={stories}
      onStoryEnd={handleStoryEnd}
      onComplete={() => {
        console.log('Все истории просмотрены!');
        // Возможно, показать следующий набор историй
        fetchStories();
      }}
    />
  );
}
```

### WebSocket синхронизация

```tsx
function RealtimeStoryCarousel() {
  const [stories, setStories] = useState<Story[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Подключение к WebSocket
    const websocket = new WebSocket('ws://localhost:8080/stories');

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_story') {
        setStories(prev => [...prev, data.story]);
      } else if (data.type === 'update_story') {
        setStories(prev => prev.map(story => (story.id === data.story.id ? data.story : story)));
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleStoryEnd = (story: Story) => {
    // Отправка подтверждения просмотра
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'story_viewed',
          storyId: story.id,
        })
      );
    }
  };

  return <StoryCarousel stories={stories} onStoryEnd={handleStoryEnd} />;
}
```

## Производительность и оптимизации

### Виртуализация для больших списков

```tsx
function VirtualizedStoryCarousel({ allStories }: { allStories: Story[] }) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });

  const visibleStories = allStories.slice(visibleRange.start, visibleRange.end);

  const handleComplete = () => {
    // Загрузка следующих историй
    setVisibleRange(prev => ({
      start: prev.end,
      end: Math.min(prev.end + 5, allStories.length),
    }));
  };

  return <StoryCarousel stories={visibleStories} onComplete={handleComplete} />;
}
```

### Предзагрузка медиа

```tsx
function PreloadingStoryCarousel() {
  const [preloadedMedia, setPreloadedMedia] = useState<Set<string>>(new Set());

  const preloadMedia = (story: Story) => {
    if (story.mediaUrl && !preloadedMedia.has(story.id)) {
      const img = new Image();
      img.onload = () => {
        setPreloadedMedia(prev => new Set([...prev, story.id]));
      };
      img.src = story.mediaUrl;
    }
  };

  useEffect(() => {
    // Предзагрузка следующих 2-3 историй
    stories.slice(0, 3).forEach(preloadMedia);
  }, [stories]);

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        // Предзагрузка следующих историй
        const currentIndex = stories.findIndex(s => s.id === story.id);
        const nextStories = stories.slice(currentIndex + 1, currentIndex + 3);
        nextStories.forEach(preloadMedia);
      }}
    />
  );
}
```

---

[← Темы и стилизация](theming.md) | [→ API Reference](types.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/types.md
