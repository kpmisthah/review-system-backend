const bcrypt = require('bcryptjs');

class PasswordService {
    async hash(password) {
        return bcrypt.hash(password, 10);
    }

    async compare(plainInfo, hashedInfo) {
        return bcrypt.compare(plainInfo, hashedInfo);
    }
}

module.exports = PasswordService; // Exporting Class, not instance
