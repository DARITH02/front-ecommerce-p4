import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
 
export default (request) => {
  console.log('Middleware hit:', request.nextUrl.pathname);
  return createMiddleware(routing)(request);
};
 
export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|km|fr|zh)/:path*']
};
