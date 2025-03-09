import React, { useState } from 'react';
import { useCreateCategoryMutation } from '../../services/categoriesApi.ts';
import { useNavigate } from 'react-router-dom';
import { ICategoryCreate } from "../../types/Category.ts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faArrowLeft, faPaperclip, faDownLong } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { Accept, useDropzone } from 'react-dropzone';

const CreateCategoryPage: React.FC = () => {
    const [category, setCategory] = useState<ICategoryCreate>({
        name: '',
        description: '',
        imageFile: null,
    });
    const [isHovered, setIsHovered] = useState(false);

    const [createCategory, { isLoading, error }] = useCreateCategoryMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!category.imageFile) {
                // @ts-ignore
                delete category.imageFile;
            }
            await createCategory(category).unwrap();
            navigate('..');
        } catch (err) {
            console.error('Error creating category:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCategory((prevCategory) => ({
            ...prevCategory,
            [name]: value,
        }));
    };

    const handleFileChange = (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setCategory((prevCategory) => ({
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
        setCategory((prevCategory) => ({
            ...prevCategory,
            imageFile: null,
        }));
    };

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

            <h1 className="text-2xl font-bold text-center mb-6">Create Category</h1>
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
                        value={category.name}
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
                        value={category.description}
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
                    {category.imageFile ? (
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer ${isHovered ? 'border-red-500' : ''}`}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={handleImageClick}
                        >
                            <img
                                src={URL.createObjectURL(category.imageFile)}
                                alt="Preview"
                                className={`mt-2 max-h-64 object-contain ${isHovered ? 'animate-shake' : ''}`}
                            />
                        </div>
                    ) : (
                        <div
                            {...getRootProps()}
                            className={`flex items-center justify-center border-2 ${isDragActive ? 'border-dashed border-blue-300 bg-blue-100' : 'border-dashed border-gray-300'} rounded mt-2 p-6 cursor-pointer`}
                        >
                            <input {...getInputProps()} id="imageFile" name="imageFile" type="file" className="hidden" />
                            <FontAwesomeIcon icon={isDragActive ? faDownLong : faPaperclip} size="3x" className={`${isDragActive ? 'text-blue-500' : 'text-gray-500'}`} />
                            <p className={`ml-2 ${isDragActive ? 'text-blue-500' : 'text-gray-500'}`}>{isDragActive ? 'Drop the image here' : 'Drag and drop or click to upload an image'}</p>
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
                                Creating...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Create Category
                            </>
                        )}
                    </button>
                </motion.div>

                {error && <p className="text-red-500 mt-2">Error creating category!</p>}
            </form>
        </motion.div>
    );
};

export default CreateCategoryPage;
