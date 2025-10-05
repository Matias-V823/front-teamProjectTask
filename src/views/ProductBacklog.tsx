import ModalAddBacklog from '@/components/projects/productBacklog/ModalAddBacklog';
import { useMemo, useState } from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router';

interface Story {
  id: number;
  persona: string;
  objetivo: string;
  beneficio: string;
  title: string;
  estimate: number;
  acceptanceCriteria: string;
  order: number;
}

const buildTitle = (persona: string, objetivo: string, beneficio: string) =>
  `Como ${persona}, yo quiero ${objetivo} de modo que ${beneficio}`;

const ProductBacklog = () => {
  const [backlogItems, setBacklogItems] = useState<Story[]>([
    {
      id: 1,
      persona: 'Cliente',
      objetivo: 'visualizar el catálogo de ítems vendidos',
      beneficio: 'pueda ordenar un ítem',
      title: buildTitle('Cliente', 'visualizar el catálogo de ítems vendidos', 'pueda ordenar un ítem'),
      estimate: 8,
      acceptanceCriteria:
        '- Se listan ítems con nombre, precio y stock\n- Se puede ver detalle de un ítem\n- Se puede añadir al carrito y confirmar orden',
      order: 1,
    },
    {
      id: 2,
      persona: 'Usuario registrado',
      objetivo: 'iniciar sesión de forma segura',
      beneficio: 'pueda acceder a mis datos y pedidos',
      title: buildTitle('Usuario registrado', 'iniciar sesión de forma segura', 'pueda acceder a mis datos y pedidos'),
      estimate: 5,
      acceptanceCriteria:
        '- Login por email/contraseña\n- Feedback de error en credenciales inválidas\n- Cierre de sesión',
      order: 2,
    },
    {
      id: 3,
      persona: 'Usuario',
      objetivo: 'usar la aplicación en dispositivos móviles',
      beneficio: 'tenga una experiencia adecuada en pantallas pequeñas',
      title: buildTitle('Usuario', 'usar la aplicación en dispositivos móviles', 'tenga una experiencia adecuada en pantallas pequeñas'),
      estimate: 13,
      acceptanceCriteria:
        '- Layout responsive en móviles y tablets\n- Menú accesible y legible\n- Contenido no se desborda',
      order: 3,
    },
  ]);

  const navigate = useNavigate();

  const [newStory, setNewStory] = useState({
    persona: '',
    objetivo: '',
    beneficio: '',
    estimate: 0,
    acceptanceCriteria: '',
  });

  const [isAdding, setIsAdding] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    persona: '',
    objetivo: '',
    beneficio: '',
    estimate: 0,
    acceptanceCriteria: '',
  });

  const [draggedId, setDraggedId] = useState<number | null>(null);

  const orderedItems = useMemo(
    () => [...backlogItems].sort((a, b) => a.order - b.order),
    [backlogItems]
  );

  const validateStoryStructure = (persona: string, objetivo: string, beneficio: string) =>
    persona.trim() !== '' && objetivo.trim() !== '' && beneficio.trim() !== '';

  const addStory = () => {
    if (!validateStoryStructure(newStory.persona, newStory.objetivo, newStory.beneficio)) return;
    const nextId = backlogItems.length > 0 ? Math.max(...backlogItems.map(i => i.id)) + 1 : 1;
    const nextOrder = backlogItems.length + 1;
    const story: Story = {
      id: nextId,
      persona: newStory.persona.trim(),
      objetivo: newStory.objetivo.trim(),
      beneficio: newStory.beneficio.trim(),
      title: buildTitle(newStory.persona.trim(), newStory.objetivo.trim(), newStory.beneficio.trim()),
      estimate: Number.isFinite(newStory.estimate) ? newStory.estimate : 0,
      acceptanceCriteria: newStory.acceptanceCriteria,
      order: nextOrder,
    };
    setBacklogItems(prev => [...prev, story]);
    setNewStory({
      persona: '',
      objetivo: '',
      beneficio: '',
      estimate: 0,
      acceptanceCriteria: '',
    });
    setIsAdding(false);
  };

  const deleteItem = (id: number) => {
    const remaining = backlogItems.filter(i => i.id !== id).sort((a, b) => a.order - b.order);
    const reindexed = remaining.map((it, idx) => ({ ...it, order: idx + 1 }));
    setBacklogItems(reindexed);
    if (expandedItem === id) setExpandedItem(null);
    if (editingId === id) setEditingId(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const reorderByDrag = (fromId: number, toId: number) => {
    const items = [...orderedItems];
    const fromIdx = items.findIndex(i => i.id === fromId);
    const toIdx = items.findIndex(i => i.id === toId);
    if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return;
    const [moved] = items.splice(fromIdx, 1);
    items.splice(toIdx, 0, moved);
    const reindexed = items.map((it, idx) => ({ ...it, order: idx + 1 }));
    setBacklogItems(reindexed);
  };

  const moveByStep = (id: number, direction: 'up' | 'down') => {
    const items = [...orderedItems];
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [items[idx], items[swapIdx]] = [items[swapIdx], items[idx]];
    const reindexed = items.map((it, i) => ({ ...it, order: i + 1 }));
    setBacklogItems(reindexed);
  };

  const startEdit = (story: Story) => {
    setEditingId(story.id);
    setExpandedItem(story.id);
    setEditForm({
      persona: story.persona,
      objetivo: story.objetivo,
      beneficio: story.beneficio,
      estimate: story.estimate,
      acceptanceCriteria: story.acceptanceCriteria,
    });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = (id: number) => {
    if (!validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio)) return;
    setBacklogItems(prev =>
      prev.map(i =>
        i.id === id
          ? {
              ...i,
              persona: editForm.persona.trim(),
              objetivo: editForm.objetivo.trim(),
              beneficio: editForm.beneficio.trim(),
              title: buildTitle(editForm.persona.trim(), editForm.objetivo.trim(), editForm.beneficio.trim()),
              estimate: Number.isFinite(editForm.estimate) ? editForm.estimate : 0,
              acceptanceCriteria: editForm.acceptanceCriteria,
            }
          : i
      )
    );
    setEditingId(null);
  };

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
                <div className="text-2xl font-bold text-gray-600">{backlogItems.length}</div>
                <div className="text-sm text-gray-500">Total de historias</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {backlogItems.reduce((total, i) => total + (Number.isFinite(i.estimate) ? i.estimate : 0), 0)}
                </div>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No hay historias en el backlog.</p>
              </div>
            ) : (
              orderedItems.map(item => (
                <div key={item.id} className="border-t border-gray-200">
                  <div className="grid grid-cols-12 gap-4 p-4 items-center bg-white hover:bg-gray-50 transition-colors">
                    <div className="col-span-1 flex items-center gap-2">
                      <div className="flex flex-col">
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => moveByStep(item.id, 'up')}
                          title="Subir prioridad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => moveByStep(item.id, 'down')}
                          title="Bajar prioridad"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4-4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <span className="font-medium text-gray-500 w-6 text-center">{item.order}</span>

                      <div
                        draggable
                        onDragStart={() => setDraggedId(item.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedId && draggedId !== item.id) reorderByDrag(draggedId, item.id);
                          setDraggedId(null);
                        }}
                        onDragEnd={() => setDraggedId(null)}
                        title="Arrastrar para reordenar"
                        className="cursor-grab text-gray-400 hover:text-gray-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 6a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2zm6-10a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2zm0 5a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </div>
                    </div>

                    <div
                      className="col-span-5 font-normal text-gray-600 cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                      title="Ver detalles"
                    >
                      {item.title}
                    </div>

                    <div
                      className="col-span-4 text-gray-600 cursor-pointer"
                      onClick={() => toggleExpand(item.id)}
                      title="Ver detalles"
                    >
                      {item.objetivo}
                    </div>

                    <div className="col-span-1">
                      {item.estimate > 0 ? (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                          {item.estimate}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>

                    <div className="col-span-1 flex justify-center gap-2">
                      {editingId === item.id ? (
                        <button
                          className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                          onClick={cancelEdit}
                          title="Cancelar edición"
                        >
                          ✕
                        </button>
                      ) : (
                        <button
                          className="text-gray-400 hover:text-indigo-600 p-1 cursor-pointer"
                          onClick={() => startEdit(item)}
                          title="Editar historia"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828L7 16.828l-4 1 1-4 9.586-9.586z" />
                          </svg>
                        </button>
                      )}
                      <button
                        className="text-red-500 hover:text-red-600 p-1 cursor-pointer"	
                        onClick={() => deleteItem(item.id)}
                        title="Eliminar historia"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-600 p-1"
                        onClick={() => toggleExpand(item.id)}
                        title={expandedItem === item.id ? 'Contraer detalles' : 'Expandir detalles'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedItem === item.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedItem === item.id && (
                    <div className=" p-5 border-t border-gray-300">
                      {editingId === item.id ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Como (Persona/Rol):</label>
                            <input
                              type="text"
                              value={editForm.persona}
                              onChange={(e) => setEditForm({ ...editForm, persona: e.target.value })}
                              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Yo quiero (Objetivo):</label>
                            <input
                              type="text"
                              value={editForm.objetivo}
                              onChange={(e) => setEditForm({ ...editForm, objetivo: e.target.value })}
                              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">De modo que (Beneficio):</label>
                            <input
                              type="text"
                              value={editForm.beneficio}
                              onChange={(e) => setEditForm({ ...editForm, beneficio: e.target.value })}
                              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estimación (puntos):</label>
                            <input
                              type="number"
                              value={editForm.estimate}
                              onChange={(e) =>
                                setEditForm({ ...editForm, estimate: Number.parseInt(e.target.value) || 0 })
                              }
                              min={0}
                              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Criterios de aceptación:</label>
                            <textarea
                              value={editForm.acceptanceCriteria}
                              onChange={(e) => setEditForm({ ...editForm, acceptanceCriteria: e.target.value })}
                              rows={3}
                              className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div className="md:col-span-2 flex justify-end gap-3">
                            <button
                              className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-md transition-colors"
                              onClick={cancelEdit}
                            >
                              Cancelar
                            </button>
                            <button
                              className={`px-4 py-2 rounded-md transition-colors text-white ${validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio)
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-indigo-300 cursor-not-allowed'
                                }`}
                              onClick={() => saveEdit(item.id)}
                              disabled={!validateStoryStructure(editForm.persona, editForm.objetivo, editForm.beneficio)}
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">Historia (estructura):</h4>
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
              ))
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
  );
};

export default ProductBacklog;