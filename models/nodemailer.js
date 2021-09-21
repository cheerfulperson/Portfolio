'use strict'

const nodemailer = require('nodemailer');

const sendMail = async massage => {
    const transporter = await nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'clare.kuvalis76@ethereal.email',
            pass: '3dTTXsFFDNR4U95WVU'
        },
        from: 'YammmyCode clare.kuvalis76@ethereal.email'
    });

    const info = await transporter.sendMail(massage); // отправка сообщения
    
    console.log('Message sent successfully!');
    console.log(nodemailer.getTestMessageUrl(info));

    // only needed when using pooled connections
    transporter.close();
}

module.exports = sendMail;