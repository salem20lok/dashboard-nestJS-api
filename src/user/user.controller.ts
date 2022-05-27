import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/Create-User.Dto';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/Update-User.Dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { RolesGuard } from '../auth/Authorization/roles.guard';
import { Roles } from '../auth/Authorization/roles.decorator';
import { Role } from '../auth/Authorization/role.enum';
import { UpdatePasswordDto } from './dto/update-Password.Dto';
import { UpdateRoleDto } from '../auth/dto/Update-Role.Dto';
import DeleteMyAccountDto from './dto/Delete-MyAccount.Dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('identification')
  @UseGuards(JwtAuthGuard)
  identification(@GetUser() id: string): Promise<User> {
    return this.userService.identification(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  CreateUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.CreateUser(createUserDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  UpdateUser(
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() id: string,
  ): Promise<User> {
    return this.userService.UpdateUser(updateUserDto, id);
  }

  @Put('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  UpdateUserAdmin(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<User> {
    return this.userService.UpdateUser(updateUserDto, id);
  }

  @Get('users-pagination')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  UsersPagination(
    @Query('skip') skip: number,
  ): Promise<{ users: User[]; count: number }> {
    return this.userService.UsersPagination(skip);
  }

  @Put('update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() id: string,
  ): Promise<User> {
    return this.userService.updatePassword(updatePasswordDto, id);
  }

  @Put('admin/update-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateRole(
    @Body() updateRole: UpdateRoleDto,
    @GetUser() id: string,
  ): Promise<User> {
    return this.userService.updateRole(updateRole, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  deleteMyAccount(
    @Body() deleteDto: DeleteMyAccountDto,
    @GetUser() id: string,
  ): Promise<void> {
    return this.userService.deleteMyAccount(deleteDto, id);
  }
}
