import { EntityManager } from "typeorm";
import { UserRepository } from "../../repositories/UserRepository";
import { DeleteUser } from "../delete-user";

export function makeDeleteUser(transactionalEntityManager: EntityManager) {
  const userRepository = new UserRepository(transactionalEntityManager);
  const deleteUserUseCase = new DeleteUser(userRepository);

  return deleteUserUseCase;
}