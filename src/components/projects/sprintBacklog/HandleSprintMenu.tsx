import { Fragment } from 'react'
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'

export type SprintMenuItem = {
  _id: string
  name: string
}

type PropshandleSprintMenu = {
  hasSprints: boolean
  sprints: SprintMenuItem[]
  onCreateSprint: () => void
  onSelectSprint: (id: string) => void
  selectedSprint: string | null
}

export default function HandleSprintMenu({ hasSprints, sprints, onCreateSprint, onSelectSprint, selectedSprint }: PropshandleSprintMenu) {
  return (
    <Popover className="relative">
      <PopoverButton className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer">
        Selecciona Sprint
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
        <PopoverPanel className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-lg bg-white border border-gray-200 shadow-xl">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-end">
              <PopoverButton className="p-1 rounded-xl hover:bg-gray-100 cursor-pointer">
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </PopoverButton>
            </div>

            <div className="space-y-1 border-t border-gray-200 pt-2 max-h-60 overflow-y-auto">
              {hasSprints ? (
                sprints.map(sp => (
                  <PopoverButton
                    key={sp._id}
                    as="button"
                    onClick={() => onSelectSprint(sp._id)}
                    className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${selectedSprint === sp._id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {sp.name}
                  </PopoverButton>
                ))
              ) : (
                <button
                  onClick={onCreateSprint}
                  className='cursor-pointer w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium'>
                  <span className='text-lg leading-none'>+</span> Crear Sprint
                </button>
              )}
              {hasSprints && (
                <button
                  onClick={onCreateSprint}
                  className='cursor-pointer w-full bg-gray-50 hover:bg-gray-100 text-indigo-600 px-3 py-2 rounded-md transition-colors text-sm font-medium border border-dashed border-indigo-300'
                >
                  + Nuevo Sprint
                </button>
              )}
            </div>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}