# Быстрый старт

Это руководство поможет вам быстро начать работу со Story Carousel. Мы рассмотрим установку, базовую настройку и первые шаги.

## Установка

### 1. Установка зависимостей

```bash
# Для React проекта
pnpm add @storykit/react

# Для нативного JavaScript
pnpm add@storycarouselkit/core

# Для других фреймворков (планируется)
pnpm add @storykit/vue
pnpm add @storykit/svelte
pnpm add @storykit/angular
```

### 2. Проверка установки

```bash
# Проверьте, что пакеты установлены
pnpm list | grep story-carousel
```

## Базовая настройка

### React (рекомендуется для новых проектов)

```tsx
import React from "react";
import { StoryCarousel } from "@storykit/react";

function App() {
  const stories = [
    {
      id: "1",
      content: "Добро пожаловать в наше приложение!",
      duration: 3000,
    },
    {
      id: "2",
      content: "Это вторая история с полезной информацией",
      duration: 4000,
    },
    {
      id: "3",
      content: "И третья история для завершения",
      duration: 5000,
    },
  ];

  return (
    <div style={{ width: "400px", height: "600px", margin: "0 auto" }}>
      <StoryCarousel
        stories={stories}
        autoPlay={true}
        onStoryEnd={(story) => console.log("История завершена:", story.id)}
        onComplete={() => console.log("Все истории просмотрены!")}
      />
    </div>
  );
}

export default App;
```

### Нативный JavaScript (Vanilla JS)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Story Carousel</title>
  </head>
  <body>
    <div id="story-container" style="width: 400px; height: 600px;"></div>

    <script type="module">
      import { StoryCarousel } from "@storykit/core";

      const stories = [
        { id: "1", content: "История 1", duration: 3000 },
        { id: "2", content: "История 2", duration: 4000 },
        { id: "3", content: "История 3", duration: 5000 },
      ];

      const carousel = new StoryCarousel({
        stories,
        autoPlay: true,
        onStoryEnd: (story) => console.log("Завершена:", story.id),
        onComplete: () => console.log("Все готовы!"),
      });

      // Для демонстрации - можно добавить кнопки управления
      carousel.play();
    </script>
  </body>
</html>
```

## Структура проекта

После установки у вас должна быть такая структура:

```
your-project/
├── node_modules/
│   └── @storykit/
│       ├── react/
│       └── native/
├── src/
│   ├── components/
│   │   └── StoryViewer.tsx
│   └── App.tsx
└── package.json
```

## Следующие шаги

### 1. Изучите базовые возможности

```tsx
// Добавьте обработку событий
<StoryCarousel
  stories={stories}
  onStoryStart={(story) => {
    // Аналитика просмотров
    console.log(`Начало просмотра: ${story.id}`);
  }}
  onStoryEnd={(story) => {
    // Сохранение прогресса
    saveProgress(story.id);
  }}
  onComplete={() => {
    // Показать следующий контент
    showNextContent();
  }}
/>
```

### 2. Настройте внешний вид

```tsx
// Кастомный рендеринг историй
<StoryCarousel
  stories={stories}
  renderStory={(story, progress) => (
    <div
      style={{
        background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      {story.content}
    </div>
  )}
/>
```

### 3. Добавьте интерактивность

```tsx
// Управление извне
function InteractiveStories() {
  const [currentStories, setCurrentStories] = useState(stories);

  const addStory = () => {
    const newStory = {
      id: Date.now().toString(),
      content: `Новая история ${currentStories.length + 1}`,
      duration: 3000,
    };
    setCurrentStories([...currentStories, newStory]);
  };

  return (
    <div>
      <button onClick={addStory}>Добавить историю</button>
      <StoryCarousel stories={currentStories} />
    </div>
  );
}
```

## Проверка работоспособности

### Тестовый запуск

```bash
# Запустите проект
npm start
# или
pnpm dev
# или
yarn start
```

### Что должно работать:

1. ✅ Карусель отображается с первой историей
2. ✅ Показываются индикаторы прогресса
3. ✅ Автоматическое переключение между историями
4. ✅ Работа кнопок навигации (назад/вперед)
5. ✅ Кнопка паузы/воспроизведения

### Отладка проблем:

```javascript
// Добавьте логирование для отладки
<StoryCarousel
  stories={stories}
  onStoryStart={(story) => console.log("Start:", story)}
  onStoryEnd={(story) => console.log("End:", story)}
  onComplete={() => console.log("Complete")}
/>
```

## Следующие разделы

Теперь, когда у вас есть рабочий компонент, изучите:

- **[Архитектуру](architecture.md)** — понять, как работает компонент внутри
- **[React интеграцию](react-integration.md)** — продвинутые возможности React
- **[Нативное API](native-api.md)** — прямое использование без фреймворков
- **[Кастомизацию](theming.md)** — настройка внешнего вида

## Поддержка

Если что-то не работает:

1. Проверьте консоль браузера на ошибки
2. Убедитесь, что все зависимости установлены
3. Проверьте версию Node.js (рекомендуется 16+)
4. Посмотрите [примеры](examples.md) для сравнения

---

[← Навигация](index.md) | [→ Примеры](examples.md)</contents>
</xai:function_call name</xai:function_call name
