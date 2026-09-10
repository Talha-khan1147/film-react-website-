import React from 'react';
import { ShieldCheck, Scale, ExternalLink, HelpCircle, Download, Film, CheckCircle2 } from 'lucide-react';
import { LEGAL_SOURCES } from '../constants/sources';

export function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '960px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '999px',
          color: '#fbbf24',
          fontSize: '0.8rem',
          fontWeight: '700',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          <Scale size={14} />
          <span>Ethics & Copyright Compliance</span>
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f8fafc', marginBottom: '0.75rem' }}>
          About FreeFlix Library
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Our mission is to celebrate open culture by organizing and spotlighting legitimate, public-domain, and openly licensed films preserved by worldwide cultural archives.
        </p>
      </div>

      {/* Mission & Legal Foundation */}
      <section style={{
        backgroundColor: '#111827',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="#10b981" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc' }}>
            Our Strict Legal Guarantee
          </h2>
        </div>
        <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem' }}>
          FreeFlix Library strictly indexes films that are legally available for free. We do not host, scrape, mirror, or link to unauthorized copyrighted content. We never bypass digital rights management (DRM), paywalls, authentication systems, or geographic restrictions. Every film featured here falls into one of three categories:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginTop: '0.5rem'
        }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontSize: '1rem', color: '#34d399', marginBottom: '0.5rem', fontWeight: '700' }}>
              1. Public Domain Films
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Works whose intellectual property rights have expired (such as pre-1929 films), or whose copyright was not renewed under historic laws (e.g. <em>Night of the Living Dead</em>, <em>His Girl Friday</em>, <em>Charade</em>).
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontSize: '1rem', color: '#38bdf8', marginBottom: '0.5rem', fontWeight: '700' }}>
              2. Creative Commons Licenses
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Modern creative works whose copyright holders have chosen to publish their films with open licenses allowing public streaming and distribution (e.g. Blender Open Projects like <em>Sintel</em> and <em>Big Buck Bunny</em>).
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <h3 style={{ fontSize: '1rem', color: '#fbbf24', marginBottom: '0.5rem', fontWeight: '700' }}>
              3. Dedicated Open Archives
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
              Cultural and educational foundations that preserve historic moving image records with permission to view publicly.
            </p>
          </div>
        </div>
      </section>

      {/* Why Some Movies Have Watch But No Download */}
      <section style={{
        backgroundColor: '#111827',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <HelpCircle size={24} color="#f59e0b" />
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc' }}>
            Why do some films show "Watch Online" but not "Download"?
          </h2>
        </div>
        <p style={{ color: '#cbd5e1', lineHeight: '1.7', fontSize: '0.95rem' }}>
          In accordance with our strict legal principles:
        </p>
        <ul style={{ color: '#94a3b8', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <li>
            A <strong>Download</strong> button is only displayed when the authentic preservation archive provides an explicit, official direct download file (e.g., MP4 or WebM) and the licensing terms authorize offline copies.
          </li>
          <li>
            If a repository provides streaming embed privileges but does not authorize or provide a dedicated public download endpoint, the title is classified as <em>streaming-only</em>.
          </li>
          <li>
            We <strong>never pretend</strong> that an unavailable movie is downloadable, and we will never generate unauthorized links or circumvent distribution parameters.
          </li>
        </ul>
      </section>

      {/* Configured Sources & Attribution */}
      <section style={{
        backgroundColor: '#111827',
        borderRadius: '16px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem' }}>
            Configured Sources & Attribution
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.925rem' }}>
            We credit and link back to the authorized digital repositories that preserve these cinematic works:
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.values(LEGAL_SOURCES).map((src) => (
            <div
              key={src.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                padding: '1.25rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ maxWidth: '600px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc', marginBottom: '0.25rem' }}>
                  {src.name}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                  {src.description}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span className="badge badge-source">{src.licenseStandard}</span>
                </div>
              </div>
              <a
                href={src.homepage}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#38bdf8',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <span>Visit Archive</span>
                <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
