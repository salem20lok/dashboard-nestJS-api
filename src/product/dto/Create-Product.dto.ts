import { IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  images: string;

  @IsNotEmpty()
  price: number;

  user: string;

  @IsNotEmpty()
  stock: number;

  @IsNotEmpty()
  category: string;
}
