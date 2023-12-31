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
    if(keys==undefined){
        throw new Error('keys undefined')
    }
    const { p,
        g,
        y,
        x } = keys
    const elgamal = new ElGamal(p, g, y, x);
    console.log(elgamal)
    const encrypted = await elgamal.encryptAsync(message);
    return encrypted;
}

exports.decrypt = async (encrypted, keys) => {
    if(keys==undefined){
        throw new Error('keys undefined')
    }
    const { p,
        g,
        y,
        x } = keys
    const elgamal = new ElGamal(p, g, y, x);
    console.log(elgamal)
    const decrypted = await elgamal.decryptAsync(encrypted);
    return decrypted;
}