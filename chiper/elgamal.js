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
    const elgamal = new ElGamal(...{keys});
    console.log(elgamal)
    const encrypted = await elgamal.encryptAsync(message);
    return encrypted;
}

exports.decrypt = async (encrypted, keys) => {
    const elgamal = new ElGamal(...{keys});
    console.log(elgamal)
    const decrypted = await elgamal.decryptAsync(encrypted);
    return decrypted;
}