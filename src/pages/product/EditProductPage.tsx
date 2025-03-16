import React, { useEffect, useState } from 'react';
import { useUpdateProductMutation, useGetProductByIdQuery } from "../../services/productsApi.ts";
import { useNavigate, useParams } from 'react-router-dom';
import { IProductEdit } from "../../types/Product.ts";
import { useGetAllCategoriesQuery } from "../../services/categoriesApi.ts";
import { Form, Input, Select, Upload, UploadFile } from "antd";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { APP_ENV } from "../../env";

const EditProductPage: React.FC = () => {
    const { id } = useParams<string>();
    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useGetAllCategoriesQuery();
    const { data: product, isLoading: productLoading, error: productError } = useGetProductByIdQuery(id!);
    const [updateProduct, { isLoading, error }] = useUpdateProductMutation();
    const [selectedFiles, setSelectedFiles] = useState<UploadFile[]>([]);
    const navigate = useNavigate();
    const [form] = Form.useForm<IProductEdit>();



    const categoriesData = categories?.map(item => ({
        label: item.name,
        value: item.id,
    }));

    const onSubmit = async (values: IProductEdit) => {
        try {
            values.imageFiles = selectedFiles.length > 0 ? selectedFiles.map(x => x.originFileObj as File) : [];
            values.id = product!.id;
            await updateProduct(values).unwrap();
            navigate('..');
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };
    

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const reorderedFiles = Array.from(selectedFiles);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);
        setSelectedFiles(reorderedFiles);
    };

    const handleImageChange = (info: { fileList: UploadFile[] }) => {
        const newFiles = info.fileList
            .filter(file => !selectedFiles.some(existingFile => existingFile.uid === file.uid)) // перевірка на дублікати
            .map(file => {
                if (!file.url && !file.preview) {
                    file.preview = URL.createObjectURL(file.originFileObj as Blob);
                }
                return file;
            });
    
        setSelectedFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
    
            newFiles.forEach(newFile => {
                if (!updatedFiles.some(file => file.uid === newFile.uid)) {
                    updatedFiles.push(newFile);
                }
            });
    
            return updatedFiles;
        });
    };

    useEffect(() => {
        if (product) {
            form.setFieldsValue({ ...product });
            const files = product?.images.map(x => ({
                uid: x,
                url: `${APP_ENV.REMOTE_IMAGES_URL}medium/${x}`,
                originFileObj: new File([new Blob([''])], x, { type: 'old-image' })
            }) as UploadFile);
            setSelectedFiles(files);
        }
    }, [product]);

    if (categoriesLoading || productLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
    if (categoriesError || productError) return (
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
            <h1 className="text-2xl font-bold text-center mb-6">Edit Product</h1>
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

                <Upload
                    multiple
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={handleImageChange}
                    fileList={[]}
                    accept="image/*"
                >
                    <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Add Images</div>
                    </div>
                </Upload>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="upload-list" direction="horizontal">
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-wrap gap-2 mt-4">
                                {selectedFiles.map((file, index) => (
                                    <Draggable key={file.uid} draggableId={file.uid} index={index}>
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <img
                                                    src={file.url || file.preview}
                                                    alt="Preview"
                                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:border-2 hover:border-red-500 hover:border-dashed"
                                                    onClick={() => setSelectedFiles(selectedFiles.filter(f => f.uid !== file.uid))}
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



                {/* Submit button */}
                <div className="flex justify-center">
                    <button type="submit" disabled={isLoading} className="bg-blue-500 text-white p-2 rounded w-full md:w-1/2 mt-4">
                        {isLoading ? 'Saving...' : 'Update Product'}
                    </button>
                </div>

                {error && <p className="text-red-500 mt-2">Error updating product!</p>}
            </Form>
        </div>
    );
};

export default EditProductPage;
