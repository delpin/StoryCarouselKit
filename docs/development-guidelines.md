# Рекомендации по разработке

Это руководство содержит рекомендации по разработке проекта Story Carousel, включая стандарты кода, процессы разработки и лучшие практики.

## Содержание

- [Стиль кода](#стиль-кода)
- [Оформление коммитов](#оформление-коммитов)
- [Работа с ветками](#работа-с-вветками)
- [Тестирование](#тестирование)
- [Code Review](#code-review)

## Стиль кода

### TypeScript

- Используйте строгий режим TypeScript (`"strict": true`)
- Избегайте использования `any` типа
- Определяйте интерфейсы для всех публичных API
- Используйте utility types для сложных типов

### Импорты

```typescript
// ✅ Правильно
import { useState, useEffect } from 'react';
import type { Story } from './types';

// ❌ Неправильно
import * as React from 'react';
import { Story } from './types'; // если нужен только тип
```

### Компоненты React

```typescript
// ✅ Правильно
interface Props {
  stories: Story[];
  autoPlay?: boolean;
}

export const StoryCarousel: React.FC<Props> = ({ stories, autoPlay = true }) => {
  // Логика компонента
};

// ❌ Неправильно
export const StoryCarousel = ({ stories, autoPlay }: any) => {
  // Логика компонента
};
```

## Оформление коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/) формат:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Типы коммитов

- `feat`: новая функциональность
- `fix`: исправление багов
- `docs`: изменения в документации
- `style`: изменения стиля кода (форматирование, точки с запятой и т.д.)
- `refactor`: рефакторинг кода
- `test`: добавление или исправление тестов
- `chore`: изменения в инструментах сборки, конфигурациях

### Примеры

```
feat: add autoplay functionality for stories

Add automatic story progression with configurable duration
```

```
fix: resolve memory leak in story carousel

Fix infinite loop in useEffect that caused memory leaks
when component unmounts
```

```
docs: update installation guide

Add detailed instructions for different frameworks
```

```
refactor: simplify story navigation logic

Extract navigation methods into separate hooks for better reusability
```

### Правила

1. **Пишите на английском языке**
2. **Используйте повелительное наклонение**: "add", "fix", "update", не "added", "fixed", "updated"
3. **Описывайте что изменилось, а не как**
4. **Добавляйте scope для большей ясности**: `feat(react):`, `fix(native):`
5. **Ограничивайте длину заголовка 72 символами**
6. **Добавляйте тело коммита для сложных изменений**

## Работа с ветками

### Схема именования

```
feature/[description]     # для новых функций
fix/[description]         # для исправлений багов
docs/[description]        # для документации
refactor/[description]    # для рефакторинга
chore/[description]       # для технических задач
```

### Примеры

```
feature/add-story-navigation
fix/memory-leak-in-carousel
docs/update-api-reference
refactor/simplify-state-management
```

### Процесс работы

1. Создайте ветку от `main`
2. Реализуйте функциональность
3. Напишите тесты
4. Обновите документацию
5. Создайте Pull Request
6. Пройдите Code Review
7. Слейте изменения

## Тестирование

### Unit тесты

- Тестируйте все публичные функции и компоненты
- Используйте описательные названия тестов
- Группируйте тесты по функциональности

```typescript
describe('StoryCarousel', () => {
  describe('autoplay functionality', () => {
    it('should start playing automatically when autoPlay is true', () => {
      // тест
    });

    it('should not start playing when autoPlay is false', () => {
      // тест
    });
  });
});
```

### Integration тесты

- Тестируйте взаимодействие компонентов
- Проверяйте правильность событий
- Используйте React Testing Library для компонентов

### E2E тесты

- Тестируйте полный пользовательский путь
- Используйте Playwright или Cypress
- Запускайте на разных браузерах

## Code Review

### Чек-лист ревьювера

- [ ] Код соответствует стилю проекта
- [ ] Добавлены необходимые тесты
- [ ] Обновлена документация
- [ ] Нет утечек памяти
- [ ] Корректная обработка ошибок
- [ ] Компоненты доступны (accessibility)
- [ ] Типы TypeScript корректны

### Чек-лист автора

- [ ] Код отформатирован (Prettier)
- [ ] Проходят все тесты
- [ ] Добавлены комментарии к сложной логике
- [ ] Проведено само-ревью
- [ ] Обновлен CHANGELOG.md

---

[← Назад к навигации](index.md)</contents>
