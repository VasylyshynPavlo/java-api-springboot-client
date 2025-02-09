import './App.css';

import { APP_ENV } from "./env";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { Table } from "flowbite-react";
import { useGetAllCategoriesQuery } from './services/apiCategory';
// import {Category} from "./types/Category.ts";


function App() {

    const { data: categories, error, isLoading } = useGetAllCategoriesQuery();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error occurred while fetching categories.</p>;
    // const [categories, setCategories] = useState<Category[]>([]);
    //
    // useEffect(() => {
    //     axios.get<Category[]>(`${APP_ENV.REMOTE_BASE_URL}/api/categories`)
    //         .then(resp => {
    //             console.log(resp.data);
    //             setCategories(resp.data);
    //         })
    //         .catch(err => {
    //             console.error("Error fetching categories:", err);
    //         });
    // }, []);

    return (
        <>
            {/* <h1 className="text-3xl font-bold underline mb-4">
                Категорії
            </h1>
            <Button color="purple" className="mb-4">Додати категорію</Button> */}

            <div className="overflow-x-auto">
                <Table>
                    <Table.Head>
                        <Table.HeadCell>Назва</Table.HeadCell>
                        <Table.HeadCell>Фото</Table.HeadCell>
                        <Table.HeadCell>Опис</Table.HeadCell>
                        <Table.HeadCell>Дії</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {categories?.map(category => (
                            <Table.Row key={category.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    {category.name}
                                </Table.Cell>
                                <Table.Cell>
                                    <img
                                        src={`${APP_ENV.REMOTE_BASE_URL}/images/${category.image}`}
                                        alt={category.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </Table.Cell>
                                <Table.Cell>{category.description}</Table.Cell>
                                <Table.Cell>
                                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                        Змінити
                                    </a>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </>
    );
}

export default App;
