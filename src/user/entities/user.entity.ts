import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, getRepository, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email:string;

  @Column()
  password:string;

  @BeforeInsert()
  emailToLowerCase(){
    this.email = this.email.toLowerCase();
  }
}

