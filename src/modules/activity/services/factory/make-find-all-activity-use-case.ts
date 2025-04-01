import { ActivityRepository } from "../../repositories/ActivityRepository"
import { FindAllActivity } from "../find-all-activity"

export function makeFindAllActivity() {
    const activityRepository = new ActivityRepository()

    const findAllActivityUseCase = new FindAllActivity(activityRepository)

    return findAllActivityUseCase
}