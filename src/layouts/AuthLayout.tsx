import { Outlet } from "react-router"
import { ToastContainer } from "react-toastify"

const AuthLayout = () => {
    return (
        <>
            <div className="h-screen">
                <div className="py-5 lg:pt-15 mx-auto">
                    <h2 className="logo text-5xl text-center">
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
                theme="dark"
            />

        </>
    )
}
export default AuthLayout