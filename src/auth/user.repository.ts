import { EntityRepository, Repository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ConflictException } from "@nestjs/common";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;
        const user = new User();
        user.username = username;
        user.password = password;
        try {
            await user.save();
        } catch (error) {
           if (error.code === '23505') {
               throw new ConflictException(`Username "${username}" already exists`);
           }
        }
        
    }
}