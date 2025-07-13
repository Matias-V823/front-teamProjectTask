import api from '@/lib/axios'
import { isAxiosError } from 'axios'
import type { UserConfirmationForm, UserRegistrationForm } from '../types'


export type CreateAccountResponse = {
  message: string;
};



export async function createAccount(formData: UserRegistrationForm) : Promise<CreateAccountResponse> {
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

export async function confirmAccount(token: UserConfirmationForm) : Promise<CreateAccountResponse> {
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