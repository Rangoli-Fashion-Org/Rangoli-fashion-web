/**
 * Cloudinary On-the-Fly Image Optimization Helper
 * Automatically injects Cloudinary transformations (f_auto, q_auto, width limits)
 * into raw image URLs to slash download size by up to 80-90% and speed up rendering.
 */
export function getOptimizedImageUrl(
  url: string | null | undefined,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:eco' | 'auto:good' | 'auto:best' | number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
  }
): string {
  if (!url) return '/brand/rf-monogram.jpg';

  // If it's not a Cloudinary URL or already has custom transform path, return as is
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    crop = 'limit',
  } = options || {};

  const transforms: string[] = ['f_auto', `q_${quality}`];

  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (width || height) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');

  // Check if URL already has transformations directly after /upload/
  // Format: .../upload/v12345/... or .../upload/w_500,q_auto/v12345/...
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + 8); // includes '/upload/'
  const suffix = url.slice(uploadIndex + 8);

  // If already transformed with f_auto/q_auto, return
  if (suffix.startsWith('f_auto') || suffix.startsWith('q_auto')) {
    return url;
  }

  return `${prefix}${transformString}/${suffix}`;
}

