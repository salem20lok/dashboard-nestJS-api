import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/Create-User.Dto';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/user.schema';
import { LoginDto } from './dto/Login.Dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ChangePasswordDto } from './dto/ChangePassword.Dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePasswordDto(
    @GetUser() id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(changePasswordDto, id);
  }
}
