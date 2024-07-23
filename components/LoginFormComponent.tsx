"use client"

import { ROUTES_API } from '@/utils/constants/routes';
import { FetchHelper } from '@/utils/helpers/fetch';
import { useState } from 'react';
import * as z from 'zod';
import GenericModalComponent from './GenericModalComponent';
import { useGenericModalStore } from "../state/store/genericModalStore"
import { useLoadingScreenStore } from "../state/store/loadingScreenStore"
import { GENERIC_MODAL_CONTENT } from "../utils/constants/labels"

const schema = z.object({
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

type LoginFormValues = z.infer<typeof schema>

export default function LoginFormComponent() {
  const fetchHelper = new FetchHelper()

  const [formData, setFormData] = useState<LoginFormValues>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    openLoadingScreen()

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      closeLoadingScreen()

    } else {
      setErrors({})
      console.log('Datos válidos:', formData)
      await login(formData)
    }
  }

  const login = async (payload: LoginFormValues) => {
    const res = await fetchHelper.post(ROUTES_API.login, payload)
    console.log('Response:', res);

    if (res.error) {
      console.error('Login error:', res.error)
      setDialogContent(GENERIC_MODAL_CONTENT["LOGIN_ERROR"])
    } else {
      console.log('Login successful:', res.data);
      setDialogContent(GENERIC_MODAL_CONTENT["LOGIN_SUCCESS"])
    }
    closeLoadingScreen()
    openDialog()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="********"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign In
        </button>
      </form>
      <GenericModalComponent />
    </>
  )
}