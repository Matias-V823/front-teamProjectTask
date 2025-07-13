import { useForm } from "react-hook-form";
import type { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router";

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  }

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const password = watch('password');

  const handleRegister = (formData: UserRegistrationForm) => {}

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl"> 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]"> 
          <div className="flex flex-col h-full">
            <div className="bg-gray-900/90 h-full flex items-center justify-center rounded-l-lg border border-gray-800 border-r-0">
              <img 
                src="/img/ilustration.png" 
                alt="Registro" 
                className="w-full min-h-full object-cover rounded-l-lg"
              />
            </div>
          </div>
          <div className="flex flex-col h-full">
            <div className="bg-gray-900/50 border border-gray-800 rounded-r-lg shadow-xl overflow-hidden h-full">
              <div className="p-1 bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-gray-900 h-full">
                <div className="bg-gray-900/90 p-6 h-full flex flex-col justify-center">
                  <form onSubmit={handleSubmit(handleRegister)} noValidate>
                    <div className="space-y-4">
                      <div className="text-center mb-10">
                        <h1 className="text-2xl font-bold text-gray-100 ">Crea tu cuenta</h1>
                        <p className="text-sm text-gray-400">Completa el formulario para comenzar</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300" htmlFor="name">
                            Nombre
                          </label>
                          <input
                            id="name"
                            type="text"
                            placeholder="Tu nombre completo"
                            className="formInputAuth" 
                            {...register("name", {
                              required: "El Nombre de usuario es obligatorio",
                            })}
                          />
                          {errors.name && (
                            <ErrorMessage>{errors.name.message}</ErrorMessage>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                        <div className="space-y-2">
                          <label  htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Contraseña
                          </label>
                          <input
                            id="password"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            className="formInputAuth" 
                            {...register("password", {
                              required: "La contraseña es obligatoria",
                              minLength: {
                                value: 8,
                                message: 'La contraseña debe ser mínimo de 8 caracteres'
                              }
                            })}
                          />
                          {errors.password && (
                            <ErrorMessage>{errors.password.message}</ErrorMessage>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300">
                            Repetir Contraseña
                          </label>
                          <input
                            id="password_confirmation"
                            type="password"
                            placeholder="Repite tu contraseña"
                            className="formInputAuth" 
                            {...register("password_confirmation", {
                              required: "Repetir contraseña es obligatorio",
                              validate: value => value === password || 'Las contraseñas no coinciden'
                            })}
                          />
                          {errors.password_confirmation && (
                            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                          )}
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="w-full py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer" 
                        >
                          Registrarme
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-400">
                    ¿Ya tienes una cuenta?{' '}
                    <Link 
                      to="/auth/login" 
                      className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Inicia Sesión
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}