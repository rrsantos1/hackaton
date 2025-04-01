import { IUser } from "../interfaces/User.interface";
import { IUserRepository } from "../interfaces/UserRepository.interface";

export class UpdateUser {
    constructor(readonly userRepository: IUserRepository) {}
    async handler(user: IUser) {
      return this.userRepository.update(user)
    }
}