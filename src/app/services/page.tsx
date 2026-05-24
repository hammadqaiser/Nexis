'use client';

import { Truck, ShieldCheck, Globe, Building2, Clock, Coins, FileText, Check, AlertCircle } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const DOMESTIC_DETAILS = [
  {
    title: 'Overnight Express',
    description: 'Our primary air-and-land transit courier. Packages booked before cut-off time are delivered next business morning across all major Pakistan cities.',
    specs: ['Weight: Up to 35kg', 'Transit Time: 12-24 Hours', 'Service Area: Nationwide (150+ Cities)', 'Ideal for: Urgent documents, tech items, customer orders'],
  },
  {
    title: 'Same-Day Courier',
    description: 'Premium intra-city courier service. Book your shipment and have a dedicated rider pick up and deliver the parcel within 4 hours in Karachi, Lahore, and Islamabad.',
    specs: ['Weight: Up to 5kg', 'Transit Time: 4 Hours Max', 'Service Area: Major Hub Cities Only', 'Ideal for: Critical files, food items, urgent retail products'],
  },
  {
    title: 'Overland Economy',
    description: 'Cost-effective logistics pipeline utilizing our robust national trucking fleet. Highly discounted rates for heavy commercial and retail stock shipments.',
    specs: ['Weight: 10kg to 500kg+', 'Transit Time: 3-5 Working Days', 'Service Area: Nationwide', 'Ideal for: Bulk inventory, furniture, industrial supplies'],
  },
];

const COD_FEATURES = [
  {
    icon: <Coins size={20} />,
    title: 'Rapid Remittance settlements',
    description: 'We do not hold your money. COD funds are reconciled and settled directly in your bank account twice weekly.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Biometric Security Checks',
    description: 'Integrating advanced NADRA biometric sender checks to fully mitigate parcel return risk and address fraud.',
  },
  {
    icon: <Clock size={20} />,
    title: 'Real-Time Financial Portal',
    description: 'A comprehensive online dashboard displaying COD collections, pending invoices, and historical cash flows.',
  },
];

const COMPARISON_COLUMNS = ['Feature', 'Overnight Express', 'Same-Day', 'Overland Economy', 'International'];
const COMPARISON_ROWS = [
  { feature: 'Transit Time', overnight: 'Next Morning', sameday: '4 Hours', overland: '3-5 Days', international: '3-7 Days' },
  { feature: 'Weight Range', overnight: 'Up to 35 kg', sameday: 'Up to 5 kg', overland: '10 kg - 500 kg+', international: 'Up to 70 kg' },
  { feature: 'Doorstep Pickup', overnight: 'Free', sameday: 'Free', overland: 'Paid (Scheduled)', international: 'Free' },
  { feature: 'COD Support', overnight: 'Yes', sameday: 'Yes', overland: 'Yes', international: 'No' },
  { feature: 'Customs Handling', overnight: 'N/A', sameday: 'N/A', overland: 'N/A', international: 'Included' },
  { feature: 'Rate Class', overnight: 'Standard', sameday: 'Premium', overland: 'Discounted', international: 'Variable' },
];

export default function ServicesPage() {
  return (
    <div className="services-page">
      {/* Page Header */}
      <section className="services-header-section gradient-teal-navy text-white">
        <div className="container text-center animate-fade-in">
          <h1 className="page-title">Our Logistics Solutions</h1>
          <p className="page-subtitle">
            Reliable, secure, and robust shipping pipelines designed for e-commerce, retail, and corporate giants.
          </p>
        </div>
      </section>

      {/* 1. Domestic Services Section */}
      <section id="domestic" className="section domestic-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline text-gradient">DOMESTIC SHIPPING</span>
            <h2 className="section-title">Nationwide Delivery Networks</h2>
            <p className="section-desc">
              With custom fleets and express hubs spread across Pakistan, we connect cities and communities with surgical precision.
            </p>
          </div>

          <div className="grid-cols-3 services-list-grid">
            {DOMESTIC_DETAILS.map((service, idx) => (
              <div key={`dom-${idx}`} className="service-detail-card card animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className="detail-card-title">{service.title}</h3>
                <p className="detail-card-desc">{service.description}</p>
                <div className="specs-list">
                  {service.specs.map((spec, sIdx) => (
                    <div key={`spec-${sIdx}`} className="spec-item">
                      <Check size={14} className="spec-icon" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Cash on Delivery (COD) E-fulfillment */}
      <section id="cod" className="section cod-section">
        <div className="container grid-cols-2 align-center">
          <div className="feature-text animate-fade-in">
            <span className="feature-tagline text-gradient">CASH ON DELIVERY</span>
            <h2 className="feature-title">The Ultimate COD Engine for E-commerce Sellers</h2>
            <p className="feature-desc">
              Pakistani e-commerce is built on COD. NEXIS has engineered a state-of-the-art COD logistics pipeline specifically optimized for high-volume online brands, retail sellers, and social media businesses.
            </p>

            <div className="cod-feature-list">
              {COD_FEATURES.map((feat, idx) => (
                <div key={`cod-feat-${idx}`} className="cod-feature-item">
                  <div className="cod-feat-icon-wrapper flex-center">
                    {feat.icon}
                  </div>
                  <div>
                    <h4>{feat.title}</h4>
                    <p>{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cod-graphic flex-center animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="dashboard-teaser-card glass">
              <div className="teaser-header">
                <span className="teaser-heading">Merchant COD Settlement Statement</span>
                <span className="teaser-status-badge flex-center">Settled</span>
              </div>
              <div className="teaser-metrics-row">
                <div className="teaser-metric">
                  <span className="metric-label">Remittance Paid</span>
                  <span className="metric-val text-gradient">PKR 145,280</span>
                </div>
                <div className="teaser-metric">
                  <span className="metric-label">Delivered Orders</span>
                  <span className="metric-val">34 Items</span>
                </div>
              </div>
              <div className="teaser-details">
                <div className="teaser-detail-line">
                  <span>Cycle Date:</span>
                  <strong>May 15 - May 18, 2026</strong>
                </div>
                <div className="teaser-detail-line">
                  <span>Bank Transferred:</span>
                  <strong>Meezan Bank (***1234)</strong>
                </div>
                <div className="teaser-detail-line">
                  <span>Return Ratio:</span>
                  <strong className="text-success">2.4% (Ultra Low)</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. International Services Section */}
      <section id="international" className="section international-section">
        <div className="container grid-cols-2 align-center">
          <div className="intl-visual flex-center animate-fade-in">
            <div className="intl-globe-visual flex-center">
              <Globe size={180} className="globe-vector-icon" />
              <div className="radar-circle circle-1"></div>
              <div className="radar-circle circle-2"></div>
            </div>
          </div>

          <div className="feature-text animate-fade-in" style={{ animationDelay: '200ms' }}>
            <span className="feature-tagline text-gradient">GLOBAL DELIVERY</span>
            <h2 className="feature-title">Seamless International Shipping</h2>
            <p className="feature-desc">
              Connect your business to global marketplaces. NEXIS international shipping pipelines support document express, commercial cargo freight, and secure customs brokerage services to over 220 countries.
            </p>
            <div className="intl-features">
              <div className="intl-feature-item">
                <FileText size={18} className="intl-feat-icon" />
                <div>
                  <h4>Customs & Tariffs Consultation</h4>
                  <p>Comprehensive guidance on HS codes, product classification, duties estimation, and import clearance documentation.</p>
                </div>
              </div>
              <div className="intl-feature-item">
                <Building2 size={18} className="intl-feat-icon" />
                <div>
                  <h4>Air & Sea Commercial Cargo</h4>
                  <p>Flexible logistics pipelines supporting bulk exports and commercial imports matching the highest enterprise standard.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Corporate Logistics & Warehousing */}
      <section id="corporate" className="section corporate-section">
        <div className="container text-center">
          <div className="section-header text-center max-width-700">
            <span className="section-tagline text-gradient">ENTERPRISE SOLUTIONS</span>
            <h2 className="section-title">Industrial Warehousing & Cold-Chain</h2>
            <p className="section-desc">
              Customized logistics networks built for pharmaceutical, corporate office supplies, manufacturing lines, and perishable goods distributors.
            </p>
          </div>

          <div className="grid-cols-2 corporate-grid">
            <div className="corporate-card card text-left flex-row">
              <div className="corp-icon-box flex-center">
                <Building2 size={24} />
              </div>
              <div>
                <h3>Integrated Warehousing</h3>
                <p>Strategically located secure sorting and fulfillment centers in Karachi, Lahore, and Rawalpindi. Inventory management with automated daily pick & pack operations.</p>
              </div>
            </div>
            <div className="corporate-card card text-left flex-row">
              <div className="corp-icon-box flex-center">
                <Truck size={24} />
              </div>
              <div>
                <h3>Dedicated Fleet Leases</h3>
                <p>Lease dedicated delivery vans and cargo trucks with expert riders/drivers fully insured, branded, and optimized for your specific supply chains.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Service Comparison Table Matrix */}
      <section className="section comparison-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-tagline text-gradient">COMPREHENSIVE MATRIX</span>
            <h2 className="section-title">Compare Our Shipping Products</h2>
            <p className="section-desc">
              Find the perfect balance of transit speeds, weight allocations, and budget brackets for your deliveries.
            </p>
          </div>

          <div className="table-responsive glass">
            <table className="comparison-table">
              <thead>
                <tr>
                  {COMPARISON_COLUMNS.map((col, idx) => (
                    <th key={`col-${idx}`} className={idx === 0 ? 'text-left' : 'text-center'}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, idx) => (
                  <tr key={`row-${idx}`}>
                    <td className="row-feature text-left">{row.feature}</td>
                    <td className="text-center">{row.overnight}</td>
                    <td className="text-center">{row.sameday}</td>
                    <td className="text-center">{row.overland}</td>
                    <td className="text-center">{row.international}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style jsx>{`
        .services-page {
          width: 100%;
        }

        .services-header-section {
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

        .max-width-700 {
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .text-left {
          text-align: left;
        }

        .text-center {
          text-align: center;
        }

        .flex-row {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        /* Generic Section header styles */
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
          margin-bottom: 3.5rem;
        }

        /* Domestic cards */
        .domestic-section {
          background-color: var(--bg-primary);
        }

        .service-detail-card {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
        }

        .detail-card-title {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .detail-card-title {
          color: #ffffff;
        }

        .detail-card-desc {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px dashed var(--border-color);
          padding-top: 1.25rem;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .spec-icon {
          color: var(--primary-teal);
          flex-shrink: 0;
        }

        /* COD Section */
        .cod-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .cod-feature-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cod-feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .cod-feat-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-teal);
          flex-shrink: 0;
        }

        .cod-feature-item h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.25rem;
        }

        :global([data-theme='dark']) .cod-feature-item h4 {
          color: #ffffff;
        }

        .cod-feature-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Dashboard teaser */
        .dashboard-teaser-card {
          width: 100%;
          max-width: 420px;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-xl);
          background-color: var(--bg-primary);
        }

        .teaser-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .teaser-heading {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .teaser-status-badge {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--color-accent-emerald);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .teaser-metrics-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .teaser-metric {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .metric-label {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-bottom: 0.35rem;
        }

        .metric-val {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.6rem;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .metric-val {
          color: #ffffff;
        }

        .teaser-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: 1rem;
          font-size: 0.85rem;
        }

        .teaser-detail-line {
          display: flex;
          justify-content: space-between;
          color: var(--text-secondary);
        }

        .teaser-detail-line strong {
          color: var(--text-primary);
        }

        .text-success {
          color: var(--color-accent-emerald) !important;
        }

        /* International Section */
        .international-section {
          background-color: var(--bg-primary);
        }

        .globe-vector-icon {
          color: var(--primary-teal);
          opacity: 0.8;
          animation: float-g 4s ease-in-out infinite alternate;
        }

        @keyframes float-g {
          from { transform: translateY(0) rotate(0deg); }
          to { transform: translateY(-8px) rotate(5deg); }
        }

        .intl-globe-visual {
          position: relative;
          width: 320px;
          height: 320px;
        }

        .radar-circle {
          position: absolute;
          border: 2px solid rgba(13, 148, 136, 0.15);
          border-radius: var(--radius-full);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .circle-1 {
          width: 260px;
          height: 260px;
          animation: pulse-r 3s infinite linear;
        }

        .circle-2 {
          width: 320px;
          height: 320px;
          animation: pulse-r 3s infinite linear 1.5s;
        }

        @keyframes pulse-r {
          0% {
            width: 150px;
            height: 150px;
            opacity: 1;
          }
          100% {
            width: 380px;
            height: 380px;
            opacity: 0;
          }
        }

        .intl-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .intl-feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .intl-feat-icon {
          color: var(--primary-teal);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .intl-feature-item h4 {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.25rem;
        }

        :global([data-theme='dark']) .intl-feature-item h4 {
          color: #ffffff;
        }

        .intl-feature-item p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Corporate Section */
        .corporate-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .corporate-grid {
          margin-top: 1rem;
        }

        .corporate-card {
          padding: 2.25rem 2rem;
        }

        .corp-icon-box {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-teal);
          flex-shrink: 0;
        }

        .corporate-card h3 {
          font-family: var(--font-heading);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.5rem;
        }

        :global([data-theme='dark']) .corporate-card h3 {
          color: #ffffff;
        }

        .corporate-card p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Comparison table */
        .comparison-section {
          background-color: var(--bg-primary);
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          background-color: var(--bg-primary);
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .comparison-table th {
          background-color: var(--bg-secondary);
          font-family: var(--font-heading);
          font-weight: 700;
          color: var(--primary-navy);
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }

        :global([data-theme='dark']) .comparison-table th {
          background-color: #1e293b;
          color: #ffffff;
        }

        .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .comparison-table tr:hover td {
          background-color: rgba(13, 148, 136, 0.02);
        }

        .row-feature {
          font-weight: 600;
          color: var(--primary-navy);
          white-space: nowrap;
        }

        :global([data-theme='dark']) .row-feature {
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .comparison-table th,
          .comparison-table td {
            padding: 0.9rem 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
