import Big from './big.mjs';

function makeKeys() {
    // TODO: Make these random
    const prime1 = 17;
    const prime2 = 11;
    const exponent = 7;

    console.log("Prime 1 is", prime1);
    console.log("Prime 2 is", prime2);
    console.log("exponent is", exponent);

    // For some reason, exponent and (prime1 - 1) * (prime2 - 1) should
    // be "relatively prime". So check that greatest common divisor is 1.
    console.log("Checking relatively prime relationship of", exponent, (prime1 - 1) * (prime2 - 1));
    if (getGreatestCommonDivisor(exponent, (prime1 - 1) * (prime2 - 1)).gcd !== 1) {
        console.warn("🔥 NOT RELATIVELY PRIME! 🔥");
    } else {
        console.warn("😎 Relatively prime! 😎");
    }

    return {
        private: {
            prime1: prime1,
            prime2: prime2
        },
        public: {
            product: prime1 * prime2,
            exponent: exponent
        }
    }
}

function getGreatestCommonDivisor(number1, number2) {
    // Euclidian algorithm
    let s = 0, old_s = 1;
    let t = 1, old_t = 0;
    let r = Math.min(number1, number2);
    let old_r = Math.max(number1, number2);

    while (r !== 0) {
        let q = Math.floor(old_r/r);
        [r, old_r] = [old_r - q*r, r];
        [s, old_s] = [old_s - q*s, s];
        [t, old_t] = [old_t - q*t, t];
    }
    const result = {
        gcd: old_r,
        bezoutCoefficient1: old_s,
        bezoutCoefficient2: old_t
    };
    console.log("GCD of", number1, number2, " is ", result);
    return result;
}

function encryptMessage(messageNumber, publicKey) {
    console.log("Encrypting", messageNumber);
    console.log("...using key", publicKey);

    const raised = new Big(messageNumber).pow(publicKey.exponent);
    console.log("Raised is", raised);
    const encrypted = raised.mod(publicKey.product);
    console.log("Encrypted message is", encrypted);
    return encrypted;
}

function decryptMessage(encryptedMessageNumber, keys) {
    // TODO: Find d using euclid, then decrypt.

    const decryptionKey = 23;

    const raised = Math.pow(encryptedMessageNumber, decryptionKey);
    console.log("Encrypted raised is", raised);
    decrypted = raised % keys.public.product;
    console.log("Decrypted message is", decrypted);
    return decrypted;
}

getGreatestCommonDivisor(10, 8);
getGreatestCommonDivisor(12, 6);
getGreatestCommonDivisor(12, 9);
getGreatestCommonDivisor(20, 25);

const keys = makeKeys();
console.log("Keys are", keys);
const C = encryptMessage("A".charCodeAt(0), keys.public);
const M = decryptMessage(C, keys);
console.log("Message was", String.fromCharCode(M));