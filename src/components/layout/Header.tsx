'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon, PhoneCall, Truck } from 'lucide-react';
import { BRAND, NAV_LINKS, CONTACT_INFO } from '@/lib/constants';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const pathname = usePathname();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize theme from HTML dataset
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme as 'light' | 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Logo Section */}
        <Link href="/" className="logo-section" onClick={closeMenu}>
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

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {NAV_LINKS.slice(0, 7).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="action-btn theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Quick Contact */}
          <a href={`tel:${CONTACT_INFO.phone}`} className="phone-badge btn-secondary flex-center">
            <PhoneCall size={16} />
            <span className="phone-text">{CONTACT_INFO.phone}</span>
          </a>

          {/* Track Button Shortcut */}
          <Link href="/tracking" className="track-shortcut btn btn-primary">
            <Truck size={18} />
            <span>Track</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-content">
          <div className="mobile-nav-title">NEXIS Navigation</div>
          <nav className="mobile-nav-links">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mobile-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mobile-drawer-footer">
            <p>Need immediate assistance?</p>
            <a href={`tel:${CONTACT_INFO.phone}`} className="mobile-phone-link">
              <PhoneCall size={18} />
              <span>{CONTACT_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(241, 245, 249, 0.8);
          transition: all var(--transition-normal);
        }

        :global([data-theme='dark']) .header {
          background: rgba(15, 23, 42, 0.85);
          border-bottom: 1px solid rgba(30, 41, 59, 0.8);
        }

        .header.scrolled {
          height: 70px;
          background: #ffffff;
          box-shadow: var(--shadow-md);
          border-bottom: 1px solid var(--border-color);
        }

        :global([data-theme='dark']) .header.scrolled {
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          height: 52px;
        }

        .logo-mark {
          height: 42px;
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
          color: var(--primary-navy);
          transition: color var(--transition-fast);
        }

        :global([data-theme='dark']) .logo-primary {
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

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }
        }

        .nav-link {
          font-family: var(--font-heading);
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--text-secondary);
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--primary-teal);
          transition: width var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--primary-teal);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link.active {
          color: var(--primary-teal);
          font-weight: 600;
        }

        .nav-link.active::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
          background: transparent;
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          color: var(--primary-teal);
          border-color: var(--primary-teal);
          background-color: var(--bg-secondary);
        }

        .phone-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          border-radius: var(--radius-md);
          color: white;
          background-color: var(--primary-navy);
          font-weight: 600;
        }

        .phone-badge:hover {
          background-color: var(--primary-navy-hover);
        }

        @media (max-width: 768px) {
          .phone-badge {
            display: none;
          }
        }

        .track-shortcut {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          border-radius: var(--radius-md);
        }

        @media (max-width: 600px) {
          .track-shortcut {
            display: none;
          }
        }

        .mobile-menu-btn {
          display: none;
          color: var(--text-primary);
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            border: 1px solid var(--border-color);
          }
        }

        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.4);
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition-normal);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .mobile-drawer.open {
          opacity: 1;
          visibility: visible;
        }

        .mobile-drawer-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 80%;
          max-width: 300px;
          height: 100%;
          background: var(--bg-primary);
          box-shadow: var(--shadow-xl);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          transform: translateX(-100%);
          transition: transform var(--transition-normal);
        }

        .mobile-drawer.open .mobile-drawer-content {
          transform: translateX(0);
        }

        .mobile-nav-title {
          font-family: var(--font-heading);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex-grow: 1;
        }

        .mobile-link {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-link.active {
          color: var(--primary-teal);
        }

        .mobile-drawer-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .mobile-drawer-footer p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .mobile-phone-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-teal);
          font-weight: 700;
          font-size: 1rem;
        }
      `}</style>
    </header>
  );
}
