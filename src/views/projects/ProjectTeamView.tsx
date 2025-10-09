import { Navigate, useNavigate, useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddMemberModal from "@/components/team/AddMemberModal"
import CardMemberTeam from "@/components/team/CardMemberTeam"
import { FiArrowLeft } from "react-icons/fi"
import { RiTeamFill } from "react-icons/ri";
import { getProjectTeam, removeUserFromProject } from "@/api/TeamApi";
import { toast } from "react-toastify";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";

const ProjectTeamView = () => {
    const { data: user } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()
  
    
    const { data, isLoading, isError } = useQuery({
        queryKey: ['teamMembers', projectId],
        queryFn: () => getProjectTeam(projectId),
        retry: false
    })
    
    const { mutate } = useMutation({
        mutationFn: removeUserFromProject,
        onError: (error: any) => {
            toast.error(error.message || 'Error al eliminar miembro');
        },
        onSuccess: () => {
            toast.success("Miembro eliminado del proyecto");
            queryClient.invalidateQueries({ queryKey: ['teamMembers', projectId] });
        }
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



    const handleRemoveMember = (userId: string) => {
        mutate({ projectId, userId: userId });
    }

    if(data) return (
        <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-10 pb-6 border-b border-gray-200">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => navigate(`/projects/${projectId}/view`)}
                                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                            >
                                <FiArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Volver atrás</span>
                            </button>
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-1">Scrum Team</h2>
                        <p className="text-lg font-normal text-gray-500">
                            Gestiona los desarrolladores de tu proyecto
                        </p>
                    </div>
                        { data && isManager(user?._id!, data.managerId) && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                                    onClick={() => navigate('?addTeamMember=true')}
                                >
                                    Invitar desarrollador
                                </button>
                            </div>
                        )}

                </div>
                  {data && data.team.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.team.map(member => (
                            <CardMemberTeam 
                                key={member._id}
                                member={{
                                    id: member._id,
                                    name: member.name,
                                    role: 'Desarrollador', 
                                    initials: member.name.split(' ').map(n => n[0]).join('').toUpperCase(),
                                    skills: [] 
                                }}
                                onRemove={handleRemoveMember}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
                        <RiTeamFill className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>No hay miembros en el equipo.</p>
                    </div>
                )}
            </div>

            <AddMemberModal />
        </div>
    )
}
export default ProjectTeamView