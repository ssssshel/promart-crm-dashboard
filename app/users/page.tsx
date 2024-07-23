'use client'

import Link from "next/link"
import { useEffect } from "react"
import { useAuthData } from "../context/auth"
import { useRouter } from "next/navigation";
import UserTableComponent from "@/components/UsersTableComponent";

export default function Users() {
  const { auth } = useAuthData()
  const router = useRouter()

  useEffect(() => {
    console.log(auth)
    if (auth) {
      router.push('/users');
    }
  }, [auth])


  return (
    <div className="bg-gray-100 min-h-screen flex items-center py-20 justify-center">
      <div className=" bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl gap-10 flex flex-col">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-center">Clientes</h2>
          <Link href='users/new'>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">Crear nuevo</button>
          </Link>
        </div>
        <UserTableComponent />
      </div>
    </div>
  );

}