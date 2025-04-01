import { ResourceNotFoundError } from "../../../shared/errors/resource-not-found-error";
import { IUser } from "../interfaces/User.interface";
import { IUserRepository } from "../interfaces/UserRepository.interface";

export class FindUserById {
    constructor(readonly userRepository: IUserRepository) {}

    async handler(id: number): Promise<IUser | undefined> {
        const user = await this.userRepository.findUserById(id);

        if (!user) {
            throw new ResourceNotFoundError();
        }
        
        return user ?? undefined;
    }
}