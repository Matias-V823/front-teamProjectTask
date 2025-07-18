import api from '@/lib/axios'
import { isAxiosError } from 'axios'
import type { NewPasswordForm, RequestConfirmationCodeForm, UserConfirmationForm, UserLoginForm, UserRegistrationForm, validateTokenPassword } from '../types'


export type CreateAccountResponse = {
    message: string;
};



export async function login(formData: UserLoginForm) {
    try {
        const url = "http://localhost:4000/api/auth/login"
        const { data } = await api.post<string>(url, formData)
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al crear cuenta')
    }
}
export async function createAccount(formData: UserRegistrationForm): Promise<CreateAccountResponse> {
    try {
        const url = "http://localhost:4000/api/auth/create-account"
        const { data } = await api.post<CreateAccountResponse>(url, formData)
        console.log(data)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al crear cuenta')
    }
}

export async function confirmAccount(token: UserConfirmationForm): Promise<CreateAccountResponse> {
    try {
        const url = "http://localhost:4000/api/auth/confirm-account"
        const { data } = await api.post<CreateAccountResponse>(url, token)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al confirmar cuenta')
    }
}



export async function RequestCode(formData: RequestConfirmationCodeForm): Promise<CreateAccountResponse> {
    try {
        const url = "http://localhost:4000/api/auth/request-code"
        const { data } = await api.post<CreateAccountResponse>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al generar nuevo codigo')
    }
}
export async function forgotPassword(formData: RequestConfirmationCodeForm): Promise<CreateAccountResponse> {
    try {
        const url = "http://localhost:4000/api/auth/forgot-password"
        const { data } = await api.post<CreateAccountResponse>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al restablecer contraseña')
    }
}
export async function validateToken(formData: validateTokenPassword): Promise<CreateAccountResponse> {
    try {
        const url = "http://localhost:4000/api/auth/validate-token"
        const { data } = await api.post<CreateAccountResponse>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al ingresar token')
    }
}

type updatePasswordType = {
    formData: NewPasswordForm,
    token: string
}

export async function updatePassword({ formData, token }: updatePasswordType): Promise<CreateAccountResponse> {
    try {
        const url = `http://localhost:4000/api/auth/new-password/${token}`
        const { data } = await api.post<CreateAccountResponse>(url, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error inesperado al ingresar token')
    }
}