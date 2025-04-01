import { EntityManager } from "typeorm";
import { UserRepository } from "../../repositories/UserRepository";
import { CreateUserUseCase } from "../create-user";

export function makeCreateUser(transactionalEntityManager: EntityManager) {
  const userRepository = new UserRepository(transactionalEntityManager);
  const createUserUseCase = new CreateUserUseCase(userRepository);
  return createUserUseCase;
}