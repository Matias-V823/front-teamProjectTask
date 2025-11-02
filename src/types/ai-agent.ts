
export interface AIProjectData {
  projectInfo: {
    name: string
    description: string
    clientName: string
    scope: string
    timeline: {
      startDate: string
      endDate: string
      duration: number 
    }
    complexity: 'low' | 'medium' | 'high'
    budget?: number
  }
  teamMembers: {
    manager: string
    members: Array<{
      name: string
      email: string
      role: 'Scrum Master' | 'Product Owner' | 'Scrum Team'
      profile?: {
        yearsExperience: number
        technologies: string[]
        strengths: ('frontend' | 'backend' | 'database' | 'testing')[]
      }
    }>
  }
  projectRequirements: {
    functionalRequirements: string[]
    nonFunctionalRequirements: string[]
    technologies: string[]
    platforms: string[]
  }
  sprintConfiguration: {
    sprintDuration: number 
    numberOfSprints: number
  }
}

export interface AIAgentResponse {
  productBacklog: {
    items: Array<{
      id: string
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      storyPoints: number
      acceptanceCriteria: string[]
      dependencies?: string[]
      epic?: string
      tags: string[]
    }>
  }
  sprintPlanning: {
    sprints: Array<{
      sprintNumber: number
      goal: string
      duration: number 
      capacity: number 
      backlogItems: string[] 
      startDate: string
      endDate: string
    }>
  }
  taskAssignments: {
    assignments: Array<{
      taskId: string
      assignedTo: string 
      estimatedHours: number
      priority: 'high' | 'medium' | 'low'
      skills_required: string[]
      reasoning: string 
    }>
  }
  recommendations: {
    risks: string[]
    suggestions: string[]
    optimizations: string[]
  }
}

export interface WebhookConfig {
  url: string
  headers?: Record<string, string>
  timeout?: number
}
