'use client'

import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';

interface IAuthProvider {
  // token: string;
  auth: boolean;
}

// Se crea el contexto y su contenido
const SessionContext = createContext<IAuthProvider>({ auth: false });

// Wrapper de autenticación
export function AuthProvider({ children }: any) {
  const [cookies, setCookie, removeCookie] = useCookies(['sessionInfo']);
  const [authPayload, setAuthPayload] = useState<IAuthProvider>({
    // token: '',
    auth: false
  });

  useEffect(() => {
    const { sessionInfo } = cookies;
    if (!sessionInfo) {
      setAuthPayload({
        auth: false
      });
      return;
    }

    if (sessionInfo.exp * 1000 < Date.now()) {
      setAuthPayload({
        auth: false
      })
    } else {
      setAuthPayload({
        auth: true
      })
    }


    return;
  }, [cookies]);

  return (
    <SessionContext.Provider value={authPayload}>
      {children}
    </SessionContext.Provider>
  );
}

// Hook de autenticación
export const useAuthData = () => {
  return useContext(SessionContext);
};
