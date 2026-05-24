'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, RefreshCw, BarChart4, Cpu, FileText, ArrowRight } from 'lucide-react';
import Hero from '@/components/home/Hero';
import ServicesOverview from '@/components/home/ServicesOverview';
import RateWidget from '@/components/home/RateWidget';

const VALUE_PROPS = [
  {
    icon: <ShieldCheck size={24} />,
    title: 'Biometric NADRA Safety',
    description: 'First courier in Pakistan incorporating advanced biometric sender verification, fully secure insurance policies, and strict cargo safety audits.',
  },
  {
    icon: <RefreshCw size={24} />,
    title: 'Fast COD Settlements',
    description: 'We prioritize cash-flow. Digital COD collections are reconciled and settled directly into merchant accounts twice weekly with detailed billing statements.',
  },
  {
    icon: <Zap size={24} />,
    title: 'Unrivaled Air & Land Pipeline',
    description: 'With rapid overland transport fleets and overnight air cargo connections, your express items arrive next-morning without exception.',
  },
];

export default function Home() {
  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Section (Includes TrackingBar) */}
      <Hero />

      {/* 2. Rate Calculator & Fast Stats Feature Section */}
      <section className="section rates-feature-section">
        <div className="container grid-cols-2 align-center">
          <div className="feature-text animate-fade-in">
            <span className="feature-tagline text-gradient">REAL-TIME ESTIMATION</span>
            <h2 className="feature-title">Know Your Shipping Cost Instantly</h2>
            <p className="feature-desc">
              No hidden fees, no complicated charts. Enter your shipment details and calculate your domestic postage immediately. Our system dynamically estimates prices based on weight, destination city, and premium speed categories.
            </p>
            <div className="feature-checkpoints">
              <div className="checkpoint">
                <span className="checkpoint-dot"></span>
                <span>Rates include local sales tax (16% GST)</span>
              </div>
              <div className="checkpoint">
                <span className="checkpoint-dot"></span>
                <span>Special discounted volumetric weight plans for corporate sellers</span>
              </div>
              <div className="checkpoint">
                <span className="checkpoint-dot"></span>
                <span>Doorstep pickup scheduling at no extra cost</span>
              </div>
            </div>
            <Link href="/services#cod" className="btn btn-outline feature-cta">
              <span>COD Corporate Rates</span>
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="feature-widget animate-fade-in" style={{ animationDelay: '200ms' }}>
            <RateWidget />
          </div>
        </div>
      </section>

      {/* 3. Services Grid Section */}
      <ServicesOverview />

      {/* 4. Why Choose NEXIS Value Propositions */}
      <section className="section why-choose-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline text-gradient">NEXIS ADVANTAGE</span>
            <h2 className="section-title">Why E-Commerce & Corporate Partners Choose Us</h2>
            <p className="section-desc">
              We go beyond traditional package delivery. By combining physical cargo pipelines with robust digital interfaces, we offer absolute control over your distribution.
            </p>
          </div>

          <div className="grid-cols-3 values-grid">
            {VALUE_PROPS.map((prop, idx) => (
              <div key={`value-${idx}`} className="value-card animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="value-icon-box flex-center">
                  {prop.icon}
                </div>
                <h3 className="value-title">{prop.title}</h3>
                <p className="value-desc">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. E-commerce API & Integrations Feature Section */}
      <section className="section integrations-section">
        <div className="container grid-cols-2 align-center">
          <div className="integrations-visual flex-center animate-fade-in">
            <div className="api-mock-card glass">
              <div className="card-header-bar flex-center">
                <span className="dot red-dot"></span>
                <span className="dot yellow-dot"></span>
                <span className="dot green-dot"></span>
                <span className="window-title">NEXIS REST API Integration</span>
              </div>
              <div className="code-content-block">
                <pre><code>{`// Initialize NEXIS Courier Client
const nexis = new NexisClient({
  apiKey: 'nx_live_56f890a...'
});

// Book single COD Shipment
const shipment = await nexis.shipments.create({
  service: 'COD_NEXT_DAY',
  sender: { name: 'Your Brand' },
  recipient: {
    name: 'Customer Name',
    phone: '03001234567',
    city: 'Lahore'
  },
  package: { weight: 1.5, CODAmount: 4500 }
});

console.log(\`Shipment Booked! AWB: \${shipment.awb}\`);`}</code></pre>
              </div>
              <div className="api-badge-pill flex-center">
                <Cpu size={14} />
                <span>Shopify & WooCommerce Plugins Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="feature-text animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="feature-tagline text-gradient">API & AUTOMATION</span>
            <h2 className="feature-title">Powering Modern E-Commerce</h2>
            <p className="feature-desc">
              Scale your online store effortlessly. NEXIS provides a powerful developer ecosystem to integrate logistics directly into your tech stack. Track and book orders programmatically directly from your customized POS.
            </p>
            <div className="integrations-features">
              <div className="int-feat-item">
                <FileText className="int-feat-icon" size={18} />
                <div>
                  <h4>Automated Label Generation</h4>
                  <p>Generate, render, and print standard airway bills instantly on purchase triggers.</p>
                </div>
              </div>
              <div className="int-feat-item">
                <BarChart4 className="int-feat-icon" size={18} />
                <div>
                  <h4>Real-Time Status Webhooks</h4>
                  <p>Send automatic tracking updates to your customers via WhatsApp, Email, or SMS.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Partner Opportunity Call-to-Action */}
      <section className="section partner-cta-section gradient-teal-navy text-white">
        <div className="container text-center">
          <h2 className="cta-title">Expand With NEXIS Couriers</h2>
          <p className="cta-subtitle">
            Whether you want to open a Franchise Express Center in your local city or explore open career listings in our logistics hubs, let's build the future together.
          </p>
          <div className="cta-button-group flex-center">
            <Link href="/franchise" className="btn btn-secondary cta-btn">
              <span>Franchise Program</span>
            </Link>
            <Link href="/careers" className="btn btn-outline cta-btn-white cta-btn">
              <span>Explore Careers</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage-wrapper {
          width: 100%;
        }

        .align-center {
          align-items: center;
        }

        /* Rates Section */
        .rates-feature-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
          padding-top: 15rem;
        }

        @media (max-width: 1024px) {
          .rates-feature-section {
            padding-top: 12rem;
          }
        }

        @media (max-width: 600px) {
          .rates-feature-section {
            padding-top: 8rem;
          }
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
          letter-spacing: -0.5px;
        }

        :global([data-theme='dark']) .feature-title {
          color: #ffffff;
        }

        .feature-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }

        .feature-checkpoints {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .checkpoint {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 500;
        }

        .checkpoint-dot {
          width: 8px;
          height: 8px;
          background-color: var(--primary-teal);
          border-radius: var(--radius-full);
          flex-shrink: 0;
        }

        .feature-cta {
          gap: 0.5rem;
        }

        /* Why Choose Section */
        .why-choose-section {
          background-color: var(--bg-primary);
          transition: background-color var(--transition-normal);
        }

        .section-header {
          max-width: 700px;
          margin: 0 auto 4rem auto;
        }

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
        }

        .values-grid {
          margin-top: 1rem;
        }

        .value-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2.5rem 2rem;
          transition: all var(--transition-normal);
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
          border-color: rgba(30, 58, 95, 0.2);
        }

        .value-icon-box {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background-color: rgba(30, 58, 95, 0.08);
          color: var(--primary-navy);
          margin-bottom: 1.5rem;
          transition: all var(--transition-normal);
        }

        :global([data-theme='dark']) .value-icon-box {
          background-color: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .value-card:hover .value-icon-box {
          background-color: var(--primary-teal);
          color: white;
          transform: scale(1.05);
        }

        .value-title {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: #0F172A !important;
          margin-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .value-title {
          color: #ffffff !important;
        }

        .value-desc {
          color: #475569 !important;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        :global([data-theme='dark']) .value-desc {
          color: #94A3B8 !important;
        }

        /* Integrations API section */
        .integrations-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .api-mock-card {
          width: 100%;
          max-width: 480px;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
          background-color: #0F172A;
          color: #E2E8F0;
        }

        .card-header-bar {
          background-color: #1E293B;
          padding: 0.6rem 1rem;
          justify-content: flex-start;
          gap: 0.4rem;
          border-bottom: 1px solid #334155;
        }

        .dot {
          width: 9px;
          height: 9px;
          border-radius: var(--radius-full);
        }

        .red-dot { background-color: #EF4444; }
        .yellow-dot { background-color: #F59E0B; }
        .green-dot { background-color: #10B981; }

        .window-title {
          font-size: 0.7rem;
          color: #94A3B8;
          font-family: var(--font-body);
          font-weight: 500;
          margin-left: 0.75rem;
        }

        .code-content-block {
          padding: 1.25rem;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.8rem;
          overflow-x: auto;
          line-height: 1.5;
        }

        .code-content-block code {
          color: #38BDF8;
        }

        .api-badge-pill {
          padding: 0.5rem 1rem;
          background-color: rgba(13, 148, 136, 0.1);
          color: #2DD4BF;
          font-size: 0.75rem;
          font-weight: 600;
          gap: 0.35rem;
          border-top: 1px solid #1E293B;
        }

        .integrations-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .int-feat-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .int-feat-icon {
          color: var(--primary-teal);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .int-feat-item h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.25rem;
        }

        :global([data-theme='dark']) .int-feat-item h4 {
          color: #ffffff;
        }

        .int-feat-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Partner CTA Section */
        .partner-cta-section {
          position: relative;
          padding: 6rem 0;
        }

        .cta-title {
          font-size: 2.75rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          font-family: var(--font-heading);
          letter-spacing: -0.5px;
        }

        .cta-subtitle {
          font-size: 1.15rem;
          color: rgba(255, 255, 255, 0.8);
          max-width: 650px;
          margin: 0 auto 2.5rem auto;
          line-height: 1.6;
        }

        .cta-button-group {
          gap: 1.25rem;
        }

        @media (max-width: 480px) {
          .cta-button-group {
            flex-direction: column;
            align-items: stretch;
          }
        }

        .cta-btn {
          min-width: 180px;
          padding: 0.85rem 2rem;
          font-size: 1rem;
        }

        .cta-btn-white {
          color: white;
          border-color: rgba(255, 255, 255, 0.4);
        }

        .cta-btn-white:hover {
          background-color: white;
          color: var(--primary-navy);
          border-color: white;
        }
      `}</style>
    </div>
  );
}
