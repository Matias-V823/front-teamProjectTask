import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { FiX, FiCalendar, FiFileText, FiFolder, FiFlag, FiChevronDown, FiUser, FiMail, FiCheckCircle } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateStatus } from '@/api/TaskApi';
import { toast } from 'react-toastify';
import { statusTranslation } from '@/locales/es';
import type { TaskStatus } from '@/types/index';
import { getProjectTeam } from '@/api/TeamApi';

export default function ViewTaskModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const projectId = params.projectId!;
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('viewTask')!;
    const show = taskId ? true : false;

    const queryClient = useQueryClient();
    const { data, isError, error } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        enabled: !!taskId
    });

    const { data: teamData } = useQuery({
        queryKey: ['teamMembers', projectId],
        queryFn: () => getProjectTeam(projectId),
        enabled: !!projectId
    });

    const assignedMember = (data?.assignedTo && teamData?.team)
        ? teamData.team.find(m => m._id === data.assignedTo)
        : undefined;
    const assigneeInitials = assignedMember
        ? assignedMember.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '';

    const [status, setSelectedStatus] = useState<TaskStatus>(data?.status!);
    const { mutate, reset } = useMutation({
        mutationFn: updateStatus,
        onSuccess: (data) => {
            toast.success(data, { theme: 'light' });
            queryClient.invalidateQueries({ queryKey: ['project', { projectId }] });
            queryClient.invalidateQueries({ queryKey: ['task', { projectId }] });
            reset();
        },
        onError: (error) => {
            toast.error(error.message, { theme: 'light' });
        }
    });

    const handleChangeStatus = () => {
        const data = {
            projectId,
            taskId,
            status
        };
        mutate(data);
    };

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
                            <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                                    <button
                                        onClick={() => navigate(location.pathname, { replace: true })}
                                        className="absolute right-4 top-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
                                    >
                                        <FiX className="w-5 h-5 text-white" />
                                    </button>
                                    
                                    <div className="pr-12">
                                        <DialogTitle
                                            as="h3"
                                            className="text-2xl font-bold text-white mb-2"
                                        >
                                            {data.name}
                                        </DialogTitle>
                                        <div className="flex items-center gap-4 text-white/90">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <FiFolder className="w-4 h-4" />
                                                <span>{data.name || 'Sin proyecto'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(data.createdAt).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <FiFileText className="text-indigo-500 text-lg" />
                                            <span className="font-semibold text-gray-700">Descripción</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed p-4 rounded-xl border border-gray-200">
                                            {data.description || 'No hay descripción disponible'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <div className="rounded-xl border border-gray-200 p-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <FiUser className="text-indigo-500 text-lg" />
                                                    <span className="font-semibold text-gray-700">Asignado a</span>
                                                </div>
                                                
                                                {assignedMember ? (
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                                    {assigneeInitials}
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                                                    <FiCheckCircle className="w-3 h-3 text-white" />
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-gray-800 truncate">
                                                                    {assignedMember.name}
                                                                </h4>
                                                                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                                                                    <FiMail className="w-3 h-3" />
                                                                    {assignedMember.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2 pt-3 border-t border-gray-200">
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Rol</span>
                                                                <span className="font-medium text-gray-700">
                                                                    {assignedMember.name || 'Miembro'}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between text-sm">
                                                                <span className="text-gray-500">Estado</span>
                                                                <span className="font-medium text-green-600">
                                                                    Activo
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                                                            <FiUser className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Sin asignar</p>
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            Esta tarea no tiene asignado
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="bg-white rounded-xl border border-gray-200 p-5">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FiFlag className="text-purple-500 text-lg" />
                                                    <span className="font-semibold text-gray-700">Estado de la Tarea</span>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    <div className="relative">
                                                        <select
                                                            defaultValue={data.status}
                                                            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus)}
                                                            className="w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-xl px-4 py-3 pr-10 appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
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
                                                        <FiChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                                                    </div>
                                                    
                                                    <button
                                                        onClick={handleChangeStatus}
                                                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
                                                    >
                                                        <FiCheckCircle className="w-4 h-4 inline mr-2" />
                                                        Actualizar Estado
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                                            <FiCalendar className="text-emerald-500 text-lg" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                                                Creada el
                                                            </p>
                                                            <p className="text-gray-800 font-semibold text-sm">
                                                                {new Date(data.createdAt).toLocaleDateString('es-ES', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                                            <FiFolder className="text-blue-500 text-lg" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                                                                Proyecto
                                                            </p>
                                                            <p className="text-gray-800 font-semibold text-sm">
                                                                {data.name || 'Sin proyecto'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}