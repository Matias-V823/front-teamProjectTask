import { Fragment } from 'react'
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useLocation, useNavigate, useParams } from 'react-router'
import TaskForm from './TaskForm'
import type { TaskFormData } from '@/types/index'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask } from '@/api/TaskApi'
import { toast } from 'react-toastify'
import { FiX } from 'react-icons/fi'
import { getProjectTeam } from '@/api/TeamApi'

export default function AddTaskModal() {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const projectId = params.projectId!
  const historyId = params.historyId as string | undefined

  const queryParams = new URLSearchParams(location.search)
  const show = queryParams.has('newTask')

  const initialValues: TaskFormData = {
    name: '',
    description: '',
    assignedTo: '' as any
  }

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: initialValues
  })

  const { data: teamData } = useQuery({
    queryKey: ['teamMembers', projectId],
    queryFn: () => getProjectTeam(projectId),
    enabled: !!projectId
  })

  const queryClient = useQueryClient()
  const sprints: any[] | undefined = queryClient.getQueryData(['sprints', { projectId }]) as any
  let sprintId: string | undefined
  if (historyId && Array.isArray(sprints)) {
    const sprint = sprints.find(sp => Array.isArray(sp.stories) && sp.stories.includes(historyId))
    if (sprint) sprintId = sprint._id
  }

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onError: (error: any) => {
      toast.error(error.message, {
        theme: 'dark',
        position: 'top-right'
      })
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['editProject', { projectId }] })
      queryClient.invalidateQueries({ queryKey: ['project', { projectId }] })
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] }) // refrescar listado de tareas
      reset()
      toast.success(data, {
        theme: 'dark',
        position: 'top-right'
      })
      navigate(location.pathname, { replace: true })
    }
  })

  const handleCreateTask = (formData: TaskFormData) => {
    mutate({ formData, projectId, sprintId, storyId: historyId })
  }

  if (!show) return null

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white border border-gray-200 text-left align-middle shadow-2xl transition-all p-8 relative">
                <button
                  onClick={() => navigate(location.pathname, { replace: true })}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <FiX className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>

                <div className="space-y-6">
                  <div>
                    <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">
                      Crear Nueva Tarea
                    </DialogTitle>
                    <p className="text-gray-400 mt-1">
                      Completa el formulario para agregar una nueva tarea al proyecto
                    </p>
                  </div>

                  <form className='space-y-6' noValidate onSubmit={handleSubmit(handleCreateTask)}>
                    <TaskForm errors={errors} register={register} members={teamData?.team || []} />
                    <button
                      type="submit"
                      disabled={isPending}
                      className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all cursor-pointer ${
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
                          Guardando...
                        </span>
                      ) : (
                        'Guardar Tarea'
                      )}
                    </button>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}