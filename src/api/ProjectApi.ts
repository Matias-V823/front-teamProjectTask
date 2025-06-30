import api from "@/lib/axios"
import { dashboardProjectSchema, type ProjectFormData } from "../types"

export async function createProject(formData : ProjectFormData) {
    try {
        const { data } = await api.post('/projects', formData)
        console.log('Projecto creado correctamente', data)
        return data
    } catch (error) {
        console.error('ERROR AL CREAR PROYECTO',error)
    }
}
export async function getProjects() {
    try {
        const { data } = await api.get('/projects')
        const response = dashboardProjectSchema.safeParse(data) //validacion con zod
        if(response.success){
            return response.data
        }
    } catch (error) {
        console.error('ERROR AL CONSULTAR PROYECTOS',error)
    }
}