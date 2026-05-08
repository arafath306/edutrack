import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() data: any) {
    return this.authService.signup(data);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() data: any) {
    return this.authService.login(data);
  }
}
