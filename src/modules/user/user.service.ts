import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: MongoRepository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExist = await this.findOneBy(createUserDto.email);
    if (emailExist) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({});
  }

  findOneBy(email: string) {
    return this.userRepository.findOneBy({ email: email });
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  removeAll() {
    return this.userRepository.delete({});
  }
}
