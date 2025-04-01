import { UserRepository } from "../../repositories/UserRepository"
import { FindAllUser } from "../find-all-user"

export function makeFindAllUser() {
    const userRepository = new UserRepository()

    const findAllUserUseCase = new FindAllUser(userRepository)

    return findAllUserUseCase
}