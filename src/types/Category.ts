export interface Category {
    id: number;
    name: string;
    description: string;
    image: string;
    creationTime: string;
}

export interface ICategoryCreate {
    name: string;
    description: string;
    imageFile: File | null;
}

export interface ICategoryEdit extends ICategoryCreate {
    id: number;
}