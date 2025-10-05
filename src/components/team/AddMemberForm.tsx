import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import type { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamApi";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })
    const mutation = useMutation({
        mutationFn: findUserByEmail,
        onError: (error: any) => {
            console.error('Error searching user:', error.message);
        },
        onSuccess: (data: any) => {
            console.log('User found:', data);
        }
    })

    const handleSearchUser = (formData: TeamMemberForm) => {
        const data = {projectId, formData}
        mutation.mutate(data)
    }

    const resetData = () => {
        reset()
        mutation.reset()
    }

    return (
        <>        
            <form
                className="space-y-6"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >
                <div className="space-y-4">
                    <div>
                        <label
                            className="block text-sm font-medium text-gray-700 mb-1"
                            htmlFor="email"
                        >
                            E-mail de Usuario
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="E-mail del usuario a agregar"
                            className="w-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            {...register("email", {
                                required: "El Email es obligatorio",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "E-mail no válido",
                                },
                            })}
                        />
                        {errors.email && (
                            <ErrorMessage>{errors.email.message}</ErrorMessage>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-all ${
                        mutation.isPending
                            ? 'bg-indigo-800 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20'
                    }`}
                >
                    {mutation.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Buscando...
                        </span>
                    ) : (
                        'Buscar Usuario'
                    )}
                </button>            </form>
            {mutation.isSuccess && mutation.data && <SearchResult user={mutation.data} reset={resetData}/>}
            
            {mutation.isError && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">Error al buscar usuario. Verifica el email e intenta nuevamente.</p>
                </div>
            )}
        </>
    )
}