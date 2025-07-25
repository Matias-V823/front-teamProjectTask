import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate, useParams } from 'react-router';
import TaskForm from './TaskForm';
import type { TaskFormData } from '@/types/index';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';

export default function AddTaskModal() {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const projectId = params.projectId!
    const queryParams = new URLSearchParams(location.search)
    const modalTask = queryParams.get('newTask')
    const show = modalTask ? true : false

    const initialValues: TaskFormData = {
        name: '',
        description: ''
    }
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ 
        defaultValues: initialValues 
    })

    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation({
        mutationFn: createTask,
        onError: (error)=> {
            toast.error(error.message, {
                theme: 'dark',
                position: 'top-right'
            })
        },
        onSuccess: (data)=> {
            queryClient.invalidateQueries({queryKey: ['editProject', {projectId}]})
            reset()
            toast.success(data, {
                theme: 'dark',
                position: 'top-right'
            })
            navigate(location.pathname, { replace: true })
        }
    })

    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
    }

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-900 border border-gray-800 text-left align-middle shadow-2xl transition-all p-8 relative">
                                <button
                                    onClick={() => navigate(location.pathname, { replace: true })}
                                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    <FiX className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                                </button>

                                <div className="space-y-6">
                                    <div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-bold text-gray-100"
                                        >
                                            Crear Nueva Tarea
                                        </Dialog.Title>
                                        <p className="text-gray-400 mt-1">
                                            Completa el formulario para agregar una nueva tarea al proyecto
                                        </p>
                                    </div>

                                    <form
                                        className='space-y-6'
                                        noValidate
                                        onSubmit={handleSubmit(handleCreateTask)}
                                    >
                                        <TaskForm
                                            errors={errors}
                                            register={register}
                                        />
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
                                                    Guardando...
                                                </span>
                                            ) : (
                                                'Guardar Tarea'
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}