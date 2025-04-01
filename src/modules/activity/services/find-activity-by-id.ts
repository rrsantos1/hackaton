import { ResourceNotFoundError } from "../../../shared/errors/resource-not-found-error";
import { IActivity } from "../interfaces/Activity.interface";
import { IActivityRepository } from "../interfaces/ActivityRepository.interface";

export class FindActivityById {
    constructor(readonly activityRepository: IActivityRepository) {}

    async handler(id: number): Promise<IActivity | undefined> {
        const activity = await this.activityRepository.findActivityById(id);

        if (!activity) {
            throw new ResourceNotFoundError();
        }
        
        return activity ?? undefined;
    }
}