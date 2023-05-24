import jwt from 'jsonwebtoken'
import config from '../config';
import User from '../usuario/userModel';
import Role from '../usuario/RoleModel';
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    console.log(token)

    if(!token) return res.status(403).json({message:"No token provided"})
 
    const decoded=jwt.verify(token,config.SECRET)
    req.userId=decoded.id

    
    const user=await User.findById(req.userId,{password:0})
    console.log(user)
    if(!user) return res.status(404).json({message:'not user found'})
   
    next()
  } catch (error) {
    return res.status(401).json({message:'Unauthorized'})
  }
}

export const isModerator = async (req, res, next) => {
    try {
      const user = await User.findById(req.userId);
      const roles = await Role.find({ _id: { $in: user.roles } });
  
      const isModerator = roles.map(role => role.name === "user").includes(true);
      if (isModerator) {
        next();
      } else {
        return res.status(403).json({ message: "Require user Role!" });
      }
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };
  

export const isAdmin=async (req,res,next)=>{

}

