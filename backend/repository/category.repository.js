import Category from '../models/category.model.js'

class CategoryRepository {
    async getAllCategories() {
        return await Category.find({ active: true })
    }

    async getCategoryById(id) {
        return await Category.find({ _id: id, active: true })
    }

    async deleteCategoryById(id) {
        return await Category.findByIdAndUpdate(id, { active: false }, { new: true })
    }
}

const categoryRepository = new CategoryRepository()
export default categoryRepository