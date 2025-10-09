import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FiArrowLeft, FiPlus, FiTrash2, FiEye, FiEdit } from 'react-icons/fi'
import AddTaskModal from '@/components/tasks/AddTaskModal'
import ViewTaskModal from '@/components/tasks/ViewTaskModal'
import EditTaskData from '@/components/tasks/EditTaskData'
import { getTasks, deleteTask } from '@/api/TaskApi'
import { getBacklogItem } from '@/api/ProducBacklogApi'
import { listSprints } from '@/api/SprintBacklogApi'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface StoryTask {
  id: string
  description: string
  done: boolean
  originalStatus: string
}

const HistoryUserDetail = () => {
  const { historyId, projectId } = useParams()
  const navigate = useNavigate()

  const { data: story, isLoading: loadingStory, error: storyError } = useQuery({
    queryKey: ['productBacklogItem', { projectId, historyId }],
    queryFn: () => getBacklogItem(projectId!, historyId!),
    enabled: !!projectId && !!historyId
  })

  const { data: sprints = [] } = useQuery({
    queryKey: ['sprints', { projectId }],
    queryFn: () => listSprints(projectId!),
    enabled: !!projectId
  })

  const sprintContaining = useMemo(() => {
    if (!story) return null
    return sprints.find(sp => sp.stories.includes(story._id)) || null
  }, [sprints, story])

  const { data: tasksData, isLoading: loadingTasks, error: tasksError } = useQuery({
    queryKey: ['tasks', { projectId }],
    queryFn: () => getTasks(projectId as any),
    enabled: !!projectId,
    staleTime: 30000
  })

  const queryClient = useQueryClient()

  const [tasks, setTasks] = useState<StoryTask[]>([])

  useEffect(() => {
    if (tasksData) {
      const mapped: StoryTask[] = (tasksData as any[])
        .filter((t: any) => !story || !t.story || t.story === story._id)
        .map((t: any) => ({
          id: (t._id || t.id || '').toString(),
          description: t.description || t.name || 'Tarea sin descripción',
          done: t.status === 'completed',
          originalStatus: t.status || 'pending'
        }))
      setTasks(mapped)
    }
  }, [tasksData, story])

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask({ projectId: projectId as any, taskId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', { projectId }] })
    }
  })

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    deleteTaskMutation.mutate(id)
  }

  if (loadingStory) {
    return (
      <div className='p-10 text-center text-gray-500'>Cargando historia...</div>
    )
  }
  if (storyError || !story) {
    return (
      <div className='p-10 text-center text-red-500'>No se pudo cargar la historia</div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 pt-10 mb-6">
          <button
            onClick={() => navigate('/projects/' + projectId + '/view' + '/sprint-backlog')}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">{story.title}</h1>
              <p className="text-gray-500 text-sm">ID: <span className="text-gray-700 font-medium">#{story._id.slice(-6)}</span></p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium">Persona: {story.persona}</span>
                <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium">Objetivo: {story.objetivo}</span>
                <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-medium">Beneficio: {story.beneficio}</span>
                {sprintContaining && (
                  <span className="bg-sky-50 text-sky-600 px-2 py-1 rounded-md font-medium">Sprint: {sprintContaining.name}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="text-sm text-gray-500">Estimación</span>
              <span className="text-3xl font-bold text-indigo-600">{story.estimate}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Descripción</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{story.title}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Criterios de Aceptación</h2>
              <pre className="text-gray-600 whitespace-pre-wrap text-sm">{story.acceptanceCriteria || '—'}</pre>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Tareas de Implementación</h2>
            <div className="w-full md:w-auto">
              <button
                onClick={() => navigate('?newTask')}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
              >
                <FiPlus className="w-4 h-4" /> Añadir
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-600 uppercase tracking-wide">
              <div className="col-span-1 text-center">ID</div>
              <div className="col-span-8 md:col-span-8">Descripción</div>
              <div className="col-span-3 md:col-span-3 text-center">Acciones</div>
            </div>
            {loadingTasks ? (
              <div className="p-6 text-center text-sm text-gray-500">Cargando tareas...</div>
            ) : tasksError ? (
              <div className="p-6 text-center text-sm text-red-500">{(tasksError as Error).message || 'Error al cargar tareas'}</div>
            ) : tasks.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">Aún no hay tareas agregadas para esta historia.</div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center border-t border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                  <div className="col-span-1 text-center text-gray-400">#{task.id.slice(0,6)}</div>
                  <div className={`col-span-8 md:col-span-8 pr-2 ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.description}</div>
                  <div className="col-span-3 md:col-span-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => navigate(`?viewTask=${task.id}`)}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <FiEye className="w-4 h-4" /> Ver
                    </button>
                    <button
                      onClick={() => navigate(`?editTask=${task.id}`)}
                      className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-amber-600 hover:bg-amber-50 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" /> Editar
                    </button>
                    <button
                      disabled={deleteTaskMutation.isPending}
                      onClick={() => handleDeleteTask(task.id)}
                      className={`cursor-pointer inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded text-red-600 hover:bg-red-50 transition-colors ${deleteTaskMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FiTrash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <AddTaskModal />
      <EditTaskData />
      <ViewTaskModal />
    </div>
  )
}
export default HistoryUserDetail