import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUseDto, UpdateUserDto, UserResponseDto } from './Users';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  private toUserResponse(user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    password?: string;
  }): UserResponseDto {
    return new UserResponseDto(user);
  }

  async createUser(
    createUseDto: CreateUseDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const email = createUseDto.email.toLowerCase();
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUseDto.password, 10);
    const newUser = await this.prismaService.user.create({
      data: { ...createUseDto, email, password: hashedPassword },
    });

    return {
      message: `User ${newUser.name} created successfully`,
      user: this.toUserResponse(newUser),
    };
  }

  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.prismaService.user.findMany();
    return users.map((user) => this.toUserResponse(user));
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID "${id}" not found`);
    return this.toUserResponse(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user)
      throw new NotFoundException(`User with email "${email}" not found`);
    return this.toUserResponse(user);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.email) {
      const existing = await this.prismaService.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existing && existing.id !== id)
        throw new ConflictException('Email already in use by another user');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      message: `${updatedUser.name} updated successfully`,
      user: this.toUserResponse(updatedUser),
    };
  }

  async deleteUser(
    id: string,
  ): Promise<{ message: string; user: UserResponseDto }> {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const deletedUser = await this.prismaService.user.delete({ where: { id } });

    return {
      message: `${deletedUser.name} deleted successfully`,
      user: this.toUserResponse(deletedUser),
    };
  }
}
