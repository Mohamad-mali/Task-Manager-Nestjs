import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

import { Status } from './types/TaskStatus';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: Status, default: Status.TO_DO })
  status: Status;

  @ManyToOne(() => User, (user) => user.ownedTasks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assignId' })
  assign: User;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
