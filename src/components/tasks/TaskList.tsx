import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import type { Task, Sprint } from "@/types/index"
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '@/api/TaskApi'
import { toast } from 'react-toastify'
import { statusTranslation } from '@/locales/es'
import { listSprints } from '@/api/SprintBacklogApi'

type TaskListProps = {
    tasks: Task[]
}

type GroupedTasks = {
    [key: string]: Task[]
}

export const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    onHold: "bg-blue-50 text-blue-700 border-blue-200",
    inProgress: "bg-purple-50 text-purple-700 border-purple-200",
    underReview: "bg-orange-50 text-orange-700 border-orange-200",
    completed: "bg-green-50 text-green-700 border-green-200"
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

    const { data: sprints = [] } = useQuery({
        queryKey: ['sprints', { projectId }],
        queryFn: () => listSprints(projectId),
        enabled: !!projectId
    })

    const today = new Date()
    const sortedSprints: Sprint[] = [...sprints].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    const activeSprint = sortedSprints.find(sp => {
        const start = new Date(sp.startDate)
        const end = new Date(sp.endDate)
        return today >= start && today <= end
    }) || null

    let sprintToShow: Sprint | null = activeSprint
    if (!activeSprint) {
        const upcoming = sortedSprints.filter(sp => new Date(sp.startDate) > today)
        sprintToShow = upcoming.length > 0 ? upcoming[0] : null
    } else {
        if (today > new Date(activeSprint.endDate)) {
            const afterActive = sortedSprints.filter(sp => new Date(sp.startDate) > new Date(activeSprint.endDate))
            sprintToShow = afterActive.length > 0 ? afterActive[0] : null
        }
    }

    const sprintTasks = sprintToShow ? tasks.filter(t => (t as any).sprint && ((t as any).sprint === sprintToShow!._id || (typeof (t as any).sprint === 'object' && (t as any).sprint?._id === sprintToShow!._id))) : []

    const queryClient = useQueryClient()
    const { mutate, reset } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['project', { projectId }] })
            reset()
            toast.success(data, {
                theme: 'light',
                position: 'top-right'
            })
        },
        onError: (error) => {
            toast.error(error.message, { theme: 'light' })
        }
    })

    const groupedTasks = sprintTasks.reduce((acc, task) => {
        const currentGroup = acc[task.status] ? [...acc[task.status]] : []
        return { ...acc, [task.status]: [...currentGroup, task] }
    }, initialStatusGroups)

    const handleDeleteTask = (taskId: Task['_id']) => {
        mutate({ projectId, taskId })
    }

    return (
        <div className="min-h-screen p-4 bg-gray-50 text-gray-800">
            <div className="max-w-9xl mx-auto">
                {sprintToShow && (
                  <div className="space-y-6">
                      <div className="grid grid-cols-5 gap-3">
                          {Object.entries(groupedTasks).map(([status, tasks]) => (
                              <div key={status} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                  <div className={`p-3 rounded-t-md border-b ${statusColors[status]}`}>
                                      <h3 className="font-medium">{statusTranslation[status]}</h3>
                                      <span className="text-xs font-semibold">{tasks.length} tareas</span>
                                  </div>

                                  <div className="p-3 space-y-2">
                                      {tasks.length > 0 ? (
                                          tasks.map(task => (
                                              <div
                                                  key={task._id}
                                                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-grab active:cursor-grabbing group"
                                                  draggable
                                              >
                                                  <div className="flex justify-between items-start">
                                                      <div>
                                                          <h4 className="text-xs text-gray-800 font-medium group-hover:text-gray-900">{task.name}</h4>
                                                          <p className="text-[11px] text-gray-500 group-hover:text-gray-600 line-clamp-2">{task.description}</p>
                                                      </div>
                                                      <div className='flex gap-1'>
                                                          <Menu as="div" className="relative">
                                                              <MenuButton className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                                                                  <FiMoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
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
                                                                  <MenuItems className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none">
                                                                      <div className="py-1">
                                                                          <MenuItem>
                                                                              {() => (
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={() => navigate(`?viewTask=${task._id}`)}
                                                                                      className={'text-gray-600 hover:bg-gray-100 hover:text-gray-900 block w-full px-4 py-2 text-left text-sm'}
                                                                                  >
                                                                                      Ver Tarea
                                                                                  </button>
                                                                              )}
                                                                          </MenuItem>
                                                                          <MenuItem>
                                                                              {() => (
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={() => navigate(`?editTask=${task._id}`)}
                                                                                      className={'text-gray-600 hover:bg-gray-100 hover:text-gray-900 block w-full px-4 py-2 text-left text-sm'}
                                                                                  >
                                                                                      Editar Tarea
                                                                                  </button>
                                                                              )}
                                                                          </MenuItem>
                                                                          <MenuItem>
                                                                              {() => (
                                                                                  <button
                                                                                      type="button"
                                                                                      onClick={() => handleDeleteTask(task._id)}
                                                                                      className={'text-red-600 hover:bg-red-50 hover:text-red-700 block w-full px-4 py-2 text-left text-sm'}
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
                                                      <span className="text-[10px] text-gray-400 group-hover:text-gray-500">
                                                          {new Date(task.createdAt).toLocaleDateString()}
                                                      </span>
                                                  </div>
                                              </div>
                                          ))
                                      ) : (
                                          <div className="text-center py-4 bg-white/60 rounded-lg border border-dashed border-gray-200">
                                              <p className="text-gray-400 text-sm">No hay tareas aquí</p>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
                )}
            </div>
        </div>
    )
}

export default TaskList