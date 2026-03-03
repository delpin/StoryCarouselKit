export type Language = 'ru' | 'en' | 'zh';

export interface Translations {
  [key: string]: string;
}

// Russian translations (default)
export const russianTranslations: Translations = {
  // Navigation
  'nav.home': 'Главная',
  'nav.examples': 'Примеры',
  'nav.documentation': 'Документация',

  // Hero section
  'hero.title': 'StoryKit',
  'hero.subtitle': 'Framework-agnostic компонент для создания историй в стиле Instagram',
  'hero.description':
    'Поддерживает React, Vue, Svelte и Angular с общим type-safe ядром. Включает автопроигрывание, индикаторы прогресса, паузу/удержание, управление NEXT/PREV и настраиваемые темы.',
  'hero.getStarted': 'Начать работу',
  'hero.viewExamples': 'Посмотреть примеры',

  // Features
  'features.autoplay.title': 'Быстрое автопроигрывание',
  'features.autoplay.description':
    'Настраиваемая длительность каждой истории с плавными переходами',
  'features.progress.title': 'Индикаторы прогресса',
  'features.progress.description': 'Визуальные индикаторы для каждой истории с поддержкой паузы',
  'features.typescript.title': 'TypeScript-first',
  'features.typescript.description': 'Полная типизация и отличная поддержка разработчиков',

  // Examples section
  'examples.title': 'Примеры использования',
  'examples.description':
    'Посмотрите, как легко интегрировать StoryKit в ваш проект. Выберите фреймворк и изучите примеры кода.',
  'examples.preview': 'Превью',
  'examples.installation': 'Установка',
  'examples.quickStart': 'Быстрый старт',

  // Framework names
  'framework.react': 'React',
  'framework.native': 'Native JS',
  'framework.vue': 'Vue',
  'framework.svelte': 'Svelte',
  'framework.angular': 'Angular',
  'framework.comingSoon': ' (Скоро)',

  // Installation
  'install.getStarted': 'Начните использовать прямо сейчас',
  'install.description': 'StoryKit доступен через npm и готов к использованию в вашем проекте',
  'install.support': 'Поддержка',

  // Code examples
  'code.reactExample': 'React Example',
  'code.nativeExample': 'Native JavaScript Example',
  'code.installReact': 'Для React проектов',
  'code.installNative': 'Для нативного использования',
  'code.installOther': 'Для других фреймворков (скоро)',

  // Examples descriptions
  'examples.reactDescription': 'Полнофункциональный пример с React компонентом',
  'examples.nativeDescription': 'Пример использования нативного API без фреймворков',

  // Documentation
  'docs.title': 'Документация',
  'docs.loading': 'Загрузка документации...',

  // Demo placeholder
  'demo.placeholder': 'Интерактивный демо будет доступен после установки пакета',
};

// English translations
export const englishTranslations: Translations = {
  // Navigation
  'nav.home': 'Home',
  'nav.examples': 'Examples',
  'nav.documentation': 'Documentation',

  // Hero section
  'hero.title': 'StoryKit',
  'hero.subtitle': 'Framework-agnostic Instagram-style story component',
  'hero.description':
    'Supports React, Vue, Svelte, and Angular with a shared type-safe core. Features auto-play, progress indicators, pause/hold interactions, NEXT/PREV controls, and customizable themes.',
  'hero.getStarted': 'Get Started',
  'hero.viewExamples': 'View Examples',

  // Features
  'features.autoplay.title': 'Fast Auto-play',
  'features.autoplay.description': 'Customizable duration for each story with smooth transitions',
  'features.progress.title': 'Progress Indicators',
  'features.progress.description': 'Visual indicators for each story with pause support',
  'features.typescript.title': 'TypeScript-first',
  'features.typescript.description': 'Full typing and excellent developer experience',

  // Examples section
  'examples.title': 'Usage Examples',
  'examples.description':
    'See how easy it is to integrate StoryKit into your project. Choose a framework and explore code examples.',
  'examples.preview': 'Preview',
  'examples.installation': 'Installation',
  'examples.quickStart': 'Quick Start',

  // Framework names
  'framework.react': 'React',
  'framework.native': 'Native JS',
  'framework.vue': 'Vue',
  'framework.svelte': 'Svelte',
  'framework.angular': 'Angular',
  'framework.comingSoon': ' (Coming Soon)',

  // Installation
  'install.getStarted': 'Start using it right now',
  'install.description': 'StoryKit is available via npm and ready to use in your project',
  'install.support': 'Support',

  // Code examples
  'code.reactExample': 'React Example',
  'code.nativeExample': 'Native JavaScript Example',
  'code.installReact': 'For React projects',
  'code.installNative': 'For native usage',
  'code.installOther': 'For other frameworks (coming soon)',

  // Examples descriptions
  'examples.reactDescription': 'Full-featured example with React component',
  'examples.nativeDescription': 'Example using native API without any framework',

  // Documentation
  'docs.title': 'Documentation',
  'docs.loading': 'Loading documentation...',

  // Demo placeholder
  'demo.placeholder': 'Interactive demo will be available after package installation',
};

// Chinese translations
export const chineseTranslations: Translations = {
  // Navigation
  'nav.home': '主页',
  'nav.examples': '示例',
  'nav.documentation': '文档',

  // Hero section
  'hero.title': 'StoryKit',
  'hero.subtitle': '框架无关的 Instagram 风格故事组件',
  'hero.description':
    '支持 React、Vue、Svelte 和 Angular，具有共享的类型安全核心。具有自动播放、进度指示器、暂停/保持交互、NEXT/PREV 控制和可自定义主题等功能。',
  'hero.getStarted': '开始使用',
  'hero.viewExamples': '查看示例',

  // Features
  'features.autoplay.title': '快速自动播放',
  'features.autoplay.description': '每个故事的可自定义持续时间和平滑过渡',
  'features.progress.title': '进度指示器',
  'features.progress.description': '每个故事的视觉指示器，支持暂停',
  'features.typescript.title': 'TypeScript 优先',
  'features.typescript.description': '完整的类型化和优秀的开发者体验',

  // Examples section
  'examples.title': '使用示例',
  'examples.description':
    '看看如何轻松地将 StoryKit 集成到您的项目中。选择一个框架并探索代码示例。',
  'examples.preview': '预览',
  'examples.installation': '安装',
  'examples.quickStart': '快速开始',

  // Framework names
  'framework.react': 'React',
  'framework.native': '原生 JS',
  'framework.vue': 'Vue',
  'framework.svelte': 'Svelte',
  'framework.angular': 'Angular',
  'framework.comingSoon': ' (即将推出)',

  // Installation
  'install.getStarted': '立即开始使用',
  'install.description': 'StoryKit 可通过 npm 获取，并准备在您的项目中使用',
  'install.support': '支持',

  // Code examples
  'code.reactExample': 'React 示例',
  'code.nativeExample': '原生 JavaScript 示例',
  'code.installReact': '对于 React 项目',
  'code.installNative': '用于原生使用',
  'code.installOther': '对于其他框架 (即将推出)',

  // Examples descriptions
  'examples.reactDescription': '带有 React 组件的完整功能示例',
  'examples.nativeDescription': '使用原生 API 无框架的示例',

  // Documentation
  'docs.title': '文档',
  'docs.loading': '正在加载文档...',

  // Demo placeholder
  'docs.placeholder': '安装包后将提供交互式演示',
};

export const getTranslations = (language: Language): Translations => {
  switch (language) {
    case 'en':
      return englishTranslations;
    case 'zh':
      return chineseTranslations;
    case 'ru':
    default:
      return russianTranslations;
  }
};