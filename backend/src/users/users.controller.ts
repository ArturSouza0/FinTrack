import { Body, Controller, Delete, Get, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './Users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findAll')
  getUsers() {
    return this.usersService.getUsers();
  }
  @Get('me')
  getProfile(@Req() request: Request) {
    const user = request['user'];
    return this.usersService.getMyProfile(user['id']);
  }
  @Get('findById')
  getUserById(@Body() body: { id: string }) {
    return this.usersService.getUserById(body.id);
  }
  @Get('findByEmail')
  getUserByEmail(@Body() body: { email: string }) {
    return this.usersService.getUserByEmail(body.email);
  }
  @Put('update')
  updateUser(@Body() body: { id: string; user: UpdateUserDto }) {
    return this.usersService.updateUser(body.id, body.user);
  }
  @Delete('delete')
  deleteUser(@Body() body: { id: string }) {
    return this.usersService.deleteUser(body.id);
  }
}
