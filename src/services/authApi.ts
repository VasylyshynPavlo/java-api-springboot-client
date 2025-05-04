import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APP_ENV } from "../env";
import { IUserLoginRequest, IUserRegisterRequest } from "../types/Auth.ts";
import { User } from "../models/user.ts";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${APP_ENV.REMOTE_BASE_URL}/api/auth`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["AuthUser"],
    endpoints: (builder) => ({
        registerUser: builder.mutation<{ token: string }, IUserRegisterRequest>({
            query: (userRegister) => {
                const formData = new FormData();
                formData.append("username", userRegister.username);
                formData.append("password", userRegister.password);
                if (userRegister.avatar) {
                    formData.append("avatar", userRegister.avatar);
                }
        
                return {
                    url: "register",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["AuthUser"],
        }),        
        loginUser: builder.mutation<{ token: string }, IUserLoginRequest>({
            query: (userLogin) => ({
                url: "login",
                method: "POST",
                body: userLogin,
            }),
            invalidatesTags: ["AuthUser"],
        }),
        googleLogin: builder.mutation<{ token: string }, { token: string }>({
            query: (googleToken) => ({
                url: "google",
                method: "POST",
                body: googleToken,
            }),
            transformResponse: (response: { Bearer: string }) => {
                // Для google ендпоінту повертається JSON з ключем "Bearer"
                return { token: response.Bearer };
            },
            invalidatesTags: ["AuthUser"],
        }),
        getUser: builder.query<User, string>({
            query: (username) => ({
                url: `user?username=${username}`, // Змінено email на username
                method: "GET",
            }),
            providesTags: ["AuthUser"],
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGoogleLoginMutation,
    useGetUserQuery,
} = authApi;