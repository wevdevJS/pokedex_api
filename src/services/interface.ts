export interface CreateUserI {
    email: string;
    first_name: string;
    last_name: string;
    password?: string;
    id: string;
}


export interface LoginResponseI {
    token: string;
    id: string | undefined;
}

export interface ResponseMessageI {
    message: string
}
