import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getReportMetrics } from '@/api/ReportsApi'
import { getProjects } from '@/api/ProjectApi'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, AreaChart, Area } from 'recharts'

const ProgressBar = ({ value }: { value: number }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
  </div>
)

const ReportsView = () => {
  const { data: projects, isLoading: loadingProjects, isError: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  })

  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  const enabled = !!selectedProjectId
  const { data, isLoading: loadingMetrics, isError } = useQuery({
    queryKey: ['report-metrics', selectedProjectId],
    queryFn: () => getReportMetrics(selectedProjectId),
    enabled
  })

  const backlogTotal = data?.backlogStatus.total ?? 0
  const completed = data?.backlogStatus.completed || 0
  const backlogProgress = backlogTotal > 0 ? Math.round((completed / backlogTotal) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reportes</h1>
          {enabled && data ? (
            <p className="text-sm text-gray-500">Equipo: {data.teamSize} | Tareas sin asignar: {data.unassignedTasks}</p>
          ) : (
            <p className="text-sm text-gray-500">Selecciona un proyecto para ver sus métricas</p>
          )}
        </div>
        <div className="w-full md:w-80">
          <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={loadingProjects || projectsError}
          >
            <option value="">-- Selecciona un proyecto --</option>
            {projects?.map((p) => (
              <option key={p._id} value={p._id}>{p.projectName}</option>
            ))}
          </select>
          {projectsError && (
            <p className="text-xs text-red-600 mt-1">No se pudieron cargar los proyectos.</p>
          )}
        </div>
      </div>

      {!enabled && (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-gray-600">Selecciona un proyecto para ver los reportes.</p>
        </div>
      )}

      {enabled && loadingMetrics && (
        <div className="flex justify-center items-center h-64">
          <div className="loader">
            <div className="loader-circle"></div>
            <div className="loader-circle"></div>
            <div className="loader-circle"></div>
            <div className="loader-circle"></div>
          </div>
        </div>
      )}

      {enabled && (isError || (enabled && !loadingMetrics && !data)) && (
        <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
          <p className="text-gray-600">No se pudieron cargar los reportes del proyecto.</p>
          <Link to="/projects" className="text-indigo-600 hover:underline">Volver a Mis Proyectos</Link>
        </div>
      )}

      {enabled && data && !loadingMetrics && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Progreso del Backlog</p>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{completed}/{backlogTotal} completadas</span>
                <span>{backlogProgress}%</span>
              </div>
              <ProgressBar value={backlogProgress} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Sprint Activo</p>
              {data.sprint.hasActive ? (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{data.sprint.name}</span>
                    <span>{data.sprint.progress}%</span>
                  </div>
                  <ProgressBar value={data.sprint.progress!} />
                  <p className="text-xs text-gray-500 mt-1">Tareas: {data.sprint.completed}/{data.sprint.totalTasks} • Días restantes: {data.sprint.daysRemaining} / {data.sprint.daysTotal}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hay sprint activo</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">Productividad (últimos 7 días)</p>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.throughput7d} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} hide/>
                    <YAxis tick={{ fontSize: 10 }} width={24}/>
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stroke="#4f46e5" fill="url(#colorProd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {data.sprint.hasActive && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Burn Down</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.sprint.burnDown} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="idealRemaining" name="Ideal" stroke="#9ca3af" strokeDasharray="4 4" dot={false} />
                      <Line type="monotone" dataKey="actualRemaining" name="Actual" stroke="#4f46e5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Burn Up</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.sprint.burnUp} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="idealCompleted" name="Ideal" stroke="#9ca3af" strokeDasharray="4 4" dot={false} />
                      <Line type="monotone" dataKey="actualCompleted" name="Actual" stroke="#10b981" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Distribución de estados</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              {['pending','onHold','inProgress','underReview','completed'].map(k => (
                <div key={k} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">{k}</p>
                  <p className="text-xl font-bold text-gray-800">{data.backlogStatus[k] || 0}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Progreso por miembro (Scrum Team)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.members.map(m => (
                <div key={m.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-800">{m.name}</p>
                    <span className="text-xs text-gray-500">{m.completionRate}%</span>
                  </div>
                  <ProgressBar value={m.completionRate} />
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mt-3">
                    <div>
                      <p className="text-gray-500">Total</p>
                      <p className="font-semibold">{m.totals.total}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">En curso</p>
                      <p className="font-semibold">{m.totals.inProgress}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Completadas</p>
                      <p className="font-semibold">{m.totals.completed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Revisión</p>
                      <p className="font-semibold">{m.totals.underReview}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Espera</p>
                      <p className="font-semibold">{m.totals.onHold}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Pendientes</p>
                      <p className="font-semibold">{m.totals.pending}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {data.lastCompletedSprint && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">Último Sprint Completado</h2>
              <p className="text-sm text-gray-600">{data.lastCompletedSprint.name} • {new Date(data.lastCompletedSprint.endDate).toLocaleDateString()} • Tareas sin finalizar: {data.lastCompletedSprint.unfinishedTasks}</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReportsView