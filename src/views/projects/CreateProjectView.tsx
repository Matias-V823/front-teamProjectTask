import { Link, useNavigate } from "react-router"
import { useForm } from 'react-hook-form'
import { useMutation } from "@tanstack/react-query"
import ProjectForm from "@/components/projects/ProjectForm"
import type { ProjectFormData } from "@/types/index"
import { createProject } from "@/api/ProjectApi"
import { toast } from "react-toastify"
import { FiArrowLeft } from 'react-icons/fi'

const CreateProjectView = () => {

  const navigate = useNavigate()
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: ""
  }

  const { register, handleSubmit, formState: { errors } } = useForm({ 
    defaultValues: initialValues 
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onError: () => {
      toast.error('Error al crear proyecto', {
        theme: 'dark',
        position: 'top-right'
      })
    },
    onSuccess: () => {
      toast.success('Proyecto creado correctamente', {
        theme: 'dark',
        position: 'top-right'
      })
      navigate('/projects')
    }
  })

  const handleForm = (formData: ProjectFormData) => mutate(formData)

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/projects"
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver a proyectos</span>
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
            Crear Nuevo Proyecto
          </h1>
          <p className="text-xl text-gray-400 mt-2">
            Completa el formulario para registrar un nuevo proyecto
          </p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-gray-900">
            <div className="bg-gray-900/90 p-8">
              <form onSubmit={handleSubmit(handleForm)} noValidate>
                <ProjectForm 
                  errors={errors}
                  register={register}
                />
                
                <div className="mt-10">
                  <button
                    type="submit"
                    disabled={isPending}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
                      isPending 
                        ? 'bg-indigo-800 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20'
                    }`}
                  >
                    {isPending ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creando...
                      </span>
                    ) : (
                      'Crear Proyecto'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateProjectView