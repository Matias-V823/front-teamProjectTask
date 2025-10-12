import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addTechnology, getProfile, removeTechnology, updateProfile } from '@/api/ProfileApi'
import { TECHNOLOGIES } from '@/utils/technologies'
import { toast } from 'react-toastify'

const Profile = () => {
  const queryClient = useQueryClient()
  const { data: user, isLoading } = useQuery({ queryKey: ['profile'], queryFn: getProfile, retry: false })

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Perfil actualizado')
    },
    onError: (e: any) => toast.error(e.message || 'Error al actualizar')
  })

  const { mutate: mutateAddTech, isPending: addingTech } = useMutation({
    mutationFn: addTechnology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (e: any) => toast.error(e.message || 'Error al agregar tecnología')
  })

  const { mutate: mutateRemoveTech } = useMutation({
    mutationFn: removeTechnology,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar tecnología')
  })

  const handleAddTechnology = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const tech = (formData.get('technology') as string) || ''
    if (!tech) return
    mutateAddTech(tech)
    e.currentTarget.reset()
  }

  if (isLoading || !user) return (
    <div className="flex justify-center items-center h-screen">
      <div className="loader">
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
        <div className="loader-circle"></div>
      </div>
    </div>
  )

  const isScrumTeam = user.role === 'Scrum Team'
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="relative bg-gradient-to-r z-10 from-indigo-600 to-blue-500 h-40 sm:h-48 rounded-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="absolute -bottom-10 flex items-end gap-4">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-700">{initials}</span>
              </div>
            </div>
            <div className="pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">{user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Experiencia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Años de experiencia</label>
                <input
                  type="number"
                  defaultValue={user.developerProfile?.yearsExperience ?? 0}
                  min={0}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onBlur={(e) => {
                    const value = parseInt(e.target.value || '0', 10)
                    mutateUpdate({ yearsExperience: isNaN(value) ? 0 : value })
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tecnologías</h2>
              {isScrumTeam && (
                <form onSubmit={handleAddTechnology} className="flex items-center gap-2">
                  <select name="technology" className="border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
                    {TECHNOLOGIES.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                  <button type="submit" disabled={addingTech} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm">
                    Agregar
                  </button>
                </form>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {(user.developerProfile?.technologies ?? []).map(t => (
                <span key={t} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {t}
                  {isScrumTeam && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => mutateRemoveTech(t)}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {(!user.developerProfile?.technologies || user.developerProfile.technologies.length === 0) && (
                <span className="text-sm text-gray-500">Aún no agregas tecnologías</span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Información</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Rol</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Preferencias</h3>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              defaultValue={user.name}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              onBlur={(e) => mutateUpdate({ name: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile