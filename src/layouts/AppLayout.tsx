import NavMenu from "@/components/NavMenu"
import { Outlet } from "react-router"

const AppLayout = () => {
    return (
        <>
            <header className="bg-gray-900 py-5">
                <div className="max-w-screen-2xl mx-auto flex flex-col items-center lg:flex-row justify-between">
                    <div className="mx-10">
                        <h2 className="text-white font-bold text-2xl tracking-tighter">taskProjectTeam</h2>
                    </div>
                    <div className="mx-10">
                        <NavMenu />
                    </div>
                </div>
            </header>
            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet />
            </section>
        </>
    )
}
export default AppLayout