import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../contexts/LanguageContext';

interface DocFile {
  name: string;
  path: string;
  title: string;
  category: string;
}

export function Documentation() {
  const { t } = useLanguage();
  const [selectedDoc, setSelectedDoc] = useState<string>('index');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getDocPath = useCallback((filename: string) => `${import.meta.env.BASE_URL}docs/${filename}.md`, []);

  const docFiles: DocFile[] = useMemo(() => [
    // Основные разделы
    { name: 'index', path: getDocPath('index'), title: 'Главная', category: 'Основное' },
    {
      name: 'getting-started',
      path: getDocPath('getting-started'),
      title: 'Быстрый старт',
      category: 'Основное',
    },
    { name: 'examples', path: getDocPath('examples'), title: 'Примеры', category: 'Основное' },

    // Архитектура
    {
      name: 'architecture',
      path: getDocPath('architecture'),
      title: 'Архитектура и мотивация',
      category: 'Архитектура',
    },
    {
      name: 'native-api',
      path: getDocPath('native-api'),
      title: 'Нативное API',
      category: 'Архитектура',
    },

    // Фреймворки
    {
      name: 'react-integration',
      path: getDocPath('react-integration'),
      title: 'React',
      category: 'Интеграции',
    },
    {
      name: 'vue-integration',
      path: getDocPath('vue-integration'),
      title: 'Vue',
      category: 'Интеграции',
    },
    {
      name: 'svelte-integration',
      path: getDocPath('svelte-integration'),
      title: 'Svelte',
      category: 'Интеграции',
    },
    {
      name: 'angular-integration',
      path: getDocPath('angular-integration'),
      title: 'Angular',
      category: 'Интеграции',
    },
    {
      name: 'vanilla-js',
      path: getDocPath('vanilla-js'),
      title: 'Vanilla JavaScript',
      category: 'Интеграции',
    },

    // Кастомизация
    {
      name: 'theming',
      path: getDocPath('theming'),
      title: 'Темы и стилизация',
      category: 'Кастомизация',
    },
    {
      name: 'advanced-options',
      path: getDocPath('advanced-options'),
      title: 'Расширенные опции',
      category: 'Кастомизация',
    },

    // API Reference
    { name: 'types', path: getDocPath('types'), title: 'Типы данных', category: 'API Reference' },
    {
      name: 'events',
      path: getDocPath('events'),
      title: 'События и коллбэки',
      category: 'API Reference',
    },
    {
      name: 'methods',
      path: getDocPath('methods'),
      title: 'Методы управления',
      category: 'API Reference',
    },

    // Разработка
    {
      name: 'contributing',
      path: getDocPath('contributing'),
      title: 'Contributing',
      category: 'Разработка',
    },
    { name: 'testing', path: getDocPath('testing'), title: 'Тестирование', category: 'Разработка' },
    {
      name: 'build-deploy',
      path: getDocPath('build-deploy'),
      title: 'Сборка и развертывание',
      category: 'Разработка',
    },
  ], [getDocPath]);

  const categories = Array.from(new Set(docFiles.map(doc => doc.category)));

  const loadDoc = useCallback(async (docName: string) => {
    setLoading(true);
    try {
      const docFile = docFiles.find(doc => doc.name === docName);
      if (!docFile) return;

      const response = await fetch(docFile.path);
      const content = await response.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error loading documentation:', error);
      setMarkdownContent('# Ошибка загрузки\n\nНе удалось загрузить документацию.');
    } finally {
      setLoading(false);
    }
  }, [docFiles]);

  useEffect(() => {
    loadDoc(selectedDoc);
  }, [selectedDoc, loadDoc]);

  const getDocsByCategory = (category: string) => {
    return docFiles.filter(doc => doc.category === category);
  };

  return (
    <section className='min-h-screen pt-20 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar Navigation */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-lg p-6 sticky top-24'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6'>{t('docs.title')}</h3>

              {categories.map(category => (
                <div key={category} className='mb-6'>
                  <h4 className='text-sm font-medium text-gray-500 uppercase tracking-wide mb-3'>
                    {category}
                  </h4>
                  <ul className='space-y-1'>
                    {getDocsByCategory(category).map(doc => (
                      <li key={doc.name}>
                        <button
                          onClick={() => setSelectedDoc(doc.name)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                            selectedDoc === doc.name
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          {doc.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className='lg:col-span-3'>
            <div className='bg-white rounded-xl shadow-lg p-8'>
              {loading ? (
                <div className='flex items-center justify-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
                  <span className='ml-3 text-gray-600'>{t('docs.loading')}</span>
                </div>
              ) : (
                <div className='prose prose-lg max-w-none'>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className='text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4'>
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className='text-2xl font-bold text-gray-900 mt-8 mb-4'>{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className='text-xl font-semibold text-gray-900 mt-6 mb-3'>
                          {children}
                        </h3>
                      ),
                      code: ({ children, className }) => (
                        <code
                          className={`bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono ${className || ''}`}
                        >
                          {children}
                        </code>
                      ),
                      pre: ({ children }) => (
                        <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4'>
                          {children}
                        </pre>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className='border-l-4 border-blue-500 pl-4 italic text-gray-700 my-4'>
                          {children}
                        </blockquote>
                      ),
                      ul: ({ children }) => (
                        <ul className='list-disc list-inside space-y-2 my-4 text-gray-700'>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className='list-decimal list-inside space-y-2 my-4 text-gray-700'>
                          {children}
                        </ol>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className='text-blue-600 hover:text-blue-800 underline'
                          target={href?.startsWith('http') ? '_blank' : undefined}
                          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {children}
                        </a>
                      ),
                      p: ({ children }) => (
                        <p className='text-gray-700 leading-relaxed mb-4'>{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className='font-semibold text-gray-900'>{children}</strong>
                      ),
                    }}
                  >
                    {markdownContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
