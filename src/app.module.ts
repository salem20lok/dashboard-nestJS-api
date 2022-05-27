import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('host_mail'),
          port: configService.get('port_mail'),
          secure: false,
          auth: {
            user: configService.get('user_mail'),
            pass: configService.get('pass_mail'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    OrderModule,
    UploadModule,
    CategoryModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
