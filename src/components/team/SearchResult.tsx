import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { TeamMember } from "@/types/index"
import { addUserToProject } from "@/api/TeamApi"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router"

type SearchResultProps = {
    user: TeamMember
    reset: () => void
}


const SearchResult = ({ user, reset } : SearchResultProps) => {    const navigate = useNavigate()
    const params = useParams()
    const projectId = params.projectId!
    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: addUserToProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            toast.success(data);
            // Invalidar queries para refrescar la lista de miembros
            queryClient.invalidateQueries({ queryKey: ['teamMembers', projectId] });
            reset() 
            navigate(location.pathname, { replace: true })
        }
    })

    const handleAddUser = () => {
        const data = {projectId, id: user._id}
        mutate(data)
    }


    return (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-lg font-medium text-green-800 mb-2">Usuario encontrado:</h3>
            <div className="space-y-1">
                <p className="text-green-700">Nombre: <span className="font-medium">{user.name}</span></p>
                <p className="text-green-700">Email: <span className="font-medium">{user.email}</span></p>
                <button 
                onClick={handleAddUser}
                className="bg-zinc-800 px-4 py-3 font-bold cursor-pointer text-white rounded-lg text-[10px] mt-2">Agregar al projecto</button>
            </div>
        </div>
    )
}
export default SearchResult