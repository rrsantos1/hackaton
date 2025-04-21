import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity(
    { 
        name: 'users' 
    }
)
export class User {
  @PrimaryGeneratedColumn('increment', {
    name: 'id', 
  })
  id?: number;

  @Column({
    name: 'name',
    type: 'varchar',
  })
  name!: string;

  @Column({ 
    name: 'email',
    type: 'varchar',
    unique: true 
})
  email!: string;

  @Column({
    name: 'password',
    type: 'varchar',
    nullable: false
  })
  password!: string;

  @Column({ 
    name: 'role',
    type: 'varchar',
    default: 'user' 
  })
  role?: string;

  @Column({ 
    name: 'isVerified', 
    type: 'boolean', 
    default: true })
  isVerified?: boolean;  

  @CreateDateColumn({ 
    name: 'createdAt',
    type: 'timestamptz' 
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP'
  })
  updatedAt?: Date
}