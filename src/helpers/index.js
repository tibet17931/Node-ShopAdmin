const crypto = require('crypto')
const pbkdf2Sync = crypto.pbkdf2Sync

exports.calculate_age = (date) => {
    var diff_ms = Date.now() - date.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

exports.hashPassword = (password) => {
    var salt = crypto.randomBytes(128).toString('base64');
    var iterations = 10000;
    var keylen = 64;
    var hash = pbkdf2Sync(password, salt, iterations, keylen, 'sha512');
    return {
        salt: salt,
        hash: hash.toString('hex')
    };
}

exports.isPasswordCorrect = (savedHash, savedSalt, passwordAttempt) => {
    var keylen = 64; //64 bit.
    var iterations = 10000;
    return savedHash == pbkdf2Sync(passwordAttempt, savedSalt, iterations, keylen, 'sha512').toString('hex')
}

