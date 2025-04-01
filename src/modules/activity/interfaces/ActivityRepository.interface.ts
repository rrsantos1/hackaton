import { IActivity } from "./Activity.interface";

export interface IActivityRepository {
    create(activity: IActivity): Promise<IActivity>;
    update(activity: IActivity): Promise<IActivity>;
    delete(id: number): Promise<void>;
    findActivityById(id: number): Promise<IActivity | null>;
    findAllActivity(page: number, limit: number): Promise<IActivity[] | undefined>;
}