import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users as UsersEntity } from './enities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  // отбирает данные пользователя для клиента ===================
  private selectDataUsers(data: UserDto) {
    return {
      userId: data.userId,
      phoneNumber: data.phoneNumber,
      email: data.email,
      birthday: data.birthday,
      name: data.name,
      userSettings: data.userSettings,
    };
  }

  async getUsers(): Promise<UserDto[]> {
    const usersData: UserDto[] = await this.userRepository.find();
    return usersData;
  }

  async updateUserData(id: string, updateUserDto: UserDto): Promise<UserDto> {
    try {
      const user = (await this.userRepository.findOne({
        where: { userId: id },
      })) as UserDto;

      this.userRepository.merge(user, updateUserDto);
      const data = await this.userRepository.save(user);

      if (data) {
        const userData = this.selectDataUsers(data);
        return userData;
      }
    } catch (err) {
      console.log('updateUserData', err);
    }
  }

  async findById(id: string): Promise<UserDto> {
    return await this.userRepository.findOne({
      where: { userId: id },
    });
  }
}
