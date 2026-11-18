const BLOCKED_DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'yopmail.com',
  '10minutemail.com',
  'trashmail.com',
  'throwawaymail.com',
  'sharklasers.com',
  'getnada.com',
  'fakeinbox.com',
  'dispostable.com',
  'maildrop.cc',
  'example.com',
  'example.org',
  'test.com',
  'fake.com',
  'dummy.com',
  'invalid.com'
]);

const DUMMY_PHONE_PATTERNS = new Set([
  '0123456789',
  '1234567890',
  '9876543210',
  '9876543211',
  '6789012345',
  '7890123456',
  '8901234567',
  '9123456789',
  '9988776655',
  '8877665544',
  '7766554433',
  '6655443322',
  '9998887776',
  '1234512345',
  '9876598765'
]);

export function normalizePhoneDigits(rawPhone) {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits;
}

export function validateStrictMobileNumber(rawPhone) {
  const raw = String(rawPhone || '').trim();
  if (!raw) {
    return { isValid: false, error: 'A valid registered mobile number is required.' };
  }

  const allDigits = raw.replace(/\D/g, '');
  if (allDigits.length < 10 || allDigits.length > 15) {
    return {
      isValid: false,
      error: 'Mobile number must contain between 10 and 15 digits (no short or fake numbers).'
    };
  }

  const localDigits = normalizePhoneDigits(raw);

  if (localDigits.length === 10 && !/^[6-9]\d{9}$/.test(localDigits)) {
    return {
      isValid: false,
      error: 'Please enter a genuine mobile number (fake or invalid starting digits are blocked).'
    };
  }

  if (/^(\d)\1{6,}$/.test(localDigits) || new Set(localDigits.split('')).size <= 3) {
    return {
      isValid: false,
      error: 'Fake or repetitive mobile numbers (like 9999999999 or 9090909090) are not accepted.'
    };
  }

  if (DUMMY_PHONE_PATTERNS.has(localDigits)) {
    return {
      isValid: false,
      error: 'Fake or sequential mobile numbers are blocked. Please use your genuine number.'
    };
  }

  let ascRun = 1;
  let descRun = 1;
  for (let i = 1; i < localDigits.length; i += 1) {
    const prev = Number(localDigits[i - 1]);
    const curr = Number(localDigits[i]);
    if (curr === prev + 1) ascRun += 1;
    else ascRun = 1;
    if (curr === prev - 1) descRun += 1;
    else descRun = 1;

    if (ascRun >= 6 || descRun >= 6) {
      return {
        isValid: false,
        error: 'Sequential test mobile numbers are not accepted. Please use a real mobile number.'
      };
    }
  }

  return { isValid: true, normalized: localDigits };
}

export function getEmailPlatformLabel(email) {
  const domain = String(email || '').trim().toLowerCase().split('@')[1] || '';
  if (domain === 'gmail.com' || domain === 'googlemail.com') return 'Gmail';
  if (domain.includes('yahoo') || domain === 'ymail.com' || domain === 'rocketmail.com') return 'Yahoo Mail';
  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com' || domain === 'msn.com') {
    return 'Outlook / Hotmail';
  }
  if (domain === 'icloud.com' || domain === 'me.com' || domain === 'mac.com') return 'Apple iCloud Mail';
  if (domain === 'proton.me' || domain === 'protonmail.com') return 'Proton Mail';
  if (domain.includes('zoho')) return 'Zoho Mail';
  return domain ? `${domain} inbox` : 'email inbox';
}

export function validateAuthenticEmailFormat(email) {
  const clean = String(email || '').trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!clean || !emailRegex.test(clean)) {
    return { isValid: false, error: 'Please enter a valid active email address (Gmail, Yahoo, Outlook, etc.).' };
  }

  const [localPart = '', domain = ''] = clean.split('@');
  if (BLOCKED_DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary, disposable, or fake email domains are strictly blocked. Use a real email account on your device.'
    };
  }

  if (/^(fake|testfake|dummy|asdf|qwerty|noreply)\d*$/i.test(localPart)) {
    return {
      isValid: false,
      error: 'Please enter your genuine active email address (fake test addresses are blocked).'
    };
  }

  return { isValid: true, clean, domain };
}

export const validateGoogleEmailFormat = validateAuthenticEmailFormat;
