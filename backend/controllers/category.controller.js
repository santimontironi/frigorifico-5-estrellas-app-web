import categoryRepository from '../repository/category.repository.js'

class CategoryController {
    async getAllCategories(req,res){
        try{
            const allCategories = await categoryRepository.getAllCategories()

            if(!allCategories) return res.status(404).json({ message: 'Categorías no encontradas' })

            return res.status(200).json({ categories: allCategories })
        }
        catch(error){
            return res.status(500).json({ message: error.message })
        }
    }
}

const categoryController = new CategoryController()
export default categoryController