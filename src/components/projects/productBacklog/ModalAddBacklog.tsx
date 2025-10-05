import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { FiX } from 'react-icons/fi';
import { Fragment } from 'react/jsx-runtime';
import type { Dispatch, SetStateAction } from 'react';

type NewStory = {
  persona: string;
  objetivo: string;
  beneficio: string;
  estimate: number;
  acceptanceCriteria: string;
};

interface ModalAddBacklogProps {
  isOpen: boolean;
  onClose: () => void;
  newStory: NewStory;
  setNewStory: Dispatch<SetStateAction<NewStory>>;
  onAdd: () => void;
  validate: (persona: string, objetivo: string, beneficio: string) => boolean;
  buildTitle: (persona: string, objetivo: string, beneficio: string) => string;
}

const ModalAddBacklog = ({
  isOpen,
  onClose,
  newStory,
  setNewStory,
  onAdd,
  validate,
  buildTitle,
}: ModalAddBacklogProps) => {
  const isValid = validate(newStory.persona, newStory.objetivo, newStory.beneficio);

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
              <DialogPanel className="w-full max-w-5xl transform overflow-hidden rounded-xl bg-white border border-gray-200 text-left align-middle shadow-xl transition-all p-8 relative">
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <FiX className="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </button>

                <div className="space-y-6">
                  <div>
                    <DialogTitle
                      as="h3"
                      className="text-2xl font-bold text-gray-900"
                    >
                      Agregar Historia de Usuario
                    </DialogTitle>
                    <p className="text-gray-600 mt-1">
                      Completa la estructura y criterios para <span className="text-indigo-600 font-bold">crear la historia</span>.
                    </p>
                  </div>

                  <div className="bg-white/70 p-6 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Como (Persona/Rol):</label>
                        <input
                          type="text"
                          value={newStory.persona}
                          onChange={(e) => setNewStory(s => ({ ...s, persona: e.target.value }))}
                          placeholder="Ej: Cliente, Usuario registrado..."
                          className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Yo quiero (Objetivo):</label>
                        <input
                          type="text"
                          value={newStory.objetivo}
                          onChange={(e) => setNewStory(s => ({ ...s, objetivo: e.target.value }))}
                          placeholder="Ej: visualizar el catálogo..."
                          className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">De modo que (Beneficio):</label>
                        <input
                          type="text"
                          value={newStory.beneficio}
                          onChange={(e) => setNewStory(s => ({ ...s, beneficio: e.target.value }))}
                          placeholder="Ej: pueda ordenar un ítem"
                          className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estimación (puntos):</label>
                        <input
                          type="number"
                          value={newStory.estimate}
                          onChange={(e) =>
                            setNewStory(s => ({ ...s, estimate: Number.parseInt(e.target.value) || 0 }))
                          }
                          min={0}
                          className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Criterios de aceptación:</label>
                        <textarea
                          value={newStory.acceptanceCriteria}
                          onChange={(e) =>
                            setNewStory(s => ({ ...s, acceptanceCriteria: e.target.value }))
                          }
                          placeholder="Uno por línea..."
                          rows={3}
                          className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                      <span className="font-medium text-gray-700">Vista previa del título:</span>
                      <span className="italic text-gray-600">
                        {isValid
                          ? buildTitle(newStory.persona, newStory.objetivo, newStory.beneficio)
                          : 'Completa los 3 campos para generar el título...'}
                      </span>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md transition-colors cursor-pointer"
                        onClick={onClose}
                      >
                        Cancelar
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-white transition-colors ${
                          isValid ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer' : 'bg-indigo-300 cursor-not-allowed'
                        }`}
                        onClick={onAdd}
                        disabled={!isValid}
                      >
                        Agregar
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
export default ModalAddBacklog