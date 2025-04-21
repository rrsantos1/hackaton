import { Repository, EntityManager } from 'typeorm';
import { User } from '../entities/User';
import { IUserRepository } from '../interfaces/UserRepository.interface';
import { IUser } from '../interfaces/User.interface';
import { appDataSource } from '../../../config/typeorm/typeorm'; 

export class UserRepository implements IUserRepository {
  readonly repository: Repository<User>;

  constructor(entityManager?: EntityManager) {
    // Se um transactionalEntityManager for passado, use-o; caso contrário, use o appDataSource.
    this.repository = entityManager 
      ? entityManager.getRepository(User) 
      : appDataSource.getRepository(User);
  }

  async create(user: IUser): Promise<IUser> {
    return this.repository.save(user);
  }

  async update(user: IUser): Promise<IUser> {
    return this.repository.save(user);
  }

  async delete(id: number): Promise<void> {
      await this.repository.delete(id);
  }

  async findUserById(id: number): Promise<IUser | null> {
    return this.repository.findOne({
        where: { id }
    })
  }

  async findAllUser(page: number, limit: number): Promise<IUser[] | undefined> {
    return this.repository.find({            
        skip: (page - 1) * limit,
        take: limit
    })
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.repository.findOne({
        where: { email }	
    })
  }
}