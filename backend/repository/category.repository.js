import Category from '../models/category.model.js'

class CategoryRepository {
    async getAllCategories() {
        return await Category.find({ active: true })
    }
}

const categoryRepository = new CategoryRepository()
export default categoryRepository