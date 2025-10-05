import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { FiX } from 'react-icons/fi'
import { Fragment, useMemo, useState, useEffect } from 'react'

export type SprintStory = {
    id: number
    title: string
    estimate: number
}

interface ModalSelectHistoryUserProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: (stories: SprintStory[]) => void
    selected: SprintStory[]
}

const MOCK_STORIES: SprintStory[] = [
    { id: 1, title: 'Como Cliente quiero visualizar el catálogo', estimate: 8 },
    { id: 2, title: 'Como Usuario registrado quiero iniciar sesión', estimate: 5 },
    { id: 3, title: 'Como Usuario quiero usar la app en móviles', estimate: 13 },
    { id: 4, title: 'Como Admin quiero gestionar usuarios', estimate: 3 },
    { id: 5, title: 'Como Cliente quiero filtrar productos', estimate: 5 },
]

const ModalSelectHistoryUser = ({ isOpen, onClose, onConfirm, selected }: ModalSelectHistoryUserProps) => {
    const [checked, setChecked] = useState<Record<number, boolean>>({})

    useEffect(() => {
        const map: Record<number, boolean> = {}
        selected.forEach(s => { map[s.id] = true })
        setChecked(map)
    }, [selected, isOpen])

    const toggle = (id: number) => {
        setChecked(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const allSelected = useMemo(() => MOCK_STORIES.filter(s => checked[s.id]), [checked])
    const totalPoints = allSelected.reduce((t, s) => t + s.estimate, 0)

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-xl bg-white border border-gray-200 text-left align-middle shadow-xl transition-all p-6 md:p-8 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    <FiX className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                                </button>

                                <div className="space-y-6">
                                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                        <div>
                                            <DialogTitle as="h3" className="text-2xl font-bold text-gray-900">Seleccionar Historias de Usuario</DialogTitle>
                                            <p className="text-gray-600 mt-1">Marca las historias que trabajarás en este sprint.</p>
                                        </div>
                                        <div className="flex gap-4 bg-gray-50 border border-gray-200 rounded-lg px-4 mt-8 text-sm text-gray-600">
                                            <span><strong>{allSelected.length}</strong> seleccionadas</span>
                                            <span className='hidden md:inline text-gray-300'>|</span>
                                            <span><strong>{totalPoints}</strong> pts</span>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                                        <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 text-xs font-medium text-gray-600 uppercase tracking-wide">
                                            <div className="col-span-1 text-center">Sel</div>
                                            <div className="col-span-7 md:col-span-8">Título</div>
                                            <div className="col-span-2 md:col-span-2 text-center">Puntos</div>
                                            <div className="col-span-2 md:col-span-1 text-center">ID</div>
                                        </div>
                                        <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-200">
                                            {MOCK_STORIES.map(story => {
                                                const isChecked = !!checked[story.id]
                                                return (
                                                    <label
                                                        key={story.id}
                                                        className={`grid grid-cols-12 gap-4 p-3 text-sm items-center cursor-pointer transition-colors ${isChecked ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggle(story.id)}
                                                            className="col-span-1 mx-auto h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                                                        />
                                                        <span className="col-span-7 md:col-span-8 text-gray-700 pr-2 truncate" title={story.title}>{story.title}</span>
                                                        <span className="col-span-2 md:col-span-2 text-center font-medium text-indigo-600">{story.estimate}</span>
                                                        <span className="col-span-2 md:col-span-1 text-center text-gray-400">#{story.id}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="text-sm text-gray-500">
                                            Seleccionadas: <span className='font-medium text-gray-700'>{allSelected.length}</span> | Puntos: <span className='font-medium text-gray-700'>{totalPoints}</span>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <button
                                                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors cursor-pointer"
                                                onClick={onClose}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                className={`px-4 py-2 rounded-md text-white transition-colors ${allSelected.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'}`}
                                                onClick={() => allSelected.length > 0 && onConfirm(allSelected)}
                                                disabled={allSelected.length === 0}
                                            >
                                                Confirmar selección
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default ModalSelectHistoryUser