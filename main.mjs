import Big from './big.mjs';

function makeKeys() {
    // TODO: Make these random
    const prime1 = 83;
    const prime2 = 11;
    const product = prime1 * prime2;
    const exponent = 7;

    console.log("Prime 1 is", prime1);
    console.log("Prime 2 is", prime2);
    console.log("exponent is", exponent);

    // For some reason, exponent and (prime1 - 1) * (prime2 - 1) should
    // be "relatively prime". So check that greatest common divisor is 1.
    // console.log("Checking relatively prime relationship of", exponent, (prime1 - 1) * (prime2 - 1));
    // const gcd = getGreatestCommonDivisor(exponent, (prime1 - 1) * (prime2 - 1));
    // if (gcd.gcd !== 1) {
    //     console.warn("🔥 NOT RELATIVELY PRIME! 🔥");
    // } else {
    //     console.log("😎 Relatively prime! 😎");
    // }

    const modularMultiplicativeInverse = getModularMultiplicativeInverse(exponent, (prime1 - 1) * (prime2 - 1));
    console.log("Mod inverse is", modularMultiplicativeInverse);
    const decryptionKey = modularMultiplicativeInverse;
    console.log("Decryption key is", decryptionKey);

    return {
        private: {
            prime1: prime1,
            prime2: prime2,
            decryptionKey: decryptionKey
        },
        public: {
            product: product,
            exponent: exponent
        }
    }
}

function getGreatestCommonDivisor(number1, number2) {
    // Euclidian algorithm
    // TODO: Something is broken with the coefficient calculations
    let s = 0, old_s = 1;
    let t = 1, old_t = 0;

    let r = Math.min(number1, number2);
    let old_r = Math.max(number1, number2);

    while (r !== 0) {
        let q = Math.floor(old_r / r);
        [r, old_r] = [old_r - q * r, r];
        [s, old_s] = [old_s - q * s, s];
        [t, old_t] = [old_t - q * t, t];
    }

    // TODO: How do we guarantee the order of the bezout coefficients?
    const result = {
        gcd: old_r,
        bezoutCoefficient1: old_s,
        bezoutCoefficient2: old_t
    };
    console.log("GCD of", number1, number2, " is ", result);
    return result;
}

function getModularMultiplicativeInverse(a, m) {
    // Brute force implementation, but at least it works
    for (let x = 1; x < m; x++) {
        if (((a % m) * (x % m)) % m == 1) {
            return x;
        }
    }
    throw new Error(`No modular multiplicative inverse exists for ${a}, ${m}`);
}

function encryptMessage(messageNumber, publicKey) {
    console.log("Encrypting", messageNumber);
    console.log("...using key", publicKey);

    const raised = new Big(messageNumber).pow(publicKey.exponent);
    console.log("Raised is", raised);
    const encrypted = raised.mod(publicKey.product);
    console.log("Encrypted number is", encrypted);
    return encrypted.toNumber();
}

function decryptMessage(encryptedMessageNumber, keys) {
    console.log("Decrypting", encryptedMessageNumber);
    const raised = new Big(encryptedMessageNumber).pow(keys.private.decryptionKey);
    console.log("Encrypted raised is", raised);
    const decrypted = raised.mod(keys.public.product);
    console.log("Decrypted number is", decrypted);
    return decrypted.toNumber();
}

// getGreatestCommonDivisor(10, 8);
// getGreatestCommonDivisor(12, 6);
// getGreatestCommonDivisor(12, 9);
// getGreatestCommonDivisor(20, 25);

const keys = makeKeys();
console.log("Keys are", keys);
const message = "H";
console.log("Message being sent is:", message);
const C = encryptMessage(message.charCodeAt(0), keys.public);
const M = decryptMessage(C, keys);
const decryptedMessage = String.fromCharCode(M);
console.log("Decrypted message:", decryptedMessage);
if (message === decryptedMessage) {
    console.log("😎 Correct 😎");
} else {
    console.warn("🔥 INCORRECT! 🔥");
}