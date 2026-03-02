import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Examples } from './components/Examples';
import { Documentation } from './components/Documentation';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Hero />;
      case 'examples':
        return <Examples />;
      case 'documentation':
        return <Documentation />;
      default:
        return <Hero />;
    }
  };

  return (
    <LanguageProvider>
      <div className='min-h-screen bg-gray-50'>
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
        {renderContent()}
      </div>
    </LanguageProvider>
  );
}

export default App;
