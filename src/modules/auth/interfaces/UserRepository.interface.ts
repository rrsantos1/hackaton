import { IUser } from "../interfaces/User.interface";

export interface IUserRepository {
    create(user: IUser): Promise<IUser | undefined> 
    delete(id: number): Promise<void>
    update(user: IUser): Promise<IUser>   
    findUserById(id: number): Promise<IUser | null>  
    findAllUser(page: number, limit: number): Promise<IUser[] | undefined>
    findByEmail(email: string): Promise<IUser | null>
}