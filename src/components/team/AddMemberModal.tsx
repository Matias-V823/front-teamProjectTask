import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router';
import AddMemberForm from './AddMemberForm';
import { FiX } from 'react-icons/fi';

export default function AddMemberModal() {

    const location = useLocation()
    const navigate = useNavigate()

    const queryParams = new URLSearchParams(location.search);
    const addMember = queryParams.get('addTeamMember');
    const show = addMember ? true : false

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
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
                            <DialogPanel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-gray-900 border border-gray-800 text-left align-middle shadow-2xl transition-all p-8 relative">
                                <button
                                    onClick={() => navigate(location.pathname, { replace: true })}
                                    className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-800 transition-colors"
                                >
                                    <FiX className="w-6 h-6 text-gray-400 hover:text-gray-200" />
                                </button>

                                <div className="space-y-6">
                                    <div>
                                        <DialogTitle
                                            as="h3"
                                            className="text-2xl font-bold text-gray-100"
                                        >
                                            Agregar Integrante al equipo
                                        </DialogTitle>
                                        <p className="text-gray-400 mt-1">
                                            Busca el nuevo integrante por email <span className="text-fuchsia-500">para agregarlo al proyecto</span>
                                        </p>
                                    </div>

                                    <AddMemberForm />
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}