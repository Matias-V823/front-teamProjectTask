import type { NewPasswordForm, validateTokenPassword } from "@/types/index";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "@/api/AuthApi";
import { toast } from 'react-toastify'

type newPasswordProps = {
    token: validateTokenPassword['token']
}

export default function NewPasswordForm({token} : newPasswordProps) {

    const navigate = useNavigate()
    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

    const { mutate } = useMutation({
        mutationFn: updatePassword,
        onSuccess: (data) => {
            toast.success(data.message)
            reset()
            navigate('/auth/login')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const handleNewPassword = (formData: NewPasswordForm) => {
        const data = {
            token,
            formData
        }
        mutate(data)
    }


    const password = watch('password');

    return (
        <div className="max-w-md mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
                    Nueva Contraseña
                </h1>
                <p className="text-gray-300">
                    Ingresa tu nueva {''}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 font-medium">
                        contraseña
                    </span>
                </p>
            </div>

            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-6 p-8 rounded-xl bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 shadow-xl"
                noValidate
            >
                <div className="flex flex-col gap-3">
                    <label
                        className="formLabelAuth"
                        htmlFor="password"
                    >
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Nueva contraseña"
                        className="formInputAuth"
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: {
                                value: 8,
                                message: 'La contraseña debe tener mínimo 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <label
                        className="formLabelAuth"
                        htmlFor="password_confirmation"
                    >
                        Confirmar Contraseña
                    </label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Confirma tu nueva contraseña"
                        className="formInputAuth"
                        {...register("password_confirmation", {
                            required: "Debes confirmar tu contraseña",
                            validate: value => value === password || 'Las contraseñas no coinciden'
                        })}
                    />

                    {errors.password_confirmation && (
                        <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                    )}
                </div>

                <input
                    type="submit"
                    value="Establecer Contraseña"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/20 cursor-pointer"
                />
            </form>
        </div>
    )
}