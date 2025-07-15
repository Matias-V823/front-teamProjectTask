import { RequestCode } from "@/api/AuthApi";
import ErrorMessage from "@/components/ErrorMessage";
import type { RequestConfirmationCodeForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast }  from 'react-toastify'

const NewCodeView = () => {
    const initialValues: RequestConfirmationCodeForm = {
        email: ''
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });


    const { mutate } = useMutation({
        mutationFn: RequestCode,
        onSuccess: (data) => {
            toast.success(data.message)
            reset()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleRequestCode = (formData: RequestConfirmationCodeForm) => mutate(formData)

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
                    Solicitar Código de Confirmación
                </h1>
                <p className="text-gray-300">
                    Coloca tu e-mail para recibir {''}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 font-medium">
                        un nuevo código
                    </span>
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleRequestCode)}
                className="space-y-6 p-8 rounded-xl bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 shadow-xl"
                noValidate
            >
                <div className="flex flex-col gap-3">
                    <label
                        className="formLabelAuth"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="formInputAuth"
                        {...register("email", {
                            required: "El Email de registro es obligatorio",
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

                <input
                    type="submit"
                    value="Enviar Código"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/20 cursor-pointer"
                />
            </form>

            <nav className="mt-8 flex flex-col space-y-3 text-center">
                <Link
                    to="/auth/login"
                    className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fuchsia-300 hover:to-purple-300 transition-colors "
                >
                    ¿Ya tienes cuenta? Iniciar Sesión
                </Link>
                <Link
                    to="/auth/forgot-password"
                    className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fuchsia-300 hover:to-purple-300 transition-colors "
                >
                    ¿Olvidaste tu contraseña? Reestablecer
                </Link>
            </nav>
        </div>
    )
}
export default NewCodeView