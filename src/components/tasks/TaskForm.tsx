import type { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { TaskFormData } from "@/types/index";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({errors, register} : TaskFormProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <label
                    className="block text-base font-medium text-gray-700"
                    htmlFor="name"
                >
                    Nombre de la tarea
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                    <input
                        id="name"
                        type="text"
                        placeholder="Ingresar aquí nombre de la tarea"
                        className="w-full px-4 py-3 bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none"
                        {...register("name", {
                            required: "El nombre de la tarea es obligatoria",
                        })}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                </div>
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="space-y-3">
                <label
                    className="block text-base font-medium text-gray-700"
                    htmlFor="description"
                >
                    Descripción
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                    <textarea
                        id="description"
                        placeholder="Ingresar aquí descripción"
                        className="w-full px-4 py-3 bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 outline-none min-h-[120px]"
                        {...register("description", {
                            required: "La descripción de la tarea es obligatoria"
                        })}
                    />
                    <div className="absolute top-3 right-3">
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                    </div>
                </div>
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </div>
    )
}