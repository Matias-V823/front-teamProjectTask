import { Link, useNavigate } from "react-router"
import ProjectForm from "./ProjectForm"
import { useForm } from "react-hook-form"
import type { ProjectFormData } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/api/ProjectApi"
import { toast } from "react-toastify"


type EditProjectFormProps ={
    data: ProjectFormData
    projectId: string
}

const EditProjectForm = ({data, projectId} : EditProjectFormProps) => {
    const navigate = useNavigate()
    const initialValues: ProjectFormData = {
        projectName: data.projectName,
        clientName: data.clientName,
        description: data.description
    }
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })


    const queryClient = useQueryClient()


    const { mutate }= useMutation({
        mutationFn: updateProject,
        onError: (error)=> {
            toast.error(error.message)
        },
        onSuccess: (data)=> {
            queryClient.invalidateQueries({queryKey: ['projects']})
            queryClient.invalidateQueries({queryKey: ['editProject', {projectId}]})
            toast.success(data)
            navigate('/projects')
        }
    })



    const handleForm = (formData : ProjectFormData) =>{
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl text-gray-50 font-bold">Editar Proyecto</h1>
            <p className="text-2xl font-light text-gray-500 mt-3">Llena el siguiente formulario para editar el proyecto</p>
            <nav className="my-5">
                <Link
                    to='/projects/'
                    className="bg-sky-50 px-5 py-2 rounded-lg cursor-pointer">
                    Volver atras
                </Link>
            </nav>
            <form
                className="mt-10 bg-gray-900 shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)}
                noValidate
            >
                <ProjectForm
                    errors={errors}
                    register={register}
                />
                <input
                    type="submit"
                    value='Guardar cambios'
                    className="bg-sky-400 hover:bg-gray-600 w-full p-3 text-gray-50 uppercase font-bold cursor-pointer transition-colors rounded-lg"
                />
            </form>
        </div>
    )
}
export default EditProjectForm