const ElGamal = require('elgamal');

exports.generateKeys = async () => {
    console.log(ElGamal)
    const eg = await ElGamal.generateAsync(); // Recommended way of initialization
    return eg;
}