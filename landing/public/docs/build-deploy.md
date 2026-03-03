# Сборка и развертывание

Руководство по сборке, публикации и развертыванию Story Carousel.

## Локальная разработка

### Настройка среды

```bash
# Клонирование репозитория
git clone https://github.com/your-org/story-carousel-monorepo.git
cd story-carousel-monorepo

# Установка зависимостей
pnpm install

# Запуск в режиме разработки
pnpm dev
```

### Скрипты разработки

```bash
# Сборка всех пакетов
pnpm build

# Сборка конкретного пакета
pnpm --filter @storycarouselkit/react build

# Очистка сборок
pnpm clean

# Запуск тестов
pnpm test

# Проверка типов
pnpm type-check

# Линтинг
pnpm lint

# Форматирование кода
pnpm format
```

## Сборка пакетов

### Структура сборки

Каждый пакет имеет свою конфигурацию сборки:

```
packages/
├── native/
│   ├── dist/
│   │   ├── index.js          # CommonJS
│   │   ├── index.mjs         # ES Modules
│   │   ├── index.d.ts        # TypeScript definitions
│   │   └── index.d.mts       # TypeScript definitions (ESM)
│   ├── package.json
│   └── tsconfig.json
├── react/
│   ├── dist/                 # Аналогичная структура
│   └── ...
```

### Tsup конфигурация

```typescript
// packages/native/tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false, // Для библиотек лучше false для лучшей отладки
});
```

```typescript
// packages/react/tsup.config.ts
import { defineConfig } from 'tsup';
import * as reactPlugin from 'esbuild-plugin-react';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  external: ['react', 'react-dom'],
  plugins: [reactPlugin()],
  sourcemap: true,
  clean: true,
});
```

### Оптимизация сборки

#### Tree shaking

```typescript
// src/index.ts - явный экспорт для tree shaking
export { StoryCarousel } from './StoryCarousel';
export type { Story, StoryCarouselConfig, StoryCarouselState } from './types';

// Не используем export * from для лучшего tree shaking
```

#### Bundle анализ

```bash
# Анализ размера бандла
pnpm --filter @storycarouselkit/react build
npx bundle-analyzer packages/react/dist/index.js
```

## Публикация пакетов

### Подготовка к публикации

```bash
# Проверка, что все тесты проходят
pnpm test

# Проверка типов
pnpm type-check

# Сборка всех пакетов
pnpm build

# Проверка содержимого пакетов
pnpm --filter@storycarouselkit/core pack --dry-run
```

### Package.json конфигурация

```json
// packages/native/package.json
{
  "name": "@storycarouselkit/core",
  "version": "1.0.0",
  "description": "Framework-agnostic story carousel core",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "files": ["dist", "README.md", "LICENSE"],
  "keywords": ["stories", "carousel", "typescript"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/story-carousel-monorepo.git",
    "directory": "packages/native"
  },
  "bugs": {
    "url": "https://github.com/your-org/story-carousel-monorepo/issues"
  },
  "homepage": "https://github.com/your-org/story-carousel-monorepo#readme"
}
```

### Процесс публикации

```bash
# Авторизация в npm (если еще не авторизованы)
npm login

# Bump версии (patch/minor/major)
pnpm version patch

# Публикация всех пакетов
pnpm publish --recursive

# Или публикация конкретного пакета
pnpm publish --filter @storycarouselkit/react
```

### Автоматизированная публикация

```typescript
// scripts/publish.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function bumpVersion(type: 'patch' | 'minor' | 'major') {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const [major, minor, patch] = packageJson.version.split('.').map(Number);

  let newVersion: string;
  switch (type) {
    case 'patch':
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
  }

  packageJson.version = newVersion;
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

  return newVersion;
}

function publishPackages() {
  try {
    // Сборка
    execSync('pnpm build', { stdio: 'inherit' });

    // Тесты
    execSync('pnpm test', { stdio: 'inherit' });

    // Публикация
    execSync('pnpm publish --recursive', { stdio: 'inherit' });

    console.log('✅ Публикация завершена успешно');
  } catch (error) {
    console.error('❌ Ошибка публикации:', error);
    process.exit(1);
  }
}

// Использование: node scripts/publish.ts patch
const versionType = process.argv[2] as 'patch' | 'minor' | 'major';
bumpVersion(versionType);
publishPackages();
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test

      - name: Build packages
        run: pnpm build

      - name: Publish to npm
        run: pnpm publish --recursive --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Create GitHub release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            ## What's Changed

            [View changelog](https://github.com/your-org/story-carousel-monorepo/blob/main/CHANGELOG.md)
```

### Semantic Release

```javascript
// .releaserc.js
module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@semantic-release/github',
    '@semantic-release/changelog',
    '@semantic-release/git',
  ],
  preset: 'angular',
};
```

## Развертывание документации

### GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Docs

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build docs
        run: pnpm build:docs

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/dist
```

### Docsify настройка

```html
<!-- docs/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Story Carousel Documentation</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="description" content="Story Carousel Documentation" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0" />
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css" />
  </head>
  <body>
    <div id="app"></div>
    <script>
      window.$docsify = {
        name: 'Story Carousel',
        repo: 'your-org/story-carousel-monorepo',
        loadSidebar: true,
        subMaxLevel: 2,
        search: 'auto',
      };
    </script>
    <script src="//cdn.jsdelivr.net/npm/docsify@4/lib/docsify.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/docsify/lib/plugins/search.min.js"></script>
  </body>
</html>
```

## CDN развертывание

### unpkg/jsDelivr

Пакеты автоматически доступны через CDN:

```html
<!-- React версия -->
<script crossorigin src="https://unpkg.com/@storycarouselkit/react@1.0.0/dist/index.js"></script>

<!-- Нативная версия -->
<script crossorigin src="https://unpkg.com/@storycarouselkit/core@1.0.0/dist/index.js"></script>
```

### Cloudflare Workers

```javascript
// functions/_middleware.ts
export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);

  // Редирект для старых версий
  if (url.pathname.startsWith('/v0/')) {
    const newPath = url.pathname.replace('/v0/', '/v1/');
    return Response.redirect(`${url.origin}${newPath}`, 301);
  }

  // Кэширование статических файлов
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000');
    return newResponse;
  }

  return fetch(request);
}
```

## Мониторинг и аналитика

### Bundle анализ

```bash
# Анализ размера пакетов
npx bundle-analyzer packages/*/dist/index.js

# Webpack Bundle Analyzer для consumer проектов
npx webpack-bundle-analyzer dist/static/js/*.js
```

### CDN аналитика

```javascript
// scripts/analyze-cdn.ts
async function analyzeCDNUsage() {
  const packages = ['@storycarouselkit/core', '@storycarouselkit/react'];

  for (const pkg of packages) {
    try {
      // Получение данных от npm API
      const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg}`);
      const data = await response.json();

      console.log(`${pkg}: ${data.downloads} downloads`);
    } catch (error) {
      console.error(`Error fetching data for ${pkg}:`, error);
    }
  }
}

analyzeCDNUsage();
```

## Безопасность

### Security audit

```bash
# Проверка зависимостей на уязвимости
pnpm audit

# Автоматическое исправление уязвимостей
pnpm audit fix

# Детальный отчет
pnpm audit --audit-level moderate
```

### SAST (Static Application Security Testing)

```yaml
# .github/workflows/security.yml
name: Security

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * 1' # Еженедельно по понедельникам

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Run npm audit
        run: pnpm audit --audit-level high

      - name: Run CodeQL Analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript-typescript

      - name: Perform CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

## Производительность

### Размер бандла

```typescript
// scripts/bundle-size.ts
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { gzipSize } from 'gzip-size';

async function checkBundleSize() {
  // Сборка пакетов
  execSync('pnpm build', { stdio: 'inherit' });

  const packages = ['native', 'react'];
  const results: Record<string, any> = {};

  for (const pkg of packages) {
    const cjsPath = `packages/${pkg}/dist/index.js`;
    const esmPath = `packages/${pkg}/dist/index.mjs`;

    try {
      const cjsSize = readFileSync(cjsPath).length;
      const esmSize = readFileSync(esmPath).length;
      const cjsGzip = await gzipSize(readFileSync(cjsPath));
      const esmGzip = await gzipSize(readFileSync(esmPath));

      results[pkg] = {
        cjs: { raw: cjsSize, gzip: cjsGzip },
        esm: { raw: esmSize, gzip: esmGzip },
      };
    } catch (error) {
      console.error(`Error checking size for ${pkg}:`, error);
    }
  }

  console.table(results);
}

checkBundleSize();
```

### Оптимизации

```typescript
// scripts/optimize.ts
import { execSync } from 'child_process';

function optimizeBundles() {
  // Минификация для production
  execSync('pnpm build:minified', { stdio: 'inherit' });

  // Генерация source maps для development
  execSync('pnpm build:dev', { stdio: 'inherit' });

  // Создание легаси сборок для старых браузеров
  execSync('pnpm build:legacy', { stdio: 'inherit' });
}

optimizeBundles();
```

---

[← Тестирование](testing.md) | [← Назад к навигации](index.md)</contents>
</xai:function_call name</xai:function_call name="Write">
<parameter name="path">docs/getting-started.md
