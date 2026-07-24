import photoRepository from "../repository/photo.repository.js";
import cloudinary from "../config/cloudinary.config.js";

function uploadImageToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "photos" },
            (error, result) => {
                if (error) return reject(error);
                // Devolvemos url + publicId para poder borrar la imagen después.
                resolve({ url: result.secure_url, publicId: result.public_id });
            },
        );
        stream.end(buffer);
    });
}

class PhotoController {
    async createPhoto(req, res) {
        try {
            // La imagen es obligatoria: sin archivo no se crea nada.
            if (!req.file)
                return res.status(400).json({ message: "La imagen es obligatoria" });

            const { url, publicId } = await uploadImageToCloudinary(req.file.buffer);

            const newPhoto = await photoRepository.createPhoto({ image: url, publicId });

            return res.status(201).json({
                message: "Foto subida correctamente",
                photo: newPhoto,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllPhotos(req, res) {
        try {
            const allPhotos = await photoRepository.getAllPhotos();
            return res.status(200).json({ photos: allPhotos });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deletePhoto(req, res) {
        try {
            const { id } = req.params;

            const deletedPhoto = await photoRepository.deletePhotoById(id);

            if (!deletedPhoto)
                return res.status(404).json({ message: "Foto no encontrada" });

            // Limpiamos también la imagen en Cloudinary para no dejar archivos huérfanos.
            if (deletedPhoto.publicId) {
                await cloudinary.uploader.destroy(deletedPhoto.publicId);
            }

            return res.status(200).json({
                message: "Foto eliminada correctamente",
                photo: deletedPhoto,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}

const photoController = new PhotoController();
export default photoController;
