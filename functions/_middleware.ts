// Cloudflare Pages Middleware - Add CSP Headers for Google Translate
export async function onRequest(context) {
  const response = await context.next();
  
  // Clone the response to modify headers
  const newResponse = new Response(response.body, response);
  
  // Set CSP headers to allow Google Translate
  newResponse.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; " +
    "connect-src 'self' https://translate.google.com https://translate.googleapis.com https://pmerit-api.idowuolalekan1.workers.dev; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://translate.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: https:; " +
    "frame-src 'self' https://translate.google.com;"
  );
  
  newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  newResponse.headers.set('X-Content-Type-Options', 'nosniff');
  newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return newResponse;
}
