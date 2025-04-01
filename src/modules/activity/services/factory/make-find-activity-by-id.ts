import { ActivityRepository } from "../../repositories/ActivityRepository"
import { FindActivityById } from "../find-activity-by-id"

export function makeFindActivityById() {
  const activityRepository = new ActivityRepository()
  const findActivityByIdUseCase = new FindActivityById(activityRepository)

  return findActivityByIdUseCase
}