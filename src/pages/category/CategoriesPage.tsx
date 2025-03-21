import React, { useState } from 'react';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDeleteCategoryMutation, useGetAllCategoriesQuery } from '../../services/categoriesApi.ts';
import { APP_ENV } from "../../env";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const CategoriesPage: React.FC = () => {
    const { data: categories, error, isLoading } = useGetAllCategoriesQuery();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isOnCreateHover, setOnCreateHover] = useState<boolean>(false);

    const openDeleteModal = (id: number) => {
        setCategoryToDelete(id);
        setOpenModal(true);
    };

    const handleDelete = async () => {
        if (categoryToDelete) {
            try {
                await deleteCategory(categoryToDelete).unwrap();
            } catch (err) {
                console.error('Error deleting category:', err);
            }
        }
        closeDeleteModal();
    };

    const closeDeleteModal = () => {
        setOpenModal(false);
        setCategoryToDelete(null);
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="border-t-4 border-blue-600 border-solid w-16 h-16 rounded-full animate-spin"></div>
        </div>
    ); 
    if (error) return (
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
        <>
            <h1 className="text-4xl text-center font-bold text-blue-700 p-6">
                Categories
            </h1>
            <div className="flex justify-start mb-6">
                <Link to="create"
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    onMouseEnter={() => setOnCreateHover(true)}
                    onMouseLeave={() => setOnCreateHover(false)}
                >
                    <FontAwesomeIcon icon={faPlus} className={`${isOnCreateHover ? 'animate-rotate' : ''}`} /> Create category
                </Link>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Id</Table.HeadCell>
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Image</Table.HeadCell>
                        <Table.HeadCell>Description</Table.HeadCell>
                        <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {categories?.map((category, index) => (
                            <motion.tr
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                            >
                                <Table.Cell>{category.id}</Table.Cell>
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                </Table.Cell>
                                <Table.Cell className='min-w-32 justify-items-center'>
                                    <img
                                        src={APP_ENV.REMOTE_IMAGES_URL + 'medium/' + category.image}
                                        alt={category.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </Table.Cell>
                                <Table.Cell>{category.description}</Table.Cell>
                                <Table.Cell>
                                    <div className="flex">
                                        <Link to={`edit/${category.id}`}>
                                            <FontAwesomeIcon icon={faPenToSquare} size='1x' className='mr-1 text-gray-500' />
                                        </Link>
                                        <a href='#'>
                                            <div onClick={() => openDeleteModal(category.id)} className="mx-1 h-6 w-6 text-red-800">
                                                <FontAwesomeIcon icon={faTrash} size='1x' />
                                            </div>
                                        </a>
                                    </div>
                                </Table.Cell>
                            </motion.tr>
                        ))}
                    </Table.Body>
                </Table>
            </div>

            <Modal dismissible show={openModal} size="md" onClose={() => closeDeleteModal()} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this category?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => handleDelete()} disabled={isDeleting}>
                                {isDeleting ? "Deleting..." : "Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => closeDeleteModal()}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CategoriesPage;
