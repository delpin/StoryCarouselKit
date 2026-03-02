# Темы и стилизация

Story Carousel предоставляет гибкие возможности для кастомизации внешнего вида.

## React: CSS-in-JS и CSS Modules

### CSS-in-JS подход

```tsx
const customTheme = {
  container: {
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: '3px',
  },
  progressFill: {
    backgroundColor: '#ff6b6b',
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    width: '44px',
    height: '44px',
  },
  playButton: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    width: '56px',
    height: '56px',
  },
};

function ThemedStoryCarousel() {
  return (
    <StoryCarousel
      stories={stories}
      style={customTheme.container}
      renderStory={(story, progress) => (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: `linear-gradient(135deg,
            ${progress > 0.5 ? '#667eea' : '#764ba2'} 0%,
            ${progress > 0.5 ? '#764ba2' : '#667eea'} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '40px',
            transition: 'all 0.5s ease',
          }}
        >
          {story.content}
        </div>
      )}
    />
  );
}
```

### CSS Modules

```tsx
// StoryCarousel.module.css
.container {
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  overflow: hidden;
  position: relative;
}

.progressContainer {
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  z-index: 10;
  display: flex;
  gap: 6px;
}

.progressBar {
  flex: 1;
  height: 3px;
  background-color: rgba(255,255,255,0.4);
  border-radius: 2px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: linear-gradient(90deg, #ff6b6b, #ffa500);
  border-radius: 2px;
  transition: width 0.1s ease;
}

.navButton {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navButton:hover {
  background: rgba(0,0,0,0.9);
  transform: translateY(-50%) scale(1.1);
}

.navButton:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: translateY(-50%);
}

.navButton.prev { left: 15px; }
.navButton.next { right: 15px; }

.playButton {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(255,107,107,0.4);
}

.playButton:hover {
  transform: translateX(-50%) scale(1.1);
  box-shadow: 0 6px 25px rgba(255,107,107,0.6);
}

.storyContent {
  width: 100%;
  height: 100%;
  position: relative;
}

.storyText {
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  z-index: 5;
}
```

```tsx
// ThemedStoryCarousel.tsx
import styles from './StoryCarousel.module.css';

function ThemedStoryCarousel() {
  return (
    <StoryCarousel
      stories={stories}
      className={styles.container}
      renderStory={story => (
        <div className={styles.storyContent}>
          <img
            src={story.mediaUrl}
            alt={story.content}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div className={styles.storyText}>{story.content}</div>
        </div>
      )}
    />
  );
}
```

## Темы для разных брендов

### Instagram-style тема

```tsx
const instagramTheme = {
  container: {
    borderRadius: '0',
    background: '#000',
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    height: '2px',
    borderRadius: '1px',
  },
  progressFill: {
    backgroundColor: '#fff',
  },
  navButton: {
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.8)',
    border: 'none',
    width: '60px',
    height: '60px',
    fontSize: '24px',
  },
  playButton: {
    display: 'none', // Instagram не показывает кнопку play/pause
  },
};
```

### Snapchat-style тема

```tsx
const snapchatTheme = {
  container: {
    borderRadius: '12px',
    background: '#000',
  },
  progressBar: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    height: '3px',
    borderRadius: '2px',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #fffc00, #ff6b6b)',
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    color: 'white',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '50%',
    backdropFilter: 'blur(10px)',
  },
};
```

### Темная тема

```tsx
const darkTheme = {
  container: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
  },
  progressBar: {
    backgroundColor: '#333',
  },
  progressFill: {
    backgroundColor: '#007bff',
  },
  navButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: '1px solid #555',
  },
  playButton: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
};
```

## Адаптивный дизайн

### Responsive компонент

```tsx
function ResponsiveStoryCarousel({ stories }) {
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        width: isMobile ? window.innerWidth - 40 : 400,
        height: isMobile ? window.innerHeight - 200 : 600,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <StoryCarousel
      stories={stories}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        maxWidth: '100%',
        margin: '0 auto',
      }}
    />
  );
}
```

### Mobile-first стили

```css
/* Mobile-first подход */
.story-carousel {
  width: 100vw;
  height: 100vh;
  max-width: 400px;
  max-height: 600px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .story-carousel {
    width: 400px;
    height: 600px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
}

@media (min-width: 1024px) {
  .story-carousel {
    width: 500px;
    height: 700px;
  }
}

/* Адаптивные кнопки */
.nav-button {
  width: 44px;
  height: 44px;
  font-size: 18px;
}

@media (min-width: 768px) {
  .nav-button {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
```

## Кастомные анимации

### Плавные переходы

```tsx
function AnimatedStoryCarousel() {
  const [currentStory, setCurrentStory] = useState(stories[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <StoryCarousel
      stories={stories}
      onStoryStart={story => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentStory(story);
          setIsTransitioning(false);
        }, 300);
      }}
      renderStory={(story, progress) => (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Фоновая анимация */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(45deg,
              hsl(${progress * 360}, 70%, 50%) 0%,
              hsl(${progress * 360 + 60}, 70%, 50%) 100%)`,
              opacity: isTransitioning ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Контент с анимацией появления */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '28px',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '40px',
              transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
              opacity: isTransitioning ? 0 : 1,
              transition: 'all 0.3s ease',
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

### Темы для специальных случаев

#### Рождественская тема

```tsx
const christmasTheme = {
  container: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #dc2626 100%)',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #fbbf24, #dc2626)',
  },
  navButton: {
    background: 'rgba(255,255,255,0.9)',
    color: '#dc2626',
    border: '2px solid #fff',
  },
};

function ChristmasStoryCarousel() {
  return (
    <StoryCarousel
      stories={christmasStories}
      style={christmasTheme.container}
      renderStory={story => (
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          {/* Снежинки анимация */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {/* CSS анимация снежинок */}
          </div>

          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎄</div>
            <h2>{story.content}</h2>
          </div>
        </div>
      )}
    />
  );
}
```

#### Хэллоуин тема

```tsx
const halloweenTheme = {
  container: {
    background: 'linear-gradient(135deg, #7c2d12 0%, #1c1917 100%)',
    border: '2px solid #f59e0b',
    borderRadius: '16px',
  },
  progressFill: {
    background: 'linear-gradient(90deg, #f59e0b, #dc2626)',
  },
  navButton: {
    background: '#f59e0b',
    color: '#1c1917',
    border: '2px solid #fff',
    boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
  },
};

function HalloweenStoryCarousel() {
  return (
    <StoryCarousel
      stories={halloweenStories}
      style={halloweenTheme.container}
      renderStory={story => (
        <div
          style={{
            background: 'url("/halloween-bg.jpg") center/cover',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            textAlign: 'center',
            padding: '40px',
          }}
        >
          <div>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎃👻</div>
            <h2>{story.content}</h2>
          </div>
        </div>
      )}
    />
  );
}
```

## Создание системы тем

### Theme Provider

```tsx
const themes = {
  light: {
    container: { backgroundColor: '#fff', color: '#333' },
    progressBar: { backgroundColor: '#e9ecef' },
    progressFill: { backgroundColor: '#007bff' },
    navButton: { backgroundColor: '#f8f9fa', color: '#333' },
  },
  dark: {
    container: { backgroundColor: '#1a1a1a', color: '#fff' },
    progressBar: { backgroundColor: '#333' },
    progressFill: { backgroundColor: '#007bff' },
    navButton: { backgroundColor: '#333', color: '#fff' },
  },
  colorful: {
    container: { backgroundColor: '#f8f9fa' },
    progressFill: { background: 'linear-gradient(90deg, #ff6b6b, #ffa500, #4ecdc4)' },
    navButton: { backgroundColor: '#ff6b6b', color: '#fff' },
  },
};

const ThemeContext = createContext(themes.light);

function ThemeProvider({ children, theme = 'light' }) {
  return <ThemeContext.Provider value={themes[theme]}>{children}</ThemeContext.Provider>;
}

function ThemedStoryCarousel() {
  const theme = useContext(ThemeContext);

  return (
    <StoryCarousel
      stories={stories}
      style={theme.container}
      renderStory={story => (
        <div
          style={{
            ...theme.container,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {story.content}
        </div>
      )}
    />
  );
}

// Использование
function App() {
  return (
    <ThemeProvider theme='dark'>
      <ThemedStoryCarousel />
    </ThemeProvider>
  );
}
```

---

[← Vanilla JS](vanilla-js.md) | [→ Продвинутые опции](advanced-options.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/advanced-options.md
