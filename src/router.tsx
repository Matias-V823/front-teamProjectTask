import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "@/layouts/AppLayout"
import Home from "@/views/Home"
import DashboardView from "./views/DashboardView"
import CreateProjectView from "./views/projects/CreateProjectView"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  element={<AppLayout/>}>
                    <Route path="/" index element={<Home/>}/>
                    <Route path="/projects" index element={<DashboardView/>}/>
                    <Route path="/projects/create" index element={<CreateProjectView/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}