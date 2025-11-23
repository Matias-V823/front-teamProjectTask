import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FaRobot } from "react-icons/fa"

import GenerateWithAIForm from "@/components/GenerateWithAIForm"
import AIResponseDisplay from "@/components/AIResponseDisplay"

import { createBacklogItem } from '@/api/ProducBacklogApi'
import { createSprint, assignStories, listSprints } from '@/api/SprintBacklogApi'
import { createTask } from '@/api/TaskApi'
import { getProjectTeam } from '@/api/TeamApi'

interface AgenteData {
  agente: string
  backlog: any[]
}

interface AIResponseData {
  agentes: AgenteData[]
}

const GenerateWithAIView = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [aiResponse, setAiResponse] = useState<AIResponseData | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const createdStoriesRef = useRef<any[]>([])
  const sprintMapRef = useRef<Record<string, any>>({})

  const { data: teamData } = useQuery({
    queryKey: ['teamMembers', projectId],
    queryFn: () => getProjectTeam(projectId!),
    enabled: !!projectId
  })

  const createBacklogMutation = useMutation({
    mutationFn: async () => {
      const productBacklog = aiResponse!.agentes[0].backlog
      const step = 40 / productBacklog.length

      for (const item of productBacklog) {
        const created = await createBacklogItem(projectId!, {
          persona: item.persona,
          objetivo: item.objetivo,
          beneficio: item.beneficio,
          estimate: item.estimate,
          acceptanceCriteria: Array.isArray(item.acceptanceCriteria)
            ? item.acceptanceCriteria.join("\n")
            : item.acceptanceCriteria
        })

        createdStoriesRef.current.push({
          title: item.title.trim().toLowerCase(),
          _id: created._id
        })

        setProgress(prev => prev + step)
      }
    }
  })

  const applySprintPlanning = useMutation({
    mutationFn: async () => {
      const developerBacklog = aiResponse!.agentes[1].backlog
      const existingSprints = await listSprints(projectId!)
      const step = 60 / developerBacklog.length

      existingSprints.forEach(s => {
        sprintMapRef.current[s.name] = s
      })

      for (const devItem of developerBacklog) {
        const sprintName = `Sprint ${devItem.sprint.index}`

        let sprint = sprintMapRef.current[sprintName]

        if (!sprint) {
          sprint = await createSprint(projectId!, {
            name: sprintName,
            startDate: devItem.sprint.startDate,
            endDate: devItem.sprint.endDate
          })

          sprintMapRef.current[sprintName] = sprint
        }

        const storyMatch = createdStoriesRef.current.find(
          s => s.title === devItem.title.trim().toLowerCase()
        )

        if (!storyMatch) continue

        await assignStories(projectId!, sprint._id, [storyMatch._id])

        for (const tarea of devItem.tareas) {
          const assigned =
            teamData?.team.find(
              m => m.name.trim().toLowerCase() === tarea.responsable.trim().toLowerCase()
            )?._id || null

          await createTask({
            projectId: projectId!,
            sprintId: sprint._id,
            storyId: storyMatch._id,
            formData: {
              name: tarea.descripcion.substring(0, 80),
              description: tarea.descripcion,
              assignedTo: assigned
            }
          })
        }

        setProgress(prev => prev + step)
      }
    },
    onSuccess: () => {
      navigate(`/projects/${projectId}/view`)
    }
  })

  const handleApply = async () => {
    setIsProcessing(true)
    setProgress(5)

    await createBacklogMutation.mutateAsync()
    await applySprintPlanning.mutateAsync()

    setProgress(100)
  }

  const handleFormSuccess = (data: AIResponseData) => {
    setAiResponse(data)
    setShowForm(false)
  }

  return (
    <>
      {isProcessing ? (
        <div className='flex flex-col items-center justify-center h-96 space-y-4'>
          <FaRobot size={80} color="#4F46E5" style={{ animation: 'pulse 1s infinite' }} />
          <h2 className='font-bold'>Generando planificación...</h2>
          <p>{Math.round(progress)}%</p>
        </div>
      ) : showForm ? (
        <GenerateWithAIForm onSuccess={handleFormSuccess} />
      ) : (
        aiResponse && (
          <AIResponseDisplay
            data={aiResponse}
            onApply={handleApply}
            onCancel={() => setShowForm(true)}
          />
        )
      )}
    </>
  )
}

export default GenerateWithAIView
