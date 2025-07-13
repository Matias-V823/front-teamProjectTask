import { Outlet } from "react-router"

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

        </>
    )
}
export default AuthLayout