import { IActivityRepository } from "../interfaces/ActivityRepository.interface";

export class FindAllActivity {
    constructor(readonly activityRepository: IActivityRepository) {}

    async handler(page: number, limit: number) {
        return this.activityRepository.findAllActivity(page, limit)
    }
}