import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/20/solid'
import { Link, useNavigate } from 'react-router'
import type { User } from '../types'
import { useQueryClient } from '@tanstack/react-query'

type NavMenuProps = {
  name: User['name']
}

export default function NavMenu({ name }: NavMenuProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = () => {
    localStorage.clear()
    queryClient.invalidateQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }

  return (
    <Popover className="relative z-[9999]">
      <PopoverButton className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
        <Bars3Icon className='w-5 h-5 text-gray-400' />
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute right-0 z-[9999] mt-2 w-48 origin-top-right rounded-lg bg-white border border-gray-200 shadow-xl">
          <div className="p-2">
            <div className="flex items-center justify-between mb-2 px-2 py-1">
              <p className="text-xs font-medium text-indigo-400">Hola: {name}</p>
              <PopoverButton className="p-1 rounded-xl hover:bg-gray-100 cursor-pointer">
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </PopoverButton>
            </div>

            <div className="space-y-1 border-t border-gray-200 pt-1">
              <Link
                to='/'
                className='block px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors'
              >
                Inicio
              </Link>
              <Link
                to='/profile'
                className='block px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors'
              >
                Mi Perfil
              </Link>
              <Link
                to='/projects'
                className='block px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors'
              >
                Mis Proyectos
              </Link>
              <Link
                to='/reports'
                className='block px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded transition-colors'
              >
                Reportes
              </Link>
              <button
                className='block w-full text-left px-2 py-1.5 text-sm text-rose-400 hover:text-rose-500 rounded transition-colors
                cursor-pointer'
                type='button'
                onClick={logout}
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}