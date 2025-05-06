import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { GoogleAuth } from '@/src/shared/guards/auth-google.guard';

import { CreateAccountInput } from './inputs/create-account.input';

import { AuthService } from './auth.service';
import { LoginInput } from './inputs/login.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() input: LoginInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(input, req, res);
  }

  @Get('google')
  @UseGuards(GoogleAuth)
  public googleLogin() {
    return { message: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuth)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    return await this.authService.loginWithGoogle(req.user, req, res);
  }

  @Post('register')
  public async register(@Body() input: CreateAccountInput) {
    return this.authService.register(input);
  }

  @Get('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.authService.logout(req, res);
  }
}
