import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { taskSchema, type Project, type Task, type TaskFormData } from "../types";

type TaskApiType = {
    projectId: Project['_id']
    formData: TaskFormData
    taskId: Task['_id']
    status: Task['status']
}


export async function createTask({ formData, projectId, sprintId, storyId }: Pick<TaskApiType, 'formData' | 'projectId'> & { sprintId?: string; storyId?: string }) {
    try {
        const payload: any = { ...formData }
        if (sprintId) payload.sprint = sprintId
        if (storyId) payload.story = storyId
        const { data } = await api.post<string>(`/projects/${projectId}/tasks`, payload)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function getTaskById({ projectId, taskId }: Pick<TaskApiType,  'projectId' | 'taskId'  >) {
    try {
        const { data } = await api<string>(`/projects/${projectId}/tasks/${taskId}`)
        const response = taskSchema.safeParse(data)
        if(response){
            return response.data
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function updateTask({ projectId, taskId, formData }: Pick<TaskApiType,  'projectId' | 'taskId' | 'formData'  >) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}/tasks/${taskId}`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function deleteTask({ projectId, taskId }: Pick<TaskApiType,  'projectId' | 'taskId'  >) {
    try {
        const { data } = await api.delete<string>(`/projects/${projectId}/tasks/${taskId}`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export async function updateStatus({ status, projectId, taskId }: Pick<TaskApiType, 'status' | 'projectId'| 'taskId' >) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/tasks/${taskId}/status`, {status})
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function getTasks(projectId: Project['_id']) {
    try {
        const { data } = await api.get(`/projects/${projectId}/tasks`)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        throw new Error('Error desconocido al obtener tareas')
    }
}

