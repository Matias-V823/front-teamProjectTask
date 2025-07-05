import NavMenu from "@/components/NavMenu"
import { Link, Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

const AppLayout = () => {
    return (
        <>
            <header className="bg-gray-900 py-5">
                <div className="max-w-screen-2xl mx-auto flex flex-col items-center lg:flex-row justify-between">
                    <div className="mx-10">
                        <Link to='/'>
                            <h2 className="text-white font-bold text-2xl tracking-tighter">taskProjectTeam</h2>
                        </Link>
                    </div>
                    <div className="mx-10">
                        <NavMenu />
                    </div>
                </div>
            </header>
            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet />
            </section>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
            />
        </>
    )
}
export default AppLayout