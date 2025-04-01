import { IActivity } from "../interfaces/Activity.interface";
import { ActivityRepository } from "../repositories/ActivityRepository";

export class CreateActivityUseCase {
    constructor(readonly activityRepository: ActivityRepository) {}

    async handler(activity: IActivity): Promise<IActivity> {
        return this.activityRepository.create(activity)
    }
}