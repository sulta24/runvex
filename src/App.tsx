import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Upload, Zap, Mail, CheckCircle, ArrowRight, Star, Instagram } from 'lucide-react';
import { supabase } from './supabase';
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

const getNextFriday = (): Date => {
  const now = new Date();
  const daysUntilFriday = (5 + 7 - now.getDay()) % 7 + 7; // Get next Friday (not this week's)
  const nextFriday = new Date(now);
  nextFriday.setDate(now.getDate() + daysUntilFriday);
  nextFriday.setHours(23, 59, 59, 999);
  return nextFriday;
};

const calculateTimeLeft = (): TimeLeft => {
  const difference = getNextFriday().getTime() - new Date().getTime();
  
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60)
  };
};

const App: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [emails, setEmails] = useState<EmailEntry[]>([]);
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
    
    // Subscribe to realtime changes
    const subscription = supabase
      .channel('emails')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'emails' 
      }, async () => {
        // Refresh the count when there are changes
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
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailSubmit = async (): Promise<void> => {
    if (!email) return;
    
    if (!validateEmailFormat(email)) {
      setEmailError('Please enter a valid email address');
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
      title: "AI-Powered Editing",
      description: "Advanced algorithms analyze your style and automatically create professional edits"
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Upload & Train",
      description: "Upload your videos to train our AI on your unique editing preferences"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Generate video edits in minutes, not hours. Save time and focus on creativity"
    }
  ];

  const TimerBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 md:p-4 w-[70px] md:w-[80px] aspect-square flex items-center justify-center border border-white/10">
        <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
          {value.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="text-xs md:text-sm text-white/60 mt-2">{label}</div>
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
            <span className="text-lg md:text-xl font-bold">Runvex</span>
          </div>
          <div className="flex space-x-8 text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/10">
            <Star className="w-4 h-4 text-white/80" />
            <span className="text-sm text-white/80">Now in Beta - Join the Waitlist</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6 leading-tight bg-gradient-to-r from-white via-white/90 to-yellow-50/80 bg-clip-text text-transparent">
            Create Videos
            <br />
            <span className="bg-gradient-to-r from-white via-yellow-50/90 to-yellow-100/70 bg-clip-text text-transparent">
              Like Magic
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            Upload your training videos and let our AI learn your style. 
            Generate professional video edits automatically, saving hours of manual work.
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
                  placeholder="Enter your email"
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
                    <span>Joined!</span>
                  </>
                ) : (
                  <>
                    <span>Join Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            {isSubmitted && (
              <p className="text-green-400 text-sm mt-2 animate-fade-in">
                Thanks! We'll notify you when we launch.
              </p>
            )}
          </div>

          {/* Stats and Timer Section */}
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Applications Counter */}
              <div className="min-h-[180px] bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col items-center justify-center border border-white/10">
                <div className="text-4xl md:text-5xl font-bold mb-3 text-white tabular-nums">{stats.totalApplications.toLocaleString()}</div>
                <div className="text-lg md:text-xl text-white/80">Early Access Members</div>
                <div className="text-sm text-white/60 mt-2">Join them now!</div>
              </div>

              {/* Countdown Timer */}
              <div className="min-h-[180px] bg-white/5 backdrop-blur-md rounded-xl p-6 md:p-8 flex flex-col items-center justify-center border border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-6 text-white/80">Early Access Closes In</h3>
                <div className="grid grid-cols-4 gap-2 md:flex md:justify-center md:items-center md:space-x-4 md:gap-0">
                  <TimerBlock value={timeLeft.days} label="Days" />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.hours} label="Hours" />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.minutes} label="Minutes" />
                  <div className="hidden md:block text-2xl font-bold text-white/60">:</div>
                  <TimerBlock value={timeLeft.seconds} label="Seconds" />
                </div>
                <p className="text-center text-white/60 mt-6">
                  Don't miss your chance to join
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">See It In Action</h2>
            <div className="aspect-video bg-white/5 backdrop-blur-md rounded-xl overflow-hidden">
              <video
                className="w-full h-full object-cover"
                muted
                autoPlay
                loop
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our cutting-edge technology learns from your content to deliver personalized, 
              professional-grade video edits that match your unique style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white/5 to-yellow-500/5 backdrop-blur-md p-8 rounded-2xl border border-yellow-700/5 hover:bg-gradient-to-br hover:from-white/10 hover:to-yellow-500/10 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-yellow-500/5 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6 text-white">
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Upload className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">1. Upload Training Videos</h3>
              <p className="text-white/70">Upload your best videos to train our AI on your editing style and preferences</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">2. AI Learns Your Style</h3>
              <p className="text-white/70">Our advanced algorithms analyze your content and learn your unique editing patterns</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 backdrop-blur-md rounded-2xl mx-auto mb-6 flex items-center justify-center hover:bg-white/10 transition-all">
                <Zap className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">3. Generate Perfect Edits</h3>
              <p className="text-white/70">Get professional video edits that match your style in minutes, not hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your Video Creation?
          </h2>
          <p className="text-lg md:text-xl text-white/70 mb-12">
            Join thousands of creators who are already saving hours with AI-powered video editing.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
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
                    <span>Get Early Access</span>
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
              <span className="text-lg md:text-xl font-bold">Runvex</span>
            </div>
            <div className="flex space-x-8 text-white/60">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm md:text-base">&copy; 2025 Runvex. All rights reserved.</p>
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
        </div>
      </footer>

      {/* Debug: Show collected emails (remove in production) */}
      {emails.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-gray-900 p-4 rounded-lg border border-gray-800 max-w-sm">
          <h4 className="font-semibold mb-2">Collected Emails ({emails.length})</h4>
          <div className="text-sm text-gray-300 max-h-32 overflow-y-auto">
            {emails.map((entry, i) => (
              <div key={i} className="mb-1">{entry.email}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;