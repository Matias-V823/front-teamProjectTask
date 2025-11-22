import React, { useState } from 'react'

interface BacklogItem {
  id: number
  historia: string
  criterios_aceptacion: string[]
  prioridad: string
  esfuerzo_estimado: string
}

interface AgenteData {
  agente: string
  backlog: BacklogItem[]
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

  const toggleRow = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'baja':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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

      {/* Selector de agente */}
      <div className="mb-6 flex gap-4">
        {agentes.map((a, index) => (
          <button
            key={index}
            onClick={() => setSelectedAgenteIndex(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
              ${selectedAgenteIndex === index
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {a.agente}
          </button>
        ))}
      </div>

      {/* Encabezado */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
          Planificación Generada
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Agente: <span className="font-medium text-gray-700">{agenteActual?.agente}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Total de historias: <span className="font-bold">{backlog.length}</span>
        </p>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Historia</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Prioridad</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Esfuerzo</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {backlog.map(item => (
              <React.Fragment key={item.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">{item.id}</td>
                  <td className="px-6 py-4">{item.historia}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(item.prioridad)}`}>
                      {item.prioridad}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                      {item.esfuerzo_estimado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleRow(item.id)}
                      className="text-indigo-600 hover:text-indigo-700 text-sm"
                    >
                      {expandedRows.includes(item.id) ? 'Ocultar' : 'Ver'}
                    </button>
                  </td>
                </tr>

                {expandedRows.includes(item.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-6 py-6">
                      <h4 className="text-sm font-semibold mb-3">Criterios de Aceptación</h4>
                      <ul className="space-y-2">
                        {item.criterios_aceptacion.map((c, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            {idx + 1}. {c}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-8">
        <button onClick={onCancel} className="px-6 py-3 border rounded-lg">
          Cancelar
        </button>
        <button onClick={onApply} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
          Aplicar Planificación
        </button>
      </div>
    </div>
  )
}

export default AIResponseDisplay
