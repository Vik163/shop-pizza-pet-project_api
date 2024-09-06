import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { Birthday, Roles, UserSettings } from '../dto/user.dto';
import { RefreshTokenDto } from 'src/auth/dto/tokens.dto';
import { ObjectId } from 'mongoose';

@Entity()
export class User {
  @ObjectIdColumn()
  _id?: ObjectId;
  // Не обновлялся пользователь по личному id (конфликт дубликат ключа) пришлось добавить ObjectId
  @Column()
  userId?: string;

  //   @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Column()
  createDate?: Date;

  //   @Column({ type: 'timestamp', default: null, nullable: true })
  //   updatedAt: Date;

  @Column()
  name?: string;

  @Column()
  birthday?: Birthday;

  @Column()
  role?: Roles;

  @Column()
  phoneNumber?: string;

  @Column()
  email?: string;

  @Column()
  refreshTokenData?: RefreshTokenDto;

  @Column()
  userSettings?: UserSettings;
}
