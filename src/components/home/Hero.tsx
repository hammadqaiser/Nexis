'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Calculator, Landmark, ShieldCheck, ArrowRight, Award, MessageSquare } from 'lucide-react';
import TrackingBar from './TrackingBar';
import { BRAND, CONTACT_INFO } from '@/lib/constants';

export default function Hero() {
  const router = useRouter();

  return (
    <section className="hero-section">
      {/* Dark overlay gradient for high text contrast */}
      <div className="hero-overlay"></div>

      <div className="container hero-container-block">
        {/* Core Header Pitch & Tracking Form */}
        <div className="hero-center-content">
          <div className="hero-badge flex-center animate-fade-in">
            <Award size={14} className="badge-icon" />
            <span>Smart Logistics Network</span>
          </div>

          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '100ms' }}>
            Connecting <span className="text-glow">Pakistan</span>,<br />
            Delivering Trust.
          </h1>

          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '200ms' }}>
            Experience next-generation courier pipelines engineered for modern retail, business, and enterprise cash-on-delivery (COD) e-fulfillment.
          </p>

          {/* Centered Tracking Bar */}
          <div className="hero-tracking-box animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h2 className="tracking-form-title">Track & Trace Your Shipment</h2>
            <TrackingBar />
          </div>
        </div>

        {/* Floating Quick Action Cards (DHL / TCS Style Overlap) */}
        <div className="hero-floating-grid animate-fade-in" style={{ animationDelay: '400ms' }}>
          
          {/* Card 1: Ship Now */}
          <Link href="/book" className="action-card">
            <div className="action-card-border-top border-teal"></div>
            <div className="action-icon-wrapper text-teal">
              <Truck size={24} />
            </div>
            <div className="action-text-block">
              <h3 className="action-card-title">Ship Now</h3>
              <p className="action-card-desc">Book doorstep express pickup instantly</p>
            </div>
            <div className="action-hover-arrow">
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Card 2: Get a Quote */}
          <Link href="/rates" className="action-card">
            <div className="action-card-border-top border-navy"></div>
            <div className="action-icon-wrapper text-navy">
              <Calculator size={24} />
            </div>
            <div className="action-text-block">
              <h3 className="action-card-title">Get a Quote</h3>
              <p className="action-card-desc">Calculate weight tariff & volumetric rates</p>
            </div>
            <div className="action-hover-arrow">
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Card 3: COD Corporate */}
          <Link href="/services#cod" className="action-card">
            <div className="action-card-border-top border-orange"></div>
            <div className="action-icon-wrapper text-orange">
              <Landmark size={24} />
            </div>
            <div className="action-text-block">
              <h3 className="action-card-title">COD Solutions</h3>
              <p className="action-card-desc">Automated bi-weekly payments for sellers</p>
            </div>
            <div className="action-hover-arrow">
              <ArrowRight size={16} />
            </div>
          </Link>

          {/* Card 4: Franchise Program */}
          <Link href="/franchise" className="action-card">
            <div className="action-card-border-top border-emerald"></div>
            <div className="action-icon-wrapper text-emerald">
              <ShieldCheck size={24} />
            </div>
            <div className="action-text-block">
              <h3 className="action-card-title">Partner with Us</h3>
              <p className="action-card-desc">Open a local NEXIS Express Center</p>
            </div>
            <div className="action-hover-arrow">
              <ArrowRight size={16} />
            </div>
          </Link>

        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 80vh;
          background-image: url('/images/hero-visual.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          align-items: center;
          padding: 6rem 0 7rem 0; /* extra padding at bottom for card overlap */
          overflow: visible; /* Let cards hang out of the bottom boundary */
        }

        @media (max-width: 1024px) {
          .hero-section {
            padding: 4rem 0 6rem 0;
            min-height: auto;
          }
        }

        /* Highly cinematic dark/teal overlay gradient to make text stand out */
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            180deg,
            rgba(15, 23, 42, 0.85) 0%,
            rgba(15, 23, 42, 0.75) 50%,
            rgba(15, 23, 42, 0.9) 100%
          );
          z-index: 1;
        }

        .hero-container-block {
          position: relative;
          z-index: 2;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4rem;
        }

        /* Center content styling */
        .hero-center-content {
          max-width: 800px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-badge {
          background-color: rgba(13, 148, 136, 0.25);
          border: 1px solid rgba(13, 148, 136, 0.4);
          color: #2DD4BF;
          padding: 0.4rem 1.25rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          gap: 0.4rem;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(4px);
        }

        .hero-title {
          font-family: var(--font-heading);
          font-size: 3.75rem;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin-bottom: 1.25rem;
          color: #FFFFFF;
        }

        .text-glow {
          color: var(--primary-teal);
          text-shadow: 0 0 20px rgba(13, 148, 136, 0.35);
        }

        @media (max-width: 600px) {
          .hero-title {
            font-size: 2.75rem;
          }
        }

        .hero-subtitle {
          font-size: 1.15rem;
          color: #CBD5E1;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          max-width: 680px;
          font-weight: 400;
        }

        /* Tracking Box */
        .hero-tracking-box {
          width: 100%;
          max-width: 720px;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-lg);
          padding: 1.5rem 1.75rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .tracking-form-title {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.85rem;
          text-align: left;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        @media (max-width: 600px) {
          .tracking-form-title {
            text-align: center;
          }
          .hero-tracking-box {
            padding: 1.25rem;
          }
        }

        /* Overlapping Action Row Grid */
        .hero-floating-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          width: 100%;
          margin-bottom: -11rem; /* Hangs down over the next homepage section */
        }

        @media (max-width: 1024px) {
          .hero-floating-grid {
            grid-template-columns: repeat(2, 1fr);
            margin-bottom: -8rem;
            gap: 1.25rem;
          }
        }

        @media (max-width: 600px) {
          .hero-floating-grid {
            grid-template-columns: 1fr;
            margin-bottom: -4rem;
            gap: 1rem;
          }
        }

        /* Action Card Styling (DHL/TCS Style) */
        .action-card {
          background-color: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: var(--radius-md);
          padding: 1.75rem 1.5rem;
          box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04) !important;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all var(--transition-normal);
          overflow: hidden;
          cursor: pointer;
        }

        :global([data-theme='dark']) .action-card {
          background-color: #1E293B !important;
          border-color: #334155 !important;
          box-shadow: 0 15px 30px rgba(0,0,0,0.25) !important;
        }

        /* Hover action cards */
        .action-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px -10px rgba(13, 148, 136, 0.18) !important;
          border-color: var(--primary-teal) !important;
        }

        /* Color bars for tops of cards */
        .action-card-border-top {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        .border-teal { background-color: var(--primary-teal); }
        .border-navy { background-color: var(--primary-navy); }
        .border-orange { background-color: var(--color-accent-orange); }
        .border-emerald { background-color: var(--color-accent-emerald); }

        .action-icon-wrapper {
          margin-bottom: 1.25rem;
          display: inline-flex;
          align-items: center;
          height: 32px;
          transition: transform var(--transition-normal);
        }

        .action-card:hover .action-icon-wrapper {
          transform: scale(1.1) rotate(3deg);
        }

        .text-teal { color: #0D9488 !important; }
        .text-navy { color: #1E3A5F !important; }
        :global([data-theme='dark']) .text-navy { color: #38BDF8 !important; }
        .text-orange { color: #F97316 !important; }
        .text-emerald { color: #10B981 !important; }

        .action-card-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #0F172A !important;
          margin-bottom: 0.35rem;
          transition: color var(--transition-fast);
        }

        .action-card:hover .action-card-title {
          color: var(--primary-teal) !important;
        }

        :global([data-theme='dark']) .action-card-title {
          color: #FFFFFF !important;
        }

        :global([data-theme='dark']) .action-card:hover .action-card-title {
          color: #2DD4BF !important;
        }

        .action-card-desc {
          font-size: 0.8rem;
          color: #475569 !important;
          line-height: 1.4;
          margin-bottom: 1.25rem;
          transition: color var(--transition-fast);
        }

        :global([data-theme='dark']) .action-card-desc {
          color: #94A3B8 !important;
        }

        .action-hover-arrow {
          margin-top: auto;
          color: #94A3B8 !important;
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          transition: transform var(--transition-fast), color var(--transition-fast);
        }

        .action-card:hover .action-hover-arrow {
          transform: translateX(5px);
          color: var(--primary-teal) !important;
        }

        :global([data-theme='dark']) .action-card:hover .action-hover-arrow {
          color: #2DD4BF !important;
        }
      `}</style>
    </section>
  );
}
