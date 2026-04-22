/**
 * Validates a Mexican mobile phone number.
 * Accepts 10 digits or 12 digits with country code 52.
 */
export function isValidPhoneMX(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 10) {
    return true;
  }

  if (digits.length === 12 && digits.startsWith("52")) {
    return true;
  }

  return false;
}
