export interface Product {
    id: number;
    name: string;
    description?: string;
    dateCreated: string;
    price: number;
    amount: number;
    categoryId: number;
    categoryName: string;
    images: string[];
}

export interface IProductCreate {
    name: string;
    description: string;
    price: number;
    amount: number;
    categoryId: number;
    imageFiles?: File[] | null;
}

export interface IProductEdit extends IProductCreate {
    id: number;
}