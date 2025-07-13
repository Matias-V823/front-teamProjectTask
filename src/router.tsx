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
                </Route>

                <Route element={<AuthLayout/>}>
                    <Route path="/auth/login" element={<LoginView/>}/>
                    <Route path="/auth/register" element={<RegisterView/>}/>
                    <Route path="/auth/confirm-account" element={<ConfirmAccountView/>}/>

                </Route>
            </Routes>
        </BrowserRouter>
    )
}