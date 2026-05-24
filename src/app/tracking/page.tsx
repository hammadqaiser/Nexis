'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, Calendar, User, Package, ShieldCheck, AlertCircle, Info, Share2, Clipboard, CheckCircle2 } from 'lucide-react';
import mockTrackingData from '@/data/mockTracking.json';

// Define status thresholds for standard logistics stepper progress
const STATUS_STEPS = ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];

function TrackingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryId = searchParams.get('id') || '';

  const [searchVal, setSearchVal] = useState(queryId);
  const [trackingId, setTrackingId] = useState(queryId);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [shipment, setShipment] = useState<any>(null);

  useEffect(() => {
    if (queryId) {
      setTrackingId(queryId);
      setSearchVal(queryId);
      lookupShipment(queryId);
    } else {
      setShipment(null);
    }
  }, [queryId]);

  const lookupShipment = async (awbId: string) => {
    setError('');
    const id = awbId.trim().toUpperCase();
    
    if (!id) {
      setError('Please enter a tracking number.');
      setShipment(null);
      return;
    }

    try {
      const response = await fetch(`/api/tracking?id=${id}`);
      const data = await response.json();
      if (data.success && data.shipment) {
        setShipment(data.shipment);
        return;
      }
    } catch (err) {
      console.log('Failed to check database tracking, falling back to mock JSON:', err);
    }

    const data = (mockTrackingData as any)[id];
    if (data) {
      setShipment(data);
    } else {
      setError(`Tracking number "${id}" not found in our records. Please verify the code or try one of the mock demo codes listed below.`);
      setShipment(null);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/tracking?id=${searchVal.trim().toUpperCase()}`);
    } else {
      setError('Please enter a tracking number.');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/tracking?id=${trackingId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Determine standard index for stepper coloring
  const getStatusStepIndex = (status: string) => {
    return STATUS_STEPS.indexOf(status);
  };

  const currentStepIdx = shipment ? getStatusStepIndex(shipment.status) : -1;

  return (
    <div className="tracking-wrapper">
      {/* Search Bar section */}
      <div className="card search-card animate-fade-in">
        <h2 className="search-title">Track & Trace Your Shipment</h2>
        <form onSubmit={handleSearchSubmit} className="tracking-page-form">
          <div className="input-group">
            <input
              type="text"
              id="tracking-search-input"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder="Enter AWB / tracking number (e.g. NX10020030PK)..."
              className="tracking-input"
            />
          </div>
          <button type="submit" id="track-submit-btn" className="btn btn-primary track-btn">
            Track Shipment
          </button>
        </form>

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} className="error-icon" />
            <div className="error-text">
              <p>{error}</p>
              <div className="mock-codes">
                <span>Demo Codes:</span>
                <button type="button" className="mock-pill" onClick={() => { setSearchVal('NX10020030PK'); router.push('/tracking?id=NX10020030PK'); }}>NX10020030PK (Delivered)</button>
                <button type="button" className="mock-pill" onClick={() => { setSearchVal('NX99988877PK'); router.push('/tracking?id=NX99988877PK'); }}>NX99988877PK (In Transit)</button>
                <button type="button" className="mock-pill" onClick={() => { setSearchVal('NX55544433PK'); router.push('/tracking?id=NX55544433PK'); }}>NX55544433PK (Booked)</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Shipment details if found */}
      {shipment && (
        <div className="shipment-grid">
          
          {/* Main timeline of checkpoints */}
          <div className="card timeline-card animate-fade-in">
            <div className="timeline-header flex-center">
              <h3>Shipment Progress History</h3>
              <button onClick={handleCopyLink} className="btn-share flex-center">
                {copied ? <CheckCircle2 size={16} className="text-success" /> : <Share2 size={16} />}
                <span>{copied ? 'Link Copied!' : 'Share Tracking'}</span>
              </button>
            </div>

            {/* Linear Progress Stepper */}
            <div className="stepper-wrapper">
              <div className="stepper-line">
                <div 
                  className="stepper-progress-fill" 
                  style={{ width: `${(currentStepIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
                ></div>
              </div>
              <div className="stepper-nodes">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={`step-${idx}`} className={`step-node-col ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="step-node-circle flex-center">
                        {isCompleted ? <CheckCircle2 size={14} /> : <span>{idx + 1}</span>}
                      </div>
                      <span className="step-node-label">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Checkpoint Timeline */}
            <div className="vertical-timeline">
              {shipment.checkpoints.map((cp: any, idx: number) => {
                const isFirst = idx === 0;
                return (
                  <div key={`cp-${idx}`} className={`timeline-item ${isFirst ? 'active' : ''}`}>
                    <div className="timeline-bullet flex-center">
                      <div className="bullet-dot"></div>
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-time">{cp.time}</span>
                        <span className="timeline-location flex-center">
                          <MapPin size={12} />
                          <span>{cp.location}</span>
                        </span>
                      </div>
                      <h4 className="timeline-activity">{cp.activity}</h4>
                      <p className="timeline-desc">{cp.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Sidebar */}
          <div className="sidebar-column animate-fade-in" style={{ animationDelay: '150ms' }}>
            {/* Core Info */}
            <div className="card details-card">
              <h3 className="card-sec-title">Shipment Information</h3>
              <div className="details-rows">
                <div className="details-row">
                  <span>AWB Number:</span>
                  <strong>{shipment.awb}</strong>
                </div>
                <div className="details-row">
                  <span>Current Status:</span>
                  <span className={`status-badge badge-${shipment.status.toLowerCase().replace(/ /g, '-')}`}>
                    {shipment.status}
                  </span>
                </div>
                <div className="details-row">
                  <span>Service Tier:</span>
                  <strong>{shipment.service}</strong>
                </div>
                <div className="details-row">
                  <span>Estimated Delivery:</span>
                  <strong className="flex-center gap-xs">
                    <Calendar size={14} className="icon-teal" />
                    <span>{shipment.estDelivery}</span>
                  </strong>
                </div>
              </div>
            </div>

            {/* Shipper & Consignee */}
            <div className="card parties-card">
              <h3 className="card-sec-title">Parties & Routing</h3>
              <div className="details-rows">
                <div className="details-row">
                  <span>Origin:</span>
                  <strong>{shipment.origin}</strong>
                </div>
                <div className="details-row">
                  <span>Destination:</span>
                  <strong>{shipment.destination}</strong>
                </div>
                <div className="details-row">
                  <span>Shipper:</span>
                  <strong className="text-secondary">{shipment.shipper}</strong>
                </div>
                <div className="details-row">
                  <span>Consignee:</span>
                  <strong className="text-secondary">{shipment.consignee}</strong>
                </div>
              </div>
            </div>

            {/* Package details */}
            <div className="card package-card">
              <h3 className="card-sec-title">Parcel Details</h3>
              <div className="details-rows">
                <div className="details-row">
                  <span>Weight:</span>
                  <strong>{shipment.weight} kg</strong>
                </div>
                <div className="details-row">
                  <span>Pieces:</span>
                  <strong>{shipment.pieces} Pcs</strong>
                </div>
                {shipment.codAmount > 0 ? (
                  <div className="details-row cod-amount-row">
                    <span>COD Remittance:</span>
                    <strong className="text-gradient">{shipment.codAmount} PKR</strong>
                  </div>
                ) : (
                  <div className="details-row">
                    <span>Payment Tier:</span>
                    <span className="prepaid-badge">Prepaid</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default function TrackingPage() {
  return (
    <div className="tracking-page-container">
      {/* Header */}
      <section className="tracking-header gradient-teal-navy text-white">
        <div className="container text-center animate-fade-in">
          <h1 className="page-title">Shipment Tracking</h1>
          <p className="page-subtitle">
            Get instant real-time progress updates on your domestic and international packages.
          </p>
        </div>
      </section>

      {/* Main Form & Results */}
      <section className="section tracking-main-section">
        <div className="container">
          <Suspense fallback={
            <div className="card flex-center padding-xl">
              <p>Loading tracking modules...</p>
            </div>
          }>
            <TrackingContent />
          </Suspense>
        </div>
      </section>

      <style jsx global>{`
        .tracking-page-container {
          width: 100%;
        }

        .tracking-header {
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

        .tracking-main-section {
          background-color: var(--bg-secondary);
          transition: background-color var(--transition-normal);
        }

        .tracking-wrapper {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          max-width: 950px;
          margin: 0 auto;
        }

        /* Search Card */
        .search-card {
          padding: 2.5rem 2rem;
        }

        .search-title {
          font-family: var(--font-heading);
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 1.25rem;
          text-align: center;
        }

        :global([data-theme='dark']) .search-title {
          color: #ffffff;
        }

        .tracking-page-form {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        @media (max-width: 600px) {
          .tracking-page-form {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
        }

        .input-group {
          position: relative;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }

        .tracking-input {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
          outline: none;
          transition: all var(--transition-fast);
          color: var(--text-primary);
        }

        .tracking-input:focus {
          border-color: var(--primary-teal);
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.15);
        }

        .track-btn {
          white-space: nowrap;
          padding: 0.85rem 2rem;
          font-size: 1rem;
        }

        /* Error banner with demo buttons */
        .error-banner {
          margin-top: 1.5rem;
          background-color: rgba(249, 115, 22, 0.08);
          border: 1px solid rgba(249, 115, 22, 0.2);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .error-icon {
          color: var(--color-accent-orange);
          flex-shrink: 0;
          margin-top: 0.2rem;
        }

        .error-text {
          font-size: 0.9rem;
          color: var(--text-primary);
          line-height: 1.5;
        }

        .mock-codes {
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .mock-codes span {
          font-weight: 700;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .mock-pill {
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--primary-teal);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mock-pill:hover {
          background-color: var(--primary-teal);
          color: white;
          border-color: var(--primary-teal);
        }

        /* Shipment Results Grid */
        .shipment-grid {
          display: grid;
          grid-template-columns: 1.6fr 0.9fr;
          gap: 2rem;
          align-items: flex-start;
        }

        @media (max-width: 850px) {
          .shipment-grid {
            grid-template-columns: 1fr;
          }
        }

        .timeline-card {
          padding: 2.5rem 2rem;
        }

        .timeline-header {
          justify-content: space-between;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.25rem;
          margin-bottom: 2rem;
        }

        .timeline-header h3 {
          font-family: var(--font-heading);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary-navy);
        }

        :global([data-theme='dark']) .timeline-header h3 {
          color: #ffffff;
        }

        .btn-share {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: all var(--transition-fast);
        }

        .btn-share:hover {
          color: var(--primary-teal);
          border-color: var(--primary-teal);
          background-color: var(--bg-secondary);
        }

        /* Horizontal Progress Stepper */
        .stepper-wrapper {
          position: relative;
          padding: 1rem 0 2rem 0;
          margin-bottom: 2rem;
          border-bottom: 1px dashed var(--border-color);
        }

        .stepper-line {
          position: absolute;
          top: 30px;
          left: 10%;
          right: 10%;
          height: 4px;
          background-color: var(--border-color);
          z-index: 1;
        }

        .stepper-progress-fill {
          height: 100%;
          background-color: var(--primary-teal);
          transition: width 0.6s ease-in-out;
        }

        .stepper-nodes {
          display: flex;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .step-node-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 80px;
          text-align: center;
        }

        .step-node-circle {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-light);
          transition: all var(--transition-normal);
        }

        .step-node-col.completed .step-node-circle {
          background-color: var(--primary-teal);
          border-color: var(--primary-teal);
          color: white;
        }

        .step-node-col.current .step-node-circle {
          background-color: var(--bg-primary);
          border-color: var(--primary-teal);
          color: var(--primary-teal);
          box-shadow: var(--shadow-glow);
        }

        .step-node-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: var(--text-light);
          margin-top: 0.5rem;
          line-height: 1.2;
          transition: color var(--transition-fast);
        }

        .step-node-col.completed .step-node-label,
        .step-node-col.current .step-node-label {
          color: var(--primary-navy);
          font-weight: 700;
        }

        :global([data-theme='dark']) .step-node-col.completed .step-node-label,
        :global([data-theme='dark']) .step-node-col.current .step-node-label {
          color: #ffffff;
        }

        /* Vertical Checkpoint Timeline */
        .vertical-timeline {
          display: flex;
          flex-direction: column;
          position: relative;
          padding-left: 2rem;
          margin-left: 0.5rem;
        }

        .vertical-timeline::before {
          content: '';
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: 6px;
          width: 2px;
          background-color: var(--border-color);
        }

        .timeline-item {
          position: relative;
          padding-bottom: 2rem;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-bullet {
          position: absolute;
          left: -2rem;
          top: 4px;
          width: 14px;
          height: 14px;
          margin-left: -6px;
          border-radius: var(--radius-full);
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          z-index: 5;
          transition: all var(--transition-normal);
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background-color: var(--text-light);
        }

        /* Active/Newest Checkpoint style */
        .timeline-item.active .timeline-bullet {
          border-color: var(--primary-teal);
          background-color: var(--primary-teal);
          box-shadow: var(--shadow-glow);
          transform: scale(1.2);
        }

        .timeline-item.active .bullet-dot {
          background-color: white;
        }

        .timeline-content {
          display: flex;
          flex-direction: column;
        }

        .timeline-meta {
          display: flex;
          gap: 1.5rem;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .timeline-time {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-light);
        }

        .timeline-location {
          font-size: 0.75rem;
          color: var(--primary-teal);
          font-weight: 700;
          gap: 0.25rem;
        }

        .timeline-activity {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--primary-navy);
          margin-bottom: 0.25rem;
        }

        :global([data-theme='dark']) .timeline-activity {
          color: #ffffff;
        }

        .timeline-item.active .timeline-activity {
          color: var(--primary-teal);
        }

        .timeline-desc {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Sidebar Column */
        .sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .details-card,
        .parties-card,
        .package-card {
          padding: 1.75rem;
        }

        .card-sec-title {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-navy);
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 0.75rem;
          margin-bottom: 1.25rem;
        }

        :global([data-theme='dark']) .card-sec-title {
          color: #ffffff;
        }

        .details-rows {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .details-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .details-row strong {
          color: var(--text-primary);
        }

        .gap-xs {
          gap: 0.25rem;
        }

        .icon-teal {
          color: var(--primary-teal);
        }

        /* Status badges coloring */
        .status-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        .badge-delivered {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--color-accent-emerald);
        }

        .badge-in-transit {
          background-color: rgba(13, 148, 136, 0.1);
          color: var(--primary-teal);
        }

        .badge-out-for-delivery {
          background-color: rgba(6, 182, 212, 0.1);
          color: var(--color-accent-cyan);
        }

        .badge-booked {
          background-color: rgba(100, 116, 139, 0.1);
          color: var(--text-secondary);
        }

        .prepaid-badge {
          background-color: rgba(30, 58, 95, 0.08);
          color: var(--primary-navy);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          text-transform: uppercase;
        }

        :global([data-theme='dark']) .prepaid-badge {
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .cod-amount-row {
          background-color: rgba(13, 148, 136, 0.03);
          border-top: 1px dashed var(--border-color);
          border-bottom: 1px dashed var(--border-color);
          padding: 0.5rem 0;
          font-weight: 700;
          color: var(--primary-teal);
        }

        .cta-booking-btn {
          width: 100%;
          padding: 0.75rem;
        }

        .footer-disclaimer {
          font-size: 0.7rem;
          color: var(--text-light);
          text-align: center;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
