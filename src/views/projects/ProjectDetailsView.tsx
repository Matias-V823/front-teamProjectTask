import { getProjectById } from "@/api/ProjectApi"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { FaCode } from "react-icons/fa";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import ViewTaskModal from "@/components/tasks/ViewTaskModal";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";
import { listSprints } from '@/api/SprintBacklogApi'
import type { Sprint }  from '@/types'


const ProjectDetailsView = () => {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', { projectId }],
        queryFn: () => getProjectById(projectId),
        retry: 3
    })
    
    const { data: sprints = [] } = useQuery({
        queryKey: ['sprints', { projectId }],
        queryFn: () => listSprints(projectId),
        enabled: !!projectId
    })

    const today = new Date()
    const activeSprint: Sprint | null = sprints.length > 0 ? (sprints
        .filter((sp: any) => {
            const start = new Date(sp.startDate)
            const end = new Date(sp.endDate)
            return today >= start && today <= end
        })
        .sort((a: any, b: any) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())[0] || null) : null

    const daysRemaining = activeSprint ? Math.max(0, Math.ceil((new Date(activeSprint.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))) : null

    function formatDate(dateStr: string) {
        const d = new Date(dateStr)
        return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
            </div>
        </div>
    )
    
    if (isError) return <Navigate to='/404' />


    return (
        <>
            <div className="px-10 flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            to="/projects"
                            className="flex items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Volver a proyectos</span>
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-gray-800 text-5xl font-extrabold">{data.projectName} <FaCode className="inline-block" /></h1>
                        <p className="text-gray-500 mt-2 text-2xl font-light">{data.description}</p>
                    </div>
                </div>
                <nav className="my-2 flex gap-2 p-1 h-14">
                    <button
                        type="button"
                        className="buttonActions"
                        onClick={() => navigate('backlog')}
                    >
                        <FiPlusCircle className="w-3 h-3" />
                        Product Backlog
                    </button>
                    <button
                        type="button"
                        className="buttonActions"
                        onClick={() => navigate('sprint-backlog')}
                    >
                        <FiPlusCircle className="w-3 h-3" />
                        Sprint Backlog
                    </button>
                    <button
                        type="button"
                        className="buttonActions"
                        onClick={() => navigate('team')}
                    >
                        <FiPlusCircle className="w-3 h-3" />
                        Scrum Team
                    </button>
                    <button
                        type="button"
                        className="buttonActions"
                        onClick={() => navigate('generate-ai')}
                    >
                        <FiPlusCircle className="w-3 h-3" />
                        Generar con ia
                    </button>
                </nav>
            </div>
            <div className="px-10 pt-4">
              {activeSprint ? (
                <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h4 className="text-gray-800 text-xl font-bold mb-1">{activeSprint.name}</h4>
                    <p className="text-sm text-gray-500">Inicio: <span className="font-medium text-gray-700">{formatDate(activeSprint.startDate)}</span> · Fin: <span className="font-medium text-gray-700">{formatDate(activeSprint.endDate)}</span></p>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Hoy</p>
                      <p className="text-lg font-semibold text-indigo-600">{formatDate(today.toISOString())}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Días restantes</p>
                      <p className="text-lg font-semibold text-emerald-600">{daysRemaining}</p>
                    </div>
                  </div>
                </div>
              ) : sprints.length > 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-sm text-gray-600">
                  No hay un sprint activo hoy ({formatDate(today.toISOString())}).
                </div>
              ) : (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-6 text-sm text-gray-600">
                  Aún no se han creado sprints para este proyecto.
                </div>
              )}
            </div>
            <TaskList
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData />
            <ViewTaskModal />
        </>
    )
}
export default ProjectDetailsView