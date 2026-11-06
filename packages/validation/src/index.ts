export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  // Accepts +91XXXXXXXXXX or 10-digit Indian mobile starting with 6-9
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleaned);
}

export function isValidPostalCode(pin: string): boolean {
  if (!pin || typeof pin !== 'string') return false;
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatINR(amount: number | string): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(numeric);
}

export function calculateDiscount(regularPrice: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= regularPrice || regularPrice <= 0) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}
