import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function Examples() {
  const { t } = useLanguage();
  const [selectedFramework, setSelectedFramework] = useState("react");

  const frameworks = [
    { id: "react", name: t("framework.react"), available: true },
    { id: "native", name: t("framework.native"), available: true },
    { id: "vue", name: t("framework.vue"), available: false },
    { id: "svelte", name: t("framework.svelte"), available: false },
    { id: "angular", name: t("framework.angular"), available: false },
  ];

  const examples = {
    react: {
      title: t("code.reactExample"),
      description: "Полнофункциональный пример с React компонентом",
      code: `import { useState } from 'react';
import { StoryCarousel } from '@storykit/react';

function App() {
  const [stories] = useState([
    {
      id: '1',
      content: (
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">История 1</h2>
            <p>Автопереключение через 3 секунды</p>
          </div>
        </div>
      ),
      duration: 3000
    },
    {
      id: '2',
      content: (
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">История 2</h2>
            <p>Автопереключение через 4 секунды</p>
          </div>
        </div>
      ),
      duration: 4000
    },
    {
      id: '3',
      content: (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-2">История 3</h2>
            <p>Последняя история</p>
          </div>
        </div>
      ),
      duration: 3500
    }
  ]);

  return (
    <div className="max-w-md mx-auto">
      <StoryCarousel
        stories={stories}
        autoPlay={true}
        onStoryEnd={(story) => console.log('Story ended:', story)}
        onComplete={() => console.log('All stories completed')}
        className="rounded-xl shadow-lg"
      />
    </div>
  );
}`,
      demo: (
        <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
          <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-16 h-2 bg-white/30 rounded-full mb-2 mx-auto"></div>
              <div className="w-12 h-2 bg-white/60 rounded-full mb-2 mx-auto"></div>
              <div className="w-8 h-2 bg-white rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-sm text-gray-300">{t("demo.placeholder")}</p>
        </div>
      ),
    },
    native: {
      title: t("code.nativeExample"),
      description: t("examples.nativeDescription"),
      code: `import { StoryCarousel } from '@storykit/core';

// Создаем контейнер
const container = document.getElementById('story-container');

// Определяем истории
const stories = [
  {
    id: '1',
    content: 'Первая история',
    duration: 3000
  },
  {
    id: '2',
    content: 'Вторая история',
    duration: 4000
  }
];

// Создаем экземпляр карусели
const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryEnd: (story) => {
    console.log('История завершена:', story);
  },
  onComplete: () => {
    console.log('Все истории просмотрены');
  }
});

// Добавляем в DOM и запускаем
container.appendChild(carousel.element);
carousel.play();`,
      demo: (
        <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
          <div className="w-full h-48 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-16 h-2 bg-white/30 rounded-full mb-2 mx-auto"></div>
              <div className="w-12 h-2 bg-white/60 rounded-full mb-2 mx-auto"></div>
              <div className="w-8 h-2 bg-white rounded-full mx-auto"></div>
            </div>
          </div>
          <p className="text-sm text-gray-300">{t("demo.placeholder")}</p>
        </div>
      ),
    },
  };

  return (
    <section className="min-h-screen pt-20 px-4 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("examples.title")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("examples.description")}
          </p>
        </div>

        {/* Framework Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {frameworks.map((framework) => (
            <button
              key={framework.id}
              onClick={() =>
                framework.available && setSelectedFramework(framework.id)
              }
              disabled={!framework.available}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                framework.available
                  ? selectedFramework === framework.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {framework.name}
              {!framework.available && t("framework.comingSoon")}
            </button>
          ))}
        </div>

        {/* Example Content */}
        {examples[selectedFramework as keyof typeof examples] && (
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Code Example */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-3 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="ml-4 text-gray-300 text-sm font-mono">
                  {examples[selectedFramework as keyof typeof examples].title}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {examples[selectedFramework as keyof typeof examples].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {
                    examples[selectedFramework as keyof typeof examples]
                      .description
                  }
                </p>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>
                    {examples[selectedFramework as keyof typeof examples].code}
                  </code>
                </pre>
              </div>
            </div>

            {/* Live Demo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Превью
              </h3>
              {examples[selectedFramework as keyof typeof examples].demo}

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  🚀 {t("examples.quickStart")}
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>
                    1. Установите пакет:{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      npm install @storykit/{selectedFramework}
                    </code>
                  </p>
                  <p>2. Импортируйте компонент</p>
                  <p>3. Добавьте свои истории</p>
                  <p>4. Готово! 🎉</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Installation Guide */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">
              {t("install.getStarted")}
            </h3>
            <p className="text-blue-100">{t("install.description")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold mb-4">
                {t("examples.installation")}
              </h4>
              <pre className="bg-black/30 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{`# Для React проектов
npm install @storykit/react

# Для нативного использования
npm install @storykit/core

# Для других фреймворков (скоро)
npm install @storykit/vue`}</code>
              </pre>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h4 className="font-semibold mb-4">{t("install.support")}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  React (полная поддержка)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                  Native JavaScript
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Vue (в разработке)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Svelte (в разработке)
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></span>
                  Angular (в разработке)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
