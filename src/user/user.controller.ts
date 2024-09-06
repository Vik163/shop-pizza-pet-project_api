import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
// import { Auth } from 'src/decorators/auth.decorator';
import { UserDto } from './dto/user.dto';
import { AccessToken } from 'src/common/decorators/accessToken.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  // защитник
  @AccessToken()
  getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  @AccessToken()
  @Patch(':id')
  updateUserData(@Param('id') id: string, @Body() updateUserDto: UserDto) {
    return this.userService.updateUserData(id, updateUserDto);
  }

  @AccessToken()
  @Get(':id')
  // @Auth('ADMIN')
  getUserById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  // @Post()
  // signup(@Body() userRequest: UserDto) {
  //   return this.userService.createUser(userRequest);
  // }
}
