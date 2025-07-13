import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router'

export default function NavMenu() {
  const navigate = useNavigate()
  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <Bars3Icon className='w-5 h-5 text-gray-300' />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute right-0 z-30 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 border border-gray-700 shadow-xl">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 px-2 py-1">
              <p className="text-xs font-medium text-indigo-400">Hola: Usuario</p>
              <Popover.Button className="p-1 rounded-md hover:bg-gray-700">
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </Popover.Button>
            </div>
            
            <div className="space-y-1 border-t border-gray-700 pt-1">
              <Link
                to='/'
                className='block px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors'
              >
                Inicio
              </Link>
              <Link
                to='/profile'
                className='block px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors'
              >
                Mi Perfil
              </Link>
              <Link
                to='/projects'
                className='block px-2 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors'
              >
                Mis Proyectos
              </Link>
              <button
                className='block w-full text-left px-2 py-1.5 text-sm text-rose-400 hover:bg-gray-700 hover:text-rose-300 rounded transition-colors'
                type='button'
                onClick={() => navigate('/auth/login')}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}