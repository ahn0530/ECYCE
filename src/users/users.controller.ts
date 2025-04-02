import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/local.authGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req, @Res() res) {
    console.log('응답 데이터:', req.user);
    return res.json(req.user);
  }
  
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(LocalAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Put(':id/password')
  async changePassword(@Param('id') id: string, @Body('password') newPassword: string) {
    return this.usersService.changePassword(id, newPassword);
  }

  @UseGuards(LocalAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res) {
    req.logout(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  }


  // @Get(':id/profile')
  // async getUserProfile(@Param('id') id: string) {
  //   return this.usersService.getUserProfile(id);
  // }
}