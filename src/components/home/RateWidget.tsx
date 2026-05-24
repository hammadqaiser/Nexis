'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRightLeft, HelpCircle, Loader2 } from 'lucide-react';
import citiesData from '@/data/cities.json';
import { formatPKR } from '@/lib/utils';

export default function RateWidget() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [ratesData, setRatesData] = useState<any>(null);
  const [results, setResults] = useState<{
    standard: number;
    express: number;
    daysStandard: number;
    daysExpress: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => setRatesData(data))
      .catch(err => console.error('Error fetching rates', err));
  }, []);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setResults(null);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!origin || !destination || !ratesData) return;

    setIsLoading(true);
    setResults(null);

    // Dynamic pricing formula
    setTimeout(() => {
      const isSameCity = origin === destination;
      const parsedWeight = Math.max(0.5, Number(weight));
      
      // Base rates
      const baseStandard = isSameCity ? ratesData.sameCityStandardBase : ratesData.interCityStandardBase;
      const baseExpress = isSameCity ? ratesData.sameCityExpressBase : ratesData.interCityExpressBase;
      
      // Weight additions (per kg above 1kg)
      const weightCostStandard = isSameCity ? ratesData.sameCityStandardKg : ratesData.interCityStandardKg;
      const weightCostExpress = isSameCity ? ratesData.sameCityExpressKg : ratesData.interCityExpressKg;
      
      const extraWeight = Math.max(0, parsedWeight - 1);
      
      let standardTotal = baseStandard + (extraWeight * weightCostStandard);
      let expressTotal = baseExpress + (extraWeight * weightCostExpress);

      // Add tax
      standardTotal = standardTotal + (standardTotal * (ratesData.taxPercent / 100));
      expressTotal = expressTotal + (expressTotal * (ratesData.taxPercent / 100));

      setResults({
        standard: Math.round(standardTotal),
        express: Math.round(expressTotal),
        daysStandard: isSameCity ? 2 : 3,
        daysExpress: 1,
      });
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="rate-widget-card glass">
      <div className="widget-header">
        <Calculator size={20} className="header-icon" />
        <h3 className="widget-title">Calculate Rate</h3>
      </div>

      <form onSubmit={handleCalculate} className="widget-form">
        <div className="inputs-grid">
          {/* Origin */}
          <div className="form-group">
            <label htmlFor="widget-origin">From (Origin)</label>
            <select
              id="widget-origin"
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setResults(null);
              }}
              required
              className="widget-select"
            >
              <option value="">Select Origin City</option>
              {citiesData.map((city) => (
                <option key={`origin-${city.id}`} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="swap-wrapper">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!origin && !destination}
              className="swap-btn"
              aria-label="Swap cities"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          {/* Destination */}
          <div className="form-group">
            <label htmlFor="widget-destination">To (Destination)</label>
            <select
              id="widget-destination"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setResults(null);
              }}
              required
              className="widget-select"
            >
              <option value="">Select Destination City</option>
              {citiesData.map((city) => (
                <option key={`dest-${city.id}`} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div className="form-group weight-group">
            <label htmlFor="widget-weight">Weight (kg)</label>
            <input
              type="number"
              id="widget-weight"
              min="0.1"
              max="100"
              step="0.1"
              value={weight}
              onChange={(e) => {
                setWeight(parseFloat(e.target.value));
                setResults(null);
              }}
              required
              className="widget-input"
            />
          </div>
        </div>

        <button
          type="submit"
          id="widget-calculate-btn"
          className="btn btn-secondary calculate-btn"
          disabled={isLoading || !origin || !destination}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" size={16} />
              <span>Calculating...</span>
            </>
          ) : (
            <span>Estimate Price</span>
          )}
        </button>
      </form>

      {/* Dynamic Results Display */}
      {results && (
        <div className="widget-results animate-fade-in">
          <h4 className="results-title">Estimated Delivery Charges</h4>
          <div className="results-grid">
            {/* Standard Service */}
            <div className="service-result-card">
              <span className="service-name">Overland / Eco</span>
              <span className="service-price">{formatPKR(results.standard)}</span>
              <span className="service-duration">Est. {results.daysStandard} - {results.daysStandard + 1} working days</span>
            </div>

            {/* Express Service */}
            <div className="service-result-card prime-service">
              <span className="service-tag">Popular</span>
              <span className="service-name">Air Express / Next Day</span>
              <span className="service-price text-gradient">{formatPKR(results.express)}</span>
              <span className="service-duration">Est. {results.daysExpress} working day</span>
            </div>
          </div>

          <div className="results-cta">
            <Link
              href={`/book?origin=${origin}&destination=${destination}&weight=${weight}`}
              className="btn btn-primary cta-booking-btn"
            >
              <span>Book This Shipment</span>
            </Link>
            <span className="tax-notice">*Rates are inclusive of 16% GST. Excludes optional insurance.</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .rate-widget-card {
          width: 100%;
          border-radius: var(--radius-lg);
          padding: 1.75rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .header-icon {
          color: var(--primary-teal);
        }

        .widget-title {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .widget-title {
          color: #ffffff;
        }

        .widget-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .inputs-grid {
          display: grid;
          grid-template-columns: 2.2fr 0.4fr 2.2fr 1.2fr;
          align-items: flex-end;
          gap: 0.75rem;
        }

        @media (max-width: 768px) {
          .inputs-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .swap-wrapper {
            justify-content: center;
            padding: 0.25rem 0;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .widget-select,
        .widget-input {
          width: 100%;
          padding: 0.75rem 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
        }

        .widget-select:focus,
        .widget-input:focus {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
        }

        .swap-wrapper {
          display: flex;
          align-items: center;
          height: 100%;
          padding-bottom: 0.5rem;
        }

        .swap-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .swap-btn:hover:not(:disabled) {
          color: var(--primary-teal);
          border-color: var(--primary-teal);
          background-color: var(--bg-primary);
          transform: rotate(180deg);
        }

        .calculate-btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
        }

        /* Results section */
        .widget-results {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--border-color);
        }

        .results-title {
          font-family: var(--font-heading);
          font-size: 1rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 1rem;
        }

        :global([data-theme='dark']) .results-title {
          color: #ffffff;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        @media (max-width: 480px) {
          .results-grid {
            grid-template-columns: 1fr;
          }
        }

        .service-result-card {
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }

        .prime-service {
          border-color: var(--primary-teal);
          background-color: rgba(13, 148, 136, 0.03);
        }

        .service-tag {
          position: absolute;
          top: -10px;
          right: 12px;
          background-color: var(--color-accent-orange);
          color: white;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .service-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .service-price {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .service-price {
          color: #ffffff;
        }

        .service-duration {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-top: 0.25rem;
        }

        .results-cta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .cta-booking-btn {
          width: 100%;
          padding: 0.75rem;
        }

        .tax-notice {
          font-size: 0.7rem;
          color: var(--text-light);
          text-align: center;
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
