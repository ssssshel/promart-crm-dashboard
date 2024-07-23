import { GenericModalState } from "../../state/store/genericModalStore"

export const GENERIC_MODAL_CONTENT: { [key: string]: GenericModalState['dialogContent'] } = {
  "LOGIN_ERROR": {
    title: "Error",
    description: "Ha ocurrido un problema, intentalo nuevamente",
    buttons: [{
      name: 'Ok',
    }]
  },
  "LOGIN_SUCCESS": {
    title: "Sesión iniciada",
    description: "",
    buttons: [{
      name: 'Ok',
      action: () => {
        location.assign('/users')
      }
    }]
  },
  "USER_CREATE_SUCCESS": {
    title: "Usuario creado",
    description: "El usuario ha sido creado exitosamente.",
    buttons: [{
      name: 'Ok',
      action: () => {
        location.reload(); // Recargar la página para mostrar los cambios
      }
    }]
  },
  "USER_EDIT_SUCCESS": {
    title: "Usuario actualizado",
    description: "Los detalles del usuario han sido actualizados exitosamente.",
    buttons: [{
      name: 'Ok',
      action: () => {
        location.reload(); // Recargar la página para mostrar los cambios
      }
    }]
  },
  "USER_DELETE_SUCCESS": {
    title: "Usuario eliminado",
    description: "El usuario ha sido eliminado exitosamente.",
    buttons: [{
      name: 'Ok',
      action: () => {
        location.reload()
      }
    }]
  },
  "USER_CREATE_ERROR": {
    title: "Error al crear usuario",
    description: "Ha ocurrido un problema al crear el usuario. Inténtalo nuevamente.",
    buttons: [{
      name: 'Ok',
    }]
  },
  "USER_EDIT_ERROR": {
    title: "Error al editar usuario",
    description: "Ha ocurrido un problema al editar el usuario. Inténtalo nuevamente.",
    buttons: [{
      name: 'Ok',
    }]
  },
  "USER_DELETE_ERROR": {
    title: "Error al eliminar usuario",
    description: "Ha ocurrido un problema al eliminar el usuario. Inténtalo nuevamente.",
    buttons: [{
      name: 'Ok',
    }]
  },
}