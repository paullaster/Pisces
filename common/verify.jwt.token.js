import jwt from 'jsonwebtoken';
export default (token, config) => jwt.verify(token, config.key, { algorithms: ['HS512'] });