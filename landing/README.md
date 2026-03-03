# StoryCarouselKit Landing Page

Современный лендинг для проекта StoryCarouselKit - framework-agnostic компонента историй в стиле Instagram.

## 🚀 Запуск в режиме разработки

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Лендинг будет доступен по адресу `http://localhost:5173`

## 🏗️ Сборка для продакшена

```bash
# Сборка оптимизированной версии
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 🚀 Развертывание на GitHub Pages

### Вариант 1: Автоматическое развертывание (рекомендуется)

Лендинг автоматически развертывается через GitHub Actions при пуше изменений в папку `landing/`.

**Настройка:**

1. В настройках репозитория перейдите в раздел **Pages**
2. Выберите **Source**: "GitHub Actions"
3. Workflow `deploy-landing.yml` автоматически соберет и опубликует лендинг

### Вариант 2: Ручное развертывание в отдельный репозиторий

Для монорепо рекомендуется создать отдельный репозиторий для лендинга.

```bash
# Создайте новый репозиторий на GitHub
# Например: https://github.com/username/StoryCarouselKit-landing

# Запустите скрипт развертывания
./deploy.sh https://github.com/username/StoryCarouselKit-landing.git

# Или используйте npm скрипт
npm run deploy
```

### Вариант 3: Развертывание в текущем репозитории (ветка gh-pages)

```bash
# Сборка лендинга
npm run build

# Ручное развертывание в ветку gh-pages
npm run deploy

# Затем в настройках репозитория:
# - Source: "Deploy from a branch"
# - Branch: gh-pages, Folder: / (root)
```

### Проверка развертывания

После развертывания лендинг будет доступен по адресу:

- **User/Org pages**: `https://username.github.io`
- **Project pages**: `https://username.github.io/repository-name`

### Troubleshooting

- **404 ошибки**: Убедитесь, что файл `.nojekyll` присутствует в папке `dist`
- **Сломанные пути**: Проверьте, что `base` в `vite.config.ts` настроен правильно
- **Кэширование**: Очистите кэш браузера или используйте hard refresh (Ctrl+F5)

### Автоматическое развертывание

Проект настроен для автоматического развертывания через GitHub Actions. При пуше изменений в папку `landing/` запускается workflow `deploy-landing.yml`, который:

1. Собирает лендинг с правильными путями
2. Публикует собранные файлы на GitHub Pages
3. Создает файл `.nojekyll` для корректной работы с ассетами

## 📁 Структура

```
landing/
├── public/
│   └── docs/          # Markdown файлы документации
├── src/
│   ├── components/    # React компоненты
│   │   ├── Navigation.tsx
│   │   ├── Hero.tsx
│   │   ├── Examples.tsx
│   │   └── Documentation.tsx
│   ├── App.tsx        # Главный компонент приложения
│   ├── main.tsx       # Точка входа
│   └── index.css      # Глобальные стили
├── package.json
└── tailwind.config.js # Конфигурация Tailwind CSS
```

## 🎨 Разделы лендинга

### 🏠 Главная (Hero)

- Современный дизайн с градиентами
- Анимированные примеры кода для разных фреймворков
- Ключевые возможности и преимущества

### 📚 Примеры (Examples)

- Интерактивные примеры для React и Native JS
- Переключение между фреймворками
- Готовые сниппеты кода для копирования

### 📖 Документация (Documentation)

- Интеграция существующей документации из `/docs`
- Навигация по категориям
- Красивый рендеринг Markdown с синтаксическим highlighting

## 🎯 Особенности

- **Адаптивный дизайн** - отлично выглядит на всех устройствах
- **Современный UI** - вдохновлено Embla Carousel и Fast Check
- **TypeScript** - полная типизация
- **Tailwind CSS** - утилитарные стили для быстрой разработки
- **React Markdown** - красивый рендеринг документации

## 🔧 Технологии

- **Vite** - быстрый bundler для разработки
- **React 19** - современный React с новыми фичами
- **TypeScript** - типизированный JavaScript
- **Tailwind CSS** - утилитарный CSS фреймворк
- **React Markdown** - рендеринг Markdown в React компоненты
