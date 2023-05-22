import User from '../usuario/userModel';
import jwt from 'jsonwebtoken';
import config from '../config';
import Role from '../usuario/RoleModel';


export const signUp = async (req, res) => {
  const { username, email, password, roles } = req.body;
  //: await User.encryptPassword (password)
  
  const newUser = new User({
    username,
    email,
    password
    })

 
  if (roles) {
    const foundRoles = await Role.find({name: {$in: roles}})
    newUser.roles = foundRoles.map(role => role._id)
    } else {
    const role = await Role.findOne({name: "user"})
    newUser.roles = [role._id];
    }


  const savedUser = await newUser.save();
console.log(savedUser)
  //con sign creamos un token
  //se conforma con "que dato voy a estar guardando dentro del token"
  //palabra secreta
  //objeto de configuración
  //configuramos para que el token dure 24 horas

  const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
    expiresIn: 84600,
  });

  res.json({ token });
};
export const signin = async (req, res) => {
    const userFound = await User.findOne({email:req.body.email}).populate("roles")
    if (!userFound) return res.status(400).json({message: "User not found"})
   // const matchPassword = await User.comparePassword(req.body.password, userFound.password)
    //console.log("estado es: ",matchPassword)
//if (!matchPassword) return res.status (401).json ({token: null, message: 'Invalid password'})



const token = jwt.sign({id: userFound._id}, config.SECRET, {
    expiresIn: 86400
    })
    console.log(userFound)
  
    res.json({token})
};
