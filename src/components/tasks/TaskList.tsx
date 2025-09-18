import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import type { Task } from "@/types/index"
import { useState } from "react"
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/TaskApi'
import { toast } from 'react-toastify'
import { statusTranslation } from '@/locales/es'

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


    const handleDeleteTask = (taskId: Task['_id']) => {
        const data = {
            projectId,
            taskId
        }
        mutate(data)
    }

    return (
        <div className="min-h-screen bg-gray-950 p-4 text-gray-100">
            <div className="max-w-9xl mx-auto">
                <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-3">
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
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-xs text-gray-100 group-hover:text-white">{task.name}</h4>
                                                        <p className="text-[10px] text-gray-400 group-hover:text-gray-300 line-clamp-2">{task.description}</p>
                                                    </div>
                                                    <div className='flex gap-1'>
                                                        <Menu as="div" className="relative">
                                                            <MenuButton className="p-1 rounded-md hover:bg-gray-700/50 transition-colors">
                                                                <FiMoreVertical className="h-4 w-4 text-gray-400 hover:text-gray-200" />
                                                            </MenuButton>
                                                            <Transition
                                                                as={Fragment}
                                                                enter="transition ease-out duration-100"
                                                                enterFrom="transform opacity-0 scale-95"
                                                                enterTo="transform opacity-100 scale-100"
                                                                leave="transition ease-in duration-75"
                                                                leaveFrom="transform opacity-100 scale-100"
                                                                leaveTo="transform opacity-0 scale-95"
                                                            >
                                                                <MenuItems className="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-gray-800 border border-gray-700 shadow-lg focus:outline-none">
                                                                    <div className="py-1">
                                                                        <MenuItem>
                                                                            {({ focus }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => navigate(`?viewTask=${task._id}`)}

                                                                                    className={`${focus ? 'bg-gray-700 text-white' : 'text-gray-300'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Ver Tarea
                                                                                </button>
                                                                            )}
                                                                        </MenuItem>
                                                                        <MenuItem>
                                                                            {({ focus }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => navigate(`?editTask=${task._id}`)}
                                                                                    className={`${focus ? 'bg-gray-700 text-white' : 'text-gray-300'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Editar Tarea
                                                                                </button>
                                                                            )}
                                                                        </MenuItem>
                                                                        <MenuItem>
                                                                            {({ focus }) => (
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleDeleteTask(task._id)}
                                                                                    className={`${focus ? 'bg-red-900/50 text-red-100' : 'text-red-400'} block w-full px-4 py-2 text-left text-sm`}
                                                                                >
                                                                                    Eliminar Tarea
                                                                                </button>
                                                                            )}
                                                                        </MenuItem>
                                                                    </div>
                                                                </MenuItems>
                                                            </Transition>
                                                        </Menu>
                                                    </div>


                                                </div>
                                                <div className="flex justify-between items-center mt-2">
                                                    <span className="text-[10px] text-gray-500 group-hover:text-gray-400">
                                                        {new Date(task.createdAt).toLocaleDateString()}
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
            </div>
        </div>
    )
}

export default TaskList