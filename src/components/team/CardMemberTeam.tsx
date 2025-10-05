interface TeamMember {
    id: string
    name: string
    role: string
    initials: string
    skills: string[]
}

interface CardMemberTeamProps {
    member: TeamMember
    onRemove?: (userId: string) => void
}

const CardMemberTeam = ({ member, onRemove }: CardMemberTeamProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 border-4 border-indigo-200 flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">{member.initials}</span>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.role}</p>
                </div>

                <div className="flex flex-wrap gap-1 justify-center">
                    {member.skills.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium"
                        >
                            {skill}
                        </span>
                    ))}
                </div>

                {onRemove && (
                    <button
                        onClick={() => onRemove(member.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors w-full cursor-pointer text-center"
                    >
                        Remover
                    </button>
                )}
            </div>
        </div>
    )
}

export default CardMemberTeam