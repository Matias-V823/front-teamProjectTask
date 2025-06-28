import { Link } from "react-router"

const DashboardView = () => {
  return (
    <>
      <h1 className="text-5xl text-gray-50 font-bold">Mis projectos</h1>
      <p className="text-2xl font-light text-gray-500 mt-3">Maneja y administra tus proyectos</p>
      <nav className="my-5">
        <Link 
        to='/projects/create' 
        className="bg-sky-400 px-5 py-2 rounded-lg cursor-pointer">
        Nuevo Proyecto
        </Link>
      </nav>
    </>
  )
}
export default DashboardView