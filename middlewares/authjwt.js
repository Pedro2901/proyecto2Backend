import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import User from '../usuario/userModel';
import Role from '../usuario/RoleModel';
config()

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    //console.log("token: ",token)

    if (!token) return res.status(403).json({ message: "No token provided" })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    //console.log("decoded de arriba: ",decoded)

    const user = await User.findById(req.userId, { password: 0 })
    console.log(user)
    if (!user) return res.status(404).json({ message: 'not user found' })

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export const isModerator = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    console.log("entro al tryisModerator")
    const user = await User.findById(req.params.id);
    console.log("user", user)
    console.log("decoded:", decoded)
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isModerator = roles.map(role => role.name === "user").includes(true);
    if (isModerator) {
      console.log("entro en el if")
      next();
    } else {
      console.log("entro en el else")
      return res.status(403).json({ message: "Require user Role!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};


export const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    console.log("entro al tryisModerator")
    const user = await User.findById(req.params.id);
    console.log("user", user)
    console.log("decoded:", decoded)
    const roles = await Role.find({ _id: { $in: user.roles } });

    const isModerator = roles.map(role => role.name === "user").includes(true);
    if (isModerator && decoded.id === req.params.id) {
      console.log("entro en el if")
      next();
    } else {
      console.log("entro en el else")
      return res.status(403).json({ message: "Require user Role!" });
    }
  } catch (error) {
    return res.status(500).send({ message: error });
  }
}

