import { IActivityRepository } from "../interfaces/ActivityRepository.interface";

export class DeleteActivity {
  constructor(private activityRepository: IActivityRepository) {}

  async handler(activityId: number): Promise<void> {    
    await this.activityRepository.delete(activityId);
  }
}