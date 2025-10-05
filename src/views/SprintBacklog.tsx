import HandleSprintMenu from "@/components/projects/sprintBacklog/HandleSprintMenu"
import ModalSelectHistoryUser, { type SprintStory } from "@/components/projects/sprintBacklog/ModalSelectHistoryUser"
import { useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate, useParams } from "react-router"

const SprintBacklog = () => {
  const [sprints, setSprints] = useState<string[]>([])
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isSelecting, setIsSelecting] = useState(false)
  const [storiesBySprint, setStoriesBySprint] = useState<Record<string, SprintStory[]>>({})
  const navigate = useNavigate();
  const { projectId } = useParams();

  const createSprint = () => {
    setSprints(prev => {
      const nextIndex = prev.length + 1
      const newSprint = `Sprint ${nextIndex}`
      const updated = [...prev, newSprint]
      setSelectedSprint(newSprint)
      return updated
    })
  }

  const hasSprints = sprints.length > 0
  const selectedStories = selectedSprint ? (storiesBySprint[selectedSprint] || []) : []

  const handleConfirmStories = (stories: SprintStory[]) => {
    if (!selectedSprint) return
    setStoriesBySprint(prev => ({ ...prev, [selectedSprint]: stories }))
    setIsSelecting(false)
  }

  const removeStory = (storyId: number) => {
    if (!selectedSprint) return
    setStoriesBySprint(prev => ({
      ...prev,
      [selectedSprint]: (prev[selectedSprint] || []).filter(s => s.id !== storyId)
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-10 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver atrás</span>
              </button>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-1">Sprint Backlog</h2>
            <p className="text-lg font-normal text-gray-500">
              Ingresa tareas y planifica tus sprint aquí
            </p>
          </div>
          <div>
            <HandleSprintMenu
              hasSprints={hasSprints}
              sprints={sprints}
              onCreateSprint={createSprint}
              onSelectSprint={setSelectedSprint}
              selectedSprint={selectedSprint}
            />
          </div>
        </div>
        <div>
          {hasSprints ? (
            selectedSprint ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700">{selectedSprint}</h3>
                  <div className="flex flex-col md:flex-row gap-4 md:justify-between">
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="cursor-pointer bg-white border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 text-gray-600 px-4 py-2 rounded-md text-sm transition-colors"
                        placeholder="Fecha de inicio"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="cursor-pointer bg-white border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 text-gray-600 px-4 py-2 rounded-md text-sm transition-colors"
                        placeholder="Fecha de término"
                      />
                    </div>
                    <div>
                      <button
                        className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => setIsSelecting(true)}
                      >
                        Seleccionar historias de usuario
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">Historias seleccionadas
                    {selectedStories.length > 0 && (
                      <span className="text-xs font-normal text-gray-500">({selectedStories.length} historias / {selectedStories.reduce((t,s)=>t+s.estimate,0)} pts)</span>
                    )}
                  </h4>
                  {selectedStories.length === 0 ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500 text-sm">No hay historias seleccionadas para este sprint.</div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-600 uppercase tracking-wide">
                        <div className="col-span-6 md:col-span-7">Título</div>
                        <div className="col-span-2 md:col-span-2 text-center">Puntos</div>
                        <div className="col-span-2 md:col-span-1 text-center">ID</div>
                        <div className="col-span-2 md:col-span-2 text-center">Acciones</div>
                      </div>
                      {selectedStories.map(story => (
                        <div key={story.id} className="grid grid-cols-12 gap-4 p-3 text-sm items-center border-t border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                          <div className="col-span-6 md:col-span-7 text-gray-700 pr-2 truncate" title={story.title}>{story.title}</div>
                          <div className="col-span-2 md:col-span-2 text-center font-medium text-indigo-600">{story.estimate}</div>
                          <div className="col-span-2 md:col-span-1 text-center text-gray-400">#{story.id}</div>
                          <div className="col-span-2 md:col-span-2 flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/projects/${projectId}/view/sprint-backlog/${story.id}`)}
                              className="cursor-pointer text-indigo-600 hover:text-indigo-700 text-xs font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => removeStory(story.id)}
                              className="cursor-pointer text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500 text-sm">
                Selecciona un sprint en el menú para comenzar.
              </div>
            )
          ) : (
            <div>
              <h3 className="text-gray-600">No hay sprints disponibles</h3>
            </div>
          )}
        </div>
      </div>
      {selectedSprint && (
        <ModalSelectHistoryUser
          isOpen={isSelecting}
          onClose={() => setIsSelecting(false)}
          onConfirm={handleConfirmStories}
          selected={selectedStories}
        />
      )}
    </div>
  )
}
export default SprintBacklog