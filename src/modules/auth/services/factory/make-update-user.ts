import { UserRepository } from "../../repositories/UserRepository";
import { UpdateUser } from "../update-user";

export function makeUpdateUser() {
    const userRepository = new UserRepository();
    const updateUserUseCase = new UpdateUser(userRepository);
    return updateUserUseCase;
}