import { useState, useEffect, useRef } from 'react';
import { StoryCarousel as ReactStoryCarousel } from '@storycarouselkit/react';
import type { CarouselAPI } from '@storycarouselkit/react';
import { StoryCarousel as CoreStoryCarousel } from '@storycarouselkit/core';
import type { Story, StoryCarouselStateInfo } from '@storycarouselkit/core';
import { useLanguage } from '../contexts/LanguageContext';

const REACT_DEMO_STORIES: Story[] = [
  { id: '1', content: 'История 1', duration: 3000 },
  { id: '2', content: 'История 2', duration: 4000 },
  { id: '3', content: 'История 3', duration: 3500 },
];

const NATIVE_DEMO_STORIES: Story[] = [
  { id: '1', content: 'Story #1', duration: 3000 },
  { id: '2', content: 'Story #2', duration: 4000 },
  { id: '3', content: 'Story #3', duration: 3500 },
];

const REACT_GRADIENTS: Record<string, string> = {
  '1': 'linear-gradient(135deg, #60a5fa, #a855f7)',
  '2': 'linear-gradient(135deg, #34d399, #14b8a6)',
  '3': 'linear-gradient(135deg, #c084fc, #ec4899)',
};

const NATIVE_GRADIENTS: Record<string, string> = {
  '1': 'linear-gradient(135deg, #fbbf24, #f97316)',
  '2': 'linear-gradient(135deg, #22d3ee, #3b82f6)',
  '3': 'linear-gradient(135deg, #fb7185, #ef4444)',
};

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex justify-center'>
      <div
        className='relative rounded-2xl overflow-hidden shadow-2xl'
        style={{ width: 176, aspectRatio: '9/16' }}
      >
        {children}
      </div>
    </div>
  );
}

const pillStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'rgba(0, 0, 0, 0.22)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  color: 'rgba(255, 255, 255, 0.92)',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  borderRadius: 20,
  padding: '4px 10px',
  cursor: 'pointer',
  zIndex: 20,
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: '0.4px',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  whiteSpace: 'nowrap',
};

const badgeStyle: React.CSSProperties = {
  fontSize: 8,
  fontWeight: 700,
  background: 'rgba(0, 0, 0, 0.28)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  color: 'rgba(255,255,255,0.9)',
  padding: '2px 7px',
  borderRadius: 100,
  letterSpacing: '0.3px',
};

function ReactStoryDemo() {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const apiRef = useRef<CarouselAPI | null>(null);

  const handleToggle = () => {
    if (isPlaying) {
      apiRef.current?.pause();
    } else {
      apiRef.current?.play();
    }
    setIsPlaying(p => !p);
  };

  return (
    <PhoneFrame>
      <ReactStoryCarousel
        key={key}
        stories={REACT_DEMO_STORIES}
        autoPlay
        showControls={false}
        ref={apiRef}
        renderStory={(story: Story) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: REACT_GRADIENTS[story.id],
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700 }}>{story.content}</span>
            <span
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 10,
                fontFamily: 'monospace',
                marginTop: 4,
              }}
            >
              {story.duration}ms
            </span>
          </div>
        )}
        onComplete={() => {
          setIsPlaying(true);
          setKey(k => k + 1);
        }}
        style={{ width: '100%', height: '100%' }}
      />

      <div style={{ position: 'absolute', top: 20, left: 10, zIndex: 15 }}>
        <span style={badgeStyle}>React</span>
      </div>

      <button
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: '40%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
        }}
        onClick={() => apiRef.current?.prev()}
        aria-label='Предыдущая история'
      />
      <button
        style={{
          position: 'absolute',
          inset: '0 0 0 auto',
          width: '40%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
        }}
        onClick={() => apiRef.current?.next()}
        aria-label='Следующая история'
      />

      <button style={pillStyle} onClick={handleToggle}>
        <span>{isPlaying ? '⏸' : '▶'}</span>
        <span>{isPlaying ? 'ПАУЗА' : 'ИГРАТЬ'}</span>
      </button>
    </PhoneFrame>
  );
}

function NativeStoryDemo() {
  const carouselRef = useRef<CoreStoryCarousel | null>(null);
  const [state, setState] = useState<StoryCarouselStateInfo | null>(() => null);

  useEffect(() => {
    const carousel = new CoreStoryCarousel({
      stories: NATIVE_DEMO_STORIES,
      autoPlay: true,
      onComplete: () => {
        carousel.goTo(0);
        carousel.play();
      },
    });
    carouselRef.current = carousel;

    const interval = setInterval(() => setState(carousel.getState()), 100);

    return () => {
      clearInterval(interval);
      carousel.destroy();
    };
  }, []);

  if (!state?.currentStory) return null;

  const { currentStory, currentIndex, state: playState } = state;
  const isPlaying = playState === 'playing';

  const handlePrev = () => {
    carouselRef.current?.prev();
    setState(carouselRef.current!.getState());
  };
  const handleNext = () => {
    carouselRef.current?.next();
    setState(carouselRef.current!.getState());
  };
  const handleToggle = () => {
    if (isPlaying) {
      carouselRef.current?.pause();
    } else {
      carouselRef.current?.play();
    }
    setState(carouselRef.current!.getState());
  };

  return (
    <PhoneFrame>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: NATIVE_GRADIENTS[currentStory.id],
          transition: 'background 0.4s',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          right: 10,
          display: 'flex',
          gap: 4,
          zIndex: 10,
        }}
      >
        {NATIVE_DEMO_STORIES.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    flex: 1,
                    height: 2,
                    background: 'rgba(255,255,255,0.35)',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
            <div
              style={{
                height: '100%',
                background: '#fff',
                width: i < currentIndex ? '100%' : i === currentIndex ? '${progress * 100}%' : '0%',
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 20, left: 10, zIndex: 10 }}>
        <span style={badgeStyle}>Vanilla JS</span>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <p style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 }}>
          {currentStory.content}
        </p>
        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: 10,
            fontFamily: 'monospace',
            margin: '4px 0 0',
          }}
        >
          duration: {currentStory.duration}ms
        </p>
      </div>

      <button
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: '33%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
        }}
        onClick={handlePrev}
        aria-label='Предыдущая история'
      />
      <button
        style={{
          position: 'absolute',
          inset: '0 0 0 auto',
          width: '33%',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
        }}
        onClick={handleNext}
        aria-label='Следующая история'
      />

      <button style={pillStyle} onClick={handleToggle}>
        <span>{isPlaying ? '⏸' : '▶'}</span>
        <span>{isPlaying ? 'ПАУЗА' : 'ИГРАТЬ'}</span>
      </button>
    </PhoneFrame>
  );
}

export function Examples() {
  const { t } = useLanguage();
  const [selectedFramework, setSelectedFramework] = useState('react');

  const frameworks = [
    { id: 'react', name: t('framework.react'), available: true },
    { id: 'native', name: t('framework.native'), available: true },
    { id: 'vue', name: t('framework.vue'), available: false },
    { id: 'svelte', name: t('framework.svelte'), available: false },
    { id: 'angular', name: t('framework.angular'), available: false },
  ];

  const examples = {
    react: {
      title: t('code.reactExample'),
      description: t('examples.reactDescription'),
      code: `import { useRef, useState } from 'react';
import { StoryCarousel, type CarouselAPI } from '@storycarouselkit/react';

const stories = [
  { id: '1', content: 'Welcome', duration: 3200 },
  { id: '2', content: 'Discover', duration: 3800 },
  { id: '3', content: 'Share', duration: 3000 },
];

export function ReactStoryExample() {
  const carouselRef = useRef<CarouselAPI | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = () => {
    if (isPlaying) {
      carouselRef.current?.pause();
    } else {
      carouselRef.current?.play();
    }
    setIsPlaying(value => !value);
  };

  return (
    <div style={{ maxWidth: '320px', margin: '0 auto', position: 'relative', height: 500 }}>
      <StoryCarousel
        stories={stories}
        ref={carouselRef}
        autoPlay
        showControls={false}
        renderStory={(story, progress) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <h3 style={{ margin: 0 }}>{story.content}</h3>
            <p style={{ margin: '8px 0 0', color: 'rgba(255,255,255,0.8)' }}>
              {Math.round(progress * 100)}% watched
            </p>
          </div>
        )}
        onStoryEnd={(story) => {
          console.log('story ended:', story.id);
        }}
        style={{ width: '100%', height: '100%' }}
      />
      <button
        onClick={togglePlayback}
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.75)',
          color: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: '6px 12px',
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}`,
      demo: <ReactStoryDemo />,
    },
    native: {
      title: t('code.nativeExample'),
      description: t('examples.nativeDescription'),
      code: `import { StoryCarousel, type Story, type StoryCarouselStateInfo } from '@storycarouselkit/core';

const stories: Story[] = [
  { id: '1', content: 'Welcome', duration: 3000 },
  { id: '2', content: 'Scroll', duration: 4000 },
  { id: '3', content: 'Done', duration: 3500 },
];

const container = document.getElementById('story-carousel');
const intervalElement = document.getElementById('story-progress');

const carousel = new StoryCarousel({
  stories,
  autoPlay: true,
  onStoryStart: (story) => console.log('Started', story.id),
  onStoryEnd: (story) => console.log('Ended', story.id),
  onStoryViewed: (story) => {
    console.log('Viewed', story.id);
  },
  onComplete: () => {
    carousel.goTo(0);
    carousel.play();
  },
});

if (container) {
  container.appendChild(carousel.element);
}

setInterval(() => {
  const state = carousel.getState() as StoryCarouselStateInfo;
  if (intervalElement) {
  intervalElement.textContent = state.currentIndex + 1 + ' / ' + stories.length;
  }
}, 150);

carousel.play();`,
      demo: <NativeStoryDemo />,
    },
  };

  return (
    <section id='examples' className='min-h-screen pt-20 px-4 py-12 bg-gray-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-900 mb-4'>{t('examples.title')}</h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>{t('examples.description')}</p>
        </div>

        {/* Framework Selector */}
        <div className='flex flex-wrap justify-center gap-2 mb-12'>
          {frameworks.map(framework => (
            <button
              key={framework.id}
              onClick={() => framework.available && setSelectedFramework(framework.id)}
              disabled={!framework.available}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                framework.available
                  ? selectedFramework === framework.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {framework.name}
              {!framework.available && t('framework.comingSoon')}
            </button>
          ))}
        </div>

        {/* Example Content */}
        {examples[selectedFramework as keyof typeof examples] && (
          <div className='grid lg:grid-cols-2 gap-8 items-start'>
            {/* Code Example */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='bg-gray-800 px-4 py-3 flex items-center'>
                <div className='flex space-x-2'>
                  <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                  <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                  <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                </div>
                <span className='ml-4 text-gray-300 text-sm font-mono'>
                  {examples[selectedFramework as keyof typeof examples].title}
                </span>
              </div>
              <div className='p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                  {examples[selectedFramework as keyof typeof examples].title}
                </h3>
                <p className='text-gray-600 mb-4'>
                  {examples[selectedFramework as keyof typeof examples].description}
                </p>
                <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto'>
                  <code>{examples[selectedFramework as keyof typeof examples].code}</code>
                </pre>
              </div>
            </div>

            {/* Live Demo */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Превью</h3>
              {examples[selectedFramework as keyof typeof examples].demo}

              <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
                <h4 className='font-medium text-blue-900 mb-2'>🚀 {t('examples.quickStart')}</h4>
                <div className='text-sm text-blue-800 space-y-1'>
                  <p>
                    1. Установите пакет:{' '}
                    <code className='bg-blue-100 px-1 rounded'>
                      npm install @storycarouselkit/{selectedFramework}
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
        <div className='mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white'>
          <div className='text-center mb-8'>
            <h3 className='text-2xl font-bold mb-2'>{t('install.getStarted')}</h3>
            <p className='text-blue-100'>{t('install.description')}</p>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
              <h4 className='font-semibold mb-4'>{t('examples.installation')}</h4>
              <pre className='bg-black/30 p-4 rounded-lg text-sm overflow-x-auto'>
                <code>{`# Для React проектов
npm install @storycarouselkit/react

# Для нативного использования
npm install @storycarouselkit/core

# Для других фреймворков (скоро)
npm install @storycarouselkit/vue`}</code>
              </pre>
            </div>

            <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6'>
              <h4 className='font-semibold mb-4'>{t('install.support')}</h4>
              <ul className='space-y-2 text-sm'>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  React (полная поддержка)
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-green-400 rounded-full mr-3'></span>
                  Native JavaScript
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-yellow-400 rounded-full mr-3'></span>
                  Vue (в разработке)
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-yellow-400 rounded-full mr-3'></span>
                  Svelte (в разработке)
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-yellow-400 rounded-full mr-3'></span>
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
