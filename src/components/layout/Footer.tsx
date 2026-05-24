'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { BRAND, CONTACT_INFO, NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Brand Information */}
        <div className="footer-col brand-col">
          <Link href="/" className="footer-logo">
            <div className="logo-wrapper">
              <img
                src="/images/nexis-logo-mark.png"
                alt={`${BRAND.name} Logo`}
                className="logo-mark"
              />
              <div className="logo-text-block">
                <span className="logo-primary">{BRAND.logoText}</span>
                <span className="logo-secondary">{BRAND.subText}</span>
              </div>
            </div>
          </Link>
          <p className="brand-desc">
            A premium logistics and courier brand under the umbrella of <strong>{BRAND.parentCompany}</strong>. Connecting communities across land, air, and sea with speed and absolute reliability.
          </p>
          <div className="social-links">
            {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label={`Follow us on ${platform}`}
              >
                <span className="platform-capitalize">{platform[0].toUpperCase() + platform.slice(1)}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links / Services */}
        <div className="footer-col">
          <h3 className="footer-title">Our Services</h3>
          <ul className="footer-links">
            <li>
              <Link href="/services#domestic" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Domestic Delivery</span>
              </Link>
            </li>
            <li>
              <Link href="/services#international" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>International Courier</span>
              </Link>
            </li>
            <li>
              <Link href="/services#cod" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Cash on Delivery (COD)</span>
              </Link>
            </li>
            <li>
              <Link href="/services#corporate" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Corporate Logistics</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Corporate / Opportunities */}
        <div className="footer-col">
          <h3 className="footer-title">Corporate Portal</h3>
          <ul className="footer-links">
            <li>
              <Link href="/franchise" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Franchise Opportunities</span>
              </Link>
            </li>
            <li>
              <Link href="/careers" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Join Our Team (Careers)</span>
              </Link>
            </li>
            <li>
              <Link href="/about" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>About NEXIS Group</span>
              </Link>
            </li>
            <li>
              <Link href="/contact" className="footer-link">
                <ArrowRight size={12} className="link-arrow" />
                <span>Customer Support</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contacts & WhatsApp Quick Link */}
        <div className="footer-col contacts-col">
          <h3 className="footer-title">Get In Touch</h3>
          <div className="contact-items">
            <div className="contact-item">
              <MapPin size={20} className="contact-icon" />
              <span>{CONTACT_INFO.address}</span>
            </div>
            <a href={`tel:${CONTACT_INFO.phone}`} className="contact-item hoverable">
              <Phone size={18} className="contact-icon" />
              <span>{CONTACT_INFO.phone}</span>
            </a>
            <a href={`mailto:${CONTACT_INFO.email}`} className="contact-item hoverable">
              <Mail size={18} className="contact-icon" />
              <span>{CONTACT_INFO.email}</span>
            </a>
          </div>

          <div className="whatsapp-box">
            <h4 className="whatsapp-title">Need Immediate Help?</h4>
            <p className="whatsapp-text">Chat with our 24/7 support assistant on WhatsApp for tracking & bookings.</p>
            <a
              href={CONTACT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn btn btn-primary flex-center"
            >
              <MessageSquare size={16} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="copyright-bar">
        <div className="container copyright-container">
          <p className="copyright-text">
            © {currentYear} <strong>{BRAND.legalName}</strong>. All rights reserved.
          </p>
          <div className="legal-links">
            <Link href="/privacy" className="legal-link">Privacy Policy</Link>
            <span className="bullet">•</span>
            <Link href="/terms" className="legal-link">Terms & Conditions</Link>
            <span className="bullet">•</span>
            <a href="https://nexisenterprises.com" target="_blank" rel="noopener noreferrer" className="legal-link inline-flex">
              <span>NEXIS Group</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--primary-navy);
          color: #E2E8F0;
          padding-top: 5rem;
          margin-top: auto;
          border-top: 4px solid var(--primary-teal);
        }

        :global([data-theme='dark']) .footer {
          background-color: #0B0F19;
          border-top-color: var(--primary-teal);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 2fr;
          gap: 3rem;
          padding-bottom: 4rem;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
        }

        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .footer-col {
          display: flex;
          flex-direction: column;
        }

        .brand-col {
          gap: 1.5rem;
        }

        .footer-logo {
          display: inline-block;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          height: 52px;
        }

        .logo-mark {
          height: 38px;
          width: auto;
          display: block;
          object-fit: contain;
        }

        .logo-text-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.1;
        }

        .logo-primary {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.35rem;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .logo-secondary {
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.72rem;
          letter-spacing: 2px;
          color: var(--primary-teal);
          text-transform: uppercase;
        }

        .brand-desc {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #94A3B8;
        }

        .brand-desc strong {
          color: #FFFFFF;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .social-icon {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-sm);
          color: #94A3B8;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all var(--transition-fast);
        }

        .social-icon:hover {
          color: #FFFFFF;
          background-color: var(--primary-teal);
          border-color: var(--primary-teal);
          transform: translateY(-2px);
        }

        .footer-title {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 0.5rem;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 30px;
          height: 2px;
          background-color: var(--primary-teal);
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94A3B8;
          font-size: 0.95rem;
        }

        .link-arrow {
          opacity: 0;
          transform: translateX(-5px);
          transition: all var(--transition-fast);
        }

        .footer-link:hover {
          color: #FFFFFF;
        }

        .footer-link:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
          color: var(--primary-teal);
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #94A3B8;
        }

        .contact-item.hoverable:hover {
          color: #FFFFFF;
        }

        .contact-icon {
          color: var(--primary-teal);
          flex-shrink: 0;
        }

        .whatsapp-box {
          background-color: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 1.25rem;
        }

        .whatsapp-title {
          font-family: var(--font-heading);
          color: #FFFFFF;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
        }

        .whatsapp-text {
          font-size: 0.8rem;
          color: #94A3B8;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .whatsapp-btn {
          width: 100%;
          font-size: 0.85rem;
          padding: 0.5rem 1rem;
        }

        /* Copyright Bar */
        .copyright-bar {
          background-color: rgba(15, 23, 42, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.5rem 0;
        }

        .copyright-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #64748B;
        }

        @media (max-width: 768px) {
          .copyright-container {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        .copyright-text strong {
          color: #94A3B8;
        }

        .legal-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .legal-link {
          color: #64748B;
        }

        .legal-link:hover {
          color: #94A3B8;
        }

        .bullet {
          color: #334155;
        }

        .inline-flex {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
      `}</style>
    </footer>
  );
}
