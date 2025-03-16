import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_ENV } from "../env";
import { serialize } from "object-to-formdata";
import { IProductCreate, IProductEdit, Product } from "../types/Product";

export const productsApi = createApi({
    reducerPath: "productsApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/` }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getAllProducts: builder.query<Product[], void>({
            query: () => "products",
            providesTags: ["Product"],
        }),
        getProductById: builder.query<Product, string>({
            query: (id) => `products/${id}`,
            providesTags: ["Product"]
        }),
        createProduct: builder.mutation<Product, IProductCreate>({
            query: (model) => {
                try {
                    const formData = serialize(model);
                    return {
                        url: 'products',
                        method: 'POST',
                        body: formData
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Product"]   // Інвалідовуємо "Product" після створення
        }),
        UpdateProduct: builder.mutation<void, IProductEdit>({
            query: ({ id, ...model }) => {
                try {
                    const formData = serialize(model);
                    return {
                        url: `products/${id}`,
                        method: 'PUT',
                        body: formData
                    };
                } catch {
                    throw new Error("Error serializing the form data.");
                }
            },
            invalidatesTags: ["Product"]
        }),
        deleteProduct: builder.mutation<void, number>({
            query: (id) => ({
                url: `products/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["Product"]
        }),
    }),
    
});

export const { 
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useCreateProductMutation,
} = productsApi;