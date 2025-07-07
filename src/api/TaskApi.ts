import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { Project, Task, TaskFormData } from "../types";

type TaskApiType = {
    projectId: Project['_id']
    formData: TaskFormData
    taskId: Task['_id']
}


export async function createTask({ formData, projectId }: Pick<TaskApiType, 'formData' | 'projectId' >) {
    try {
        const { data } = await api.post<string>(`/projects/${projectId}/tasks`, formData)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
export async function getTaskById({ projectId, taskId }: Pick<TaskApiType,  'projectId' | 'taskId'  >) {
    try {
        const { data } = await api.get<string>(`/projects/${projectId}/tasks/${taskId}`)
        return data
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