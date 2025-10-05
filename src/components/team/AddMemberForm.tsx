import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import type { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamApi";

export default function AddMemberForm() {
    const initialValues: TeamMemberForm = {
        email: ''
    }
    const params = useParams()
    const projectId = params.projectId!

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues })


    const mutation = useMutation({
        mutationFn: findUserByEmail
    })

    const handleSearchUser = (formData: TeamMemberForm) => {
        const data = {projectId, formData}
        mutation.mutate(data)
        reset()
    }

    return (
        <>        
            <form
                className="mt-4 space-y-5"
                onSubmit={handleSubmit(handleSearchUser)}
                noValidate
            >

                <div className="flex flex-col gap-3">
                    <label
                        className="font-medium text-lg text-gray-100"
                        htmlFor="email"
                    >E-mail de Usuario</label>
                    <input
                        id="email"
                        type="text"
                        placeholder="E-mail del usuario a agregar"
                        className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-100 rounded"
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

                <button
                    type="submit"


                >
                    {/* {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Buscando...
                        </span>
                    ) : (
                        'Buscar Usuario'
                    )} */}
                    buscar usuario
                </button>
            </form>
            {mutation.isPending && <p className="text-gray-400 mt-4">Buscando usuario...</p>}
            {mutation.isSuccess &&
                <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded">
                    <h3 className="text-lg font-medium text-gray-100">Usuario encontrado:</h3>
                    <p className="text-gray-400">Nombre: {mutation.data.name}</p>
                    <p className="text-gray-400">Email: {mutation.data.email}</p>
                </div>
            }
        </>
    )
}