"use client"

import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useLoadingScreenStore } from '@/state/store/loadingScreenStore';
import { FetchHelper } from '@/utils/helpers/fetch';
import { ROUTES_API } from '@/utils/constants/routes';
import { useGenericModalStore } from '@/state/store/genericModalStore';
import { GENERIC_MODAL_CONTENT } from '@/utils/constants/labels';
import GenericModalComponent from './GenericModalComponent';

const schema = z.object({
  first_name: z.string().min(2, 'El nombre es requerido'),
  last_name: z.string().min(2, 'El apellido es requerido'),
  middle_name: z.string().optional(),
  email: z.string().email('El email no es válido'),
  role_id: z.string().min(1, 'El rol es requerido'),
});

type CustomerFormData = z.infer<typeof schema>

export default function UserFormComponent(props: { userId?: number, editionMode?: boolean }) {
  const fetchHelper = new FetchHelper()
  const { editionMode, userId } = props

  const [formData, setFormData] = useState<CustomerFormData>({
    first_name: '',
    last_name: '',
    middle_name: '',
    email: '',
    role_id: '',
  })

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      openLoadingScreen()
      try {
        const res = await fetchHelper.get(ROUTES_API.users + '/' + userId)
        console.log('Response:', res);
        const { data } = res.data
        setFormData({
          email: data.email,
          last_name: data.last_name,
          first_name: data.first_name,
          middle_name: data.middle_name,
          role_id: data.role_id
        })

      } catch (error) {
        console.log('fetchData err:', error);
      } finally {
        closeLoadingScreen()
      }
    }

    fetchData()
  }, [])

  const [errors, setErrors] = useState<Partial<CustomerFormData>>({})

  const [isDialogOpen, openDialog, closeDialog, setDialogContent] = useGenericModalStore(state => [
    state.isDialogOpen,
    state.openDialog,
    state.closeDialog,
    state.setDialogContent
  ])

  const [isLoadingScreenOpen, openLoadingScreen, closeLoadingScreen] = useLoadingScreenStore((state) => [
    state.isLoadingScreenOpen,
    state.openLoadingScreen,
    state.closeLoadingScreen
  ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    openLoadingScreen()

    const result = schema.safeParse(formData)
    console.log(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      })
      setErrors(fieldErrors)
      closeLoadingScreen()
    } else {
      setErrors({})

      if (!editionMode) {
        await createUser(formData)
      } else {
        await updateUser(formData)
      }
    }
  }

  const createUser = async (payload: CustomerFormData) => {
    const res = await fetchHelper.post(ROUTES_API.users, payload)
    console.log('Response:', res)

    if (res.error) {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_CREATE_ERROR"])
    } else {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_CREATE_SUCCESS"])
    }
    openDialog()
    closeLoadingScreen()
  }

  const updateUser = async (payload: CustomerFormData) => {
    const res = await fetchHelper.patch(ROUTES_API.users + '/' + userId, payload)
    console.log('Response => ', res)

    if (res.error) {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_EDIT_ERROR"])
    } else {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_EDIT_SUCCESS"])
    }
    openDialog()
    closeLoadingScreen()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <GenericModalComponent />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{editionMode ? 'Editar' : 'Crear'} Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Apellido Paterno
            </label>
            <input
              type="text"
              id="lastname"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>
          <div>
            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-700">
              Apellido Materno (opcional)
            </label>
            <input
              type="text"
              id="middle_name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.middle_name && <p className="text-red-500 text-sm mt-1">{errors.middle_name}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Seleccione un rol</option>
              <option value={1}>Superadmin</option>
              <option value={2}>Admin</option>
              <option value={3}>Customer</option>
            </select>
            {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-md text-sm px-4 py-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}