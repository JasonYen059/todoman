import jwt from 'jsonwebtoken';

const AuthToken =(req, res, next) =>{
  const SECRET_KEY = process.env.SECRET_KEY;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const error = new Error('No token');
    
  if (!token) {
    error.status = 403;
    return next(error);
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
        error.status = 403;
        return next(error);
    }
    req.user = user;
    next();
  });
}

export default AuthToken;