import { IsNotEmpty } from 'class-validator';

export default class DeleteMyAccountDto {
  @IsNotEmpty()
  password: string;
}
