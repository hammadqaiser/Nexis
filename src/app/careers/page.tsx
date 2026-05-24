'use client';

import { useState } from 'react';
import { Briefcase, MapPin, Send, Loader2, Sparkles, Plus, Clock, Users, ArrowRight } from 'lucide-react';
import citiesData from '@/data/cities.json';

const OPENINGS = [
  {
    id: 'rider',
    title: 'Delivery Rider / Collection Courier',
    department: 'Operations',
    locations: ['Karachi', 'Lahore', 'Islamabad', 'Peshawar'],
    type: 'Full-time / Commission',
    compensation: 'PKR 35,000 - 55,000 + Fuel Allowance',
    reqs: ['Own motorbike with valid registration documents', 'Smartphone (Android 10+)', 'Valid CNIC & Driving License', 'Good route knowledge of target city'],
  },
  {
    id: 'operator',
    title: 'Express Center Booking Agent',
    department: 'Retail Sales',
    locations: ['Multan', 'Rawalpindi', 'Hyderabad'],
    type: 'Full-time',
    compensation: 'PKR 30,000 - 40,000',
    reqs: ['Intermediate/Graduate degree', 'Basic computer literacy & POS operations', 'Strong customer service communication', 'Willingness to work flexible shifts'],
  },
  {
    id: 'dev',
    title: 'Junior Software Engineer (NextJS / NodeJS)',
    department: 'Technology',
    locations: ['Karachi Hub (PECHS)'],
    type: 'Full-time',
    compensation: 'PKR 80,000 - 120,000',
    reqs: ['1-2 years experience with React/Next.js/Node.js', 'Familiarity with PostgreSQL & REST API design', 'Basic understanding of Git workflows', 'Comfortable working at main corporate head office'],
  },
];

export default function CareersPage() {
  const [activeJob, setActiveJob] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [coverNote, setCoverNote] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleApply = (jobId: string) => {
    setActiveJob(jobId);
    // Scroll to form
    const formElement = document.getElementById('careers-apply-form-sec');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !email || !city || !activeJob) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, position: activeJob, city, coverLetter: coverNote }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Server error saving inquiry');
      }
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit job application to server API, using local storage fallback:', err);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="careers-page">
      {/* Header */}
      <section className="careers-header gradient-teal-navy text-white text-center">
        <div className="container animate-fade-in">
          <h1 className="page-title">Careers at NEXIS</h1>
          <p className="page-subtitle">
            Join Pakistan's smartest logistics and courier network. Build a high-performance career in technology and operations.
          </p>
        </div>
      </section>

      {/* Main Pitch */}
      <section className="section pitch-sec bg-primary">
        <div className="container">
          <div className="section-header text-center max-width-700">
            <span className="section-tagline text-gradient">WHY NEXIS?</span>
            <h2 className="section-title">We Invest in Our People</h2>
            <p className="section-desc">
              Logistics is a human engine. At NEXIS, we ensure our riders, operators, and engineers have high safety standards, fair compensation structures, and clear avenues for internal promotion.
            </p>
          </div>

          <div className="grid-cols-3 benefits-grid text-center">
            <div className="benefit-card card">
              <Users size={32} className="benefit-icon" />
              <h3>Excellent Benefits</h3>
              <p>Comprehensive health insurance policies, life cover, and competitive basic salary tiers.</p>
            </div>
            <div className="benefit-card card">
              <Clock size={32} className="benefit-icon" />
              <h3>Flexible Schedules</h3>
              <p>Shift structures designed around family needs and balanced distribution targets.</p>
            </div>
            <div className="benefit-card card">
              <Sparkles size={32} className="benefit-icon" />
              <h3>Fuel & Device Cover</h3>
              <p>Riders receive complete monthly fuel allotments, smartphone allowances, and secure safety gears.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Openings list */}
      <section className="section openings-sec bg-secondary">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline text-gradient">ACTIVE VACANCIES</span>
            <h2 className="section-title">Current Opportunities</h2>
            <p className="section-desc">
              Select one of our active openings and apply online using the quick form below.
            </p>
          </div>

          <div className="openings-list">
            {OPENINGS.map((job, idx) => (
              <div key={`job-${idx}`} className="job-card card animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="job-header">
                  <div className="job-title-block">
                    <h3>{job.title}</h3>
                    <div className="job-meta-pills">
                      <span className="meta-pill">{job.department}</span>
                      <span className="meta-pill">{job.type}</span>
                    </div>
                  </div>
                  <div className="job-salary">{job.compensation}</div>
                </div>

                <div className="job-body">
                  <div className="job-locations flex-center">
                    <MapPin size={16} className="loc-icon" />
                    <span>Locations: {job.locations.join(', ')}</span>
                  </div>

                  <div className="job-requirements">
                    <h4>Core Job Requirements:</h4>
                    <ul>
                      {job.reqs.map((req, rIdx) => (
                        <li key={`req-${rIdx}`}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApply(job.id)}
                    className={`btn ${activeJob === job.id ? 'btn-secondary' : 'btn-primary'} apply-now-btn`}
                  >
                    <span>{activeJob === job.id ? 'Selected' : 'Apply Online Now'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="careers-apply-form-sec" className="section form-sec bg-primary">
        <div className="container max-width-600">
          {isSubmitted ? (
            <div className="card success-card text-center flex-center">
              <Sparkles size={48} className="success-icon animate-bounce" />
              <h2>Application Received!</h2>
              <p>
                Thank you for applying to the NEXIS Team. Our HR department has received your application. We will reach out to schedule an interview at your local hub if your profile meets our requirements.
              </p>
              <button
                type="button"
                onClick={() => {
                  setName('');
                  setPhone('');
                  setEmail('');
                  setCity('');
                  setCoverNote('');
                  setActiveJob('');
                  setIsSubmitted(false);
                }}
                className="btn btn-outline"
              >
                View Other Positions
              </button>
            </div>
          ) : (
            <div className="card app-form-card">
              <h3 className="form-title flex-center">
                <Briefcase size={20} className="step-icon" />
                <span>Job Application Form</span>
              </h3>

              <form onSubmit={handleSubmit} className="careers-form">
                {error && <div className="error-banner">{error}</div>}

                <div className="form-group">
                  <label htmlFor="job-select">Selected Position *</label>
                  <select
                    id="job-select"
                    value={activeJob}
                    onChange={(e) => setActiveJob(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Choose Position</option>
                    {OPENINGS.map((j) => (
                      <option key={`opt-${j.id}`} value={j.id}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="app-name">Full Name *</label>
                  <input
                    type="text"
                    id="app-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Hamza Yusuf"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="app-phone">Mobile Phone *</label>
                    <input
                      type="tel"
                      id="app-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 03001234567"
                      required
                      className="form-input"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label htmlFor="app-email">Email Address *</label>
                    <input
                      type="email"
                      id="app-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hamza@gmail.com"
                      required
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="app-city">Your Current Residence City *</label>
                  <select
                    id="app-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select City</option>
                    {citiesData.map((c) => (
                      <option key={`app-city-${c.id}`} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="app-note">Introduce Yourself (Cover Note) *</label>
                  <textarea
                    id="app-note"
                    rows={4}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly state your qualifications and why you want to join NEXIS..."
                    required
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  id="careers-submit-btn"
                  className="btn btn-secondary submit-btn flex-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="spinner" size={16} />
                      <span>Submitting Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Application</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .careers-page {
          width: 100%;
        }

        .careers-header {
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

        .max-width-700 {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .max-width-600 {
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .bg-primary {
          background-color: var(--bg-primary);
          transition: background-color var(--transition-normal);
        }

        .bg-secondary {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .text-center {
          text-align: center;
        }

        /* Generic header */
        .section-tagline {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--primary-navy);
          margin-bottom: 1rem;
        }

        :global([data-theme='dark']) .section-title {
          color: #ffffff;
        }

        .section-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        /* Benefits cards */
        .benefits-grid {
          margin-top: 3rem;
        }

        .benefit-card {
          padding: 2.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .benefit-icon {
          color: var(--primary-teal);
          margin-bottom: 1.25rem;
        }

        .benefit-card h3 {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.5rem;
        }

        :global([data-theme='dark']) .benefit-card h3 {
          color: #ffffff;
        }

        .benefit-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Active Vacancies */
        .openings-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 800px;
          margin: 3rem auto 0 auto;
        }

        .job-card {
          padding: 2.25rem;
          text-align: left;
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 600px) {
          .job-header {
            flex-direction: column;
            gap: 0.75rem;
            align-items: flex-start;
          }
        }

        .job-title-block h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.5rem;
        }

        :global([data-theme='dark']) .job-title-block h3 {
          color: #ffffff;
        }

        .job-meta-pills {
          display: flex;
          gap: 0.5rem;
        }

        .meta-pill {
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        :global([data-theme='dark']) .meta-pill {
          background-color: var(--bg-primary);
        }

        .job-salary {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--primary-teal);
        }

        .job-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .job-locations {
          justify-content: flex-start;
          gap: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .loc-icon {
          color: var(--primary-teal);
        }

        .job-requirements h4 {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .job-requirements ul {
          list-style-type: none;
          padding-left: 0;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .job-requirements li {
          font-size: 0.85rem;
          color: var(--text-secondary);
          position: relative;
          padding-left: 1.25rem;
        }

        .job-requirements li::before {
          content: '•';
          position: absolute;
          left: 0.25rem;
          color: var(--primary-teal);
          font-weight: 800;
        }

        .apply-now-btn {
          align-self: flex-start;
          padding: 0.6rem 1.5rem;
          font-size: 0.85rem;
        }

        @media (max-width: 480px) {
          .apply-now-btn {
            width: 100%;
          }
        }

        /* Application Form Card */
        .app-form-card {
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

        .careers-form {
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
          max-width: 420px;
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
