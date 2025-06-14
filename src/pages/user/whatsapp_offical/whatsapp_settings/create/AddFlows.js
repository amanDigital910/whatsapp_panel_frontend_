/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    Background,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
    Controls,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DeleteButton } from '../../../../../assets';

const BaseNode = ({ data, id, type, onRemove, onChange }) => {
    const form = data.form || {};
    const buttons = form.buttons || [];

    // Ensure at least one list item exists on mount for 'list' type
    useEffect(() => {
        if (type === 'list' && (!form.items || form.items.length === 0)) {
            onChange(id, {
                ...form,
                items: [{ itemName: '', itemDescription: '' }],
            });
        }
    }, [type, form, id, onChange]);

    const handleChange = (field, value) => {
        onChange(id, { ...form, [field]: value });
    };

    const handleAddListItem = () => {
        const currentItems = form.items || [];
        onChange(id, {
            ...form,
            items: [...currentItems, { itemName: '', itemDescription: '' }],
        });
    };

    const handleListItemChange = (index, field, value) => {
        const updatedItems = [...(form.items || [])];
        updatedItems[index][field] = value;
        onChange(id, {
            ...form,
            items: updatedItems,
        });
    };

    const handleRemoveListItem = (index) => {
        const updatedItems = [...(form.items || [])];
        updatedItems.splice(index, 1);
        onChange(id, {
            ...form,
            items: updatedItems,
        });
    };

    const handleRemoveButton = (buttonIndex) => {
        const updatedButtons = buttons.filter((_, idx) => idx !== buttonIndex);
        onChange(id, { ...form, buttons: updatedButtons });
    };


    const handleAddButton = () => {
        if (buttons.length < 3) {
            const updatedButtons = [...buttons, { text: '' }];
            onChange(id, { ...form, buttons: updatedButtons });
        }
    };

    const handleFileChange = (e) => {
        handleChange("file", e.target.files[0]);
    };

    return (
        <div className="rounded border border-blue-900 p-1 shadow bg-white w-[250px] relative text-xs">
            <div className="bg-blue-900 text-white text-center py-1.5 rounded text-[16px] font-semibold">
                {data.label}
            </div>

            {id !== 'start_node' && (
                <button
                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full w-6 h-6 text-[10px] flex items-center justify-center"
                    onClick={() => onRemove(id)}
                >
                    <DeleteButton />
                </button>
            )}

            {id !== 'start_node' && (
                <Handle type="target" position={Position.Top} className="w-6 h-6 !bg-green-600" style={{ height: '12px', width: '12px' }} />
            )}
            <Handle type="source" position={Position.Bottom} className="w-6 h-6 !bg-green-600" style={{ height: '12px', width: '12px' }} />

            <div className="mt-1 text-gray-700 flex flex-col gap-1">
                {type === 'answer' &&
                    <div className="bg-white border border-gray-300 rounded-md shadow-md w-48 p-2">
                        <div className="font-semibold text-sm text-gray-800 mb-1">Choose type:</div>
                        <select
                            value={form.answer}
                            onChange={(e) => handleChange("answer", e.target.value)}
                            className="w-full border border-gray-400 rounded px-2 py-1 text-sm focus:outline-none"
                        >
                            <option value="">-- Select --</option>
                            <option value="text">Text</option>
                            <option value="media">Media</option>
                            <option value="any">Any Type</option>
                        </select>
                    </div>
                }

                {type === 'list' ? (
                    <div className="flex flex-col gap-2">
                        <input
                            placeholder="Add header (Optional)"
                            className="border p-1 text-[16px]"
                            value={form.header || ''}
                            onChange={(e) => handleChange("header", e.target.value)}
                        />
                        <textarea
                            placeholder="Add body"
                            className="border p-1 text-[16px] min-h-14"
                            rows={2}
                            value={form.body || ''}
                            onChange={(e) => handleChange("body", e.target.value)}
                        />
                        <input
                            placeholder="Add footer (Optional)"
                            className="border p-1 text-[16px]"
                            value={form.footer || ''}
                            onChange={(e) => handleChange("footer", e.target.value)}
                        />
                        <input
                            placeholder="Button name"
                            className="border p-1 text-[16px]"
                            value={form.button || ''}
                            onChange={(e) => handleChange("button", e.target.value)}
                        />

                        {(form.items || []).map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col relative border p-1 mb-1 rounded gap-2"
                            >
                                {index !== 0 && (
                                    <button
                                        onClick={() => handleRemoveListItem(index)}
                                        className="absolute top-0 right-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700"
                                        title="Remove item"
                                    >
                                        <DeleteButton />
                                    </button>
                                )}

                                <input
                                    placeholder="Item Name"
                                    className="border p-1 text-[16px]"
                                    value={item.itemName}
                                    onChange={(e) =>
                                        handleListItemChange(index, 'itemName', e.target.value)
                                    }
                                />
                                <input
                                    placeholder="Item Description (optional)"
                                    className="border p-1 text-[16px]"
                                    value={item.itemDescription}
                                    onChange={(e) =>
                                        handleListItemChange(index, 'itemDescription', e.target.value)
                                    }
                                />
                            </div>
                        ))}

                        <button
                            onClick={handleAddListItem}
                            className="mt-1 bg-teal-600 text-white text-[16px] px-2 py-1 rounded"
                        >
                            Add Item
                        </button>
                    </div>
                ) : (
                    <>
                        {(type === 'image' || type === 'video' || type === 'document') && (
                            <div className="flex items-center gap-2 border border-gray-500 p-1 rounded-md">
                                <label
                                    htmlFor={`file_${id}`}
                                    className="text-[16px] font-bold text-white cursor-pointer bg-blue-700 py-1 px-3 rounded-xl"
                                >
                                    Upload File
                                </label>
                                <input
                                    id={`file_${id}`}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <span className="text-[16px] text-black">
                                    {form.file?.name
                                        ? `${form.file.name.slice(0, 8)}...${form.file.name.slice(-5)}`
                                        : 'Select any File'}
                                </span>
                            </div>
                        )}

                        {id !== 'start_node' && type !== 'answer' && (
                            <div>
                                <textarea
                                    placeholder="Enter text..."
                                    className="w-full border p-1 text-[16px] min-h-20"
                                    rows={2}
                                    value={form.text || ''}
                                    onChange={(e) => handleChange("text", e.target.value)}
                                />
                            </div>
                        )}

                        {buttons.length > 0 && (
                            <div className="mt-1 flex flex-col gap-1">
                                {buttons.map((btn, idx) => (
                                    <div className='flex flex-row w-full gap-2 items-center'>
                                        <button
                                            onClick={() => handleRemoveButton(idx)}
                                            className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700"
                                            title="Remove item"
                                        >
                                            <DeleteButton />
                                        </button>
                                        <input
                                            key={idx}
                                            type="text"
                                            value={btn.text || `Button ${idx + 1}`}
                                            className="text-[16px] border px-2 py-1 rounded bg-gray-100 text-gray-700 w-full"
                                            placeholder={`Button ${idx + 1}`}
                                            onChange={(e) => {
                                                const updatedButtons = [...buttons];
                                                updatedButtons[idx].text = e.target.value;
                                                onChange(id, { ...form, buttons: updatedButtons });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {(id !== 'start_node' && type !== 'answer') && (
                            <button
                                onClick={handleAddButton}
                                className="mt-1 bg-teal-600 text-white text-[16px] px-2 py-1 rounded"
                            >
                                Add Button
                            </button>
                        )}


                    </>
                )}
            </div>
        </div>
    );
};

const createNodeTypes = (removeNode, updateNodeForm) => useMemo(() => ({
    message: (props) => <BaseNode {...props} type="message" onRemove={removeNode} onChange={updateNodeForm} />,
    list: (props) => <BaseNode {...props} type="list" onRemove={removeNode} onChange={updateNodeForm} />,
    image: (props) => <BaseNode {...props} type="image" onRemove={removeNode} onChange={updateNodeForm} />,
    video: (props) => <BaseNode {...props} type="video" onRemove={removeNode} onChange={updateNodeForm} />,
    document: (props) => <BaseNode {...props} type="document" onRemove={removeNode} onChange={updateNodeForm} />,
    answer: (props) => <BaseNode {...props} type="answer" onRemove={removeNode} onChange={updateNodeForm} />,
}), [removeNode, updateNodeForm]);

const AddFlows = () => {
    const idRef = useRef(1);
    const getId = () => `node_${idRef.current++}`;

    const initialNodes = [
        {
            id: 'start_node',
            type: 'message',
            data: { label: 'Start', form: {} },
            position: { x: 0, y: 0 },
            draggable: true,
        },
    ];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const updateNodeForm = useCallback((id, form) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === id ? { ...node, data: { ...node.data, form } } : node
            )
        );
    }, [setNodes]);

    const removeNode = useCallback((id) => {
        setNodes((nds) => nds.filter((node) => node.id !== id));
        setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    }, [setNodes, setEdges]);

    const nodeTypes = createNodeTypes(removeNode, updateNodeForm);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const addNode = (type) => {
        const newNode = {
            id: getId(),
            type,
            position: {
                x: Math.random() * 50,
                y: Math.random() * 100,
            },
            data: { label: type.charAt(0).toUpperCase() + type.slice(1), form: {} },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const getOrderedNodeData = (nodes, edges) => {
        const visited = new Set();
        const orderedData = [];
        const graph = {};
        edges.forEach(({ source, target }) => {
            if (!graph[source]) graph[source] = [];
            graph[source].push(target);
        });
        const traverse = (currentId) => {
            if (visited.has(currentId)) return;
            visited.add(currentId);
            const node = nodes.find((n) => n.id === currentId);
            if (node && node.id !== 'start_node') {
                orderedData.push({
                    nodeId: node.id,
                    type: node.type,
                    form: node.data.form,
                });
            }
            (graph[currentId] || []).forEach(traverse);
        };
        traverse('start_node');
        return orderedData;
    };

    const handleCollectData = () => {
        const orderedData = getOrderedNodeData(nodes, edges);
        const formData = new FormData();
        orderedData.forEach((node, index) => {
            formData.append(`nodes[${index}][id]`, node.nodeId);
            formData.append(`nodes[${index}][type]`, node.type);
            formData.append(`nodes[${index}][text]`, node.form?.text || '');

            if (node.form?.file) {
                formData.append(`nodes[${index}][file]`, node.form.file);
            }

            if (node.form?.buttons?.length) {
                node.form.buttons.forEach((btn, btnIdx) => {
                    formData.append(`nodes[${index}][buttons][${btnIdx}]`, btn.text);
                });
            }
            if (node.type === 'answer') {
                formData.append(`nodes[${index}][answer]`, node.form?.answer || '');
            }
        });

        console.log('Ordered Flow Form Data:', orderedData);
    };

    return (
        <section className="w-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">
            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to="/whatsapp-settings/flows">
                        <h1 className="text-2xl pl-4 text-black font-semibold hover:underline underline-offset-4">
                            Manage Flows
                        </h1>
                    </Link>
                    <h1 className="text-2xl text-black font-semibold">&nbsp;&gt;&nbsp;Add New Flow</h1>
                </div>
            </div>

            <div className="px-3">
                <div className="mt-3 py-3 px-6 bg-gray-300 border-2 rounded">
                    <div className="p-1 border-b-2 border-white pb-2 flex gap-2 flex-wrap">
                        {['message', 'list', 'image', 'video', 'document', 'answer'].map((type) => (
                            <button
                                key={type}
                                onClick={() => addNode(type)}
                                className="px-3 py-1 bg-blue-900 text-white rounded shadow text-sm capitalize"
                            >
                                {type}
                            </button>
                        ))}
                        <button
                            onClick={handleCollectData}
                            className="ml-auto px-3 py-1 bg-green-700 text-white rounded shadow text-sm"
                        >
                            Save Data
                        </button>
                    </div>
                    <ReactFlowProvider>
                        <div className="w-full h-[75vh] overflow-auto cursor-none border border-gray-400 mt-3 bg-white rounded">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                panOnDrag={false}
                                fitView={false}
                                zoomOnPinch={false}
                                panOnScroll={false}
                                panOnScrollMode={false}
                                panActivationKeyCode={false}
                                zoomOnScroll={false}
                                zoomOnDoubleClick={false}
                            >
                                <Background />
                                <Controls />
                            </ReactFlow>
                        </div>
                    </ReactFlowProvider>
                </div>
            </div>
        </section>
    );
};

export default AddFlows;
