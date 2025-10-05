import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "@/layouts/AppLayout"
import Home from "@/views/Home"
import DashboardView from "./views/DashboardView"
import CreateProjectView from "./views/projects/CreateProjectView"
import EditProjectView from "./views/projects/EditProjectView"
import ProjectDetailsView from "./views/projects/ProjectDetailsView"
import AuthLayout from "./layouts/AuthLayout"
import LoginView from "./views/auth/LoginView"
import RegisterView from "./views/auth/RegisterView"
import ConfirmAccountView from "./views/auth/ConfirmAccountView"
import NewCodeView from "./views/auth/NewCodeView"
import ForgotPasswordView from "./views/auth/ForgotPasswordView"
import NewPasswordView from "./views/auth/NewPasswordView"
import ProductBacklog from "./views/ProductBacklog"
import ProjectTeamView from "./views/projects/ProjectTeamView"
import SprintBacklog from "./views/SprintBacklog"
import HistoryUserDetail from "./views/HistoryUserDetail"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  element={<AppLayout/>}>
                    <Route path="/" index element={<Home/>}/>
                    <Route path="/projects" index element={<DashboardView/>}/>
                    <Route path="/projects/create" index element={<CreateProjectView/>}/>
                    <Route path="/projects/:projectId/edit" index element={<EditProjectView/>}/>
                    <Route path="/projects/:projectId/view" index element={<ProjectDetailsView/>}/>
                    <Route path="/projects/:projectId/view/backlog" index element={<ProductBacklog/>}/>
                    <Route path="/projects/:projectId/view/sprint-backlog" index element={<SprintBacklog/>}/>
                    <Route path="/projects/:projectId/view/sprint-backlog/:historyId" index element={<HistoryUserDetail/>}/>
                    <Route path="/projects/:projectId/view/team" index element={<ProjectTeamView/>}/>
                    
                </Route>

                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView/>}/>
                    <Route path="/auth/register" element={<RegisterView/>}/>
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView/>}/>
                    <Route path="/auth/new-code" element={<NewCodeView/>}/>
                    <Route path="/auth/forgot-password" element={<ForgotPasswordView/>}/>
                    <Route path="/auth/new-password" element={<NewPasswordView/>}/>
                </Route>    
            </Routes>
        </BrowserRouter>
    )
}