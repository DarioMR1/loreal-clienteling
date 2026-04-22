/**
 * Formats a Mexican phone number.
 * Input: 10-digit string (e.g. "5512345678") or with country code (e.g. "525512345678")
 * Output: "+52 55 1234 5678"
 */
export function formatPhoneMX(phone: string): string {
  const digits = phone.replace(/\D/g, "");

  let national: string;
  if (digits.length === 12 && digits.startsWith("52")) {
    national = digits.slice(2);
  } else if (digits.length === 10) {
    national = digits;
  } else {
    return phone;
  }

  const areaCode = national.slice(0, 2);
  const part1 = national.slice(2, 6);
  const part2 = national.slice(6, 10);

  return `+52 ${areaCode} ${part1} ${part2}`;
}
