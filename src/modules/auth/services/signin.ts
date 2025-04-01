import { IUserRepository } from "../interfaces/UserRepository.interface";

export class SigninUseCase {
    constructor(private readonly userRepository: IUserRepository) {}
        
    async handler (email: string) {
        const user = await this.userRepository.findByEmail(email); 
        return user
    }    
}