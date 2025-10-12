interface TeamMember {
    id: string
    name: string
    role: string
    initials: string
    skills: string[]
    yearsExperience?: number
    strengths?: string[]
    technologies?: string[]
}

interface CardMemberTeamProps {
    member: TeamMember
    onRemove?: (userId: string) => void
}

const roleColor: Record<string, string> = {
    'Scrum Master': 'bg-purple-100 text-purple-700',
    'Product Owner': 'bg-amber-100 text-amber-700',
    'Scrum Team': 'bg-indigo-100 text-indigo-700'
}

const CardMemberTeam = ({ member, onRemove }: CardMemberTeamProps) => {
    const roleClass = roleColor[member.role] || 'bg-gray-100 text-gray-600'
    const isDev = member.role === 'Scrum Team'

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-indigo-100 border-4 border-indigo-200 flex items-center justify-center">
                            <span className="text-base font-bold text-indigo-600">{member.initials}</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleClass}`}>{member.role}</span>
                        </div>
                    </div>
                    {onRemove && (
                        <button
                            onClick={() => onRemove(member.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        >
                            Remover
                        </button>
                    )}
                </div>

                {isDev && (
                    <div className="space-y-3">
                        {typeof member.yearsExperience === 'number' && (
                            <div className="text-sm text-gray-600">
                                <span className="font-medium text-gray-700">Experiencia: </span>
                                {member.yearsExperience} {member.yearsExperience === 1 ? 'año' : 'años'}
                            </div>
                        )}

                        {Array.isArray(member.strengths) && member.strengths.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {member.strengths.map((s, idx) => (
                                    <span key={idx} className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full text-xs font-medium">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        )}

                        {Array.isArray(member.technologies) && member.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {member.technologies.slice(0, 6).map((t, idx) => (
                                    <span key={idx} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                                        {t}
                                    </span>
                                ))}
                                {member.technologies.length > 6 && (
                                    <span className="text-xs text-gray-400">+{member.technologies.length - 6} más</span>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CardMemberTeam