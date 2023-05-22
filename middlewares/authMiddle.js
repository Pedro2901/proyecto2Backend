import jwt from 'jsonwebtoken';

// export function verifyToken(authHeader) {
//     try {
//         const deco = jwt.verify(authHeader, process.env.JWT_SECRET);
//         return deco;
//     } catch (error) { return error; }
// }

// export async function authWithToken(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ error: 'El token de autorización es requerido' });

//     const token = authHeader.split(' ')[1];
//     if (!token) return res.status(401).json({ error: 'No ha sido proveído un token de autorización' });

//     const decoded = verifyToken(token);
//     if (!decoded) return res.status(401).json({ error: 'Token inválido' });
//     if (decoded instanceof Error) return res.status(401).json({ error: 'Token inválido' });

//     req.idUsuario = decoded.sub
//     next();
// }