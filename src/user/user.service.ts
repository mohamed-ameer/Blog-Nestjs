import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { PayloadJwtDto } from '../auth/dto/payload-jwt.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService
  ){}

  //CRUD System Services
  async create(createUserDto: CreateUserDto) {
    const existingUserName = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    const existingUserEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUserName) {
      throw new ConflictException('Username already exists');
    }
    if (existingUserEmail) {
      throw new ConflictException('email already exists');
    }
    const user = this.userRepository.create(createUserDto);
    user.password = this.authService.hashPassword(user.password);
    await this.userRepository.save(user);
    const { password, ...userWithoutPassword } = user;
    const payload: PayloadJwtDto = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    const token = this.authService.generateToken(payload);
    return { message: 'User created successfully', token };
  }

  async findAll() {
    const users = await this.userRepository.find();
    if(users.length === 0){
      throw new NotFoundException('No users found');
    }
    const userWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    return { message: 'Users fetched successfully', data: userWithoutPassword };
  }

  async findOne(id: number) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('there is no user with this id');
    }
    const { password, ...userWithoutPassword } = existingUser;
    return { message: 'User fetched successfully', data: userWithoutPassword };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('there is no user with this id');
    }
    if(!updateUserDto.username || !updateUserDto.name || !updateUserDto.email){
      throw new BadRequestException('Username, name and email are required');
    }
    const existingUserByUsername = await this.userRepository.findOne({ where: { username: updateUserDto.username } });
    const existingUserByUserEmail = await this.userRepository.findOne({ where: { username: updateUserDto.email } });
    if (existingUserByUsername && existingUserByUsername.id !== id) {
      throw new ConflictException('Username already exists');
    }
    if (existingUserByUserEmail && existingUserByUserEmail.id !== id) {
      throw new ConflictException('email already exists');
    }
    if(updateUserDto.password){
      updateUserDto.password = this.authService.hashPassword(updateUserDto.password);
    }
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });
    const { password, ...userWithoutPassword } = updatedUser;
    return { message: 'User updated successfully', data: userWithoutPassword };
  }

  async remove(id: number) {
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('there is no user with this id');
    }
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
  //Authentication System Services
  async login(loginDto: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: loginDto.email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = this.authService.comparePassword(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload: PayloadJwtDto = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    const token = this.authService.generateToken(payload);
    return { message: 'User logged in successfully', token };
  }
}
