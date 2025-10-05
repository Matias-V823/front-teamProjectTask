import api from '@/lib/axios'
import { sprintListSchema, sprintSchema, type CreateSprintForm, type UpdateSprintForm, type Sprint } from '@/types'

export async function listSprints(projectId: string): Promise<Sprint[]> {
  const { data } = await api.get(`/projects/${projectId}/sprints`)
  const parsed = sprintListSchema.safeParse(data)
  if (!parsed.success) throw new Error('Respuesta inválida')
  return parsed.data
}

export async function createSprint(projectId: string, form: CreateSprintForm): Promise<Sprint> {
  const { data } = await api.post(`/projects/${projectId}/sprints`, form)
  const parsed = sprintSchema.safeParse(data)
  if (!parsed.success) throw new Error('Respuesta inválida al crear sprint')
  return parsed.data
}

export async function updateSprint(projectId: string, sprintId: string, payload: UpdateSprintForm): Promise<Sprint> {
  const { data } = await api.put(`/projects/${projectId}/sprints/${sprintId}`, payload)
  const parsed = sprintSchema.safeParse(data)
  if (!parsed.success) throw new Error('Respuesta inválida al actualizar sprint')
  return parsed.data
}

export async function assignStories(projectId: string, sprintId: string, stories: string[]): Promise<Sprint> {
  const { data } = await api.put(`/projects/${projectId}/sprints/${sprintId}/stories`, { stories })
  const parsed = sprintSchema.safeParse(data)
  if (!parsed.success) throw new Error('Respuesta inválida al asignar historias')
  return parsed.data
}

export async function getSprintStories(projectId: string, sprintId: string) {
  const { data } = await api.get(`/projects/${projectId}/sprints/${sprintId}/stories`)
  return data as any[]
}
