import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert} from 'typeorm';
import { Role } from '../../roles/role.enum';
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

  @Column({ 
    type: 'enum',
    enum: Role,
    default: Role.USER
  })
  role: Role;

  @BeforeInsert()
  emailToLowerCase(){
    this.email = this.email.toLowerCase();
  }
}

