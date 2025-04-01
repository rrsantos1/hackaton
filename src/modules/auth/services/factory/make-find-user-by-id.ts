import { UserRepository } from "../../repositories/UserRepository"
import { FindUserById } from "../find-user-by-id"

export function makeFindUserById() {
  const userRepository = new UserRepository()
  const findUserByIdUseCase = new FindUserById(userRepository)

  return findUserByIdUseCase
}