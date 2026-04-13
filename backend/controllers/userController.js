const users = []; 

const getUsers = (req, res) => {
  res.json(users);
};

const createUser = (req, res) => {
  const { name } = req.body;
  if (!name ) {
    return res.status(400).json({ error: 'Nome é obrigatório' });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

module.exports = { getUsers, createUser };
