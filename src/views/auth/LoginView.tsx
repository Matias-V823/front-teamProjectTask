import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import type { UserLoginForm } from "@/types/index";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/AuthApi";
import { toast } from 'react-toastify'

export default function LoginView() {
    const navigate = useNavigate()
    const initialValues: UserLoginForm = {
        email: '',
        password: '',
    };

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: initialValues
    });

    const { mutate, reset } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success('Iniciando sesion')
            reset()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    const handleLogin = (formData: UserLoginForm) => {
        mutate(formData);
    };

    return (
        <div className="h-screen bg-gray-950  px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-1 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-gray-900">
                        <div className="bg-gray-900/90 p-8">
                            <div className="mb-8 text-center">
                                <h1 className="text-4xl md:text-xl font-bold text-gray-100">
                                    Iniciar Sesión
                                </h1>
                                <p className="text-xs text-gray-400 mt-2">
                                    Ingresa tus credenciales para acceder
                                </p>
                            </div>
                            <form onSubmit={handleSubmit(handleLogin)} noValidate>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="email"
                                            className="formLabelAuth"
                                        >
                                            Correo Electrónico
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="tu@email.com"
                                            className="formInputAuth"
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

                                    <div className="space-y-2">
                                        <label
                                            htmlFor="password"
                                            className="formLabelAuth"
                                        >
                                            Contraseña
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            className="formInputAuth"
                                            {...register("password", {
                                                required: "La contraseña es obligatoria",
                                            })}
                                        />
                                        {errors.password && (
                                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                                Recordarme
                                            </label>
                                        </div>

                                        <div className="text-sm">
                                            <Link
                                                to="/auth/forgot-password"
                                                className="font-medium text-indigo-400 hover:text-indigo-300"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </Link>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
                                        >
                                            Iniciar Sesión
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="mt-6 text-center text-sm text-gray-400">
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    to="/auth/register"
                                    className="font-medium text-indigo-400 hover:text-indigo-300"
                                >
                                    Regístrate
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}