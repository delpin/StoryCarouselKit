import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
  const { t } = useLanguage();
  const [currentDemo, setCurrentDemo] = useState(0);

  const demos = [
    {
      title: "React",
      code: `import { StoryCarousel } from '@storykit/react';

const stories = [
  { id: '1', content: 'Story 1', duration: 3000 },
  { id: '2', content: 'Story 2', duration: 4000 },
];

<StoryCarousel
  stories={stories}
  autoPlay={true}
  onStoryEnd={(story) => console.log('Story ended:', story)}
/>`,
    },
    {
      title: "Native (Vanilla JS)",
      code: `import { StoryCarousel } from '@storykit/core';

const stories = [
  { id: '1', content: 'Story 1', duration: 3000 },
  { id: '2', content: 'Story 2', duration: 4000 },
];

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryEnd: (story) => console.log('Story ended:', story),
});

carousel.play();`,
    },
    {
      title: "Vue (Soon)",
      code: `<template>
  <StoryCarousel
    :stories="stories"
    :auto-play="true"
    @story-end="onStoryEnd"
  />
</template>

<script setup>
import { StoryCarousel } from '@storykit/vue';

const stories = [
  { id: '1', content: 'Story 1', duration: 3000 },
  { id: '2', content: 'Story 2', duration: 4000 },
];

const onStoryEnd = (story) => {
  console.log('Story ended:', story);
};
</script>`,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % demos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [demos.length]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Logo and Title */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Story
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Kit
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("features.autoplay.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.autoplay.description")}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("features.progress.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.progress.description")}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200/50">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("features.typescript.title")}
            </h3>
            <p className="text-gray-600">
              {t("features.typescript.description")}
            </p>
          </div>
        </div>

        {/* Code Demo */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-2xl max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            {demos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentDemo(index)}
                className={`w-3 h-3 rounded-full mx-1 transition-colors ${
                  index === currentDemo ? "bg-blue-500" : "bg-gray-600"
                }`}
              />
            ))}
          </div>

          <div className="text-left">
            <div className="flex items-center mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-400 text-sm">
                {demos[currentDemo].title}
              </span>
            </div>

            <pre className="text-gray-100 text-sm overflow-x-auto">
              <code>{demos[currentDemo].code}</code>
            </pre>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            {t("hero.getStarted")}
          </button>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-200">
            {t("hero.viewExamples")}
          </button>
        </div>
      </div>
    </section>
  );
}
