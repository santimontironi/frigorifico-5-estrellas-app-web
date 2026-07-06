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

    async deleteCategoryById(req,res){
        try{
            const { id } = req.params

            const categoryToDelete = await categoryRepository.getCategoryById(id)

            if(!categoryToDelete) return res.status(404).json({ message: 'Categoría no encontrada' })

            await categoryRepository.deleteCategoryById(id)

            return res.status(200).json({ message: 'Categoría eliminada correctamente', category: categoryToDelete })
        }
        catch(error){
            return res.status(500).json({ message: error.message })
        }
    }
}

const categoryController = new CategoryController()
export default categoryController