import { EntityManager } from "typeorm";
import { ActivityRepository } from "../../repositories/ActivityRepository";
import { CreateActivityUseCase } from "../create-activity";

export function makeCreateActivity(transactionalEntityManager?: EntityManager) {
  const activityRepository = new ActivityRepository(transactionalEntityManager);
  const createActivityUseCase = new CreateActivityUseCase(activityRepository);
  return createActivityUseCase;
}