import './Landing.css';
import { ThemeToggle } from './ThemeToggle';

interface LandingProps {
  onGetStarted: () => void;
}

export const Landing = ({ onGetStarted }: LandingProps) => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="header-container">
          <div className="logo">💰 Expense Tracker</div>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Take Control of Your Finances</h1>
          <p className="hero-subtitle">
            Track your expenses and income effortlessly. Get insights into your spending habits and build better financial habits.
          </p>
          <button className="btn-get-started" onClick={onGetStarted}>
            Get Started
          </button>
        </div>
        <div className="hero-image">
          <div className="hero-graphic">📊</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>Why Choose Expense Tracker?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Easy Tracking</h3>
              <p>Quickly add and categorize your expenses and income with our intuitive interface.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Visual Analytics</h3>
              <p>Get detailed insights with beautiful charts and statistics about your spending patterns.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is encrypted and secure. Only you can access your financial information.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Responsive Design</h3>
              <p>Track your finances on any device - desktop, tablet, or mobile phone.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⏰</div>
              <h3>Real-time Updates</h3>
              <p>See your balance update instantly as you add new transactions.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <h3>Smart Insights</h3>
              <p>Get recommendations to optimize your spending and save more money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="how-container">
          <h2>How It Works</h2>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Account</h3>
              <p>Sign up with your email and create a secure password</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Add Transactions</h3>
              <p>Log your daily expenses and income easily</p>
            </div>

            <div className="step-arrow">→</div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Track & Analyze</h3>
              <p>View detailed reports and analytics about your finances</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Master Your Finances?</h2>
          <p>Join thousands of users who are taking control of their financial future.</p>
          <button className="btn-cta" onClick={onGetStarted}>
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};
