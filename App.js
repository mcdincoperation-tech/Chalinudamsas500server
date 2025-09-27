import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Gift, Music, Star, Cake, ArrowRight, User, Calendar, Smile } from 'lucide-react';
import './App.css';

const App = () => {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, name, age, date, loading, surprise
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    date: ''
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Loading simulation
  useEffect(() => {
    if (currentStep === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setCurrentStep('surprise');
              setShowConfetti(true);
              playBirthdayMusic();
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const playBirthdayMusic = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const playNote = (frequency, startTime, duration = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      // Happy Birthday melody (simplified)
      const notes = [
        { freq: 261.63, time: 0 }, // C
        { freq: 261.63, time: 0.3 }, // C
        { freq: 293.66, time: 0.6 }, // D
        { freq: 261.63, time: 0.9 }, // C
        { freq: 349.23, time: 1.2 }, // F
        { freq: 329.63, time: 1.5 }, // E
      ];

      const currentTime = audioContext.currentTime;
      notes.forEach(note => {
        playNote(note.freq, currentTime + note.time);
      });
    } catch (error) {
      console.log('Audio not available');
    }
  };

  const nextStep = (value = null) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentStep === 'welcome') {
        setCurrentStep('name');
      } else if (currentStep === 'name' && value) {
        setFormData(prev => ({ ...prev, name: value }));
        setCurrentStep('age');
      } else if (currentStep === 'age' && value) {
        setFormData(prev => ({ ...prev, age: value }));
        setCurrentStep('date');
      } else if (currentStep === 'date' && value) {
        setFormData(prev => ({ ...prev, date: value }));
        setCurrentStep('loading');
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleInputSubmit = (value) => {
    if (value.trim()) {
      nextStep(value);
    }
  };

  // Confetti animation component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => (
      <div
        key={i}
        className={`confetti-piece`}
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}
      >
        {Math.random() > 0.5 ? '🎉' : '🎊'}
      </div>
    ));
    
    return (
      <div className="confetti-container">
        {confettiPieces}
      </div>
    );
  };

  const StepIndicator = () => {
    const steps = ['welcome', 'name', 'age', 'date', 'loading'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div key={step} className="step-item">
            <div 
              className={`step-dot ${index <= currentIndex ? 'active' : ''}`}
            />
            {index < steps.length - 1 && (
              <div 
                className={`step-line ${index < currentIndex ? 'active' : ''}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  // Welcome Step
  if (currentStep === 'welcome') {
    return (
      <div className="app-container">
        <div className={`card ${isAnimating ? 'animating' : ''}`}>
          <StepIndicator />
          
          <div className="content-center">
            <div className="icon-container pulse">
              <Heart className="icon-large" />
            </div>
            <h1 className="title-large">Birthday Surprise! 🎉</h1>
            <p className="subtitle">
              Let's create something magical for you today!
            </p>
            
            <button
              onClick={() => nextStep()}
              className="btn-primary"
            >
              <span className="btn-content">
                Let's Begin
                <ArrowRight className="icon-small" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Name Step
  if (currentStep === 'name') {
    return (
      <div className="app-container">
        <div className={`card ${isAnimating ? 'animating' : ''}`}>
          <StepIndicator />
          
          <div className="content-center">
            <div className="icon-container">
              <User className="icon-medium" />
            </div>
            <h2 className="title-medium">Nice to meet you! 👋</h2>
            <p className="subtitle">What's your beautiful name?</p>
          </div>

          <div className="input-section">
            <input
              type="text"
              placeholder="Enter your name here..."
              className="input-field"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleInputSubmit(e.target.value);
                }
              }}
              autoFocus
            />
            
            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                if (input.value.trim()) {
                  handleInputSubmit(input.value);
                }
              }}
              className="btn-primary"
            >
              <span className="btn-content">
                Continue
                <ArrowRight className="icon-small" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Age Step
  if (currentStep === 'age') {
    return (
      <div className="app-container">
        <div className={`card ${isAnimating ? 'animating' : ''}`}>
          <StepIndicator />
          
          <div className="content-center">
            <div className="icon-container">
              <Smile className="icon-medium" />
            </div>
            <h2 className="title-medium">Hello, {formData.name}! 🌟</h2>
            <p className="subtitle">How old are you turning?</p>
          </div>

          <div className="input-section">
            <input
              type="number"
              placeholder="Your age..."
              className="input-field"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleInputSubmit(e.target.value);
                }
              }}
              autoFocus
            />
            
            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                if (input.value.trim()) {
                  handleInputSubmit(input.value);
                }
              }}
              className="btn-primary"
            >
              <span className="btn-content">
                Continue
                <ArrowRight className="icon-small" />
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Date Step
  if (currentStep === 'date') {
    return (
      <div className="app-container">
        <div className={`card ${isAnimating ? 'animating' : ''}`}>
          <StepIndicator />
          
          <div className="content-center">
            <div className="icon-container">
              <Calendar className="icon-medium" />
            </div>
            <h2 className="title-medium">Almost there! 🎂</h2>
            <p className="subtitle">When is your special day?</p>
          </div>

          <div className="input-section">
            <input
              type="date"
              className="input-field"
              onChange={(e) => {
                if (e.target.value) {
                  setTimeout(() => handleInputSubmit(e.target.value), 500);
                }
              }}
              autoFocus
            />
            
            <button
              onClick={(e) => {
                const input = e.target.parentElement.querySelector('input');
                if (input.value) {
                  handleInputSubmit(input.value);
                }
              }}
              className="btn-primary"
            >
              <span className="btn-content">
                <Sparkles className="icon-small" />
                Create My Surprise!
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading Step
  if (currentStep === 'loading') {
    return (
      <div className="app-container">
        <div className="loading-content">
          <div className="loading-header">
            <div className="icon-container">
              <Gift className="icon-large spinning" />
            </div>
            <h2 className="title-medium">Preparing Your Surprise...</h2>
            <p className="subtitle">Adding some birthday magic for {formData.name}... ✨</p>
          </div>

          <div className="progress-container">
            <div 
              className="progress-bar"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="progress-text">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  // Surprise Step
  return (
    <div className="app-container surprise-bg">
      {showConfetti && <Confetti />}
      
      {/* Animated background elements */}
      <div className="bg-stars">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            <Star className="star-icon" />
          </div>
        ))}
      </div>

      <div className="card surprise-card">
        <div className="surprise-content">
          <div className="icon-container bounce">
            <Cake className="icon-xl" />
          </div>
          
          <h1 className="title-xl pulse">
            🎉 Happy Birthday, {formData.name}! 🎉
          </h1>
          
          <div className="birthday-info">
            <p>Hi! Welcome back! 🌟</p>
            <p>Celebrating {formData.age} amazing years!</p>
            <p className="date-info">Birthday: {formData.date}</p>
          </div>

          <div className="music-indicator">
            <Music className="icon-small bounce" />
            <span>Birthday music is playing! 🎵</span>
          </div>
        </div>

        <div className="emoji-grid">
          {['🎂', '🎈', '🎁', '🌟', '💝', '🎊'].map((emoji, index) => (
            <div
              key={index}
              className="emoji-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {emoji}
            </div>
          ))}
        </div>

        <div className="birthday-message">
          <p>
            "Today is your special day, {formData.name}! May it be filled with happiness, love, and all your favorite things. 
            You deserve all the joy in the world!" 💕
          </p>
        </div>

        <button
          onClick={() => setShowConfetti(!showConfetti)}
          className="btn-primary"
        >
          <span className="btn-content">
            <Sparkles className="icon-small" />
            More Confetti!
          </span>
        </button>
      </div>
    </div>
  );
};

export default App;