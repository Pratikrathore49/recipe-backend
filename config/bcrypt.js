const bcrypt = require('bcrypt');

class PassHash {

    async passEncrypt(password) {
        let hashps = await bcrypt.hash(password, 12);
        return hashps;
    }

    async passMatch(hash, password) {
        let match = await bcrypt.compare(password, hash);
        return match;
    }

}

module.exports = new PassHash()