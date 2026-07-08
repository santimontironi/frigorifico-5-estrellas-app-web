import multer from 'multer'

// El archivo se mantiene en memoria como Buffer — no se escribe en disco
const storage = multer.memoryStorage()

// Solo acepta archivos Excel (.xlsx y .xls)
const fileFilter = (req, file, cb) => {
  const allowed = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel',                                           // .xls
  ]
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false)
  }
}

// uploadExcel.single('file') — campo esperado en el FormData del frontend
export const uploadExcel = multer({ storage, fileFilter })

// Solo acepta imágenes (jpg, png, webp, etc.)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Solo se permiten imágenes'), false)
  }
}

// uploadImage.single('image') — campo esperado en el FormData del frontend.
// La imagen queda en memoria como Buffer (req.file.buffer) para subirla a Cloudinary.
export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo por imagen
})
