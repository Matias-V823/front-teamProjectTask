import api from '@/lib/axios'
import {
  productBacklogListSchema,
  productBacklogItemSchema,
  type NewBacklogItemForm,
  type UpdateBacklogItemForm,
  type ProductBacklogItem
} from '@/types'
import { isAxiosError } from 'axios'

export async function getProductBacklog(projectId: string): Promise<ProductBacklogItem[]> {
  try {
    const { data } = await api.get(`/projects/${projectId}/product-backlog`)
    const parsed = productBacklogListSchema.safeParse(data)
    if (parsed.success) return parsed.data
    throw new Error('Respuesta inválida del servidor')
  } catch (e: any) {
    if (isAxiosError(e)) throw new Error(e.response?.data?.error || 'Error al cargar backlog')
    throw e
  }
}

export async function createBacklogItem(projectId: string, form: NewBacklogItemForm) {
  try {
    const { data } = await api.post(`/projects/${projectId}/product-backlog`, form)
    const parsed = productBacklogItemSchema.safeParse(data)
    if (parsed.success) return parsed.data
    throw new Error('Respuesta inválida al crear')
  } catch (e: any) {
    if (isAxiosError(e)) throw new Error(e.response?.data?.error || 'Error al crear historia')
    throw e
  }
}

export async function updateBacklogItem(projectId: string, storyId: string, form: UpdateBacklogItemForm) {
  try {
    const { data } = await api.put(`/projects/${projectId}/product-backlog/${storyId}`, form)
    const parsed = productBacklogItemSchema.safeParse(data)
    if (parsed.success) return parsed.data
    throw new Error('Respuesta inválida al actualizar')
  } catch (e: any) {
    if (isAxiosError(e)) throw new Error(e.response?.data?.error || 'Error al actualizar historia')
    throw e
  }
}

export async function deleteBacklogItem(projectId: string, storyId: string) {
  try {
    await api.delete(`/projects/${projectId}/product-backlog/${storyId}`)
    return true
  } catch (e: any) {
    if (isAxiosError(e)) throw new Error(e.response?.data?.error || 'Error al eliminar historia')
    throw e
  }
}

export async function reorderBacklog(projectId: string, orderIds: string[]) {
  try {
    const { data } = await api.post(`/projects/${projectId}/product-backlog/reorder`, { order: orderIds })
    const parsed = productBacklogListSchema.safeParse(data)
    if (parsed.success) return parsed.data
    throw new Error('Respuesta inválida al reordenar')
  } catch (e: any) {
    if (isAxiosError(e)) throw new Error(e.response?.data?.error || 'Error al reordenar backlog')
    throw e
  }
}