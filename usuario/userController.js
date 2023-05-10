import User from './userModel';

export async function createUser(req, res) {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

export async function GetUser(req, res) {
  const user = await User.findOne(req.body);
  if (!user) {
    return res.status(400).send({ error: 'Invalid credentials' });
  }
  res.send(user);
};

export async function GetUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
};

export async function UpdateUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

export async function DeleteUserById(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isEnabled: false }, { new: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
};
