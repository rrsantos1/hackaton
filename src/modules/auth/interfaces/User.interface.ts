export interface IUser {
    id?: number;
    name: string;
    email: string;
    password: string;
    role?: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;    
}