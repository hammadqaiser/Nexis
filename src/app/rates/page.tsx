'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRightLeft, Info, HelpCircle, FileText, Calendar, ShieldAlert } from 'lucide-react';
import citiesData from '@/data/cities.json';
import ratesStatic from '@/data/rates.json';
import { formatPKR } from '@/lib/utils';

export default function RatesPage() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [service, setService] = useState<'standard' | 'express'>('express');
  const [weight, setWeight] = useState('1');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [ratesData, setRatesData] = useState<any>(null);

  const [calculation, setCalculation] = useState<{
    chargeableWeight: number;
    volumetricWeight: number;
    basePrice: number;
    weightSurcharge: number;
    volumetricSurcharge: number;
    insurance: number;
    fuelSurcharge: number;
    gst: number;
    total: number;
    days: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => setRatesData(data))
      .catch(err => console.error('Error fetching rates', err));
  }, []);

  // Auto-calculate on changes if calculated state is active
  useEffect(() => {
    if (origin && destination && isCalculated && ratesData) {
      calculateRates();
    }
  }, [origin, destination, service, weight, length, width, height, declaredValue, ratesData, isCalculated]);

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const calculateRates = () => {
    if (!origin || !destination || !ratesData) return;

    const isSameCity = origin === destination;
    const actualWeight = Math.max(0.1, parseFloat(weight) || 1);
    
    // Calculate volumetric weight: L * W * H / 5000
    const lVal = parseFloat(length) || 0;
    const wVal = parseFloat(width) || 0;
    const hVal = parseFloat(height) || 0;
    const volumetricWeight = Math.round(((lVal * wVal * hVal) / 5000) * 100) / 100;
    
    // Chargeable weight is the max of actual and volumetric
    const chargeableWeight = Math.max(actualWeight, volumetricWeight);
    
    // Base Price logic
    let basePrice = 0;
    let perKgRate = 0;

    if (isSameCity) {
      basePrice = service === 'express' ? ratesData.sameCityExpressBase : ratesData.sameCityStandardBase;
      perKgRate = service === 'express' ? ratesData.sameCityExpressKg : ratesData.sameCityStandardKg;
    } else {
      basePrice = service === 'express' ? ratesData.interCityExpressBase : ratesData.interCityStandardBase;
      perKgRate = service === 'express' ? ratesData.interCityExpressKg : ratesData.interCityStandardKg;
    }

    // Weight surcharge: weight over 1kg
    const extraWeight = Math.max(0, chargeableWeight - 1);
    const weightSurcharge = Math.round(extraWeight * perKgRate);

    // Volumetric surcharge (just for itemization in receipt if volumetric was higher)
    const volumetricSurcharge = volumetricWeight > actualWeight 
      ? Math.round((volumetricWeight - actualWeight) * perKgRate)
      : 0;

    // Optional insurance (1% of declared value, min 100 PKR)
    const val = parseFloat(declaredValue) || 0;
    const insurance = val > 0 ? Math.max(100, Math.round(val * 0.01)) : 0;

    // Subtotal
    const subtotal = basePrice + weightSurcharge;

    // Fuel surcharge
    const fuelSurcharge = Math.round(subtotal * (ratesData.fuelSurchargePercent / 100));

    // GST
    const taxableAmount = subtotal + fuelSurcharge + insurance;
    const gst = Math.round(taxableAmount * (ratesData.taxPercent / 100));

    // Total
    const total = taxableAmount + gst;

    setCalculation({
      chargeableWeight,
      volumetricWeight,
      basePrice,
      weightSurcharge,
      volumetricSurcharge,
      insurance,
      fuelSurcharge,
      gst,
      total,
      days: isSameCity ? (service === 'express' ? 1 : 2) : (service === 'express' ? 1 : 3),
    });
    setIsCalculated(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateRates();
  };

  const handleReset = () => {
    setOrigin('');
    setDestination('');
    setService('express');
    setWeight('1');
    setLength('');
    setWidth('');
    setHeight('');
    setDeclaredValue('');
    setIsCalculated(false);
    setCalculation(null);
  };

  return (
    <div className="rates-page">
      {/* Header */}
      <section className="rates-header gradient-teal-navy text-white">
        <div className="container text-center animate-fade-in">
          <h1 className="page-title">Rate Calculator</h1>
          <p className="page-subtitle">
            Get accurate pricing and delivery times across Pakistan using actual and volumetric weight rules.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section rates-main-section">
        <div className="container">
          <div className="grid-cols-2 calculator-layout">
            
            {/* Left side: Input form */}
            <div className="card form-card animate-fade-in">
              <h2 className="form-heading">Shipment Information</h2>
              <form onSubmit={handleFormSubmit} className="calculator-form">
                
                {/* Cities selectors */}
                <div className="cities-row">
                  <div className="form-group flex-1">
                    <label htmlFor="calc-origin">Origin City</label>
                    <select
                      id="calc-origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                      className="calc-select"
                    >
                      <option value="">Select Origin City</option>
                      {citiesData.map((city) => (
                        <option key={`origin-${city.id}`} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="swap-button-wrapper">
                    <button
                      type="button"
                      onClick={handleSwap}
                      disabled={!origin && !destination}
                      className="swap-button"
                      aria-label="Swap cities"
                    >
                      <ArrowRightLeft size={16} />
                    </button>
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="calc-destination">Destination City</label>
                    <select
                      id="calc-destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="calc-select"
                    >
                      <option value="">Select Destination City</option>
                      {citiesData.map((city) => (
                        <option key={`dest-${city.id}`} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Service type */}
                <div className="form-group">
                  <label>Shipping Method</label>
                  <div className="service-tabs">
                    <button
                      type="button"
                      onClick={() => setService('express')}
                      className={`service-tab ${service === 'express' ? 'active' : ''}`}
                    >
                      <span>Air Express (Next Day)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setService('standard')}
                      className={`service-tab ${service === 'standard' ? 'active' : ''}`}
                    >
                      <span>Overland Eco (2-4 Days)</span>
                    </button>
                  </div>
                </div>

                {/* Weight & Value row */}
                <div className="weight-value-row">
                  <div className="form-group flex-1">
                    <label htmlFor="calc-weight">Actual Weight (kg)</label>
                    <input
                      type="number"
                      id="calc-weight"
                      min="0.1"
                      max="1000"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      required
                      className="calc-input"
                    />
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="calc-value">Declared Value (PKR - Optional)</label>
                    <input
                      type="number"
                      id="calc-value"
                      min="0"
                      placeholder="e.g. 5000"
                      value={declaredValue}
                      onChange={(e) => setDeclaredValue(e.target.value)}
                      className="calc-input"
                    />
                  </div>
                </div>

                {/* Dimensions Volumetric */}
                <div className="dimensions-section">
                  <div className="dimensions-header flex-center">
                    <h3 className="dimensions-title">Package Dimensions (cm - Volumetric Estimate)</h3>
                    <div className="info-tooltip">
                      <HelpCircle size={16} className="tooltip-icon" />
                      <span className="tooltip-text">
                        Logistics carriers charge by chargeable weight: whichever is higher between actual scale weight and volumetric sizing (L*W*H/5000).
                      </span>
                    </div>
                  </div>
                  <div className="dimensions-grid">
                    <div className="form-group">
                      <label htmlFor="calc-length">Length</label>
                      <input
                        type="number"
                        id="calc-length"
                        min="0"
                        placeholder="cm"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="calc-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="calc-width">Width</label>
                      <input
                        type="number"
                        id="calc-width"
                        min="0"
                        placeholder="cm"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="calc-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="calc-height">Height</label>
                      <input
                        type="number"
                        id="calc-height"
                        min="0"
                        placeholder="cm"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="calc-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="form-buttons-row">
                  <button
                    type="submit"
                    id="rates-calculate-btn"
                    className="btn btn-secondary calc-submit-btn flex-center"
                    disabled={!origin || !destination}
                  >
                    <Calculator size={18} />
                    <span>Calculate Charges</span>
                  </button>
                  {isCalculated && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-outline reset-btn"
                    >
                      Reset Form
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* Right side: Receipt output */}
            <div className="receipt-column">
              {calculation ? (
                <div className="invoice-receipt card animate-fade-in">
                  <div className="receipt-border"></div>
                  
                  <div className="receipt-header">
                    <div className="receipt-brand">NEXIS COURIERS</div>
                    <div className="receipt-title">Postage Quote Estimate</div>
                    <span className="receipt-date">Valid for today</span>
                  </div>

                  <div className="receipt-section">
                    <div className="receipt-row">
                      <span>Origin:</span>
                      <strong className="capitalize">{origin}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Destination:</span>
                      <strong className="capitalize">{destination}</strong>
                    </div>
                    <div className="receipt-row">
                      <span>Service Tier:</span>
                      <strong>{service === 'express' ? 'Air Express' : 'Overland Eco'}</strong>
                    </div>
                  </div>

                  <div className="receipt-section">
                    <div className="receipt-row">
                      <span>Scale Weight:</span>
                      <span>{weight} kg</span>
                    </div>
                    <div className="receipt-row">
                      <span>Volumetric Weight:</span>
                      <span>{calculation.volumetricWeight} kg</span>
                    </div>
                    <div className="receipt-row highlight-row">
                      <span>Chargeable Weight:</span>
                      <strong>{calculation.chargeableWeight} kg</strong>
                    </div>
                  </div>

                  <div className="receipt-section items-section">
                    <div className="receipt-row">
                      <span>Base Rate (First 1.0 kg):</span>
                      <span>{formatPKR(calculation.basePrice)}</span>
                    </div>
                    {calculation.weightSurcharge > 0 && (
                      <div className="receipt-row">
                        <span>Weight Surcharge (Extra kg):</span>
                        <span>{formatPKR(calculation.weightSurcharge)}</span>
                      </div>
                    )}
                    {calculation.insurance > 0 && (
                      <div className="receipt-row">
                        <span>Optional Value Insurance:</span>
                        <span>{formatPKR(calculation.insurance)}</span>
                      </div>
                    )}
                    <div className="receipt-row">
                      <span>Fuel Surcharge ({ratesData?.fuelSurchargePercent || 10}%):</span>
                      <span>{formatPKR(calculation.fuelSurcharge)}</span>
                    </div>
                    <div className="receipt-row">
                      <span>Government GST ({ratesData?.taxPercent || 16}%):</span>
                      <span>{formatPKR(calculation.gst)}</span>
                    </div>
                  </div>

                  <div className="receipt-total-row">
                    <span>Estimated Total:</span>
                    <span className="grand-total text-gradient">{formatPKR(calculation.total)}</span>
                  </div>

                  <div className="transit-time-pill flex-center">
                    <Calendar size={16} />
                    <span>Est. Delivery: {calculation.days} Working Day{calculation.days > 1 ? 's' : ''}</span>
                  </div>

                  <div className="receipt-footer">
                    <Link
                      href={`/book?origin=${origin}&destination=${destination}&weight=${weight}&service=${service}&length=${length}&width=${width}&height=${height}&value=${declaredValue}`}
                      className="btn btn-primary cta-booking-btn"
                    >
                      <span>Proceed to Booking</span>
                    </Link>
                    <p className="footer-disclaimer">
                      *Estimates are calculated using static tariff rates and are subject to visual verification by NEXIS collection riders.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="empty-receipt-card card flex-center">
                  <FileText size={64} className="empty-icon" />
                  <h3>Waiting for Input</h3>
                  <p>Fill out the shipment details on the left and click "Calculate Charges" to render your visual price receipt.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
      
      <style jsx>{`
        .rates-page {
          width: 100%;
        }

        .rates-header {
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

        .rates-main-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .calculator-layout {
          align-items: flex-start;
          gap: 3rem;
        }

        @media (max-width: 1024px) {
          .calculator-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .form-card {
          padding: 2.5rem;
        }

        .form-heading {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .form-heading {
          color: #ffffff;
        }

        .calculator-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cities-row,
        .weight-value-row {
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        @media (max-width: 600px) {
          .cities-row,
          .weight-value-row {
            flex-direction: column;
            align-items: stretch;
            gap: 1.25rem;
          }
          .swap-button-wrapper {
            justify-content: center;
            padding: 0.25rem 0;
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
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .calc-select,
        .calc-input {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          font-size: 0.95rem;
          transition: all var(--transition-fast);
        }

        .calc-select:focus,
        .calc-input:focus {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .swap-button-wrapper {
          display: flex;
          align-items: center;
          height: 100%;
          padding-bottom: 0.5rem;
        }

        .swap-button {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }

        .swap-button:hover:not(:disabled) {
          color: var(--primary-teal);
          border-color: var(--primary-teal);
          background-color: var(--bg-primary);
          transform: rotate(180deg);
        }

        /* Service Tier Tabs */
        .service-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: var(--bg-secondary);
          padding: 0.25rem;
        }

        .service-tab {
          padding: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          border-radius: calc(var(--radius-md) - 2px);
          text-align: center;
          transition: all var(--transition-fast);
        }

        .service-tab.active {
          background-color: var(--bg-primary);
          color: var(--primary-teal);
          box-shadow: var(--shadow-sm);
        }

        /* Dimensions section */
        .dimensions-section {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }

        :global([data-theme='dark']) .dimensions-section {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .dimensions-header {
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .dimensions-title {
          font-family: var(--font-heading);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .dimensions-title {
          color: #ffffff;
        }

        .info-tooltip {
          position: relative;
          cursor: pointer;
        }

        .tooltip-icon {
          color: var(--text-light);
        }

        .tooltip-text {
          position: absolute;
          bottom: 125%;
          right: 0;
          width: 250px;
          background-color: var(--color-dark);
          color: white;
          text-align: left;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          line-height: 1.4;
          box-shadow: var(--shadow-xl);
          opacity: 0;
          visibility: hidden;
          transition: opacity var(--transition-fast);
          z-index: 50;
        }

        .info-tooltip:hover .tooltip-text {
          opacity: 0.95;
          visibility: visible;
        }

        .dimensions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        @media (max-width: 480px) {
          .dimensions-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }

        /* Form Buttons Row */
        .form-buttons-row {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 480px) {
          .form-buttons-row {
            flex-direction: column;
          }
        }

        .calc-submit-btn {
          flex-grow: 1;
          padding: 0.85rem;
          font-size: 1rem;
        }

        .reset-btn {
          padding: 0.85rem 1.5rem;
        }

        /* Receipt Card Styling */
        .invoice-receipt {
          background-color: var(--bg-primary);
          padding: 2.5rem 2rem;
          position: relative;
          box-shadow: var(--shadow-xl);
          border: 1px solid var(--border-color);
        }

        .receipt-border {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: repeating-linear-gradient(
            -45deg,
            var(--primary-teal),
            var(--primary-teal) 10px,
            var(--primary-navy) 10px,
            var(--primary-navy) 20px
          );
        }

        .receipt-header {
          text-align: center;
          border-bottom: 2px dashed var(--border-color);
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .receipt-brand {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.4rem;
          letter-spacing: 1px;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .receipt-brand {
          color: #ffffff;
        }

        .receipt-title {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .receipt-date {
          font-size: 0.75rem;
          color: var(--text-light);
          display: block;
          margin-top: 0.25rem;
        }

        .receipt-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .receipt-row strong {
          color: var(--text-primary);
        }

        .capitalize {
          text-transform: capitalize;
        }

        .highlight-row {
          font-weight: 700;
          color: var(--primary-navy);
          font-size: 0.95rem;
        }

        :global([data-theme='dark']) .highlight-row {
          color: #ffffff;
        }

        .items-section {
          gap: 0.75rem;
        }

        .receipt-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .receipt-total-row span:first-child {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .receipt-total-row span:first-child {
          color: #ffffff;
        }

        .grand-total {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.9rem;
        }

        .transit-time-pill {
          background-color: rgba(30, 58, 95, 0.08);
          color: var(--primary-navy);
          padding: 0.6rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        :global([data-theme='dark']) .transit-time-pill {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .receipt-footer {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cta-booking-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 1rem;
        }

        .footer-disclaimer {
          font-size: 0.7rem;
          color: var(--text-light);
          text-align: center;
          line-height: 1.4;
        }

        /* Empty receipt card styles */
        .empty-receipt-card {
          flex-direction: column;
          padding: 4rem 2rem;
          text-align: center;
          color: var(--text-secondary);
          min-height: 480px;
        }

        .empty-icon {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          opacity: 0.6;
        }

        .empty-receipt-card h3 {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.3rem;
          color: var(--primary-navy);
          margin-bottom: 0.5rem;
        }

        :global([data-theme='dark']) .empty-receipt-card h3 {
          color: #ffffff;
        }

        .empty-receipt-card p {
          font-size: 0.95rem;
          max-width: 320px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
