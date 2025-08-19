import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: 'AbstractUserService',
      useClass: UserService
    },
    {
      provide: 'AbstractUserRepository',
      useClass: UserRepository
    }
  ],
  exports: [
    'AbstractUserService',
    'AbstractUserRepository'
  ],
})
export class UserModule {}
