import api from "@/lib/axios"
import { dashboardProjectSchema, type Project, type ProjectFormData } from "../types"

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
        const { data } = await api('/projects')
        const response = dashboardProjectSchema.safeParse(data) //validacion con zod
        if(response.success){
            return response.data
        }
    } catch (error) {
        console.error('ERROR AL CONSULTAR PROYECTOS',error)
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const data  = await api(`/projects/${id}`)
        return data.data
    } catch (error) {
        console.error('ERROR AL CONSULTAR PROYECTOS',error)
        return null
    }
}

type ProjectAPIType = {
    formData: ProjectFormData
    projectId: Project['_id']
}


export async function updateProject({formData, projectId}: ProjectAPIType ) {
    try {
        const { data }  = await api.put(`/projects/${projectId}`, formData)
        return data
    } catch (error) {
        console.error('ERROR AL CONSULTAR PROYECTOS',error)
        return null
    }
}

export async function deleteProject(projectId: Project['_id'] ) {
    try {
        const { data }  = await api.delete<string>(`/projects/${projectId}`)
        return data
    } catch (error) {
        console.error('ERROR AL CONSULTAR PROYECTOS',error)
        return null
    }
}