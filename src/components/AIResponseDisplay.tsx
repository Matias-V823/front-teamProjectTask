import React, { useState } from 'react'

interface POBacklogItem {
  id: number
  persona: string
  objetivo: string
  beneficio: string
  title: string
  estimate: number
  acceptanceCriteria: string[]
  order: number
}

interface SprintInfo {
  index: number
  startDate: string
  endDate: string
}

interface DevTask {
  descripcion: string
  responsable: string
  esfuerzo: number
}

interface DevBacklogItem {
  title: string
  sprint: SprintInfo
  tareas: DevTask[]
}

interface AgenteData {
  agente: string
  backlog: (POBacklogItem | DevBacklogItem)[]
}

interface AIResponseDisplayProps {
  data: {
    agentes: AgenteData[]
  }
  onApply: () => void
  onCancel: () => void
}

const AIResponseDisplay = ({ data, onApply, onCancel }: AIResponseDisplayProps) => {
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [selectedAgenteIndex, setSelectedAgenteIndex] = useState(0)

  const agentes = data?.agentes || []
  const agenteActual = agentes[selectedAgenteIndex]
  const backlog = agenteActual?.backlog || []

  const toggleRow = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  const isDeveloper = agenteActual?.agente.toLowerCase() === 'developer'

  if (agentes.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-8 bg-white">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay datos para mostrar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white">
      <div className="mb-6 flex gap-4">
        {agentes.map((a, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedAgenteIndex(index)
              setExpandedRows([])
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
              ${
                selectedAgenteIndex === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {a.agente}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Planificación Generada
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Agente: <span className="font-medium text-gray-700">{agenteActual?.agente}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Total: <span className="font-bold">{backlog.length}</span>
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">#</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Título / Historia
              </th>

              {!isDeveloper && (
                <>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Persona
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Objetivo
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Esfuerzo (pts)
                  </th>
                </>
              )}

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {backlog.map((item, index) => {
              const esPOItem = !isDeveloper && 'persona' in item
              const esDevItem = isDeveloper && 'tareas' in item

              return (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 align-top">
                    <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>

                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {item.title}
                    </td>

                    {esPOItem && (
                      <>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                          <p className="font-semibold">{(item as POBacklogItem).persona}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-md">
                          <p className="line-clamp-2">{(item as POBacklogItem).objetivo}</p>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800 font-semibold">
                            {(item as POBacklogItem).estimate}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleRow(index)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        {expandedRows.includes(index) ? 'Ocultar' : 'Ver'}
                      </button>
                    </td>
                  </tr>

                  {expandedRows.includes(index) && (
                    <tr className="bg-gray-50">
                      <td colSpan={isDeveloper ? 3 : 6} className="px-6 py-6">
                        {esPOItem && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Detalles de la Historia</h4>
                              <p className="text-sm text-gray-700">{`Como ${(item as POBacklogItem).persona}, quiero ${(item as POBacklogItem).objetivo} para ${(item as POBacklogItem).beneficio}`}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold mb-2">Criterios de Aceptación</h4>
                              <ul className="space-y-1 list-decimal list-inside">
                                {(item as POBacklogItem).acceptanceCriteria.map((c, idx) => (
                                  <li key={idx} className="text-sm text-gray-700">
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        {esDevItem && (
                          <>
                            <h4 className="text-sm font-semibold mb-3">Tareas</h4>
                            <ul className="list-disc pl-6 space-y-3">
                              {(item as DevBacklogItem).tareas.map((t, idx) => (
                                <li key={idx} className="text-sm text-gray-700">
                                  <p className="font-medium">{t.descripcion}</p>
                                  <p className="text-gray-500 text-xs">
                                    Responsable: {t.responsable} — Esfuerzo: {t.esfuerzo}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <button onClick={onCancel} className="px-6 py-3 border rounded-lg cursor-pointer">
          Cancelar
        </button>
        <button onClick={onApply} className="px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer">
          Aplicar Planificación
        </button>
      </div>
    </div>
  )
}

export default AIResponseDisplay
