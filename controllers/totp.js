const { authenticator } = require('otplib');

export function getTotp(secret) {
    const token = authenticator.generate(secret);
    return token;
}

export function verifyTotp(secret, token) {
    return authenticator.verify({ token, secret });
}

