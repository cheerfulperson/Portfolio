
/**
 * Module exports.
 * @public
 */

const {
    scryptSync,
    createCipheriv,
    createDecipheriv
} = require('crypto');

const iv = Buffer.alloc(16, 0); //  генерация вектора инициализации

class ModernCrypto {

    encryptCip = (toEncrypt = "some word", password = 'vugi', algorithm = 'aes-192-cbc') => {
        const key = scryptSync(password, 'salt', Number(algorithm.split('-')[1]) / 8);
        const cipher = createCipheriv(algorithm, key, iv);

        let encrypted = '';
        cipher.setEncoding('hex');

        cipher.write(toEncrypt);
        cipher.on('data', (chunk) => encrypted += chunk);

        cipher.end();
        return encrypted;
    };

    decryptCip = (toDecrypt= "some word", password = 'vugi', algorithm = 'aes-192-cbc') => {
        const key = scryptSync(password, 'salt', Number(algorithm.split('-')[1]) / 8);
        const decipher = createDecipheriv(algorithm, key, iv);

        let decrypted = '';
        decipher.on('readable', (chunk) => {
            while (null !== (chunk = decipher.read())) {
                decrypted += chunk.toString('utf8');
            }
        });
        // Encrypted with same algorithm, key and iv.

        decipher.write(toDecrypt, 'hex');
        decipher.end();
        return decrypted;
    };

    createPin(amount){
        function getPin(){
            let pin = Math.round(Math.random() * 9999);
            if(pin.toString().length !== amount)
                return getPin();
            else 
                return pin;
        }
        return getPin();
    };
}

module.exports = new ModernCrypto;