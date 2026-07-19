import Product from "../models/product.model.js";

class ProductRepository {
  async getAllProducts() {
    const products = await Product.find({ active: true })
      .sort({ name: 1 })
      .collation({ locale: 'es' })
      .populate({
        path: "category",
        match: { active: true },
        select: "name",
      });

    return products.filter((p) => p.category !== null);
  }

  async deleteProductById(id) {
    const product = await Product.findByIdAndUpdate(
      id,
      { active: false },
      { returnDocument: 'after' },
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
    // populate de category para que la respuesta tenga { _id, name } y matchee el schema
    const product = await Product.findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .populate({ path: "category", select: "name" });
    return product;
  }
}

const productRepository = new ProductRepository();
export default productRepository;
