// src/modules/activity/repositories/ActivityRepository.ts
import { Repository, EntityManager } from "typeorm";
import { Activity } from "../entities/Activity";
import { appDataSource } from "../../../config/typeorm/typeorm";
import { IActivityRepository } from "../interfaces/ActivityRepository.interface";
import { IActivity } from "../interfaces/Activity.interface";

export class ActivityRepository implements IActivityRepository {
  readonly repository: Repository<Activity>;

  constructor(entityManager?: EntityManager) {
    this.repository = entityManager
      ? entityManager.getRepository(Activity)
      : appDataSource.getRepository(Activity);
  }

  async create(activity: IActivity): Promise<IActivity> {
    return this.repository.save(activity);
  }

  async update(activity: IActivity): Promise<IActivity> {
    return this.repository.save(activity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
  
  async findActivityById(id: number): Promise<IActivity | null> {
    return this.repository.findOne({
        where: { id },
        relations: ['items']
    })
  }
  
  async findAllActivity(page: number, limit: number): Promise<IActivity[] | undefined> {
    return this.repository.find({            
        skip: (page - 1) * limit,
        take: limit,
        relations: ['items']
    })
  }
}