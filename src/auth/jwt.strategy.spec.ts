import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';

const mockUserReposity = () => ({
    findOne: jest.fn(),
});

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                { provide: UserRepository, useFactory: mockUserReposity },
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        userRepository = module.get<UserRepository>(UserRepository);
    });

    describe('Validate', () => {
        it('it returns the user object', async () => {
            const mockUser = { username: 'testUser', password: '1234' };
            userRepository.findOne.mockResolvedValue(mockUser);
            expect(userRepository.findOne).not.toHaveBeenCalled();
            const result = await jwtStrategy.validate({ username: 'testUser' });
            expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'testUser' });
            expect(result).toEqual(mockUser);
        });
        it('throws UnauthorizedException when user doesnt exists', async () => {
            userRepository.findOne.mockResolvedValue(undefined);
            expect(jwtStrategy.validate({ username: 'testUser' })).rejects.toThrow(UnauthorizedException);
        });
    });

});