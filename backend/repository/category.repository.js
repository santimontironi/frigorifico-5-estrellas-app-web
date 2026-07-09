import Category from '../models/category.model.js'

class CategoryRepository {

    async createCategory(data) {
        return await Category.create(data)
    }

    async findCategoryByName(name) {
        return await Category.findOne({ name, active: true })
    }

    async getAllCategories() {
        return await Category.find({ active: true })
    }

    async getCategoryById(id) {
        return await Category.find({ _id: id, active: true })
    }

    async deleteCategoryById(id) {
        return await Category.findByIdAndUpdate(id, { active: false }, { returnDocument: 'after' })
    }
}

const categoryRepository = new CategoryRepository()
export default categoryRepository