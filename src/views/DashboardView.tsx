import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteProject, getProjects } from "@/api/ProjectApi"
import { FaProjectDiagram } from 'react-icons/fa'
import { FiFolder, FiPlusCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { BsExclamationOctagon } from 'react-icons/bs'
import { Link } from 'react-router'

const DashboardView = () => {

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

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-950 pb-12 px-4 sm:px-6 lg:px-8'>
      <div className="max-w-7xl mx-auto">
        <div className="pt-10 pb-6 border-b border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-100">
                Mis Proyectos <FaProjectDiagram className='inline-block w-8 text-indigo-400 ml-2' />
              </h1>
              <p className="text-xl font-light text-gray-400 mt-2">Maneja y administra tus proyectos</p>
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
                className="group relative bg-gray-900/50 hover:bg-gray-900/70 rounded-xl border border-gray-800 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/projects/${project._id}/view`}
                      className="text-2xl font-bold text-gray-100 hover:text-indigo-400 transition-colors"
                    >
                      <FiFolder className="text-indigo-400 inline-block mr-3 w-6 h-6" />
                      {project.projectName}
                    </Link>
                    <p className="mt-3 text-gray-300">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        Cliente: {project.clientName}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300">
                        ID: {project._id.slice(0, 6)}...
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors">
                        <EllipsisVerticalIcon className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-gray-800 shadow-lg ring-1 ring-gray-700 focus:outline-none divide-y divide-gray-700">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/projects/${project._id}/view`}
                                  className={`${active ? 'bg-gray-700 text-white' : 'text-gray-200'} block px-4 py-2 text-sm`}
                                >
                                  Ver Proyecto
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/projects/${project._id}/edit`}
                                  className={`${active ? 'bg-gray-700 text-white' : 'text-gray-200'} block px-4 py-2 text-sm`}
                                >
                                  Editar Proyecto
                                </Link>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={() => mutate(project._id)}
                                  className={`${active ? 'bg-red-900/50 text-red-100' : 'text-red-400'} w-full text-left px-4 py-2 text-sm flex items-center gap-2`}
                                >
                                  <BsExclamationOctagon className="w-4 h-4" />
                                  Eliminar Proyecto
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-16 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <FiFolder className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-medium text-gray-300">No hay proyectos</h3>
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