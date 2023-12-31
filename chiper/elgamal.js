const ElGamal = require('elgamal').default;
const {EncryptedValue} = require('elgamal')
const { BigInteger } = require("jsbn");

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
    const encrypted = await elgamal.encryptAsync(message);
    return {
        a: encrypted.a.toString(),
        b: encrypted.b.toString()
    }
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
    
    const value = new EncryptedValue(
        new BigInteger(encrypted.a),
        new BigInteger(encrypted.b),
    )
    const decrypted = await elgamal.decryptAsync(value);
    return decrypted;
}