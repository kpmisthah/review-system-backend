import bcrypt from 'bcryptjs';

export default class PasswordService {
    async hash(password) {
        return bcrypt.hash(password, 10);
    }

    async compare(plainInfo, hashedInfo) {
        return bcrypt.compare(plainInfo, hashedInfo);
    }
}
