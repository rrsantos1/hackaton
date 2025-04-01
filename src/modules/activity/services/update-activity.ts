import { IActivity } from "../interfaces/Activity.interface";
import { IActivityRepository } from "../interfaces/ActivityRepository.interface";

export class UpdateActivity {
    constructor(readonly activityRepository: IActivityRepository) {}
    async handler(activity: IActivity) {
      return this.activityRepository.update(activity)
    }
}