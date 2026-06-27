import * as xlsx from 'xlsx'                      // librería para leer archivos Excel
import Product from '../models/product.model.js'   // modelo de producto en MongoDB
import Category from '../models/category.model.js' // modelo de categoría en MongoDB
import productRepository from '../repository/product.repository.js'

class ProductController {

  async getAllProducts(req,res){
    try{
      const allProducts = await productRepository.getAllProducts()

      if(!allProducts) return res.status(404).json({ message: 'Productos no encontrados' })

      return res.status(200).json(allProducts)
    }
    catch(error){
      return res.status(500).json({ message: error.message })
    }
  }





  // Recibe un archivo Excel y carga los productos en la base de datos.
  // Columnas requeridas: name, unit (kg | unit), category, price.
  async importFromExcel(req, res) {
    if (!req.file) {                                                                 // multer no encontró ningún archivo en el request
      return res.status(400).json({ message: 'No se recibió ningún archivo' })
    }

    // Lee el buffer en memoria sin escribir nada en disco
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })  // parsea el buffer como libro Excel
    const sheet = workbook.Sheets[workbook.SheetNames[0]]             // toma la primera hoja del libro
    const rows = xlsx.utils.sheet_to_json(sheet)                      // convierte la hoja a array de objetos usando la fila 1 como claves

    if (rows.length === 0) {                   // el archivo existe pero no tiene filas de datos
      return res.status(400).json({ message: 'El archivo está vacío o no tiene datos' })
    }

    const errors = []   // filas que fallaron la validación
    const toInsert = [] // documentos listos para insertar en MongoDB

    for (let i = 0; i < rows.length; i++) { //este for recorre todas las filas del excel
      const row = rows[i]           // fila actual como objeto { name, unit, category, price }
      const rowNum = i + 2          // +2 porque la fila 1 es el encabezado

      const name = String(row.name ?? '').trim()          // nombre del producto, sin espacios
      const unit = String(row.unit ?? '').trim().toLowerCase()  // unidad normalizada a minúsculas
      const categoryName = String(row.category ?? '').trim()    // nombre de la categoría como texto
      const price = Number(row.price)                           // precio convertido a número

      // Validaciones por fila — las inválidas se reportan pero no detienen el resto
      if (!name)         { errors.push(`Fila ${rowNum}: falta el nombre`);    continue } // campo vacío
      if (!categoryName) { errors.push(`Fila ${rowNum}: falta la categoría`); continue } // campo vacío
      if (!['kg', 'unit'].includes(unit)) {                                               // valor fuera del enum del modelo
        errors.push(`Fila ${rowNum}: unidad inválida "${unit}" (debe ser kg o unit)`)
        continue
      }
      if (isNaN(price) || price < 0) {          // no es número o es negativo
        errors.push(`Fila ${rowNum}: precio inválido`)
        continue
      }

      // Si la categoría no existe en la DB se crea automáticamente
      let category = await Category.findOne({ name: { $regex: `^${categoryName}$`, $options: 'i' } }) // búsqueda case-insensitive
      if (!category) {
        category = await Category.create({ name: categoryName }) // crea la categoría si no existe
      }

      toInsert.push({ name, unit, category: category._id, price }) // agrega el documento al lote
    }

    if (toInsert.length === 0) {  // todas las filas fallaron la validación
      return res.status(400).json({ message: errors })
    }

    // Inserción masiva en una sola operación
    const inserted = await Product.insertMany(toInsert) // inserta todos los documentos válidos de una vez

    return res.status(201).json({
      message: `Se importaron ${inserted.length} producto(s)`, // mensaje de éxito con cantidad
      inserted: inserted.length,                                // total de productos insertados
      errors,                                                   // filas que tuvieron errores (puede estar vacío)
    })
  }

}

export default new ProductController()
