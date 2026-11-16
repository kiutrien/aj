import { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Share2,
  UserPlus,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { QrModal } from './components/QrModal';
import {
  PROFILE,
  getCallUrl,
  getEmailUrl,
  getFormattedDisplayPhone,
  getWhatsAppUrl,
  triggerVCardDownload,
} from './data/profile';

type CopiedField = 'phone' | 'email' | 'link' | null;

export default function App() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://asrin-jairi.card');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    if (!copiedField) return;
    const timer = window.setTimeout(() => {
      setCopiedField(null);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [copiedField]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const handleSaveContact = () => {
    const result = triggerVCardDownload(PROFILE);
    if (result.platform === 'ios') {
      showToast('Membuka kad kenalan terus di iPhone...');
    } else {
      showToast('Fail kenalan (.vcf) berjaya dimuat turun.');
    }
  };

  const copyToClipboard = async (
    value: string,
    field: CopiedField,
    label: string
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      showToast(`${label} telah disalin.`);
    } catch {
      showToast(`Sila salin secara manual: ${value}`);
    }
  };

  const handleShareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${PROFILE.fullName} — ${PROFILE.unit} ${PROFILE.organization}`,
          text: `${PROFILE.title} · ${PROFILE.unit} ${PROFILE.organization}`,
          url: currentUrl,
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }
    await copyToClipboard(currentUrl, 'link', 'Pautan kad digital');
  };

  const displayPhone = getFormattedDisplayPhone(PROFILE.phone);
  const whatsAppUrl = getWhatsAppUrl(PROFILE.phone);
  const callUrl = getCallUrl(PROFILE.phone);
  const emailUrl = getEmailUrl(PROFILE.email);

  return (
    <div className="min-h-screen bg-[#F4F7F4] text-[#0D211B] flex flex-col justify-center px-4 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-12">
      {/* Status Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-2rem)] px-4 py-3 rounded-xl bg-[#0B3B2E] text-white text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-xl border border-[#1E5C49]"
        >
          <Check className="w-4 h-4 text-[#FACC15] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_-18px_rgba(11,59,46,0.16)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Kolum Kiri / Bahagian Kepala: Identiti Profil (Tema Hijau, Pink & Kuning) */}
          <section className="lg:col-span-5 bg-[#0B3B2E] text-white flex flex-col justify-between relative overflow-hidden">
            {/* Garis Aksen Triwarna: Hijau · Pink · Kuning */}
            <div className="h-1.5 w-full grid grid-cols-3" aria-hidden="true">
              <div className="bg-[#10B981]" />
              <div className="bg-[#EC4899]" />
              <div className="bg-[#FACC15]" />
            </div>

            {/* Corak Geometri Halus Latar Belakang */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#EC4899]/10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-14 -bottom-20 w-52 h-52 rounded-full bg-[#FACC15]/10"
              aria-hidden="true"
            />

            <div className="relative p-6 sm:p-8 flex-1 flex flex-col justify-between gap-7">
              {/* Bar Atas Kad: Unit & Butang Kongsi / QR */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-wide text-[#FDE047]">
                    {PROFILE.unit}
                  </p>
                  <p className="text-sm font-medium text-white/90 mt-0.5 leading-snug">
                    {PROFILE.organization}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsQrOpen(true)}
                    aria-label="Tunjukkan kod QR kad"
                    className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-[#EC4899]/25 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareCard}
                    aria-label="Kongsi kad profil digital"
                    className="min-h-[44px] min-w-[44px] rounded-full bg-white/10 hover:bg-[#FACC15]/25 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FACC15]"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Monogram Initials AJ + Nama & Jawatan */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-5">
                <div className="relative shrink-0">
                  <div
                    className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-[#10B981] via-[#EC4899] to-[#FACC15] shadow-lg"
                    aria-hidden="true"
                  >
                    <div className="w-full h-full rounded-full bg-[#082920] flex items-center justify-center">
                      <span className="font-display text-2xl font-bold tracking-wider text-white">
                        {PROFILE.initials}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight [text-wrap:balance]">
                    {PROFILE.fullName}
                  </h1>
                  <p className="text-base font-medium text-[#F9A8D4] mt-1.5">
                    {PROFILE.title}
                  </p>
                  <p className="text-sm text-[#D1FAE5]/85 mt-1">
                    {PROFILE.unit} · {PROFILE.location}
                  </p>
                </div>
              </div>

              {/* Slogan & Butang Utama Simpan Kenalan */}
              <div className="space-y-5 pt-2">
                {PROFILE.tagline && (
                  <p className="text-sm italic text-[#FEF08A] leading-relaxed">
                    “{PROFILE.tagline}”
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-[#FACC15] hover:bg-[#FDE047] active:scale-[0.99] text-[#082920] font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">
                    Simpan Kenalan (Save Contact)
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Kolum Kanan: Tindakan Pantas, Butiran Hubungan & QR Desktop */}
          <section className="lg:col-span-7 bg-white p-6 sm:p-8 flex flex-col justify-between gap-7">
            <div>
              {/* Pengenalan Ringkas Bahagian Hubungan */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <h2 className="font-display text-lg font-bold text-[#0B3B2E] tracking-tight">
                  Saluran Hubungan Pantas
                </h2>
                <p className="text-xs text-[#546E64]">
                  Ketik untuk hubungi terus
                </p>
              </div>

              {/* 3 Butang Utama: WhatsApp (Hijau), Call (Pink), Email (Kuning) */}
              <div className="grid grid-cols-3 gap-3">
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[60px] px-3 py-3 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#065F46] font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#059669]"
                >
                  <MessageCircle className="w-5 h-5 text-[#059669]" />
                  <span className="whitespace-nowrap">WhatsApp</span>
                </a>

                <a
                  href={callUrl}
                  className="min-h-[60px] px-3 py-3 rounded-2xl bg-[#FDF2F8] hover:bg-[#FCE7F3] text-[#9D174D] font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DB2777]"
                >
                  <Phone className="w-5 h-5 text-[#DB2777]" />
                  <span className="whitespace-nowrap">Call</span>
                </a>

                <a
                  href={emailUrl}
                  className="min-h-[60px] px-3 py-3 rounded-2xl bg-[#FEFCE8] hover:bg-[#FEF9C3] text-[#854D0E] font-semibold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA8A04]"
                >
                  <Mail className="w-5 h-5 text-[#CA8A04]" />
                  <span className="whitespace-nowrap">Email</span>
                </a>
              </div>

              {/* Senarai Butiran Hubungan */}
              <div className="mt-7 pt-2 border-t border-[#E6ECE8] divide-y divide-[#EFF4F0]">
                {/* Telefon */}
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#546E64]">
                        Telefon / WhatsApp
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#0D211B] tabular-nums mt-0.5">
                        {displayPhone}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(PROFILE.phone, 'phone', 'Nombor telefon')
                    }
                    aria-label="Salin nombor telefon"
                    className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-[#4A635A] hover:text-[#0B3B2E] hover:bg-[#F0F5F2] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
                  >
                    {copiedField === 'phone' ? (
                      <>
                        <Check className="w-4 h-4 text-[#059669]" />
                        <span className="text-[#059669] whitespace-nowrap">
                          Disalin
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="whitespace-nowrap">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* E-mel */}
                <div className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#FDF2F8] text-[#DB2777] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#546E64]">
                        E-mel Rasmi
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-[#0D211B] truncate mt-0.5">
                        {PROFILE.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(PROFILE.email, 'email', 'Alamat e-mel')
                    }
                    aria-label="Salin alamat e-mel"
                    className="min-h-[44px] px-3 rounded-xl text-xs font-semibold text-[#4A635A] hover:text-[#0B3B2E] hover:bg-[#F0F5F2] flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check className="w-4 h-4 text-[#059669]" />
                        <span className="text-[#059669] whitespace-nowrap">
                          Disalin
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span className="whitespace-nowrap">Salin</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Organisasi */}
                <div className="py-3.5 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FEFCE8] text-[#CA8A04] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#546E64]">
                      Organisasi & Sektor
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-[#0D211B] mt-0.5">
                      {PROFILE.unit} · {PROFILE.organization}
                    </p>
                  </div>
                </div>

                {/* Lokasi */}
                <div className="py-3.5 flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#F2F6F4] text-[#0B3B2E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#546E64]">Lokasi</p>
                    <p className="text-sm sm:text-base font-semibold text-[#0D211B] mt-0.5">
                      {PROFILE.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bahagian Imbas QR untuk Paparan Desktop & Pantas */}
            <div className="pt-5 border-t border-[#E6ECE8] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  aria-label="Besarkan kod QR"
                  className="p-1.5 bg-white border border-[#DCE5DF] rounded-xl hover:border-[#0B3B2E] transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
                >
                  <QRCodeSVG
                    value={currentUrl}
                    size={52}
                    bgColor="#FFFFFF"
                    fgColor="#0B3B2E"
                    level="M"
                  />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0D211B]">
                    Kad Profil Digital NFC
                  </p>
                  <p className="text-xs text-[#546E64] mt-0.5">
                    Imbas kod QR atau ketik Kongsi untuk hantar pautan kad ini.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsQrOpen(true)}
                className="hidden sm:inline-flex min-h-[44px] px-4 py-2 rounded-xl border border-[#D4DFD8] hover:bg-[#F4F7F4] text-xs font-semibold text-[#0B3B2E] items-center gap-2 transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3B2E]"
              >
                <QrCode className="w-4 h-4 text-[#DB2777]" />
                <span className="whitespace-nowrap">Buka QR</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <QrModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        url={currentUrl}
        fullName={PROFILE.fullName}
        organization={`${PROFILE.unit} · ${PROFILE.organization}`}
        onCopyLink={() =>
          copyToClipboard(currentUrl, 'link', 'Pautan kad digital')
        }
      />
    </div>
  );
}
