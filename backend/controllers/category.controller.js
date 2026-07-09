import categoryRepository from '../repository/category.repository.js'

class CategoryController {

    async createCategory(req,res){
        try{
            const { name } = req.body

            const categoryRepeated = await categoryRepository.findCategoryByName(name)

            if(categoryRepeated) return res.status(400).json({ message: 'La categoría ya existe' })

            const newCategory = await categoryRepository.createCategory({ name })

            return res.status(201).json({ message: 'Categoría creada correctamente', category: newCategory })
        }
        catch(error){
            return res.status(500).json({ message: error.message })
        }
    }

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