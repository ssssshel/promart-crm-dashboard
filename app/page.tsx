'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthData } from "./context/auth";
import Link from "next/link";
import { ROUTES_PAGES } from "@/utils/constants/routes";

export default function Home() {
  const router = useRouter()
  const { auth } = useAuthData()

  useEffect(() => {
    // Redirigir a la ruta '/users'
    console.log(auth)
    if (auth) {
      router.push('/users');
    }
  }, [auth])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido</h1>
        <p className="mb-6 text-gray-600">Inicia sesión para continuar</p>
        <Link href={ROUTES_PAGES.login}>
          <button
            className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Ir al Login
          </button>
        </Link>
      </div>
    </div>
  );
}
