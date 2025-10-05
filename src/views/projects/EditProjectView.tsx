import { Navigate, useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { getProjectById } from "@/api/ProjectApi"
import EditProjectForm from "@/components/projects/EditProjectForm"


const EditProjectView = () => {
    const params = useParams()
    const projectId = params.projectId!
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', {projectId}],
        queryFn: () => getProjectById(projectId),
        retry: 3
    })
    
    if(isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
            </div>
        </div>
    )
    
    if(isError) return <Navigate to='/404'/>

    if(data) return <EditProjectForm data={data} projectId={projectId}/>
}
export default EditProjectView