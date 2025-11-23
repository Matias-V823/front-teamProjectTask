import { useState, useRef } from 'react'
import { useParams } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import GenerateWithAIForm from "@/components/GenerateWithAIForm"
import AIResponseDisplay from "@/components/AIResponseDisplay"

import { createBacklogItem } from '@/api/ProducBacklogApi'
import { createSprint, assignStories, listSprints } from '@/api/SprintBacklogApi'
import { createTask } from '@/api/TaskApi'

interface AgenteData {
  agente: string
  backlog: any[]
}

interface AIResponseData {
  agentes: AgenteData[]
}

const GenerateWithAIView = () => {
  const { projectId } = useParams()
  const queryClient = useQueryClient()

  const [aiResponse, setAiResponse] = useState<AIResponseData | null>(null)
  const [showForm, setShowForm] = useState(true)

  const createdStoriesRef = useRef<any[]>([])
  const sprintMapRef = useRef<Record<string, any>>({})

  const createBacklogMutation = useMutation({
    mutationFn: async () => {
      if (!projectId || !aiResponse) throw new Error('Project ID missing')
      const productBacklog = aiResponse.agentes[0].backlog

      for (const item of productBacklog) {
        const created = await createBacklogItem(projectId, {
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
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-backlog', projectId] })
    }
  })

  const applySprintPlanning = useMutation({
    mutationFn: async () => {
      if (!projectId || !aiResponse) throw new Error('Project ID missing')

      const developerBacklog = aiResponse.agentes[1]?.backlog || []
      const existingSprints = await listSprints(projectId)

      existingSprints.forEach(s => {
        sprintMapRef.current[s.name] = s
      })

      for (const devItem of developerBacklog) {
        const sprintName = `Sprint ${devItem.sprint.index}`

        let sprint = sprintMapRef.current[sprintName]

        if (!sprint) {
          sprint = await createSprint(projectId, {
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

        await assignStories(projectId, sprint._id, [storyMatch._id])

        for (const tarea of devItem.tareas) {
          await createTask({
            projectId,
            sprintId: sprint._id,
            storyId: storyMatch._id,
            formData: {
              name: tarea.descripcion.substring(0, 80),
              description: tarea.descripcion,
              assignedTo: null
            }
          })
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints', projectId] })
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    }
  })

  const handleApply = async () => {
    await createBacklogMutation.mutateAsync()
    await applySprintPlanning.mutateAsync()
  }

  const handleFormSuccess = (data: AIResponseData) => {
    setAiResponse(data)
    setShowForm(false)
  }

  const handleCancel = () => {
    setAiResponse(null)
    setShowForm(true)
  }

  return (
    <>
      {showForm ? (
        <GenerateWithAIForm onSuccess={handleFormSuccess} />
      ) : (
        aiResponse && (
          <AIResponseDisplay
            data={aiResponse}
            onApply={handleApply}
            onCancel={handleCancel}
          />
        )
      )}
    </>
  )
}

export default GenerateWithAIView
