# Руководство по публикации@storycarouselkit/core

## Настройка NPM токена

Для автоматической публикации пакета в npm необходимо настроить GitHub Secrets.

### 1. Создание NPM токена

1. Зайдите на [npmjs.com](https://www.npmjs.com)
2. Авторизуйтесь в аккаунте
3. Перейдите в Settings → Access Tokens
4. Нажмите "Generate New Token"
5. Выберите тип токена: **Automation**
6. Скопируйте сгенерированный токен

### 2. Настройка GitHub Secrets

1. Перейдите в репозиторий на GitHub
2. Откройте Settings → Secrets and variables → Actions
3. Нажмите "New repository secret"
4. Введите:
   - **Name**: `NPM_TOKEN`
   - **Value**: ваш сгенерированный npm токен
5. Нажмите "Add secret"

## Процесс публикации

### Автоматическая публикация

Пакет автоматически публикуется при пуше в main/master ветку, если:

- Все тесты проходят ✅
- Сборка завершается успешно ✅
- Линтинг проходит без ошибок ✅

### Ручная публикация новой версии

1. Перейдите на вкладку "Actions" в GitHub
2. Выберите workflow "Release@storycarouselkit/core"
3. Нажмите "Run workflow"
4. Выберите тип версии:
   - **patch**: 1.0.0 → 1.0.1 (исправления багов)
   - **minor**: 1.0.0 → 1.1.0 (новые функции)
   - **major**: 1.0.0 → 2.0.0 (breaking changes)
   - **prerelease**: 1.0.0 → 1.0.1-beta.0 (предрелиз)

## Workflow файлы

### CI/CD (publish-core.yml)

- Запускается при изменениях в `packages/native/`
- Выполняет: lint → test → build → publish
- Публикует только при пуше в main/master

### Релизы (release-core.yml)

- Ручной запуск через GitHub Actions
- Автоматически:
  - Увеличивает версию
  - Создает git tag
  - Публикует в npm
  - Создает GitHub Release

## Проверка публикации

После успешной публикации:

1. Проверьте [npmjs.com/package/@storykit/core](https://www.npmjs.com/package/@storykit/core)
2. Установите пакет для тестирования:
   ```bash
   npm install@storycarouselkit/core@latest
   ```
3. Проверьте версию:
   ```javascript
   import { StoryCarousel } from '@storykit/core';
   console.log('Version check passed!');
   ```

## Troubleshooting

### Ошибка авторизации

```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@storykit%2fcore
```

**Решение**: Проверьте, что NPM_TOKEN корректный и имеет права на публикацию.

### Ошибка версии

```
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@storykit%2fcore - You cannot publish over the previously published versions
```

**Решение**: Увеличьте версию в package.json перед публикацией.

### Сборка не проходит

```
Error: Build failed
```

**Решение**: Проверьте логи сборки и исправьте ошибки в коде.

## Безопасность

- NPM токен хранится только в GitHub Secrets
- Публикация происходит только из доверенных веток
- Все изменения проходят через тесты и линтинг
- Автоматические релизы требуют ручного подтверждения
