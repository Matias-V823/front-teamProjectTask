import api from "@/lib/axios"
import type { ProjectFormData } from "../types"

export async function createProject(formData : ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        console.log('Projecto creado correctamente', data)
    } catch (error) {
        console.error('ERROR AL CREAR PROYECTO',error)
    }
}