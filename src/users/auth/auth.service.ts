import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../user.entity';
import { UserDto } from '../dtos/user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.userService.findByEmail(user.email);
    if (!foundUser || !(await this.validateUser(user.email, user.password))) {
      throw new HttpException(
        'Mailul sau parola sunt invalide',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { password, ...rest } = foundUser;
    const payload = { email: user.email, id: foundUser.id };
    console.log('token', this.jwtService.sign(payload));
    return {
      accessToken: this.jwtService.sign(payload),
      user: { ...rest },
      tokenType: 'bearer',
    };
  }

  async signUp(
    name: string,
    email: string,
    password: string,
    company: string,
  ): Promise<User> {
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new HttpException('Utilizatorul exista deja!', HttpStatus.CONFLICT);
    }
    return this.userService.create(name, email, password, company);
  }
}
