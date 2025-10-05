import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteProject, getProjects } from "@/api/ProjectApi"
import { FaProjectDiagram } from 'react-icons/fa'
import { FiFolder, FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { BsExclamationOctagon } from 'react-icons/bs'
import { Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

const DashboardView = () => {
  const { data: user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })


  const { mutate } = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message, {
        theme: 'dark',
        position: 'top-right'
      })

    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success(data, {
        theme: 'dark',
        position: 'top-right'
      })
    }
  })


  if (isLoading && authLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  return (
    <div className='min-h-screen pb-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-7xl mx-auto">
        <div className="pt-10 pb-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-800">
                Mis Proyectos <FaProjectDiagram className='inline-block w-8 text-indigo-400 ml-2' />
              </h1>
              <p className="text-xl font-light text-gray-600 mt-2">Maneja y administra tus proyectos</p>
            </div>
            <Link
              to='/projects/create'
              className="buttonActions"
            >
              <FiPlusCircle className="w-5 h-5" />
              Nuevo Proyecto
            </Link>
          </div>
        </div>

        {data?.length ? (
          <ul className="mt-8 space-y-4">
            {data.map((project) => (
              <li
                key={project._id}
                className="group relative rounded-xl bg-white border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    { project.manager === user?._id ?
                      <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-[8px] font-medium bg-green-300 text-indigo-800 uppercase">
                        Manager
                      </span> : 
                      <span className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-[8px] font-medium bg-indigo-100 text-indigo-800 uppercase">
                        Miembro del equipo
                      </span>
                    }
                    <Link
                      to={`/projects/${project._id}/view`}
                      className="text-2xl font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      <FiFolder className="text-indigo-400 inline-block mr-3 w-6 h-6" />
                      {project.projectName}
                    </Link>
                    <p className="mt-3 text-gray-500">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        Cliente: {project.clientName}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/30 text-indigo-600">
                        ID: {project._id.slice(0, 6)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Menu as="div" className="relative">
                      <MenuButton className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                        <EllipsisVerticalIcon className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                      </MenuButton>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-gray-200 focus:outline-none divide-y divide-gray-200">
                          <div className="py-1">
                            <MenuItem>
                              {({ focus }) => (
                                <Link
                                  to={`/projects/${project._id}/view`}
                                  className={`${focus ? 'bg-gray-100 text-gray-600' : 'text-gray-500'} block px-4 py-2 text-sm`}
                                >
                                  Ver Proyecto
                                </Link>
                              )}
                            </MenuItem>
                            {
                              user?._id === project.manager && (
                              <MenuItem>
                                {({ focus }) => (
                                  <Link
                                    to={`/projects/${project._id}/edit`}
                                    className={`${focus ? 'bg-gray-100 text-gray-600' : 'text-gray-500'} block px-4 py-2 text-sm`}
                                  >
                                    Editar Proyecto
                                  </Link>
                                )}
                              </MenuItem>
                            )} 
                          </div>
                          {
                            user?._id === project.manager && (
                              <div className="py-1">
                                <MenuItem>
                                  {({ focus }) => (
                                    <button
                                      onClick={() => mutate(project._id)}
                                      className={`${focus ? 'bg-red-500/90 text-red-100' : 'text-red-500'} w-full text-left px-4 py-2 text-sm flex items-center gap-2 cursor-pointer `}
                                    >
                                      <BsExclamationOctagon className="w-4 h-4" />
                                      Eliminar Proyecto
                                    </button>
                                  )}
                                </MenuItem>
                              </div>
                            )
                          }
                        </MenuItems>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FiFolder className="w-12 h-12 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-medium text-gray-600">No hay proyectos</h3>
            <p className="mt-2 text-gray-400">Comienza creando tu primer proyecto</p>
            <Link
              to="/projects/create"
              className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              <FiPlusCircle className="w-5 h-5 mr-2" />
              Crear Proyecto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardView