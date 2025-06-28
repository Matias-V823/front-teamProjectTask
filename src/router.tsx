import { BrowserRouter, Route, Routes } from "react-router"
import AppLayout from "./layouts/AppLayout"
import Home from "./views/Home"

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route  element={<AppLayout/>}>
                    <Route path="/" index element={<Home/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}