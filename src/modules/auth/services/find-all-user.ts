import { IUserRepository } from "../interfaces/UserRepository.interface";

export class FindAllUser {
    constructor(readonly userRepository: IUserRepository) {}

    async handler(page: number, limit: number) {
        return this.userRepository.findAllUser(page, limit)
    }
}