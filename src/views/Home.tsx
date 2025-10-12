import { useQuery } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { getProjects } from '@/api/ProjectApi'
import { getAllMetrics, type ProjectMetrics } from '@/api/MetricsApi'

const Home = () => {
  const navigate = useNavigate()
  const { data: user } = useAuth()
  const { data: projects, isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects, retry: false })
  const { data: metrics } = useQuery({ queryKey: ['metrics'], queryFn: getAllMetrics, retry: false })

  const firstName = user?.name?.split(' ')?.[0] ?? 'Bienvenido'
  const truncate = (t?: string, n = 120) => (t && t.length > n ? t.slice(0, n) + '…' : t || '')

  const totals = (() => {
    const list = metrics?.projects ?? []
    const sum = <K extends keyof ProjectMetrics['tasks']>(k: K) => list.reduce((a, p) => a + (p.tasks[k] || 0), 0)
    return {
      projects: list.length,
      sprints: list.reduce((a, p) => a + p.sprints.total, 0),
      tasks: list.reduce((a, p) => a + p.tasks.total, 0),
      completed: sum('completed'),
      pending: sum('pending')
    }
  })()

  return (
    <div className="min-h-[70vh]">
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-2xl p-8 shadow">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Hola, {firstName} 👋</h1>
        <p className="text-indigo-100">Explora y gestiona tus proyectos desde un solo lugar.</p>
        <div className="mt-4 flex gap-3">
          <Link to="/projects/create" className="bg-white text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Crear Proyecto
          </Link>
          <Link to="/projects" className="bg-indigo-500/30 hover:bg-indigo-500/40 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors border border-white/20">
            Ver todos
          </Link>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Proyectos</p>
          <p className="text-2xl font-bold text-gray-800">{totals.projects || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Sprints</p>
          <p className="text-2xl font-bold text-gray-800">{totals.sprints || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Tareas</p>
          <p className="text-2xl font-bold text-gray-800">{totals.tasks || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Completadas</p>
          <p className="text-2xl font-bold text-gray-800">{totals.completed || 0}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tus Proyectos</h2>
          <Link to="/projects/create" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            + Nuevo
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="loader">
              <div className="loader-circle"></div>
              <div className="loader-circle"></div>
              <div className="loader-circle"></div>
              <div className="loader-circle"></div>
            </div>
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => {
              const m = metrics?.projects.find(pm => pm.projectId === p._id)
              const progress = m?.tasks.progress ?? 0
              const overdue = m?.tasks.overdueInSprint ?? 0
              const teamSize = m?.teamSize ?? 0
              return (
                <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-800 mb-1">{p.projectName}</h3>
                    <p className="text-xs text-gray-500 mb-2">Cliente: <span className="font-medium text-gray-700">{p.clientName}</span></p>
                    <p className="text-sm text-gray-600">{truncate(p.description)}</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span><span>{progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">Equipo: {teamSize} • Vencidas en sprint: {overdue}</div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium cursor-pointer"
                      onClick={() => navigate(`/projects/${p._id}/view`)}
                    >
                      Ver detalle
                    </button>
                    <Link
                      to={`/projects/${p._id}/view/backlog`}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Backlog
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-600 mb-3">Aún no tienes proyectos creados.</p>
            <Link to="/projects/create" className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Crear tu primer proyecto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
export default Home