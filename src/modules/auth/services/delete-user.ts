import { IUserRepository } from "../interfaces/UserRepository.interface";

export class DeleteUser {
  constructor(private userRepository: IUserRepository) {}

  async handler(userId: number): Promise<void> {    
    await this.userRepository.delete(userId);
  }
}