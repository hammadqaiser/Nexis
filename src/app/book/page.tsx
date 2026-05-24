'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Truck, MapPin, User, Package, Calendar, Printer, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, QrCode } from 'lucide-react';
import citiesData from '@/data/cities.json';
import { formatPKR, generateTrackingNumber } from '@/lib/utils';
import { BRAND } from '@/lib/constants';

function BookingWizard() {
  const searchParams = useSearchParams();
  
  // Step tracker
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Form Fields State
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderCity, setSenderCity] = useState('');

  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [recipientCity, setRecipientCity] = useState('');

  const [weight, setWeight] = useState('1');
  const [service, setService] = useState<'standard' | 'express'>('express');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [declaredValue, setDeclaredValue] = useState('');
  const [paymentMode, setPaymentMode] = useState<'prepaid' | 'cod'>('cod');
  const [codAmount, setCodAmount] = useState('');

  // Generated results
  const [generatedAwb, setGeneratedAwb] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  // Read prefilled query parameters from Rate Calculator
  useEffect(() => {
    const qOrigin = searchParams.get('origin') || '';
    const qDestination = searchParams.get('destination') || '';
    const qWeight = searchParams.get('weight') || '';
    const qService = searchParams.get('service') || '';
    const qLength = searchParams.get('length') || '';
    const qWidth = searchParams.get('width') || '';
    const qHeight = searchParams.get('height') || '';
    const qValue = searchParams.get('value') || '';

    if (qOrigin) setSenderCity(qOrigin);
    if (qDestination) setRecipientCity(qDestination);
    if (qWeight) setWeight(qWeight);
    if (qService === 'standard' || qService === 'express') setService(qService);
    if (qLength) setLength(qLength);
    if (qWidth) setWidth(qWidth);
    if (qHeight) setHeight(qHeight);
    if (qValue) setDeclaredValue(qValue);
  }, [searchParams]);

  // Form validations for each wizard step
  const validateStep = (currentStep: number) => {
    const errs: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!senderName.trim()) errs.senderName = 'Sender Name is required.';
      if (!senderPhone.trim()) {
        errs.senderPhone = 'Sender Phone number is required.';
      } else if (!/^[0-9+-\s]{10,12}$/.test(senderPhone.replace(/\s/g, ''))) {
        errs.senderPhone = 'Invalid phone number format. Must be 10-12 digits.';
      }
      if (!senderAddress.trim()) errs.senderAddress = 'Pickup Address is required.';
      if (!senderCity) errs.senderCity = 'Please select a pickup city.';
    }

    if (currentStep === 2) {
      if (!recipientName.trim()) errs.recipientName = 'Recipient Name is required.';
      if (!recipientPhone.trim()) {
        errs.recipientPhone = 'Recipient Phone is required.';
      } else if (!/^[0-9+-\s]{10,12}$/.test(recipientPhone.replace(/\s/g, ''))) {
        errs.recipientPhone = 'Invalid phone format. Must be 10-12 digits.';
      }
      if (!recipientAddress.trim()) errs.recipientAddress = 'Destination Delivery Address is required.';
      if (!recipientCity) errs.recipientCity = 'Please select a destination city.';
    }

    if (currentStep === 3) {
      const parsedWeight = parseFloat(weight);
      if (isNaN(parsedWeight) || parsedWeight <= 0) {
        errs.weight = 'Weight must be greater than 0 kg.';
      }
      if (paymentMode === 'cod') {
        const cod = parseFloat(codAmount);
        if (isNaN(cod) || cod <= 0) {
          errs.codAmount = 'COD Remittance amount is required for COD payment mode.';
        }
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleCalculatePrice = () => {
    const isSameCity = senderCity === recipientCity;
    const actualWeight = parseFloat(weight) || 1;
    
    // Volumetric sizing
    const lVal = parseFloat(length) || 0;
    const wVal = parseFloat(width) || 0;
    const hVal = parseFloat(height) || 0;
    const volumetric = Math.round(((lVal * wVal * hVal) / 5000) * 100) / 100;
    
    const chargeable = Math.max(actualWeight, volumetric);
    
    // Math rates
    const base = isSameCity ? (service === 'express' ? 280 : 180) : (service === 'express' ? 450 : 320);
    const perKg = isSameCity ? (service === 'express' ? 100 : 60) : (service === 'express' ? 180 : 120);
    
    const extra = Math.max(0, chargeable - 1);
    const subtotal = base + (extra * perKg);
    const fuel = subtotal * 0.1;
    
    const val = parseFloat(declaredValue) || 0;
    const insurance = val > 0 ? Math.max(100, val * 0.01) : 0;
    
    const taxable = subtotal + fuel + insurance;
    const gst = taxable * 0.16;
    
    return Math.round(taxable + gst);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    // Generate results
    const awb = generateTrackingNumber();
    const price = handleCalculatePrice();

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          awb,
          senderName,
          senderPhone,
          senderAddress,
          senderCity,
          recipientName,
          recipientPhone,
          recipientAddress,
          recipientCity,
          weight,
          pieces: 1,
          serviceTier: service === 'express' ? 'Air Express (Overnight)' : 'Overland Eco (2-4 Days)',
          codAmount: paymentMode === 'cod' ? parseFloat(codAmount) || 0 : 0,
          declaredValue: parseFloat(declaredValue) || 0,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log('Saved shipment in DB successfully:', data.shipment);
      }
    } catch (err) {
      console.error('Failed to post booking to server API, using local storage fallback:', err);
    }

    setGeneratedAwb(awb);
    setEstimatedPrice(price);
    setStep(4);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="booking-card card">
      {/* Wizard Progress Steps Indicator - Hidden on Print */}
      {step < 4 && (
        <div className="wizard-stepper no-print">
          {[1, 2, 3].map((num) => {
            const label = num === 1 ? 'Sender' : num === 2 ? 'Recipient' : 'Shipment';
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={`wiz-${num}`} className={`wizard-node ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                <div className="wizard-circle flex-center">
                  {isDone ? <CheckCircle2 size={16} /> : <span>{num}</span>}
                </div>
                <span className="wizard-label">{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1: SENDER DETAILS */}
      {step === 1 && (
        <div className="step-content no-print animate-fade-in">
          <h2 className="step-title flex-center">
            <User size={20} className="step-icon" />
            <span>Sender Information (Pickup Details)</span>
          </h2>
          <div className="fields-grid">
            <div className="form-group">
              <label htmlFor="sender-name">Sender Name / Business Name *</label>
              <input
                type="text"
                id="sender-name"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. E-Commerce Store PK"
                className={`form-input ${errors.senderName ? 'input-error' : ''}`}
              />
              {errors.senderName && <span className="error-text">{errors.senderName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sender-phone">Sender Contact Phone *</label>
              <input
                type="tel"
                id="sender-phone"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className={`form-input ${errors.senderPhone ? 'input-error' : ''}`}
              />
              {errors.senderPhone && <span className="error-text">{errors.senderPhone}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="sender-address">Pickup Complete Address *</label>
              <textarea
                id="sender-address"
                rows={3}
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="e.g. Suite #5, Ground Floor, Nexis Plaza, Main Faisal Blvd..."
                className={`form-input ${errors.senderAddress ? 'input-error' : ''}`}
              />
              {errors.senderAddress && <span className="error-text">{errors.senderAddress}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="sender-city">Pickup City *</label>
              <select
                id="sender-city"
                value={senderCity}
                onChange={(e) => setSenderCity(e.target.value)}
                className={`form-input ${errors.senderCity ? 'input-error' : ''}`}
              >
                <option value="">Select City</option>
                {citiesData.map((c) => (
                  <option key={`scity-${c.id}`} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.senderCity && <span className="error-text">{errors.senderCity}</span>}
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" onClick={handleNextStep} className="btn btn-primary next-btn">
              <span>Recipient Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RECIPIENT DETAILS */}
      {step === 2 && (
        <div className="step-content no-print animate-fade-in">
          <h2 className="step-title flex-center">
            <MapPin size={20} className="step-icon" />
            <span>Recipient Information (Delivery Destination)</span>
          </h2>
          <div className="fields-grid">
            <div className="form-group">
              <label htmlFor="recipient-name">Consignee (Recipient) Name *</label>
              <input
                type="text"
                id="recipient-name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ayesha Ahmed"
                className={`form-input ${errors.recipientName ? 'input-error' : ''}`}
              />
              {errors.recipientName && <span className="error-text">{errors.recipientName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="recipient-phone">Recipient Contact Phone *</label>
              <input
                type="tel"
                id="recipient-phone"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="e.g. 03217654321"
                className={`form-input ${errors.recipientPhone ? 'input-error' : ''}`}
              />
              {errors.recipientPhone && <span className="error-text">{errors.recipientPhone}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="recipient-address">Delivery Complete Address *</label>
              <textarea
                id="recipient-address"
                rows={3}
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="e.g. House #12, Street 3, Sector F-11/2..."
                className={`form-input ${errors.recipientAddress ? 'input-error' : ''}`}
              />
              {errors.recipientAddress && <span className="error-text">{errors.recipientAddress}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="recipient-city">Destination Delivery City *</label>
              <select
                id="recipient-city"
                value={recipientCity}
                onChange={(e) => setRecipientCity(e.target.value)}
                className={`form-input ${errors.recipientCity ? 'input-error' : ''}`}
              >
                <option value="">Select City</option>
                {citiesData.map((c) => (
                  <option key={`rcity-${c.id}`} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.recipientCity && <span className="error-text">{errors.recipientCity}</span>}
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" onClick={handlePrevStep} className="btn btn-outline back-btn flex-center">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button type="button" onClick={handleNextStep} className="btn btn-primary next-btn">
              <span>Parcel Details</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SHIPMENT PACKAGE DETAILS & COD */}
      {step === 3 && (
        <form onSubmit={handleConfirmBooking} className="step-content no-print animate-fade-in">
          <h2 className="step-title flex-center">
            <Package size={20} className="step-icon" />
            <span>Shipment Package Specifications</span>
          </h2>
          
          <div className="fields-grid">
            {/* Weight & declared value */}
            <div className="form-group">
              <label htmlFor="weight-input">Actual Weight (kg) *</label>
              <input
                type="number"
                id="weight-input"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="form-input"
                required
              />
              {errors.weight && <span className="error-text">{errors.weight}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="declared-value">Declared Value (PKR - Insurance)</label>
              <input
                type="number"
                id="declared-value"
                value={declaredValue}
                onChange={(e) => setDeclaredValue(e.target.value)}
                placeholder="e.g. 5000"
                className="form-input"
              />
            </div>

            {/* Service & Payment tiers */}
            <div className="form-group">
              <label htmlFor="service-select">Shipping Speed Tier</label>
              <select
                id="service-select"
                value={service}
                onChange={(e) => setService(e.target.value as any)}
                className="form-input"
              >
                <option value="express">Air Express (Overnight)</option>
                <option value="standard">Overland Eco (2-4 Days)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="payment-mode">Payment Type</label>
              <select
                id="payment-mode"
                value={paymentMode}
                onChange={(e) => {
                  setPaymentMode(e.target.value as any);
                  if (e.target.value === 'prepaid') setCodAmount('');
                }}
                className="form-input"
              >
                <option value="cod">Cash on Delivery (COD)</option>
                <option value="prepaid">Prepaid (Sender Paid)</option>
              </select>
            </div>

            {/* Conditionally render COD input */}
            {paymentMode === 'cod' && (
              <div className="form-group full-width animate-fade-in">
                <label htmlFor="cod-amount">COD Invoice Cash Collection Amount (PKR) *</label>
                <input
                  type="number"
                  id="cod-amount"
                  value={codAmount}
                  onChange={(e) => setCodAmount(e.target.value)}
                  placeholder="Cash to collect from consignee on doorstep"
                  className={`form-input ${errors.codAmount ? 'input-error' : ''}`}
                  required
                />
                {errors.codAmount && <span className="error-text">{errors.codAmount}</span>}
              </div>
            )}

            {/* Sizing dims for volumetric calculations */}
            <div className="dims-row full-width">
              <span className="dims-label">Box Dimensions (cm - Optional):</span>
              <div className="dims-inputs">
                <input
                  type="number"
                  placeholder="L (cm)"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="form-input dim-field"
                />
                <input
                  type="number"
                  placeholder="W (cm)"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="form-input dim-field"
                />
                <input
                  type="number"
                  placeholder="H (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="form-input dim-field"
                />
              </div>
            </div>
          </div>

          <div className="wizard-actions">
            <button type="button" onClick={handlePrevStep} className="btn btn-outline back-btn flex-center">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <button type="submit" id="book-confirm-submit-btn" className="btn btn-secondary confirm-btn">
              <span>Generate Airway Bill</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: GENERATED AIRWAY BILL & PRINT UI */}
      {step === 4 && (
        <div className="awb-confirmation-container animate-fade-in">
          
          {/* Printable Airway Bill Ticket Box */}
          <div className="printable-airway-bill-ticket shadow-lg border">
            
            {/* Top invoice header */}
            <div className="awb-header-bar flex-center justify-between">
              <div className="awb-logo">
                <span className="logo-text">{BRAND.logoText}</span>
                <span className="logo-sub">{BRAND.subText}</span>
              </div>
              <div className="awb-service-badge flex-center">
                <span>{service === 'express' ? 'AIR EXPRESS / OVERNIGHT' : 'OVERLAND / ECONOMY'}</span>
              </div>
            </div>

            {/* AWB barcode and tracking details */}
            <div className="awb-tracking-bar-row">
              <div className="awb-barcode-container flex-center">
                <QrCode size={110} className="barcode-mock-icon" />
              </div>
              <div className="awb-code-details">
                <span className="awb-label">AIRWAY BILL NUMBER (AWB)</span>
                <span className="awb-num text-gradient">{generatedAwb}</span>
                <span className="awb-routing capitalize">
                  {senderCity} ➔ {recipientCity}
                </span>
              </div>
            </div>

            {/* Shipment specifications (consignee, shipper details) */}
            <div className="awb-grid-parties">
              <div className="party-block block-shipper">
                <span className="party-hdr">FROM (SHIPPER)</span>
                <strong className="party-name">{senderName}</strong>
                <span className="party-phone">Phone: {senderPhone}</span>
                <p className="party-addr">{senderAddress}, <span className="capitalize">{senderCity}</span></p>
              </div>

              <div className="party-block block-consignee">
                <span className="party-hdr">TO (CONSIGNEE)</span>
                <strong className="party-name">{recipientName}</strong>
                <span className="party-phone">Phone: {recipientPhone}</span>
                <p className="party-addr">{recipientAddress}, <span className="capitalize">{recipientCity}</span></p>
              </div>
            </div>

            {/* Parcel details row */}
            <div className="awb-details-grid">
              <div className="awb-detail-cell">
                <span className="cell-label">Weight</span>
                <strong>{weight} kg</strong>
              </div>
              <div className="awb-detail-cell">
                <span className="cell-label">Dimensions</span>
                <strong>
                  {length && width && height ? `${length}x${width}x${height} cm` : 'N/A'}
                </strong>
              </div>
              <div className="awb-detail-cell">
                <span className="cell-label">Payment Tier</span>
                <strong className="uppercase">{paymentMode}</strong>
              </div>
              <div className="awb-detail-cell cell-highlight">
                <span className="cell-label">
                  {paymentMode === 'cod' ? 'COD CASH COLLECTION' : 'ESTIMATED POSTAGE'}
                </span>
                <strong className="cell-price">
                  {paymentMode === 'cod' ? formatPKR(parseFloat(codAmount)) : formatPKR(estimatedPrice)}
                </strong>
              </div>
            </div>

            {/* Legal warning signature block */}
            <div className="awb-footer-warning flex-center justify-between">
              <div className="warning-note">
                <span className="warning-hdr">NEXIS SECURITY SEAL & AUDIT NOTE</span>
                <p>This parcel contains NADRA biometric registered logistics items. Subject to visual audit upon pickup.</p>
              </div>
              <div className="signature-box flex-center">
                <span className="sig-label">Receiver Signature</span>
              </div>
            </div>

          </div>

          {/* Success checklist and buttons - Hidden on Print */}
          <div className="success-banner no-print card text-center flex-center">
            <CheckCircle2 size={48} className="success-icon animate-bounce" />
            <h2>Shipment Booked Successfully!</h2>
            <p className="success-desc">
              Your airway bill and mock tracking details have been generated. A NEXIS dispatch rider will arrive at your pickup address in <strong className="capitalize">{senderCity}</strong> within 2 hours.
            </p>
            <div className="action-button-group flex-center">
              <button onClick={handlePrint} className="btn btn-secondary flex-center btn-print">
                <Printer size={18} />
                <span>Print Airway Bill label</span>
              </button>
              <button 
                onClick={() => {
                  setStep(1);
                  setSenderName('');
                  setSenderPhone('');
                  setSenderAddress('');
                  setSenderCity('');
                  setRecipientName('');
                  setRecipientPhone('');
                  setRecipientAddress('');
                  setRecipientCity('');
                  setWeight('1');
                  setLength('');
                  setWidth('');
                  setHeight('');
                  setDeclaredValue('');
                  setCodAmount('');
                  setPaymentMode('cod');
                }} 
                className="btn btn-outline"
              >
                Book Another Package
              </button>
            </div>
          </div>

        </div>
      )}

      <style jsx>{`
        .booking-card {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 2.5rem;
        }

        /* Wizard Node Styling */
        .wizard-stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3.5rem;
          position: relative;
        }

        .wizard-stepper::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 5%;
          right: 5%;
          height: 3px;
          background-color: var(--border-color);
          z-index: 1;
        }

        .wizard-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          position: relative;
          z-index: 2;
        }

        .wizard-circle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-light);
          transition: all var(--transition-normal);
        }

        .wizard-node.active .wizard-circle {
          border-color: var(--primary-teal);
          color: var(--primary-teal);
          box-shadow: var(--shadow-glow);
          transform: scale(1.1);
        }

        .wizard-node.done .wizard-circle {
          background-color: var(--primary-teal);
          border-color: var(--primary-teal);
          color: white;
        }

        .wizard-label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-light);
          margin-top: 0.5rem;
        }

        .wizard-node.active .wizard-label,
        .wizard-node.done .wizard-label {
          color: var(--primary-navy);
          font-weight: 700;
        }

        :global([data-theme='dark']) .wizard-node.active .wizard-label,
        :global([data-theme='dark']) .wizard-node.done .wizard-label {
          color: #ffffff;
        }

        /* Form step */
        .step-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary-navy);
          gap: 0.5rem;
          justify-content: flex-start;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
        }

        :global([data-theme='dark']) .step-title {
          color: #ffffff;
        }

        .step-icon {
          color: var(--primary-teal);
        }

        .fields-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 600px) {
          .fields-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .full-width {
          grid-column: span 2;
        }

        @media (max-width: 600px) {
          .full-width {
            grid-column: span 1;
          }
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
          transition: all var(--transition-fast);
        }

        .form-input:focus {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
        }

        .input-error {
          border-color: var(--color-accent-orange);
        }

        .error-text {
          font-size: 0.75rem;
          color: var(--color-accent-orange);
          font-weight: 500;
          margin-top: 0.15rem;
        }

        /* Dimension fields */
        .dims-row {
          background-color: var(--bg-secondary);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        :global([data-theme='dark']) .dims-row {
          background-color: rgba(255, 255, 255, 0.02);
        }

        .dims-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .dims-label {
          color: #ffffff;
        }

        .dims-inputs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .dim-field {
          text-align: center;
          padding: 0.6rem;
        }

        .wizard-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          margin-top: 1rem;
        }

        @media (max-width: 480px) {
          .wizard-actions {
            flex-direction: column;
          }
        }

        .next-btn, .confirm-btn {
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          font-size: 1rem;
        }

        .back-btn {
          gap: 0.5rem;
          padding: 0.85rem 1.5rem;
        }

        /* Printable Airway Bill label ticket */
        .printable-airway-bill-ticket {
          background-color: white;
          color: #0F172A;
          border: 3px solid #0F172A;
          border-radius: var(--radius-sm);
          padding: 1.75rem;
          font-family: Arial, Helvetica, sans-serif;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .awb-header-bar {
          border-bottom: 2px solid #0F172A;
          padding-bottom: 1rem;
        }

        .awb-logo {
          display: flex;
          flex-direction: column;
          line-height: 1.1;
        }

        .logo-text {
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.5px;
          color: #1E3A5F;
        }

        .logo-sub {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #0D9488;
        }

        .awb-service-badge {
          background-color: #0F172A;
          color: white;
          padding: 0.35rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .awb-tracking-bar-row {
          display: grid;
          grid-template-columns: 0.5fr 1.5fr;
          gap: 1.5rem;
          align-items: center;
          border-bottom: 2px solid #0F172A;
          padding-bottom: 1.25rem;
        }

        .barcode-mock-icon {
          color: #0F172A;
        }

        .awb-code-details {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .awb-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          letter-spacing: 1px;
        }

        .awb-num {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.2;
        }

        .awb-routing {
          font-size: 0.95rem;
          font-weight: 700;
          color: #1E293B;
          margin-top: 0.25rem;
        }

        .awb-grid-parties {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          border-bottom: 2px solid #0F172A;
          padding-bottom: 1.5rem;
        }

        @media (max-width: 500px) {
          .awb-grid-parties {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
        }

        .party-block {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          font-size: 0.85rem;
        }

        .party-hdr {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.2rem;
          margin-bottom: 0.4rem;
        }

        .party-name {
          font-size: 1rem;
          color: #0F172A;
        }

        .party-phone {
          font-weight: 600;
        }

        .party-addr {
          color: #475569;
          line-height: 1.4;
        }

        .awb-details-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-bottom: 2px solid #0F172A;
          padding-bottom: 1.25rem;
          gap: 1rem;
        }

        @media (max-width: 500px) {
          .awb-details-grid {
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
          }
        }

        .awb-detail-cell {
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }

        .cell-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #64748B;
          margin-bottom: 0.2rem;
        }

        .cell-highlight {
          border-left: 1px dashed #CBD5E1;
          padding-left: 1rem;
        }

        @media (max-width: 500px) {
          .cell-highlight {
            border-left: none;
            padding-left: 0;
            grid-column: span 2;
            border-top: 1px dashed #CBD5E1;
            padding-top: 0.5rem;
          }
        }

        .cell-price {
          font-size: 1.3rem;
          color: #0F172A;
        }

        .awb-footer-warning {
          font-size: 0.8rem;
          gap: 1.5rem;
        }

        @media (max-width: 500px) {
          .awb-footer-warning {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .warning-note {
          max-width: 70%;
          text-align: left;
        }

        @media (max-width: 500px) {
          .warning-note {
            max-width: 100%;
          }
        }

        .warning-hdr {
          font-size: 0.65rem;
          font-weight: 700;
          color: #EF4444;
          display: block;
          margin-bottom: 0.15rem;
        }

        .warning-note p {
          color: #64748B;
          font-size: 0.75rem;
          line-height: 1.3;
        }

        .signature-box {
          border: 1px solid #94A3B8;
          border-radius: var(--radius-sm);
          width: 180px;
          height: 50px;
          align-items: flex-end;
          padding-bottom: 0.4rem;
          background-color: #F8FAFC;
        }

        .sig-label {
          font-size: 0.6rem;
          color: #64748B;
          font-weight: 500;
        }

        /* Success banner */
        .success-banner {
          background-color: var(--bg-primary);
          padding: 3rem 2.5rem;
          border-radius: var(--radius-lg);
          gap: 1rem;
        }

        .success-icon {
          color: var(--color-accent-emerald);
        }

        .success-desc {
          color: var(--text-secondary);
          max-width: 500px;
          margin-bottom: 1.5rem;
        }

        .action-button-group {
          gap: 1rem;
        }

        .btn-print {
          gap: 0.5rem;
          padding: 0.75rem 2rem;
        }

        /* PRINT STYLES MEDIA INJECT */
        @media print {
          /* Hide anything except the airway ticket label */
          body * {
            visibility: hidden;
            background: transparent !important;
            box-shadow: none !important;
          }
          
          .printable-airway-bill-ticket,
          .printable-airway-bill-ticket * {
            visibility: visible;
          }

          .printable-airway-bill-ticket {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 2px solid #000 !important;
            padding: 1rem !important;
            margin: 0 !important;
          }

          /* Remove page headers/footers */
          @page {
            margin: 0.5cm;
          }
        }
      `}</style>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="booking-page-container">
      {/* Header */}
      <section className="booking-header gradient-teal-navy text-white no-print">
        <div className="container text-center animate-fade-in">
          <h1 className="page-title">Book a Shipment</h1>
          <p className="page-subtitle">
            Instantly schedule doorstep package pickup and generate printable delivery airway labels.
          </p>
        </div>
      </section>

      {/* Wizard */}
      <section className="section booking-main-section">
        <div className="container">
          <Suspense fallback={
            <div className="card flex-center padding-xl">
              <p>Loading booking wizards...</p>
            </div>
          }>
            <BookingWizard />
          </Suspense>
        </div>
      </section>

      <style jsx>{`
        .booking-page-container {
          width: 100%;
        }

        .booking-header {
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

        .booking-main-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        @media print {
          .booking-main-section {
            background-color: transparent !important;
            padding: 0 !important;
          }
          .container {
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
