export interface ProfileData {
  fullName: string;
  firstName: string;
  lastName: string;
  initials: string;
  title: string;
  organization: string;
  unit: string;
  location: string;
  tagline: string;
  phone: string;
  email: string;
  instagram: string;
  website: string;
}

export const PROFILE: ProfileData = {
  fullName: 'Asrin Jairi bin Asri',
  firstName: 'Asrin Jairi',
  lastName: 'bin Asri',
  initials: 'AJ',
  title: 'Juruteknik Komputer',
  organization: 'Jabatan Pendidikan W.P Labuan',
  unit: 'JPICT-SICT',
  location: 'Wilayah Persekutuan Labuan',
  tagline: 'Sanggup bebunuh demi makanan',
  phone: '0165854902',
  email: 'asrin@moe.gov.my',
  instagram: '',
  website: '',
};

export function getCleanDigits(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function getPhoneWithoutLeadingZero(phone: string): string {
  return getCleanDigits(phone).replace(/^0/, '');
}

export function getFormattedDisplayPhone(phone: string): string {
  const withoutZero = getPhoneWithoutLeadingZero(phone);
  // Format 0165854902 -> +60 16-585 4902
  if (withoutZero.length === 9) {
    return `+60 ${withoutZero.slice(0, 2)}-${withoutZero.slice(2, 5)} ${withoutZero.slice(5)}`;
  }
  return `+60 ${withoutZero}`;
}

export function getWhatsAppUrl(phone: string): string {
  return `https://wa.me/60${getPhoneWithoutLeadingZero(phone)}`;
}

export function getCallUrl(phone: string): string {
  return `tel:${getCleanDigits(phone)}`;
}

export function getEmailUrl(email: string): string {
  return `mailto:${email}`;
}

export interface SaveContactResult {
  platform: 'ios' | 'standard';
}

export function buildVCard3(profile: ProfileData, cardUrl: string): string {
  const withoutZero = getPhoneWithoutLeadingZero(profile.phone);
  const resolvedUrl = profile.website.trim() || cardUrl;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${profile.lastName};${profile.firstName};;;`,
    `FN:${profile.fullName}`,
    `ORG:${profile.unit} ${profile.organization}`,
    `TITLE:${profile.title}`,
    `TEL;TYPE=CELL,VOICE:+60${withoutZero}`,
    `EMAIL;TYPE=PREF,INTERNET:${profile.email}`,
    `URL:${resolvedUrl}`,
    `NOTE:${profile.tagline}`,
    'END:VCARD',
  ];

  // CRLF (\r\n) wajib untuk keserasian iPhone & Android
  return `${lines.join('\r\n')}\r\n`;
}

export function triggerVCardDownload(profile: ProfileData): SaveContactResult {
  const cardUrl = typeof window !== 'undefined' ? window.location.href : '';
  const vcfContent = buildVCard3(profile, cardUrl);
  const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (isAppleMobile) {
    window.location.href = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcfContent)}`;
    return { platform: 'ios' };
  }

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = `${profile.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);

  return { platform: 'standard' };
}
