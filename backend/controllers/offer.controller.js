import offerRepository from "../repository/offer.repository.js";
import productRepository from "../repository/product.repository.js";
import cloudinary from "../config/cloudinary.config.js";

function uploadImageToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "offers" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
            },
        );
        stream.end(buffer);
    });
}

class OfferController {
    async createOffer(req, res) {
        try {
            const { product, newPrice } = req.body;

            // El id que llega por body puede no corresponder a ningún producto real.
            const productFound = await productRepository.getProductById(product);

            if (!productFound)
                return res.status(404).json({ message: "Producto no encontrado" });

            const offerRepeated =
                await offerRepository.findActiveOfferByProduct(product);

            if (offerRepeated)
                return res
                    .status(400)
                    .json({ message: "Este producto ya tiene una oferta activa" });

            const data = { product, newPrice };

            // La imagen se sube DESPUÉS de validar: si algo falla antes,
            // no queda una imagen huérfana en Cloudinary.
            if (req.file) {
                data.image = await uploadImageToCloudinary(req.file.buffer);
            }

            const newOffer = await offerRepository.createOffer(data);

            return res.status(201).json({
                message: "Oferta creada correctamente",
                offer: newOffer,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async getAllOffers(req, res) {
        try {
            const allOffers = await offerRepository.getAllOffers();
            if (allOffers.length === 0)
                return res.status(404).json({ message: "No hay ofertas activas" });
            return res.status(200).json({ offers: allOffers });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    async deleteOffer(req, res) {
        try {
            const { id } = req.params;

            const deletedOffer = await offerRepository.deleteOfferById(id);

            if (!deletedOffer)
                return res.status(404).json({ message: "Oferta no encontrada" });

            return res.status(200).json({
                message: "Oferta eliminada correctamente",
                offer: deletedOffer,
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

}

const offerController = new OfferController();
export default offerController;
