# Примеры использования

В этом разделе собраны практические примеры использования Story Carousel в различных сценариях.

## Базовые примеры

### Простая карусель историй

```tsx
import { StoryCarousel } from '@storykit/react';

const stories = [
  { id: '1', content: 'Добро пожаловать!', duration: 3000 },
  { id: '2', content: 'Наша новая функция', duration: 4000 },
  { id: '3', content: 'Попробуйте прямо сейчас', duration: 5000 },
];

export default function WelcomeStories() {
  return (
    <div style={{ width: '400px', height: '600px' }}>
      <StoryCarousel stories={stories} />
    </div>
  );
}
```

### С изображениями

```tsx
const photoStories = [
  {
    id: 'photo1',
    content: 'Наш офис',
    mediaUrl: '/office.jpg',
    duration: 4000,
  },
  {
    id: 'photo2',
    content: 'Команда',
    mediaUrl: '/team.jpg',
    duration: 3500,
  },
  {
    id: 'photo3',
    content: 'Продукт',
    mediaUrl: '/product.jpg',
    duration: 4500,
  },
];

function PhotoStories() {
  return (
    <StoryCarousel
      stories={photoStories}
      renderStory={story => (
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
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            }}
          >
            {story.content}
          </div>
        </div>
      )}
    />
  );
}
```

## Продвинутые примеры

### Онбординг нового пользователя

```tsx
import { useState } from 'react';

const onboardingStories = [
  {
    id: 'welcome',
    content: 'Добро пожаловать в наше приложение!',
    duration: 4000,
  },
  {
    id: 'feature1',
    content: 'Создавайте задачи одним кликом',
    duration: 5000,
  },
  {
    id: 'feature2',
    content: 'Отслеживайте прогресс в реальном времени',
    duration: 4500,
  },
  {
    id: 'get-started',
    content: 'Начнем работу!',
    duration: 3000,
  },
];

function OnboardingFlow() {
  const [isCompleted, setIsCompleted] = useState(false);

  if (isCompleted) {
    return <MainApp />;
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div style={{ width: '400px', height: '600px' }}>
        <StoryCarousel
          stories={onboardingStories}
          onComplete={() => {
            setIsCompleted(true);
            localStorage.setItem('onboarding_completed', 'true');
          }}
          renderStory={story => (
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              <h2 style={{ marginBottom: '20px' }}>{story.content}</h2>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                🎯
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
}
```

### Социальная сеть с историями

```tsx
import { useState, useEffect } from 'react';

interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  mediaUrl?: string;
  duration: number;
  createdAt: Date;
}

function SocialStories({ userId }: { userId: string }) {
  const [stories, setStories] = useState<UserStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStories(userId);
  }, [userId]);

  const fetchStories = async (userId: string) => {
    try {
      const response = await fetch(`/api/stories/${userId}`);
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка историй...</div>;
  }

  if (stories.length === 0) {
    return <div>Нет новых историй</div>;
  }

  return (
    <div style={{ width: '400px', height: '600px' }}>
      <StoryCarousel
        stories={stories}
        renderStory={story => (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {story.mediaUrl ? (
              <img
                src={story.mediaUrl}
                alt={story.content}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, #ff6b6b, #ffa500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                }}
              >
                {story.content}
              </div>
            )}

            {/* Информация о пользователе */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={story.userAvatar}
                alt={story.userName}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              />
              <span
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {story.userName}
              </span>
            </div>
          </div>
        )}
        onStoryEnd={story => {
          // Отметить историю как просмотренную
          markAsViewed(story.id);
        }}
      />
    </div>
  );
}
```

### Интерактивные истории с опросами

```tsx
import { useState } from 'react';

interface PollStory extends Story {
  type: 'poll';
  question: string;
  options: string[];
}

function InteractiveStories() {
  const [currentPoll, setCurrentPoll] = useState<string | null>(null);

  const stories: (Story | PollStory)[] = [
    {
      id: '1',
      content: 'Что нового?',
      duration: 3000,
    },
    {
      id: '2',
      type: 'poll',
      content: 'Опрос',
      question: 'Какая ваша любимая функция?',
      options: ['Чаты', 'Задачи', 'Календарь', 'Файлы'],
      duration: 8000,
    },
    {
      id: '3',
      content: 'Спасибо за участие!',
      duration: 3000,
    },
  ];

  return (
    <StoryCarousel
      stories={stories}
      renderStory={(story, progress) => {
        if ('type' in story && story.type === 'poll') {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                padding: '40px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ marginBottom: '30px' }}>{story.question}</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  width: '100%',
                }}
              >
                {story.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPoll(option)}
                    disabled={!!currentPoll}
                    style={{
                      padding: '15px',
                      background: currentPoll === option ? '#4CAF50' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '25px',
                      color: 'white',
                      fontSize: '16px',
                      cursor: currentPoll ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {option}
                    {currentPoll === option && ' ✓'}
                  </button>
                ))}
              </div>
              {currentPoll && (
                <p style={{ marginTop: '20px', fontSize: '14px' }}>Спасибо за ответ!</p>
              )}
            </div>
          );
        }

        return (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
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

### E-commerce: Истории товаров

```tsx
interface ProductStory {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  discount?: number;
  duration: number;
}

function ProductStories({ products }: { products: ProductStory[] }) {
  const [cart, setCart] = useState<string[]>([]);

  return (
    <div style={{ width: '400px', height: '600px' }}>
      <StoryCarousel
        stories={products}
        renderStory={story => (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={story.productImage}
              alt={story.productName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {/* Информация о товаре */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                padding: '40px 20px 20px',
                color: 'white',
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{story.productName}</h3>

              {story.discount && (
                <div
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    display: 'inline-block',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  -{story.discount}% скидка!
                </div>
              )}

              <button
                onClick={() => {
                  setCart(prev => [...prev, story.productId]);
                  alert(`${story.productName} добавлен в корзину!`);
                }}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Добавить в корзину
              </button>
            </div>
          </div>
        )}
        onComplete={() => {
          if (cart.length > 0) {
            console.log('Товары в корзине:', cart);
            // Перенаправить в корзину
          }
        }}
      />
    </div>
  );
}
```

### Образовательный контент

```tsx
interface LessonStory {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  duration: number;
}

function EducationalStories({ lessons }: { lessons: LessonStory[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  return (
    <StoryCarousel
      stories={lessons}
      renderStory={story => (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
          }}
        >
          <h2
            style={{
              color: '#333',
              marginBottom: '20px',
              fontSize: '20px',
            }}
          >
            {story.title}
          </h2>

          {story.type === 'image' && story.mediaUrl && (
            <img
              src={story.mediaUrl}
              alt={story.title}
              style={{
                width: '100%',
                flex: 1,
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '20px',
              }}
            />
          )}

          <p
            style={{
              color: '#666',
              lineHeight: '1.6',
              flex: 1,
              marginBottom: '20px',
            }}
          >
            {story.content}
          </p>

          {story.quiz && (
            <div style={{ marginTop: 'auto' }}>
              <h3 style={{ color: '#333', marginBottom: '15px' }}>{story.quiz.question}</h3>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {story.quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setAnswers(prev => ({ ...prev, [story.id]: index }));
                    }}
                    style={{
                      padding: '12px',
                      background:
                        answers[story.id] === index
                          ? index === story.quiz!.correctAnswer
                            ? '#4CAF50'
                            : '#ff4444'
                          : '#e9ecef',
                      border: 'none',
                      borderRadius: '8px',
                      color: answers[story.id] === index ? 'white' : '#333',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {option}
                    {answers[story.id] === index &&
                      (index === story.quiz!.correctAnswer ? ' ✓' : ' ✗')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      onComplete={() => {
        const score = Object.entries(answers).reduce((acc, [storyId, answer]) => {
          const lesson = lessons.find(l => l.id === storyId);
          return acc + (lesson?.quiz?.correctAnswer === answer ? 1 : 0);
        }, 0);

        alert(`Тест завершен! Правильных ответов: ${score}/${lessons.length}`);
      }}
    />
  );
}
```

## Интеграция с внешними сервисами

### Google Analytics

```tsx
function AnalyticsStories({ stories }) {
  const trackEvent = (eventName, params = {}) => {
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }
  };

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        trackEvent('story_view', {
          story_id: story.id,
          story_content: story.content,
        });
      }}
      onStoryEnd={story => {
        trackEvent('story_complete', {
          story_id: story.id,
          time_spent: story.duration,
        });
      }}
      onComplete={() => {
        trackEvent('stories_complete', {
          total_stories: stories.length,
        });
      }}
    />
  );
}
```

### Amplitude

```tsx
function AmplitudeStories({ stories, userId }) {
  const logEvent = (eventName, properties = {}) => {
    if (window.amplitude) {
      window.amplitude.getInstance().logEvent(eventName, {
        user_id: userId,
        ...properties,
      });
    }
  };

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        logEvent('Story Started', {
          story_id: story.id,
          story_type: story.mediaUrl ? 'media' : 'text',
        });
      }}
      onComplete={() => {
        logEvent('Stories Completed', {
          stories_count: stories.length,
          completion_rate: 1,
        });
      }}
    />
  );
}
```

---

[← Быстрый старт](getting-started.md) | [→ Архитектура](architecture.md)</contents>
</xai:function_call name</xai:function_call name
