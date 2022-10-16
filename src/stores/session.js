import { defineStore } from "pinia";
import { loginAPI, recoverPasswordAPI } from 'src/services/userService'
import { Notify } from 'quasar'
import { auth } from 'src/config/firebase'
import { cFunctions } from 'src/config/firebase/cloudFunctions'

export const useSession = defineStore('session', {
    state: () => ({
        loading: false,
        userAuth: null
    }),
    getters: {
        getLoading (state) {
            return state.loading
        },
        getUserAuth (state) {
            return state.userAuth
        }
    },
    actions: {
        async login (payload) {
            this.showLoading()
            const loginResponse = await loginAPI(payload)
            if (loginResponse && loginResponse.user) {
                return true
            } else {
                if (loginResponse.code && (loginResponse.code === 'auth/wrong-password' || loginResponse.code === 'auth/user-not-found')) {
                Notify.create({
                    type: 'negative',
                    message: 'Contraseña o usuario incorrecto'
                })
                } else {
                if (loginResponse.code && loginResponse.code === 'auth/invalid-email') {
                    Notify.create({
                    type: 'negative',
                    message: 'Correo electrónico incorrecto'
                    })
                } else {
                    if (loginResponse.code && loginResponse.code === 'auth/too-many-requests') {
                    try {
                        await cFunctions.notifyTooManyRequest({
                        email: payload.email,
                        type: 'WEB'
                        })
                        Notify.create({
                        type: 'negative',
                        message: '¡Demasiados intentos!. Ya se notificó a los administradores de su problema.'
                        })
                    } catch (e) {
                        Notify.create({
                        type: 'negative',
                        message: '¡Demasiados intentos!. Por favor, intente mas tarde o contáctese con soporte.'
                        })
                    }
                    } else {
                    Notify.create({
                        type: 'negative',
                        message: 'Se produjo un error. Por favor, vuelva a intentarlo.'
                    })
                    }
                }
                }
                this.hideLoading()
                return false
            }
        },
        async logout () {
            this.showLoading()
            await auth.signOut()
            this.userAuth = null
            this.hideLoading()
        },
        updateUserAuth (payload) {
            this.userAuth = payload.userAuth
        },
        async recoverPassword (payload) {
            this.showLoading()
            const recoverPasswordResponse = await recoverPasswordAPI(payload)
            if (recoverPasswordResponse && recoverPasswordResponse.status === 200) {
                this.hideLoading()
                return true
            } else {
                if (recoverPasswordResponse.code) {
                switch (recoverPasswordResponse.code) {
                    case 'auth/user-not-found':
                    Notify.create({
                        type: 'negative',
                        message: 'El correo electrónico no se encuentra registrado'
                    })
                    break
                    case 'auth/invalid-email':
                    Notify.create({
                        type: 'negative',
                        message: 'El correo electrónico es incorrecto'
                    })
                    break
                    default:
                    Notify.create({
                        type: 'negative',
                        message: 'Se produjo un error. Refresque la página y vuelva a intentarlo'
                    })
                }
                } else {
                Notify.create({
                    type: 'negative',
                    message: 'Se produjo un error. Refresque la página y vuelva a intentarlo'
                })
                }
                this.hideLoading()
                return false
            }
        },
        showLoading () {
            this.loading = true
        },
        hideLoading () {
            this.loading = false
        }
    }
})