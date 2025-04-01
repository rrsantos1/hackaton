import { EntityManager } from "typeorm";
import { ActivityRepository } from "../../repositories/ActivityRepository";
import { DeleteActivity } from "../delete-activity";

export function makeDeleteActivity(transactionalEntityManager: EntityManager) {
  const activityRepository = new ActivityRepository(transactionalEntityManager);
  const deleteActivityUseCase = new DeleteActivity(activityRepository);

  return deleteActivityUseCase;
}