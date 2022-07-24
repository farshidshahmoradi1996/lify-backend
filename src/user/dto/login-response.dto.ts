import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: User;
}
