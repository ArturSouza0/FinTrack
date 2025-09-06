/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUseDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  email?: string;
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  constructor(user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    password?: string;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user.createdAt;
  }
}
