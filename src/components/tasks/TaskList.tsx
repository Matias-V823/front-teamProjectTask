import { Fragment, useMemo } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import type { Task, Sprint } from "@/types/index"
import { FiMoreVertical } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteTask, updateStatus } from '@/api/TaskApi'
import { toast } from 'react-toastify'
import { statusTranslation } from '@/locales/es'
import { listSprints } from '@/api/SprintBacklogApi'
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { getProjectTeam } from '@/api/TeamApi'

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

function DraggableTask({ task, navigate, handleDeleteTask, assigneeInitials }: { task: Task; navigate: any; handleDeleteTask: (id: string) => void; assigneeInitials?: string }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task._id })
    const style: React.CSSProperties = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        opacity: isDragging ? 0.6 : 1
    }
    return (
        <div ref={setNodeRef} style={style} className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all cursor-grab active:cursor-grabbing group" {...listeners} {...attributes}>
            <div className="flex justify-between items-start">
                <div>
                    {assigneeInitials ? (
                        <div className="mb-1">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">
                                {assigneeInitials}
                            </span>
                        </div>
                    ) : null}
                    <h4 className="text-xs text-gray-800 font-medium group-hover:text-gray-900">{task.name}</h4>
                    <p className="text-[11px] text-gray-500 group-hover:text-gray-600 line-clamp-2">{task.description}</p>
                </div>
                <div className='flex gap-1'>
                    <Menu as="div" className="relative">
                        <MenuButton className="p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <FiMoreVertical className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                        </MenuButton>
                        <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                            <MenuItems className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg focus:outline-none">
                                <div className="py-1">
                                    <MenuItem>{() => (
                                        <button type="button" onClick={() => navigate(`?viewTask=${task._id}`)} className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 block w-full px-4 py-2 text-left text-sm'>Ver Tarea</button>
                                    )}</MenuItem>
                                    <MenuItem>{() => (
                                        <button type="button" onClick={() => navigate(`?editTask=${task._id}`)} className='text-gray-600 hover:bg-gray-100 hover:text-gray-900 block w-full px-4 py-2 text-left text-sm'>Editar Tarea</button>
                                    )}</MenuItem>
                                    <MenuItem>{() => (
                                        <button type="button" onClick={() => handleDeleteTask(task._id)} className='text-red-600 hover:bg-red-50 hover:text-red-700 block w-full px-4 py-2 text-left text-sm'>Eliminar Tarea</button>
                                    )}</MenuItem>
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-gray-400 group-hover:text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
    )
}

function DroppableColumn({ status, children }: { status: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: status })
    return (
        <div ref={setNodeRef} className={`bg-white rounded-lg shadow-sm border ${isOver ? 'border-indigo-300 bg-indigo-50/40' : 'border-gray-200'}`} id={status}>
            {children}
        </div>
    )
}

const TaskList = ({ tasks }: TaskListProps) => {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data: teamData } = useQuery({
        queryKey: ['teamMembers', projectId],
        queryFn: () => getProjectTeam(projectId),
        enabled: !!projectId
    })

    const memberById = useMemo(() => {
        const map = new Map<string, { _id: string; name: string; email: string }>()
        if (teamData?.team) {
            for (const m of teamData.team) map.set(m._id, { _id: m._id, name: m.name, email: m.email })
        }
        return map
    }, [teamData])

    const { data: sprints = [] } = useQuery({
        queryKey: ['sprints', { projectId }],
        queryFn: () => listSprints(projectId),
        enabled: !!projectId
    })

    const today = new Date()
    const sortedSprints: Sprint[] = [...sprints].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

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
    const { mutate: mutateDelete, reset } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['project', { projectId }] })
            reset()
            toast.success(data, { theme: 'light', position: 'top-right' })
        },
        onError: (error) => toast.error(error.message, { theme: 'light' })
    })

    const { mutate: mutateStatus } = useMutation({
        mutationFn: updateStatus,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['project', { projectId }] }),
        onError: (error: any) => toast.error(error.message, { theme: 'light' })
    })

    const handleDeleteTask = (taskId: Task['_id']) => mutateDelete({ projectId, taskId })

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    const tasksByColumn: GroupedTasks = useMemo(() => {
        return sprintTasks.reduce((acc: GroupedTasks, t) => {
            if (!acc[t.status]) acc[t.status] = []
            acc[t.status].push(t)
            return acc
        }, { pending: [], onHold: [], inProgress: [], underReview: [], completed: [] })
    }, [sprintTasks])

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = String(active.id)
        const overId = String(over.id)

        let targetStatus = overId
        const statusKeys = Object.keys(initialStatusGroups)
        if (!statusKeys.includes(targetStatus)) {
            const containing = Object.entries(tasksByColumn).find(([, list]) => list.some(t => t._id === overId))
            if (containing) targetStatus = containing[0]
        }
        const task = sprintTasks.find(t => t._id === activeId)
        if (!task) return
        if (targetStatus !== task.status && statusKeys.includes(targetStatus)) {
            mutateStatus({ projectId, taskId: task._id, status: targetStatus as any })
        }
    }

    return (
        <div className="min-h-screen p-4 bg-gray-50 text-gray-800">
            <div className="max-w-9xl mx-auto">
                {sprintToShow && (
                    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-5 gap-3">
                                {Object.keys(initialStatusGroups).map(status => {
                                    const columnTasks = tasksByColumn[status] || []
                                    return (
                                        <DroppableColumn key={status} status={status}>
                                            <div className={`p-3 rounded-t-md border-b ${statusColors[status]}`}>
                                                <h3 className="font-medium">{statusTranslation[status]}</h3>
                                                <span className="text-xs font-semibold">{columnTasks.length} tareas</span>
                                            </div>
                                            <div className="p-3 space-y-2 min-h-[60px]">
                                                {columnTasks.length > 0 ? (
                                                    columnTasks.map(task => {
                                                        const member = task.assignedTo ? memberById.get(String(task.assignedTo)) : undefined
                                                        const initials = member ? member.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : undefined
                                                        return (
                                                            <DraggableTask key={task._id} task={task} navigate={navigate} handleDeleteTask={handleDeleteTask} assigneeInitials={initials} />
                                                        )
                                                    })
                                                ) : (
                                                    <div className="text-center py-4 bg-white/60 rounded-lg border border-dashed border-gray-200">
                                                        <p className="text-gray-400 text-sm">No hay tareas aquí</p>
                                                    </div>
                                                )}
                                            </div>
                                        </DroppableColumn>
                                    )
                                })}
                            </div>
                        </div>
                    </DndContext>
                )}
            </div>
        </div>
    )
}

export default TaskList