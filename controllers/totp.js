const { authenticator } = require('otplib');

exports.getTotp = (secret) => {
    const token = authenticator.generate(secret);
    return token;
}

exports.verifyTotp = (secret, token) => {
    return authenticator.verify({ token, secret });
}

