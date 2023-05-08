import User from './userModel';

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    const resultado = await user.save();
    res.status(200).json(resultado)
  } catch (error) {
    res.status(500).json(err)
  }
};

export async function GetUser(req, res) {
  // Código aquí
};

export async function GetUserById(req, res) {
  // Código aquí
};

export async function UpdateUserById(req, res) {
  // Código aquí
};

export async function DeleteUserById(req, res) {
  // Código aquí
};
