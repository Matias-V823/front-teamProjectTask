import NavMenu from "@/components/NavMenu"
import { useAuth } from "@/hooks/useAuth"
import { Link, Navigate, Outlet } from "react-router"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

const AppLayout = () => {

    const { data, isError, isLoading } = useAuth()

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="loader">
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
                <div className="loader-circle"></div>
            </div>
        </div>
    )

    if (isError) {
        return <Navigate to='/auth/login' />
    }

    if (data) return (
        <>
            <header className="top-0 z-50 py-5 px-10">
                <div className="max-w-2xl mx-auto border-[0.5px] h-[60px] rounded-2xl border-gray-700 shadow-xl backdrop-blur-3xl">
                    <div className="h-full p-0 flex flex-col items-center lg:flex-row lg:justify-between gap-4 bg-gradient-to-r from-indigo-900/20 via-purple-900/20 to-gray-900/20 rounded-2xl">
                        <Link to='/' className="h-full flex items-center px-4 group">
                            <h2 className="logo text-lg">
                                taskProjectTeam
                            </h2>
                        </Link>
                        <div className="h-full flex items-center pr-4">
                            <NavMenu name={data.name} />
                        </div>
                    </div>
                </div>
            </header>

            <section className="max-w-screen-2xl mx-auto mt-10 p-5">
                <Outlet />
            </section>

            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                theme="dark"
            />
        </>
    )
}
export default AppLayout