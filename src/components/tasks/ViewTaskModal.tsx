import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { FiX, FiCalendar, FiFileText, FiFolder, FiFlag, FiChevronDown } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { statusTranslation } from '@/locales/es';
import type { TaskStatus } from '@/types/index';

export default function ViewTaskModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const projectId = params.projectId!;
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('viewTask')!;
    const show = taskId ? true : false;

    const queryClient = useQueryClient()
    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId
    });

    const [status, setSelectedStatus] = useState<TaskStatus>(data?.status!);
    const { mutate, reset } = useMutation({
        mutationFn: updateStatus,
        onSuccess: (data) => {
            toast.success(data, { theme: 'light' })
            queryClient.invalidateQueries({queryKey: ['project', {projectId}]})
            queryClient.invalidateQueries({queryKey: ['task', {projectId}]})
            reset()
        },
        onError: (error) => {
            toast.error(error.message, { theme: 'light' })
        }
    })

    const handleChangeStatus = () => {
        const data = {
            projectId,
            taskId,
            status
        }
        mutate(data)
    }

    if (isError) {
        toast.error(error.message, { toastId: 'error' });
        return <Navigate to={`projects/${projectId}`} />;
    }

    if (!data) return null;

    return (
        <Transition appear show={show} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => navigate(location.pathname, { replace: true })}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white border border-gray-200 text-left align-middle shadow-2xl transition-all p-8 relative">
                                <button
                                    onClick={() => navigate(location.pathname, { replace: true })}
                                    className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </button>

                                <div className="space-y-8">
                                    <div className="border-b border-gray-200 pb-6">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-3xl font-bold text-gray-800"
                                        >
                                            {data.name}
                                        </Dialog.Title>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <FiFileText className="text-indigo-500 text-lg" />
                                                <span className="font-semibold text-gray-700">Descripción</span>
                                            </div>
                                            <p className="text-gray-600 pl-9 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                {data.description || 'No hay descripción disponible'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <FiCalendar className="text-emerald-500 text-lg" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Creada el</p>
                                                    <p className="text-gray-800 font-medium">
                                                        {new Date(data.createdAt).toLocaleDateString('es-ES', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <FiFolder className="text-blue-500 text-lg" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Proyecto</p>
                                                    <p className="text-gray-800 font-medium">{data.name || 'Sin proyecto'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-2">
                                                <div className="p-2 bg-white rounded-lg border border-gray-200">
                                                    <FiFlag className="text-purple-500 text-lg" />
                                                </div>
                                                <div className="w-full space-y-2">
                                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Estado</p>
                                                    <div className="relative">
                                                        <select
                                                            defaultValue={data.status}
                                                            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
                                                            className="w-full bg-white border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 pr-10 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                                        >
                                                            {Object.entries(statusTranslation).map(([key, value]) => (
                                                                <option
                                                                    key={key}
                                                                    value={key}
                                                                    className="bg-white text-gray-700"
                                                                >
                                                                    {value}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <FiChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    <div className="flex justify-end mt-4">
                                                        <button
                                                            onClick={() => handleChangeStatus()}
                                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow"
                                                        >
                                                            Actualizar Estado
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}