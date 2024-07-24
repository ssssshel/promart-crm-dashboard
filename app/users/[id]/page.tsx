'use client'

import { useAuthData } from '@/app/context/auth';
import GenericModalComponent from '@/components/GenericModalComponent';
import { useGenericModalStore } from '@/state/store/genericModalStore';
import { useLoadingScreenStore } from '@/state/store/loadingScreenStore';
import { GENERIC_MODAL_CONTENT } from '@/utils/constants/labels';
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
    name: string;
  };
}

interface UserStatusProps {
  id: number;
  name: string;
}

type Status = 'prospect' | 'active' | 'inactive' | 'locked';

const validStatusTransitions: Record<Status, Status[]> = {
  prospect: ['active'],
  active: ['inactive'],
  inactive: ['active', 'locked'],
  locked: ['active']
};

export default function UserDetail({ params }: { params: { id: string } }) {
  const fetchHelper = new FetchHelper();
  const userId = params.id;
  const authData = useAuthData()

  const [isLoadingScreenOpen, openLoadingScreen, closeLoadingScreen] = useLoadingScreenStore((state) => [
    state.isLoadingScreenOpen,
    state.openLoadingScreen,
    state.closeLoadingScreen
  ]);

  const [isDialogOpen, openDialog, closeDialog, setDialogContent] = useGenericModalStore(state => [
    state.isDialogOpen,
    state.openDialog,
    state.closeDialog,
    state.setDialogContent
  ]);

  const [user, setUser] = useState<UserDetailProps | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatusProps | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        openLoadingScreen();
        await Promise.all([fetchUser(), fetchUserStatus()]);
      } finally {
        closeLoadingScreen();
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchUser = async () => {
    try {
      openLoadingScreen();
      const res = await fetchHelper.get(`${ROUTES_API.users}/${userId}`);
      const { data } = res.data;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchUserStatus = async () => {
    try {
      openLoadingScreen();
      const res = await fetchHelper.get(`${ROUTES_API.user_status}/${userId}`);
      const { data } = res.data;
      setUserStatus({ id: data.current_status.id, name: data.current_status.name });
      // setSelectedStatus(data.current_status.name as Status);
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value as Status);
  };

  const updateUserState = async () => {
    console.log('click')
    console.log(selectedStatus)
    console.log(userStatus)
    if (!selectedStatus || !userStatus) return;

    const validStatuses = validStatusTransitions[userStatus.name as Status] || [];
    if (!validStatuses.includes(selectedStatus as Status)) return;

    try {
      openLoadingScreen();
      const res = await fetchHelper.post(`${ROUTES_API.users}/${userId}/status`, {
        status_id: selectedStatus,
        user_id: authData.userId
      });

      if (res.error) {
        setDialogContent(GENERIC_MODAL_CONTENT["USER_EDIT_ERROR"]);
      } else {
        setDialogContent(GENERIC_MODAL_CONTENT["USER_EDIT_SUCCESS"]);
      }
      fetchUserStatus();
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      openDialog();
      closeLoadingScreen();
    }
  };

  if (loading) return <div className="text-center py-4">Cargando...</div>;

  if (!user) return <div className="text-center py-4">Usuario no encontrado</div>;

  const availableStatuses = validStatusTransitions[userStatus?.name as Status] || [];

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20 bg-white shadow-md rounded-lg">
      <GenericModalComponent />

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
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-700">Estado:</span>
          <span className="text-gray-600">{userStatus?.name}</span>
          <div className="ml-4 flex flex-col">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Seleccione un estado</option>
              {availableStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button
              className="mt-2 bg-indigo-600 rounded-lg text-white px-4 py-2"
              onClick={updateUserState}
            >
              Cambiar estado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
