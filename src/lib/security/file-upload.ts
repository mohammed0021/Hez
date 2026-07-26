export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'] as const;
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'] as const;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
export const MAX_DOCUMENT_SIZE = 25 * 1024 * 1024;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type AllowedDocumentType = (typeof ALLOWED_DOCUMENT_TYPES)[number];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: { type: string; size: number }): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
    return {
      valid: false,
      error: `Invalid image type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    const mb = MAX_IMAGE_SIZE / 1024 / 1024;
    return { valid: false, error: `Image too large. Maximum size: ${mb}MB` };
  }
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  return { valid: true };
}

export function validateDocumentFile(file: { type: string; size: number }): FileValidationResult {
  if (!ALLOWED_DOCUMENT_TYPES.includes(file.type as AllowedDocumentType)) {
    return {
      valid: false,
      error: `Invalid document type. Allowed: ${ALLOWED_DOCUMENT_TYPES.join(', ')}`,
    };
  }
  if (file.size > MAX_DOCUMENT_SIZE) {
    const mb = MAX_DOCUMENT_SIZE / 1024 / 1024;
    return { valid: false, error: `Document too large. Maximum size: ${mb}MB` };
  }
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  return { valid: true };
}

export function validateDataUrl(dataUrl: string): FileValidationResult {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return { valid: false, error: 'Invalid data URL format' };
  }
  const maxLength = MAX_IMAGE_SIZE * 1.37;
  if (dataUrl.length > maxLength) {
    return { valid: false, error: 'Image data exceeds maximum size' };
  }
  const mimeMatch = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);/);
  if (!mimeMatch || !ALLOWED_IMAGE_TYPES.includes(mimeMatch[1] as AllowedImageType)) {
    return { valid: false, error: 'Invalid or unsupported image type in data URL' };
  }
  const base64 = dataUrl.split(',')[1];
  if (!base64 || base64.length < 100) {
    return { valid: false, error: 'Image data is too small or empty' };
  }
  return { valid: true };
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.\./g, '.')
    .slice(0, 255);
}
