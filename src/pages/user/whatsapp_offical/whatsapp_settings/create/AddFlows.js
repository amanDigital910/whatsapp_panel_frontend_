import React, { useCallback } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
// import MessageNode from './nodes/MessageNode';
// import ImageNode from './nodes/ImageNode';
import { Link } from 'react-router-dom'


const AddFlows = () => {
    const nodeTypes = {
        message: VideoNode,
        image: ImageNode,
        // Add more: list, video, document, etc.
    };
    let id = 0;
    const getId = () => `node_${id++}`;

    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: getId(),
            type: 'message',
            data: { label: 'Start' },
            position: { x: 100, y: 50 },
        },
    ]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const addNode = (type) => {
        setNodes((nds) => [
            ...nds,
            {
                id: getId(),
                type,
                position: { x: Math.random() * 250 + 100, y: Math.random() * 250 },
                data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
            },
        ]);
    };


    return (
        <section className="w-full bg-gray-200 flex flex-col min-h-[calc(100vh-70px)] pb-3">

            <div className="px-3 mt-8">
                <div className="w-full py-2 bg-white rounded-lg flex">
                    <Link className="no-underline" to={"/whatsapp-settings/flows"}>
                        <h1 className="text-2xl ss:text-xl md:text-xl text-start pl-4 md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0 hover:underline underline-offset-4">
                            Manage Flows
                        </h1>
                    </Link>
                    <h1 className="text-2xl ss:text-xl md:text-xl text-start md:pl-0 md:flex justify-center text-black font-semibold py-0 m-0">
                        &nbsp;&gt;&nbsp;Add New Flow
                    </h1>
                </div>
            </div>
            <div className="mt-3 py-3 px-6 bg-white w-full ">
                <ReactFlowProvider>
                    <div className="w-full h-screen flex flex-col">
                        <div className="p-3 border-b flex gap-3">
                            {['message', 'list', 'image', 'video', 'document', 'answer'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => addNode(type)}
                                    className="px-3 py-1 bg-blue-900 text-white rounded shadow text-sm capitalize"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1">
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                nodeTypes={nodeTypes}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                fitView
                            >
                                <Background />
                                <MiniMap />
                                <Controls />
                            </ReactFlow>
                        </div>
                    </div>
                </ReactFlowProvider>
                {/*     <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4 ">
                        <label htmlFor="username" className="block text-lg font-medium text-black">
                            Username
                        </label>
                        <input
                            type="text"
                            className="mt-1 block w-full border-2 text-lg border-black rounded-md p-2"
                            id="username"
                            name="username"
                            maxLength={15}
                            minLength={5}
                            placeholder="Ex. (vikram)"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </form>
                */}
            </div>
        </section>
    )
}

export default AddFlows


const ImageNode = ({ data }) => {
    return (
        <div className="border rounded shadow bg-white p-2 w-64">
            <div className="bg-blue-800 text-white text-sm px-2 py-1 rounded-t">Image</div>
            <input type="file" accept="image/*" className="mt-2 text-sm" />
            <textarea
                placeholder="Enter text..."
                className="w-full border p-1 rounded text-sm mt-2"
            />
            <div className="space-y-2 mt-2">
                <button className="w-full bg-cyan-400 rounded py-1 text-sm">Button 1</button>
                <button className="w-full bg-green-600 text-white rounded py-1 text-sm">Add Button</button>
            </div>
        </div>
    );
};
const VideoNode = ({ data }) => {
    return (
        <div className="border rounded shadow bg-white p-2 w-64 flex flex-col">
            <div className="bg-blue-800 text-white text-sm px-2 py-1 rounded-t">Video</div>
            <input type="file" accept="video/*" className="mt-2 text-sm" />
            <textarea
                placeholder="Enter description..."
                className="w-full border p-1 rounded text-sm mt-2"
            />
            <div className="space-y-2 mt-2 flex flex-col">
                <button className="w-full bg-cyan-400 rounded py-1 text-sm">Play</button>
                <button className="w-full bg-green-600 text-white rounded py-1 text-sm">Add Button</button>
            </div>
        </div>
    );
};

