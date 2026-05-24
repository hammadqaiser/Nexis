'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, AlertCircle } from 'lucide-react';

export default function TrackingBar() {
  const [trackingId, setTrackingId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = trackingId.trim().toUpperCase();

    if (!trimmedId) {
      setError('Please enter a tracking number.');
      return;
    }

    // AWB regex validation: starts with letters, ends with letters, numbers in between
    // E.g. NX12345678PK or a sequence of 8-15 characters
    const awbRegex = /^[A-Z0-9-]{8,15}$/;
    if (!awbRegex.test(trimmedId)) {
      setError('Invalid format. Tracking IDs are 8-15 characters long (alphanumeric).');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/tracking?id=${trimmedId}`);
    }, 600);
  };

  return (
    <div className="tracking-bar-card glass animate-fade-in">
      <form onSubmit={handleTrack} className="tracking-form">
        <div className="input-group">
          <input
            type="text"
            id="quick-tracking-input"
            value={trackingId}
            onChange={(e) => {
              setTrackingId(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter AWB / Tracking Number (e.g., NX12345678PK)..."
            className={`tracking-input ${error ? 'has-error' : ''}`}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          id="quick-track-submit-btn"
          className="btn btn-primary track-btn"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="spinner" size={18} />
              <span>Checking...</span>
            </>
          ) : (
            <span>Track Parcel</span>
          )}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <style jsx>{`
        .tracking-bar-card {
          width: 100%;
          max-width: 750px;
          margin: 0 auto;
          border-radius: var(--radius-lg);
          padding: 1.25rem;
          box-shadow: var(--shadow-xl);
          position: relative;
          z-index: 10;
        }

        .tracking-form {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        @media (max-width: 600px) {
          .tracking-form {
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
          background-color: #FFFFFF !important;
          border: 1px solid #CBD5E1 !important;
          border-radius: var(--radius-md);
          font-size: 1rem;
          outline: none;
          transition: all var(--transition-fast);
          color: #0F172A !important;
        }

        .tracking-input::placeholder {
          color: #64748B !important;
          opacity: 0.9 !important;
        }

        .tracking-input:focus {
          border-color: var(--primary-teal) !important;
          box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.2) !important;
        }

        .tracking-input.has-error {
          border-color: var(--color-accent-orange) !important;
        }

        .track-btn {
          white-space: nowrap;
          padding: 0.85rem 2rem;
          font-size: 1rem;
          height: 100%;
          min-width: 150px;
        }

        @media (max-width: 600px) {
          .track-btn {
            width: 100%;
          }
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          color: var(--color-accent-orange);
          font-size: 0.85rem;
          padding-left: 0.5rem;
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
