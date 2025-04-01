import { UserRepository } from "../../repositories/UserRepository"
import { SigninUseCase } from "../signin"

export function makeSignin() {
    const userRepository = new UserRepository()

    const signinUseCase = new SigninUseCase(userRepository)

    return signinUseCase
}