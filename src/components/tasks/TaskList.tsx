import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import type { Task } from "@/types/index"
import { useState } from "react"
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/TaskApi'
import { toast } from 'react-toastify'
import { statusTranslation } from '@/locales/es'
import Timer from '../Timer'

type TaskListProps = {
    tasks: Task[]
}


type GroupedTasks = {
    [key: string]: Task[]
}



export const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
    onHold: "bg-blue-900/30 text-blue-400 border-blue-800/50",
    inProgress: "bg-purple-900/30 text-purple-400 border-purple-800/50",
    underReview: "bg-orange-900/30 text-orange-400 border-orange-800/50",
    completed: "bg-green-900/30 text-green-400 border-green-800/50"
};

const priorityColors: { [key: string]: string } = {
    high: "bg-red-900/50 text-red-300 border-red-700/50",
    medium: "bg-amber-900/50 text-amber-300 border-amber-700/50",
    low: "bg-gray-800 text-gray-300 border-gray-700/50"
};

const initialStatusGroups: GroupedTasks = {
    pending: [],
    onHold: [],
    inProgress: [],
    underReview: [],
    completed: []
}

const TaskList = ({ tasks }: TaskListProps) => {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const [todayTasks, setTodayTasks] = useState<Task[]>([])
    const date = new Date()
    const today = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })


    const queryClient = useQueryClient()
    const { mutate, reset } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['project', { projectId }] })
            reset()
            toast.success(data, {
                theme: 'dark',
                position: 'top-right'
            })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


    const groupedTasks = tasks.reduce((acc, task) => {
        const currentGroup = acc[task.status] ? [...acc[task.status]] : []
        return { ...acc, [task.status]: [...currentGroup, task] }
    }, initialStatusGroups)

    const handleAddToToday = (task: Task) => {
        if (!todayTasks.some(t => t._id === task._id)) {
            setTodayTasks([...todayTasks, task])
        }
    }

    const handleRemoveFromToday = (taskId: string) => {
        setTodayTasks(todayTasks.filter(task => task._id !== taskId))
    }


    const handleDeleteTask = (taskId: Task['_id']) => {
        const data = {
            projectId,
            taskId
        }
        mutate(data)
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna Izquierda - Lista de Tareas */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-100">Mis Tareas</h1>
                            <p className="text-gray-400">Organiza tu flujo de trabajo</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(groupedTasks).map(([status, tasks]) => (
                            <div key={status} className="bg-gray-900 rounded-lg shadow-lg  border border-gray-800">
                                <div className={`p-3 ${statusColors[status]} border-b border-gray-800`}>
                                    <h3 className="font-medium">{statusTranslation[status]}</h3>
                                    <span className="text-xs font-semibold">{tasks.length} tareas</span>
                                </div>

                                <div className="p-3 space-y-2">
                                    {tasks.length > 0 ? (
                                        tasks.map(task => (
                                            <div
                                                key={task._id}
                                                className="p-3 bg-gray-800/60 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all cursor-grab active:cursor-grabbing group"
                                                draggable
                                                onDragEnd={() => handleAddToToday(task)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-gray-100 group-hover:text-white">{task.name}</h4>
                                                        <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2">{task.description}</p>
                                                    </div>
                                                    <div className='flex gap-1'>
                                                        <button
                                                            onClick={() => handleAddToToday(task)}
                                                            className="text-indigo-400 hover:text-indigo-300 text-sm font-medium px-2 py-1 rounded-md bg-indigo-900/30 hover:bg-indigo-900/50 transition-colors"
                                                        >
                                                            + Hoy
                                                        </button>
                                                        <Menu as="div" className="relative">
                                                            <Menu.Button className="p-1 rounded-md hover:bg-gray-700/50 transition-colors">
                                                                <FiMoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-200" />
                                                            </Menu.Button>
                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-gray-800 border border-gray-700 shadow-lg focus:outline-none">
                                                                    <div className="py-1">
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => navigate(`?viewTask=${task._id}`)}

                                                                                    className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Ver Tarea
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => navigate(`?editTask=${task._id}`)}
                                                                                    className={`${active ? 'bg-gray-700 text-white' : 'text-gray-300'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Editar Tarea
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                            {({ active }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteTask(task._id)}
                                                                                    className={`${active ? 'bg-red-900/50 text-red-100' : 'text-red-400'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Eliminar Tarea
                                                                                </button>
                                                                            )}
                                                                        </Menu.Item>
                                                                    </div>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>
                                                    </div>


                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-xs text-gray-500 group-hover:text-gray-400">
                                                        {new Date(task.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.status as keyof typeof priorityColors] || priorityColors.low
                                                        }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 bg-gray-900/30 rounded-lg">
                                            <p className="text-gray-500 text-sm">No hay tareas aquí</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Columna Derecha - Tareas de Hoy + Pomodoro */}
                <div className="bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-800 sticky top-6 h-fit">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-100">Plan para hoy</h2>
                        <p className="text-gray-400 capitalize">{today}</p>
                    </div>

                    <Timer/>

                    <div>
                        <h3 className="font-medium text-gray-300 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
                            Tareas seleccionadas ({todayTasks.length})
                        </h3>

                        {todayTasks.length > 0 ? (
                            <div className="space-y-3">
                                {todayTasks.map(task => (
                                    <div
                                        key={task._id}
                                        className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-800/50 group hover:bg-indigo-900/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-indigo-200">{task.name}</h4>
                                                <p className="text-sm text-indigo-300/80 line-clamp-2">{task.description}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveFromToday(task._id)}
                                                className="text-indigo-400 hover:text-indigo-300 opacity-0 group-hover:opacity-100 transition-all px-2 py-1 rounded-md hover:bg-indigo-900/50"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-indigo-400/70">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full border ${priorityColors[task.status as keyof typeof priorityColors] || priorityColors.low
                                                }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-900/30">
                                <p className="text-gray-500 mb-2">Arrastra tareas aquí</p>
                                <p className="text-xs text-gray-500">o haz clic en "+ Hoy"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskList