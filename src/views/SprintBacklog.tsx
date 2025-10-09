import HandleSprintMenu from "@/components/projects/sprintBacklog/HandleSprintMenu"
import ModalSelectHistoryUser, { type SprintStory } from "@/components/projects/sprintBacklog/ModalSelectHistoryUser"
import { useEffect, useMemo, useState } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { useNavigate, useParams } from "react-router"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignStories, createSprint, listSprints, getSprintStories } from '@/api/SprintBacklogApi'
import { toast } from 'react-toastify'

const SprintBacklog = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const queryClient = useQueryClient()

  const { data: sprints = [], isLoading: loadingSprints } = useQuery({
    queryKey: ['sprints', { projectId }],
    queryFn: () => listSprints(projectId!),
    enabled: !!projectId
  })

  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  useEffect(() => {
    if (sprints.length > 0 && !selectedSprintId) {
      setSelectedSprintId(sprints[0]._id)
    }
  }, [sprints, selectedSprintId])
  const selectedSprint = useMemo(() => sprints.find(s => s._id === selectedSprintId) || null, [sprints, selectedSprintId])
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [isSelecting, setIsSelecting] = useState(false)

  const { data: sprintStories = [], refetch: refetchSprintStories, isFetching: fetchingStories } = useQuery({
    queryKey: ['sprintStories', { projectId, sprintId: selectedSprintId }],
    queryFn: () => getSprintStories(projectId!, selectedSprintId!),
    enabled: !!projectId && !!selectedSprintId
  })

  useEffect(() => {
    if (selectedSprint) {
      setStartDate(selectedSprint.startDate.substring(0,10))
      setEndDate(selectedSprint.endDate.substring(0,10))
    }
  }, [selectedSprint])

  const createSprintMutation = useMutation({
    mutationFn: (payload: { name: string; startDate: string; endDate: string }) => createSprint(projectId!, payload),
    onSuccess: (sp: any) => {
      toast.success('Sprint creado')
      queryClient.invalidateQueries({ queryKey: ['sprints', { projectId }] })
      setSelectedSprintId(sp._id)
    },
    onError: (e: any) => toast.error(e.message)
  })

  const assignStoriesMutation = useMutation({
    mutationFn: (stories: string[]) => assignStories(projectId!, selectedSprintId!, stories),
    onSuccess: () => {
      toast.success('Historias asignadas')
      queryClient.invalidateQueries({ queryKey: ['sprints', { projectId }] })
      refetchSprintStories()
    },
    onError: (e: any) => toast.error(e.message)
  })

  const hasSprints = sprints.length > 0
  const selectedStories: SprintStory[] = sprintStories.map((s: any) => ({ id: s._id, title: s.title, estimate: s.estimate }))

  const handleConfirmStories = (stories: SprintStory[]) => {
    if (!selectedSprintId) return
    assignStoriesMutation.mutate(stories.map(s => s.id))
    setIsSelecting(false)
  }

  const removeStory = (storyId: string) => {
    if (!selectedSprintId) return
    const remaining = selectedStories.filter(s => s.id !== storyId)
    assignStoriesMutation.mutate(remaining.map(s => s.id))
  }

  const handleCreateSprint = () => {
    const index = sprints.length + 1
    const today = new Date().toISOString().substring(0,10)
    const tenDays = new Date(Date.now() + 9*24*60*60*1000).toISOString().substring(0,10)
    createSprintMutation.mutate({ name: `Sprint ${index}`, startDate: today, endDate: tenDays })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-10 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button type="button" onClick={() => navigate(`/projects/${projectId}/view`)} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer">
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver atrás</span>
              </button>
            </div>
            <h2 className="text-4xl font-extrabold text-gray-800 mb-1">Sprint Backlog</h2>
            <p className="text-lg font-normal text-gray-500">Planifica tus sprints y selecciona las historias</p>
          </div>
          <div>
            <HandleSprintMenu
              hasSprints={hasSprints}
              sprints={sprints.map(s => ({ _id: s._id, name: s.name }))}
              onCreateSprint={handleCreateSprint}
              onSelectSprint={setSelectedSprintId}
              selectedSprint={selectedSprintId}
            />
          </div>
        </div>
        <div>
          {loadingSprints ? (
            <div className="p-6 text-gray-500">Cargando sprints...</div>
          ) : hasSprints ? (
            selectedSprint ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-700">{selectedSprint.name}</h3>
                  <div className="flex flex-col md:flex-row gap-4 md:justify-between">
                    <div className="flex gap-3">
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="cursor-pointer bg-white border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 text-gray-600 px-4 py-2 rounded-md text-sm transition-colors" />
                      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="cursor-pointer bg-white border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 text-gray-600 px-4 py-2 rounded-md text-sm transition-colors" />
                    </div>
                    <div>
                      <button className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors" onClick={() => setIsSelecting(true)}>Seleccionar historias de usuario</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">Historias seleccionadas
                    {selectedStories.length > 0 && (
                      <span className="text-xs font-normal text-gray-500">({selectedStories.length} historias / {selectedStories.reduce((t,s)=>t+s.estimate,0)} pts)</span>
                    )}
                  </h4>
                  {fetchingStories ? (
                    <div className="p-4 text-sm text-gray-500">Cargando historias...</div>
                  ) : selectedStories.length === 0 ? (
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
                          <div className="col-span-2 md:col-span-1 text-center text-gray-400">#{story.id.slice(-4)}</div>
                          <div className="col-span-2 md:col-span-2 flex items-center justify-center gap-2">
                            <button onClick={() => navigate(`/projects/${projectId}/view/sprint-backlog/${story.id}`)} className="cursor-pointer text-indigo-600 hover:text-indigo-700 text-xs font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors">Ver</button>
                            <button onClick={() => removeStory(story.id)} className="cursor-pointer text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">Eliminar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-gray-500 text-sm">Cargando sprint...</div>
            )
          ) : (
            <div>
              <h3 className="text-gray-600">No hay sprints disponibles</h3>
              <button onClick={handleCreateSprint} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer">Crear primer Sprint</button>
            </div>
          )}
        </div>
      </div>
      {selectedSprintId && (
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