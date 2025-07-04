import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, ArrowLeft, Shield, Lock, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';
import { API_ENDPOINTS } from '../config/api';

interface SignupForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const translations = {
  en: {
    backToHome: 'Back to Home',
    joinRunvex: 'Join Runvex',
    createAccount: 'Create your account to start creating amazing videos',
    secureRegistration: 'Secure Registration',
    encryption: '256-bit encryption for your data',
    emailPrivacy: 'Your email will never be shared',
    noCreditCard: 'No credit card required',
    username: 'Username',
    emailAddress: 'Email Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordStrength: 'Password strength:',
    reenterPassword: 'Re-enter your password',
    createAccountButton: 'Create Account',
    haveAccount: 'Already have an account? Sign in',
    passwordMismatch: 'Passwords do not match',
    weakPassword: 'Password must be at least 8 characters long',
    noUppercase: 'Password must contain at least one uppercase letter',
    noNumber: 'Password must contain at least one number',
    invalidEmail: 'Please enter a valid email address',
    registrationFailed: 'Registration failed. This email might already be registered.',
    termsText: 'By creating an account, you agree to our',
    termsLink: 'Terms of Service',
    privacyText: 'and',
    privacyLink: 'Privacy Policy'
  },
  ru: {
    backToHome: 'Вернуться на главную',
    joinRunvex: 'Присоединиться к Runvex',
    createAccount: 'Создайте аккаунт, чтобы начать создавать удивительные видео',
    secureRegistration: 'Безопасная регистрация',
    encryption: '256-битное шифрование для ваших данных',
    emailPrivacy: 'Ваш email никогда не будет передан третьим лицам',
    noCreditCard: 'Кредитная карта не требуется',
    username: 'Имя пользователя',
    emailAddress: 'Email адрес',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    passwordStrength: 'Надежность пароля:',
    reenterPassword: 'Введите пароль еще раз',
    createAccountButton: 'Создать аккаунт',
    haveAccount: 'Уже есть аккаунт? Войдите',
    passwordMismatch: 'Пароли не совпадают',
    weakPassword: 'Пароль должен содержать минимум 8 символов',
    noUppercase: 'Пароль должен содержать хотя бы одну заглавную букву',
    noNumber: 'Пароль должен содержать хотя бы одну цифру',
    invalidEmail: 'Пожалуйста, введите корректный email',
    registrationFailed: 'Ошибка регистрации. Этот email уже может быть зарегистрирован.',
    termsText: 'Создавая аккаунт, вы соглашаетесь с нашими',
    termsLink: 'Условиями использования',
    privacyText: 'и',
    privacyLink: 'Политикой конфиденциальности'
  }
};

const SignupPage: React.FC = () => {
  const { login } = useAuth();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  
  const [formData, setFormData] = useState<SignupForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.includes('@')) {
      setError(t.invalidEmail);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    if (formData.password.length < 8) {
      setError(t.weakPassword);
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError(t.noUppercase);
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError(t.noNumber);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
              // After successful registration, log in automatically
        const loginResponse = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.username,
          password: formData.password,
        }),
      });
      
      const loginData = await loginResponse.json();
      
      if (!loginResponse.ok) {
        throw new Error(loginData.detail || 'Auto-login failed');
      }
      
      // Use the auth context to login - this is now async
      await login(loginData.access_token);
      
      // Small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      navigate('/create');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t.registrationFailed);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; text: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const texts = ['Weak', 'Fair', 'Good', 'Strong'];
    return { strength, text: texts[strength - 1] || 'Too Weak' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            {t.joinRunvex}
          </h1>
          <p className="text-white/60 text-sm sm:text-base">
            {t.createAccount}
          </p>
        </div>

        {/* Security Features */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-white/10 animated-card slide-in-up">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white/90">{t.secureRegistration}</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {t.encryption}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {t.emailPrivacy}
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {t.noCreditCard}
            </li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 slide-in-up">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.username}</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 sm:px-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.emailAddress}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 sm:pr-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.password}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-3 sm:pr-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
                placeholder="Min. 8 characters"
                required
              />
            </div>
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white/60">{t.passwordStrength}</span>
                  <span className={`text-sm ${
                    passwordStrength.strength >= 3 ? 'text-green-400' :
                    passwordStrength.strength >= 2 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>{passwordStrength.text}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.strength >= 3 ? 'bg-green-400' :
                      passwordStrength.strength >= 2 ? 'bg-yellow-400' :
                      'bg-red-400'
                    }`}
                    style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">{t.confirmPassword}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-3 sm:pr-4 py-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10 text-white focus:outline-none focus:border-white/30 text-sm sm:text-base animated-input"
                placeholder={t.reenterPassword}
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 shake">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black px-4 sm:px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base animated-button"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              t.createAccountButton
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-white/60 hover:text-white text-sm transition-colors animated-button"
            >
              {t.haveAccount}
            </Link>
          </div>

          <p className="text-xs text-white/40 text-center">
            {t.termsText}{' '}
            <a href="#" className="text-white/60 hover:text-white animated-button">{t.termsLink}</a>{' '}
            {t.privacyText}{' '}
            <a href="#" className="text-white/60 hover:text-white animated-button">{t.privacyLink}</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage; 