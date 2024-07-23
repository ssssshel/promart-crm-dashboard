'use client';

import { AuthProvider } from "./context/auth";
import { CookiesProvider } from 'react-cookie';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CookiesProvider>
  );
}
