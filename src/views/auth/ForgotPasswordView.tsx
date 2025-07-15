import { useForm } from "react-hook-form";
import { Link } from "react-router";
import ErrorMessage from "@/components/ErrorMessage";
import type { ForgotPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/AuthApi";
import { toast } from 'react-toastify'

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: ''
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  
  const {mutate} = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) =>{
      toast.success(data.message)
      reset()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleForgotPassword = (formData: ForgotPasswordForm) => mutate(formData)

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-3">
          Recuperar Contraseña
        </h1>
        <p className="text-gray-300">
          Ingresa tu email para recibir {''}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-400 font-medium">
            instrucciones de recuperación
          </span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
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
          value="Enviar Instrucciones"
          className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/20 cursor-pointer"
        />
      </form>

      <nav className="mt-8 flex flex-col space-y-3 text-center">
        <Link
          to="/auth/login"
          className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fuchsia-300 hover:to-purple-300 transition-all duration-300"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>
        <Link
          to="/auth/register"
          className="text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-fuchsia-300 hover:to-purple-300 transition-all duration-300"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </div>
  )
}