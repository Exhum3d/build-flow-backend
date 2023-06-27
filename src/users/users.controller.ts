import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { name, email, password, company, role } = createUserDto;
    await this.authService.signUp(name, email, password, company, role);

    return createUserDto;
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getLoggedInUser(@Req() request: Request) {
    return request.user;
  }

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get('/users/chat/:id')
  async getAllUsersFilteredForChat(@Param('id') loggedInUserId: string) {
    return await this.usersService.getAllUsersFilteredForChat(loggedInUserId);
  }

  @Get('/users/:id')
  async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
