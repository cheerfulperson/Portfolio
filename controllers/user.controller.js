const createError = require('http-errors'),
  User = require('../controllers/user.db.controller'),
  Feedback = require('../models/feedback.model'),

  {
    encryptCip,
    decryptCip
  } = require('../crypto-script'),
  {
    sign: encodeJson,
    verify: decodeJson
  } = require('jsonwebtoken'),
  sendMail = require('../models/nodemailer');


// * -----> session store
const store = require('../db/session.db.config');

// * -----> JWT
const jwtKey = process.env.JWT_SECRET_KEY,
  jwtOptions = {
    algorithm: 'HS384'
  };

// ? -----> Keys
const cryptoKey = process.env.CRYPTO_KEY;

class UserController {

  checkAuth(req, res, next) {
    store.get(req.sessionID, (err, session) => {
      if (err) console.error(err);

      if (session && session.user) next();
      else next(createError(404));
    })
  }

  async postUser(req, res) { // Регистрация
    const regForEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      regForPsw = /^[A-Za-z!@#$%&\d]{6,}$/;

    let formData = req.body,
      url;

    let isValidString = (re, str) => {
      return re.test(str);
    }

    User.getOne({
        email: formData ? formData.email : null
      })  
      .then(async user => {
        let passedTime;
        if (req.session.unidentifiedUser) {
          passedTime = Math.floor((Date.now() - new Date(req.session.unidentifiedUser.time).getTime()) / 1000); // Время с последней отправки
        }

        console.log("Время последнего запроса: " + passedTime + " секунд");

        let dataToSend = {};
        if (passedTime && passedTime <= 60) {

          dataToSend.event = 'onexpect'; // Ожидание
          dataToSend.time = 60 - passedTime;

        } else if (user || !isValidString(regForEmail, String(formData.email).toLowerCase())) {
          dataToSend.event = 'wrong email'; // Ошибка Email
          console.log("Такой Email уже есть");
        } else if (!isValidString(regForPsw, String(formData.psw))) {
          dataToSend.event = 'wrong psw'; // Ошибка пароля
        } else if (formData.psw != formData.pswRepeat) {
          console.log(formData.psw)
          console.log(formData.pswRepeat)

          console.log("Пароли не сходятся");
          dataToSend.event = 'password not converge'
        } else {
          dataToSend.event = 'onverify'; // все хорошо, Егор одобряет

          formData.psw = encryptCip(formData.psw, cryptoKey); // Кодировака пароля
          formData.pswReapet = null;

          formData.time = new Date(); // Перезаписываем последнего время запроса
          req.session.cookie.originalMaxAge = 1000 * 60 * 60; // Устанавливаем время жизни cookie После регестрации
          req.session.unidentifiedUser = formData; // Записываем в сессию информацию с сервера

          try {
            let encodeSession = encodeJson(JSON.stringify({
              _id: req.sessionID,
              email: formData.email
            }), jwtKey, jwtOptions);

            url = `${req.headers.origin}/users/verify?data=${encodeSession}`; // собираем ссылку

            let massageToSend = {
              from: 'YammmyCode clare.kuvalis76@ethereal.email',
              to: formData.email, // Comma separated list of recipients   
              subject: "Confirmation link for your email", // Subject of the message   
              text: `Hello ${formData.name}!\n
                    This link is valid only one hour from the moment of registration.
                    If you did not ask for it, please ignore this letter.
                    Do not under any circumstances share the link with strangers.\n
                    Your email verification link: \n${url}
                    \nBest regards, Security Service YammmyCode.
                    \nThis message has been sent to ${formData.email} at your request.
                    \n© by yammyCode 2021. All right reserved.`, // plaintext body   
              html: `<div style="max-width:400px;margin:auto;"> 
                      <p>Hello ${formData.name}!</p>
                      <p>This link is valid only one hour from the moment of registration.
                      If you did not ask for it, please ignore this letter.
                      Do not under any circumstances share the link with strangers.</p>
                      <p>Your email verification <a href='${url}'><b>link</b></a>.</p>
                      <p>Best regards, Security Service YammyCode.</p>
                      <hr>
                      <p style="font-size: 12px; color:gray">This message has been sent to ${formData.email} at your request.</p>
                      <p style="font-size: 12px; color:gray">© by yammyCode 2021. All right reserved.</p>
                    </div>`, // HTML body
            };
            sendMail(massageToSend).catch(err => {
              console.error(err.message);
              process.exit(1);
            });

          } catch (error) {
            console.error(error)
          }

        }
        console.log(url);
        res.send(JSON.stringify(dataToSend))
      })
      .catch(err => console.error(err))

  }

  async checkUserEmail(req, res, next) {
    let decode;
    let encodeSession = await req.query['data'];

    try {
      decode = await decodeJson(encodeSession, jwtKey, jwtOptions);
      store.get(decode._id, (err, session) => {
        if (err) console.error(err)
        if (session && session.unidentifiedUser) {
          let {
            name,
            email,
            psw
          } = session.unidentifiedUser;

          User.addOne({
            name: name,
            email: email,
            password: psw
          })

          let massageToSend = {
            from: 'YammmyCode clare.kuvalis76@ethereal.email',
            to: email, // Comma separated list of recipients   
            subject: "Congratulations, you have successfully registered.", // Subject of the message   
            text: `Hello ${name}!\n
                    Congratulations, you have successfully registered.\n
                    Now you can discuss your problem with us and build a general solution.\n
                    --------------\n
                    © by yammyCode 2021. All right reserved.`, // plaintext body   
            html: `<div style="max-width:400px;margin:auto;"> 
                  <p>Hello ${name}!</p>
                  <p>Congratulations, you have successfully registered. <br>
                  Now you can discuss your problem with us and build a general solution.</p>
                  <hr>
                  <p style="font-size: 12px; color:gray">© by yammyCode 2021. All right reserved.</p>
                </div>`, // HTML body
          };
          sendMail(massageToSend).catch(err => {
            console.error(err.message);
            process.exit(1);
          });
        } else {
          next(createError(404));
        }
      })
      if (req.session) {
        await req.session.destroy();
        await res.redirect('/?open=login');
      } else {
        next(createError(404));
      }

    } catch (error) {
      console.error(error);
      next(createError(404));
    }
  }


  async getAuth(req, res) { // TODO АВТОРИЗАЦИЯ
    let {
      email,
      psw,
      remember
    } = req.body;

    User.getOne({
        email
      }).then(user => {
        var ip = req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);
        if (user && psw === decryptCip(user.password, cryptoKey)) {
          let dateNow = new Date(); // Дата
          let massageToSend = {
            from: 'YammmyCode clare.kuvalis76@ethereal.email',
            to: email, // Comma separated list of recipients   
            subject: "Вход в систему.", // Subject of the message   
            text: `Привет ${user.name}!\n
                      Вы вошли в аккаунт с 
                      IP: ${ip}.\n
                      Date: ${dateNow}.\n
                      Если это были не вы, то вам следует в срочном порядке изменить пароль ссылка\n
                      --------------\n
                      © by yammyCode 2021. All right reserved.`, // plaintext body   
            html: `<div style="max-width:400px;margin:auto;"> 
                    <p>Hello ${user.name}!</p>
                    <p>IP: ${ip}.</p>
                    <p>Date: ${dateNow}.</p>
                    Если это были не вы, то вам следует в срочном порядке изменить пароль ссылка\n
                    
                    <hr>
                    <p style="font-size: 12px; color:gray">© by yammyCode 2021. All right reserved.</p>
                  </div>`, // HTML body
          }
          sendMail(massageToSend).catch(err => {
            console.error(err.message);
            process.exit(1);
          });

          if (remember === 'off')
            req.session.cookie.originalMaxAge = 1000 * 60 * 60;

          req.session.user = {
            id: user.id,
            email,
            name: user.name,
            role: user.role,
            image: user.image
          }
          res.send({
            state: 200
          })
        } else {
          res.send({
            state: 404
          })
        }
      })
      .catch(console.error)
  }

  async saveFeedback(req, res) {
    let formData = req.body;
    console.log(req.body.facebook)
    let social = {
      linkedin: req.body.linkedin,
      facebook: req.body.facebook,
      twiter: req.body.twiter
    }
    // Feedback.create({name: formData.name, social: {

    // })

    if (formData.review.length < 20) {
      res.send({
        state: 204
      })
    } else
      res.send({
        state: 200
      })
  }


  uploadAvatar(req, res){
    let image = req.body.image;
    User.updateOne({_id: req.session.user.id}, {image});
    console.log(req)
    res.redirect('/');
  }
  deleteUserSession(req, res) { // ? Выход из аккаунта
    if (req.session.user)
      req.session.destroy();
    res.redirect('/');
  }
}

module.exports = new UserController;