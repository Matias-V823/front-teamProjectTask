import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getProjectById } from '@/api/ProjectApi'
import { getProjectTeam } from '@/api/TeamApi'
import ErrorMessage from './ErrorMessage'
import type { AIProjectData } from '../types/ai-agent'
import { PLATFORMS, TECHNOLOGY_CATEGORIES, getTechnologiesByCategory } from '../utils/project-options'
import { sendToN8nWebhook } from '@/config/n8n'


interface FormData {
  scope: string
  startDate: string
  endDate: string
  complexity: 'low' | 'medium' | 'high'
  budget: string
  sprintDuration: number
}

const GenerateWithAIForm = () => {
  const params = useParams()
  const navigate = useNavigate()
  const projectId = params.projectId!
  const [isLoading, setIsLoading] = useState(false)
  const [requirements, setRequirements] = useState<string[]>([])
  const [currentRequirement, setCurrentRequirement] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [tempSelectedTechnologies, setTempSelectedTechnologies] = useState<string[]>([])
  const [savedTechnologies, setSavedTechnologies] = useState<string[]>([])

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>()

  const { data: projectData } = useQuery({
    queryKey: ['project', { projectId }],
    queryFn: () => getProjectById(projectId),
    retry: 3
  })

  // Obtener equipo del proyecto
  const { data: teamData } = useQuery({
    queryKey: ['teamMembers', projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false
  })

  useEffect(() => {
    if (projectData) {
      setValue('scope', projectData.description || '')
    }
  }, [projectData, setValue])

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setRequirements([...requirements, currentRequirement.trim()])
      setCurrentRequirement('')
    }
  }

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addRequirement()
    }
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]

      if (!newCategories.includes(categoryId)) {
        const categoryTechs = getTechnologiesByCategory(categoryId).map(tech => tech.id)
        setTempSelectedTechnologies(prev => prev.filter(techId => !categoryTechs.includes(techId as any)))
      }

      return newCategories
    })
  }

  const toggleTempTechnology = (techId: string) => {
    setTempSelectedTechnologies(prev =>
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    )
  }

  const addSelectedTechnologies = () => {
    if (tempSelectedTechnologies.length > 0) {
      setSavedTechnologies(prev => {
        const newTechs = tempSelectedTechnologies.filter(tech => !prev.includes(tech))
        return [...prev, ...newTechs]
      })
      setTempSelectedTechnologies([])
      setSelectedCategories([])
    }
  }

  const removeSavedTechnology = (techId: string) => {
    setSavedTechnologies(prev => prev.filter(id => id !== techId))
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      const durationInWeeks = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

      const aiProjectData: AIProjectData = {
        projectInfo: {
          name: projectData?.projectName || '',
          description: projectData?.description || '',
          clientName: projectData?.clientName || '',
          scope: data.scope,
          timeline: {
            startDate: data.startDate,
            endDate: data.endDate,
            duration: durationInWeeks
          },
          complexity: data.complexity,
          budget: data.budget ? parseFloat(data.budget) : undefined
        },
        teamMembers: {
          manager: projectData?.manager || '',
          members: teamData?.team?.map(member => ({
            name: member.name,
            email: member.email,
            role: member.role as 'Scrum Team' | 'Scrum Master' | 'Product Owner',
            profile: {
              yearsExperience: member.developerProfile?.yearsExperience || 0,
              technologies: member.developerProfile?.technologies || [],
              strengths: member.developerProfile?.strengths || []
            }
          })) || []
        },
        projectRequirements: {
          functionalRequirements: requirements,
          nonFunctionalRequirements: [],
          technologies: savedTechnologies,
          platforms: selectedPlatforms
        },
        sprintConfiguration: {
          sprintDuration: data.sprintDuration,
          numberOfSprints: Math.ceil(durationInWeeks / data.sprintDuration)
        }
      }

      console.log('Datos para n8n:', aiProjectData)
      const result = await sendToN8nWebhook(aiProjectData)
      
      
    } catch (error) {
      console.log('Error al preparar los datos para n8n:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          Generar Planificación con IA
        </h2>
        <div className="h-px bg-gray-200 mb-6"></div>

        {projectData && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Proyecto</div>
                <div className="text-gray-900 font-medium">{projectData.projectName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Cliente</div>
                <div className="text-gray-900">{projectData.clientName}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Descripción</div>
                <div className="text-gray-900">{projectData.description}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Alcance y Temporalidad */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gray-900 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900">Alcance y Temporalidad</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Alcance del Proyecto
            </label>
            <textarea
              rows={4}
              placeholder="Describe el alcance de el proyecto..."
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder-gray-400 resize-none transition-colors"
            />
            {errors.scope && <ErrorMessage>{errors.scope.message}</ErrorMessage>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                {...register('startDate', { required: 'La fecha de inicio es obligatoria' })}
              />
              {errors.startDate && <ErrorMessage>{errors.startDate.message}</ErrorMessage>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                {...register('endDate', { required: 'La fecha de fin es obligatoria' })}
              />
              {errors.endDate && <ErrorMessage>{errors.endDate.message}</ErrorMessage>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Complejidad
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors bg-white"
                {...register('complexity', { required: 'La complejidad es obligatoria' })}
              >
                <option value="">Seleccionar...</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
              {errors.complexity && <ErrorMessage>{errors.complexity.message}</ErrorMessage>}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duración de los sprints (semanas)
              </label>
              <input
                type="number"
                min="1"
                max="4"
                defaultValue="2"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                {...register('sprintDuration', {
                  required: 'La duración del sprint es obligatoria',
                  min: { value: 1, message: 'Mínimo 1 semana' },
                  max: { value: 4, message: 'Máximo 4 semanas' }
                })}
              />
              {errors.sprintDuration && <ErrorMessage>{errors.sprintDuration.message}</ErrorMessage>}
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200"></div>

        {/* Requerimientos */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gray-900 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900">Requerimientos</h3>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Requerimientos Funcionales
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Agregar un requerimiento..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors placeholder-gray-400"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-6 py-3 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              >
                Agregar
              </button>
            </div>

            {requirements.length > 0 && (
              <div className="border border-gray-200 rounded-2xl p-4">
                <div className="text-sm font-medium text-gray-700 mb-3">Requerimientos agregados</div>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
                      <span className="text-gray-700">• {req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length === 0 && (
              <p className="text-red-500 text-sm">Agrega al menos un requerimiento</p>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-200"></div>

        {/* Tecnologías */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gray-900 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900">Tecnologías</h3>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Categorías</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {TECHNOLOGY_CATEGORIES.map(category => (
                  <button
                    type="button"
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedCategories.includes(category.id)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {selectedCategories.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Tecnologías específicas</h4>
                {selectedCategories.map(categoryId => {
                  const category = TECHNOLOGY_CATEGORIES.find(cat => cat.id === categoryId)
                  const categoryTechs = getTechnologiesByCategory(categoryId)
                  
                  return (
                    <div key={categoryId} className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-600">{category?.name}</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {categoryTechs.map(tech => (
                          <button
                            type="button"
                            key={tech.id}
                            onClick={() => toggleTempTechnology(tech.id)}
                            className={`p-2 rounded-lg border transition-all text-sm ${
                              tempSelectedTechnologies.includes(tech.id)
                                ? 'bg-gray-100 border-gray-400 text-gray-900'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {tech.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {tempSelectedTechnologies.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={addSelectedTechnologies}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Confirmar {tempSelectedTechnologies.length} tecnologías
              </button>
              <span className="text-sm text-gray-500">
                {tempSelectedTechnologies.length} seleccionadas
              </span>
            </div>
          )}

          {savedTechnologies.length > 0 && (
            <div className="border border-gray-200 rounded-2xl p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Tecnologías confirmadas</h4>
              <div className="flex flex-wrap gap-2">
                {savedTechnologies.map(techId => {
                  const tech = TECHNOLOGY_CATEGORIES
                    .flatMap(cat => getTechnologiesByCategory(cat.id))
                    .find(t => t.id === techId)
                  return tech ? (
                    <span key={techId} className="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                      {tech.name}
                      <button
                        type="button"
                        onClick={() => removeSavedTechnology(techId)}
                        className="text-gray-400 hover:text-gray-600 transition-colors ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            </div>
          )}
          
          {savedTechnologies.length === 0 && (
            <p className="text-red-500 text-sm">Selecciona al menos una tecnología</p>
          )}
        </div>

        <div className="h-px bg-gray-200"></div>

        {/* Plataformas */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gray-900 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900">Plataformas</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PLATFORMS.map(platform => (
              <button
                type="button"
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`p-4 rounded-xl border transition-all text-left ${
                  selectedPlatforms.includes(platform.id)
                    ? 'bg-gray-50 border-gray-400'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{platform.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200"></div>

        {/* Equipo */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-6 bg-gray-900 rounded-full"></div>
            <h3 className="text-xl font-semibold text-gray-900">Equipo</h3>
          </div>

          {teamData && teamData.team && teamData.team.length > 0 ? (
            <div className="border border-gray-200 rounded-2xl p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">
                Miembros del equipo ({teamData.team.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamData.team.map(member => (
                  <div key={member._id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-2xl p-6 text-center">
              <div className="text-gray-400 mb-3">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-900 mb-2">
                No hay miembros en el equipo
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Agrega miembros al equipo para generar una planificación más precisa
              </div>
              <button
                type="button"
                onClick={() => navigate(`/projects/${projectId}/team`)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Gestionar Equipo
              </button>
            </div>
          )}
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isLoading || requirements.length === 0 || savedTechnologies.length === 0 || !teamData?.team || teamData.team.length === 0}
            className="px-8 py-4 bg-gray-900 text-white font-medium rounded-2xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Generando...' : 'Generar Planificación con IA'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default GenerateWithAIForm