import { IUser } from "../interfaces/User.interface";
import { UserRepository } from "../repositories/UserRepository";

export class CreateUserUseCase {
    constructor(readonly userRepository: UserRepository) {}

    async handler(user: IUser): Promise<IUser | undefined> {
        return this.userRepository.create(user)
    }
}