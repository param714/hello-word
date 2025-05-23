// utils/auth.js
import jwt from 'jsonwebtoken';

/**
 * Verifies a JWT token using the Shopify API secret.
 * @param {string} token - The JWT token to verify.
 * @returns {object|null} - The decoded token if valid, otherwise null.
 * @throws {Error} - If the token is invalid or secret is missing.
 */
export function verifyShopifyToken(token) {
  if (!token) {
    throw new Error('Token is missing');
  }

  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    throw new Error('SHOPIFY_API_SECRET is not set');
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (process.env.NODE_ENV === 'development') {
     // console.log("Decoded token:", decoded);
    }
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
