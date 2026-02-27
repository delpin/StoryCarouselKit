# Документация Story Carousel

StoryKit — это framework-agnostic компонент для создания списков историй в стиле Instagram. Поддерживает React, Vue, Svelte и Angular с общим type-safe ядром. Включает автопроигрывание, индикаторы прогресса, паузу/удержание, управление NEXT/PREV и настраиваемые темы.

## Навигация по документации

### 🚀 Быстрый старт

- [Установка и настройка](getting-started.md)
- [Примеры использования](examples.md)

### 🏗️ Архитектура

- [Архитектура и мотивация](architecture.md)
- [Нативное API](native-api.md)

### 📦 Интеграции с фреймворками

- [React](react-integration.md)
- [Vue](vue-integration.md)
- [Svelte](svelte-integration.md)
- [Angular](angular-integration.md)
- [Vanilla JavaScript](vanilla-js.md)

### 🎨 Кастомизация

- [Темы и стилизация](theming.md)
- [Расширенные опции](advanced-options.md)

### 🔧 API Reference

- [Типы данных](types.md)
- [События и коллбэки](events.md)
- [Методы управления](methods.md)

### 🧪 Разработка

- [Contributing](contributing.md)
- [Тестирование](testing.md)
- [Сборка и развертывание](build-deploy.md)

---

## Быстрый обзор

```typescript
import { StoryCarousel } from '@storykit/react';

const stories = [
  { id: '1', content: 'История 1', duration: 3000 },
  { id: '2', content: 'История 2', duration: 4000 },
];

<StoryCarousel
  stories={stories}
  autoPlay={true}
  onStoryEnd={(story) => console.log('История завершена:', story)}
  onComplete={() => console.log('Все истории просмотрены')}
/>
```

## Поддерживаемые платформы

- ✅ **React** — полная реализация
- ✅ **Native (Vanilla JS)** — базовое API
- ⏳ **Vue** — планируется
- ⏳ **Svelte** — планируется
- ⏳ **Angular** — планируется

## Основные возможности

- 🎬 **Автопроигрывание** с настраиваемой длительностью
- 📊 **Индикаторы прогресса** для каждой истории
- ⏯️ **Управление воспроизведением** (пауза/воспроизведение)
- 👆 **Навигация** вперед/назад
- 🎨 **Кастомизация** внешнего вида
- 📱 **Адаптивный дизайн**
- 🔄 **События** для интеграции с бизнес-логикой
- 🛡️ **TypeScript** поддержка

---

[→ Начать с установки](getting-started.md) | [→ Изучить архитектуру](architecture.md)</contents>
</xai:function_call name
