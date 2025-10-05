import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { FiArrowLeft, FiPlus, FiCheck, FiTrash2 } from 'react-icons/fi'
import AddTaskModal from '@/components/tasks/AddTaskModal'
import { getTasks } from '@/api/TaskApi'
import { useQuery } from '@tanstack/react-query'

interface StoryDetail {
  id: number
  title: string
  persona: string
  objetivo: string
  beneficio: string
  estimate: number
  acceptanceCriteria: string[]
  description: string
}

interface StoryTask {
  id: number
  description: string
  done: boolean
}

const STORY_MOCKS: Record<number, StoryDetail> = {
  1: {
    id: 1,
    title: 'Como Cliente quiero visualizar el catálogo',
    persona: 'Cliente',
    objetivo: 'visualizar el catálogo de ítems vendidos',
    beneficio: 'pueda ordenar un ítem',
    estimate: 8,
    acceptanceCriteria: [
      'Se listan ítems con nombre, precio y stock',
      'Se puede ver detalle de un ítem',
      'Se puede añadir al carrito y confirmar orden'
    ],
    description: 'Permitir al cliente navegar y visualizar un catálogo navegable con filtros básicos.'
  },
  2: {
    id: 2,
    title: 'Como Usuario registrado quiero iniciar sesión',
    persona: 'Usuario registrado',
    objetivo: 'iniciar sesión de forma segura',
    beneficio: 'pueda acceder a mis datos y pedidos',
    estimate: 5,
    acceptanceCriteria: [
      'Autenticación por email y contraseña',
      'Manejo de errores en credenciales inválidas',
      'Cierre de sesión seguro'
    ],
    description: 'Implementar flujo de autenticación con persistencia y manejo de errores.'
  },
  3: {
    id: 3,
    title: 'Como Usuario quiero usar la app en móviles',
    persona: 'Usuario',
    objetivo: 'usar la aplicación en dispositivos móviles',
    beneficio: 'tenga una experiencia adecuada en pantallas pequeñas',
    estimate: 13,
    acceptanceCriteria: [
      'Layout responsive',
      'Menú accesible y legible',
      'Contenido no se desborda'
    ],
    description: 'Asegurar vistas adaptadas a diferentes tamaños de pantalla.'
  }
}

const HistoryUserDetail = () => {
  const { historyId, projectId } = useParams()
  const navigate = useNavigate()
  const numericId = Number(historyId)
  const story = STORY_MOCKS[numericId] || {
    id: numericId,
    title: `Historia #${historyId}`,
    persona: 'N/A',
    objetivo: 'N/A',
    beneficio: 'N/A',
    estimate: 0,
    acceptanceCriteria: ['Sin criterios definidos'],
    description: 'No hay información disponible para esta historia.'
  }

  const [tasks, setTasks] = useState<StoryTask[]>([])

  const { data: tasksData, isLoading: loadingTasks, error: tasksError } = useQuery({
    queryKey: ['tasks', { projectId }],
    queryFn: () => getTasks(projectId as any),
    enabled: !!projectId,
    staleTime: 30000
  })

  useEffect(() => {
    if (tasksData) {
      const mapped: StoryTask[] = (tasksData as any[]).map((t: any) => ({
        id: t._id || t.id || Math.random(),
        description: t.description || t.name || 'Tarea sin descripción',
        done: false
      }))
      setTasks(mapped)
    }
  }, [tasksData])

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const removeTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 pt-10 mb-6">
          <button
            onClick={() => navigate(-1)}
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
              <p className="text-gray-500 text-sm">ID: <span className="text-gray-700 font-medium">#{story.id}</span></p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium">Persona: {story.persona}</span>
                <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium">Objetivo: {story.objetivo}</span>
                <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md font-medium">Beneficio: {story.beneficio}</span>
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
              <p className="text-gray-600 text-sm leading-relaxed">{story.description}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Criterios de Aceptación</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                {story.acceptanceCriteria.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
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
                  <div className="col-span-1 text-center text-gray-400">#{String(task.id).slice(0,6)}</div>
                  <div className={`col-span-8 md:col-span-8 pr-2 ${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.description}</div>
                  <div className="col-span-3 md:col-span-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`cursor-pointer inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors ${task.done ? 'text-emerald-600 hover:bg-emerald-50' : 'text-indigo-600 hover:bg-indigo-50'}`}
                    >
                      <FiCheck className="w-4 h-4" /> 
                    </button>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="cursor-pointer text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors inline-flex items-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" /> Borrar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <AddTaskModal/>
    </div>
  )
}
export default HistoryUserDetail