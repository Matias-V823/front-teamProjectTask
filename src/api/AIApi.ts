import api from '@/lib/axios'
import type { AIProjectData } from '@/types/ai-agent'

export const generateProjectPlanWithAI = async (aiProjectData: AIProjectData) => {
  const { data } = await api.post('/ai/generate-project-plan', aiProjectData)
  return data
}
