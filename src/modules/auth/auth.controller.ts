import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @ApiResponse({ status: 200, description: 'Login success' })
  async login(@Request() req, @Body() createUserDto: CreateUserDto) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiResponse({ status: 400, description: 'Missing required fields' })
  @ApiResponse({ status: 200, description: 'OK' })
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
