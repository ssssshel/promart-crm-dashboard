'use client'

import { useLoadingScreenStore } from '@/state/store/loadingScreenStore';
import { ROUTES_API } from '@/utils/constants/routes';
import { FetchHelper } from '@/utils/helpers/fetch';
import { useEffect, useState } from 'react';

interface UserDetailProps {
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  role_id: number;
  status: string;
  role: {
    name: string
  }
}

interface UserStatusProps {
  id: number,
  name: string
}

export default function UserDetail({ params }: { params: { id: string } }) {
  const fetchHelper = new FetchHelper()
  const userId = params.id

  const [isLoadingScreenOpen, openLoadingScreen, closeLoadingScreen] = useLoadingScreenStore((state) => [
    state.isLoadingScreenOpen,
    state.openLoadingScreen,
    state.closeLoadingScreen
  ])

  const [user, setUser] = useState<UserDetailProps | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatusProps | null>(null)

  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        openLoadingScreen()
        await Promise.all([fetchUser(), fetchUserStatus()])
      } finally {
        closeLoadingScreen()
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchUser = async () => {
    try {
      openLoadingScreen()
      const res = await fetchHelper.get(`${ROUTES_API.users}/${userId}`)
      const { data } = res.data
      setUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchUserStatus = async () => {
    try {
      openLoadingScreen()
      const res = await fetchHelper.get(`${ROUTES_API.user_status}/${userId}`)
      const { data } = res.data
      setUserStatus({ id: data.current_status.id, name: data.current_status.name })
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  if (loading) return <div className="text-center py-4">Cargando...</div>

  if (!user) return <div className="text-center py-4">Usuario no encontrado</div>

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Detalles del Usuario</h1>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Nombre:</span>
          <span className="text-gray-600">{user.first_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Apellido Paterno:</span>
          <span className="text-gray-600">{user.last_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Apellido Materno:</span>
          <span className="text-gray-600">{user.middle_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-600">{user.email}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Rol:</span>
          <span className="text-gray-600">{user.role.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-700">Estado:</span>
          <span className="text-gray-600">{userStatus?.name}</span>
        </div>
      </div>
    </div>
  );
}