const ElGamal = require('elgamal');

exports.generateKeys = async () => {
    const eg = await ElGamal.generateAsync(); // Recommended way of initialization
    return eg;
}