import Product from "../models/product.model.js";

class ProductRepository {
  async getAllProducts() {
    const products = await Product.find({ active: true })
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate({
        path: "category",
        match: { active: true },
        select: "name",
      });

    return products.filter((p) => p.category !== null);
  }

<<<<<<< HEAD
  async deleteProductById(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
    return product;
  }

  async getProductById(id) {
    const product = await Product.findOne({ _id: id, active: true }).populate({
      path: "category",
      match: { active: true },
      select: "name",
    });

    return product;
  }

  async updateProductById(id, data) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    return product;
  }
=======
    async getProductById(id){
        const product = await Product.findOne({_id: id, active: true}).populate({
            path: 'category',
            match: {active: true},
            select: 'name'
        })

        return product
    }

    async deleteProductById(id){
        const product = await Product.findByIdAndUpdate(id, {active: false}, {new: true})
        return product
    }
>>>>>>> c989c36e4eb27b57dd9f9cecb70de75dcc8dd54c
}

const productRepository = new ProductRepository();
export default productRepository;
