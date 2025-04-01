import { ActivityRepository } from "../../repositories/ActivityRepository";
import { UpdateActivity } from "../update-activity";

export function makeUpdateActivity() {
    const activityRepository = new ActivityRepository();
    const updateActivityUseCase = new UpdateActivity(activityRepository);
    return updateActivityUseCase;
}