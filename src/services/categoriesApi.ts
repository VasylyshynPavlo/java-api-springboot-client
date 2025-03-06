import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Category } from '../models/category';
import {APP_ENV} from "../env";
import { ICategoryCreate } from '../types/Category';
import { serialize } from 'object-to-formdata';

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    tagTypes: ["Category"],
    endpoints: (builder) => ({
        getAllCategories: builder.query<Category[], void>({
            query: () => 'categories',
            providesTags: ["Category"],
        }),

        getCategoryById: builder.query<Category, string>({
            query: (id) => `categories/${id}`,
            providesTags: ["Category"]
        }),

        createCategory: builder.mutation<Category, ICategoryCreate>({
            query: (model) => {
                try {
                    const formData = serialize(model);
                    for (let [key, value] of formData.entries()) {
                        console.log(`${key}:`, value);
                    }
                    
                    return {
                        url: 'categories',
                        method: 'POST',
                        body: formData,
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Category"],
        }),

        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `categories/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Category"]
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation
} = categoriesApi;
