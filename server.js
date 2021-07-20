/**
 * @author Alessio Napolitano
 */

const bodyParser = require('body-parser');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');

const server = jsonServer.create();

const router = jsonServer.router('./db.json');

const tokenList = {};

const userDB = {
  users : [
    {
      user : 'user',
      password : 'password'
    }
  ]
};


server.use(jsonServer.defaults());

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

const SECRET_KEY_TOKEN = '1234';
const SECRET_KEY_REFRESHTOKEN = '4321';
const tokenExpiresIn = 300;
const refreshTokenExpiresIn = '9h';
const cryptoKey = '5678';

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY_TOKEN, {expiresIn: tokenExpiresIn});
}

function createRefreshToken(payload) {
  return jwt.sign(payload, SECRET_KEY_REFRESHTOKEN, {expiresIn: refreshTokenExpiresIn});
}

function verifyToken(token) {
  return  jwt.verify(token, SECRET_KEY_TOKEN, (err, decode) => decode !== undefined ?  null : err);
}

function verifyTokenForVerificationEndPoint(token) {
  return  jwt.verify(token, SECRET_KEY_TOKEN, (err, decode) => decode !== undefined ?  decode : 0);
}

function verifyRefreshToken(token) {
  return  jwt.verify(token, SECRET_KEY_REFRESHTOKEN, (err, decode) => decode !== undefined ?  null : err);
}

function isAuthenticated({user, password}) {
  return userDB.users.findIndex(userArr => userArr.user === user && userArr.password === password) !== -1;
}

server.post('/auth/login', (req, res) => {
  let {user, password} = req.body;
  if (isAuthenticated({user, password}) === false) {
    const status = 401;
    const message = 'User o password non corretta';
    res.status(status).json({status, message});
    return;
  }
  password = crypto.AES.encrypt(password, cryptoKey).toString();
  const access_token = createToken({user, password});
  const refreshToken = createRefreshToken({user, password});
  tokenList[refreshToken] = {user, password};
  const dateToken = Date.now() + 60000*5;
  const dateRefreshToken = Date.now() + 60000*60*9;
  res.status(200).json({access_token, tokenExpireIn: dateToken, refreshToken, refreshTokenExpireIn: dateRefreshToken});
})

server.post('/auth/refreshToken', (req, res) => {
  const {refreshToken} = req.body;
  if(refreshToken && (refreshToken in tokenList)) {
    const resultOfVerification = verifyRefreshToken(refreshToken);
    if (!resultOfVerification) {
      const token = createToken(tokenList[refreshToken]);
      const dateToken = Date.now() + 60000*5;
      const response = {
        access_token: token,
        tokenExpireIn: dateToken
      }
      res.status(200).json(response);
    } else {
      const message = 'Token non valido/scaduto';
      res.status(401).json({status, message});
    }
  } else {
    res.status(400).send('Richiesta non valida')
  }
})

server.post('/auth/verifyToken', (req, res) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401;
    const message = 'header non corretto';
    res.status(status).json({status, message});
    return;
  }
  const resultOfVerification = verifyTokenForVerificationEndPoint(req.headers.authorization.split(' ')[1]);
  if (typeof(resultOfVerification) === 'number') {
    const message = 'Token non valido/scaduto';
    res.status(401).json({status, message});
  } else {
    resultOfVerification.iat = resultOfVerification.iat*1000;
    resultOfVerification.exp = resultOfVerification.exp*1000;
    res.status(200).json(resultOfVerification);
  }
})

server.delete('/eliminaRisultati', (req, res) => {
  let isTuttiidPresenti = true;
  const ids = req.query.id;
  if (ids && Array.isArray(ids)) {
    if (ids.length) {
      ids.forEach((id) => {
        const el = router.db.get('ricerca').getById(id).value();
        if (!el) {
          isTuttiidPresenti = false;
        }
      });
    }
  } else if (ids) {
    if (ids) {
      const el = router.db.get('ricerca').getById(ids).value()
      if (!el) {
        isTuttiidPresenti = false;
      }
    }
  } else {
    isTuttiidPresenti = false;
  }

  if (isTuttiidPresenti) {
    try {
      if (ids && Array.isArray(ids)) {
        ids.forEach((id) => {
          router.db.get('ricerca').removeById(id).value();
        });
      } else if (ids) {
        router.db.get('ricerca').removeById(ids).value();
      }
      router.db.write();
    } catch (e) {
      isTuttiidPresenti = false;
    }
  }

  if (isTuttiidPresenti) {
    const status = 200;
    res.status(status).json({});
    return;
  } else {
    const status = 400;
    const message = 'errore nel DELETE';
    res.status(status).json({status, message});
    return;
  }

})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
  if (req.method !== 'GET') {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = 401;
      const message = 'header non corretto';
      res.status(status).json({status, message});
      return;
    }
    const resultOfVerification = verifyToken(req.headers.authorization.split(' ')[1]);
    if (!resultOfVerification) {
      next();
    } else {
      const status = 401;
      const message = 'Errore: token non valido';
      res.status(status).json({status, message});
    }
  } else {
    next();
  }
})

server.use(router);

server.listen(3000, () => {
  console.log('Server lanciato per il corso di Angular :)');
})
