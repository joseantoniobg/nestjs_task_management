import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
    let user: User;

    beforeEach(() => {
        user = new User();
        user.password = 'testPassword';
        user.salt = 'testSalt';
        bcrypt.hash = jest.fn();
    });

    describe('validatePassword', () => {
        it('returns true as password is valid', async () => {
           bcrypt.hash.mockReturnValue('testPassword');
           expect(bcrypt.hash).not.toHaveBeenCalled();
           const result = await user.validatePassword('testPassword');
           expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSalt');
           expect(result).toEqual(true);
        });
        it('returns false as password is invalid', async () => {
           bcrypt.hash.mockReturnValue('wrongPassword');
           expect(bcrypt.hash).not.toHaveBeenCalled();
           const result = await user.validatePassword('123456');
           expect(bcrypt.hash).toHaveBeenCalledWith('123456', 'testSalt');
           expect(result).toEqual(false);
        });
    });
}); 