import React from 'react';

interface LanguageSelectorProps {
  currentLang: 'en' | 'ru';
  onLanguageChange: (lang: 'en' | 'ru') => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLang, onLanguageChange }) => {
  return (
    <div className="flex items-center space-x-1">
      <button
        className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all ${
          currentLang === 'en' 
            ? 'bg-white text-black' 
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
        onClick={() => onLanguageChange('en')}
        type="button"
      >
        EN
      </button>
      <button
        className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all ${
          currentLang === 'ru' 
            ? 'bg-white text-black' 
            : 'bg-white/10 text-white/80 hover:bg-white/20'
        }`}
        onClick={() => onLanguageChange('ru')}
        type="button"
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSelector; 