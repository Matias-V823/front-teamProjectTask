import { getProjectById } from "@/api/ProjectApi"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useNavigate, useParams } from "react-router"
import { FaCode } from "react-icons/fa";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";


const ProjectDetailsView = () => {
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', { projectId }],
        queryFn: () => getProjectById(projectId),
        retry: 3
    })
    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to='/404' />


    return (
        <>
            <div className="px-10">
                <h1 className="text-gray-100 text-5xl">{data.projectName} <FaCode className="inline-block" /></h1>
                <p className="text-gray-500 mt-2 text-2xl font-light">{data.description}</p>
                <nav className="my-5 flex gap-3">
                    <button
                        type="button"
                        className="buttonActions"
                        onClick={() => navigate('?newTask=true')}
                    >
                        Agregar tareas
                    </button>

                </nav>
            </div>
            <TaskList
                tasks={data.tasks}
            />
            <AddTaskModal />
            <EditTaskData/>
        </>
    )
}
export default ProjectDetailsView