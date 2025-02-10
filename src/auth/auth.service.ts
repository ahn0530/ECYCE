import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  private excludePassword(user: any) {
    const { password, ...result } = user;
    return result;
  }

  async validateUser(id: string, password: string): Promise<any> {
    const user = await this.usersService.findById(id);
    if (user && await bcrypt.compare(password, user.password)) {
      return this.excludePassword(user);
    }
    return null;
  }

  async login(user: any) {
    return this.excludePassword(user);
  }
}