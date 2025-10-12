import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"

const AuthLayout = () => {
    return (
        <>
            <div className="h-screen bg-gray-50">
                <div className="mx-auto">
                    <h2 className="logo py-5 text-3xl text-center text-gray-800">
                        taskProjectTeam
                    </h2>
                    <div className="mt-10">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastContainer
                pauseOnHover={false}
                pauseOnFocusLoss={false}
                theme="light"
            />

        </>
    )
}
export default AuthLayout