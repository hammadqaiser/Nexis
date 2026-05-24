'use client';

import { ShieldCheck, Target, Eye, Landmark, Users2, ShieldAlert } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const STATS = [
  { value: '150+', label: 'Nationwide Express Hubs' },
  { value: '200+', label: 'Fleet Delivery Vehicles' },
  { value: '100K+', label: 'Monthly Deliveries' },
  { value: '1,000+', label: 'Dedicated Employees' },
];

const VALUES = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Absolute Trust & Transparency',
    description: 'We believe logistics is built on confidence. Our customers get exact progress updates, clear volumetric invoicing, and absolute safety.',
  },
  {
    icon: <Users2 size={28} />,
    title: 'Conglomerate Strength',
    description: `As a primary subsidary of ${BRAND.parentCompany}, we leverage vast group resources in tech, capital, and infrastructure to build robust pipelines.`,
  },
  {
    icon: <Landmark size={28} />,
    title: 'Innovation & Digital DNA',
    description: 'We lead with digital tools. From programmatic REST APIs and seller portal dashboards to automated COD cash-flows, we streamline operations.',
  },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="about-header gradient-teal-navy text-white text-center">
        <div className="container animate-fade-in">
          <h1 className="page-title">About NEXIS Couriers</h1>
          <p className="page-subtitle">
            Connecting Pakistani communities and commerce with speed, security, and next-generation logistics pipelines.
          </p>
        </div>
      </section>

      {/* Main Pitch */}
      <section className="section pitch-section bg-primary">
        <div className="container grid-cols-2 align-center">
          <div className="feature-text animate-fade-in">
            <span className="feature-tagline text-gradient">OUR ORIGIN STORY</span>
            <h2 className="feature-title">The Connection Network</h2>
            <p className="feature-desc">
              The name <strong>NEXIS</strong> derives from the Latin <em>"Nexus"</em> — representing a connection, link, or network. We were established as a principal brand of <strong>{BRAND.parentCompany}</strong>, a multi-sector Pakistani conglomerate operating across Logistics, Real Estate, and Digital Marketing.
            </p>
            <p className="feature-desc">
              Observing the massive growth of digital commerce in Pakistan, we recognized that existing courier services failed to resolve two core issues: delivery return transparency and rapid cash-flow settlements. We engineered NEXIS to serve as a high-performance logistics pipeline solving these exact digital challenges.
            </p>
          </div>
          <div className="visual-block flex-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="about-branding-card glass text-center">
              <span className="n-logo-badge text-gradient">N</span>
              <h3>NEXIS GROUP</h3>
              <span className="parent-label">Logistics • Real Estate • Tech</span>
              <p>Connecting physical assets with modern software pipelines.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="section stats-banner gradient-teal-navy text-white text-center">
        <div className="container">
          <div className="grid-cols-4 stats-grid">
            {STATS.map((stat, idx) => (
              <div key={`stat-${idx}`} className="stat-card animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section mv-section bg-primary">
        <div className="container grid-cols-2">
          <div className="card mv-card animate-fade-in">
            <div className="icon-box flex-center box-teal">
              <Target size={28} />
            </div>
            <h3>Our Mission</h3>
            <p>
              To deliver superior logistics and courier pipelines across Pakistan by combining rapid transportation assets, advanced NADRA biometric sender security, and bi-weekly automated cash settlements for e-commerce entrepreneurs.
            </p>
          </div>
          <div className="card mv-card animate-fade-in" style={{ animationDelay: '150ms' }}>
            <div className="icon-box flex-center box-navy">
              <Eye size={28} />
            </div>
            <h3>Our Vision</h3>
            <p>
              To become Pakistan's leading smart-logistics network, recognized for absolute operational integrity, technological leadership, e-commerce web hooks, and enabling global exports directly from local manufacturing hubs.
            </p>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section values-section bg-secondary">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline text-gradient">OUR BRAND VALUES</span>
            <h2 className="section-title">The Foundation of Our Business</h2>
            <p className="section-desc">
              We hold ourselves to uncompromising standards, ensuring every customer gets premium care.
            </p>
          </div>

          <div className="grid-cols-3 values-grid">
            {VALUES.map((val, idx) => (
              <div key={`val-${idx}`} className="value-card card animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="value-icon-wrapper flex-center">
                  {val.icon}
                </div>
                <h3 className="value-card-title">{val.title}</h3>
                <p className="value-card-desc">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          width: 100%;
        }

        .about-header {
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

        .align-center {
          align-items: center;
        }

        .bg-primary {
          background-color: var(--bg-primary);
          transition: background-color var(--transition-normal);
        }

        .bg-secondary {
          background-color: var(--bg-secondary);
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
          margin-bottom: 1.25rem;
        }

        /* Brand Visual */
        .about-branding-card {
          width: 100%;
          max-width: 380px;
          padding: 3rem 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
        }

        .n-logo-badge {
          font-family: var(--font-heading);
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          display: block;
          margin-bottom: 1rem;
        }

        .about-branding-card h3 {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.5rem;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .about-branding-card h3 {
          color: #ffffff;
        }

        .parent-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--primary-teal);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 1rem;
        }

        .about-branding-card p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        /* Stats banner */
        .stats-banner {
          padding: 4.5rem 0;
        }

        .stats-grid {
          margin: 0;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 3rem;
          line-height: 1.1;
          margin-bottom: 0.35rem;
        }

        .stat-label {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        /* MV Cards */
        .mv-card {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          margin-bottom: 0.5rem;
        }

        .box-teal {
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-teal);
        }

        .box-navy {
          background-color: rgba(30, 58, 95, 0.1);
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .box-navy {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .mv-card h3 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.35rem;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .mv-card h3 {
          color: #ffffff;
        }

        .mv-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Values Grid */
        .section-header {
          max-width: 700px;
          margin: 0 auto 4rem auto;
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
        }

        .value-card {
          display: flex;
          flex-direction: column;
          padding: 2.5rem 2rem;
        }

        .value-icon-wrapper {
          color: var(--primary-teal);
          margin-bottom: 1.25rem;
          justify-content: flex-start;
          height: 40px;
        }

        .value-card-title {
          font-family: var(--font-heading);
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .value-card-title {
          color: #ffffff;
        }

        .value-card-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
