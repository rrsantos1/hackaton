import { ActivityType } from "../entities/Activity";

export interface IActivity {
    id?: number;
    title: string;
    description?: string;
    category: string;
    type: ActivityType;
    config?: any;
    content?: any;
    coverImage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}