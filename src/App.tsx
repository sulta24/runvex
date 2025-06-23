import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Upload, Zap, Mail, CheckCircle, ArrowRight, Star, Instagram } from 'lucide-react';
import { supabase } from './supabase';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
interface EmailEntry {
  email: string;
  timestamp: number;
}

interface Stats {
  totalApplications: number;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const translations = {
  en: {
    bakedBy: 'baked by',
    features: 'Features',
    demo: 'Demo',
    pricing: 'Pricing',
    runvex: 'Runvex',
    nowInBeta: 'Now in Beta - Join the Waitlist',
    createVideos: 'Edit your workout videos',
    likeMagic: '', // Will be filled with animated word
    heroDesc: 'Upload your workout footage, describe what you want, and get a perfectly edited video ready to publish. No editing skills required.',
    joinWaitlist: 'Join Waitlist',
    joined: 'Joined!',
    thanks: "Thanks! We'll notify you when we launch.",
    earlyAccessMembers: 'Early Access Members',
    joinThemNow: 'Join them now!',
    earlyAccessCloses: 'Early Access Closes In',
    dontMiss: "Don't miss your chance to join",
    seeItInAction: 'See It In Action',
    poweredByAI: 'Smart AI Video Editing',
    poweredByAIDesc: 'Our AI analyzes your workout footage and your description to create engaging, professional videos automatically.',
    aiEditing: 'AI-Powered Editing',
    aiEditingDesc: 'Describe your vision and AI creates the perfect edit from your workout footage',
    uploadTrain: 'Upload & Describe',
    uploadTrainDesc: 'Upload your workout videos and tell AI exactly what kind of edit you want',
    lightningFast: 'Lightning Fast',
    lightningFastDesc: 'From raw footage to published video in minutes, not hours of manual editing',
    howItWorks: 'How It Works',
    step1: '1. Upload Your Workout',
    step1Desc: 'Upload your training footage - any length, any format, we handle it all',
    step2: '2. Describe Your Vision',
    step2Desc: 'Write a prompt describing the style, pace, and focus you want for your video',
    step3: '3. Get Ready-to-Publish Video',
    step3Desc: 'AI analyzes your footage and prompt to create a professional edit ready for social media',
    readyToTransform: 'Ready to Transform Your Workout Content?',
    joinThousands: 'Join thousands of fitness creators who are turning raw workouts into viral content effortlessly.',
    getEarlyAccess: 'Get Early Access',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    allRights: 'All rights reserved.',
    emailPlaceholder: 'Enter your email',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    english: 'English',
    russian: 'Русский',
    invalidEmail: 'Please enter a valid email address',
  },
  ru: {
    bakedBy: 'разработано',
    features: 'Функции',
    demo: 'Демо',
    pricing: 'Цены',
    runvex: 'Runvex',
    nowInBeta: 'Бета-тестирование — запишитесь в очередь',
    createVideos: 'Монтируйте видео тренировок',
    likeMagic: '', // Will be filled with animated word
    heroDesc: 'Загружайте видео тренировок, опишите что хотите получить, и ИИ смонтирует готовый ролик для публикации. Никаких навыков монтажа не нужно.',
    joinWaitlist: 'Записаться',
    joined: 'Записались!',
    thanks: 'Отлично! Напишем, как только запустимся.',
    earlyAccessMembers: 'Уже записались',
    joinThemNow: 'Присоединяйтесь!',
    earlyAccessCloses: 'Запись закроется через',
    dontMiss: 'Не пропустите возможность попасть в число первых',
    seeItInAction: 'Посмотрите на деле',
    poweredByAI: 'Умный ИИ-монтаж',
    poweredByAIDesc: 'Наш ИИ анализирует ваши тренировки и описание, чтобы автоматически создать захватывающие профессиональные видео.',
    aiEditing: 'ИИ-монтаж',
    aiEditingDesc: 'Опишите свою идею, и ИИ создаст идеальный монтаж из ваших тренировок',
    uploadTrain: 'Загрузка и описание',
    uploadTrainDesc: 'Загрузите видео тренировок и расскажите ИИ, какой монтаж вы хотите',
    lightningFast: 'Молниеносно',
    lightningFastDesc: 'От сырого материала до готового видео за минуты, а не часы ручного монтажа',
    howItWorks: 'Как это работает',
    step1: '1. Загрузите тренировку',
    step1Desc: 'Загрузите видео своих тренировок — любой длины и формата, мы всё обработаем',
    step2: '2. Опишите свою идею',
    step2Desc: 'Напишите промпт с описанием стиля, темпа и акцентов для вашего видео',
    step3: '3. Получите готовый ролик',
    step3Desc: 'ИИ анализирует материал и промпт, создавая профессиональный монтаж для соцсетей',
    readyToTransform: 'Готовы превратить тренировки в контент?',
    joinThousands: 'Тысячи фитнес-блогеров уже превращают обычные тренировки в вирусный контент без усилий.',
    getEarlyAccess: 'Хочу попробовать',
    privacy: 'Приватность',
    terms: 'Условия',
    contact: 'Связь',
    allRights: 'Все права защищены.',
    emailPlaceholder: 'Ваш email',
    days: 'дней',
    hours: 'часов',
    minutes: 'минут',
    seconds: 'секунд',
    english: 'English',
    russian: 'Русский',
    invalidEmail: 'Введите правильный email',
  }
};

const getTargetDate = (): Date => {
  // Установить дату на 27 июня 2025
  const targetDate = new Date(2025, 5, 27); // месяц 5 = июнь (отсчет с 0)
  targetDate.setHours(23, 59, 59, 999);
  return targetDate;
};

const calculateTimeLeft = (): TimeLeft => {
  const difference = getTargetDate().getTime() - new Date().getTime();
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

const App: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ru'>('en');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const t = translations[lang];
  
  // Animated words for the hero title - all short words
  const animatedWords = {
    en: ['fast', 'sharp', 'easy', 'nice', 'cool', 'awesome'],
    ru: ['быстро', 'четко', 'легко', 'красиво', 'круто', 'клево']
  };
  
  // Language change handler
  const handleLanguageChange = (newLang: 'en' | 'ru') => {
    setLang(newLang);
    setCurrentWordIndex(0);
    setDisplayedText('');
    setIsDeleting(false);
  };
  
  // Typewriter effect
  useEffect(() => {
    const currentWord = animatedWords[lang][currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (isDeleting) {
        if (displayedText.length > 0) {
          setDisplayedText(prev => prev.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWordIndex((prevIndex) => (prevIndex + 1) % animatedWords[lang].length);
        }
      } else {
        if (displayedText.length < currentWord.length) {
          setDisplayedText(currentWord.substring(0, displayedText.length + 1));
        } else if (displayedText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }
    }, isDeleting ? 50 : 100);
    
    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex, lang]);
  
  // Reset when language changes
  useEffect(() => {
    setDisplayedText('');
    setIsDeleting(false);
    setCurrentWordIndex(0);
  }, [lang]);

  // Start animation on mount
  useEffect(() => {
    if (displayedText === '' && !isDeleting) {
      const timer = setTimeout(() => {
        setDisplayedText(animatedWords[lang][0].charAt(0));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lang]);

  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [, setEmails] = useState<EmailEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [stats, setStats] = useState<Stats>({ totalApplications: 0 });
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());



  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch total applications count from Supabase
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count, error } = await supabase
          .from('emails')
          .select('*', { count: 'exact' });

        if (error) {
          console.error('Error fetching stats:', error);
          return;
        }

        setStats({ totalApplications: count || 0 });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    
    const subscription = supabase
      .channel('emails')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'emails' 
      }, async () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (newEmail && !validateEmailFormat(newEmail)) {
      setEmailError(t.invalidEmail);
    } else {
      setEmailError('');
    }
  };

  const handleEmailSubmit = async (): Promise<void> => {
    if (!email) return;
    
    if (!validateEmailFormat(email)) {
      setEmailError(t.invalidEmail);
      return;
    }

    setIsLoading(true);
    console.log('Submitting email:', email);
    
    try {
      const { data, error } = await supabase
        .from('emails')
        .insert([{ email, created_at: new Date().toISOString() }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Successfully stored email:', data);
      setEmails(prev => [...prev, { email, timestamp: Date.now() }]);
      setIsSubmitted(true);
      setEmail('');
      setEmailError('');
    } catch (error) {
      console.error('Error details:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const features: Feature[] = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t.aiEditing,
      description: t.aiEditingDesc
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: t.uploadTrain,
      description: t.uploadTrainDesc
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t.lightningFast,
      description: t.lightningFastDesc
    }
  ];

  const TimerBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-2 md:p-4 w-[60px] md:w-[80px] aspect-square flex items-center justify-center border border-white/10">
        <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent tabular-nums">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="text-xs md:text-sm text-white/60 mt-1 md:mt-2 text-center">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 opacity-60">
        {/* Main lights */}
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-white/70 to-yellow-50/40 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-gradient-to-br from-white/70 to-yellow-50/40 rounded-full filter blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-white/60 to-yellow-50/30 rounded-full filter blur-3xl animate-float"></div>
        
        {/* Decorative shapes */}
        <div className="absolute top-20 left-[20%] w-24 h-24 border-3 border-white/70 rounded-full animate-spin-slow"></div>
        <div className="absolute top-40 right-[15%] w-32 h-32 border-3 border-white/60 rounded-full animate-reverse-spin"></div>
        <div className="absolute bottom-32 left-[35%] w-40 h-40 border-3 border-white/50 rounded-full animate-spin-slow"></div>
        
        {/* Small floating lights */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white/60 rounded-full filter blur-2xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-white/60 rounded-full filter blur-2xl animate-float-delay"></div>
        <div className="absolute top-2/3 right-1/4 w-40 h-40 bg-gradient-to-br from-white/60 to-yellow-50/30 rounded-full filter blur-2xl animate-pulse-slow"></div>
        
        {/* Subtle dots */}
        <div className="absolute top-[30%] right-[25%] w-4 h-4 bg-white/80 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-[40%] left-[20%] w-4 h-4 bg-white/70 rounded-full animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[70%] right-[30%] w-4 h-4 bg-white/90 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-[20%] left-[35%] w-4 h-4 bg-white/80 rounded-full animate-pulse-slow delay-700"></div>
        
        {/* Large subtle rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-3 border-white/30 rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-3 border-white/30 rounded-full animate-float delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg md:text-xl font-bold">{t.runvex}</span>
          </div>
          <div className="flex items-center space-x-3 md:space-x-8">
                         <div className="hidden md:flex space-x-8 text-white/70">
               <a href="#features" className="hover:text-white transition-colors">{t.features}</a>
               <a href="#demo" className="hover:text-white transition-colors">{t.demo}</a>
               <a href="https://instagram.com/runvex.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{lang === 'ru' ? 'Связь' : 'Contact'}</a>
             </div>
            {/* Mobile Navigation */}
            <div className="flex md:hidden space-x-4 text-white/70 text-sm">
              <a href="#features" className="hover:text-white transition-colors">{t.features}</a>
              <a href="#demo" className="hover:text-white transition-colors">{t.demo}</a>
            </div>
            {/* Language Selector */}
            <div className="flex items-center space-x-1">
              <button
                className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all ${
                  lang === 'en' 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                onClick={() => handleLanguageChange('en')}
                type="button"
              >
                EN
              </button>
              <button
                className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md md:rounded-lg text-xs md:text-sm font-medium transition-all ${
                  lang === 'ru' 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
                onClick={() => handleLanguageChange('ru')}
                type="button"
              >
                RU
              </button>
            </div>
          </div>
        </div>
      </nav>



      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10">
            <Star className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80">{t.nowInBeta}</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white via-white/90 to-yellow-50/80 bg-clip-text text-transparent text-center">
            <div className="mb-2 sm:mb-0">
              {t.createVideos}
            </div>
            <div className="flex justify-center items-center min-h-[1.2em]">
              <span className="bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {displayedText}
              </span>
              <span className="typewriter-cursor text-white/80 ml-0.5 sm:ml-1 text-lg sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl">|</span>
            </div>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 mb-6 sm:mb-8 md:mb-12 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 md:px-0 text-center">
            {t.heroDesc}
          </p>

          {/* Email Signup */}
          <div className="max-w-md mx-auto mb-16">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t.emailPlaceholder}
                  className={`w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-md ${
                    emailError ? 'border-red-500' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/40`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {emailError}
                  </p>
                )}
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || !email || !!emailError}
                className="bg-white text-black px-6 md:px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t.joined}</span>
                  </>
                ) : (
                  <>
                    <span>{t.joinWaitlist}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            {isSubmitted && (
              <p className="text-green-400 text-sm mt-2 animate-fade-in">
                {t.thanks}
              </p>
            )}
          </div>

          {/* Stats and Timer Section */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Applications Counter */}
              <div className="min-h-[180px] bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col items-center justify-center border border-white/10">
                <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent tabular-nums">{stats.totalApplications.toLocaleString()}</div>
                <div className="text-lg md:text-xl text-white/80">{t.earlyAccessMembers}</div>
                <div className="text-sm text-white/60 mt-2">{t.joinThemNow}</div>
              </div>

              {/* Countdown Timer */}
              <div className="min-h-[180px] bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-8 flex flex-col items-center justify-center border border-white/10">
                <h3 className="text-lg md:text-2xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent leading-tight">{t.earlyAccessCloses}</h3>
                <div className="grid grid-cols-4 gap-1 md:flex md:justify-center md:items-center md:space-x-4 md:gap-0">
                  <TimerBlock value={timeLeft.days} label={t.days} />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.hours} label={t.hours} />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.minutes} label={t.minutes} />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.seconds} label={t.seconds} />
                </div>
                <p className="text-center text-white/60 mt-4 md:mt-6 text-sm md:text-base px-2">
                  {t.dontMiss}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{t.seeItInAction}</h2>
            <div className="aspect-video bg-white/5 backdrop-blur-md rounded-xl overflow-hidden">
              <video
              autoPlay
              muted
              
              loop
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                
              >
                <source src="/videos/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
              {t.poweredByAI}
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              {t.poweredByAIDesc}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white/90">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">{t.howItWorks}</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Upload className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">{t.step1}</h3>
              <p className="text-white/70">{t.step1Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">{t.step2}</h3>
              <p className="text-white/70">{t.step2Desc}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Zap className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">{t.step3}</h3>
              <p className="text-white/70">{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            {t.readyToTransform}
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-12">
            {t.joinThousands}
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t.emailPlaceholder}
                  className={`w-full pl-10 pr-4 py-4 bg-white/5 backdrop-blur-md ${
                    emailError ? 'border-red-500' : 'border-white/10'
                  } rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/40`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {emailError}
                  </p>
                )}
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={isLoading || !email || !!emailError}
                className="bg-white text-black px-6 md:px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{t.getEarlyAccess}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 md:px-6 py-8 md:py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg md:text-xl font-bold">{t.runvex}</span>
            </div>
            <div className="flex space-x-8 text-white/60">
              <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.terms}</a>
              <a href="#" className="hover:text-white transition-colors">{t.contact}</a>
            </div>
          </div>
                     <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
             <p className="text-white/60 text-sm md:text-base">&copy; 2025 {t.runvex}. {t.allRights}</p>
             <div className="flex items-center space-x-6 mt-4 md:mt-0">
               <a 
                 href="https://instagram.com/runvex.ai" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-white/60 hover:text-white transition-colors"
               >
                 <Instagram className="w-5 h-5" />
               </a>
             </div>
           </div>
           
           {/* Baked by nfactrial */}
           <div className="mt-6 text-center">
             <p className="text-white/40 text-xs">
               baked by nfactorial
             </p>
           </div>
        </div>
      </footer>
      <Analytics />
    </div>
  );
};

export default App;