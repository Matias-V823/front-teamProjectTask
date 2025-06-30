import { Link, useNavigate } from "react-router"
import { useForm } from 'react-hook-form'
import ProjectForm from "@/components/projects/ProjectForm"
import type { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectApi"
import { toast } from "react-toastify"

const CreateProjectView = () => {

  const navigate = useNavigate()
  const initialValues : ProjectFormData = {
    projectName:"",
    clientName:"",
    description:""
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })

  const handleForm = async (formData : ProjectFormData) => {
    const data = await createProject(formData)
    toast.success('Proyecto Creado')
    navigate('/projects')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-5xl text-gray-50 font-bold">Crear Proyecto</h1>
      <p className="text-2xl font-light text-gray-500 mt-3">Llena el siguiente formulario para crear un proyecto</p>
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
          value='Crear Proyecto'
          className="bg-sky-400 hover:bg-gray-600 w-full p-3 text-gray-50 uppercase font-bold cursor-pointer transition-colors rounded-lg"
        />
      </form>
    </div>
  )
}
export default CreateProjectView