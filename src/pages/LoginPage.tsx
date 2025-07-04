import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import { API_ENDPOINTS } from '../config/api';

interface LoginForm {
  login: string; // Can be either email or username
  password: string;
}

const translations = {
  en: {
    backToHome: 'Back to Home',
    welcomeBack: 'Welcome Back',
    signInToContinue: 'Sign in to your account to continue',
    emailOrUsername: 'Email or Username',
    password: 'Password',
    signIn: 'Sign In',
    noAccount: "Don't have an account? Create one",
    loginFailed: 'Login failed. Please check your credentials.',
    invalidCredentials: 'Invalid email/username or password'
  },
  ru: {
    backToHome: 'Вернуться на главную',
    welcomeBack: 'С возвращением',
    signInToContinue: 'Войдите в свой аккаунт, чтобы продолжить',
    emailOrUsername: 'Email или имя пользователя',
    password: 'Пароль',
    signIn: 'Войти',
    noAccount: 'Нет аккаунта? Создайте',
    loginFailed: 'Ошибка входа. Проверьте данные.',
    invalidCredentials: 'Неверный email/имя пользователя или пароль'
  }
};

const LoginPage: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const { login } = useAuth();
  const t = translations[lang];
  
  const [formData, setFormData] = useState<LoginForm>({
    login: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,  // API accepts either username or email
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || t.loginFailed);
      }
      
      // Use the auth context to login - this is now async
      await login(data.access_token);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/create');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.loginFailed);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-md mx-auto">
        <nav className="mb-6 sm:mb-8 flex items-center justify-between slide-in-left">
          <Link to="/" className="text-white/60 hover:text-white transition-colors flex items-center gap-2 animated-button">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">{t.backToHome}</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 slide-in-right">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              </div>
              <span className="text-base sm:text-lg font-bold">Runvex</span>
            </div>
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
        </nav>

        <div className="text-center mb-6 sm:mb-8 slide-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            {t.welcomeBack}
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            {t.signInToContinue}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 slide-in-up">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.emailOrUsername}</label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.password}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm shake">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base animated-button"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t.signIn
            )}
          </button>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-white/60 hover:text-white text-sm transition-colors animated-button"
            >
              {t.noAccount}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 