import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, X } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  fullName: string;
  organization: string;
  onCopyLink: () => void;
}

export function QrModal({
  isOpen,
  onClose,
  url,
  fullName,
  organization,
  onCopyLink,
}: QrModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#061A14]/65 backdrop-blur-sm p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#DCE5DF]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full grid grid-cols-3" aria-hidden="true">
          <div className="bg-[#10B981]" />
          <div className="bg-[#EC4899]" />
          <div className="bg-[#FACC15]" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2
                id="qr-modal-title"
                className="font-display text-xl font-bold text-[#0B3B2E] tracking-tight"
              >
                Kod QR Kad Digital
              </h2>
              <p className="text-xs text-[#4A635A] mt-1">
                Imbas menggunakan kamera telefon untuk membuka kad ini.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup paparan kod QR"
              className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 rounded-full text-[#4A635A] hover:text-[#0B3B2E] hover:bg-[#EDF3EF] flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#F6FAF7] border border-[#DCE5DF] rounded-2xl p-6 flex flex-col items-center">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <QRCodeSVG
                value={url}
                size={196}
                bgColor="#FFFFFF"
                fgColor="#0B3B2E"
                level="M"
              />
            </div>
            <p className="font-display font-bold text-sm text-[#0B3B2E] mt-4 text-center">
              {fullName}
            </p>
            <p className="text-xs text-[#546E64] mt-0.5 text-center">
              {organization}
            </p>
          </div>

          <button
            type="button"
            onClick={onCopyLink}
            className="mt-5 w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0B3B2E] hover:bg-[#0F4D3C] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
          >
            <Copy className="w-4 h-4 text-[#FACC15]" />
            <span className="whitespace-nowrap">Salin Pautan Kad</span>
          </button>
        </div>
      </div>
    </div>
  );
}
