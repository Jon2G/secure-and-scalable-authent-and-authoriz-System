const ElGamal = require('elgamal').default;

exports.generateKeys = async () => {
    console.log(ElGamal)

    const { p,
        g,
        y,
        x } = await ElGamal.generateAsync(); // Recommended way of initialization
    return {
        p,
        g,
        y,
        x
    };
}

exports.encrypt = async (message, keys) => {
    const encrypted = await ElGamal.encryptAsync(message, keys);
    return encrypted;
}

exports.decrypt = async (encrypted, keys) => {
    const decrypted = await ElGamal.decryptAsync(encrypted, keys);
    return decrypted;
}