const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};


app.post('/products', authMiddleware, async (req, res) => {
  const newProduct = new Product({ ...req.body, userId: req.user._id });
  try {
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read (unidad)
app.get('/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send();
  }
});

// Read (cantidad) - productos por usuario, texto de búsqueda y/o categoría
app.get('/products', authMiddleware, async (req, res) => {
  const search = req.query.search || '';
  const category = req.query.category || '';

  try {
    const products = await Product.find({ userId: req.user._id, name: { $regex: search, $options: 'i' }, category: { $regex: category, $options: 'i' } });
    res.send(products);
  } catch (error) {
    res.status(500).send();
  }
});

// Read (cantidad) - categorías de productos por usuario
app.get('/products/categories', authMiddleware, async (req, res) => {
  try {
    const categories = await Product.find({ userId: req.user._id }).distinct('category');
    res.send(categories);
  } catch (error) {
    res.status(500).send();
  }
});

app.patch('/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete
app.delete('/products/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isEnabled: false }, { new: true });

    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send();
  }
});