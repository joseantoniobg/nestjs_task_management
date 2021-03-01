import { UserRepository } from './user.repository';
import { Test } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

const mockAuthCredentialsDto = { username: "jose", password: "AmoTec#1" }

describe('UserRepository', () => {
    let userRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserRepository,],
        }).compile();

        userRepository = await module.get<UserRepository>(UserRepository);
    });

    describe('signUp', () => {
        let save;

        beforeEach(() => {
            save = jest.fn();
            userRepository.create = jest.fn().mockReturnValue({ save });
        });

        it('successfully signs up the user', () => {
            save.mockResolvedValue(undefined);
            expect(userRepository.signUp(mockAuthCredentialsDto)).resolves.not.toThrow();
        });

        it('throws a conflict exception as username already exists', () => {
            save.mockRejectedValue({ code: '23505' });
            expect(userRepository.signUp(mockAuthCredentialsDto)).rejects.toThrow(ConflictException);
        });

        it('throws an unhanded error while sign up', () => {
            save.mockRejectedValue({ code: '1' });
            expect(userRepository.signUp(mockAuthCredentialsDto)).rejects.toThrow(InternalServerErrorException);
        }); 
    });

    describe('ValidateUserPassword', () => {

        let user;
        
        beforeEach(() => {
            userRepository.findOne = jest.fn();
            user = new User();
            user.username = "jose";
            user.validatePassword = jest.fn();
        });

        it('returns username when successfully validates a user password', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(true);
            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(result).toEqual("jose");
        }); 

        it('returns null when not find the user', async () => {
            userRepository.findOne.mockResolvedValue(null);
            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(user.validatePassword).not.toHaveBeenCalled();
            expect(result).toBeNull();
        }); 

        it('returns null when the password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(user);
            user.validatePassword.mockResolvedValue(false);
            const result = await userRepository.validateUserPassword(mockAuthCredentialsDto);
            expect(user.validatePassword).toHaveBeenCalled();
            expect(result).toBeNull();
        }); 
    });

    describe('hashPassword', () => {
        it('call bcrypt.hash to generate a hash', async () => {
            bcrypt.hash = jest.fn().mockResolvedValue('testHash');
            expect(bcrypt.hash).not.toHaveBeenCalled();
            const result = await userRepository.hashPassword('testPassword', 'testSalt');
            expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
            expect(result).toEqual('testHash');

        });
    });
});