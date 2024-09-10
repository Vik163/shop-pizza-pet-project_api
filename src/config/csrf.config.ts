import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

export const doubleCsrfOptions = {
  getSecret: () => process.env.CSRF_SECRET || 'Secret', // A function that optionally takes the request and returns a secret
  cookieName: '__Host-psifi.x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
  cookieOptions: {
    path: '/',
    sameSite: true, // Recommend you make this strict if posible
    secure: true,
    // maxAge: 60 * 60 * 24 * 1000, // See cookieOptions below (24 часа)
  },
  size: 64, // The size of the generated tokens in bits
  // ignoredMethods: ['HEAD', 'POST', 'OPTIONS'], // A list of request methods that will not be protected.
  getTokenFromRequest: (req: Request) => req.headers['x-csrf-token'], // A function that returns the token from the request
};

export const { doubleCsrfProtection } = doubleCsrf(doubleCsrfOptions);
