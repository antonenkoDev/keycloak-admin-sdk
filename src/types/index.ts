export interface User {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    enabled: boolean;
}

export interface CreateUserInput {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
}

export interface UpdateUserInput {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
}
