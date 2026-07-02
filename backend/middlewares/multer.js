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
