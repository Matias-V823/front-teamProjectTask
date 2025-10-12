import api from '@/lib/axios'

export type ThroughputPoint = { date: string; completed: number }
export type BurnDownPoint = { date: string; idealRemaining: number; actualRemaining: number }
export type BurnUpPoint = { date: string; idealCompleted: number; actualCompleted: number }
export type MemberReport = {
  id: string
  name: string
  role: string
  completionRate: number
  totals: { total: number; pending: number; onHold: number; inProgress: number; underReview: number; completed: number }
}
export type ReportMetrics = {
  projectId: string
  projectName: string
  teamSize: number
  backlogStatus: Record<string, number> & { total: number }
  sprint: { hasActive: boolean; name?: string; startDate?: string; endDate?: string; totalTasks?: number; completed?: number; progress?: number; daysTotal?: number; daysRemaining?: number; burnDown?: BurnDownPoint[]; burnUp?: BurnUpPoint[] }
  throughput7d: ThroughputPoint[]
  members: MemberReport[]
  unassignedTasks: number
  lastCompletedSprint: { name: string; endDate: string; unfinishedTasks: number } | null
}

export async function getReportMetrics(projectId: string) {
  const { data } = await api.get<ReportMetrics>(`/projects/${projectId}/report-metrics`)
  return data
}
