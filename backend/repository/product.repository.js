import productModel from "../models/product.model.js";

class ProductRepository{
    async getAllProducts(){
        const products = await productModel.find({active: true}).populate({
            path: 'category',
            match: {active: true},
            select: 'name'
        })

        return products.filter(p => p.category !== null)
    }
}

const productRepository = new ProductRepository()
export default productRepository