import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
        ) {}

    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.userRepository.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
        this.logger.log(`user trys to sign in. User: ${authCredentialsDto.username}`);
        const username = await this.userRepository.validateUserPassword(authCredentialsDto);

        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const paylod: JwtPayload = {
            username,
        }

        const accessToken = await this.jwtService.sign(paylod);
        this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(paylod)}`);

        return { accessToken, };
    }
}
