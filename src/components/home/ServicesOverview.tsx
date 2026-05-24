'use client';

import Link from 'next/link';
import { Truck, ShieldCheck, Globe, Building2, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    icon: <Truck size={36} />,
    title: 'Domestic Express',
    description: 'Overnight, Same-day, and Economy Overland shipping solutions matching the speed and coverage of top industry leaders.',
    href: '/services#domestic',
    tag: 'Next-Day Delivery',
  },
  {
    icon: <ShieldCheck size={36} />,
    title: 'Cash on Delivery (COD)',
    description: 'Specialized COD service with rapid e-fulfillment, 24/7 client dashboards, and fast bi-weekly bank settlements.',
    href: '/services#cod',
    tag: 'E-commerce Friendly',
  },
  {
    icon: <Globe size={36} />,
    title: 'International Shipping',
    description: 'Air cargo and door-to-door express parcel deliveries to over 220 countries with comprehensive customs support.',
    href: '/services#international',
    tag: 'Global Reach',
  },
  {
    icon: <Building2 size={36} />,
    title: 'Corporate Logistics',
    description: 'Bulk logistics, cold-chain operations, custom contracts, and warehousing for enterprises and SMEs.',
    href: '/services#corporate',
    tag: 'Enterprise Grade',
  },
];

export default function ServicesOverview() {
  return (
    <section className="services-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tagline text-gradient">WHAT WE PROVIDE</span>
          <h2 className="section-title">Logistics Redefined for Modern Business</h2>
          <p className="section-desc">
            NEXIS COURIERS delivers comprehensive, secure, and robust shipping pipelines designed to keep your business running smoothly across the country or around the world.
          </p>
        </div>

        <div className="grid-cols-4 services-grid">
          {SERVICES.map((service, index) => (
            <div key={`service-${index}`} className="service-card animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="service-card-tag">{service.tag}</div>
              <div className="service-icon-wrapper">
                {service.icon}
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
              
              <Link href={service.href} className="service-card-link">
                <span>Explore Service</span>
                <ArrowRight size={14} className="arrow-icon" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services-section {
          padding: 6rem 0;
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .section-header {
          text-align: center;
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
          letter-spacing: -0.5px;
        }

        :global([data-theme='dark']) .section-title {
          color: #ffffff;
        }

        .section-desc {
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .services-grid {
          margin-top: 1rem;
        }

        .service-card {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2.25rem 2rem;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all var(--transition-normal);
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-teal), var(--color-accent-cyan));
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          border-color: rgba(13, 148, 136, 0.2);
        }

        .service-card:hover::before {
          opacity: 1;
        }

        .service-card-tag {
          align-self: flex-start;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 1.5rem;
          transition: all var(--transition-fast);
        }

        .service-card:hover .service-card-tag {
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-teal);
        }

        .service-icon-wrapper {
          color: var(--primary-teal);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          height: 44px;
          transition: transform var(--transition-normal);
        }

        .service-card:hover .service-icon-wrapper {
          transform: scale(1.1) rotate(5deg);
        }

        .service-card-title {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: #0F172A !important;
          margin-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .service-card-title {
          color: #ffffff !important;
        }

        .service-card-desc {
          color: #475569 !important;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        :global([data-theme='dark']) .service-card-desc {
          color: #94A3B8 !important;
        }

        .service-card-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--primary-navy);
          transition: color var(--transition-fast);
          align-self: flex-start;
        }

        :global([data-theme='dark']) .service-card-link {
          color: #ffffff;
        }

        .arrow-icon {
          transition: transform var(--transition-fast);
        }

        .service-card-link:hover {
          color: var(--primary-teal);
        }

        .service-card-link:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </section>
  );
}
