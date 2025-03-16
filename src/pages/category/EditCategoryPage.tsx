import React, { useEffect, useState } from 'react';
import { useGetCategoryByIdQuery, useUpdateCategoryMutation } from '../../services/categoriesApi.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { ICategoryEdit } from "../../types/Category.ts";
import { Accept, useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { faArrowLeft, faDownLong, faPaperclip, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_ENV } from '../../env/index.ts';

const EditCategoryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Отримуємо ID категорії з URL

    const [categoryUpdated, setCategoryUpdated] = useState<ICategoryEdit>({
        id: 0,
        name: '',
        description: '',
        imageFile: null
    });
    const { data: categoryData, isLoading: isLoadingCategory, error: getCategoryError } = useGetCategoryByIdQuery(id!); 
    const [updateCategory, { isLoading, error }] = useUpdateCategoryMutation();

    const [isHovered, setIsHovered] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (categoryData) { 
            setCategoryUpdated({
                id: categoryData.id,
                name: categoryData.name,
                description: categoryData.description ?? '',
            });
        }
    }, [categoryData]);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!categoryUpdated.imageFile) {
                // @ts-ignore
                delete categoryUpdated.imageFile;
            }
            await updateCategory(categoryUpdated).unwrap();
            navigate('..');
        } catch (err) {
            console.error('Error updating category:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategoryUpdated((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleFileChange = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setCategoryUpdated((prevCategory) => ({
                ...prevCategory,
                imageFile: file,
            }));
        }
    };

    const accept: Accept = {
        'image/*': []
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: accept,
    });

    const handleImageClick = () => {
        setCategoryUpdated((prevCategory) => ({
            ...prevCategory,
            imageFile: null,
        }));
    };

    if (isLoadingCategory) return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    );
    if (getCategoryError) return (
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
        <motion.div
            className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <button
                onClick={() => navigate('/categories')}
                className="bg-gray-500 text-white p-2 rounded mt-4 flex items-center justify-center"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Categories
            </button>

            <h1 className="text-2xl font-bold text-center mb-6">Edit Category</h1>
            <form onSubmit={handleSubmit}>
                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <label className="block text-gray-700" htmlFor="name">
                        Category Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={categoryUpdated.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        required
                    />
                </motion.div>

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <label className="block text-gray-700" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={categoryUpdated.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded mt-2"
                        rows={4}
                    />
                </motion.div>

                <motion.div
                    className="mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <label className="block text-gray-700" htmlFor="imageFile">
                        Category Image
                    </label>
                    {categoryUpdated.imageFile ? (
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer ${isHovered ? 'border-red-500' : ''}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleImageClick}
                        >
                            <img
                                src={URL.createObjectURL(categoryUpdated.imageFile)}
                                alt="Preview"
                                className={`mt-2 max-h-64 object-contain ${isHovered ? 'animate-shake' : ''}`}
                            />
                        </div>
                    ) : categoryData?.image ? (
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer`}
                        >
                            <input {...getInputProps()} id="imageFile" name="imageFile" type="file" className="hidden" />
                            <img
                                src={`${APP_ENV.REMOTE_BASE_URL}/images/large/${categoryData.image}`} // Використовуємо `categoryData.image` для формування шляху
                                alt={`${categoryData.name}`}
                                className="max-h-64 object-contain"
                            />
                        </div>
                    ) : (
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer`}
                        >
                            <input {...getInputProps()} id="imageFile" name="imageFile" type="file" className="hidden" />
                            <FontAwesomeIcon icon={isDragActive ? faDownLong : faPaperclip} size="3x" />
                            <p>{isDragActive ? 'Drop the image here' : 'Drag and drop or click to upload an image'}</p>
                        </div>
                    )}
                </motion.div>

                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-500 text-white p-2 rounded w-full md:w-1/2 mt-4 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </motion.div>

                {error && <p className="text-red-500 mt-2">Error updating category!</p>}
            </form>
        </motion.div>
    );
};

export default EditCategoryPage;
