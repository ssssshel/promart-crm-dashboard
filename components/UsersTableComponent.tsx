'use client'

import { useGenericModalStore } from "@/state/store/genericModalStore"
import { useLoadingScreenStore } from "@/state/store/loadingScreenStore"
import { GENERIC_MODAL_CONTENT } from "@/utils/constants/labels"
import { ROUTES_API, ROUTES_PAGES } from "@/utils/constants/routes"
import { FetchHelper } from "@/utils/helpers/fetch"
import Link from "next/link"
import { useEffect, useState } from "react"
import GenericModalComponent from "./GenericModalComponent"

export default function UserTableComponent() {
  const fetchHelper = new FetchHelper()

  const [isLoadingScreenOpen, openLoadingScreen, closeLoadingScreen] = useLoadingScreenStore((state) => [
    state.isLoadingScreenOpen,
    state.openLoadingScreen,
    state.closeLoadingScreen
  ])

  const [isDialogOpen, openDialog, closeDialog, setDialogContent] = useGenericModalStore(state => [
    state.isDialogOpen,
    state.openDialog,
    state.closeDialog,
    state.setDialogContent
  ])

  const [users, setUsers] = useState<Array<{
    id: number,
    first_name: string,
    last_name: string,
    middle_name: string,
    email: string,
    role_id: number
  }> | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchHelper.get(`${ROUTES_API.users}?page=${currentPage}&limit=3`)
      const { data } = res.data
      console.log(data)

      setUsers(data.users || [])
      setTotalPages(Math.ceil(data.total / 3))

      closeLoadingScreen()
    }

    fetchUsers()
  }, [currentPage])

  const handlerDeleteUser = async (userId: number) => {
    openLoadingScreen()
    const res = await fetchHelper.delete(ROUTES_API.users + '/' + userId)
    console.log('Response:', res);

    if (res.error) {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_DELETE_ERROR"])
    } else {
      setDialogContent(GENERIC_MODAL_CONTENT["USER_DELETE_SUCCESS"])
    }
    closeLoadingScreen()
    openDialog()
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div>
      <GenericModalComponent />

      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {!users || users.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-2 px-4 text-center">Sin resultados</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.first_name} {user.last_name} {user.middle_name}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex gap-4 items-center">
                    <Link href={ROUTES_PAGES.users + '/' + user.id}>
                      <button className="bg-blue-500 px-2 py-1 text-sm rounded-md text-white hover:text-blue-700">Ver Detalle</button>
                    </Link>
                    <Link href={ROUTES_PAGES.users + '/' + user.id + '/edit'}>
                      <button className="bg-yellow-500 px-2 py-1 text-sm rounded-md text-white hover:text-yellow-700">Editar</button>
                    </Link>
                    <button onClick={() => handlerDeleteUser(user.id)} className="bg-red-500 px-2 py-1 text-sm rounded-md text-white hover:text-red-700">Eliminar</button>

                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Anterior
        </button>
        <span className="self-center">Página {currentPage} de {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
