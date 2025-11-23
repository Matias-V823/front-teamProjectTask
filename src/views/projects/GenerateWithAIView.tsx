import { useState } from 'react'
import GenerateWithAIForm from "@/components/GenerateWithAIForm"
import AIResponseDisplay from "@/components/AIResponseDisplay"

interface BacklogItem {
  id: number
  historia: string
  criterios_aceptacion: string[]
  prioridad: string
  esfuerzo_estimado: string
}

interface AgenteData {
  agente: string
  backlog: BacklogItem[]
}

interface AIResponseData {
  agentes: AgenteData[]
}

const GenerateWithAIView = () => {
  const [aiResponse, setAiResponse] = useState<AIResponseData | null>(null)
  const [showForm, setShowForm] = useState(true)

  const handleFormSuccess = (data: AIResponseData) => {
    setAiResponse(data)
    setShowForm(false)
  }

  const handleApply = () => {
    console.log('Aplicar planificación:', aiResponse)
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

