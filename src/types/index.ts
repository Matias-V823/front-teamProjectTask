import { z } from 'zod'

/* AUTH & USERS */
export const userRoleSchema = z.enum(['Scrum Master','Product Owner','Scrum Team'])
export type UserRole = z.infer<typeof userRoleSchema>

export const developerStrengthSchema = z.enum(['frontend','backend','database','testing'])
export type DeveloperStrength = z.infer<typeof developerStrengthSchema>

export const developerProfileSchema = z.object({
    yearsExperience: z.number().int().min(0).default(0),
    technologies: z.array(z.string()).default([]),
    strengths: z.array(developerStrengthSchema).default([])
})

const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
}).extend({
    role: userRoleSchema.optional(),
    developerProfile: developerProfileSchema.optional()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, "email" | "password">
export type UserRegistrationForm = Pick<Auth, "name" |"email" | "password" | "password_confirmation"> & {
    role?: UserRole
    developerProfile?: z.infer<typeof developerProfileSchema>
}
export type UserConfirmationForm = Pick<Auth, "token" >
export type RequestConfirmationCodeForm = Pick<Auth, "email">
export type ForgotPasswordForm = Pick<Auth, "email">
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">
export type validateTokenPassword = Pick<Auth, "token" >


/**  Users  **/


export const userSchema = z.object({
    _id: z.string(),
    name: z.string(),
    email: z.string().email()
}).extend({
    role: userRoleSchema.optional(),
    developerProfile: developerProfileSchema.optional()
})

export type User = z.infer<typeof userSchema>



/* Tasks */

export type TaskStatus = "pending" | "onHold" | "inProgress" | "underReview" | "completed"
export type PriorityKey = 'high' | 'medium' | 'low'

export const taskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])

export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: taskStatusSchema,
    assignedTo: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description' | 'assignedTo'>

/* Projects */
export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    manager: z.string()
})

export const dashboardProjectSchema = z.array(
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)
export type Project = z.infer<typeof projectSchema>
export type ProjectFormData = Pick<Project, 'clientName' | 'projectName' | 'description'>




/* Teams */
const teamMemberSchema = userSchema.pick({
    _id: true,
    name: true,
    email: true
})

export const teamMemberExtendedSchema = z.array(teamMemberSchema)
export type TeamMember = z.infer<typeof teamMemberSchema>
export type TeamMemberForm = Pick<TeamMember, 'email'>

export const projectTeamSchema = z.object({
    managerId: z.string(),
    team: teamMemberExtendedSchema
})
export type ProjectTeamResponse = z.infer<typeof projectTeamSchema>

/* Product Backlog */
export const productBacklogItemSchema = z.object({
    _id: z.string(),
    project: z.string(),
    persona: z.string(),
    objetivo: z.string(),
    beneficio: z.string(),
    title: z.string(),
    estimate: z.number(),
    acceptanceCriteria: z.string(),
    order: z.number(),
    createdAt: z.string(),
    updatedAt: z.string()
})
export const productBacklogListSchema = z.array(productBacklogItemSchema)

export type ProductBacklogItem = z.infer<typeof productBacklogItemSchema>
export type NewBacklogItemForm = Pick<ProductBacklogItem,
    'persona' | 'objetivo' | 'beneficio' | 'estimate' | 'acceptanceCriteria'
>
export type UpdateBacklogItemForm = NewBacklogItemForm

/* Sprint Backlog */
export const sprintSchema = z.object({
    _id: z.string(),
    project: z.string(),
    name: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    stories: z.array(z.string()),
    status: z.enum(['planned','active','completed','cancelled']),
    createdAt: z.string(),
    updatedAt: z.string()
})
export const sprintListSchema = z.array(sprintSchema)
export type Sprint = z.infer<typeof sprintSchema>
export type CreateSprintForm = Pick<Sprint, 'name' | 'startDate' | 'endDate'>
export type UpdateSprintForm = Partial<Pick<Sprint, 'name' | 'startDate' | 'endDate' | 'status'>>