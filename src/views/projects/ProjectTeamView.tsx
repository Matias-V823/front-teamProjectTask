import AddMemberModal from "@/components/team/AddMemberModal"
import { FiArrowLeft } from "react-icons/fi"
import { Link, useNavigate, useParams } from "react-router"

const ProjectTeamView = () => {
    const params = useParams()
    const projectId = params.projectId!
    const navigate = useNavigate()

    return (
        <div className="px-10">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    to={`/projects/${projectId}/view`}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Volver atras</span>
                </Link>
            </div>
            <h1 className="text-gray-800 text-5xl  font-extrabold">Scrum Team</h1>
            <p className="text-gray-500 mt-2 text-2xl font-light">Gestiona los desarrolladores de tu proyecto</p>
            <nav className="my-5 flex gap-3">
                <button
                    type="button"
                    className="buttonActions"
                    onClick={() => navigate('?addTeamMember=true')}
                >
                    Invitar desarrollador
                </button>
            </nav>

            <AddMemberModal/>
        </div>
    )
}
export default ProjectTeamView