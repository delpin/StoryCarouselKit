# Vanilla JavaScript

Использование Story Carousel без фреймворков с помощью нативного API.

## Установка

```bash
npm install@storycarouselkit/core
```

## Базовое использование

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Story Carousel - Vanilla JS</title>
    <style>
      .story-container {
        width: 400px;
        height: 600px;
        position: relative;
        margin: 20px auto;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      }

      .story-content {
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-family: Arial, sans-serif;
      }

      .progress-container {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        display: flex;
        gap: 4px;
        z-index: 10;
      }

      .progress-bar {
        flex: 1;
        height: 2px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 1px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        background: white;
        width: 0%;
        transition: width 0.1s linear;
      }

      .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 10;
        font-size: 18px;
      }

      .nav-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .nav-button.prev {
        left: 10px;
      }
      .nav-button.next {
        right: 10px;
      }

      .play-button {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        cursor: pointer;
        z-index: 10;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="story-container">
      <div class="progress-container" id="progress-container"></div>
      <div class="story-content" id="story-content"></div>
      <button class="nav-button prev" id="prev-button">‹</button>
      <button class="nav-button next" id="next-button">›</button>
      <button class="play-button" id="play-button">▶</button>
    </div>

    <script type="module">
      import { StoryCarousel } from '@storykit/core';

      // Данные историй
      const stories = [
        { id: '1', content: 'Добро пожаловать!', duration: 3000 },
        { id: '2', content: 'Это вторая история', duration: 4000 },
        { id: '3', content: 'И третья история', duration: 5000 },
      ];

      // Элементы DOM
      const progressContainer = document.getElementById('progress-container');
      const storyContent = document.getElementById('story-content');
      const prevButton = document.getElementById('prev-button');
      const nextButton = document.getElementById('next-button');
      const playButton = document.getElementById('play-button');

      // Создание индикаторов прогресса
      function createProgressBars() {
        progressContainer.innerHTML = '';
        stories.forEach((story, index) => {
          const progressBar = document.createElement('div');
          progressBar.className = 'progress-bar';

          const progressFill = document.createElement('div');
          progressFill.className = 'progress-fill';
          progressFill.id = `progress-${index}`;

          progressBar.appendChild(progressFill);
          progressContainer.appendChild(progressBar);
        });
      }

      // Обновление отображения
      function updateDisplay(state) {
        const currentStory = state.currentStory;

        // Обновление контента
        storyContent.textContent = currentStory.content;

        // Обновление прогресса
        stories.forEach((_, index) => {
          const progressFill = document.getElementById(`progress-${index}`);
          if (index === state.currentIndex) {
            progressFill.style.width = `${state.progress * 100}%`;
          } else if (index < state.currentIndex) {
            progressFill.style.width = '100%';
          } else {
            progressFill.style.width = '0%';
          }
        });

        // Обновление кнопок
        prevButton.disabled = state.currentIndex === 0;
        nextButton.disabled = state.currentIndex === stories.length - 1;
        playButton.textContent = state.isPlaying ? '⏸' : '▶';
      }

      // Инициализация
      createProgressBars();

      const carousel = new StoryCarousel({
        stories,
        autoPlay: true,
        onStoryStart: story => {
          console.log('Начало истории:', story.id);
        },
        onStoryEnd: story => {
          console.log('Конец истории:', story.id);
        },
        onComplete: () => {
          console.log('Все истории просмотрены');
          alert('Все истории просмотрены!');
        },
      });

      // Начальный рендер
      updateDisplay(carousel.getState());

      // Мониторинг состояния
      const stateInterval = setInterval(() => {
        updateDisplay(carousel.getState());
      }, 100);

      // Обработчики событий
      prevButton.addEventListener('click', () => carousel.prev());
      nextButton.addEventListener('click', () => carousel.next());
      playButton.addEventListener('click', () => {
        const state = carousel.getState();
        if (state.isPlaying) {
          carousel.pause();
        } else {
          carousel.play();
        }
      });

      // Очистка при уходе со страницы
      window.addEventListener('beforeunload', () => {
        clearInterval(stateInterval);
        carousel.destroy();
      });
    </script>
  </body>
</html>
```

## Продвинутые возможности

### С изображениями и медиа

```javascript
class MediaStoryViewer {
  constructor(container, stories) {
    this.container = container;
    this.stories = stories;
    this.currentMedia = null;

    this.init();
  }

  init() {
    this.carousel = new StoryCarousel({
      stories: this.stories,
      onStoryStart: story => this.showMedia(story),
      onComplete: () => this.onComplete(),
    });
  }

  showMedia(story) {
    // Очистка предыдущего медиа
    if (this.currentMedia) {
      this.currentMedia.remove();
    }

    const mediaElement = document.createElement(story.mediaType === 'video' ? 'video' : 'img');

    if (story.mediaType === 'video') {
      mediaElement.src = story.mediaUrl;
      mediaElement.autoplay = true;
      mediaElement.muted = true;
      mediaElement.style.objectFit = 'cover';
    } else {
      mediaElement.src = story.mediaUrl;
      mediaElement.alt = story.content;
      mediaElement.style.objectFit = 'cover';
    }

    mediaElement.style.width = '100%';
    mediaElement.style.height = '100%';

    this.container.appendChild(mediaElement);
    this.currentMedia = mediaElement;
  }

  onComplete() {
    // Показать финальный экран
    this.showCompletionScreen();
  }

  destroy() {
    if (this.currentMedia) {
      this.currentMedia.remove();
    }
    this.carousel.destroy();
  }
}

// Использование
const mediaStories = [
  {
    id: '1',
    content: 'Фото 1',
    mediaUrl: '/photo1.jpg',
    mediaType: 'image',
    duration: 4000,
  },
  {
    id: '2',
    content: 'Видео',
    mediaUrl: '/video.mp4',
    mediaType: 'video',
    duration: 6000,
  },
];

const viewer = new MediaStoryViewer(document.getElementById('story-container'), mediaStories);
```

### Интерактивные истории

```javascript
class InteractiveStoryViewer {
  constructor(container, stories) {
    this.container = container;
    this.stories = stories;
    this.currentInteraction = null;

    this.init();
  }

  init() {
    this.carousel = new StoryCarousel({
      stories: this.stories.map(story => ({
        ...story,
        duration: story.interactive ? 10000 : story.duration, // Дольше для интерактивных
      })),
      autoPlay: false, // Ручное управление для интерактивных историй
      onStoryStart: story => this.renderStory(story),
    });

    this.renderStory(this.stories[0]);
  }

  renderStory(story) {
    this.container.innerHTML = '';

    if (story.interactive) {
      this.renderInteractiveStory(story);
    } else {
      this.renderSimpleStory(story);
    }
  }

  renderSimpleStory(story) {
    this.container.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      ">
        ${story.content}
      </div>
    `;
  }

  renderInteractiveStory(story) {
    const html = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #667eea, #764ba2);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        padding: 40px;
        text-align: center;
      ">
        <h2 style="margin-bottom: 30px;">${story.question}</h2>
        <div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
          ${story.options
            .map(
              (option, index) => `
            <button
              class="option-btn"
              data-index="${index}"
              style="
                padding: 15px;
                background: rgba(255,255,255,0.2);
                border: none;
                border-radius: 25px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
              "
            >
              ${option}
            </button>
          `
            )
            .join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;

    // Обработчики для кнопок
    this.container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const index = parseInt(e.target.dataset.index);
        this.handleAnswer(story, index);
      });
    });
  }

  handleAnswer(story, answerIndex) {
    // Сохранить ответ
    console.log('Ответ на вопрос:', story.question, '->', story.options[answerIndex]);

    // Перейти к следующей истории
    setTimeout(() => {
      this.carousel.next();
    }, 1000);
  }
}

// Использование
const interactiveStories = [
  {
    id: '1',
    content: 'Простая история',
    duration: 3000,
  },
  {
    id: '2',
    question: 'Какой ваш любимый цвет?',
    options: ['Красный', 'Синий', 'Зеленый', 'Желтый'],
    interactive: true,
  },
  {
    id: '3',
    content: 'Спасибо за участие!',
    duration: 3000,
  },
];

const interactiveViewer = new InteractiveStoryViewer(
  document.getElementById('story-container'),
  interactiveStories
);
```

## Интеграция с фреймворками

### Простая интеграция с любым фреймворком

```javascript
// Универсальный компонент
function createStoryCarousel(container, config) {
  const carousel = new StoryCarousel(config);

  // Создание UI
  function render() {
    const state = carousel.getState();
    // Рендеринг на основе состояния
  }

  // Запуск цикла рендеринга
  const renderLoop = setInterval(render, 100);

  return {
    destroy: () => {
      clearInterval(renderLoop);
      carousel.destroy();
    },
    carousel,
  };
}
```

---

[← Angular интеграция](angular-integration.md) | [→ Темизация](theming.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/theming.md
