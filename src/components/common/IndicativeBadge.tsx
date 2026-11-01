import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ExternalLink, Info, X } from 'lucide-react';
import { DataQualityRecord } from '../../types';

interface IndicativeBadgeProps {
  record?: DataQualityRecord;
  confidence?: 'low' | 'medium' | 'high';
  source?: string;
  lastVerifiedAt?: string | null;
  verifyAt?: string;
  size?: 'xs' | 'sm' | 'md';
  onVerify?: () => void;
  className?: string;
  asSpan?: boolean;
}

export const IndicativeBadge: React.FC<IndicativeBadgeProps> = ({
  record,
  confidence: propConfidence,
  source: propSource,
  lastVerifiedAt: propLastVerifiedAt,
  verifyAt: propVerifyAt,
  size = 'sm',
  onVerify,
  className = '',
  asSpan = false
}) => {
  const [showModal, setShowModal] = useState(false);

  // Extract from record or direct props
  const confidence = record?.confidence ?? propConfidence ?? 'low';
  const source = record?.source ?? propSource ?? 'Industry survey snapshot';
  const lastVerifiedAt = record?.lastVerifiedAt !== undefined ? record.lastVerifiedAt : propLastVerifiedAt;
  const verifyAt = record?.verifyAt ?? propVerifyAt ?? 'Official regulatory portal';
  const verifiedBy = record?.verifiedBy;

  const isIndicative = confidence === 'low' || !lastVerifiedAt;

  const Tag = asSpan ? 'span' : 'button';
  const tagProps = asSpan 
    ? {
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }
        }
      } 
    : { type: 'button' as const };

  return (
    <>
      {isIndicative ? (
        <Tag
          {...tagProps}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className={`inline-flex items-center gap-1 font-mono font-bold tracking-tight rounded border transition-colors cursor-pointer text-left ${
            size === 'xs' 
              ? 'text-[9px] px-1.5 py-0.2 bg-amber-500/15 text-amber-900 border-amber-500/30 hover:bg-amber-500/25' 
              : 'text-[10px] px-2 py-0.5 bg-amber-500/15 text-amber-900 border-amber-500/35 hover:bg-amber-500/25'
          } ${className}`}
          title="Data is indicative: click to view source citation and verification requirements"
        >
          <AlertTriangle className={size === 'xs' ? 'w-2.5 h-2.5 text-amber-700 shrink-0' : 'w-3 h-3 text-amber-700 shrink-0'} />
          <span>Indicative · verify</span>
        </Tag>
      ) : confidence === 'medium' ? (
        <Tag
          {...tagProps}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className={`inline-flex items-center gap-1 font-mono font-medium rounded border transition-colors cursor-pointer ${
            size === 'xs'
              ? 'text-[9px] px-1 py-0.2 bg-blue-50 text-blue-800 border-blue-200'
              : 'text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
          } ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <span>Verified (Mid)</span>
        </Tag>
      ) : (
        <Tag
          {...tagProps}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className={`inline-flex items-center gap-1 font-mono font-medium rounded border transition-colors cursor-pointer ${
            size === 'xs'
              ? 'text-[9px] px-1 py-0.2 bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          } ${className}`}
        >
          <CheckCircle2 className={size === 'xs' ? 'w-2.5 h-2.5 text-emerald-600' : 'w-3 h-3 text-emerald-600'} />
          <span>Verified</span>
        </Tag>
      )}

      {/* Verification & Data Quality Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl border border-[#2B4560]/20 max-w-md w-full p-6 space-y-4 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#2B4560]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${isIndicative ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                  {isIndicative ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0B1B2B]">
                    Data Quality & Verification Card
                  </h3>
                  <span className="text-[11px] font-mono text-[#2B4560]/70">
                    Rule: Statutory & Contractual Integrity
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Warning if Indicative */}
            {isIndicative && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Mandatory Verification Warning</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  This rate, figure, or requirement is marked <strong className="font-semibold">Indicative</strong>. Per FUNDI fiduciary standards, it <strong className="underline">cannot be used in final binding contracts or statutory checklists</strong> until verified against cited official sources.
                </p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#2B4560]/70">Confidence Level:</span>
                <span className={`font-mono font-bold uppercase text-[11px] px-2 py-0.5 rounded ${
                  confidence === 'high' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : confidence === 'medium'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {confidence}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#2B4560]/70">Cited Source:</span>
                <span className="font-semibold text-[#0B1B2B] text-right max-w-[240px] truncate" title={source}>
                  {source}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#2B4560]/70">Last Verified Date:</span>
                <span className="font-mono text-[#0B1B2B]">
                  {lastVerifiedAt ? lastVerifiedAt : <span className="text-amber-700 font-bold">Unverified</span>}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-[#2B4560]/70">Verify At:</span>
                <span className="font-mono text-[#1F6FEB] flex items-center gap-1">
                  <span>{verifyAt}</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>

              {verifiedBy && (
                <div className="flex justify-between py-1.5 border-b border-gray-100">
                  <span className="text-[#2B4560]/70">Verified Auditor:</span>
                  <span className="font-mono text-emerald-800">{verifiedBy}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              {onVerify && isIndicative && (
                <button
                  type="button"
                  onClick={() => {
                    onVerify();
                    setShowModal(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                >
                  Verify Record (Admin)
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#0B1B2B] font-semibold text-xs rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
