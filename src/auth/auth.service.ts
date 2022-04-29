import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/Create-User.Dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { LoginDto } from './dto/Login.Dto';
import { JwtPayloadInterface } from './Jwt-Payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ChangePasswordDto } from './dto/ChangePassword.Dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private JwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hash;
    try {
      const user = await this.userService.CreateUser(createUserDto);
      return user;
    } catch (e) {
      throw new ConflictException(
        `this email : ${createUserDto.email} is already exist `,
      );
    }
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const found = await this.userService.getUserByEmail(loginDto.email);
    if (found && (await bcrypt.compare(loginDto.password, found.password))) {
      const payload: JwtPayloadInterface = { email: loginDto.email };
      const accessToken: string = this.JwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(`please check your login correct`);
    }
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    const { email } = forgetPasswordDto;
    const found = await this.userService.getUserByEmail(email);

    if (found) {
      const payload: JwtPayloadInterface = { email };
      const access_Token: string = this.JwtService.sign(payload);

      const message = `<div style="border: 1px solid black  ; text-align: center " > 
                              <h1>Bonjour madame/monsier : ${
                                found.firstName + found.lastName
                              } </h1>
                              <p style="color: red" >Vous avez recu un message pour changer votre mot de passe 🔐💢⚙️</p>
                              <a style="display: block ; text-align: center ; background-color: crimson ; text-decoration: none ;
                               color: white ; width: 50%  ; margin: 10px auto ; padding: 10px " 
                               href="http://localhost:3001/change-password?token=${access_Token}">Change Password</a>
                      </div>`;

      await this.mailService
        .sendMail({
          to: found.email,
          from: 'ecommerceService@gmail.com', // sender address
          subject: 'Forget Password ✔', // Subject line
          text: 'ShopIt', // plaintext body
          html: message, // HTML body content
        })
        .then((res) => {
          console.log(`mail is send a : ${email}`);
        })
        .catch((e) => {
          throw new ConflictException(`this email : ${email} not Exist`);
        });
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    id: string,
  ): Promise<void> {
    const { password, confirmedPassword } = changePasswordDto;
    const found = await this.userService.getUserById(id);
    if (found && password === confirmedPassword) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      const user = await this.userService.changePassword(id, hash);
    } else {
      throw new UnauthorizedException();
    }
  }
}
