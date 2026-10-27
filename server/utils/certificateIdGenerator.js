import crypto from 'crypto';

/**
 * Generates a formatted, unique certificate ID
 * Example: SC-FSD-2026-8A91X
 * @param {string} courseTitle - Name of the course
 * @returns {string} Unique Certificate ID
 */
export const generateCertificateId = (courseTitle = 'CERT') => {
  // Extract initials or 3-letter code from course title
  const words = courseTitle.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/);
  let prefix = '';
  if (words.length >= 3) {
    prefix = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
  } else if (words.length === 2) {
    prefix = (words[0].substring(0, 2) + words[1][0]).toUpperCase();
  } else {
    prefix = (words[0].substring(0, 3)).toUpperCase();
  }

  const year = new Date().getFullYear();
  const randomHash = crypto.randomBytes(3).toString('hex').toUpperCase();

  return `SC-${prefix}-${year}-${randomHash}`;
};
