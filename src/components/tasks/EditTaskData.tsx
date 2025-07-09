import { getTaskById } from "@/api/TaskApi"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router"
import EditTaskModal from "./EditTaskModal"

const EditTaskData = () => {
    const location = useLocation()
    const params = useParams()
    const projectId = params.projectId!
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!


    const { data, isError } = useQuery({
        queryKey: ['editTask', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId
    })

    if(isError) return <Navigate to={'/404'}/>


    if (data) return <EditTaskModal  data={data} />
}
export default EditTaskData