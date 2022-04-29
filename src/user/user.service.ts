import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/Create-User.Dto';
import { UpdateUserDto } from './dto/Update-User.Dto';
import { UpdatePasswordDto } from './dto/update-Password.Dto';
import * as bcrypt from 'bcrypt';
import { UpdateRoleDto } from '../auth/dto/Update-Role.Dto';
import { Parser } from 'json2csv';
import DeleteMyAccountDto from './dto/Delete-MyAccount.Dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async CreateUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, email, password } = createUserDto;
    const found = await this.UserModel.findOne({ email: email });
    if (found) {
      throw new ConflictException(`this email : ${email} is exist ! `);
    }
    try {
      const user = await new this.UserModel(createUserDto);
      return user.save();
    } catch (e) {
      throw new ConflictException(`this email : ${email} is exist ! `);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.UserModel.findOne({ email: email });
    return user;
  }

  async UpdateUser(updateUserDto: UpdateUserDto, id: string): Promise<User> {
    const { firstName, lastName, email, avatar, role } = updateUserDto;

    const query = {
      email: email,
      lastName: lastName,
      firstName: firstName,
      avatar: avatar,
      role: role,
    };

    if (!email) delete query.email;
    if (!lastName) delete query.lastName;
    if (!firstName) delete query.firstName;
    if (!avatar) delete query.avatar;
    if (!role) delete query.role;

    await this.UserModel.findByIdAndUpdate(id, query);
    const user = await this.UserModel.findById(id);
    return user;
  }

  async changePassword(id: string, password: string): Promise<void> {
    await this.UserModel.findByIdAndUpdate(id, { password: password });
  }

  async getUserById(id: string): Promise<User> {
    const found = await this.UserModel.findById(id);
    if (found) {
      return found;
    } else {
      throw new UnauthorizedException();
    }
  }

  async UsersPagination(
    skip: number,
  ): Promise<{ users: User[]; count: number }> {
    const users = await this.UserModel.find({}).limit(6).skip(skip);
    const count = await this.UserModel.find({}).count();
    return { users: users, count: count };
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    id: string,
  ): Promise<User> {
    const { password, newPassword, ConfirmedPassword } = updatePasswordDto;
    const found = await this.UserModel.findById(id);
    const isMatch = await bcrypt.compare(password, found.password);

    if (isMatch && newPassword === ConfirmedPassword) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newPassword, salt);
      try {
        const user = await this.UserModel.findByIdAndUpdate(id, {
          password: hash,
        });
        return user;
      } catch (e) {
        throw new BadRequestException(
          'please check password or confirmed password correct ',
        );
      }
    } else {
      throw new BadRequestException(
        'please check password or confirmed password correct ',
      );
    }
  }

  async updateRole(updateRoleDto: UpdateRoleDto, id: string): Promise<User> {
    try {
      const user = await this.UserModel.findByIdAndUpdate(id, {
        role: updateRoleDto.role,
      });
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async identification(id: string): Promise<User> {
    const user = await this.UserModel.findById(id);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.UserModel.findByIdAndDelete(id);
  }

  async deleteMyAccount(
    deleteDto: DeleteMyAccountDto,
    id: string,
  ): Promise<void> {
    const { password } = deleteDto;
    const found = await this.UserModel.findById(id);
    const isMatches = await bcrypt.compare(password, found.password);
    if (!isMatches) throw new BadRequestException('password not correct');
    try {
    } catch (e) {
      throw new BadRequestException('password not correct');
    }
    await this.UserModel.findByIdAndDelete(id);
  }
}
