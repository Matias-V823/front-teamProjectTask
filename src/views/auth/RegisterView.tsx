import { useForm } from "react-hook-form";
import type { UserRegistrationForm, UserRole, DeveloperStrength } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/api/AuthApi";
import { toast } from "react-toastify";
import { TECHNOLOGIES } from "@/utils/technologies";
import { Combobox, Transition } from '@headlessui/react'
import { Fragment, useMemo, useState } from 'react'

const roles: UserRole[] = ['Scrum Master','Product Owner','Scrum Team']
const strengthsOptions: { label: string; value: DeveloperStrength }[] = [
  { label: 'Frontend', value: 'frontend' },
  { label: 'Backend', value: 'backend' },
  { label: 'Base de datos', value: 'database' },
  { label: 'Testing', value: 'testing' }
]

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'Scrum Team',
    developerProfile: {
      yearsExperience: 0,
      technologies: [],
      strengths: []
    }
  } as any

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const password = watch('password');
  const role = watch('role');
  // Technologies multiselect state 
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [techQuery, setTechQuery] = useState('')
  const filteredTechs = useMemo(() => {
    const q = techQuery.trim().toLowerCase()
    if (!q) return TECHNOLOGIES
    return TECHNOLOGIES.filter(t => t.name.toLowerCase().includes(q))
  }, [techQuery])

  const { mutate } = useMutation({
    mutationFn: createAccount,
    onSuccess: (data) => {
      toast.success(data?.message)
      reset()
      setSelectedTechs([])
      setTechQuery('')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleRegister = (formData: UserRegistrationForm) => {
    const payload: any = { ...formData }
    if (payload.role === 'Scrum Team') {
      const techField = (payload.developerProfile?.technologies ?? []) as any
      if (Array.isArray(techField)) {
        const mapped = techField.map((val: string) => {
          const found = TECHNOLOGIES.find(t => t.id === val)
          return found ? found.name : String(val)
        })
        payload.developerProfile.technologies = mapped
      }
    } else {
      delete payload.developerProfile
    }
    mutate(payload)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[600px]">
          <div className="flex flex-col h-full">
            <div className="bg-white h-full flex items-center justify-center rounded-l-lg border border-gray-200 border-r-0">
              <img
                src="/img/ilustration.png"
                alt="Registro"
                className="w-full min-h-full object-cover rounded-l-lg"
              />
            </div>
          </div>
          <div className="flex flex-col h-full">
            <div className="bg-white border border-gray-200 rounded-r-lg shadow-xl overflow-hidden h-full">
              <div className="p-1 bg-white h-full">
                <div className="bg-white p-8 h-full flex flex-col justify-center">
                  <form onSubmit={handleSubmit(handleRegister)} noValidate>
                    <div className="space-y-4">
                      <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-xl font-bold text-gray-600">Crea tu cuenta</h1>
                        <p className="text-xs text-gray-400">Completa el formulario para comenzar</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="formLabelAuth" htmlFor="name">Nombre</label>
                          <input id="name" type="text" placeholder="Tu nombre completo" className="formInputAuth" {...register("name", { required: "El Nombre de usuario es obligatorio" })} />
                          {errors.name && (<ErrorMessage>{errors.name.message}</ErrorMessage>)}
                        </div>

                        <div className="space-y-2">
                          <label className="formLabelAuth" htmlFor="email">Email</label>
                          <input id="email" type="email" placeholder="tu@email.com" className="formInputAuth" {...register("email", { required: "El Email de registro es obligatorio", pattern: { value: /\S+@\S+\.\S+/, message: "E-mail no válido" } })} />
                          {errors.email && (<ErrorMessage>{errors.email.message}</ErrorMessage>)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="password" className="formLabelAuth">Contraseña</label>
                          <input id="password" type="password" placeholder="Mínimo 8 caracteres" className="formInputAuth" {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 8, message: 'La contraseña debe ser mínimo de 8 caracteres' } })} />
                          {errors.password && (<ErrorMessage>{errors.password.message}</ErrorMessage>)}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password_confirmation" className="formLabelAuth">Repetir Contraseña</label>
                          <input id="password_confirmation" type="password" placeholder="Repite tu contraseña" className="formInputAuth" {...register("password_confirmation", { required: "Repetir contraseña es obligatorio", validate: value => value === password || 'Las contraseñas no coinciden' })} />
                          {errors.password_confirmation && (<ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="formLabelAuth" htmlFor="role">Rol</label>
                          <select id="role" className="formInputAuth" {...register('role')} defaultValue={initialValues.role}>
                            {roles.map(r => (<option key={r} value={r}>{r}</option>))}
                          </select>
                        </div>

                        {role === 'Scrum Team' && (
                          <div className="space-y-2">
                            <label className="formLabelAuth" htmlFor="yearsExperience">Años de experiencia</label>
                            <input id="yearsExperience" type="number" min={0} className="formInputAuth" {...register('developerProfile.yearsExperience', { valueAsNumber: true, min: { value: 0, message: 'Debe ser >= 0' } })} />
                            {errors.developerProfile?.yearsExperience && (<ErrorMessage>{errors.developerProfile.yearsExperience.message as any}</ErrorMessage>)}
                          </div>
                        )}
                      </div>

                      {role === 'Scrum Team' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="formLabelAuth" htmlFor="technologies">Tecnologías</label>
                            <Combobox
                              value={selectedTechs}
                              onChange={(vals: string[]) => {
                                setSelectedTechs(vals)
                                setValue('developerProfile.technologies', vals, { shouldValidate: true })
                              }}
                              multiple
                            >
                              <div className="relative">
                                <div className="relative w-full">
                                  <Combobox.Input
                                    id="technologies"
                                    className="formInputAuth"
                                    placeholder="Buscar y seleccionar tecnologías"
                                    onChange={(event) => setTechQuery(event.target.value)}
                                    displayValue={() => ''}
                                  />
                                </div>
                                <Transition
                                  as={Fragment}
                                  leave="transition ease-in duration-100"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-gray-200 z-10">
                                    {filteredTechs.length === 0 && techQuery !== '' ? (
                                      <div className="relative cursor-default select-none py-2 px-4 text-gray-500">
                                        Sin resultados
                                      </div>
                                    ) : (
                                      filteredTechs.map((t) => (
                                        <Combobox.Option
                                          key={t.id}
                                          value={t.id}
                                          className={({ active, selected }) => `relative cursor-pointer select-none py-2 pl-3 pr-8 ${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} ${selected ? 'font-medium' : ''}`}
                                        >
                                          {({ selected }) => (
                                            <>
                                              <span className="block truncate">{t.name}</span>
                                              {selected ? (
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">✓</span>
                                              ) : null}
                                            </>
                                          )}
                                        </Combobox.Option>
                                      ))
                                    )}
                                  </Combobox.Options>
                                </Transition>
                              </div>
                            </Combobox>
                            {selectedTechs.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {selectedTechs.map(id => {
                                  const tech = TECHNOLOGIES.find(t => t.id === id)
                                  return (
                                    <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700 border border-indigo-200">
                                      {tech?.name || id}
                                    </span>
                                  )
                                })}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="formLabelAuth">Fortalezas</label>
                            <div className="grid grid-cols-2 gap-2">
                              {strengthsOptions.map(opt => (
                                <label key={opt.value} className="inline-flex items-center gap-2 text-sm text-gray-600">
                                  <input type="checkbox" value={opt.value} className="h-4 w-4 text-indigo-600 border-gray-300 bg-white rounded" {...register('developerProfile.strengths')} />
                                  {opt.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <button type="submit" className="w-full py-2 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer">Registrarme</button>
                      </div>
                    </div>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/auth/login" className="font-medium text-indigo-500 hover:text-indigo-600">Inicia Sesión</Link>
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