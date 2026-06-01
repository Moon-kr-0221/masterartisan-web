import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

// Next 16 renamed the `middleware` convention to `proxy` (same functionality).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on app routes, skip static assets and image files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
