import api from '@/lib/axios'
import { isAxiosError } from 'axios'
import { userSchema } from '@/types'

export async function getProfile() {
  try {
    const { data } = await api.get('/profile')
    const parsed = userSchema.safeParse(data)
    if (!parsed.success) throw new Error('Respuesta inválida')
    return parsed.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Error al obtener perfil')
  }
}

export async function updateProfile(payload: { name?: string; yearsExperience?: number; strengths?: string[] }) {
  try {
    const { data } = await api.put('/profile', payload)
    const parsed = userSchema.safeParse(data)
    if (!parsed.success) throw new Error('Respuesta inválida')
    return parsed.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Error al actualizar perfil')
  }
}

export async function addTechnology(technology: string) {
  try {
    const { data } = await api.post('/profile/technologies', { technology })
    const parsed = userSchema.safeParse(data)
    if (!parsed.success) throw new Error('Respuesta inválida')
    return parsed.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Error al agregar tecnología')
  }
}

export async function removeTechnology(technology: string) {
  try {
    const { data } = await api.delete(`/profile/technologies/${encodeURIComponent(technology)}`)
    const parsed = userSchema.safeParse(data)
    if (!parsed.success) throw new Error('Respuesta inválida')
    return parsed.data
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error)
    }
    throw new Error('Error al eliminar tecnología')
  }
}
