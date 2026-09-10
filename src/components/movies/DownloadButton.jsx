import React, { useState } from 'react';
import { Download, ShieldCheck, AlertCircle, FileCheck } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { downloadService } from '../../services/downloadService';

/**
 * DownloadButton strictly enforces legal eligibility.
 * Only renders active download mechanism if movie.downloadable === true AND movie.legalDownloadUrl exists.
 */
export function DownloadButton({
  movie,
  size = 'md',
  variant = 'primary',
  showUnavailableText = false,
  className = ''
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!movie) return null;

  const isEligible = downloadService.canDownloadMovie(movie);

  if (!isEligible) {
    if (showUnavailableText) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: '#64748b',
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          padding: '0.35rem 0.65rem',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <AlertCircle size={13} />
          Download unavailable (Streaming only)
        </span>
      );
    }
    return null;
  }

  const handleStartDownload = () => {
    try {
      downloadService.triggerLegalDownload(movie);
      setModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        icon={Download}
        onClick={() => setModalOpen(true)}
        className={className}
        title={`Download ${movie.title} legally (${movie.license})`}
      >
        Download Legally
      </Button>

      {/* Confirmation & License Verification Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Authorized Legal Download"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#cbd5e1' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem',
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399'
          }}>
            <ShieldCheck size={24} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
              <strong>Direct Official Source:</strong> This media file is provided by{' '}
              <strong>{movie.source}</strong> under license: <em>{movie.license}</em>.
            </div>
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            <div><strong>Film:</strong> {movie.title} ({movie.year || 'Public Domain'})</div>
            <div><strong>Format:</strong> {movie.quality || 'MP4 Video'}</div>
            {movie.fileSize && <div><strong>Estimated Size:</strong> {movie.fileSize}</div>}
            <div style={{ wordBreak: 'break-all', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              <strong>Official Direct URL:</strong><br />
              <span style={{ color: '#06b6d4' }}>{movie.legalDownloadUrl}</span>
            </div>
          </div>

          <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: '1.5' }}>
            By downloading, you acknowledge that you are obtaining an authentic public-domain or openly licensed copy in compliance with the author's terms and archive distribution policies.
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" icon={FileCheck} onClick={handleStartDownload}>
              Confirm & Start Download
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default DownloadButton;
