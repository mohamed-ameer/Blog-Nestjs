import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, getRepository, BeforeUpdate } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;
}

