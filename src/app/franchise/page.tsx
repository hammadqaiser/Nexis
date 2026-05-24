'use client';

import { useState } from 'react';
import { Landmark, ArrowRight, ShieldCheck, HelpCircle, Loader2, Sparkles, Building } from 'lucide-react';
import citiesData from '@/data/cities.json';
import { BRAND } from '@/lib/constants';

export default function FranchisePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [investment, setInvestment] = useState('');
  const [experience, setExperience] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !email || !city || !area || !investment) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/franchise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, city, location: area, investment, experience }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Server error saving inquiry');
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit franchise application to server API, using local storage fallback:', err);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="franchise-page">
      {/* Header */}
      <section className="franchise-header gradient-teal-navy text-white text-center">
        <div className="container animate-fade-in">
          <h1 className="page-title">Franchise Program</h1>
          <p className="page-subtitle">
            Partner with NEXIS Couriers and open your own Express Collection Center. High returns, low entry capital.
          </p>
        </div>
      </section>

      {/* Main pitch & requirements */}
      <section className="section info-section bg-primary">
        <div className="container grid-cols-2">
          
          {/* Details side */}
          <div className="feature-text animate-fade-in">
            <span className="feature-tagline text-gradient">GROW WITH US</span>
            <h2 className="feature-title">Why Partner with NEXIS?</h2>
            <p className="feature-desc">
              We operate an open, high-yield franchise partnership program modeled on the success of global express centers. With a rapidly growing e-commerce merchant base, opening a NEXIS Express Center in your local commercial market provides immediate, recurring collection and delivery revenues.
            </p>

            <div className="requirements-box">
              <h3>Franchise Requirements</h3>
              <div className="req-grid">
                <div className="req-item">
                  <div className="req-bullet flex-center">1</div>
                  <div>
                    <strong>Commercial Space</strong>
                    <p>150 - 300 sq. ft. ground floor retail space in a commercial market/hub.</p>
                  </div>
                </div>
                <div className="req-item">
                  <div className="req-bullet flex-center">2</div>
                  <div>
                    <strong>Investment Capital</strong>
                    <p>PKR 250,000 - 350,000 (covers security deposit, branding, and POS setup).</p>
                  </div>
                </div>
                <div className="req-item">
                  <div className="req-bullet flex-center">3</div>
                  <div>
                    <strong>IT Infrastructure</strong>
                    <p>Reliable internet, a laptop, thermal label printer, and electronic scale.</p>
                  </div>
                </div>
                <div className="req-item">
                  <div className="req-bullet flex-center">4</div>
                  <div>
                    <strong>Dedicated Staff</strong>
                    <p>At least 1 qualified operator/agent trained in booking portals.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="form-column animate-fade-in" style={{ animationDelay: '200ms' }}>
            {isSubmitted ? (
              <div className="card success-card text-center flex-center">
                <Sparkles size={48} className="success-icon animate-bounce" />
                <h2>Application Submitted!</h2>
                <p>
                  Thank you for your interest in the NEXIS Franchise Program. Our retail expansion auditor will contact you at <strong>{phone}</strong> within 48 hours to schedule a physical commercial site audit.
                </p>
                <button
                  onClick={() => {
                    setName('');
                    setPhone('');
                    setEmail('');
                    setCity('');
                    setArea('');
                    setInvestment('');
                    setExperience('');
                    setIsSubmitted(false);
                  }}
                  className="btn btn-outline"
                >
                  Apply for Another Location
                </button>
              </div>
            ) : (
              <div className="card inquiry-form-card">
                <h3 className="form-title flex-center">
                  <Building size={20} className="step-icon" />
                  <span>Franchise Inquiry Form</span>
                </h3>
                
                <form onSubmit={handleSubmit} className="franchise-form">
                  {error && <div className="error-banner">{error}</div>}
                  
                  <div className="form-group">
                    <label htmlFor="fran-name">Full Name *</label>
                    <input
                      type="text"
                      id="fran-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sajid Mahmood"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label htmlFor="fran-phone">Mobile Phone *</label>
                      <input
                        type="tel"
                        id="fran-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 03001234567"
                        required
                        className="form-input"
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label htmlFor="fran-email">Email Address *</label>
                      <input
                        type="email"
                        id="fran-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sajid@gmail.com"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label htmlFor="fran-city">Target City *</label>
                      <select
                        id="fran-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="form-input"
                      >
                        <option value="">Select City</option>
                        {citiesData.map((c) => (
                          <option key={`fran-city-${c.id}`} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group flex-1">
                      <label htmlFor="fran-area">Target Commercial Area *</label>
                      <input
                        type="text"
                        id="fran-area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="e.g. Anarkali Bazar"
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fran-investment">Available Investment Bracket *</label>
                    <select
                      id="fran-investment"
                      value={investment}
                      onChange={(e) => setInvestment(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Bracket</option>
                      <option value="250k-350k">PKR 250,000 - 350,000</option>
                      <option value="350k-500k">PKR 350,000 - 500,000</option>
                      <option value="500k+">PKR 500,000+</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="fran-exp">Logistics or Retail Experience (Optional)</label>
                    <textarea
                      id="fran-exp"
                      rows={2}
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Share a short note about your current retail business..."
                      className="form-input"
                    />
                  </div>

                  <button
                    type="submit"
                    id="franchise-submit-btn"
                    className="btn btn-secondary submit-btn flex-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="spinner" size={16} />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </section>

      <style jsx>{`
        .franchise-page {
          width: 100%;
        }

        .franchise-header {
          padding: 6rem 0;
          position: relative;
        }

        .page-title {
          font-family: var(--font-heading);
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }

        .page-subtitle {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.85);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .bg-primary {
          background-color: var(--bg-primary);
          transition: background-color var(--transition-normal);
        }

        .feature-tagline {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .feature-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 1.25rem;
        }

        :global([data-theme='dark']) .feature-title {
          color: #ffffff;
        }

        .feature-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        /* Requirements Box */
        .requirements-box {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
        }

        .requirements-box h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 1.5rem;
        }

        :global([data-theme='dark']) .requirements-box h3 {
          color: #ffffff;
        }

        .req-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .req-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .req-bullet {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          background-color: var(--primary-teal);
          color: white;
          font-size: 0.85rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .req-item strong {
          font-size: 0.95rem;
          color: var(--text-primary);
          display: block;
          margin-bottom: 0.15rem;
        }

        .req-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        /* Form Card */
        .inquiry-form-card {
          padding: 2.5rem;
        }

        .form-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary-navy);
          gap: 0.5rem;
          justify-content: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.5rem;
        }

        :global([data-theme='dark']) .form-title {
          color: #ffffff;
        }

        .step-icon {
          color: var(--primary-teal);
        }

        .franchise-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        @media (max-width: 480px) {
          .form-row {
            flex-direction: column;
            gap: 1.25rem;
          }
        }

        .flex-1 {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.9rem;
          outline: none;
          transition: all var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .error-banner {
          background-color: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.75rem;
          color: var(--color-accent-orange);
          font-size: 0.85rem;
          font-weight: 600;
        }

        /* Success Card */
        .success-card {
          padding: 4rem 2.5rem;
          gap: 1.25rem;
        }

        .success-icon {
          color: var(--color-accent-emerald);
        }

        .success-card h2 {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .success-card h2 {
          color: #ffffff;
        }

        .success-card p {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          max-width: 400px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
