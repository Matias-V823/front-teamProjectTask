import api from '@/lib/axios'

export type ProjectMetrics = {
  projectId: string
  projectName: string
  teamSize: number
  sprints: { total: number; active: number; completed: number; planned: number }
  tasks: {
    total: number
    pending?: number
    onHold?: number
    inProgress?: number
    underReview?: number
    completed?: number
    overdueInSprint: number
    progress: number
  }
}

export async function getAllMetrics() {
  const { data } = await api.get<{ projects: ProjectMetrics[] }>('/projects/metrics')
  return data
}

export async function getProjectMetrics(projectId: string) {
  const { data } = await api.get<ProjectMetrics>(`/projects/${projectId}/metrics`)
  return data
}
