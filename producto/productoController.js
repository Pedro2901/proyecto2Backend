import Product from './productoModel'
export const createProduct = async (req, res) => {
    const { name, category, price, imgURL } = req.body;
  
    try {
      const newProduct = new Product({
        name,
        category,
        price,
        imgURL,
      });
  
     // const productSaved = await newProduct.save();
  
      res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  };

  export const getProducts=async(req,res)=>{

  };

  export const getProductById=async(req,res)=>{

  }

  export const updateProductById=async(req,res)=>{

  }

  export const deleteProductById=async(req,res)=>{

  }

