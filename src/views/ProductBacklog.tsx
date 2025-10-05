import ModalAddBacklog from '@/components/projects/productBacklog/ModalAddBacklog'
import { useMemo, useState } from 'react'
import { FiArrowLeft, FiPlus, FiChevronUp, FiChevronDown, FiEdit, FiTrash2, FiX, FiMoreVertical } from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router'
import {
  type ProductBacklogItem,
  type NewBacklogItemForm
} from '@/types'
import {
  getProductBacklog,
  createBacklogItem,
  updateBacklogItem,
  deleteBacklogItem,
  reorderBacklog
} from '@/api/ProducBacklogApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

const buildTitle = (persona: string, objetivo: string, beneficio: string) =>
  `Como ${persona}, yo quiero ${objetivo} de modo que ${beneficio}`

const ProductBacklog = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ['productBacklog', { projectId }],
    queryFn: () => getProductBacklog(projectId!),
    enabled: !!projectId
  })

  const [newStory, setNewStory] = useState<NewBacklogItemForm>({
    persona: '',
    objetivo: '',
    beneficio: '',
    estimate: 0,
    acceptanceCriteria: ''
  })

  const [isAdding, setIsAdding] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<NewBacklogItemForm>({
    persona: '',
    objetivo: '',
    beneficio: '',
    estimate: 0,
    acceptanceCriteria: ''
  })
  const [localItems, setLocalItems] = useState<ProductBacklogItem[] | null>(null)
  const workingItems = localItems ?? items

  const orderedItems = useMemo(
    () => [...workingItems].sort((a, b) => a.order - b.order),
    [workingItems]
  )

  const validateStoryStructure = (persona: string, objetivo: string, beneficio: string) =>
    persona.trim() !== '' && objetivo.trim() !== '' && beneficio.trim() !== ''

  const createMutation = useMutation({
    mutationFn: (form: NewBacklogItemForm) => createBacklogItem(projectId!, form),
    onSuccess: () => {
      toast.success('Historia creada')
      queryClient.invalidateQueries({ queryKey: ['productBacklog', { projectId }] })
      setIsAdding(false)
      setNewStory({ persona: '', objetivo: '', beneficio: '', estimate: 0, acceptanceCriteria: '' })
    },
    onError: (e: any) => toast.error(e.message)
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string, form: NewBacklogItemForm }) =>
      updateBacklogItem(projectId!, id, form),
    onSuccess: () => {
      toast.success('Historia actualizada')
      queryClient.invalidateQueries({ queryKey: ['productBacklog', { projectId }] })
      setEditingId(null)
    },
    onError: (e: any) => toast.error(e.message)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBacklogItem(projectId!, id),
    onSuccess: () => {
      toast.success('Historia eliminada')
      queryClient.invalidateQueries({ queryKey: ['productBacklog', { projectId }] })
    },
    onError: (e: any) => toast.error(e.message)
  })

  const reorderMutation = useMutation({
    mutationFn: (ids: string[]) => reorderBacklog(projectId!, ids),
    onError: (e: any) => {
      toast.error(e.message)
      queryClient.invalidateQueries({ queryKey: ['productBacklog', { projectId }] })
    },
    onSuccess: (data) => {
      setLocalItems(null)
      queryClient.setQueryData(['productBacklog', { projectId }], data)
    }
  })

  /* Actions */
  const addStory = () => {
    if (!validateStoryStructure(newStory.persona, newStory.objetivo, newStory.beneficio)) return
    createMutation.mutate(newStory)
  }

  const startEdit = (story: ProductBacklogItem) => {
    setEditingId(story._id)
    setExpandedId(story._id)
    setEditForm({
      persona: story.persona,
      objetivo: story.objetivo,
      beneficio: story.beneficio,
      estimate: story.estimate,
      acceptanceCriteria: story.acceptanceCriteria
    })
  }

  const saveEdit = (id: string) => {
    if (!validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio)) return
    updateMutation.mutate({ id, form: editForm })
  }

  const cancelEdit = () => setEditingId(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const deleteItem = (id: string) => {
    deleteMutation.mutate(id)
  }

  const applyLocalOrder = (list: ProductBacklogItem[]) => {
    const reindexed = list.map((it, idx) => ({ ...it, order: idx + 1 }))
    setLocalItems(reindexed)
    reorderMutation.mutate(reindexed.map(i => i._id))
  }

  const moveByStep = (id: string, dir: 'up' | 'down') => {
    const itemsArr = [...orderedItems]
    const idx = itemsArr.findIndex(i => i._id === id)
    if (idx === -1) return
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === itemsArr.length - 1) return
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[itemsArr[idx], itemsArr[swap]] = [itemsArr[swap], itemsArr[idx]]
    applyLocalOrder(itemsArr)
  }

  const reorderByDrag = (fromId: string, toId: string) => {
    const itemsArr = [...orderedItems]
    const fromIdx = itemsArr.findIndex(i => i._id === fromId)
    const toIdx = itemsArr.findIndex(i => i._id === toId)
    if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return
    const [moved] = itemsArr.splice(fromIdx, 1)
    itemsArr.splice(toIdx, 0, moved)
    applyLocalOrder(itemsArr)
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Cargando Product Backlog...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Error al cargar el Product Backlog
      </div>
    )
  }

  const totalPoints = orderedItems.reduce((t, i) => t + (Number.isFinite(i.estimate) ? i.estimate : 0), 0)

  return (
    <div className="min-h-screen bg-gray-50 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-10 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span className="font-medium">Volver atrás</span>
              </button>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-800 mb-1">Product Backlog</h1>
            <p className="text-lg font-normal text-gray-500">
              Registra aquí las historias de usuario y gestiona su prioridad.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-600">{orderedItems.length}</div>
                <div className="text-sm text-gray-500">Total de historias</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-600">{totalPoints}</div>
                <div className="text-sm text-gray-500">Puntos totales</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
              onClick={() => setIsAdding(true)}
            >
              <FiPlus />
              Agregar Historia de Usuario
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-100 text-gray-700 font-semibold text-sm">
            <div className="col-span-1">Orden</div>
            <div className="col-span-5">Título</div>
            <div className="col-span-4">Resumen</div>
            <div className="col-span-1">Puntos</div>
            <div className="col-span-1 text-center">Acciones</div>
          </div>

          {orderedItems.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p>No hay historias en el backlog.</p>
            </div>
          ) : (
            orderedItems.map(item => {
              const isEditing = editingId === item._id
              const expanded = expandedId === item._id
              return (
                <div key={item._id} className="border-t border-gray-200">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 flex items-center gap-2">
                      <div className="flex flex-col">
                        <button
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
                          onClick={() => moveByStep(item._id, 'up')}
                          title="Subir prioridad"
                          disabled={reorderMutation.isPending}
                        >
                          <FiChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
                          onClick={() => moveByStep(item._id, 'down')}
                          title="Bajar prioridad"
                          disabled={reorderMutation.isPending}
                        >
                          <FiChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="font-medium text-gray-500 w-6 text-center">{item.order}</span>
                      <div
                        draggable
                        onDragStart={() => setExpandedId(item._id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (expandedId && expandedId !== item._id) reorderByDrag(expandedId, item._id)
                          setExpandedId(null)
                        }}
                        onDragEnd={() => setExpandedId(null)}
                        className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing disabled:opacity-40"
                        title="Arrastrar para reordenar"
                      >
                        <FiMoreVertical className="w-5 h-5" />
                      </div>
                    </div>

                    <div
                      className="col-span-5 font-normal text-gray-600 cursor-pointer"
                      onClick={() => toggleExpand(item._id)}
                    >
                      {item.title}
                    </div>
                    <div
                      className="col-span-4 text-gray-600 cursor-pointer"
                      onClick={() => toggleExpand(item._id)}
                    >
                      {item.objetivo}
                    </div>
                    <div className="col-span-1">
                      {item.estimate > 0 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                          {item.estimate}
                        </span>
                      ) : <span className="text-gray-400">-</span>}
                    </div>
                    <div className="col-span-1 flex justify-center gap-2">
                      {isEditing ? (
                        <button
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                          onClick={cancelEdit}
                          title="Cancelar edición"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      ) : (
                        <button
                          className="text-gray-400 hover:text-indigo-600 p-1"
                          onClick={() => startEdit(item)}
                          title="Editar historia"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-600 p-1 disabled:opacity-40 cursor-pointer"
                        onClick={() => deleteItem(item._id)}
                        title="Eliminar historia"
                        disabled={deleteMutation.isPending}
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                        onClick={() => toggleExpand(item._id)}
                        title={expanded ? 'Contraer' : 'Expandir'}
                      >
                        {expanded ? (
                          <FiChevronUp className="w-5 h-5" />
                        ) : (
                          <FiChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="p-5 border-t border-gray-300">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editForm.persona}
                            onChange={e => setEditForm(f => ({ ...f, persona: e.target.value }))}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Persona"
                          />
                          <input
                            type="text"
                            value={editForm.objetivo}
                            onChange={e => setEditForm(f => ({ ...f, objetivo: e.target.value }))}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Objetivo"
                          />
                          <input
                            type="text"
                            value={editForm.beneficio}
                            onChange={e => setEditForm(f => ({ ...f, beneficio: e.target.value }))}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Beneficio"
                          />
                          <input
                            type="number"
                            value={editForm.estimate}
                            onChange={e => setEditForm(f => ({ ...f, estimate: Number.parseInt(e.target.value) || 0 }))}
                            className="bg-white border border-gray-300 rounded-md px-3 py-2"
                            min={0}
                          />
                          <div className="md:col-span-2">
                            <textarea
                              value={editForm.acceptanceCriteria}
                              onChange={e => setEditForm(f => ({ ...f, acceptanceCriteria: e.target.value }))}
                              rows={3}
                              className="bg-white border border-gray-300 rounded-md px-3 py-2 w-full"
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end gap-3">
                            <button
                              className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-md inline-flex items-center gap-1 cursor-pointer"
                              onClick={cancelEdit}
                            >
                              <FiX className="w-4 h-4" /> Cancelar
                            </button>
                            <button
                              className={`px-4 py-2 rounded-md text-white ${validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio)
                                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                                : 'bg-indigo-300 cursor-not-allowed'
                                }`}
                              disabled={!validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio) || updateMutation.isPending}
                              onClick={() => saveEdit(item._id)}
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Historia:</h4>
                            <p className="text-gray-600">{item.title}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Resumen:</h4>
                            <p className="text-gray-600">{item.objetivo}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Criterios de aceptación:</h4>
                            <pre className="text-gray-600 whitespace-pre-wrap">{item.acceptanceCriteria || '—'}</pre>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Estimación:</h4>
                            <p className="text-gray-600">{item.estimate} puntos</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <ModalAddBacklog
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        newStory={newStory}
        setNewStory={setNewStory}
        onAdd={addStory}
        validate={validateStoryStructure}
        buildTitle={buildTitle}
      />
    </div>
  )
}

export default ProductBacklog