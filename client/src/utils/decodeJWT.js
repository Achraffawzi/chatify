import { Buffer } from 'buffer';

export const decodeJWT = (jwt) => JSON.parse(Buffer.from(jwt.split('.')[1], 'base64'));
