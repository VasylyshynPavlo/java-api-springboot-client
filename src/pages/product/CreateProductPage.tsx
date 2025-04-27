import React, { useState } from 'react';
import { useCreateProductMutation } from "../../services/productsApi.ts";
import { useNavigate } from 'react-router-dom';
import { IProductCreate } from "../../types/Product.ts";
import { useGetAllCategoriesQuery } from "../../services/categoriesApi.ts";
import { Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { Accept, useDropzone } from 'react-dropzone';
import { faPaperclip, faDownLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateProductPage: React.FC = () => {
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
    const [createProduct, { isLoading, error }] = useCreateProductMutation();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm<IProductCreate>();

    const categoriesData = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    const onSubmit = async (values: IProductCreate) => {
        try {
            values.imageFiles = selectedFiles;
            await createProduct(values).unwrap();
            navigate('..');
        } catch (err) {
            console.error('Error creating product:', err);
        }
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(selectedFiles);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);
        setSelectedFiles(reorderedFiles);
    };

    const handleFileChange = (acceptedFiles: File[]) => {
        setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const accept: Accept = { 'image/*': [] };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileChange, accept });

    if (categoriesLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
    if (categoriesError) return (
        <div className="flex justify-center items-center h-screen flex-col">
            <div className="text-7xl font-bold text-white bg-blue-600 p-4 rounded mb-4">
                500
            </div>
            <div className="text-black text-xl font-bold p-4 rounded">
                Error occurred while fetching categories
            </div>
        </div>
    );

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-blue-700 mb-4">
                Back to Products
            </button>
            <h1 className="text-2xl font-bold text-center mb-6">Create Product</h1>
            <Form form={form} onFinish={onSubmit} layout="vertical">
                <Form.Item label="Name" name="name" rules={[{ required: true, message: "Required field!" }, { min: 3, message: "At least 3 characters!" }]}>
                    <Input autoComplete="name" className="w-full p-2 border border-gray-300 rounded mt-2" />
                </Form.Item>
                <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: "Required field!" }]}>
                    <Select placeholder="Select category" options={categoriesData} loading={categoriesLoading} />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: "Required field!" }]}>
                    <Input autoComplete="price" className="w-full p-2 border border-gray-300 rounded mt-2" />
                </Form.Item>
                <Form.Item label="Amount" name="amount" rules={[{ required: true, message: "Required field!" }]}>
                    <Input autoComplete="amount" className="w-full p-2 border border-gray-300 rounded mt-2" />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true, message: "Required field!" }]}>
                    <TextArea rows={4} placeholder="Enter description..." maxLength={200} allowClear />
                </Form.Item>
                <div {...getRootProps()} className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer`}>
                    <input {...getInputProps()} className="hidden" />
                    <FontAwesomeIcon icon={isDragActive ? faDownLong : faPaperclip} size="3x" className={isDragActive ? 'text-blue-500' : 'text-gray-500'} />
                    <p className={`ml-2 ${isDragActive ? 'text-blue-500' : 'text-gray-500'}`}>{isDragActive ? 'Drop the images here' : 'Drag and drop or click to upload images'}</p>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="upload-list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2 mt-4">
                                {selectedFiles.map((file, index) => (
                                    <Draggable key={file.name} draggableId={file.name} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <img 
                                                    src={URL.createObjectURL(file)} 
                                                    alt="Preview" 
                                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:border-2 hover:border-red-500 hover:border-dashed" 
                                                    onClick={() => removeImage(index)}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded w-full md:w-1/2 mt-4">
                    {isLoading ? 'Creating...' : 'Create Product'}
                </button>
                {error && <p className="text-red-500 mt-2">Error creating product!</p>}
            </Form>
        </div>
    );
};

export default CreateProductPage;
