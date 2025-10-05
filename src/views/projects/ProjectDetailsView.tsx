import { getProjectById } from "@/api/ProjectApi"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { FaCode } from "react-icons/fa";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import ViewTaskModal from "@/components/tasks/ViewTaskModal";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";


const ProjectDetailsView = () => {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['project', { projectId }],
        queryFn: () => getProjectById(projectId),
        retry: 3
    })
    
    if (isLoading) return 'Cargando...'
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
                        onClick={() => navigate('/')}
                    >
                        <FiPlusCircle className="w-3 h-3" />
                        Generar con ia
                    </button>
                </nav>
            </div>
            <h4 className="text-gray-700 text-xl p-10 font-bold">Sprint 1</h4>
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