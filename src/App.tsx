import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Upload, Zap, ArrowRight, Star, Instagram, Menu, X } from 'lucide-react';
import { supabase } from './supabase';
import { Analytics } from '@vercel/analytics/react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import CreatePage from './pages/CreatePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import LanguageSelector from './components/LanguageSelector';
import ProtectedRoute from './components/ProtectedRoute';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Feedback {
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

const translations = {
  en: {
    backedBy: 'backed by',
    features: 'Create',
    demo: 'Profile',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    pricing: 'Pricing',
    runvex: 'Runvex',
    nowInBeta: 'Now in Beta - Join the Waitlist',
    createVideos: 'Edit your workout videos',
    likeMagic: '', // Will be filled with animated word
    heroDesc: 'Upload your workout footage, describe what you want, and get a perfectly edited video ready to publish. No editing skills required.',
    joinWaitlist: 'Join Waitlist',
    joined: 'Joined!',
    thanks: "Thanks! We'll notify you when we launch.",
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
    english: 'English',
    russian: 'Русский',
    invalidEmail: 'Please enter a valid email address',
    welcome: 'Welcome',
    signOut: 'Sign Out',
    testimonials: 'What Our Users Say',
    testimonialsDesc: 'Join thousands of fitness creators who trust Runvex for their video editing needs',
    testimonial1: {
      name: 'Alex Johnson',
      role: 'Fitness Coach',
      text: 'Runvex transformed my workout videos from raw footage to viral content in minutes. The AI understands exactly what I want!'
    },
    testimonial2: {
      name: 'Maria Rodriguez',
      role: 'Personal Trainer',
      text: 'I used to spend hours editing my training videos. Now I just upload and describe my vision - Runvex does the rest!'
    },
    testimonial3: {
      name: 'David Chen',
      role: 'Gym Owner',
      text: 'The quality of edits is incredible. My clients love the professional look of my workout videos now.'
    },
    feedback: 'Share Your Feedback',
    feedbackDesc: 'We\'d love to hear from you! Share your thoughts, suggestions, or any questions you might have.',
    namePlaceholder: 'Your name',
    feedbackPlaceholder: 'Tell us what you think about Runvex...',
    sendFeedback: 'Send Feedback',
    nameRequired: 'Please enter your name',
    emailRequired: 'Please enter your email',
    messageRequired: 'Please enter your message',
    feedbackError: 'Failed to send feedback. Please try again.',
    feedbackSuccess: 'Thank you for your feedback!'
  },
  ru: {
    bakedBy: 'разработано',
    features: 'Создание',
    demo: 'Профиль',
    signIn: 'Войти',
    signUp: 'Регистрация',
    pricing: 'Цены',
    runvex: 'Runvex',
    nowInBeta: 'Бета-тестирование — запишитесь в очередь',
    createVideos: 'Монтируйте видео своих тренировок',
    likeMagic: '', // Will be filled with animated word
    heroDesc: 'Загружайте видео тренировок, опишите что хотите получить, и ИИ смонтирует готовый ролик для публикации. Никаких навыков монтажа не нужно.',
    joinWaitlist: 'Записаться',
    joined: 'Записались!',
    thanks: 'Отлично! Напишем, как только запустимся.',
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
    english: 'English',
    russian: 'Русский',
    invalidEmail: 'Введите правильный email',
    welcome: 'Добро пожаловать',
    signOut: 'Выйти',
    testimonials: 'Что говорят наши пользователи',
    testimonialsDesc: 'Тысячи фитнес-блогеров доверяют Runvex для монтажа своих видео',
    testimonial1: {
      name: 'Алексей Иванов',
      role: 'Фитнес-тренер',
      text: 'Runvex превращает мои тренировки из сырого материала в вирусный контент за минуты. ИИ точно понимает, что я хочу!'
    },
    testimonial2: {
      name: 'Мария Петрова',
      role: 'Персональный тренер',
      text: 'Раньше я тратила часы на монтаж видео тренировок. Теперь просто загружаю и описываю идею - Runvex делает всё остальное!'
    },
    testimonial3: {
      name: 'Дмитрий Сидоров',
      role: 'Владелец спортзала',
      text: 'Качество монтажа невероятное. Моим клиентам нравится профессиональный вид моих видео тренировок.'
    },
    feedback: 'Поделитесь отзывом',
    feedbackDesc: 'Нам важно ваше мнение! Расскажите о своих впечатлениях, предложениях или задайте вопросы.',
    namePlaceholder: 'Ваше имя',
    feedbackPlaceholder: 'Расскажите, что вы думаете о Runvex...',
    sendFeedback: 'Отправить отзыв',
    nameRequired: 'Пожалуйста, введите ваше имя',
    emailRequired: 'Пожалуйста, введите ваш email',
    messageRequired: 'Пожалуйста, введите ваше сообщение',
    feedbackError: 'Не удалось отправить отзыв. Попробуйте еще раз.',
    feedbackSuccess: 'Спасибо за ваш отзыв!'
  }
};



const App: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState<Feedback>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
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

  // Test Supabase connection and table structure on mount
  useEffect(() => {
    const testSupabaseConnection = async () => {
      try {
        console.log('🔍 Testing Supabase connection...');
        console.log('🔧 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        console.log('🔑 Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
        
        // Test basic connection
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .limit(1);
        
        if (error) {
          console.error('❌ Supabase connection test failed:', error);
          console.log('📋 Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          
          if (error.code === '42501') {
            console.log('🚨 RLS (Row Level Security) is blocking access!');
            console.log('💡 Solutions:');
            console.log('1. Go to Supabase Dashboard → Table Editor → feedback → RLS');
            console.log('2. Turn OFF RLS for this table, OR');
            console.log('3. Create a policy: New Policy → Create from scratch');
            console.log('   - Name: "Enable insert for feedback"');
            console.log('   - Target roles: anon, authenticated');
            console.log('   - Using expression: true');
            console.log('   - Operation: INSERT');
          }
          
          // Try to check if table exists by trying different table names
          console.log('🔍 Checking for alternative table names...');
          const possibleTables = ['feedbacks', 'user_feedback', 'reviews', 'comments'];
          
          for (const tableName of possibleTables) {
            try {
              const { error: tableError } = await supabase
                .from(tableName)
                .select('*')
                .limit(0);
              
              if (!tableError) {
                console.log(`✅ Found table: ${tableName}`);
              }
            } catch (e) {
              console.log(`❌ Table ${tableName} not found`);
            }
          }
        } else {
          console.log('✅ Supabase connection successful!');
          console.log('📊 Table structure check:', {
            hasData: data && data.length > 0,
            sampleData: data?.[0] || 'No data yet'
          });
        }
        
        // Try to get table info
        console.log('📋 Attempting to get table information...');
        const { error: tableError } = await supabase
          .from('feedback')
          .select('*')
          .limit(0);
        
        if (tableError) {
          console.error('❌ Table structure error:', tableError);
        } else {
          console.log('✅ Table structure looks good!');
        }
        
      } catch (error) {
        console.error('❌ Supabase connection error:', error);
      }
    };

    testSupabaseConnection();
  }, []);



  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleFeedbackChange = (field: keyof Feedback, value: string) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
    setFeedbackError('');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!feedbackForm.name.trim()) {
      setFeedbackError(t.nameRequired);
      return;
    }
    
    if (!feedbackForm.email.trim()) {
      setFeedbackError(t.emailRequired);
      return;
    }
    
    if (!validateEmailFormat(feedbackForm.email)) {
      setFeedbackError(t.invalidEmail);
      return;
    }
    
    if (!feedbackForm.message.trim()) {
      setFeedbackError(t.messageRequired);
      return;
    }

    setIsSubmittingFeedback(true);
    setFeedbackError('');
    
    try {
      console.log('📤 Attempting to submit feedback to Supabase...');
      const feedbackData = {
        name: feedbackForm.name.trim(),
        email: feedbackForm.email.trim(),
        message: feedbackForm.message.trim()
      };
      console.log('📋 Feedback data:', feedbackData);
      
      // Try different approaches
      let data, error;
      
      // Approach 1: Direct insert
      console.log('🔄 Trying direct insert...');
      const result = await supabase
        .from('feedback')
        .insert([feedbackData])
        .select();

      data = result.data;
      error = result.error;

      if (error && error.code === '42501') {
        console.log('🚨 RLS blocking access, trying alternative approach...');
        
        // Approach 2: Try without select
        console.log('🔄 Trying insert without select...');
        const result2 = await supabase
          .from('feedback')
          .insert([feedbackData]);

        if (result2.error) {
          console.error('❌ Alternative approach also failed:', result2.error);
          throw result2.error;
        } else {
          console.log('✅ Insert successful without select');
          data = [{ id: 'success' }]; // Mock data for success
        }
      } else if (error) {
        console.error('❌ Supabase error:', error);
        console.log('📋 Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('✅ Successfully stored feedback:', data);
      setFeedbackSubmitted(true);
      setFeedbackForm({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setFeedbackSubmitted(false), 3000);
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
      setFeedbackError(t.feedbackError);
    } finally {
      setIsSubmittingFeedback(false);
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



  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore body scroll when menu is closed
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={
          <div className="min-h-screen bg-black text-white overflow-hidden font-inter">
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
                {/* Logo */}
                <div className="flex items-center space-x-2 slide-in-left">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-lg md:text-xl font-bold">{t.runvex}</span>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 text-white/70 slide-in-right">
                  <Link to="/create" className="hover:text-white transition-colors animated-button">{t.features}</Link>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-white/60">{t.welcome}, {user?.username}</span>
                      <button
                        onClick={handleLogout}
                        className="hover:text-white transition-colors animated-button"
                      >
                        {t.signOut}
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login" className="hover:text-white transition-colors animated-button">{t.signIn}</Link>
                      <Link to="/signup" className="hover:text-white transition-colors animated-button">{t.signUp}</Link>
                    </>
                  )}
                  <a href="https://instagram.com/runvex.ai" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors animated-button">{t.contact}</a>
                  <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-3 slide-in-right">
                  <LanguageSelector currentLang={lang} onLanguageChange={handleLanguageChange} />
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white/70 hover:text-white transition-colors animated-button p-2"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </nav>



            {/* Hero Section */}
            <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
              <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10 fade-in">
                  <Star className="w-4 h-4 text-white/80" />
                  <span className="text-sm text-white/80">{t.nowInBeta}</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight bg-gradient-to-r from-white via-white/90 to-yellow-50/80 bg-clip-text text-transparent text-center slide-in-up">
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
                    <div key={index} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all animated-card">
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

            {/* Feedback Form Section */}
            <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent slide-in-up">
                  {t.feedback}
                </h2>
                <p className="text-lg md:text-xl text-white/70 mb-12 slide-in-up">
                  {t.feedbackDesc}
                </p>
                
                <div className="max-w-2xl mx-auto slide-in-up">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={feedbackForm.name}
                        onChange={(e) => handleFeedbackChange('name', e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/40 animated-input"
                      />
                      <input
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) => handleFeedbackChange('email', e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/40 animated-input"
                      />
                    </div>
                    <textarea
                      value={feedbackForm.message}
                      onChange={(e) => handleFeedbackChange('message', e.target.value)}
                      placeholder={t.feedbackPlaceholder}
                      rows={4}
                      className="w-full px-6 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg focus:outline-none focus:border-white/30 transition-colors text-white placeholder-white/40 animated-input resize-none"
                    />
                    
                    {/* Error message */}
                    {feedbackError && (
                      <div className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg p-3 shake">
                        {feedbackError}
                        {feedbackError.includes('42501') && (
                          <div className="mt-2 text-xs text-red-300">
                            <p>💡 Для исправления:</p>
                            <p>1. Перейдите в Supabase Dashboard</p>
                            <p>2. Table Editor → feedback → RLS</p>
                            <p>3. Отключите RLS или создайте политику</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Success message */}
                    {feedbackSubmitted && (
                      <div className="text-green-400 text-sm text-center bg-green-400/10 border border-green-400/20 rounded-lg p-3 bounce-in">
                        {t.feedbackSuccess}
                      </div>
                    )}
                    
                    <div className="text-center">
                      <button 
                        type="submit"
                        disabled={isSubmittingFeedback}
                        className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 animated-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingFeedback ? (
                          <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>{t.sendFeedback}</span>
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-4 md:px-6 py-8 md:py-12 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0 slide-in-left">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Play className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-lg md:text-xl font-bold">{t.runvex}</span>
                  </div>
                  <div className="flex space-x-8 text-white/60 slide-in-right">
                    <a href="#" className="hover:text-white transition-colors animated-button">{t.privacy}</a>
                    <a href="#" className="hover:text-white transition-colors animated-button">{t.terms}</a>
                    <a href="#" className="hover:text-white transition-colors animated-button">{t.contact}</a>
                  </div>
                </div>
                             <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-white/60 text-sm md:text-base">&copy; 2025 {t.runvex}. {t.allRights}</p>
                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                      <a 
                        href="https://instagram.com/runvex.ai" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-white/60 hover:text-white transition-colors animated-button"
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
            </div>
          } />
      </Routes>
      
      {/* Mobile Menu - Moved to the very end to ensure it's on top */}
      {isMobileMenuOpen && (
        <div className="md:hidden mobile-menu-container">
          <div className="mobile-menu-content flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex justify-between items-center px-4 py-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-black" />
                </div>
                <span className="text-lg font-bold">{t.runvex}</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-2 animated-button hover:bg-white/10 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Menu items */}
            <div className="flex-1 px-4 py-6 space-y-6">
              <Link 
                to="/create" 
                className="block text-white/70 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 transform hover:translate-x-2 animated-button"
                onClick={closeMobileMenu}
              >
                {t.features}
              </Link>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="text-white/60 py-3 px-4 bg-white/5 rounded-lg">
                    {t.welcome}, {user?.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block text-white/70 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 w-full text-left transform hover:translate-x-2 animated-button"
                  >
                    {t.signOut}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Link 
                    to="/login" 
                    className="block text-white/70 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 transform hover:translate-x-2 animated-button"
                    onClick={closeMobileMenu}
                  >
                    {t.signIn}
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block text-white/70 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 transform hover:translate-x-2 animated-button"
                    onClick={closeMobileMenu}
                  >
                    {t.signUp}
                  </Link>
                </div>
              )}
              <a 
                href="https://instagram.com/runvex.ai" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block text-white/70 hover:text-white transition-all duration-300 py-3 px-4 rounded-lg hover:bg-white/10 transform hover:translate-x-2 animated-button"
                onClick={closeMobileMenu}
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      )}
      
      <Analytics />
    </>
  );
};

export default App;
