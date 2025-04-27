export interface IUserRegisterRequest {
    username: string;
    password: string;
    avatar: File | null;
}

export interface IUserLoginRequest {
    username: string;
    password: string;
}

export interface LoginButtonProps {
    onLogin: (token: string) => void;
    title: string;
    icon?: React.ReactNode;
}

export interface UserGoogleAuthDto {
    token: string;
}