import { z } from 'zod'

/* AUTH & USERS */
const authSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

type Auth = z.infer<typeof authSchema>
export type UserLoginForm = Pick<Auth, "email" | "password">
export type UserRegistrationForm = Pick<Auth, "name" |"email" | "password" | "password_confirmation">
export type UserConfirmationForm = Pick<Auth, "token" >
export type RequestConfirmationCodeForm = Pick<Auth, "email">
export type ForgotPasswordForm = Pick<Auth, "email">
export type NewPasswordForm = Pick<Auth, "password" | "password_confirmation">
export type validateTokenPassword = Pick<Auth, "token" >


/**  Users  **/


export const userSchema = authSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
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
    createdAt: z.string(),
    updatedAt: z.string()
})

export type Task = z.infer<typeof taskSchema>
export type TaskFormData = Pick<Task, 'name' | 'description'>

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